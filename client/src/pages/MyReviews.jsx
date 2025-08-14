import React, { useState, useEffect } from 'react';
import { useAuthUser } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Star, Trash2, MapPin, Calendar, ThumbsUp, Utensils } from 'lucide-react';

export default function MyReviews() {
  const { user, isAuthenticated } = useAuthUser();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    fetchMyReviews();
  }, [user, navigate, isAuthenticated]);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/reviews/my-reviews`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("My reviews loaded:", data);
        
        // Transform reviews to include coffee shop data
        const transformedReviews = (data.reviews || data || []).map(review => ({
          id: review.id,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          visitDate: review.visitDate,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
          isRecommended: review.isRecommended,
          coffeeShopId: review.coffeeShopId,
          coffeeShop: {
            id: review.coffeeShop?.id || review.coffeeShopId,
            name: review.coffeeShop?.name || 'Unknown Place',
            address: review.coffeeShop?.address || 'Address not available',
            city: review.coffeeShop?.city || 'Boston',
            state: review.coffeeShop?.state || 'MA',
            imageUrl: review.coffeeShop?.imageUrl || '/assets/cafe_placeholder.jpg',
            rating: review.coffeeShop?.rating || 4.0
          },
          user: {
            id: review.user?.id || review.userId,
            username: review.user?.username || user?.username
          }
        }));
        
        setReviews(transformedReviews);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to load reviews' }));
        setError(errorData.message || 'Failed to load reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        // Remove the deleted review from the local state
        setReviews(reviews.filter(review => review.id !== reviewId));
        alert('Review deleted successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete review' }));
        alert(errorData.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleViewCoffeeShop = (coffeeShopId) => {
    navigate(`/food-places/${coffeeShopId}`);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? "text-warning" : "text-muted"}
        fill={index < rating ? "currentColor" : "none"}
      />
    ));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <Star size={48} className="text-warning mb-3" />
          <p className="text-muted">Loading your reviews...</p>
          <div className="spinner-border" style={{ color: "#FFD700" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="text-center py-5">
            <Star size={64} className="text-danger mb-3" />
            <h4 className="text-danger mb-3">Error Loading Reviews</h4>
            <p className="text-muted mb-4">{error}</p>
            <button 
              className="btn text-dark fw-bold px-4"
              onClick={fetchMyReviews}
              style={{ backgroundColor: "#FFD700", border: "none" }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
      <div className="container">
        {/* Header */}
        <div className="mb-4">
          <div>
            <h2 className="mb-1 d-flex align-items-center">
              <Star className="text-warning me-2" size={32} />
              My Food Reviews
            </h2>
            <p className="text-muted mb-0">
              You've written {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-5">
            <Star size={64} className="text-muted mb-3" />
            <h4 className="text-muted mb-3">No reviews yet</h4>
            <p className="text-muted mb-4">
              You haven't written any reviews yet. When you do, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {reviews.map((review) => (
              <div key={review.id} className="col-12">
                <div 
                  className="card border-0 shadow-sm h-100"
                  style={{ borderRadius: "16px" }}
                >
                  <div className="card-body p-4">
                    <div className="row">
                      {/* Coffee Shop Info */}
                      <div className="col-md-3">
                        <div className="d-flex flex-column h-100">
                          <img
                            src={review.coffeeShop?.imageUrl || '/assets/cafe_placeholder.jpg'}
                            alt={review.coffeeShop?.name}
                            className="rounded-3"
                            style={{ 
                              width: "100%", 
                              height: "120px", 
                              objectFit: "cover" 
                            }}
                            onError={(e) => {
                              e.target.src = '/assets/cafe_placeholder.jpg';
                            }}
                          />
                          <h6 
                            className="mt-2 mb-1 fw-bold text-truncate cursor-pointer"
                            onClick={() => handleViewCoffeeShop(review.coffeeShopId)}
                            style={{ cursor: 'pointer' }}
                            title={review.coffeeShop?.name}
                          >
                            {review.coffeeShop?.name}
                          </h6>
                          <small className="text-muted d-flex align-items-center">
                            <MapPin size={12} className="me-1" />
                            {review.coffeeShop?.city}, {review.coffeeShop?.state}
                          </small>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="col-md-7">
                        <div className="d-flex align-items-center mb-2">
                          <div className="d-flex me-3">
                            {renderStars(review.rating)}
                          </div>
                          <span className="badge bg-light text-dark me-2">
                            {review.rating}/5
                          </span>
                          {review.isRecommended && (
                            <span className="badge bg-success">
                              <ThumbsUp size={12} className="me-1" />
                              Recommended
                            </span>
                          )}
                        </div>

                        {review.title && (
                          <h6 className="fw-semibold mb-2">{review.title}</h6>
                        )}

                        {review.comment && (
                          <p className="text-muted mb-2" style={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {review.comment}
                          </p>
                        )}

                        <div className="d-flex align-items-center text-muted small">
                          <Calendar size={14} className="me-1" />
                          <span className="me-3">
                            Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                          {review.visitDate && (
                            <span>
                              Visited on {new Date(review.visitDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-md-2">
                        <div className="d-flex flex-column gap-2 h-100 justify-content-center">
                          <button
                            className="btn btn-outline-danger btn-sm rounded-pill"
                            onClick={() => handleDelete(review.id)}
                          >
                            <Trash2 size={14} className="me-1" />
                            Delete
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm rounded-pill"
                            onClick={() => handleViewCoffeeShop(review.coffeeShopId)}
                          >
                            <Utensils size={14} className="me-1" />
                            View Place
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics */}
        {reviews.length > 0 && (
          <div className="row mt-5 pt-4 border-top">
            <div className="col-md-12">
              <h5 className="mb-3">Your Review Statistics</h5>
            </div>
            <div className="col-md-3 col-6 text-center mb-3">
              <div className="card border-0 bg-light">
                <div className="card-body">
                  <Star className="text-warning mb-2" size={24} />
                  <h6 className="fw-bold">{reviews.length}</h6>
                  <small className="text-muted">Total Reviews</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6 text-center mb-3">
              <div className="card border-0 bg-light">
                <div className="card-body">
                  <Utensils className="text-warning mb-2" size={24} />
                  <h6 className="fw-bold">
                    {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                  </h6>
                  <small className="text-muted">Average Rating</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6 text-center mb-3">
              <div className="card border-0 bg-light">
                <div className="card-body">
                  <ThumbsUp className="text-success mb-2" size={24} />
                  <h6 className="fw-bold">
                    {reviews.filter(r => r.isRecommended).length}
                  </h6>
                  <small className="text-muted">Recommended</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6 text-center mb-3">
              <div className="card border-0 bg-light">
                <div className="card-body">
                  <Calendar className="text-info mb-2" size={24} />
                  <h6 className="fw-bold">
                    {new Set(reviews.map(r => new Date(r.createdAt).getMonth())).size}
                  </h6>
                  <small className="text-muted">Active Months</small>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}