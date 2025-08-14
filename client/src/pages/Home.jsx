import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Utensils, 
  Search, 
  Heart, 
  Star, 
  MapPin, 
  Users, 
  TrendingUp, 
  Award,
  ChefHat,
  Coffee,
  Wine,
  Camera,
  ArrowRight,
  Play
} from "lucide-react";
import backgroundImage from "../assets/food_home_bg.jpg"; // Food background

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const heroSlides = [
    {
      title: "Discover Amazing Food",
      subtitle: "Find restaurants, cafes, and bars near you",
      emoji: "🍽️"
    },
    {
      title: "Share Your Experience", 
      subtitle: "Review and rate your favorite dining spots",
      emoji: "⭐"
    },
    {
      title: "Build Your Collection",
      subtitle: "Save and organize places you love",
      emoji: "📝"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-vh-100 position-relative overflow-hidden">
      {/* Enhanced Background */}
      <div 
        className="position-absolute w-100 h-100"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          zIndex: -2
        }}
      />

      {/* Dark Overlay for Text Readability */}
      <div 
        className="position-absolute w-100 h-100"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(0, 0, 0, 0.4) 0%, 
              rgba(0, 0, 0, 0.3) 50%,
              rgba(0, 0, 0, 0.4) 100%
            )
          `,
          zIndex: -1
        }}
      />

      {/* Floating Food Elements */}
      <div className="position-absolute w-100 h-100" style={{ zIndex: 0 }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="position-absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          >
            <span style={{ 
              fontSize: `${12 + Math.random() * 16}px`,
              opacity: 0.05 + Math.random() * 0.1,
              filter: 'blur(0.5px)'
            }}>
              {['🍕', '🍔', '🍟', '🌮', '🍜', '🍝', '🥗', '🍰', '☕', '🍺', '🥘', '🍣'][Math.floor(Math.random() * 12)]}
            </span>
          </div>
        ))}
      </div>

      <div className="container py-5 position-relative" style={{ minHeight: '100vh', zIndex: 1 }}>
        {/* Enhanced Hero Section */}
        <div className="text-center mb-5" style={{ paddingTop: '120px' }}>
          <div className="mb-4 position-relative">
            <div 
              className="display-1 mb-0 hero-emoji"
              style={{ 
                fontSize: '5rem',
                filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.1))',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'scale(1.1)'
              }}
            >
              {heroSlides[currentSlide].emoji}
            </div>
          </div>
          
          <h1 
            className="display-2 fw-bold mb-4 gradient-text text-white"
            style={{
              textShadow: '3px 3px 6px rgba(0, 0, 0, 0.7), 0 0 20px rgba(255, 215, 0, 0.3)',
              filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))'
            }}
          >
            Welcome to FoodSocial
          </h1>
          
          <div style={{ height: '140px', overflow: 'hidden' }} className="mb-4">
            <div 
              className="transition-transform"
              style={{ 
                transform: `translateY(-${currentSlide * 140}px)`,
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {heroSlides.map((slide, index) => (
                <div key={index} style={{ height: '140px' }} className="px-3">
                  <h2 className="h2 fw-bold text-white mb-3" style={{ 
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)' 
                  }}>
                    {slide.title}
                  </h2>
                  <p className="lead text-white fs-5" style={{ 
                    maxWidth: '600px', 
                    margin: '0 auto',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
                  }}>
                    {slide.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Slide Indicators */}
          <div className="d-flex justify-content-center gap-3 mb-5">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`btn rounded-pill border-0 ${index === currentSlide ? 'active-indicator' : 'inactive-indicator'}`}
                style={{ 
                  width: index === currentSlide ? '40px' : '16px', 
                  height: '16px', 
                  padding: 0,
                  backgroundColor: index === currentSlide ? '#FFD700' : 'rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="row justify-content-center g-4 mb-5">
            <div className="col-auto">
              <Link 
                to="/search-food-places" 
                className="btn btn-lg shadow-lg px-5 py-4 rounded-pill fw-bold d-flex align-items-center text-dark position-relative overflow-hidden cta-primary"
                style={{ 
                  backgroundColor: "#FFD700", 
                  border: "none",
                  minWidth: "260px",
                  fontSize: '1.1rem',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <Search size={26} className="me-3" />
                Find Food Places
                <ArrowRight size={20} className="ms-3" />
              </Link>
            </div>
            <div className="col-auto">
              <Link 
                to="/browse-reviews" 
                className="btn btn-outline-primary btn-lg px-5 py-4 rounded-pill fw-bold d-flex align-items-center position-relative overflow-hidden cta-secondary"
                style={{ 
                  minWidth: "260px",
                  fontSize: '1.1rem',
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderWidth: '2px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <Star size={26} className="me-3" />
                Browse Reviews
                <Play size={18} className="ms-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Feature Cards Grid */}
        <div className="row g-4 mb-5">
          <div className="col-lg-4 col-md-6">
            <div 
              className="card h-100 border-0 shadow-lg text-center feature-card"
              style={{ 
                background: "linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.08) 100%)",
                backdropFilter: "blur(15px)",
                borderRadius: "28px",
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid rgba(255, 215, 0, 0.25)'
              }}
            >
              <div className="card-body p-5">
                <div 
                  className="icon-container rounded-4 d-inline-flex align-items-center justify-content-center mb-4"
                  style={{ 
                    width: '100px', 
                    height: '100px',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    boxShadow: '0 12px 35px rgba(255, 215, 0, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Search className="text-dark" size={42} />
                </div>
                <h4 className="card-title fw-bold mb-3 h3 text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Smart Discovery</h4>
                <p className="card-text text-white fs-6 mb-4" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                  Find restaurants, cafes, bars, and food courts near you with 
                  advanced filters for cuisine, price, and atmosphere.
                </p>
                <Link to="/search-food-places" className="btn btn-warning rounded-pill px-4 py-2 fw-semibold">
                  Start Exploring
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6">
            <div 
              className="card h-100 border-0 shadow-lg text-center feature-card"
              style={{ 
                background: "linear-gradient(135deg, rgba(220, 53, 69, 0.15) 0%, rgba(220, 53, 69, 0.08) 100%)",
                backdropFilter: "blur(15px)",
                borderRadius: "28px",
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid rgba(220, 53, 69, 0.25)'
              }}
            >
              <div className="card-body p-5">
                <div 
                  className="icon-container rounded-4 d-inline-flex align-items-center justify-content-center mb-4"
                  style={{ 
                    width: '100px', 
                    height: '100px',
                    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                    boxShadow: '0 12px 35px rgba(220, 53, 69, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Heart className="text-white" size={42} />
                </div>
                <h4 className="card-title fw-bold mb-3 h3 text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Food Collections</h4>
                <p className="card-text text-white fs-6 mb-4" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                  Create collections of your favorite dining spots and 
                  never forget a great meal experience.
                </p>
                <Link to="/my-collections" className="btn btn-danger rounded-pill px-4 py-2 fw-semibold">
                  Build Collections
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mx-auto">
            <div 
              className="card h-100 border-0 shadow-lg text-center feature-card"
              style={{ 
                background: "linear-gradient(135deg, rgba(13, 110, 253, 0.15) 0%, rgba(13, 110, 253, 0.08) 100%)",
                backdropFilter: "blur(15px)",
                borderRadius: "28px",
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid rgba(13, 110, 253, 0.25)'
              }}
            >
              <div className="card-body p-5">
                <div 
                  className="icon-container rounded-4 d-inline-flex align-items-center justify-content-center mb-4"
                  style={{ 
                    width: '100px', 
                    height: '100px',
                    background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
                    boxShadow: '0 12px 35px rgba(13, 110, 253, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Users className="text-white" size={42} />
                </div>
                <h4 className="card-title fw-bold mb-3 h3 text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Foodie Community</h4>
                <p className="card-text text-white fs-6 mb-4" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                  Read and share honest reviews from fellow food enthusiasts 
                  about restaurants, bars, and eateries in your area.
                </p>
                <Link to="/browse-reviews" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">
                  Join Community
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Food Categories */}
        <div className="text-center mb-5">
          <div className="mb-5">
            <h2 className="fw-bold mb-2 d-flex align-items-center justify-content-center h1 text-white">
              <ChefHat size={40} className="me-3 text-warning" />
              Explore Food Categories
            </h2>
            <p className="lead text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
              Discover amazing places by category
            </p>
          </div>
          
          <div className="row g-4">
            {[
              { category: 'Restaurants', emoji: '🍽️', value: 'catering.restaurant', color: '#dc3545', desc: 'Fine dining & casual' },
              { category: 'Fast Food', emoji: '🍔', value: 'catering.fast_food', color: '#fd7e14', desc: 'Quick & tasty meals' },
              { category: 'Cafes', emoji: '☕', value: 'catering.cafe', color: '#6f42c1', desc: 'Coffee & light bites' },
              { category: 'Food Courts', emoji: '🥘', value: 'catering.food_court', color: '#20c997', desc: 'Variety under one roof' },
              { category: 'Bars', emoji: '🍺', value: 'catering.bar', color: '#0dcaf0', desc: 'Cocktails & nightlife' },
              { category: 'Pubs', emoji: '🍻', value: 'catering.pub', color: '#198754', desc: 'Cozy drinking spots' },
              { category: 'Ice Cream', emoji: '🍦', value: 'catering.ice_cream', color: '#e91e63', desc: 'Sweet frozen treats' },
              { category: 'Beer Gardens', emoji: '🌳', value: 'catering.biergarten', color: '#4caf50', desc: 'Outdoor beer spots' },
              { category: 'Taprooms', emoji: '🍺', value: 'catering.taproom', color: '#ff9800', desc: 'Craft beer havens' }
            ].map((cat, index) => (
              <div key={cat.category} className="col-xl-4 col-lg-6 col-md-6">
                <Link
                  to={`/search-results?location=Boston&categories=${cat.value}&distance=15`}
                  className="btn w-100 rounded-4 p-4 text-white fw-semibold position-relative overflow-hidden category-card h-100 d-flex flex-column justify-content-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}DD 100%)`,
                    border: "none",
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    animationDelay: `${index * 0.1}s`,
                    minHeight: '120px',
                    boxShadow: `0 8px 25px ${cat.color}30`
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <span style={{ fontSize: '28px' }} className="me-3">{cat.emoji}</span>
                    <div className="text-start">
                      <div className="fw-bold fs-5">{cat.category}</div>
                      <small className="opacity-75">{cat.desc}</small>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Popular Cities */}
        <div className="text-center mb-5">
          <div className="mb-5">
            <h2 className="fw-bold mb-2 d-flex align-items-center justify-content-center h1 text-white">
              <TrendingUp size={40} className="me-3 text-success" />
              Popular Food Destinations
            </h2>
            <p className="lead text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
              Explore culinary scenes in top cities
            </p>
          </div>
          
          <div className="row g-4 justify-content-center">
            {[
              { city: 'Boston', emoji: '🦞', gradient: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', highlight: 'Seafood Capital' },
              { city: 'New York', emoji: '🗽', gradient: 'linear-gradient(135deg, #6f42c1 0%, #5a2d91 100%)', highlight: 'Pizza & Delis' },
              { city: 'Seattle', emoji: '🌧️', gradient: 'linear-gradient(135deg, #0dcaf0 0%, #0aa1c7 100%)', highlight: 'Coffee Culture' },
              { city: 'San Francisco', emoji: '🌉', gradient: 'linear-gradient(135deg, #fd7e14 0%, #e55a00 100%)', highlight: 'Tech Food Scene' },
              { city: 'Chicago', emoji: '🌆', gradient: 'linear-gradient(135deg, #198754 0%, #157347 100%)', highlight: 'Deep Dish & More' },
              { city: 'Los Angeles', emoji: '☀️', gradient: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)', highlight: 'Diverse Cuisine' }
            ].map((location, index) => (
              <div key={location.city} className="col-lg-4 col-md-6">
                <Link
                  to={`/search-results?location=${encodeURIComponent(location.city)}&categories=catering.cafe,catering.restaurant,catering.bar&distance=15`}
                  className="btn w-100 rounded-4 p-4 text-white fw-semibold position-relative overflow-hidden city-card"
                  style={{ 
                    background: location.gradient,
                    border: "none",
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    animationDelay: `${index * 0.1}s`,
                    minHeight: '100px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <span style={{ fontSize: '32px' }} className="me-3">{location.emoji}</span>
                    <div className="text-start">
                      <div className="fw-bold fs-4">{location.city}</div>
                      <small className="opacity-75">{location.highlight}</small>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Stats Section */}
        <div 
          className="card border-0 shadow-lg mb-5 stats-card"
          style={{ 
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.85) 100%)",
            backdropFilter: "blur(20px)",
            borderRadius: "32px",
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <div className="card-body p-5">
            <div className="text-center mb-5">
              <h2 className="fw-bold d-flex align-items-center justify-content-center h1 text-white">
                <Award size={40} className="me-3 text-warning" />
                FoodSocial by the Numbers
              </h2>
              <p className="lead text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                Join our growing community of food enthusiasts
              </p>
            </div>
            <div className="row text-center">
              <div className="col-lg-3 col-6 mb-4">
                <div 
                  className="rounded-4 p-4 h-100 stat-item"
                  style={{ 
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    border: '2px solid rgba(255, 215, 0, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Utensils className="text-warning mb-3" size={52} />
                  <h2 className="fw-bold text-dark mb-2 display-6">50K+</h2>
                  <p className="text-muted mb-0 fw-semibold fs-6">Food Places</p>
                  <small className="text-muted">Restaurants, cafes & more</small>
                </div>
              </div>
              <div className="col-lg-3 col-6 mb-4">
                <div 
                  className="rounded-4 p-4 h-100 stat-item"
                  style={{ 
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    border: '2px solid rgba(255, 193, 7, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Star className="text-warning mb-3" size={52} />
                  <h2 className="fw-bold text-dark mb-2 display-6">125K+</h2>
                  <p className="text-muted mb-0 fw-semibold fs-6">Reviews</p>
                  <small className="text-muted">Honest food experiences</small>
                </div>
              </div>
              <div className="col-lg-3 col-6 mb-4">
                <div 
                  className="rounded-4 p-4 h-100 stat-item"
                  style={{ 
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    border: '2px solid rgba(220, 53, 69, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Heart className="text-danger mb-3" size={52} />
                  <h2 className="fw-bold text-dark mb-2 display-6">85K+</h2>
                  <p className="text-muted mb-0 fw-semibold fs-6">Favorites</p>
                  <small className="text-muted">Places people love</small>
                </div>
              </div>
              <div className="col-lg-3 col-6 mb-4">
                <div 
                  className="rounded-4 p-4 h-100 stat-item"
                  style={{ 
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    border: '2px solid rgba(13, 110, 253, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <MapPin className="text-primary mb-3" size={52} />
                  <h2 className="fw-bold text-dark mb-2 display-6">500+</h2>
                  <p className="text-muted mb-0 fw-semibold fs-6">Cities</p>
                  <small className="text-muted">Worldwide coverage</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Footer */}
        <div className="text-center">
          <div 
            className="card border-0 shadow-lg cta-footer"
            style={{ 
              background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
              borderRadius: "32px",
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div className="card-body p-5 position-relative">
              <div 
                className="position-absolute w-100 h-100 top-0 start-0"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                  pointerEvents: 'none'
                }}
              />
              <h2 className="fw-bold text-white mb-3 display-5" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                Ready to Start Your Food Journey?
              </h2>
              <p className="lead text-white mb-4 fs-4" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                Join thousands of food lovers discovering amazing places every day
              </p>
              <div className="d-flex flex-column flex-sm-row gap-4 justify-content-center">
                <Link 
                  to="/register" 
                  className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold cta-button"
                  style={{ fontSize: '1.1rem', minWidth: '200px', color: '#333' }}
                >
                  Sign Up Free
                </Link>
                <Link 
                  to="/search-food-places" 
                  className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold cta-button"
                  style={{ 
                    fontSize: '1.1rem', 
                    minWidth: '200px',
                    borderWidth: '2px'
                  }}
                >
                  Start Exploring
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.05;
          }
          33% { 
            transform: translateY(-15px) rotate(2deg); 
            opacity: 0.15;
          }
          66% { 
            transform: translateY(8px) rotate(-2deg); 
            opacity: 0.08;
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .hero-emoji {
          animation: heroFloat 3s ease-in-out infinite;
        }
        
        @keyframes heroFloat {
          0%, 100% { transform: scale(1.1) translateY(0px); }
          50% { transform: scale(1.15) translateY(-10px); }
        }
        
        .feature-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
        }
        
        .feature-card:hover .icon-container {
          transform: scale(1.1) rotateY(10deg);
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
        }
        
        .category-card {
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
          transform: translateY(40px);
        }
        
        .category-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 15px 40px rgba(0,0,0,0.25) !important;
        }
        
        .city-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 12px 35px rgba(0,0,0,0.2) !important;
        }
        
        .stat-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          border-color: rgba(255, 215, 0, 0.4) !important;
        }
        
        .cta-primary:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 15px 40px rgba(255, 215, 0, 0.4) !important;
          background: linear-gradient(135deg, #FFA500 0%, #FFD700 100%) !important;
        }
        
        .cta-secondary:hover {
          transform: translateY(-4px) scale(1.05);
          background-color: rgba(13, 110, 253, 0.1) !important;
          box-shadow: 0 15px 40px rgba(13, 110, 253, 0.2) !important;
        }
        
        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.2);
        }
        
        .stats-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.1) !important;
        }
        
        .cta-footer:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 50px rgba(255, 165, 0, 0.3) !important;
        }
        
        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .transition-transform {
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Responsive enhancements */
        @media (max-width: 768px) {
          .hero-emoji {
            font-size: 3.5rem !important;
          }
          
          .display-2 {
            font-size: 2.5rem !important;
          }
          
          .category-card, .city-card {
            min-height: 90px !important;
          }
        }
      `}</style>
    </div>
  );
}