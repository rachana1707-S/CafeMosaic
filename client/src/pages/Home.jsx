import React from "react";
import { Link } from "react-router-dom";
import { Coffee, Search, Heart, Star, MapPin, Users } from "lucide-react";
import backgroundImage from "../assets/coffee_home_bg.jpg"; // Coffee shop background

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
          <Coffee className="text-warning mb-4" size={80} />
          <h1 className="display-3 fw-bold mb-4 text-shadow">
            Welcome to CoffeeFinder
          </h1>
          <p className="lead fs-4 mb-5 text-white-75" style={{ maxWidth: "700px", margin: "0 auto" }}>
            Discover the perfect coffee shop for every moment. Whether you're looking for 
            a cozy study spot, a quick caffeine fix, or the perfect place for a coffee date, 
            we'll help you find your next favorite spot.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-5">
          <Link 
            to="/search" 
            className="btn btn-warning btn-lg shadow-lg px-5 py-3 rounded-pill fw-semibold d-flex align-items-center justify-content-center"
            style={{ minWidth: "200px" }}
          >
            <Search size={24} className="me-2" />
            Find Coffee Shops
          </Link>
          <Link 
            to="/reviews" 
            className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-semibold d-flex align-items-center justify-content-center"
            style={{ minWidth: "200px", backdropFilter: "blur(10px)" }}
          >
            <Star size={24} className="me-2" />
            Browse Reviews
          </Link>
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
                <h4 className="card-title text-white fw-bold">Smart Search</h4>
                <p className="card-text text-white-75">
                  Find coffee shops near you with advanced filters for distance, 
                  type, and amenities.
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
                <h4 className="card-title text-white fw-bold">Save Favorites</h4>
                <p className="card-text text-white-75">
                  Create collections of your favorite coffee shops and 
                  never forget a great spot.
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
                <h4 className="card-title text-white fw-bold">Community Reviews</h4>
                <p className="card-text text-white-75">
                  Read and share honest reviews from fellow coffee enthusiasts 
                  in your area.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="row mt-5 pt-5 border-top border-white border-opacity-25">
          <div className="col-md-3 col-6 text-center mb-4">
            <Coffee className="text-warning mb-2" size={32} />
            <h3 className="fw-bold text-white">10K+</h3>
            <p className="text-white-75 mb-0">Coffee Shops</p>
          </div>
          <div className="col-md-3 col-6 text-center mb-4">
            <Star className="text-warning mb-2" size={32} />
            <h3 className="fw-bold text-white">50K+</h3>
            <p className="text-white-75 mb-0">Reviews</p>
          </div>
          <div className="col-md-3 col-6 text-center mb-4">
            <Heart className="text-danger mb-2" size={32} />
            <h3 className="fw-bold text-white">25K+</h3>
            <p className="text-white-75 mb-0">Favorites</p>
          </div>
          <div className="col-md-3 col-6 text-center mb-4">
            <MapPin className="text-info mb-2" size={32} />
            <h3 className="fw-bold text-white">100+</h3>
            <p className="text-white-75 mb-0">Cities</p>
          </div>
        </div>
      </div>

      {/* Floating Coffee Icons */}
      <div className="position-absolute" style={{ top: '15%', left: '10%', zIndex: 1 }}>
        <Coffee size={32} className="text-warning opacity-25 animate-bounce" />
      </div>
      <div className="position-absolute" style={{ top: '25%', right: '15%', zIndex: 1 }}>
        <Coffee size={28} className="text-warning opacity-25 animate-pulse" />
      </div>
      <div className="position-absolute" style={{ bottom: '20%', left: '5%', zIndex: 1 }}>
        <Coffee size={36} className="text-warning opacity-25 animate-bounce" />
      </div>
      <div className="position-absolute" style={{ bottom: '30%', right: '8%', zIndex: 1 }}>
        <Coffee size={24} className="text-warning opacity-25 animate-pulse" />
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