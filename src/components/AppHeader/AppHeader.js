import React, { useState } from "react";
import "./AppHeader.css";

const AppHeader = ({
  title = "Marvel Trackr",
  user = null,
  onLogin = () => {},
  onLogout = () => {},
  onAdminPanel = () => {},
  showAdminPanel = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLoginClick = () => {
    onLogin();
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsMenuOpen(false);
  };

  const handleAdminClick = () => {
    onAdminPanel();
    setIsMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <div className="app-title">
            <span className="title-icon">⚡</span>
            <h1>{title}</h1>
          </div>
        </div>

        <nav className="header-nav">
          <div className="nav-desktop">
            {user ? (
              <>
                {showAdminPanel && (
                  <button
                    className="nav-button admin"
                    onClick={handleAdminClick}
                  >
                    <span className="button-icon">⚙️</span>
                    Admin Panel
                  </button>
                )}
                <div className="user-info">
                  <span className="user-avatar">👤</span>
                  <span className="user-name">{user.name || "User"}</span>
                </div>
                <button
                  className="nav-button logout"
                  onClick={handleLogoutClick}
                >
                  <span className="button-icon">🚪</span>
                  Logout
                </button>
              </>
            ) : (
              <button className="nav-button login" onClick={handleLoginClick}>
                <span className="button-icon">🔐</span>
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-button" onClick={handleMenuToggle}>
            <span className={`hamburger ${isMenuOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          {user ? (
            <>
              <div className="mobile-user-info">
                <span className="user-avatar">👤</span>
                <span className="user-name">{user.name || "User"}</span>
              </div>
              {showAdminPanel && (
                <button
                  className="mobile-nav-button admin"
                  onClick={handleAdminClick}
                >
                  <span className="button-icon">⚙️</span>
                  Admin Panel
                </button>
              )}
              <button
                className="mobile-nav-button logout"
                onClick={handleLogoutClick}
              >
                <span className="button-icon">🚪</span>
                Logout
              </button>
            </>
          ) : (
            <button
              className="mobile-nav-button login"
              onClick={handleLoginClick}
            >
              <span className="button-icon">🔐</span>
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
