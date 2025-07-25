import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { 
  MapPin, 
  Search, 
  Utensils, 
  Star, 
  Phone,
  Navigation
} from "lucide-react";

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const libraries = ['places'];

export default function FoodMap() {
  const navigate = useNavigate();
  
  const [foodPlaces, setFoodPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState("Boston");
  const [searchRadius, setSearchRadius] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Map state
  const [mapCenter, setMapCenter] = useState({ lat: 42.3601, lng: -71.0589 });
  const [mapZoom, setMapZoom] = useState(12);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setMapCenter(location);
          setSearchLocation("Your Location");
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    }

    // Load initial food places
    searchFoodPlaces();
  }, []);

  const searchFoodPlaces = async (customLocation = null, customCategory = null, customRadius = null) => {
    setLoading(true);
    
    try {
      const location = customLocation || searchLocation;
      const category = customCategory !== null ? customCategory : selectedCategory;
      const radius = customRadius || searchRadius;
      
      const params = new URLSearchParams({
        location: location,
        categories: category || "catering.restaurant,catering.cafe,catering.bar",
        distance: radius.toString()
      });

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/search?${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const places = data.coffeeShops || [];
        setFoodPlaces(places);
        
        // Update map center if we have places
        if (places.length > 0 && places[0].latitude && places[0].longitude) {
          const newCenter = {
            lat: parseFloat(places[0].latitude),
            lng: parseFloat(places[0].longitude)
          };
          setMapCenter(newCenter);
        }
      } else {
        console.error("Search failed");
        setFoodPlaces([]);
      }
    } catch (error) {
      console.error("Error searching food places:", error);
      setFoodPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchFoodPlaces();
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    searchFoodPlaces(null, category);
  };

  const handlePlaceSelect = useCallback((place) => {
    setSelectedPlace(place);
    if (place && place.latitude && place.longitude) {
      const newCenter = {
        lat: parseFloat(place.latitude),
        lng: parseFloat(place.longitude)
      };
      setMapCenter(newCenter);
      setMapZoom(15);
    }
  }, []);

  const handleMapClick = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setMapCenter(location);
          setSearchLocation("Your Location");
          searchFoodPlaces("Your Location");
        },
        (error) => {
          alert("Unable to get your location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const getMarkerIcon = (place) => {
    const category = place.category || '';
    let color = '#FFD700'; // Default golden
    
    if (category.includes('restaurant')) color = '#FF6B6B';
    else if (category.includes('cafe')) color = '#8B4513';
    else if (category.includes('bar')) color = '#4ECDC4';
    else if (category.includes('fast_food')) color = '#FF9F43';
    else if (category.includes('ice_cream')) color = '#FF6B9D';
    
    return {
      path: window.google?.maps?.SymbolPath?.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 10
    };
  };

  return (
    <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
      <div className="row h-100">
        {/* Sidebar */}
        <div className="col-lg-4 col-md-5 mb-4">
          <div className="card shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <div className="card-header border-0 bg-white">
              <h4 className="mb-0">
                <MapPin size={24} className="me-2" style={{ color: "#FFD700" }} />
                Food Places Map
              </h4>
            </div>
            
            <div className="card-body">
              {/* Search Controls */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="mb-3">
                  <label className="form-label small text-muted">Location</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter city or address"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={getCurrentLocation}
                      title="Use current location"
                    >
                      <Navigation size={16} />
                    </button>
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small text-muted">Radius (km)</label>
                    <select
                      className="form-select"
                      value={searchRadius}
                      onChange={(e) => setSearchRadius(Number(e.target.value))}
                    >
                      <option value={5}>5 km</option>
                      <option value={10}>10 km</option>
                      <option value={15}>15 km</option>
                      <option value={20}>20 km</option>
                      <option value={30}>30 km</option>
                    </select>
                  </div>
                  
                  <div className="col-6">
                    <label className="form-label small text-muted">Category</label>
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="catering.restaurant">Restaurants</option>
                      <option value="catering.cafe">Cafes</option>
                      <option value="catering.bar">Bars</option>
                      <option value="catering.fast_food">Fast Food</option>
                      <option value="catering.food_court">Food Courts</option>
                      <option value="catering.ice_cream">Ice Cream</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn w-100 text-dark fw-bold"
                  disabled={loading}
                  style={{ backgroundColor: "#FFD700", border: "none" }}
                >
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search size={16} className="me-2" />
                      Search Map
                    </>
                  )}
                </button>
              </form>

              {/* Quick Category Filters */}
              <div className="mb-4">
                <h6 className="mb-2">Quick Filters</h6>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    { label: 'All', value: '', emoji: '🍽️' },
                    { label: 'Restaurants', value: 'catering.restaurant', emoji: '🍽️' },
                    { label: 'Cafes', value: 'catering.cafe', emoji: '☕' },
                    { label: 'Bars', value: 'catering.bar', emoji: '🍺' },
                    { label: 'Fast Food', value: 'catering.fast_food', emoji: '🍔' }
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      className={`btn btn-sm ${selectedCategory === cat.value ? 'text-dark fw-bold' : 'btn-outline-secondary'}`}
                      onClick={() => handleCategoryFilter(cat.value)}
                      style={selectedCategory === cat.value ? { backgroundColor: "#FFD700", border: "none" } : {}}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results List */}
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Found Places ({foodPlaces.length})</h6>
                  <button 
                    className="btn btn-sm text-dark"
                    onClick={() => navigate('/search-results?' + new URLSearchParams({
                      location: searchLocation,
                      categories: selectedCategory || "catering.restaurant,catering.cafe,catering.bar",
                      distance: searchRadius.toString()
                    }).toString())}
                    style={{ backgroundColor: "#FFD700", border: "none" }}
                  >
                    List View
                  </button>
                </div>
                
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {foodPlaces.length === 0 ? (
                    <div className="text-center py-4">
                      <Utensils size={32} className="text-muted mb-2" />
                      <p className="text-muted small">No places found. Try adjusting your search.</p>
                    </div>
                  ) : (
                    foodPlaces.map((place, index) => (
                      <div 
                        key={place.id || place.placeId || index}
                        className={`card mb-2 border-0 ${selectedPlace?.id === place.id ? 'bg-warning bg-opacity-25' : 'bg-light'}`}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handlePlaceSelect(place)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                      >
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="card-title mb-1 fw-bold">{place.name}</h6>
                              <p className="card-text small text-muted mb-1">
                                📍 {place.address}
                              </p>
                              
                              <div className="d-flex align-items-center gap-2 mb-1">
                                {place.rating && (
                                  <span className="small">
                                    ⭐ {place.rating}
                                  </span>
                                )}
                                {place.distance && (
                                  <span className="small text-muted">
                                    📏 {place.distance}km
                                  </span>
                                )}
                              </div>
                              
                              {place.category && (
                                <span className="badge bg-secondary small">
                                  {place.category.replace('catering.', '').replace('_', ' ')}
                                </span>
                              )}
                            </div>
                            
                            <button 
                              className="btn btn-sm text-dark"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/food-places/${place.id || place.placeId}`);
                              }}
                              style={{ backgroundColor: "#FFD700", border: "none" }}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="col-lg-8 col-md-7">
          <div className="card shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <div className="card-header border-0 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">Interactive Google Map</h5>
                  <small className="text-muted">
                    {searchLocation} • {searchRadius}km radius • {foodPlaces.length} places
                  </small>
                </div>
              </div>
            </div>
            
            <div className="card-body p-0 position-relative">
              {/* Google Map */}
              <div style={{ borderRadius: '0 0 16px 16px', overflow: 'hidden' }}>
                <LoadScript 
                  googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}
                  libraries={libraries}
                  loadingElement={
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '500px' }}>
                      <div className="text-center">
                        <div className="spinner-border" style={{ color: "#FFD700" }} role="status">
                          <span className="visually-hidden">Loading map...</span>
                        </div>
                        <p className="mt-2 text-muted">Loading Google Maps...</p>
                      </div>
                    </div>
                  }
                >
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={mapZoom}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onClick={handleMapClick}
                    options={{
                      disableDefaultUI: false,
                      zoomControl: true,
                      streetViewControl: false,
                      mapTypeControl: true,
                      fullscreenControl: true
                    }}
                  >
                    {/* User Location Marker */}
                    {userLocation && (
                      <Marker
                        position={userLocation}
                        icon={{
                          path: window.google?.maps?.SymbolPath?.CIRCLE,
                          fillColor: '#4285F4',
                          fillOpacity: 1,
                          strokeColor: '#FFFFFF',
                          strokeWeight: 3,
                          scale: 8
                        }}
                        title="Your Location"
                      />
                    )}

                    {/* Food Place Markers */}
                    {foodPlaces.map((place, index) => (
                      place.latitude && place.longitude && (
                        <Marker
                          key={place.id || place.placeId || index}
                          position={{
                            lat: parseFloat(place.latitude),
                            lng: parseFloat(place.longitude)
                          }}
                          icon={getMarkerIcon(place)}
                          onClick={() => handlePlaceSelect(place)}
                          title={place.name}
                        />
                      )
                    ))}
                    
                    {/* Info Window for Selected Place */}
                    {selectedPlace && selectedPlace.latitude && selectedPlace.longitude && (
                      <InfoWindow
                        position={{
                          lat: parseFloat(selectedPlace.latitude),
                          lng: parseFloat(selectedPlace.longitude)
                        }}
                        onCloseClick={() => setSelectedPlace(null)}
                      >
                        <div style={{ maxWidth: '250px', padding: '8px' }}>
                          <h6 className="fw-bold mb-2">{selectedPlace.name}</h6>
                          <p className="small text-muted mb-2">{selectedPlace.address}</p>
                          
                          {selectedPlace.rating && (
                            <div className="d-flex align-items-center mb-2">
                              <Star size={16} className="text-warning me-1" />
                              <span className="fw-semibold">{selectedPlace.rating}/5</span>
                            </div>
                          )}

                          {selectedPlace.phone && (
                            <p className="small text-muted mb-2">
                              <Phone size={14} className="me-1" />
                              {selectedPlace.phone}
                            </p>
                          )}

                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm text-dark fw-bold flex-fill"
                              onClick={() => navigate(`/food-places/${selectedPlace.id || selectedPlace.placeId}`)}
                              style={{ backgroundColor: "#FFD700", border: "none" }}
                            >
                              View Details
                            </button>
                            
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => window.open(`https://maps.google.com/?q=${selectedPlace.latitude},${selectedPlace.longitude}`, '_blank')}
                            >
                              Directions
                            </button>
                          </div>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Stats */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 bg-light">
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="h5 text-primary mb-1">{foodPlaces.length}</div>
                  <div className="small text-muted">Places Found</div>
                </div>
                <div className="col-md-3">
                  <div className="h5 text-success mb-1">
                    {foodPlaces.filter(p => p.rating >= 4).length}
                  </div>
                  <div className="small text-muted">Highly Rated</div>
                </div>
                <div className="col-md-3">
                  <div className="h5 text-warning mb-1">
                    {new Set(foodPlaces.map(p => p.category)).size}
                  </div>
                  <div className="small text-muted">Categories</div>
                </div>
                <div className="col-md-3">
                  <div className="h5 text-info mb-1">{searchRadius}km</div>
                  <div className="small text-muted">Search Radius</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}