import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaBars } from "react-icons/fa";
import "./StyleCss/header.css";
import chhayaLogo from "../../public/logo.jpg";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef();

  const handleProfile = () => {
    navigate("/profile");
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    setDropdownOpen(false);
  };

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="admin-logo">
          <img src={chhayaLogo} alt="chhaya" style={{ height: "30px", width: "100%" }} />
        </div>
        <button className="menu-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className="search-bar">
          <span className="Heading">Welcome Back Admin !!</span>
        </div>
      </div>

      <div className="navbar-right">
        <div
          className="user-profile"
          ref={profileRef}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <FaUserCircle className="user-avatar" />
          <span className="username">Admin</span>
          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-item" onClick={handleProfile}>
                👤 Profile
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
