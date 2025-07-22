/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useAuthUser } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { Star, Coffee, MessageCircle } from "lucide-react";

export default function AddReview() {
  const { user } = useAuthUser();
  const { coffeeShopId } = useParams();
  const navigate = useNavigate();
  
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [isRecommended, setIsRecommended] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Rating is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          coffeeShopId: parseInt(coffeeShopId),
          rating,
          title,
          comment,
          visitDate: visitDate || null,
          isRecommended
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess("Review added successfully!");
        setError("");
        // Redirect to coffee shop page after short delay
        setTimeout(() => {
          navigate(`/coffee-shops/${coffeeShopId}`);
        }, 1500);
      } else {
        setError(data.message || "Failed to add review.");
      }
    } catch (error) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <Coffee size={64} className="text-muted mb-3" />
        <h3>Please log in to add a review</h3>
        <p className="text-muted">You need to be logged in to share your coffee shop experience.</p>
        <button 
          className="btn btn-warning rounded-pill px-4"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0" style={{ borderRadius: "16px" }}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <Coffee className="text-warning mb-3" size={48} />
                <h2 className="card-title fw-bold">Share Your Experience</h2>
                <p className="text-muted">Help others discover great coffee shops!</p>
              </div>
              
              {error && (
                <div className="alert alert-danger border-0 rounded-3" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success border-0 rounded-3" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Rating */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Rating *</label>
                  <div className="d-flex justify-content-center gap-2 my-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={40}
                        className={`cursor-pointer transition-all ${
                          star <= rating 
                            ? 'text-warning' 
                            : 'text-muted'
                        }`}
                        fill={star <= rating ? 'currentColor' : 'none'}
                        onClick={() => handleRatingClick(star)}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (star <= rating) return;
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <small className="text-muted">
                      {rating === 1 && "Poor"}
                      {rating === 2 && "Fair"}
                      {rating === 3 && "Good"}
                      {rating === 4 && "Very Good"}
                      {rating === 5 && "Excellent"}
                    </small>
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label htmlFor="title" className="form-label fw-semibold">
                    <MessageCircle size={18} className="me-2" />
                    Review Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="form-control border-0 shadow-sm"
                    placeholder="e.g., Amazing coffee and cozy atmosphere!"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ borderRadius: "12px", padding: "12px 16px" }}
                  />
                </div>

                {/* Comment */}
                <div className="mb-4">
                  <label htmlFor="comment" className="form-label fw-semibold">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    className="form-control border-0 shadow-sm"
                    rows="4"
                    placeholder="Share your experience... What did you love about this coffee shop? How was the coffee, service, atmosphere?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ borderRadius: "12px", padding: "16px" }}
                  />
                  <small className="text-muted">
                    Help others know what to expect!
                  </small>
                </div>

                {/* Visit Date */}
                <div className="mb-4">
                  <label htmlFor="visitDate" className="form-label fw-semibold">
                    When did you visit?
                  </label>
                  <input
                    type="date"
                    id="visitDate"
                    className="form-control border-0 shadow-sm"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    style={{ borderRadius: "12px", padding: "12px 16px" }}
                  />
                </div>

                {/* Recommendation */}
                <div className="mb-5">
                  <div className="form-check d-flex align-items-center">
                    <input
                      type="checkbox"
                      id="isRecommended"
                      className="form-check-input me-3"
                      checked={isRecommended}
                      onChange={(e) => setIsRecommended(e.target.checked)}
                      style={{ transform: "scale(1.2)" }}
                    />
                    <label htmlFor="isRecommended" className="form-check-label fw-semibold">
                      <i className="fas fa-heart text-danger me-2"></i>
                      I recommend this coffee shop to others
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-warning btn-lg rounded-pill fw-semibold"
                    disabled={loading}
                    style={{ padding: "12px 0" }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Publishing Review...
                      </>
                    ) : (
                      <>
                        <Star size={20} className="me-2" />
                        Publish Review
                      </>
                    )}
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-light rounded-pill"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {/* Tips */}
              <div className="mt-4 p-3 bg-light rounded-3">
                <h6 className="fw-semibold mb-2">
                  <i className="fas fa-lightbulb text-warning me-2"></i>
                  Tips for a great review:
                </h6>
                <ul className="small text-muted mb-0 ps-3">
                  <li>Mention the coffee quality, service, and atmosphere</li>
                  <li>Include details about pricing and value</li>
                  <li>Note any special features (WiFi, outdoor seating, etc.)</li>
                  <li>Be honest and helpful for other coffee lovers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}