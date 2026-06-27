import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRoom } from "../../http";
import Loader from "../../components/shared/Loader/Loader";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useSelector } from "react-redux";
import type { Room, Speaker } from "../../types/type";
import styles from "./RoomPage.module.css";
const RoomPage = () => {
  const { roomid } = useParams();
  if (!roomid) throw Error("No roomId in params");
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMute, setMute] = useState(true);
  const user = useSelector((state: any) => state.authSlice.user);
  const navigate = useNavigate();
  const { clients, provideRef, handleMute } = useWebRTC(roomid, user);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await getRoom(roomid);
        setRoom(response.data); // adjust based on your http util
      } catch (error) {
        console.log("Error fetching room::", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomid]);

  useEffect(() => {
    handleMute(isMute, user._id);
  }, [isMute]);

  const handManualLeave = () => {
    // navigate(-1)
    navigate("/rooms");
  };

  const handleMuteClick = (clientId: string) => {
    if (clientId !== user._id) {
      return;
    }
    setMute((prevMuteState) => !prevMuteState);
  };

  if (loading) return <Loader message="Loading Room" />;
  if (!room) return <div>Room not found</div>;

  {
    console.log("clients::", clients);
  }
  // {console.log(clients)}
  return (
    <div>
      <div className="container">
        {/* <button onClick={()=>handManualLeave} className={styles.goBack}> */}
        <button onClick={handManualLeave} className={styles.goBack}>
          <img src="/images/arrow-left.png" alt="arrow-left" />
          <span>All voice rooms</span>
        </button>
      </div>
      <div className={styles.clientsWrap}>
        <div className={styles.header}>
          {room && <h2 className={styles.topic}>{room.topic}</h2>}
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <img src="/images/palm.png" alt="palm-icon" />
            </button>
            <button
              onClick={() => handManualLeave()}
              className={styles.actionBtn}
            >
              <img src="/images/win.png" alt="win-icon" />
              <span>Leave quietly</span>
            </button>
          </div>
        </div>
        <div className={styles.clientsList}>
          {clients.map((client: Speaker) => {
            return (
              <div className={styles.client} key={client._id}>
                <div className={styles.userHead}>
                  <img
                    className={styles.userAvatar}
                    src={client.avatar}
                    alt=""
                  />
                  <audio
                    autoPlay
                    ref={(instance) => {
                      provideRef(instance, client._id);
                    }}
                  />
                  <button
                    onClick={() => handleMuteClick(client._id)}
                    className={styles.micBtn}
                  >
                    {client.muted ? (
                      <img
                        className={styles.mic}
                        src="/images/mic-mute.png"
                        alt="mic"
                      />
                    ) : (
                      <img
                        className={styles.micImg}
                        src="/images/mic.png"
                        alt="mic"
                      />
                    )}
                  </button>
                </div>
                <h4>{client.name}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
