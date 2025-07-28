import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import { Utensils, Search, Heart, Star, MapPin, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuthUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  const underlineHover = {
    transition: "border-bottom 0.3s ease",
    borderBottom: "2px solid transparent",
  };

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top w-100 py-2 ${
        isScrolled ? "shadow-lg" : ""
      }`}
      style={{ 
        zIndex: 1030, 
        transition: "all 0.3s ease",
        backgroundColor: "#f8f8ff", // Off-white color
        backdropFilter: "blur(10px)"
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <Utensils className="me-2" style={{ color: "#FFD700" }} size={32} />
          <span className="fw-bold text-dark" style={{ fontSize: '1.5rem' }}>
            FoodSocial
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ backgroundColor: "#f0f0f0", border: "1px solid #ddd" }}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
          style={{
            backgroundColor: "#f0f0f0", // Light off-white
            padding: "0.5rem",
            borderRadius: "0.75rem",
            marginTop: "0.5rem"
          }}
        >
          <ul className="navbar-nav ms-auto fw-semibold text-center">
            {/* Home */}
            <li className="nav-item">
              <Link
                to="/"
                className="nav-link px-3 py-2 d-flex align-items-center justify-content-center"
                style={underlineHover}
                onMouseEnter={(e) =>
                  (e.target.style.borderBottomColor = "#FFD700")
                }
                onMouseLeave={(e) =>
                  (e.target.style.borderBottomColor = "transparent")
                }
              >
                <Utensils size={18} className="me-1" />
                Home
              </Link>
            </li>

            {/* Search Food Places */}
            <li className="nav-item">
              <Link
                to="/search-food-places"
                className="nav-link px-3 py-2 d-flex align-items-center justify-content-center"
                style={underlineHover}
                onMouseEnter={(e) =>
                  (e.target.style.borderBottomColor = "#ffc107")
                }
                onMouseLeave={(e) =>
                  (e.target.style.borderBottomColor = "transparent")
                }
              >
                <Search size={18} className="me-1" />
                Find Food Places
              </Link>
            </li>

            {/* Browse Reviews */}
            <li className="nav-item">
              <Link
                to="/browse-reviews"
                className="nav-link px-3 py-2 d-flex align-items-center justify-content-center"
                style={underlineHover}
                onMouseEnter={(e) =>
                  (e.target.style.borderBottomColor = "#ffc107")
                }
                onMouseLeave={(e) =>
                  (e.target.style.borderBottomColor = "transparent")
                }
              >
                <Star size={18} className="me-1" />
                Reviews
              </Link>
            </li>

            {/* Food Map */}
            <li className="nav-item">
              <Link
                to="/food-map"
                className="nav-link px-3 py-2 d-flex align-items-center justify-content-center"
                style={underlineHover}
                onMouseEnter={(e) =>
                  (e.target.style.borderBottomColor = "#ffc107")
                }
                onMouseLeave={(e) =>
                  (e.target.style.borderBottomColor = "transparent")
                }
              >
                <MapPin size={18} className="me-1" />
                Map
              </Link>
            </li>

            {user && (
              <>
                {/* My Favorites */}
                <li className="nav-item">
                  <Link
                    to="/my-favorites"
                    className="nav-link px-3 py-2 d-flex align-items-center justify-content-center"
                    style={underlineHover}
                    onMouseEnter={(e) =>
                      (e.target.style.borderBottomColor = "#ffc107")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.borderBottomColor = "transparent")
                    }
                  >
                    <Heart size={18} className="me-1" />
                    My Favorites
                  </Link>
                </li>

                {/* Mobile-only menu items */}
                <li className="nav-item d-lg-none">
                  <Link
                    to="/my-collections"
                    className="nav-link px-3 py-2"
                    style={underlineHover}
                    onMouseEnter={(e) =>
                      (e.target.style.borderBottomColor = "#ffc107")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.borderBottomColor = "transparent")
                    }
                  >
                    My Collections
                  </Link>
                </li>

                <li className="nav-item d-lg-none">
                  <Link
                    to="/my-reviews"
                    className="nav-link px-3 py-2"
                    style={underlineHover}
                    onMouseEnter={(e) =>
                      (e.target.style.borderBottomColor = "#ffc107")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.borderBottomColor = "transparent")
                    }
                  >
                    My Reviews
                  </Link>
                </li>

                <li className="nav-item d-lg-none">
                  <Link
                    to="/my-visits"
                    className="nav-link px-3 py-2"
                    style={underlineHover}
                    onMouseEnter={(e) =>
                      (e.target.style.borderBottomColor = "#ffc107")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.borderBottomColor = "transparent")
                    }
                  >
                    My Food Journey
                  </Link>
                </li>

                <li className="nav-item d-lg-none">
                  <button
                    onClick={handleLogout}
                    className="nav-link px-3 py-2 btn btn-link"
                    style={{
                      ...underlineHover,
                      textDecoration: "none",
                      color: "inherit",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.borderBottomColor = "#ffc107")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.borderBottomColor = "transparent")
                    }
                  >
                    Logout
                  </button>
                </li>

                {/* Desktop dropdown menu */}
                {/* Desktop dropdown menu - Custom Implementation */}
                <li className="nav-item d-none d-lg-block">
                  <div className="position-relative user-dropdown">
                    <button
                      className="nav-link px-3 py-2 btn btn-link d-flex align-items-center"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        border: "none",
                        background: "none"
                      }}
                    >
                      <User size={18} className="me-1" />
                      {user.username}
                      <span className="ms-1">▼</span>
                    </button>
                    
                    {dropdownOpen && (
                      <div
                        className="position-absolute bg-white shadow-lg rounded"
                        style={{
                          top: '100%',
                          right: '0',
                          minWidth: '200px',
                          zIndex: 1000,
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px'
                        }}
                      >
                        <Link 
                          to="/profile" 
                          className="dropdown-item d-flex align-items-center px-3 py-2 text-decoration-none"
                          onClick={() => setDropdownOpen(false)}
                          style={{ color: '#333' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <User size={16} className="me-2" />
                          Profile Settings
                        </Link>
                        
                        <hr className="dropdown-divider my-1" />
                        
                        <button 
                          onClick={handleLogout} 
                          className="dropdown-item d-flex align-items-center px-3 py-2 text-danger w-100 border-0 bg-transparent"
                          style={{ textAlign: 'left' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <i className="fas fa-sign-out-alt me-2"></i>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              </>
            )}

            {!user && (
              <li className="nav-item">
                <Link
                  to="/login"
                  className="nav-link px-3 py-2 d-flex align-items-center justify-content-center"
                  style={underlineHover}
                  onMouseEnter={(e) =>
                    (e.target.style.borderBottomColor = "#ffc107")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.borderBottomColor = "transparent")
                  }
                >
                  <User size={18} className="me-1" />
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}