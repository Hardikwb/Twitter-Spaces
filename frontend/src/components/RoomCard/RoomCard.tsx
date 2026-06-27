import type { Room } from "../../types/type";
import styles from "./RoomCard.module.css";
import { useNavigate } from "react-router-dom";

// 1. Define strict TypeScript interfaces for your data

interface RoomCardProps {
  room: Room;
}

// 2. Pass the full 'room' object as the route state
const RoomCard = ({ room }: RoomCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        // Pass the room data inside the state object so the Room page has access to it immediately
        navigate(`/rooms/${room?._id}`, { state: { room } });
      }}
      className={styles.card}
    >
      <h3 className={styles.topic}>{room.topic}</h3>
      <div
        className={`${styles.speakers} ${
          room.speakers.length === 1 ? styles.singleSpeaker : ""
        }`}
      >
        <div className={styles.avatars}>
          {room.speakers.map((speaker) => (
            <img key={speaker._id} src={speaker.avatar} alt="speaker-avatar" />
          ))}
        </div>
        <div className={styles.names}>
          {room.speakers.map((speaker) => (
            <div key={speaker._id} className={styles.nameWrapper}>
              <span>{speaker.name}</span>
              <img src="/images/chat-bubble.png" alt="chat-bubble" />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.peopleCount}>
        <span>{room.totalPeople}</span>
        <img src="/images/user-icon.png" alt="user-icon" />
      </div>
    </div>
  );
};

export default RoomCard;
