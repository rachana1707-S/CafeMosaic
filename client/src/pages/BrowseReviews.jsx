/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import { 
  Star, 
  Utensils, 
  MapPin, 
  Calendar, 
  User, 
  Search,
  Plus,
  ThumbsUp,
  Eye,
  RefreshCw
} from "lucide-react";

export default function BrowseReviews() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthUser();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 12;

  // Food place images for reviews
  const foodImages = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=300&h=200&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop&auto=format&q=80',
  ];

  const getRandomFoodImage = () => foodImages[Math.floor(Math.random() * foodImages.length)];

  // Auto-refresh every 30 seconds to catch new reviews
  useEffect(() => {
    loadReviews();

    // Set up auto-refresh interval
    const interval = setInterval(() => {
      loadReviews(true); // Silent refresh
    }, 30000); // Refresh every 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Focus event listener to refresh when user comes back to tab
  useEffect(() => {
    const handleFocus = () => {
      loadReviews(true); // Silent refresh when user returns to page
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadReviews = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setRefreshing(true);
      
      // Load reviews from API
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/reviews`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Reviews loaded from API:", data);
        
        // Transform reviews to include coffee shop data
        const transformedReviews = (data.reviews || data || []).map(review => ({
          id: review.id,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          visitDate: review.visitDate,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
          helpfulCount: review.helpfulCount || 0,
          photos: review.photos || [],
          user: {
            id: review.user?.id || review.userId,
            username: review.user?.username || 'Anonymous',
            reviewCount: review.user?.reviewCount || 1
          },
          foodPlace: {
            id: review.coffeeShop?.id || review.coffeeShopId,
            name: review.coffeeShop?.name || 'Unknown Place',
            address: review.coffeeShop?.address || 'Address not available',
            category: review.coffeeShop?.category || 'catering.restaurant',
            imageUrl: review.coffeeShop?.imageUrl || getRandomFoodImage(),
            avgRating: review.coffeeShop?.rating || 4.0
          }
        }));

        setReviews(transformedReviews);
        console.log(`Loaded ${transformedReviews.length} reviews from API`);
        
      } else {
        console.error("Failed to load reviews, status:", response.status);
        setReviews([]);
      }
      
    } catch (error) {
      console.error("Error loading reviews:", error);
      setReviews([]);
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadReviews();
  };

  const handleMarkHelpful = async (reviewId) => {
    if (!isAuthenticated()) {
      alert("Please log in to mark reviews as helpful");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update helpful count locally
        setReviews(reviews.map(review => 
          review.id === reviewId 
            ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 }
            : review
        ));
      } else {
        console.error("Failed to mark as helpful");
        alert("Failed to mark as helpful. Please try again.");
      }
    } catch (error) {
      console.error("Error marking review as helpful:", error);
      alert("Error occurred. Please try again.");
    }
  };

  const getFilteredAndSortedReviews = () => {
    let filtered = reviews;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(review =>
        review.foodPlace?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by rating
    if (filterRating) {
      filtered = filtered.filter(review => review.rating >= parseInt(filterRating));
    }

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(review => 
        review.foodPlace?.category === filterCategory
      );
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest_rating':
          return b.rating - a.rating;
        case 'lowest_rating':
          return a.rating - b.rating;
        case 'most_helpful':
          return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const filteredReviews = getFilteredAndSortedReviews();
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, startIndex + reviewsPerPage);

  const renderStars = (rating) => {
    return (
      <div className="d-flex align-items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "text-warning" : "text-muted"}
            fill={star <= rating ? "currentColor" : "none"}
          />
        ))}
        <span className="ms-2 fw-semibold">{rating}</span>
      </div>
    );
  };

  const getCategoryBadgeColor = (category) => {
    const colors = {
      'catering.restaurant': 'bg-danger',
      'catering.cafe': 'bg-primary', 
      'catering.bar': 'bg-info',
      'catering.fast_food': 'bg-warning',
      'catering.ice_cream': 'bg-success',
      'catering.food_court': 'bg-secondary'
    };
    return colors[category] || 'bg-secondary';
  };

  const getCategoryName = (category) => {
    return category?.replace('catering.', '').replace('_', ' ').toUpperCase() || 'FOOD';
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Star size={64} style={{ color: "#FFD700" }} className="mb-3" />
          <h4 className="text-muted">Loading reviews...</h4>
          <div className="spinner-border" style={{ color: "#FFD700" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              <Star size={32} className="me-2" style={{ color: "#FFD700" }} />
              Food Reviews
            </h2>
            <p className="text-muted mb-0">
              Discover what fellow food lovers are saying about local restaurants, cafes, and eateries
            </p>
          </div>
          
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-secondary"
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh reviews"
            >
              <RefreshCw size={18} className={refreshing ? "spin" : ""} />
            </button>
            
            <button 
              className="btn text-dark fw-bold"
              onClick={() => navigate('/search-food-places')}
              style={{ backgroundColor: "#FFD700", border: "none" }}
            >
              <Plus size={18} className="me-2" />
              Write Review
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row g-3">
              {/* Search */}
              <div className="col-md-4">
                <label className="form-label small text-muted">Search Reviews</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Search size={16} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by restaurant, review, or keywords"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="col-md-2">
                <label className="form-label small text-muted">Min Rating</label>
                <select
                  className="form-select"
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                >
                  <option value="">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="col-md-3">
                <label className="form-label small text-muted">Category</label>
                <select
                  className="form-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="catering.restaurant">Restaurants</option>
                  <option value="catering.cafe">Cafes</option>
                  <option value="catering.bar">Bars</option>
                  <option value="catering.fast_food">Fast Food</option>
                  <option value="catering.ice_cream">Ice Cream</option>
                  <option value="catering.food_court">Food Courts</option>
                </select>
              </div>

              {/* Sort */}
              <div className="col-md-3">
                <label className="form-label small text-muted">Sort By</label>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest_rating">Highest Rating</option>
                  <option value="lowest_rating">Lowest Rating</option>
                  <option value="most_helpful">Most Helpful</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-5">
            <Star size={64} className="text-muted mb-4" />
            <h4 className="text-muted mb-3">No Reviews Found</h4>
            <p className="text-muted mb-4">
              {searchQuery || filterRating || filterCategory
                ? "Try adjusting your search or filter criteria."
                : "Be the first to write a review!"
              }
            </p>
            <button 
              className="btn text-dark fw-bold px-4"
              onClick={() => navigate('/search-food-places')}
              style={{ backgroundColor: "#FFD700", border: "none" }}
            >
              Write First Review
            </button>
          </div>
        ) : (
          <>
            <div className="row g-4 mb-4">
              {currentReviews.map((review) => (
                <div key={review.id} className="col-lg-6 col-xl-4">
                  <div 
                    className="card h-100 border-0 shadow-sm"
                    style={{ 
                      borderRadius: '16px',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }}
                  >
                    {/* Review Header */}
                    <div className="card-header border-0 bg-white" style={{ borderRadius: '16px 16px 0 0' }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            {renderStars(review.rating)}
                            <span 
                              className={`badge ms-auto ${getCategoryBadgeColor(review.foodPlace?.category)} text-white`}
                              style={{ fontSize: '0.7rem' }}
                            >
                              {getCategoryName(review.foodPlace?.category)}
                            </span>
                          </div>
                          <h6 className="fw-bold mb-1">{review.title || `Review for ${review.foodPlace?.name || 'Restaurant'}`}</h6>
                        </div>
                      </div>
                    </div>

                    {/* Food Place Info */}
                    <div className="px-3 pb-2">
                      <div 
                        className="d-flex align-items-center p-2 bg-light rounded cursor-pointer"
                        onClick={() => navigate(`/food-places/${review.foodPlace?.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          src={review.foodPlace?.imageUrl || getRandomFoodImage()}
                          alt={review.foodPlace?.name || 'Restaurant'}
                          className="rounded me-3"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = getRandomFoodImage();
                          }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">{review.foodPlace?.name || 'Restaurant'}</h6>
                          <p className="small text-muted mb-0">
                            <MapPin size={12} className="me-1" />
                            {review.foodPlace?.address || 'Address not available'}
                          </p>
                        </div>
                        <div className="text-end">
                          <div className="small fw-semibold">⭐ {review.foodPlace?.avgRating || 'N/A'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="card-body pt-2">
                      <p className="card-text mb-3">
                        {review.comment && review.comment.length > 150 
                          ? `${review.comment.substring(0, 150)}...` 
                          : review.comment || 'No comment provided'
                        }
                      </p>

                      {/* Review Photos */}
                      {review.photos && review.photos.length > 0 && (
                        <div className="mb-3">
                          <div className="d-flex gap-2">
                            {review.photos.slice(0, 3).map((photo, index) => (
                              <img
                                key={index}
                                src={photo}
                                alt="Review photo"
                                className="rounded"
                                style={{ 
                                  width: '60px', 
                                  height: '60px', 
                                  objectFit: 'cover',
                                  cursor: 'pointer'
                                }}
                                onClick={() => window.open(photo, '_blank')}
                              />
                            ))}
                            {review.photos.length > 3 && (
                              <div 
                                className="d-flex align-items-center justify-content-center bg-light rounded text-muted"
                                style={{ width: '60px', height: '60px', fontSize: '0.8rem' }}
                              >
                                +{review.photos.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Review Meta */}
                      <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
                        <div className="d-flex align-items-center">
                          <User size={14} className="me-1" />
                          <span className="fw-semibold">{review.user?.username || 'Anonymous'}</span>
                          <span className="ms-1">({review.user?.reviewCount || 1} reviews)</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <Calendar size={14} className="me-1" />
                          {review.visitDate ? new Date(review.visitDate).toLocaleDateString() : new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Review Actions */}
                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                          onClick={() => handleMarkHelpful(review.id)}
                        >
                          <ThumbsUp size={14} className="me-1" />
                          Helpful ({review.helpfulCount || 0})
                        </button>

                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => navigate(`/reviews/${review.id}`)}
                          >
                            <Eye size={14} className="me-1" />
                            Read Full
                          </button>
                          
                          <button 
                            className="btn btn-sm text-dark"
                            onClick={() => navigate(`/food-places/${review.foodPlace?.id}`)}
                            style={{ backgroundColor: "#FFD700", border: "none" }}
                          >
                            <Utensils size={14} className="me-1" />
                            Visit Place
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(index + 1)}
                          style={{
                            backgroundColor: currentPage === index + 1 ? '#FFD700' : 'transparent',
                            borderColor: currentPage === index + 1 ? '#FFD700' : '#dee2e6',
                            color: currentPage === index + 1 ? '#000' : '#6c757d'
                          }}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        <div className="mt-5 p-4 bg-light rounded">
          <div className="text-center">
            <h5 className="mb-3">Share Your Food Experience!</h5>
            <p className="text-muted mb-3">
              Help others discover amazing food places by sharing your honest reviews.
            </p>
            <button 
              className="btn text-dark fw-bold px-4"
              onClick={() => navigate('/search-food-places')}
              style={{ backgroundColor: "#FFD700", border: "none" }}
            >
              <Plus size={18} className="me-2" />
              Write Your Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}