/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import { 
  Star, 
  Utensils, 
  MapPin, 
  Search, 
  Camera,
  Calendar,
  Type,
  MessageSquare,
  Save,
  ArrowLeft
} from "lucide-react";

export default function AddReview() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthUser();
  const [searchParams] = useSearchParams();
  
  const [step, setStep] = useState(1); // 1: Select Place, 2: Write Review
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Review form data
  const [reviewData, setReviewData] = useState({
    rating: 0,
    title: "",
    comment: "",
    visitDate: "",
    photos: [],
    wouldRecommend: true
  });

  // Temporary hover rating for star display
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Please log in to write a review");
      navigate("/login");
      return;
    }

    // Check if a specific place was passed via URL params
    const placeId = searchParams.get('place');
    if (placeId) {
      // Load the specific place and skip to step 2
      loadSpecificPlace(placeId);
    }
  }, [isAuthenticated, searchParams]);

  const loadSpecificPlace = async (placeId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/coffee-shops/${placeId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const place = await response.json();
        setSelectedPlace(place);
        setStep(2);
      } else {
        console.error("Failed to load place:", response.status);
        alert("Failed to load place details");
      }
    } catch (error) {
      console.error("Error loading place:", error);
      alert("Error loading place details");
    }
  };

  const searchPlaces = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const params = new URLSearchParams({
        location: 'Boston, MA', // You can make this dynamic based on user location
        categories: 'catering.restaurant,catering.cafe,catering.bar,catering.fast_food,catering.ice_cream,catering.food_court',
        distance: '20',
        limit: '20'
      });

      // Add search query to filter results
      if (searchQuery.trim()) {
        params.append('query', searchQuery.trim());
      }

      const response = await fetch(`${apiUrl}/api/search?${params}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        let places = data.coffeeShops || data.places || [];
        
        // Additional client-side filtering by search query if not handled by API
        if (searchQuery && places.length > 0) {
          places = places.filter(place => 
            place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            place.address.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setSearchResults(places);
        console.log("Search results:", places);
      } else {
        console.error("Search failed:", response.status);
        setSearchResults([]);
      }
      
    } catch (error) {
      console.error("Error searching places:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setStep(2);
  };

  const handleRatingClick = (rating, type = 'rating') => {
    setReviewData(prev => ({
      ...prev,
      [type]: rating
    }));
  };

  const handleInputChange = (field, value) => {
    setReviewData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd upload these to a server
    // For now, we'll just store the file names
    const photoUrls = files.map(file => URL.createObjectURL(file));
    setReviewData(prev => ({
      ...prev,
      photos: [...prev.photos, ...photoUrls].slice(0, 5) // Max 5 photos
    }));
  };

  const removePhoto = (index) => {
    setReviewData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!reviewData.rating || !reviewData.comment.trim()) {
      alert("Please provide a rating and comment");
      return;
    }

    if (!reviewData.title.trim()) {
      alert("Please provide a review title");
      return;
    }

    setSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const reviewPayload = {
        coffeeShopId: selectedPlace.id || selectedPlace.placeId,
        rating: parseInt(reviewData.rating),
        title: reviewData.title.trim(),
        comment: reviewData.comment.trim(),
        visitDate: reviewData.visitDate || null,
        isRecommended: reviewData.wouldRecommend
      };

      console.log("Submitting review:", reviewPayload);

      const response = await fetch(`${apiUrl}/api/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(reviewPayload)
      });

      if (response.ok) {
        const newReview = await response.json();
        console.log("Review submitted successfully:", newReview);
        
        alert("Review submitted successfully!");
        
        // Navigate to the food place details page to see the new review
        navigate(`/food-places/${selectedPlace.id || selectedPlace.placeId}`);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error("Failed to submit review:", errorData);
        alert(errorData.message || "Failed to submit review. Please try again.");
      }
      
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarRating = (currentRating, onRate, label, hoverState = null) => {
    return (
      <div className="mb-3">
        <label className="form-label fw-semibold">{label} {label.includes('*') ? '' : currentRating > 0 ? `(${currentRating}/5)` : ''}</label>
        <div className="d-flex align-items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              className={`me-1 cursor-pointer ${
                star <= (hoverState || currentRating) ? "text-warning" : "text-muted"
              }`}
              fill={star <= (hoverState || currentRating) ? "currentColor" : "none"}
              onClick={() => onRate(star)}
              onMouseEnter={() => hoverState !== null && setHoverRating(star)}
              onMouseLeave={() => hoverState !== null && setHoverRating(0)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          <span className="ms-2 text-muted">
            {currentRating ? `${currentRating}/5` : "Click to rate"}
          </span>
        </div>
      </div>
    );
  };

  const getCategoryName = (category) => {
    if (!category) return 'FOOD';
    return category.replace('catering.', '').replace('_', ' ').toUpperCase();
  };

  return (
    <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          {step === 2 && (
            <button
              className="btn btn-outline-secondary rounded-circle me-3"
              onClick={() => setStep(1)}
              style={{ width: '48px', height: '48px' }}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h2 className="fw-bold mb-1">
              <Star size={32} className="me-2" style={{ color: "#FFD700" }} />
              Write a Review
            </h2>
            <p className="text-muted mb-0">
              Step {step} of 2: {step === 1 ? "Select the food place" : "Share your experience"}
            </p>
          </div>
        </div>

        {step === 1 ? (
          /* Step 1: Select Place */
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow-sm" style={{ borderRadius: '16px' }}>
                <div className="card-body p-4">
                  <h5 className="mb-4">Which place do you want to review?</h5>
                  
                  {/* Search */}
                  <div className="mb-4">
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0">
                        <Search size={20} className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search for a restaurant, cafe, bar..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchPlaces()}
                      />
                      <button 
                        className="btn text-dark fw-bold"
                        onClick={searchPlaces}
                        disabled={searching || !searchQuery.trim()}
                        style={{ backgroundColor: "#FFD700", border: "none" }}
                      >
                        {searching ? "Searching..." : "Search"}
                      </button>
                    </div>
                  </div>

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div>
                      <h6 className="mb-3">Select a place to review:</h6>
                      <div className="row g-3">
                        {searchResults.map((place) => (
                          <div key={place.id || place.placeId} className="col-12">
                            <div 
                              className="card border-0 bg-light h-100"
                              style={{ 
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease'
                              }}
                              onClick={() => handlePlaceSelect(place)}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(8px)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                            >
                              <div className="row g-0">
                                <div className="col-md-3">
                                  <img
                                    src={place.imageUrl || '/assets/cafe_placeholder.jpg'}
                                    alt={place.name}
                                    className="img-fluid h-100 w-100"
                                    style={{ 
                                      objectFit: 'cover',
                                      borderRadius: '8px 0 0 8px',
                                      minHeight: '120px'
                                    }}
                                    onError={(e) => {
                                      e.target.src = '/assets/cafe_placeholder.jpg';
                                    }}
                                  />
                                </div>
                                <div className="col-md-9">
                                  <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                      <div>
                                        <h6 className="fw-bold mb-1">{place.name}</h6>
                                        <p className="text-muted small mb-2">
                                          <MapPin size={14} className="me-1" />
                                          {place.address}
                                        </p>
                                        <div className="d-flex align-items-center gap-2">
                                          <span className="badge bg-primary">
                                            {getCategoryName(place.category)}
                                          </span>
                                          {place.rating && (
                                            <span className="small">⭐ {place.rating}</span>
                                          )}
                                          {place.distance && (
                                            <span className="small text-muted">📍 {place.distance}km</span>
                                          )}
                                        </div>
                                      </div>
                                      <button 
                                        className="btn btn-sm text-dark fw-bold"
                                        style={{ backgroundColor: "#FFD700", border: "none" }}
                                      >
                                        Select
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchQuery && searchResults.length === 0 && !searching && (
                    <div className="text-center py-4">
                      <Utensils size={48} className="text-muted mb-3" />
                      <p className="text-muted">No places found. Try a different search term.</p>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => navigate('/search')}
                      >
                        Search All Places
                      </button>
                    </div>
                  )}

                  {!searchQuery && (
                    <div className="text-center py-4">
                      <Search size={48} className="text-muted mb-3" />
                      <p className="text-muted mb-3">Search for the food place you want to review</p>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => navigate('/search')}
                      >
                        Browse All Places
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Step 2: Write Review */
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Selected Place Info */}
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <img
                      src={selectedPlace.imageUrl || '/assets/cafe_placeholder.jpg'}
                      alt={selectedPlace.name}
                      className="rounded me-3"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = '/assets/cafe_placeholder.jpg';
                      }}
                    />
                    <div>
                      <h5 className="fw-bold mb-1">{selectedPlace.name}</h5>
                      <p className="text-muted mb-1">
                        <MapPin size={14} className="me-1" />
                        {selectedPlace.address}
                      </p>
                      <span className="badge bg-primary">
                        {getCategoryName(selectedPlace.category)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Form */}
              <div className="card shadow-sm" style={{ borderRadius: '16px' }}>
                <div className="card-body p-4">
                  <h5 className="mb-4">Share your experience</h5>
                  
                  <form onSubmit={handleSubmitReview}>
                    {/* Overall Rating */}
                    {renderStarRating(
                      reviewData.rating,
                      (rating) => handleRatingClick(rating, 'rating'),
                      "Overall Rating *"
                    )}

                    {/* Review Title */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <Type size={16} className="me-2" />
                        Review Title *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Summarize your experience in a few words"
                        value={reviewData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        maxLength={100}
                        required
                      />
                      <div className="form-text">{reviewData.title.length}/100 characters</div>
                    </div>

                    {/* Review Comment */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        <MessageSquare size={16} className="me-2" />
                        Your Review *
                      </label>
                      <textarea
                        className="form-control"
                        rows="5"
                        placeholder="Share details about your experience - food quality, service, atmosphere, etc."
                        value={reviewData.comment}
                        onChange={(e) => handleInputChange('comment', e.target.value)}
                        maxLength={1000}
                        required
                      />
                      <div className="form-text">{reviewData.comment.length}/1000 characters</div>
                    </div>

                    {/* Visit Date */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        <Calendar size={16} className="me-2" />
                        When did you visit?
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={reviewData.visitDate}
                        onChange={(e) => handleInputChange('visitDate', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {/* Photos */}
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        <Camera size={16} className="me-2" />
                        Add Photos (optional)
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                      <div className="form-text">You can upload up to 5 photos</div>
                      
                      {reviewData.photos.length > 0 && (
                        <div className="mt-3">
                          <div className="d-flex gap-2 flex-wrap">
                            {reviewData.photos.map((photo, index) => (
                              <div key={index} className="position-relative">
                                <img
                                  src={photo}
                                  alt={`Review photo ${index + 1}`}
                                  className="rounded"
                                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                  onClick={() => removePhoto(index)}
                                  style={{ 
                                    width: '20px', 
                                    height: '20px',
                                    borderRadius: '50%',
                                    padding: '0',
                                    fontSize: '12px'
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Recommendation */}
                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={reviewData.wouldRecommend}
                          onChange={(e) => handleInputChange('wouldRecommend', e.target.checked)}
                        />
                        <label className="form-check-label fw-semibold">
                          I would recommend this place to others
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="d-flex gap-3">
                      <button 
                        type="submit" 
                        className="btn text-dark fw-bold flex-fill"
                        disabled={submitting || !reviewData.rating || !reviewData.comment.trim() || !reviewData.title.trim()}
                        style={{ backgroundColor: "#FFD700", border: "none" }}
                      >
                        {submitting ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Save size={18} className="me-2" />
                            Submit Review
                          </>
                        )}
                      </button>
                      
                      <button 
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/browse-reviews')}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}