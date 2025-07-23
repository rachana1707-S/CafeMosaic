import React, { useState, useEffect } from 'react';
import { useAuthUser } from '../context/AuthContext';
import { useCoffeeShops } from '../context/CoffeeShopContext';
import { useNavigate } from 'react-router-dom';
import { Star, Coffee, Edit2, Trash2, MapPin, Calendar, ThumbsUp } from 'lucide-react';

export default function MyReviews() {
  const { user } = useAuthUser();
  const { reviews, loadUserReviews } = useCoffeeShops();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      if (user?.id) {
        await loadUserReviews();
      }
      setLoading(false);
    };
    
    fetchReviews();
  }, [user, loadUserReviews]);

  const handleEdit = (reviewId) => {
    navigate(`/reviews/edit/${reviewId}`);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await loadUserReviews(); // Refresh reviews
      } else {
        alert('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review');
    }
  };

  const handleViewCoffeeShop = (coffeeShopId) => {
    navigate(`/coffee-shops/${coffeeShopId}`);
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
          <Coffee size={48} className="text-warning mb-3 animate-pulse" />
          <p className="text-muted">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 d-flex align-items-center">
            <Star className="text-warning me-2" size={32} />
            My Coffee Shop Reviews
          </h2>
          <p className="text-muted mb-0">
            You've written {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button 
          className="btn btn-warning rounded-pill px-4 d-flex align-items-center"
          onClick={() => navigate('/search')}
        >
          <Coffee size={20} className="me-2" />
          Find Coffee Shops to Review
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-5">
          <Star size={64} className="text-muted mb-3" />
          <h4 className="text-muted mb-3">No reviews yet</h4>
          <p className="text-muted mb-4">
            Start exploring coffee shops and share your experiences with the community!
          </p>
          <button 
            className="btn btn-warning rounded-pill px-4"
            onClick={() => navigate('/search')}
          >
            <Coffee size={20} className="me-2" />
            Discover Coffee Shops
          </button>
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
                        />
                        <h6 
                          className="mt-2 mb-1 fw-bold text-truncate cursor-pointer"
                          onClick={() => handleViewCoffeeShop(review.coffeeShopId)}
                          style={{ cursor: 'pointer' }}
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
                          className="btn btn-outline-primary btn-sm rounded-pill"
                          onClick={() => handleEdit(review.id)}
                        >
                          <Edit2 size={14} className="me-1" />
                          Edit
                        </button>
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
                          <Coffee size={14} className="me-1" />
                          View Shop
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
                <Coffee className="text-warning mb-2" size={24} />
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
  );
}