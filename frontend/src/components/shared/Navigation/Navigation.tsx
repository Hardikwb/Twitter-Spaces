import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
const Header = () => {
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
  return (
    <nav className={`container ${styles.navbar}`}>
      <Link to="/" style={brandStyle}>
        <img src="/images/logo.png" alt="logo" />
        <span style={logoText}>Spaces</span>
      </Link>
    </nav>
  );
};

export default Header;
