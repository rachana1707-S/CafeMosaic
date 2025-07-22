import React from "react";
import { Link } from "react-router-dom";
import { Coffee, Heart, Mail, MapPin, Phone, Star } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-5 mt-auto">
      <div className="container">
        <div className="row g-4">
          
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center mb-3">
              <Coffee className="text-warning me-2" size={32} />
              <h4 className="mb-0 fw-bold text-warning">CoffeeFinder</h4>
            </div>
            <p className="text-muted mb-3">
              Discover the best coffee shops in your area. Read reviews, save favorites, 
              and explore the perfect coffee experience tailored just for you.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-warning" aria-label="Facebook">
                <i className="fab fa-facebook-f fa-lg"></i>
              </a>
              <a href="#" className="text-warning" aria-label="Twitter">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="text-warning" aria-label="Instagram">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
              <a href="#" className="text-warning" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in fa-lg"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-3 col-sm-6">
            <h6 className="fw-semibold mb-3 text-warning">Explore</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/search" className="text-muted text-decoration-none hover-text-warning">
                  Find Coffee Shops
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/reviews" className="text-muted text-decoration-none hover-text-warning">
                  Browse Reviews
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/map" className="text-muted text-decoration-none hover-text-warning">
                  Coffee Shop Map
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/categories" className="text-muted text-decoration-none hover-text-warning">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* User Account */}
          <div className="col-lg-2 col-md-3 col-sm-6">
            <h6 className="fw-semibold mb-3 text-warning">Account</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/login" className="text-muted text-decoration-none hover-text-warning">
                  Login
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-muted text-decoration-none hover-text-warning">
                  Sign Up
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/my-favorites" className="text-muted text-decoration-none hover-text-warning">
                  My Favorites
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/my-reviews" className="text-muted text-decoration-none hover-text-warning">
                  My Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Info */}
          <div className="col-lg-2 col-md-6 col-sm-6">
            <h6 className="fw-semibold mb-3 text-warning">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/about" className="text-muted text-decoration-none hover-text-warning">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-muted text-decoration-none hover-text-warning">
                  Contact
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/privacy" className="text-muted text-decoration-none hover-text-warning">
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="text-muted text-decoration-none hover-text-warning">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-2 col-md-6">
            <h6 className="fw-semibold mb-3 text-warning">Contact</h6>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <Mail size={16} className="text-warning me-2" />
                <a href="mailto:hello@coffeefinder.com" className="text-muted text-decoration-none">
                  hello@coffeefinder.com
                </a>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <Phone size={16} className="text-warning me-2" />
                <a href="tel:+1-555-COFFEE" className="text-muted text-decoration-none">
                  +1 (555) COFFEE
                </a>
              </li>
              <li className="mb-2 d-flex align-items-start">
                <MapPin size={16} className="text-warning me-2 mt-1 flex-shrink-0" />
                <span className="text-muted small">
                  123 Coffee Street<br />
                  Bean City, BC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        {/* Bottom Section */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 text-muted">
              &copy; {currentYear} CoffeeFinder. Made with{" "}
              <Heart size={14} className="text-danger mx-1" fill="currentColor" />
              for coffee lovers everywhere.
            </p>
          </div>
          <div className="col-md-6 text-md-end mt-3 mt-md-0">
            <div className="d-flex justify-content-md-end justify-content-center align-items-center gap-3">
              <span className="text-muted small">Powered by Geoapify</span>
              <div className="d-flex align-items-center">
                <Star size={14} className="text-warning me-1" fill="currentColor" />
                <small className="text-muted">Rate us on</small>
                <a href="#" className="text-warning ms-1 text-decoration-none">
                  <i className="fab fa-google"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .hover-text-warning:hover {
          color: #ffc107 !important;
          transition: color 0.2s ease;
        }
        
        .fab, .fas {
          transition: transform 0.2s ease;
        }
        
        .fab:hover, .fas:hover {
          transform: scale(1.1);
        }
      `}</style>
    </footer>
  );
}