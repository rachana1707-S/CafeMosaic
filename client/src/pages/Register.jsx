import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import { Coffee, User, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import backgroundImage from "../assets/coffee_register_bg.jpg"; // Coffee shop background

export default function Register() {
  const { register } = useAuthUser();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return false;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        name: formData.name || null,
        password: formData.password,
        preferences: {
          unit: 'km',
          defaultRadius: 5,
          favoriteCategories: []
        }
      });

      if (result.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(result.error || "Registration failed.");
      } 
    } catch {
      setError("Error creating account. Please try again.");
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
      <div className="container" style={{ maxWidth: "500px" }}>
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
              <p className="text-muted">Join our community of coffee lovers!</p>
            </div>

            <h3 className="text-center mb-4 fw-semibold">Create Account</h3>

            {error && (
              <div className="alert alert-danger border-0 rounded-3" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success border-0 rounded-3" role="alert">
                <CheckCircle size={16} className="me-2" />
                {success}
              </div>
            )}

            <form onSubmit={handleRegister}>
              {/* Username Field */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Username <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text border-0 bg-light">
                    <User className="text-muted" size={20} />
                  </span>
                  <input
                    type="text"
                    name="username"
                    className="form-control border-0 bg-light"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                    style={{
                      borderRadius: "0 12px 12px 0",
                      padding: "12px 16px",
                    }}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Email <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text border-0 bg-light">
                    <Mail className="text-muted" size={20} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control border-0 bg-light"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      borderRadius: "0 12px 12px 0",
                      padding: "12px 16px",
                    }}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Name Field (Optional) */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text border-0 bg-light">
                    <User className="text-muted" size={20} />
                  </span>
                  <input
                    type="text"
                    name="name"
                    className="form-control border-0 bg-light"
                    placeholder="Your full name (optional)"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      borderRadius: "0 12px 12px 0",
                      padding: "12px 16px",
                    }}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Password <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text border-0 bg-light">
                    <Lock className="text-muted" size={20} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control border-0 bg-light"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ padding: "12px 16px" }}
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
                <small className="text-muted">At least 6 characters</small>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text border-0 bg-light">
                    <Lock className="text-muted" size={20} />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-control border-0 bg-light"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{ padding: "12px 16px" }}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn btn-light border-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ borderRadius: "0 12px 12px 0" }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="text-muted" size={20} />
                    ) : (
                      <Eye className="text-muted" size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="mb-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="terms"
                    required
                    style={{ transform: "scale(1.1)" }}
                  />
                  <label className="form-check-label small" htmlFor="terms">
                    I agree to the{" "}
                    <Link to="/terms" className="text-warning text-decoration-none">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-warning text-decoration-none">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              {/* Register Button */}
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Coffee size={20} className="me-2" />
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center pt-3 border-top">
              <p className="mb-0 text-muted">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-warning fw-semibold text-decoration-none"
                  style={{ transition: "all 0.2s" }}
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Preview */}
        <div className="text-center mt-4">
          <p className="text-white mb-2 small">Join CoffeeFinder and enjoy:</p>
          <div className="d-flex justify-content-center flex-wrap gap-4">
            <span className="text-white small">
              <i className="fas fa-search me-1"></i>
              Smart Coffee Shop Discovery
            </span>
            <span className="text-white small">
              <i className="fas fa-heart me-1"></i>
              Personal Favorites Lists
            </span>
            <span className="text-white small">
              <i className="fas fa-star me-1"></i>
              Review & Rating System
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}