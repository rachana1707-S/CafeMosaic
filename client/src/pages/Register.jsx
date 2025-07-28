import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight, ArrowLeft } from "lucide-react";
import backgroundImage from "../assets/food_backgroundd.avif"; // Your food background

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthUser();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(""); // Clear error when user types
  };

  const handleNext = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };
      const result = await register(userData);
      if (result.success) {
        // Redirect to login page with success message
        navigate("/login", { 
          state: { 
            message: "Registration successful! Please log in with your credentials.",
            type: "success"
          }
        });
      } else {
        setError(result.error || "Registration failed");
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
          
          {/* Right side - Register Form */}
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
                <div className="text-center mb-4">
                  <div className="mb-2">
                    <UserPlus size={36} style={{ color: "#FFD700" }} />
                  </div>
                  <h3 className="fw-bold mb-1">Join FoodSocial!</h3>
                  <p className="text-muted small">
                    {currentStep === 1 
                      ? "Let's start with your basic info" 
                      : "Create your secure password"
                    }
                  </p>
                  
                  {/* Step indicator */}
                  <div className="d-flex justify-content-center mt-3">
                    <div className="d-flex align-items-center">
                      <div 
                        className={`rounded-circle ${currentStep === 1 ? 'bg-warning' : 'bg-success'}`}
                        style={{ width: "8px", height: "8px" }}
                      ></div>
                      <div 
                        className="mx-2"
                        style={{ 
                          width: "30px", 
                          height: "2px", 
                          backgroundColor: currentStep === 2 ? "#FFD700" : "#dee2e6" 
                        }}
                      ></div>
                      <div 
                        className={`rounded-circle ${currentStep === 2 ? 'bg-warning' : 'bg-secondary'}`}
                        style={{ width: "8px", height: "8px" }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger py-2 mb-3" role="alert">
                    <small>{error}</small>
                  </div>
                )}

                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <form onSubmit={handleNext}>
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
                          placeholder="Choose username"
                          value={formData.username}
                          onChange={handleChange}
                          required
                          style={{ boxShadow: "none" }}
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold small">Email</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Mail size={16} className="text-muted" />
                        </span>
                        <input
                          type="email"
                          name="email"
                          className="form-control border-start-0"
                          placeholder="Enter email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={{ boxShadow: "none" }}
                        />
                      </div>
                    </div>

                    {/* Next Button */}
                    <button
                      type="submit"
                      className="btn w-100 text-dark fw-bold py-2 mb-3"
                      style={{ 
                        backgroundColor: "#FFD700", 
                        border: "none",
                        borderRadius: "8px"
                      }}
                    >
                      Next Step
                      <ArrowRight size={16} className="ms-1" />
                    </button>

                    {/* Login Link */}
                    <div className="text-center">
                      <span className="text-muted small">Already have an account? </span>
                      <Link
                        to="/login"
                        className="text-decoration-none fw-semibold small"
                        style={{ color: "#FFD700" }}
                      >
                        Sign In
                      </Link>
                    </div>
                  </form>
                )}

                {/* Step 2: Password */}
                {currentStep === 2 && (
                  <form onSubmit={handleSubmit}>
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
                          placeholder="Create password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength={6}
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

                    {/* Confirm Password Field */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold small">Confirm Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Lock size={16} className="text-muted" />
                        </span>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          className="form-control border-start-0 border-end-0"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          style={{ boxShadow: "none" }}
                        />
                        <button
                          type="button"
                          className="input-group-text bg-light border-start-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={16} className="text-muted" />
                          ) : (
                            <Eye size={16} className="text-muted" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Register Button */}
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
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </button>

                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn btn-outline-secondary w-100 mb-3"
                      style={{ borderRadius: "8px" }}
                    >
                      <ArrowLeft size={16} className="me-1" />
                      Back
                    </button>

                    {/* Login Link */}
                    <div className="text-center">
                      <span className="text-muted small">Already have an account? </span>
                      <Link
                        to="/login"
                        className="text-decoration-none fw-semibold small"
                        style={{ color: "#FFD700" }}
                      >
                        Sign In
                      </Link>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}