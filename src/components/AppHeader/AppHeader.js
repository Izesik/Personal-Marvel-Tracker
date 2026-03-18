import React, { useEffect, useRef, useState } from "react";
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
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const mobileBreakpoint = 900;
  const menuId = "app-header-mobile-menu";
  const safeTitle = title ? String(title) : "Marvel Trackr";
  const titleInitial = safeTitle.trim().charAt(0).toUpperCase() || "M";
  const safeUserName = user?.name ? String(user.name) : "User";
  const userInitial = safeUserName.trim().charAt(0).toUpperCase() || "U";

  const handleMenuToggle = () => {
    setIsMenuOpen((open) => !open);
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

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handlePointerDown = (event) => {
      if (!menuRef.current || !menuButtonRef.current) {
        return;
      }

      if (
        menuRef.current.contains(event.target) ||
        menuButtonRef.current.contains(event.target)
      ) {
        return;
      }

      setIsMenuOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > mobileBreakpoint) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileBreakpoint]);

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <div className="app-title">
            <span className="title-icon" aria-hidden="true">
              {titleInitial}
            </span>
            <h1>{safeTitle}</h1>
          </div>
        </div>

        <nav className="header-nav" aria-label="Primary">
          <div className="nav-desktop">
            {user ? (
              <>
                {showAdminPanel && (
                  <button
                    className="nav-button admin"
                    onClick={handleAdminClick}
                    type="button"
                  >
                    <span className="button-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" focusable="false">
                        <path
                          d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Admin Panel
                  </button>
                )}
                <div className="user-info">
                  <span className="user-avatar" aria-hidden="true">
                    {userInitial}
                  </span>
                  <span className="user-name" title={safeUserName}>
                    {safeUserName}
                  </span>
                </div>
                <button
                  className="nav-button logout"
                  onClick={handleLogoutClick}
                  type="button"
                >
                  <span className="button-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path
                        d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 17l5-5-5-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 12H9"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  Logout
                </button>
              </>
            ) : (
              <button
                className="nav-button login"
                onClick={handleLoginClick}
                type="button"
              >
                <span className="button-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path
                      d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 17l5-5-5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 12H3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                Login
              </button>
            )}
          </div>

          <button
            className="mobile-menu-button"
            onClick={handleMenuToggle}
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            type="button"
            ref={menuButtonRef}
          >
            <span className={`hamburger ${isMenuOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </nav>

        <div
          className={`mobile-menu ${isMenuOpen ? "open" : ""}`}
          id={menuId}
          ref={menuRef}
          aria-label="Mobile navigation"
          aria-hidden={!isMenuOpen}
        >
          {user ? (
            <>
              <div className="mobile-user-info">
                <span className="user-avatar" aria-hidden="true">
                  {userInitial}
                </span>
                <span className="user-name" title={safeUserName}>
                  {safeUserName}
                </span>
              </div>
              {showAdminPanel && (
                <button
                  className="mobile-nav-button admin"
                  onClick={handleAdminClick}
                  type="button"
                >
                  <span className="button-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path
                        d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  Admin Panel
                </button>
              )}
              <button
                className="mobile-nav-button logout"
                onClick={handleLogoutClick}
                type="button"
              >
                <span className="button-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path
                      d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 17l5-5-5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 12H9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                Logout
              </button>
            </>
          ) : (
            <button
              className="mobile-nav-button login"
              onClick={handleLoginClick}
              type="button"
            >
              <span className="button-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path
                    d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 17l5-5-5-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 12H3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              Login
            </button>
          )}
        </div>
      </div>
      <div
        className={`mobile-menu-backdrop ${isMenuOpen ? "open" : ""}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      ></div>
    </header>
  );
};

export default AppHeader;
