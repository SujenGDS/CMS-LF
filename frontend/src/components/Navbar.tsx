import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggedIn?: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setRefresh }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (setRefresh) {
      setRefresh((prev) => !prev);
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate(0);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/" onClick={handleClick}>
        Flare
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/home" onClick={handleClick}>
              Home <span className="visually-hidden">(current)</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/myPosts" onClick={handleClick}>
              My Posts
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/post" onClick={handleClick}>
              Post
            </Link>
          </li>
        </ul>
        <div
          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
          style={{ width: 36, height: 36, cursor: "pointer", marginRight: 12 }}
          onClick={() => navigate("/profile")}
          title="Profile"
        >
          <i className="bi bi-person-fill fs-5"></i>
        </div>

        {/* Logout button */}
        <button className="btn btn-outline-light" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
