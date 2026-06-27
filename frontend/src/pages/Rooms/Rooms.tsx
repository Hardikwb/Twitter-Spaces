import { useEffect, useState } from "react";
import RoomCard from "../../components/RoomCard/RoomCard";
import styles from "./Room.module.css";
import AddRoomModal from "../../components/AddRoomModal/AddRoomModal";
import { getAllRoom } from "../../http";
import type { Room } from "../../types/type";
const Rooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);

  function openModal() {
    setShowModal(true);
  }

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await getAllRoom();
      console.log("DATA::USEEFFECT::", data);
      setRooms(data);
    };
    fetchRooms();
  }, []);

  return (
    <>
      <div className="container">
        <div className={styles.roomsHeader}>
          <div className={styles.left}>
            <span className={styles.heading}>All voice rooms</span>
            <div className={styles.searchBox}>
              <img src="/images/search-icon.png" alt="search" />
              <input type="text" className={styles.searchInput} />
            </div>
          </div>
          <div className={styles.right}>
            <button onClick={openModal} className={styles.startRoomButton}>
              <img src="/images/add-room-icon.png" alt="add-room" />
              <span>Start a room</span>
            </button>
          </div>
        </div>
        <div className={styles.roomList}>
          {rooms.map((room: Room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      </div>
      {showModal && <AddRoomModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Rooms;
