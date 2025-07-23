import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            
            {/* Coffee Icon Animation */}
            <div className="mb-4">
              <Coffee 
                size={120} 
                className="text-warning animate-bounce" 
                style={{ 
                  filter: 'drop-shadow(0 4px 8px rgba(255, 193, 7, 0.3))',
                  animation: 'bounce 2s infinite'
                }}
              />
            </div>

            {/* 404 Title */}
            <h1 className="display-1 fw-bold text-warning mb-3">
              404
            </h1>
            
            <h2 className="h3 fw-bold text-dark mb-4">
              Oops! Coffee Shop Not Found
            </h2>
            
            <p className="lead text-muted mb-4">
              Looks like this coffee shop went out of business, or maybe you took a wrong turn. 
              Don't worry, there are plenty of other great coffee spots to discover!
            </p>

            {/* Helpful Message */}
            <div 
              className="alert alert-info border-0 rounded-3 mb-4" 
              style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)' }}
            >
              <Coffee size={20} className="text-warning me-2" />
              <strong>Coffee Tip:</strong> Try searching for coffee shops in your area or browse our featured locations.
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-4">
              <Link 
                to="/" 
                className="btn btn-warning btn-lg rounded-pill px-4 d-flex align-items-center justify-content-center"
                style={{ minWidth: '180px' }}
              >
                <Home size={20} className="me-2" />
                Go Home
              </Link>
              
              <Link 
                to="/search" 
                className="btn btn-outline-warning btn-lg rounded-pill px-4 d-flex align-items-center justify-content-center"
                style={{ minWidth: '180px' }}
              >
                <Search size={20} className="me-2" />
                Find Coffee Shops
              </Link>
            </div>

            {/* Back Button */}
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-link text-muted text-decoration-none d-flex align-items-center justify-content-center mx-auto"
              style={{ width: 'fit-content' }}
            >
              <ArrowLeft size={16} className="me-1" />
              Go Back
            </button>

            {/* Popular Suggestions */}
            <div className="mt-5 pt-4 border-top">
              <h6 className="text-muted mb-3">Popular Coffee Shop Categories:</h6>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <Link to="/search?category=cafe" className="badge bg-light text-dark text-decoration-none p-2 rounded-pill">
                  ☕ Cafes
                </Link>
                <Link to="/search?category=chain" className="badge bg-light text-dark text-decoration-none p-2 rounded-pill">
                  🏪 Chains
                </Link>
                <Link to="/search?category=local" className="badge bg-light text-dark text-decoration-none p-2 rounded-pill">
                  🌟 Local Roasters
                </Link>
                <Link to="/search?category=drive-thru" className="badge bg-light text-dark text-decoration-none p-2 rounded-pill">
                  🚗 Drive-Thru
                </Link>
              </div>
            </div>

            {/* Fun Coffee Facts */}
            <div className="mt-4 p-3 bg-white rounded-3 shadow-sm">
              <h6 className="text-warning mb-2">
                <Coffee size={18} className="me-1" />
                Coffee Fact
              </h6>
              <p className="small text-muted mb-0">
                Did you know? The word "coffee" comes from the Arabic word "qahwah," 
                which was originally used to describe wine.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
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
        
        .btn:hover {
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }
        
        .badge:hover {
          transform: scale(1.05);
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
}