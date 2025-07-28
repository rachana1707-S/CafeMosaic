import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import { User, Lock, Eye, EyeOff, Utensils } from "lucide-react";
import backgroundImage from "../assets/food_background.jpg"; // Your food background

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthUser();
  
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex align-items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "contain",
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f8f9fa",
        height: "100vh",
        paddingTop: "80px", // Space for navbar
        paddingBottom: "20px", // Space for footer
        overflow: "hidden", // Prevent scrolling
        boxSizing: "border-box"
      }}
    >
      {/* Main Container */}
      <div className="container-fluid h-100">
        <div className="row h-100 align-items-center">
          {/* Left side - Background space */}
          <div className="col-lg-6 d-none d-lg-block">
            {/* This space is for the background image */}
          </div>
          
          {/* Right side - Login Form */}
          <div className="col-lg-6 col-md-12 d-flex align-items-center justify-content-center">
            <div 
              className="card shadow-lg border-0"
              style={{ 
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                width: "100%",
                maxWidth: "400px"
              }}
            >
              <div className="card-body p-4">
                {/* Header */}
                <div className="text-center mb-3">
                  <div className="mb-2">
                    <Utensils size={36} style={{ color: "#FFD700" }} />
                  </div>
                  <h3 className="fw-bold mb-1">Welcome Back!</h3>
                  <p className="text-muted small">Sign in to your FoodSocial account</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger py-2" role="alert">
                    <small>{error}</small>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  {/* Username Field */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Username</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <User size={16} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        name="username"
                        className="form-control border-start-0"
                        placeholder="Enter username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ boxShadow: "none" }}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Lock size={16} className="text-muted" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control border-start-0 border-end-0"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ boxShadow: "none" }}
                      />
                      <button
                        type="button"
                        className="input-group-text bg-light border-start-0"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? (
                          <EyeOff size={16} className="text-muted" />
                        ) : (
                          <Eye size={16} className="text-muted" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn w-100 text-dark fw-bold py-2 mb-3"
                    disabled={loading}
                    style={{ 
                      backgroundColor: "#FFD700", 
                      border: "none",
                      borderRadius: "8px"
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  {/* Forgot Password */}
                  <div className="text-center mb-3">
                    <Link 
                      to="/forgot-password" 
                      className="text-decoration-none small"
                      style={{ color: "#FFD700" }}
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Register Link */}
                  <div className="text-center">
                    <span className="text-muted small">Don't have an account? </span>
                    <Link
                      to="/register"
                      className="text-decoration-none fw-semibold small"
                      style={{ color: "#FFD700" }}
                    >
                      Sign Up
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}