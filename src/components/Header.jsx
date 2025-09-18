import React from "react";
import "../styles/Header.css";

// 1. Accept the onLogout function as a prop
function Header({ onLogout }) {
  return (
    <header className="header">
      {/* Top row: logo + title */}
      <div className="header-top">
        <div className="logo-title">
          {/* It's better practice to import images so React's bundler can handle them */}
          <img src="../images/weblogo.png" alt="logo" className="logo" style={{height: "90px", width: "90px"}} />
          <h1 className="site-title">Van Adhaar</h1>
        </div>
      </div>

      {/* Bottom row: username + logout */}
      <div className="header-bottom">
        <div className="user-actions">
          <span className="user-name">Welcome, User</span>
          
          {/* 2. Call the onLogout function when the button is clicked */}
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;