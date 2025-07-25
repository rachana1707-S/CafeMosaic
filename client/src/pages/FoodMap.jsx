import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CoffeeShopMap() {
  const navigate = useNavigate();
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to NYC
  const [searchRadius, setSearchRadius] = useState(10);
  const [selectedShop, setSelectedShop] = useState(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setMapCenter(location);
          fetchNearbyCoffeeShops(location);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to default location
          fetchNearbyCoffeeShops(mapCenter);
        }
      );
    } else {
      // Geolocation not supported
      fetchNearbyCoffeeShops(mapCenter);
    }
  }, []);

  const fetchNearbyCoffeeShops = async (center) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/coffee-shops/nearby?lat=${center.lat}&lng=${center.lng}&radius=${searchRadius}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setCoffeeShops(data);
    } catch (error) {
      console.error("Error fetching coffee shops:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (newRadius) => {
    setSearchRadius(newRadius);
    fetchNearbyCoffeeShops(mapCenter);
  };

  // Simple map placeholder - in a real app, you'd use Google Maps, Mapbox, etc.
  const MapPlaceholder = () => (
    <div 
      className="bg-light d-flex align-items-center justify-content-center rounded"
      style={{ height: "500px", border: "2px dashed #dee2e6" }}
    >
      <div className="text-center">
        <i className="fas fa-map-marked-alt fs-1 text-muted mb-3"></i>
        <h5 className="text-muted">Interactive Map</h5>
        <p className="text-muted mb-3">
          Coffee shops within {searchRadius}km radius
        </p>
        <small className="text-muted">
          📍 {userLocation ? "Your location detected" : "Using default location"}
        </small>
        <div className="mt-3">
          <small className="text-muted d-block">
            In a real implementation, this would show:
          </small>
          <small className="text-muted">
            • Interactive map with coffee shop markers<br/>
            • Click markers to see shop details<br/>
            • Directions and distance to each shop
          </small>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Finding coffee shops near you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Map Section */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Coffee Shop Map</h5>
                <div className="d-flex align-items-center gap-2">
                  <label className="small mb-0">Radius:</label>
                  <select 
                    className="form-select form-select-sm w-auto"
                    value={searchRadius}
                    onChange={(e) => handleRadiusChange(Number(e.target.value))}
                  >
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                    <option value={20}>20 km</option>
                    <option value={50}>50 km</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <MapPlaceholder />
            </div>
          </div>

          {/* Map Controls */}
          <div className="card mt-3">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center">
                      <span className="badge bg-primary me-2">📍</span>
                      <small>Your Location</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="badge bg-success me-2">☕</span>
                      <small>Coffee Shops</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="badge bg-warning me-2">⭐</span>
                      <small>Highly Rated</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 text-end">
                  <button 
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => navigate("/search-coffee-shops")}
                  >
                    Advanced Search
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => fetchNearbyCoffeeShops(mapCenter)}
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coffee Shops List */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header">
              <h5 className="mb-0">Nearby Coffee Shops ({coffeeShops.length})</h5>
            </div>
            <div className="card-body p-0" style={{ maxHeight: "600px", overflowY: "auto" }}>
              {coffeeShops.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-search fs-2 text-muted mb-3"></i>
                  <p className="text-muted mb-3">No coffee shops found in this area</p>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => handleRadiusChange(searchRadius * 2)}
                  >
                    Expand Search Radius
                  </button>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {coffeeShops.map((shop, index) => (
                    <div 
                      key={shop.id || index} 
                      className={`list-group-item list-group-item-action ${selectedShop?.id === shop.id ? 'active' : ''}`}
                      onClick={() => setSelectedShop(shop)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{shop.name}</h6>
                          {shop.address && (
                            <p className="mb-1 small text-muted">
                              📍 {shop.address}
                            </p>
                          )}
                          <div className="d-flex align-items-center gap-2 mb-1">
                            {shop.rating && (
                              <span className="small">
                                ⭐ {shop.rating.toFixed(1)}
                              </span>
                            )}
                            {shop.priceRange && (
                              <span className="badge bg-light text-dark">
                                {shop.priceRange}
                              </span>
                            )}
                            {shop.distance && (
                              <span className="small text-muted">
                                📏 {shop.distance.toFixed(1)}km
                              </span>
                            )}
                          </div>
                          {shop.hours && (
                            <p className="mb-1 small">
                              🕒 {shop.hours}
                            </p>
                          )}
                        </div>
                        <div className="text-end">
                          <button 
                            className="btn btn-sm btn-outline-primary mb-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/coffee-shops/${shop.id}`);
                            }}
                          >
                            View
                          </button>
                          {shop.latitude && shop.longitude && (
                            <br />
                          )}
                          {shop.latitude && shop.longitude && (
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-success"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Directions
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Shop Details */}
          {selectedShop && (
            <div className="card mt-3 shadow-sm">
              <div className="card-header">
                <h6 className="mb-0">Selected Coffee Shop</h6>
              </div>
              <div className="card-body">
                <h5>{selectedShop.name}</h5>
                {selectedShop.description && (
                  <p className="small text-muted mb-2">{selectedShop.description}</p>
                )}
                {selectedShop.phone && (
                  <p className="mb-1 small">📞 {selectedShop.phone}</p>
                )}
                {selectedShop.website && (
                  <p className="mb-2 small">
                    🔗 <a href={selectedShop.website} target="_blank" rel="noreferrer">
                      Visit Website
                    </a>
                  </p>
                )}
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-primary btn-sm flex-fill"
                    onClick={() => navigate(`/coffee-shops/${selectedShop.id}`)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-outline-success btn-sm flex-fill"
                    onClick={() => navigate(`/add-review?shop=${selectedShop.id}`)}
                  >
                    Write Review
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="card mt-3 shadow-sm">
            <div className="card-body">
              <h6 className="card-title">Quick Stats</h6>
              <div className="row text-center">
                <div className="col-6">
                  <div className="h5 text-primary">{coffeeShops.length}</div>
                  <div className="small text-muted">Shops Found</div>
                </div>
                <div className="col-6">
                  <div className="h5 text-success">
                    {coffeeShops.filter(s => s.rating >= 4).length}
                  </div>
                  <div className="small text-muted">Highly Rated</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}