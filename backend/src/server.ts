import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server, Socket } from "socket.io";
import config from "./config/config.js";
import authRouter from "./route/auth.route.js";
import connectDB from "./services/db.js";
import roomRouter from "./route/room.route.js";
import { ACTIONS } from "./actions.js";
import type { SocketUser, Speaker } from "./types/type.js";
const app = express();
const PORT = config.PORT;
const DOMAIN = config.DOMAIN;

connectDB();

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin) return callback(null, true);
    callback(null, true);
  },
  credentials: true,
};

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: `${config.DOMAIN}:${config.PORT}`,
    methods: ["GET", "POST"],
  },
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.use("/api/auth", authRouter);
app.use("/api", roomRouter);

// Sockets
const socketUserMap: Record<string, SocketUser> = {};

io.on("connection", (socket: Socket) => {
  console.log("New Connection", socket.id);
  console.log("total connected::", io.sockets.sockets.size); // ✅ how many sockets connected
  console.log("all rooms::", io.sockets.adapter.rooms);

  socket.on(ACTIONS.JOIN, async ({ roomId, user }) => {
    socketUserMap[socket.id] = user;
    await socket.join(roomId);

    // If already created room
    // offer create by user who want to jain
    const roomClients = Array.from(
      io.sockets.adapter.rooms.get(roomId) || [],
    ).filter((id) => id !== socket.id);
    // const roomClients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
    roomClients.forEach((clientId) => {
      // already joined clients
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });

      // who want to join => who create offer
      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMap[clientId],
      });
    });
  });

  // Charlie writes a letter → gives to postman → postman delivers to Alice
  //   RELAY_SDP           → Charlie sends TO server   (relay = please forward this)
  // SESSION_DESCRIPTION → server sends TO Alice     (here is the description)

  // Handle RelayIce or ice candidate
  // server listens on relay_ice
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, iceCandidate }) => {
    // sending data server to client name it as ice_candidate
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      iceCandidate,
    });
  });

  // client to server use relay
  //server to client => ice_candidate and
  // Handle RelaySDP (Session Description)
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    // server to client send here name as session description
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    });
  });


  socket.on(ACTIONS.MUTE,({roomId,userId}:{roomId:string,userId:string})=>{
      const roomClients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
      roomClients.map((clientId)=>{
        io.to(clientId).emit(ACTIONS.MUTE,{
          peerId:socket.id,
          userId
        })
      })
  })
  
  socket.on(ACTIONS.UNMUTE,({roomId,userId}:{roomId:string,userId:string})=>{
      const roomClients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
      roomClients.map((clientId)=>{
        io.to(clientId).emit(ACTIONS.UNMUTE,{
          peerId:socket.id,
          userId
        })
      })
  })

  
    socket.on(ACTIONS.MUTE_INFO, ({ userId, roomId, isMute }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            if (clientId !== socket.id) {
                console.log('mute info');
                io.to(clientId).emit(ACTIONS.MUTE_INFO, {
                    userId,
                    isMute,
                });
            }
        });
    });

  socket.on(ACTIONS.LEAVE, leaveRoom);

  async function leaveRoom() {
    const { rooms } = socket;
    Array.from(rooms).forEach((roomId) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      clients.forEach((clientId) => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMap[socket.id]?._id,
        });
      });
      socket.leave(roomId);
    });
    delete socketUserMap[socket.id];
  }

  socket.on("disconnect", async() => {
    await leaveRoom();
    console.log("Disconnected::", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`App listening on ${DOMAIN}:${PORT}`);
});
