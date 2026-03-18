import { useState, useEffect } from "react";
import "./App.css";
import ComicListDesktop from "./components/ComicListDesktop";
import AppHeader from "./components/AppHeader/AppHeader";

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("mct_token");
    const savedUser = localStorage.getItem("mct_user");
    if (savedToken && savedUser && !isTokenExpired(savedToken)) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    } else {
      localStorage.removeItem("mct_token");
      localStorage.removeItem("mct_user");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.message || "Login failed");
        return;
      }
      const userData = { name: data.username || email };
      localStorage.setItem("mct_token", data.token);
      localStorage.setItem("mct_user", JSON.stringify(userData));
      setToken(data.token);
      setUser(userData);
      setShowLogin(false);
      setEmail("");
      setPassword("");
    } catch {
      setLoginError("Connection error — is the server running?");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mct_token");
    localStorage.removeItem("mct_user");
    setToken(null);
    setUser(null);
  };

  return (
    <div className="App">
      <AppHeader
        title="Marvel Trackr"
        user={user}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
      />
      <ComicListDesktop isOwner={!!user} token={token} />

      <footer className="App-footer">
        <p>Built on React. A Personal Marvel Comic Tracker.</p>
      </footer>

      {showLogin && (
        <div className="login-overlay" onClick={() => setShowLogin(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="login-close"
              onClick={() => setShowLogin(false)}
              aria-label="Close"
              type="button"
            >
              ✕
            </button>
            <h2 className="login-title">Sign In</h2>
            <form className="login-form" onSubmit={handleLogin}>
              <input
                className="login-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <input
                className="login-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {loginError && <p className="login-error">{loginError}</p>}
              <button
                className="login-submit"
                type="submit"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
