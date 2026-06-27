import { useCallback, useEffect, useRef } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import freeice from "freeice";
import socketInit from "../socket";
import type { Socket } from "socket.io-client";
import type { Speaker } from "../types/type";
import { ACTIONS } from "../actions";

export const useWebRTC = (roomId: string, user: Speaker) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef<Record<string, HTMLAudioElement>>({});
  const connections = useRef<Record<string, RTCPeerConnection>>({});
  const localMediaStream = useRef<MediaStream>(null);
  const socketRef = useRef<Socket>(null);
  const clientsRef = useRef<Speaker[]>(null);

  // extra checks on client
  const addNewClient = useCallback(
    (newClient: Speaker, cb: CallableFunction) => {
      const lookingClient = clients.find(
        (client) => client._id == newClient._id,
      );
      if (lookingClient === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }
    },
    [clients, setClients],
  );

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  // handle user audio
  const provideRef = (instance: HTMLAudioElement | null, clientId: string) => {
    if (instance) {
      audioElements.current[clientId] = instance;
    }
  };

  // useEffect(() => {
  //   const handleRemoteSdp = async ({
  //     peerId,
  //     sessionDescription: remoteSessionDescription,
  //   }: any) => {
  //     connections.current[peerId].setRemoteDescription(
  //       new RTCSessionDescription(remoteSessionDescription),
  //     );
  //     // if session descr type offer create answer
  //     if (remoteSessionDescription.type === "offer") {
  //       const connection = connections.current[peerId];
  //       const answer = await connection.createAnswer();
  //       connection.setLocalDescription(answer);

  //       // send to another client
  //       socketRef.current?.emit(ACTIONS.RELAY_SDP, {
  //         peerId,
  //         remoteSessionDescription: answer,
  //       });
  //     }
  //   };

  //   socketRef.current?.on(ACTIONS.RELAY_SDP, handleRemoteSdp);
  //   return () => {
  //     socketRef.current?.off(ACTIONS.RELAY_SDP);
  //   };
  // }, []);

  useEffect(() => {
    const initChat = async () => {
      socketRef.current = socketInit();

      await captureMedia();

      addNewClient({ ...user, muted: true }, () => {
        const localAudioElement = audioElements.current[user._id];
        if (localAudioElement) {
          localAudioElement.volume = 0;
          localAudioElement.srcObject = localMediaStream.current;
        }
      });

      socketRef.current.on(ACTIONS.MUTE_INFO,({userId,isMute})=>{
          handleSetMute(isMute,userId);
      })
      socketRef.current.on(ACTIONS.ADD_PEER, handleNewPeer);
      socketRef.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
      socketRef.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
      socketRef.current.on(
        ACTIONS.SESSION_DESCRIPTION,
        handleSessionDescription,
      );
      socketRef.current.on(
        ACTIONS.MUTE,
        ({ peerId:_peerId, userId }: Record<string, string>) => {
          handleSetMute(true, userId);
        },
      );
      socketRef.current.on(
        ACTIONS.UNMUTE,
        ({ peerId:_peerId, userId }: Record<string, string>) => {
          handleSetMute(false, userId);
        },
      );

      socketRef.current.emit(ACTIONS.JOIN, { roomId, user });

      async function captureMedia() {
        try {
          localMediaStream.current = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          console.log("Audio Capture success::", localMediaStream.current);
        } catch (error) {
          console.log("Error Capturing Audio::", error);
        }
      }

      async function handleNewPeer({
        peerId,
        createOffer,
        user: remoteUser,
      }: {
        peerId: string;
        createOffer: boolean;
        user: Speaker;
      }) {
        if (connections.current) {
          if (peerId in connections.current) {
            console.warn(`Already connected with ${peerId} ${user._id}`);
          }

          // handle new connection
          connections.current[peerId] = new RTCPeerConnection({
            iceServers: freeice(),
          });

          connections.current[peerId].onicecandidate = (
            event: RTCPeerConnectionIceEvent,
          ) => {
            socketRef.current?.emit(ACTIONS.RELAY_ICE, {
              peerId,
              iceCandidate: event.candidate,
            });
          };

          // handle streams of a other user/remote user
          connections.current[peerId].ontrack = ({
            streams: [remoteStream],
          }) => {
            // addNewClient({...user},()=>{
            // remoteUser = user object   → the actual user data (permanent, from your database)

            addNewClient({ ...remoteUser, muted: true }, () => {
              const currentUser = clientsRef.current!.find(
                (client) => client._id === user._id,
              );
              if (currentUser) {
                socketRef.current!.emit(ACTIONS.MUTE_INFO, {
                  userId: user._id,
                  roomId,
                  isMute: currentUser.muted,
                });
              }
              if (audioElements.current[remoteUser._id]) {
                audioElements.current[remoteUser._id].srcObject = remoteStream;
                console.log("ADDING PEER DONE");
              } else {
                let settled = false;
                const interval = setInterval(() => {
                  if (audioElements.current[remoteUser._id]) {
                    audioElements.current[remoteUser._id].srcObject =
                      remoteStream;
                    settled = true;
                    console.log("ADDING PEER DONE");
                  }
                  if (settled) {
                    clearInterval(interval);
                  }
                }, 300);
              }
            });
          };

          // add local track to audio stream
          if (localMediaStream.current) {
            localMediaStream.current.getTracks().forEach((track) => {
              connections.current[peerId].addTrack(
                track,
                localMediaStream.current!,
              );
            });
          }

          // create offer if required
          if (createOffer) {
            const offer = await connections.current[peerId].createOffer();
            await connections.current[peerId].setLocalDescription(offer);
            socketRef.current?.emit(ACTIONS.RELAY_SDP, {
              peerId,
              sessionDescription: offer,
            });
          }
        }
      }

      async function handleRemovePeer({
        peerId,
        userId,
      }: {
        peerId: string;
        userId: string;
      }) {
        if (connections.current[peerId]) {
          connections.current[peerId].close();
        }
        delete connections.current[peerId];
        delete audioElements.current[peerId];

        setClients(
          (clients) => clients.filter((client) => client._id !== userId),
          () => {
            console.log("Peer remove successfully");
          },
        );
      }

      async function handleIceCandidate({
        peerId,
        iceCandidate,
      }: {
        peerId: string;
        iceCandidate: RTCIceCandidate;
      }) {
        if (iceCandidate) {
          connections.current[peerId].addIceCandidate(iceCandidate);
        }
      }

      async function handleSessionDescription({
        peerId,
        sessionDescription: remoteSessionDescription,
      }: {
        peerId: string;
        sessionDescription: any;
      }) {
        connections.current[peerId].setRemoteDescription(
          new RTCSessionDescription(remoteSessionDescription),
        );

        // If session descrition is offer then create an answer
        if (remoteSessionDescription.type === "offer") {
          const connection = connections.current[peerId];

          const answer = await connection.createAnswer();
          connection.setLocalDescription(answer);

          socketRef.current!.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: answer,
          });
        }
      }

      async function handleSetMute(mute: boolean, userId: string) {
        const clientIdx = clientsRef.current
          ?.map((client) => client._id)
          .indexOf(userId);
        const allConnectedClients = JSON.parse(
          JSON.stringify(clientsRef.current),
        );
        if (clientIdx !== undefined && clientIdx !== -1) {
          allConnectedClients[clientIdx].muted = mute;
          setClients(allConnectedClients, () => {
            console.log("Toggle mic successfully");
          });
        }
      }
    };

    initChat();

    return () => {
      localMediaStream.current?.getTracks().forEach((track) => track.stop());

      socketRef.current?.emit(ACTIONS.LEAVE, { roomId });

      for (let peerId in connections.current) {
        connections.current[peerId].close();
        delete connections.current[peerId];
        delete audioElements.current[peerId];
      }

      socketRef.current?.off(ACTIONS.ADD_PEER);
      socketRef.current?.off(ACTIONS.REMOVE_PEER);
      socketRef.current?.off(ACTIONS.ICE_CANDIDATE);
      socketRef.current?.off(ACTIONS.MUTE);
      socketRef.current?.off(ACTIONS.UNMUTE);
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  async function handleMute(isMute: boolean, userId: string) {
    let settled = false;
    if (userId == user._id) {
      const interval = setInterval(() => {
        if (localMediaStream.current) {
          localMediaStream.current.getTracks()[0].enabled = !isMute;
          settled = true;
          if (isMute) {
            socketRef.current!.emit(ACTIONS.MUTE, {
              roomId,
              userId: user._id,
            });
          } else {
            socketRef.current!.emit(ACTIONS.UNMUTE, {
              roomId,
              userId: user._id,
            });
          }
        }
        if (settled) {
          clearInterval(interval);
        }
      }, 200);
    }
  }

  return { clients, provideRef, handleMute };
};
