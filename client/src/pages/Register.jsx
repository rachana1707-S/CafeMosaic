import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-login.jpg";
import backgroundImage from "../assets/wallpaper.png";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch {
      setError("Error registering. Please try again.");
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

          <h3 className="text-center mb-4">Create an Account</h3>

          {error && <div className="alert alert-danger text-center">{error}</div>}
          {success && <div className="alert alert-success text-center">{success}</div>}

          <form onSubmit={handleRegister}>
            {["username", "email", "password", "confirmPassword"].map((field, index) => (
              <div className="mb-3" key={index}>
                <input
                  type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                  name={field}
                  className="form-control"
                  placeholder={
                    field === "confirmPassword"
                      ? "Confirm Password"
                      : `Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`
                  }
                  value={formData[field]}
                  onChange={handleChange}
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                    color: "black",
                    padding: "10px",
                  }}
                />
              </div>
            ))}

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
              Register
            </button>
          </form>

          <div className="text-center mt-3">
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#0077b6",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
