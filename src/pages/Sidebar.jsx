import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaFileAlt, FaUserCircle, FaClipboardList, FaSignOutAlt } from "react-icons/fa"; 
import { useState, useEffect, useCallback } from "react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    
    setIsLoggedIn(!!localStorage.getItem("user"));
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user"); 
    setIsLoggedIn(false);
    toggleSidebar();
    navigate("/login"); 
  }, [navigate, toggleSidebar]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "220px",
        backgroundColor: "#FDFDFD",
        boxShadow: isOpen ? "2px 0px 5px rgba(0, 0, 0, 0.1)" : "none",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease-in-out, opacity 0.2s ease-in-out",
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? "visible" : "hidden",
        zIndex: 1100, 
      }}
      className="side-bar"
    >
      
      <button
        onClick={toggleSidebar}
        style={{
          alignSelf: "flex-end",
          background: "none",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer",
          color: "#354EAB",
        }}
      >
        ✖
      </button>

      <ul style={{ listStyleType: "none", padding: 0, marginTop: "20px", flexGrow: 1 }}>
        <SidebarItem to="/" icon={<FaHome />} label="Home" toggleSidebar={toggleSidebar} />
        <SidebarItem to="/AboutDamo" icon={<FaFileAlt />} label="About Damo" toggleSidebar={toggleSidebar} />
        <SidebarItem to="/info" icon={<FaUserCircle />} label="Profile" toggleSidebar={toggleSidebar} />
        <SidebarItem to="/inquiry" icon={<FaClipboardList />} label="Report Inquiry" toggleSidebar={toggleSidebar} />
      </ul>

      
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            backgroundColor: "#E74C3C",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px",
            fontSize: "0.9rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <FaSignOutAlt /> Log Out
        </button>
      )}
    </div>
  );
};


const SidebarItem = ({ to, icon, label, toggleSidebar }) => (
  <li style={{ marginBottom: "10px" }}>
    <NavLink
      to={to}
      onClick={toggleSidebar}
      style={({ isActive }) => ({
        textDecoration: "none",
        color: isActive ? "#354EAB" : "#333",
        fontWeight: isActive ? "bold" : "normal",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        fontSize: "1rem",
        cursor: "pointer",
        borderRadius: "8px",
        transition: "0.2s",
        backgroundColor: isActive ? "#E5EAF5" : "transparent",
      })}
    >
      <span style={{ marginRight: "10px", fontSize: "1.2rem" }}>{icon}</span> {label}
    </NavLink>
  </li>
);

export default Sidebar;
