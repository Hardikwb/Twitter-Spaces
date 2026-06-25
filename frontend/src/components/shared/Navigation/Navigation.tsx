import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../http";
import { setAuth } from "../../../store/authSlice";
const Header = () => {
  const dispatch = useDispatch();
  const logoutUser = async () => {
    // req.clearCookie()
    try {
      await logout();
      console.log("Logout Successfull");
      dispatch(setAuth({ isAuth: false, user: {} }));
    } catch (error) {
      console.log("Error while logout ::", error);
    }
  };
  const brandStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "32px",
    display: "flex",
    alignItems: "center",
    marginTop: "20px",
  };
  const logoText = {
    marginLeft: "10px",
  };
  const { isAuth, user } = useSelector((state: any) => state.authSlice);
  return (
    <nav className={`${styles.navbar} container`}>
      <Link style={brandStyle} to="/">
        <img src="/images/logo.png" alt="logo" />
        <span style={logoText}>Spaces</span>
      </Link>
      {isAuth && (
        <div className={styles.navRight}>
          <h3>{user?.username}</h3>
          <Link to="/">
            <img
              className={styles.avatar}
              src={user.avatar ? user.avatar : "/images/monkey-avatar.png"}
              width="40"
              height="40"
              alt="avatar"
            />
          </Link>
          <button className={styles.logoutButton} onClick={logoutUser}>
            <img src="/images/logout.png" alt="logout" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Header;
