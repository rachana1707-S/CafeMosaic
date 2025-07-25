import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Coffee, ArrowLeft, Search, MapPin, Star, Phone, Clock, ChevronLeft, ChevronRight } from "lucide-react";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [allCoffeeShops, setAllCoffeeShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Quick search state
  const [quickSearchLocation, setQuickSearchLocation] = useState("");
  const [quickSearchRadius, setQuickSearchRadius] = useState("10");
  const [quickSearching, setQuickSearching] = useState(false);

  const queryParams = new URLSearchParams(location.search);

  // Coffee shop placeholder images
  const coffeeImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=200&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=200&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=400&h=200&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=200&fit=crop&auto=format&q=80'
  ];

  const getRandomCoffeeImage = () => {
    return coffeeImages[Math.floor(Math.random() * coffeeImages.length)];
  };

  // Pagination calculations
  const totalPages = Math.ceil(allCoffeeShops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCoffeeShops = allCoffeeShops.slice(startIndex, endIndex);

  useEffect(() => {
    const params = {
      location: queryParams.get("location") || "",
      categories: queryParams.get("categories") || "catering.cafe",
      distance: queryParams.get("distance") || "10",
      price: queryParams.get("price") || "",
    };

    console.log("🔍 Search params from URL:", params);
    setSearchParams(params);
    setQuickSearchLocation(params.location);
    setQuickSearchRadius(params.distance);
    setCurrentPage(1); // Reset to first page on new search
    searchCoffeeShops(params);
  }, [location.search]);

  const searchCoffeeShops = async (params) => {
    console.log("🚀 Starting search with params:", params);
    setLoading(true);
    setError(null);
    
    try {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) {
          searchParams.append(key, params[key]);
        }
      });

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const fullUrl = `${apiUrl}/api/search?${searchParams.toString()}`;
      
      console.log("🌐 API URL:", fullUrl);
      
      const response = await fetch(fullUrl, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("📡 Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📦 Response data:", data);
      
      if (data.success) {
        const shops = data.coffeeShops || [];
        console.log("✅ Coffee shops received:", shops.length);
        setAllCoffeeShops(shops);
      } else {
        throw new Error(data.error || 'Search failed');
      }
      
    } catch (error) {
      console.error("❌ Search error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = async (e) => {
    e.preventDefault();
    
    if (!quickSearchLocation.trim()) {
      alert("Please enter a location");
      return;
    }

    setQuickSearching(true);
    
    const newParams = {
      location: quickSearchLocation,
      categories: "catering.cafe",
      distance: quickSearchRadius,
    };

    const queryParams = new URLSearchParams(newParams);
    navigate(`/coffee-shop-results?${queryParams.toString()}`);
    
    setQuickSearching(false);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Smooth scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Coffee size={64} className="text-warning mb-3" />
          <h4 className="text-muted">Brewing your results...</h4>
          <p className="text-muted">Searching for coffee shops near you</p>
          <div className="mt-3">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
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
            <Coffee size={64} className="text-danger mb-3" />
            <h4 className="text-danger mb-3">Search Error</h4>
            <p className="text-muted mb-4">{error}</p>
            <div className="d-flex gap-2 justify-content-center">
              <button 
                className="btn btn-warning rounded-pill px-4"
                onClick={() => navigate('/search-coffee-shops')}
              >
                Try New Search
              </button>
              <button 
                className="btn btn-outline-secondary rounded-pill px-4"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-outline-secondary rounded-circle me-3"
            onClick={() => navigate(-1)}
            style={{ width: '48px', height: '48px' }}
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-grow-1">
            <h2 className="mb-1 fw-bold">
              Food Places Near <span className="text-warning">{searchParams.location || 'You'}</span>
            </h2>
            <p className="text-muted mb-0">
              {allCoffeeShops.length} result{allCoffeeShops.length !== 1 ? 's' : ''} found
              {searchParams.distance && ` within ${searchParams.distance} km`}
              {totalPages > 1 && (
                <span className="ms-2">
                  • Page {currentPage} of {totalPages}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="card mb-4 shadow-sm" style={{ borderRadius: '16px' }}>
          <div className="card-body">
            <h6 className="card-title mb-3">
              <Search size={18} className="me-2" />
              Search Different Location
            </h6>
            <form onSubmit={handleQuickSearch}>
              <div className="row g-3 align-items-end">
                <div className="col-md-6">
                  <label className="form-label small text-muted">Location</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <MapPin size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Enter city, address, or landmark"
                      value={quickSearchLocation}
                      onChange={(e) => setQuickSearchLocation(e.target.value)}
                      style={{ 
                        borderLeft: 'none',
                        boxShadow: 'none'
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label small text-muted">Radius (km)</label>
                  <select
                    className="form-select"
                    value={quickSearchRadius}
                    onChange={(e) => setQuickSearchRadius(e.target.value)}
                  >
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="15">15 km</option>
                    <option value="20">20 km</option>
                    <option value="30">30 km</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={quickSearching || !quickSearchLocation.trim()}
                  >
                    {quickSearching ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search size={16} className="me-2" />
                        Search
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Location Buttons */}
        <div className="mb-4">
          <div className="d-flex flex-wrap gap-2">
            <span className="text-muted small me-3 align-self-center">Quick searches:</span>
            {[
              { city: 'New York', emoji: '🗽' },
              { city: 'Los Angeles', emoji: '☀️' },
              { city: 'Chicago', emoji: '🌆' },
              { city: 'Seattle', emoji: '🌧️' },
              { city: 'San Francisco', emoji: '🌉' }
            ].map((location) => (
              <button
                key={location.city}
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setQuickSearchLocation(location.city);
                  const params = new URLSearchParams({
                    location: location.city,
                    categories: "catering.cafe",
                    distance: quickSearchRadius
                  });
                  navigate(`/coffee-shop-results?${params.toString()}`);
                }}
                style={{ borderRadius: '20px' }}
              >
                {location.emoji} {location.city}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {allCoffeeShops.length === 0 ? (
          <div className="text-center py-5">
            <Utensils size={64} className="text-muted mb-3" />
            <h4 className="text-muted mb-3">No food places found</h4>
            <p className="text-muted mb-4">Try a different location or adjust your search radius.</p>
            <button 
              className="btn btn-warning rounded-pill px-4"
              onClick={() => navigate('/search-food-places')}
            >
              Advanced Search
            </button>
          </div>
        ) : (
          <>
            {/* Current Page Results */}
            <div className="row g-4 mb-5">
              {currentCoffeeShops.map((shop, index) => (
                <div key={shop.id || shop.placeId || index} className="col-lg-6 col-xl-4">
                  <div 
                    className="card h-100 shadow-sm border-0" 
                    style={{ 
                      borderRadius: "16px",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease"
                    }}
                    onClick={() => navigate(`/food-places/${shop.id || shop.placeId}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                    }}
                  >
                    {/* Image Container with Visible Overlays */}
                    <div className="position-relative overflow-hidden" style={{ borderRadius: "16px 16px 0 0" }}>
                      <img
                        src={shop.imageUrl || getRandomCoffeeImage()}
                        alt={shop.name}
                        className="card-img-top"
                        style={{ 
                          height: "200px", 
                          objectFit: "cover"
                        }}
                        onError={(e) => {
                          if (!e.target.dataset.fallback) {
                            e.target.dataset.fallback = "1";
                            e.target.src = getRandomCoffeeImage();
                          } else {
                            // Final fallback - create a coffee-themed div
                            const parent = e.target.parentNode;
                            parent.innerHTML = `
                              <div style="
                                height: 200px; 
                                background: linear-gradient(135deg, #8B4513, #D2691E);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-size: 48px;
                                border-radius: 16px 16px 0 0;
                              ">
                                ☕
                              </div>
                            `;
                          }
                        }}
                      />
                      
                      {/* Distance Badge - More Visible */}
                      {shop.distance && (
                        <div 
                          className="position-absolute top-0 end-0 m-3"
                          style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                          }}
                        >
                          📍 {shop.distance} km
                        </div>
                      )}

                      {/* Rating Badge - More Visible */}
                      {shop.rating && (
                        <div 
                          className="position-absolute top-0 start-0 m-3"
                          style={{
                            backgroundColor: '#ffc107',
                            color: '#000',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                          }}
                        >
                          ⭐ {shop.rating}
                        </div>
                      )}

                      {/* Category Badge */}
                      {shop.category && (
                        <div 
                          className="position-absolute bottom-0 start-0 m-3"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            color: '#6c757d',
                            padding: '4px 10px',
                            borderRadius: '15px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            textTransform: 'capitalize'
                          }}
                        >
                          {shop.category.replace('catering.', '').replace('_', ' ')}
                        </div>
                      )}
                    </div>
                    
                    <div className="card-body p-4">
                      <h5 className="card-title fw-bold mb-2" style={{ fontSize: '1.1rem' }}>
                        {shop.name}
                      </h5>
                      
                      <div className="d-flex align-items-start mb-3">
                        <MapPin size={14} className="text-muted me-2 mt-1 flex-shrink-0" />
                        <p className="card-text text-muted small mb-0">
                          {shop.address || 'Address not available'}
                        </p>
                      </div>

                      {/* Coffee Shop Details */}
                      <div className="mb-3">
                        {shop.rating && (
                          <div className="d-flex align-items-center mb-2">
                            <div className="d-flex me-2">
                              {[1,2,3,4,5].map((star) => (
                                <Star 
                                  key={star}
                                  size={16} 
                                  className={star <= Math.round(shop.rating) ? "text-warning" : "text-muted"}
                                  fill={star <= Math.round(shop.rating) ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                            <span className="fw-semibold me-1">{shop.rating}</span>
                            <span className="text-muted small">/5</span>
                          </div>
                        )}

                        {shop.phone && (
                          <div className="d-flex align-items-center mb-2">
                            <Phone size={14} className="text-muted me-2" />
                            <a 
                              href={`tel:${shop.phone}`} 
                              className="text-decoration-none small text-primary"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {shop.phone}
                            </a>
                          </div>
                        )}

                        {shop.openingHours && (
                          <div className="d-flex align-items-center mb-2">
                            <Clock size={14} className="text-success me-2" />
                            <span className="text-muted small">
                              {typeof shop.openingHours === 'object' ? 'Check hours' : shop.openingHours}
                            </span>
                          </div>
                        )}

                        {shop.website && (
                          <div className="d-flex align-items-center mb-2">
                            <Coffee size={14} className="text-primary me-2" />
                            <a 
                              href={shop.website.startsWith('http') ? shop.website : `https://${shop.website}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-decoration-none small text-primary"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-2 mt-auto">
                        <button 
                          className="btn btn-primary btn-sm flex-fill"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/coffee-shops/${shop.id || shop.placeId}`);
                          }}
                          style={{ borderRadius: '8px' }}
                        >
                          View Details
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('Add to favorites functionality will be implemented');
                          }}
                          style={{ borderRadius: '8px', width: '45px' }}
                          title="Add to Favorites"
                        >
                          <span style={{ fontSize: '14px' }}>❤️</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center mb-4">
                <nav aria-label="Coffee shop search pagination">
                  <ul className="pagination pagination-lg">
                    {/* Previous Button */}
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{ borderRadius: '12px 0 0 12px' }}
                      >
                        <ChevronLeft size={18} />
                      </button>
                    </li>

                    {/* First Page */}
                    {currentPage > 3 && (
                      <>
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(1)}
                          >
                            1
                          </button>
                        </li>
                        {currentPage > 4 && (
                          <li className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        )}
                      </>
                    )}

                    {/* Page Numbers */}
                    {generatePageNumbers().map((pageNum) => (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pageNum)}
                          style={{
                            backgroundColor: currentPage === pageNum ? '#ffc107' : 'transparent',
                            borderColor: currentPage === pageNum ? '#ffc107' : '#dee2e6',
                            color: currentPage === pageNum ? '#000' : '#6c757d'
                          }}
                        >
                          {pageNum}
                        </button>
                      </li>
                    ))}

                    {/* Last Page */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <li className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        )}
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </button>
                        </li>
                      </>
                    )}

                    {/* Next Button */}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{ borderRadius: '0 12px 12px 0' }}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}

            {/* Pagination Info */}
            {totalPages > 1 && (
              <div className="text-center text-muted small mb-4">
                Showing {startIndex + 1} - {Math.min(endIndex, allCoffeeShops.length)} of {allCoffeeShops.length} food places
              </div>
            )}
          </>
        )}

        {/* Footer Info */}
        <div className="mt-5 pt-4 border-top">
          <div className="row text-center">
            <div className="col-md-4 mb-3">
              <div className="text-muted small">
                <Coffee size={16} className="me-1" />
                Powered by Geoapify
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="text-muted small">
                <MapPin size={16} className="me-1" />
                Real-time food place data
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="text-muted small">
                <Star size={16} className="me-1" />
                Community reviewed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}