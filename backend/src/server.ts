import express from "express";
import cors from "cors";
import config from "./config/config.js";
import cookieParser from "cookie-parser";
import authRouter from "./route/auth.route.js";
import connectDB from "./services/db.js";
import roomRouter from "./route/room.route.js";
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

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.use("/api/auth", authRouter);
app.use("/api", roomRouter);

app.listen(PORT, () => {
  console.log(`App listening on ${DOMAIN}:${PORT}`);
});
