import React from "react";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      {/* Top row: logo + title */}
      <div className="header-top">
        <div className="logo-title">
          <img src="../images/weblogo.png" alt="logo" className="logo" style={{height: "90px", width: "90px"}} />
          <h1 className="site-title">Van Adhaar</h1>
        </div>
      </div>

      {/* Bottom row: username + logout */}
      <div className="header-bottom">
        <div className="user-actions">
          <span className="user-name">Welcome, User</span>
          <button className="logout-btn">Logout</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
