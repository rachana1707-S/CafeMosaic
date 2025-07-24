import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Coffee, User, MapPin, Calendar, ThumbsUp, Filter } from "lucide-react";

export default function BrowseReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      // Since we don't have a "get all reviews" endpoint, we'll simulate it
      // In a real app, you'd have an endpoint like /api/reviews/public
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/coffee-shops`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const coffeeShops = await response.json();
        const allReviews = [];
        
        // Collect all reviews from all coffee shops
        coffeeShops.forEach(shop => {
          if (shop.reviews) {
            shop.reviews.forEach(review => {
              allReviews.push({
                ...review,
                coffeeShop: {
                  id: shop.id,
                  name: shop.name,
                  address: shop.address,
                  city: shop.city,
                  state: shop.state,
                  imageUrl: shop.imageUrl
                }
              });
            });
          }
        });
        
        setReviews(allReviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCoffeeShop = (coffeeShopId) => {
    navigate(`/coffee-shops/${coffeeShopId}`);
  };

  const handleViewReviewer = (userId) => {
    navigate(`/users/${userId}/reviews`);
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

  const getFilteredAndSortedReviews = () => {
    let filtered = reviews.filter(review => {
      switch (filter) {
        case 'high-rated':
          return review.rating >= 4;
        case 'recent':
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return new Date(review.createdAt) > weekAgo;
        case 'recommended':
          return review.isRecommended;
        default:
          return true;
      }
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
  };

  const filteredReviews = getFilteredAndSortedReviews();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <Star size={48} className="text-warning mb-3 animate-pulse" />
          <p className="text-muted">Loading community reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="text-center mb-5">
        <Star className="text-warning mb-3" size={48} />
        <h1 className="fw-bold mb-3">Community Coffee Reviews</h1>
        <p className="lead text-muted">
          Discover what fellow coffee lovers are saying about local coffee shops
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="d-flex flex-wrap gap-2">
            <button
              className={`btn btn-sm rounded-pill ${filter === 'all' ? 'btn-warning' : 'btn-outline-secondary'}`}
              onClick={() => setFilter('all')}
            >
              All Reviews ({reviews.length})
            </button>
            <button
              className={`btn btn-sm rounded-pill ${filter === 'high-rated' ? 'btn-warning' : 'btn-outline-secondary'}`}
              onClick={() => setFilter('high-rated')}
            >
              <Star size={14} className="me-1" />
              High Rated (4-5 ⭐)
            </button>
            <button
              className={`btn btn-sm rounded-pill ${filter === 'recent' ? 'btn-warning' : 'btn-outline-secondary'}`}
              onClick={() => setFilter('recent')}
            >
              <Calendar size={14} className="me-1" />
              This Week
            </button>
            <button
              className={`btn btn-sm rounded-pill ${filter === 'recommended' ? 'btn-warning' : 'btn-outline-secondary'}`}
              onClick={() => setFilter('recommended')}
            >
              <ThumbsUp size={14} className="me-1" />
              Recommended
            </button>
          </div>
        </div>
        <div className="col-md-4">
          <select 
            className="form-select form-select-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating-high">Highest Rated</option>
            <option value="rating-low">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-5">
          <Star size={64} className="text-muted mb-3" />
          <h4 className="text-muted mb-3">No reviews found</h4>
          <p className="text-muted mb-4">
            Try adjusting your filters or be the first to write a review!
          </p>
          <button 
            className="btn btn-warning rounded-pill px-4"
            onClick={() => navigate('/search')}
          >
            <Coffee size={20} className="me-2" />
            Find Coffee Shops to Review
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="col-12">
              <div 
                className="card border-0 shadow-sm"
                style={{ borderRadius: "16px" }}
              >
                <div className="card-body p-4">
                  <div className="row">
                    {/* Coffee Shop Info */}
                    <div className="col-md-3">
                      <div 
                        className="cursor-pointer"
                        onClick={() => handleViewCoffeeShop(review.coffeeShop.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          src={review.coffeeShop.imageUrl || '/assets/cafe_placeholder.jpg'}
                          alt={review.coffeeShop.name}
                          className="rounded-3 w-100"
                          style={{ height: "120px", objectFit: "cover" }}
                        />
                        <h6 className="mt-2 mb-1 fw-bold text-truncate">
                          {review.coffeeShop.name}
                        </h6>
                        <small className="text-muted d-flex align-items-center">
                          <MapPin size={12} className="me-1" />
                          {review.coffeeShop.city}, {review.coffeeShop.state}
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
                        <p className="text-muted mb-3">
                          "{review.comment}"
                        </p>
                      )}

                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center text-muted small">
                          <Calendar size={14} className="me-1" />
                          {new Date(review.createdAt).toLocaleDateString()}
                          {review.visitDate && (
                            <span className="ms-3">
                              Visited: {new Date(review.visitDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Reviewer Info */}
                    <div className="col-md-2">
                      <div 
                        className="text-center cursor-pointer"
                        onClick={() => handleViewReviewer(review.userId)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div 
                          className="rounded-circle bg-warning d-flex align-items-center justify-content-center mb-2 mx-auto"
                          style={{ width: "48px", height: "48px" }}
                        >
                          <User size={24} className="text-white" />
                        </div>
                        <h6 className="small fw-semibold mb-1">
                          {review.user?.username || 'Anonymous'}
                        </h6>
                        <small className="text-muted">Reviewer</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination would go here in a real app */}
      {filteredReviews.length > 0 && (
        <div className="text-center mt-5">
          <p className="text-muted">
            Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* CTA Section */}
      <div className="text-center mt-5 pt-5 border-top">
        <h4 className="fw-bold mb-3">Share Your Coffee Experience</h4>
        <p className="text-muted mb-4">
          Help other coffee lovers discover great spots by writing your own reviews!
        </p>
        <button 
          className="btn btn-warning btn-lg rounded-pill px-5"
          onClick={() => navigate('/search')}
        >
          <Coffee size={20} className="me-2" />
          Find Coffee Shops to Review
        </button>
      </div>
    </div>
  );
}