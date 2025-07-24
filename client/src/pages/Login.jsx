import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import { Coffee, User, Lock, Eye, EyeOff } from "lucide-react";
import backgroundImage from "../assets/coffee_register_bg.jpg"; // Coffee shop background

export default function Login() {
  const { login } = useAuthUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(username, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Invalid credentials");
      }
    } catch {
      setError("Error logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "80px",
        paddingBottom: "40px",
      }}
    >
      <div className="container" style={{ maxWidth: "450px" }}>
        <div
          className="card border-0 shadow-lg"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="card-body p-5">
            {/* Logo/Brand */}
            <div className="text-center mb-4">
              <div className="d-flex justify-content-center align-items-center mb-3">
                <Coffee className="text-warning me-2" size={48} />
                <h2 className="mb-0 fw-bold text-dark">CoffeeFinder</h2>
              </div>
              <p className="text-muted">Welcome back, coffee lover!</p>
            </div>

            <h3 className="text-center mb-4 fw-semibold">Sign In</h3>

            {error && (
              <div className="alert alert-danger border-0 rounded-3" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Username Field */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Username</label>
                <div className="input-group">
                  <span className="input-group-text border-0 bg-light">
                    <User className="text-muted" size={20} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-light"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      borderRadius: "0 12px 12px 0",
                      padding: "14px 16px",
                    }}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text border-0 bg-light">
                    <Lock className="text-muted" size={20} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control border-0 bg-light"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      padding: "14px 16px",
                    }}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn btn-light border-0"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ borderRadius: "0 12px 12px 0" }}
                  >
                    {showPassword ? (
                      <EyeOff className="text-muted" size={20} />
                    ) : (
                      <Eye className="text-muted" size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <div className="d-grid mb-4">
                <button
                  type="submit"
                  className="btn btn-warning btn-lg fw-semibold"
                  disabled={loading}
                  style={{
                    borderRadius: "12px",
                    padding: "14px 0",
                    background: "linear-gradient(45deg, #ffc107, #ff8f00)",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(255, 193, 7, 0.3)"
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Coffee size={20} className="me-2" />
                      Sign In
                    </>
                  )}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-center mb-3">
                <Link
                  to="/forgot-password"
                  className="text-muted text-decoration-none small"
                  style={{ transition: "color 0.2s" }}
                  onMouseEnter={(e) => e.target.style.color = "#ffc107"}
                  onMouseLeave={(e) => e.target.style.color = "#6c757d"}
                >
                  Forgot your password?
                </Link>
              </div>
            </form>

            {/* Register Link */}
            <div className="text-center pt-3 border-top">
              <p className="mb-0 text-muted">
                New to CoffeeFinder?{" "}
                <Link
                  to="/register"
                  className="text-warning fw-semibold text-decoration-none"
                  style={{ transition: "all 0.2s" }}
                >
                  Create an account
                </Link>
              </p>
            </div>

            {/* Social Login (Optional) */}
            <div className="text-center mt-4">
              <p className="text-muted small mb-3">Or continue with</p>
              <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-outline-secondary rounded-circle" style={{ width: "48px", height: "48px" }}>
                  <i className="fab fa-google"></i>
                </button>
                <button className="btn btn-outline-secondary rounded-circle" style={{ width: "48px", height: "48px" }}>
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button className="btn btn-outline-secondary rounded-circle" style={{ width: "48px", height: "48px" }}>
                  <i className="fab fa-apple"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Features */}
        <div className="text-center mt-4">
          <div className="d-flex justify-content-center flex-wrap gap-4">
            <span className="text-white small">
              <Coffee size={16} className="me-1" />
              Find Coffee Shops
            </span>
            <span className="text-white small">
              <i className="fas fa-heart me-1"></i>
              Save Favorites
            </span>
            <span className="text-white small">
              <i className="fas fa-star me-1"></i>
              Write Reviews
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}