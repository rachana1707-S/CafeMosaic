import React from "react";
import { Link } from "react-router-dom";
import { Utensils, Search, Heart, Star, MapPin, Users } from "lucide-react";
import backgroundImage from "../assets/food_home_bg.jpg"; // Food background

export default function Home() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center position-relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        color: "white", 
      }}
    >
      {/* Main Content */}
      <div className="container px-4" style={{ zIndex: 2 }}>
        {/* Hero Section */}
        <div className="mb-5">
          <Utensils className="text-warning mb-4" size={80} />
          <h1 className="display-3 fw-bold mb-4 text-shadow">
            Welcome to FoodSocial
          </h1>
          <p className="lead fs-4 mb-5 text-white-75" style={{ maxWidth: "700px", margin: "0 auto" }}>
            Discover amazing food experiences near you. From cozy cafes and trendy restaurants 
            to vibrant bars and local food courts - find your next favorite dining spot and 
            connect with fellow food lovers.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-5">
          <Link 
            to="/search-food-places" 
            className="btn btn-warning btn-lg shadow-lg px-5 py-3 rounded-pill fw-semibold d-flex align-items-center justify-content-center"
            style={{ minWidth: "200px" }}
          >
            <Search size={24} className="me-2" />
            Find Food Places
          </Link>
          <Link 
            to="/browse-reviews" 
            className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-semibold d-flex align-items-center justify-content-center"
            style={{ minWidth: "200px", backdropFilter: "blur(10px)" }}
          >
            <Star size={24} className="me-2" />
            Browse Reviews
          </Link>
        </div>

        {/* Food Categories Quick Access */}
        <div className="row mt-5 pt-4">
          <div className="col-12">
            <h4 className="text-white mb-4">🍽️ Explore Food Categories</h4>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              {[
                { category: 'Cafes', emoji: '☕', value: 'catering.cafe' },
                { category: 'Restaurants', emoji: '🍽️', value: 'catering.restaurant' },
                { category: 'Fast Food', emoji: '🍔', value: 'catering.fast_food' },
                { category: 'Bars & Pubs', emoji: '🍺', value: 'catering.bar' },
                { category: 'Food Courts', emoji: '🥘', value: 'catering.food_court' },
                { category: 'Ice Cream', emoji: '🍦', value: 'catering.ice_cream' }
              ].map((cat) => (
                <Link
                  key={cat.category}
                  to={`/search-results?location=Boston&categories=${cat.value}&distance=15`}
                  className="btn btn-outline-light btn-sm rounded-pill px-4 py-2"
                  style={{ 
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)"
                  }}
                >
                  {cat.emoji} {cat.category}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Locations Quick Access */}
        <div className="row mt-4">
          <div className="col-12">
            <h4 className="text-white mb-4">🔥 Popular Food Destinations</h4>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              {[
                { city: 'Boston', emoji: '🦞' },
                { city: 'New York', emoji: '🗽' },
                { city: 'Seattle', emoji: '🌧️' },
                { city: 'San Francisco', emoji: '🌉' },
                { city: 'Chicago', emoji: '🌆' },
                { city: 'Los Angeles', emoji: '☀️' }
              ].map((location) => (
                <Link
                  key={location.city}
                  to={`/search-results?location=${encodeURIComponent(location.city)}&categories=catering.cafe,catering.restaurant,catering.bar&distance=15`}
                  className="btn btn-outline-light btn-sm rounded-pill px-4 py-2"
                  style={{ 
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)"
                  }}
                >
                  {location.emoji} {location.city}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="row g-4 mt-5">
          <div className="col-md-4">
            <div 
              className="card h-100 border-0 shadow-lg text-center"
              style={{ 
                background: "rgba(255, 255, 255, 0.1)", 
                backdropFilter: "blur(10px)",
                borderRadius: "20px"
              }}
            >
              <div className="card-body p-4">
                <Search className="text-warning mb-3" size={48} />
                <h4 className="card-title text-white fw-bold">Smart Discovery</h4>
                <p className="card-text text-white-75">
                  Find restaurants, cafes, bars, and food courts near you with 
                  advanced filters for cuisine, price, and atmosphere.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div 
              className="card h-100 border-0 shadow-lg text-center"
              style={{ 
                background: "rgba(255, 255, 255, 0.1)", 
                backdropFilter: "blur(10px)",
                borderRadius: "20px"
              }}
            >
              <div className="card-body p-4">
                <Heart className="text-danger mb-3" size={48} />
                <h4 className="card-title text-white fw-bold">Food Collections</h4>
                <p className="card-text text-white-75">
                  Create collections of your favorite dining spots and 
                  never forget a great meal experience.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div 
              className="card h-100 border-0 shadow-lg text-center"
              style={{ 
                background: "rgba(255, 255, 255, 0.1)", 
                backdropFilter: "blur(10px)",
                borderRadius: "20px"
              }}
            >
              <div className="card-body p-4">
                <Users className="text-info mb-3" size={48} />
                <h4 className="card-title text-white fw-bold">Foodie Community</h4>
                <p className="card-text text-white-75">
                  Read and share honest reviews from fellow food enthusiasts 
                  about restaurants, bars, and eateries in your area.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="row mt-5 pt-5 border-top border-white border-opacity-25">
          <div className="col-md-3 col-6 text-center mb-4">
            <Utensils className="text-warning mb-2" size={32} />
            <h3 className="fw-bold text-white">50K+</h3>
            <p className="text-white-75 mb-0">Food Places</p>
          </div>
          <div className="col-md-3 col-6 text-center mb-4">
            <Star className="text-warning mb-2" size={32} />
            <h3 className="fw-bold text-white">100K+</h3>
            <p className="text-white-75 mb-0">Reviews</p>
          </div>
          <div className="col-md-3 col-6 text-center mb-4">
            <Heart className="text-danger mb-2" size={32} />
            <h3 className="fw-bold text-white">75K+</h3>
            <p className="text-white-75 mb-0">Favorites</p>
          </div>
          <div className="col-md-3 col-6 text-center mb-4">
            <MapPin className="text-info mb-2" size={32} />
            <h3 className="fw-bold text-white">200+</h3>
            <p className="text-white-75 mb-0">Cities</p>
          </div>
        </div>
      </div>

      {/* Floating Food Icons */}
      <div className="position-absolute" style={{ top: '15%', left: '10%', zIndex: 1 }}>
        <Utensils size={32} className="text-warning opacity-25 animate-bounce" />
      </div>
      <div className="position-absolute" style={{ top: '25%', right: '15%', zIndex: 1 }}>
        <span style={{ fontSize: '32px' }} className="text-warning opacity-25 animate-pulse">🍕</span>
      </div>
      <div className="position-absolute" style={{ bottom: '20%', left: '5%', zIndex: 1 }}>
        <span style={{ fontSize: '36px' }} className="text-warning opacity-25 animate-bounce">🍔</span>
      </div>
      <div className="position-absolute" style={{ bottom: '30%', right: '8%', zIndex: 1 }}>
        <span style={{ fontSize: '24px' }} className="text-warning opacity-25 animate-pulse">🍺</span>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        .text-white-75 {
          color: rgba(255, 255, 255, 0.9);
        }
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0,-30px,0);
          }
          70% {
            transform: translate3d(0,-15px,0);
          }
          90% {
            transform: translate3d(0,-4px,0);
          }
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}