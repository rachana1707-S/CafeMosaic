import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";

export default function CoffeeShopDetails() {
  const { coffeeShopId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const [coffeeShop, setCoffeeShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: "",
    review: "",
    coffeeQuality: "",
    ambiance: ""
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchCoffeeShopDetails = async () => {
      try {
        // Fetch coffee shop details
        const shopRes = await fetch(`${import.meta.env.VITE_API_URL}/api/coffee-shops/${coffeeShopId}`, {
          credentials: "include",
        });
        const shopData = await shopRes.json();
        setCoffeeShop(shopData);

        // Fetch reviews for this coffee shop
        const reviewsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/coffee-shops/${coffeeShopId}/reviews`, {
          credentials: "include",
        });
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching coffee shop details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoffeeShopDetails();
  }, [coffeeShopId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!newReview.rating || !newReview.review) {
      alert("Rating and review are required.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newReview,
          coffeeShopId: coffeeShopId,
          coffeeshopName: coffeeShop.name,
          rating: Number(newReview.rating),
          coffeeQuality: newReview.coffeeQuality ? Number(newReview.coffeeQuality) : null,
          ambiance: newReview.ambiance ? Number(newReview.ambiance) : null,
        }),
      });

      if (res.ok) {
        const reviewData = await res.json();
        setReviews([reviewData, ...reviews]);
        setNewReview({
          rating: "",
          review: "",
          coffeeQuality: "",
          ambiance: ""
        });
        setShowReviewForm(false);
        alert("Review added successfully!");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to add review.");
      }
    } catch (error) {
      alert("Error adding review. Try again.");
    }
  };

  const renderStars = (rating) => {
    if (!rating) return "Not rated";
    return "⭐".repeat(rating) + "☆".repeat(5 - rating) + ` (${rating}/5)`;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const ensureHttp = (url) =>
    url?.startsWith("http://") || url?.startsWith("https://") ? url : `https://${url}`;

  if (loading) return <div className="text-center mt-5">Loading coffee shop details...</div>;
  if (!coffeeShop) return <div className="text-center mt-5">Coffee shop not found.</div>;

  return (
    <div className="container mt-4" style={{ paddingTop: "60px" }}>
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Coffee Shop Header */}
      <div className="coffee-shop-header mb-4" style={{
        padding: "30px", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "12px", 
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
      }}>
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="mb-2" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
              {coffeeShop.name}
            </h1>
            <div className="d-flex align-items-center mb-2">
              <span className="fs-4 me-3">{renderStars(Math.round(getAverageRating()))}</span>
              <span className="text-muted">({reviews.length} reviews)</span>
            </div>
            {coffeeShop.address && (
              <p className="mb-2"><strong>📍 Address:</strong> {coffeeShop.address}</p>
            )}
            {coffeeShop.phone && (
              <p className="mb-2"><strong>📞 Phone:</strong> {coffeeShop.phone}</p>
            )}
          </div>
          <div className="col-md-4 text-end">
            {user && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? "Cancel Review" : "Write a Review"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Coffee Shop Details */}
      <div className="content-box mb-4" style={{
        padding: "25px", 
        backgroundColor: "#ffffff", 
        borderRadius: "12px", 
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
      }}>
        <div className="row">
          <div className="col-md-8">
            {coffeeShop.description && (
              <div className="mb-3">
                <h5>About this coffee shop</h5>
                <p>{coffeeShop.description}</p>
              </div>
            )}

            {coffeeShop.hours && (
              <p><strong>🕐 Hours:</strong> {coffeeShop.hours}</p>
            )}

            {coffeeShop.category && (
              <p><strong>📌 Category:</strong> {coffeeShop.category}</p>
            )}

            {coffeeShop.website && (
              <p><strong>🔗 Website:</strong> 
                <a href={ensureHttp(coffeeShop.website)} target="_blank" rel="noopener noreferrer" className="ms-2">
                  {coffeeShop.website}
                </a>
              </p>
            )}

            {(coffeeShop.latitude && coffeeShop.longitude) && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${coffeeShop.latitude},${coffeeShop.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-success"
              >
                📍 View on Google Maps
              </a>
            )}
          </div>

          <div className="col-md-4">
            {coffeeShop.image && (
              <img
                src={ensureHttp(coffeeShop.image)}
                alt={coffeeShop.name}
                className="img-fluid rounded"
                style={{
                  maxWidth: "100%",
                  height: "250px", 
                  objectFit: "cover",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && user && (
        <div className="review-form mb-4" style={{
          padding: "25px", 
          backgroundColor: "#f8f9fa", 
          borderRadius: "12px", 
          border: "2px solid #e9ecef"
        }}>
          <h4 className="mb-3">Write a Review</h4>
          <form onSubmit={handleReviewSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Overall Rating *</label>
                <select 
                  className="form-control" 
                  value={newReview.rating} 
                  onChange={(e) => setNewReview({...newReview, rating: e.target.value})}
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
                  className="form-control" 
                  value={newReview.coffeeQuality} 
                  onChange={(e) => setNewReview({...newReview, coffeeQuality: e.target.value})}
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
                  className="form-control" 
                  value={newReview.ambiance} 
                  onChange={(e) => setNewReview({...newReview, ambiance: e.target.value})}
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
              <label className="form-label">Your Review *</label>
              <textarea 
                className="form-control" 
                rows="4"
                value={newReview.review} 
                onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                placeholder="Share your experience at this coffee shop..."
                required 
              />
            </div>

            <button type="submit" className="btn btn-primary">Submit Review</button>
          </form>
        </div>
      )}

      {/* Reviews Section */}
      <div className="reviews-section">
        <h4 className="mb-4">Customer Reviews ({reviews.length})</h4>
        
        {reviews.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No reviews yet. Be the first to review this coffee shop!</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {reviews.map((review) => (
              <div className="col" key={review.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-0">{review.user?.username || "Anonymous"}</h6>
                      <small className="text-muted">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    
                    <div className="mb-2">
                      <span className="me-3">{renderStars(review.rating)}</span>
                    </div>

                    {(review.coffeeQuality || review.ambiance) && (
                      <div className="mb-2 small">
                        {review.coffeeQuality && (
                          <span className="me-3">☕ Quality: {renderStars(review.coffeeQuality)}</span>
                        )}
                        {review.ambiance && (
                          <span>🏮 Ambiance: {renderStars(review.ambiance)}</span>
                        )}
                      </div>
                    )}

                    <p className="card-text">{review.review}</p>

                    {user && review.userId === user.id && (
                      <div className="mt-2">
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => navigate(`/reviews/${review.id}/edit`)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => navigate(`/reviews/${review.id}`)}
                        >
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}