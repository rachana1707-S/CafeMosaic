import React, { useEffect, useState } from "react";
import { Search, MapPin, Coffee, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImage from "../assets/coffee_search_bg.jpeg"; // Coffee shop background

export default function SearchCoffeeShops() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [unit, setUnit] = useState("km");
  const [category, setCategory] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load saved search preferences
    const saved = JSON.parse(localStorage.getItem("coffeeSearch"));
    if (saved) {
      setLocation(saved.location || "");
      setDistance(saved.distance || "");
      setUnit(saved.unit || "km");
      setCategory(saved.category || "");
    }
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setUseCurrentLocation(true);
        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your current location. Please enter a location manually.");
        setLoading(false);
      }
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!location) {
      alert("Please enter a location or use your current location!");
      return;
    }

    const distanceValue = distance.trim() === "" ? "5" : distance;
    const searchData = { location, distance: distanceValue, unit, category };
    
    // Save search preferences
    localStorage.setItem("coffeeSearch", JSON.stringify(searchData));

    // Navigate to search results
    const params = new URLSearchParams();
    if (useCurrentLocation && location.includes(',')) {
      const [lat, lon] = location.split(',');
      params.append('latitude', lat.trim());
      params.append('longitude', lon.trim());
    } else {
      params.append('location', location);
    }
    params.append('distance', distanceValue);
    params.append('unit', unit);
    if (category) params.append('category', category);

    navigate(`/search-results?${params.toString()}`);
  };

  return (
    <div
      className="position-relative d-flex flex-column align-items-center justify-content-center min-vh-100 text-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Content */}
      <div className="container" style={{ zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            
            {/* Header */}
            <div className="text-center mb-5">
              <Coffee className="text-warning mb-3" size={64} />
              <h1 className="display-4 fw-bold text-white mb-3">
                Find Your Perfect Coffee Shop
              </h1>
              <p className="lead text-white-50">
                Discover amazing coffee shops near you with reviews, photos, and more
              </p>
            </div>

            {/* Search Form */}
            <div className="card border-0 shadow-lg" style={{ borderRadius: "20px" }}>
              <div className="card-body p-4 p-md-5">
                <form onSubmit={handleSearch}>
                  
                  {/* Location Input */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-start d-block">
                      <MapPin size={18} className="me-2" />
                      Location
                    </label>
                    <div className="input-group">
                      <span className="input-group-text border-0 bg-light">
                        <Search className="text-muted" size={20} />
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 bg-light"
                        placeholder="Enter city, address, or zip code"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          setUseCurrentLocation(false);
                        }}
                        style={{ borderRadius: "0 12px 12px 0", padding: "14px 16px" }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-warning"
                        onClick={handleGetCurrentLocation}
                        disabled={loading}
                        title="Use current location"
                        style={{ borderRadius: "0 12px 12px 0" }}
                      >
                        {loading ? (
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <MapPin size={18} />
                        )}
                      </button>
                    </div>
                    {useCurrentLocation && (
                      <small className="text-success mt-1 d-block">
                        <i className="fas fa-check-circle me-1"></i>
                        Using your current location
                      </small>
                    )}
                  </div>

                  {/* Distance and Unit */}
                  <div className="row mb-4">
                    <div className="col-8">
                      <label className="form-label fw-semibold">Search Radius</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        className="form-control border-0 bg-light"
                        placeholder="5"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        style={{ borderRadius: "12px", padding: "14px 16px" }}
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label fw-semibold">Unit</label>
                      <select
                        className="form-select border-0 bg-light"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        style={{ borderRadius: "12px", padding: "14px 16px" }}
                      >
                        <option value="km">KM</option>
                        <option value="miles">Miles</option>
                      </select>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <Filter size={18} className="me-2" />
                      Coffee Shop Type (Optional)
                    </label>
                    <select
                      className="form-select border-0 bg-light"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ borderRadius: "12px", padding: "14px 16px" }}
                    >
                      <option value="">All Coffee Shops</option>
                      <option value="catering.cafe">Cafes</option>
                      <option value="catering.coffee_shop">Coffee Shops</option>
                      <option value="catering.restaurant">Coffee & Food</option>
                    </select>
                  </div>

                  {/* Search Button */}
                  <div className="d-grid">
                    <button 
                      className="btn btn-warning btn-lg fw-semibold" 
                      type="submit"
                      style={{ 
                        borderRadius: "12px", 
                        padding: "16px 0",
                        background: "linear-gradient(45deg, #ffc107, #ff8f00)",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(255, 193, 7, 0.3)"
                      }}
                    >
                      <Coffee size={24} className="me-2" />
                      Find Coffee Shops
                    </button>
                  </div>
                </form>

                {/* Quick Tips */}
                <div className="mt-4 p-3 bg-light rounded-3">
                  <h6 className="fw-semibold mb-2">
                    <i className="fas fa-lightbulb text-warning me-2"></i>
                    Quick Tips:
                  </h6>
                  <ul className="small text-muted mb-0 ps-3">
                    <li>Use your current location for the most accurate results</li>
                    <li>Try different search radii to find more options</li>
                    <li>Check out reviews and ratings from other coffee lovers</li>
                    <li>Save your favorites for easy access later</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="mt-4 text-center">
              <p className="text-white-50 mb-2">Popular searches:</p>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {[
                  "Downtown Seattle",
                  "Brooklyn, NY", 
                  "Austin, TX",
                  "Portland, OR",
                  "San Francisco, CA"
                ].map((city) => (
                  <button
                    key={city}
                    className="btn btn-sm btn-outline-light rounded-pill"
                    onClick={() => setLocation(city)}
                    style={{ 
                      backdropFilter: "blur(10px)",
                      background: "rgba(255, 255, 255, 0.1)"
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Coffee Icons */}
      <div className="position-absolute" style={{ top: '10%', left: '5%', zIndex: 1 }}>
        <Coffee size={32} className="text-warning opacity-25 animate-bounce" />
      </div>
      <div className="position-absolute" style={{ top: '20%', right: '10%', zIndex: 1 }}>
        <Coffee size={28} className="text-warning opacity-25 animate-pulse" />
      </div>
      <div className="position-absolute" style={{ bottom: '15%', left: '8%', zIndex: 1 }}>
        <Coffee size={36} className="text-warning opacity-25 animate-bounce" />
      </div>
      <div className="position-absolute" style={{ bottom: '25%', right: '5%', zIndex: 1 }}>
        <Coffee size={24} className="text-warning opacity-25 animate-pulse" />
      </div>
    </div>
  );
}