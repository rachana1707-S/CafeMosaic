import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";

export default function ViewReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const { id } = useParams();
  const [reviewData, setReviewData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setReviewData(data);
        setEditFormData(data);
      } catch (err) {
        console.error("Failed to fetch review", err);
      }
    };

    if (!location.state) {
      fetchReview();
    } else {
      setReviewData(location.state);
      setEditFormData(location.state);
    }
  }, [location.state, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { coffeeshopName, rating, review } = editFormData;

    if (!coffeeshopName || !rating || !review) {
      alert('Coffee shop name, rating, and review are required.');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewData.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editFormData,
          rating: Number(editFormData.rating),
          coffeeQuality: editFormData.coffeeQuality ? Number(editFormData.coffeeQuality) : null,
          ambiance: editFormData.ambiance ? Number(editFormData.ambiance) : null,
        }),
      });

      if (res.ok) {
        const updatedReview = await res.json();
        setReviewData(updatedReview);
        setIsEditing(false);
        alert("Review updated successfully");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update review.");
      }
    } catch (error) {
      alert("Error updating review.");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this review?");
    if (!confirm) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewData.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        navigate("/my-reviews");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to delete review.");
      }
    } catch (error) {
      alert("Error deleting review.");
    }
  };

  const renderStars = (rating) => {
    if (!rating) return "Not rated";
    return "⭐".repeat(rating) + "☆".repeat(5 - rating) + ` (${rating}/5)`;
  };

  const ensureHttp = (url) =>
    url?.startsWith("http://") || url?.startsWith("https://") ? url : `https://${url}`;

  if (!reviewData) return <div className="text-center mt-5">Loading review...</div>;

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="card shadow-sm">
        {reviewData.imageUrl && (
          <img
            src={ensureHttp(reviewData.imageUrl)}
            alt="Coffee Shop"
            className="card-img-top"
            style={{ height: "300px", objectFit: "cover" }}
          />
        )}

        <div className="card-body">
          {!isEditing ? (
            <>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2 className="card-title mb-0">{reviewData.coffeeshopName}</h2>
                <div className="text-end">
                  <div className="fs-4">{renderStars(reviewData.rating)}</div>
                  <small className="text-muted">Overall Rating</small>
                </div>
              </div>

              {reviewData.location && (
                <p className="mb-2"><strong>📍 Location:</strong> {reviewData.location}</p>
              )}

              {reviewData.priceRange && (
                <p className="mb-2"><strong>💰 Price Range:</strong> {reviewData.priceRange}</p>
              )}

              <div className="row mb-3">
                {reviewData.coffeeQuality && (
                  <div className="col-md-6">
                    <strong>☕ Coffee Quality:</strong> {renderStars(reviewData.coffeeQuality)}
                  </div>
                )}
                {reviewData.ambiance && (
                  <div className="col-md-6">
                    <strong>🏮 Ambiance:</strong> {renderStars(reviewData.ambiance)}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <strong>📝 Review:</strong>
                <p className="mt-2 p-3 bg-light rounded">{reviewData.review}</p>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>📶 WiFi:</strong> {reviewData.wifiAvailable ? "✅ Available" : "❌ Not Available"}
                </div>
                <div className="col-md-6">
                  <strong>🐕 Pet Friendly:</strong> {reviewData.petFriendly ? "✅ Yes" : "❌ No"}
                </div>
              </div>

              {reviewData.website && (
                <p className="mb-3">
                  <strong>🔗 Website:</strong>{" "}
                  <a href={ensureHttp(reviewData.website)} target="_blank" rel="noreferrer">
                    {reviewData.website}
                  </a>
                </p>
              )}

              <div className="text-muted mb-3">
                <small>
                  Reviewed by: {reviewData.user?.username || "Anonymous"} • 
                  {reviewData.createdAt && ` ${new Date(reviewData.createdAt).toLocaleDateString()}`}
                </small>
              </div>

              {user && reviewData.userId === user.id && (
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-primary flex-fill" 
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Edit Review
                  </button>
                  <button 
                    className="btn btn-outline-danger flex-fill" 
                    onClick={handleDelete}
                  >
                    🗑️ Delete Review
                  </button>
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label">Coffee Shop Name *</label>
                <input 
                  type="text" 
                  name="coffeeshopName" 
                  className="form-control" 
                  value={editFormData.coffeeshopName || ""} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Location</label>
                <input 
                  type="text" 
                  name="location" 
                  className="form-control" 
                  value={editFormData.location || ""} 
                  onChange={handleChange} 
                />
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Overall Rating *</label>
                  <select 
                    name="rating" 
                    className="form-control" 
                    value={editFormData.rating || ""} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Select rating</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Coffee Quality</label>
                  <select 
                    name="coffeeQuality" 
                    className="form-control" 
                    value={editFormData.coffeeQuality || ""} 
                    onChange={handleChange}
                  >
                    <option value="">Select quality</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Ambiance</label>
                  <select 
                    name="ambiance" 
                    className="form-control" 
                    value={editFormData.ambiance || ""} 
                    onChange={handleChange}
                  >
                    <option value="">Select ambiance</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Review *</label>
                <textarea 
                  name="review" 
                  className="form-control" 
                  rows="4"
                  value={editFormData.review || ""} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Price Range</label>
                <select 
                  name="priceRange" 
                  className="form-control" 
                  value={editFormData.priceRange || ""} 
                  onChange={handleChange}
                >
                  <option value="">Select price range</option>
                  <option value="$">$ - Budget</option>
                  <option value="$$">$$ - Moderate</option>
                  <option value="$$$">$$$ - Expensive</option>
                  <option value="$$$$">$$$$ - Very Expensive</option>
                </select>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="wifiAvailable"
                      className="form-check-input"
                      checked={editFormData.wifiAvailable || false}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">WiFi Available</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="petFriendly"
                      className="form-check-input"
                      checked={editFormData.petFriendly || false}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Pet Friendly</label>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <input 
                  type="url" 
                  name="imageUrl" 
                  className="form-control" 
                  value={editFormData.imageUrl || ""} 
                  onChange={handleChange} 
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Website</label>
                <input 
                  type="url" 
                  name="website" 
                  className="form-control" 
                  value={editFormData.website || ""} 
                  onChange={handleChange} 
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success flex-fill">✅ Save Changes</button>
                <button 
                  type="button" 
                  className="btn btn-secondary flex-fill" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}