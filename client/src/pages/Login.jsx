import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import logo from "../assets/logo-login.jpg";
import backgroundImage from "../assets/wallpaper.png";

export default function Login() {
  const { login } = useAuthUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const response = await login(username, password);
      if (response.ok) {
        navigate(from, { replace: true });
      } else {
        const data = await response.json();
        setError(data.message || "Invalid credentials");
      }
    } catch {
      setError("Error logging in. Please try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(6px)",
        paddingTop: "70px",
        paddingBottom: "30px",
      }}
    >
      <div
        className="container"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <div
          className="p-4 shadow"
          style={{
            background: "rgba(255, 255, 255, 0.5)",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: "black",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-3">
            <img
              src={logo}
              alt="Logo"
              className="img-fluid"
              style={{
                maxWidth: "100px",
                borderRadius: "10px",
              }}
            />
          </div>

          <h3 className="text-center mb-4">Login</h3>

          {error && <div className="alert alert-danger text-center">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                  borderRadius: "10px",
                  color: "black",
                  padding: "10px",
                }}
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(0, 0, 0, 0.2)",
                  borderRadius: "10px",
                  color: "black",
                  padding: "10px",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: "#0077b6",
                color: "white",
                width: "100%",
                borderRadius: "10px",
                padding: "10px",
                fontWeight: "bold",
                transition: "0.3s",
              }}
            >
              Login
            </button>
          </form>

          <div className="text-center mt-3">
            <p>
              New user?{" "}
              <Link
                to="/register"
                style={{
                  color: "#0077b6",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
