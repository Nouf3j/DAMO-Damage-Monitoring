import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/download.svg";
import { FiMenu, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import "./Header.css";

const Header = ({ toggleSidebar, toggleButtonRef }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowDropdown(false);
    navigate("/login");
  };

  const handleAuthClick = () => {
    if (user) {
      setShowDropdown(!showDropdown);
    } else {
      navigate("/login");
    }
  };

  const handleCreateReportClick = () => {
    if (user) {
      navigate("/report1");
    } else {
      navigate("/login", { state: { from: "/report1" } });
    }
  };

  return (
    <header className="header-container">
      <div className="header-left">
        <div
          ref={toggleButtonRef}
          onClick={toggleSidebar}
          className="menu-button"
        >
          <FiMenu size={20} color="#354EAB" />
        </div>
        <img
          src={logo}
          alt="Logo"
          onClick={() => navigate("/")}
          className="logo"
        />
      </div>

      <div className="header-right">
        <button
          onClick={handleCreateReportClick}
          className={`action-button ${user ? "create-report-button" : "auth-button"}`}
          title={user ? "Create a new report" : "Please login to create reports"}
        >
          Create Report
        </button>
        
        <div className="dropdown-container">
          <button
            onClick={handleAuthClick}
            className={`action-button ${user ? "create-report-button" : "auth-button"}`}
          >
            <div className="button-content">
              {user ? (
                <>
                  <FiUser size={16} />
                  {user.name.split(" ")[0]}
                  <FiChevronDown size={16} />
                </>
              ) : (
                "Log In"
              )}
            </div>
          </button>

          {user && showDropdown && (
            <div className="dropdown-menu">
              <div className="user-email">
                {user.email}
              </div>
              <button
                onClick={() => {
                  navigate("/info");
                  setShowDropdown(false);
                }}
                className="dropdown-item"
              >
                <FiUser size={16} />
                My Account
              </button>
              <button
                onClick={handleLogout}
                className="dropdown-item logout-item"
              >
                <FiLogOut size={16} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;