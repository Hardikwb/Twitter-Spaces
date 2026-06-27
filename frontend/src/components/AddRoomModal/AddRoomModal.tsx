import { useState } from "react";
import Input from "../shared/Text-Input/Input";
import styles from "./AddRoomModal.module.css";
import RoomOption from "./RoomOption";
import { createROOM } from "../../http";
const AddRoomModal = ({ onClose }: { onClose: () => void }) => {
  const [topic, setTopic] = useState("");
  const [roomType, setRoomType] = useState("");
  const createRoom = async () => {
    await createROOM({ topic: topic, roomType: roomType, speakers: "" });
    onClose();
  };
  return (
    <div className={styles.modalMask}>
      <div className={styles.modalBody}>
        <button onClick={onClose} className={styles.closeButton}>
          <img src="/images/close.png" alt="close" />
        </button>
        <div className={styles.modalHeader}>
          <h3 className={styles.heading}>Enter the topic to be disscussed</h3>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            fullwidth={true}
          />
          <h2 className={styles.subHeading}>Room types</h2>
          <div className={styles.roomTypes}>
            <RoomOption
              buttonName="Open"
              image="globe"
              roomType={roomType}
              onClick={() => setRoomType("Open")}
            />
            <RoomOption
              buttonName="Social"
              image="social"
              roomType={roomType}
              onClick={() => setRoomType("Social")}
            />
            <RoomOption
              buttonName="Private"
              image="lock"
              roomType={roomType}
              onClick={() => setRoomType("Private")}
            />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <h2>Start a room, open to everyone</h2>
          <button onClick={createRoom} className={styles.footerButton}>
            <img src="/images/celebration.png" alt="celebration" />
            <span>Let's go</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
