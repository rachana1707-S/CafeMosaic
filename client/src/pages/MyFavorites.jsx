import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import { 
  Heart, 
  Utensils, 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  Trash2,
  Search,
  Filter,
  Calendar,
  Grid3X3,
  List
} from "lucide-react";

export default function MyFavorites() {
  const { user, isAuthenticated } = useAuthUser();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterCategory, setFilterCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Food place placeholder images
  const foodImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=200&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=200&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=200&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=200&fit=crop&auto=format&q=80'
  ];

  const getRandomFoodImage = () => {
    return foodImages[Math.floor(Math.random() * foodImages.length)];
  };

  useEffect(() => {
    if (isAuthenticated()) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      
      // Get from localStorage (replace with API call later)
      const savedFavorites = JSON.parse(localStorage.getItem('foodPlaceFavorites') || '[]');
      setFavorites(savedFavorites);
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/favorites', {
      //   credentials: 'include'
      // });
      // const data = await response.json();
      // setFavorites(data.favorites || []);
      
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (foodPlace) => {
    if (!window.confirm(`Remove ${foodPlace.name} from favorites?`)) return;
    
    try {
      const updatedFavorites = favorites.filter(fav => 
        fav.id !== foodPlace.id && fav.placeId !== foodPlace.placeId
      );
      
      // Update localStorage
      localStorage.setItem('foodPlaceFavorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
      
      // TODO: Replace with actual API call
      // await fetch(`/api/favorites/${foodPlace.id}`, {
      //   method: 'DELETE',
      //   credentials: 'include'
      // });
      
      alert(`${foodPlace.name} removed from favorites!`);
      
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Error removing from favorites. Please try again.");
    }
  };

  const getFilteredAndSortedFavorites = () => {
    let filtered = favorites;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(place => 
        place.category && place.category.includes(filterCategory)
      );
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'distance':
          return parseFloat(a.distance || 999) - parseFloat(b.distance || 999);
        case 'dateAdded':
        default:
          return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
      }
    });
  };

  const filteredFavorites = getFilteredAndSortedFavorites();

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="d-flex align-items-center">
        {[1,2,3,4,5].map((star) => (
          <Star 
            key={star}
            size={16} 
            className={star <= Math.round(rating) ? "text-warning" : "text-muted"}
            fill={star <= Math.round(rating) ? "currentColor" : "none"}
          />
        ))}
        <span className="ms-2 fw-semibold">{rating}</span>
      </div>
    );
  };

  if (!isAuthenticated()) {
    return (
      <div className="container mt-5 pt-5">
        <div className="text-center py-5">
          <Heart size={64} className="text-muted mb-4" />
          <h3 className="text-muted mb-3">Please Log In</h3>
          <p className="text-muted mb-4">
            You need to be logged in to view your favorite food places.
          </p>
          <button 
            className="btn text-dark fw-bold px-4 py-2"
            onClick={() => navigate('/login')}
            style={{ backgroundColor: "#FFD700", border: "none", borderRadius: "25px" }}
          >
            Login to View Favorites
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Heart size={64} style={{ color: "#FFD700" }} className="mb-3" />
          <h4 className="text-muted">Loading your favorites...</h4>
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
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              <Heart size={32} className="me-2 text-danger" />
              My Favorite Food Places
            </h2>
            <p className="text-muted mb-0">
              {favorites.length} favorite place{favorites.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          
          {favorites.length > 0 && (
            <div className="d-flex gap-2">
              <button 
                className="btn text-dark fw-bold"
                onClick={() => navigate('/search-food-places')}
                style={{ backgroundColor: "#FFD700", border: "none" }}
              >
                <Search size={16} className="me-2" />
                Find More Places
              </button>
            </div>
          )}
        </div>

        {/* Controls */}
        {favorites.length > 0 && (
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                {/* Search */}
                <div className="col-md-4">
                  <label className="form-label small text-muted">Search Favorites</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Search size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search by name or location"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
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
                    <option value="restaurant">Restaurants</option>
                    <option value="cafe">Cafes</option>
                    <option value="bar">Bars</option>
                    <option value="fast_food">Fast Food</option>
                    <option value="food_court">Food Courts</option>
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
                    <option value="dateAdded">Recently Added</option>
                    <option value="name">Name</option>
                    <option value="rating">Rating</option>
                    <option value="distance">Distance</option>
                  </select>
                </div>

                {/* View Mode */}
                <div className="col-md-2">
                  <label className="form-label small text-muted">View</label>
                  <div className="btn-group w-100" role="group">
                    <button
                      className={`btn ${viewMode === 'grid' ? 'text-dark' : 'btn-outline-secondary'} btn-sm`}
                      onClick={() => setViewMode('grid')}
                      style={viewMode === 'grid' ? { backgroundColor: "#FFD700", border: "none" } : {}}
                    >
                      <Grid3X3 size={16} />
                    </button>
                    <button
                      className={`btn ${viewMode === 'list' ? 'text-dark' : 'btn-outline-secondary'} btn-sm`}
                      onClick={() => setViewMode('list')}
                      style={viewMode === 'list' ? { backgroundColor: "#FFD700", border: "none" } : {}}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-5">
            <Heart size={80} className="text-muted mb-4" />
            <h3 className="text-muted mb-3">No Favorite Places Yet</h3>
            <p className="text-muted mb-4">
              Start exploring and save your favorite restaurants, cafes, and food places!
            </p>
            <button 
              className="btn text-dark fw-bold px-4 py-2"
              onClick={() => navigate('/search-food-places')}
              style={{ backgroundColor: "#FFD700", border: "none", borderRadius: "25px" }}
            >
              <Search size={18} className="me-2" />
              Discover Food Places
            </button>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="text-center py-5">
            <Search size={64} className="text-muted mb-4" />
            <h4 className="text-muted mb-3">No matches found</h4>
            <p className="text-muted mb-4">
              Try adjusting your search or filter criteria.
            </p>
            <button 
              className="btn text-dark fw-bold"
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('');
              }}
              style={{ backgroundColor: "#FFD700", border: "none" }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Favorites Display */
          <div className={viewMode === 'grid' ? "row g-4" : "row g-3"}>
            {filteredFavorites.map((place) => (
              <div key={place.id || place.placeId} className={viewMode === 'grid' ? "col-lg-4 col-md-6" : "col-12"}>
                {viewMode === 'grid' ? (
                  /* Grid View */
                  <div 
                    className="card h-100 border-0 shadow-sm"
                    style={{ 
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onClick={() => navigate(`/food-places/${place.id || place.placeId}`)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div className="position-relative">
                      <img
                        src={place.imageUrl || getRandomFoodImage()}
                        alt={place.name}
                        className="card-img-top"
                        style={{ 
                          height: '200px', 
                          objectFit: 'cover',
                          borderRadius: '16px 16px 0 0'
                        }}
                        onError={(e) => {
                          e.target.src = getRandomFoodImage();
                        }}
                      />
                      
                      {/* Remove Button */}
                      <button
                        className="btn btn-sm position-absolute top-0 end-0 m-3 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromFavorites(place);
                        }}
                        style={{
                          backgroundColor: 'rgba(220, 53, 69, 0.8)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '35px',
                          height: '35px'
                        }}
                        title="Remove from favorites"
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* Distance Badge */}
                      {place.distance && (
                        <div 
                          className="position-absolute bottom-0 start-0 m-3 badge bg-dark text-white"
                          style={{ fontSize: '0.75rem' }}
                        >
                          📍 {place.distance} km
                        </div>
                      )}
                    </div>
                    
                    <div className="card-body">
                      <h5 className="card-title fw-bold mb-2">{place.name}</h5>
                      <p className="card-text text-muted small mb-2">
                        <MapPin size={14} className="me-1" />
                        {place.address}
                      </p>
                      
                      {place.rating && (
                        <div className="mb-2">
                          {renderStars(place.rating)}
                        </div>
                      )}

                      {place.category && (
                        <span className="badge bg-light text-dark mb-2">
                          {place.category.replace('catering.', '').replace('_', ' ')}
                        </span>
                      )}

                      {place.dateAdded && (
                        <div className="text-muted small">
                          <Calendar size={12} className="me-1" />
                          Added {new Date(place.dateAdded).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* List View */
                  <div 
                    className="card border-0 shadow-sm"
                    style={{ 
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/food-places/${place.id || place.placeId}`)}
                  >
                    <div className="row g-0">
                      <div className="col-md-3">
                        <img
                          src={place.imageUrl || getRandomFoodImage()}
                          alt={place.name}
                          className="img-fluid h-100 w-100"
                          style={{ 
                            objectFit: 'cover',
                            borderRadius: '12px 0 0 12px',
                            minHeight: '150px'
                          }}
                          onError={(e) => {
                            e.target.src = getRandomFoodImage();
                          }}
                        />
                      </div>
                      <div className="col-md-9">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h5 className="card-title fw-bold mb-2">{place.name}</h5>
                              <p className="card-text text-muted mb-2">
                                <MapPin size={14} className="me-1" />
                                {place.address}
                              </p>
                              
                              <div className="d-flex align-items-center gap-3 mb-2">
                                {place.rating && renderStars(place.rating)}
                                {place.distance && (
                                  <span className="text-muted small">📍 {place.distance} km</span>
                                )}
                              </div>

                              {place.phone && (
                                <p className="card-text small text-muted mb-1">
                                  <Phone size={12} className="me-1" />
                                  {place.phone}
                                </p>
                              )}

                              {place.dateAdded && (
                                <small className="text-muted">
                                  <Calendar size={12} className="me-1" />
                                  Added {new Date(place.dateAdded).toLocaleDateString()}
                                </small>
                              )}
                            </div>
                            
                            <button
                              className="btn btn-sm text-white ms-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFromFavorites(place);
                              }}
                              style={{
                                backgroundColor: '#dc3545',
                                border: 'none',
                                borderRadius: '8px'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <div className="mt-5 p-4 bg-light rounded">
            <h5 className="mb-3">Quick Actions</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <button 
                  className="btn w-100 text-dark fw-bold"
                  onClick={() => navigate('/search-food-places')}
                  style={{ backgroundColor: "#FFD700", border: "none" }}
                >
                  <Search size={16} className="me-2" />
                  Find More Places
                </button>
              </div>
              <div className="col-md-4">
                <button 
                  className="btn w-100 text-dark fw-bold"
                  onClick={() => navigate('/my-collections')}
                  style={{ backgroundColor: "#FFD700", border: "none" }}
                >
                  <Utensils size={16} className="me-2" />
                  My Collections
                </button>
              </div>
              <div className="col-md-4">
                <button 
                  className="btn w-100 text-dark fw-bold"
                  onClick={() => navigate('/food-map')}
                  style={{ backgroundColor: "#FFD700", border: "none" }}
                >
                  <MapPin size={16} className="me-2" />
                  View on Map
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}