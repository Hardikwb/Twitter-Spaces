import styles from "./AddRoomModal.module.css";
const RoomType = ({
  buttonName,
  image,
  onClick,
  roomType,
}: {
  buttonName: string;
  image: string;
  onClick: () => void;
  roomType: string;
}) => {
  return (
    <>
      <div
        onClick={onClick}
        className={`${styles.typeBox} ${roomType === buttonName ? styles.active : ""} `}
      >
        {/* <div
            onClick={onClick}
            style={{
                ...typeBox,
                ...(roomType === buttonName ? active : {}),
            }}
            > */}
        <img src={`/images/${image}.png`} alt={`${image}`} />
        <span>{buttonName}</span>
      </div>
    </>
  );
};

export default RoomType;
