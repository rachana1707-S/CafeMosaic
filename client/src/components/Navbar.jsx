import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import { Coffee, Search, Heart, Star, MapPin, User } from "lucide-react";
import logo from "../assets/coffee_logo.png"; // Coffee shop logo

export default function Navbar() {
  const { user, logout } = useAuthUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const underlineHover = {
    transition: "border-bottom 0.3s ease",
    borderBottom: "2px solid transparent",
  };

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top w-100 py-2 ${
        isScrolled ? "bg-white shadow-lg" : "bg-white"
      }`}
      style={{ 
        zIndex: 1030, 
        transition: "all 0.3s ease",
        backdropFilter: "blur(10px)"
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <Coffee className="text-warning me-2" size={32} />
          <span className="fw-bold text-dark" style={{ fontSize: '1.5rem' }}>
            CoffeeFinder
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
            backgroundColor: "#f8f9fa",
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
                  (e.target.style.borderBottomColor = "#ffc107")
                }
                onMouseLeave={(e) =>
                  (e.target.style.borderBottomColor = "transparent")
                }
              >
                <Coffee size={18} className="me-1" />
                Home
              </Link>
            </li>

            {/* Search Coffee Shops */}
            <li className="nav-item">
              <Link
                to="/search"
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
                Find Coffee Shops
              </Link>
            </li>

            {/* Browse Reviews */}
            <li className="nav-item">
              <Link
                to="/reviews"
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

            {/* Coffee Shop Map */}
            <li className="nav-item">
              <Link
                to="/map"
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
                    My Visits
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
                <li className="nav-item dropdown d-none d-lg-block">
                  <button
                    className="nav-link dropdown-toggle px-3 py-2 btn btn-link d-flex align-items-center"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
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
                    <User size={18} className="me-1" />
                    {user.username}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end shadow-lg"
                    aria-labelledby="userDropdown"
                    style={{ borderRadius: "0.75rem", border: "none" }}
                  >
                    <li>
                      <Link to="/my-collections" className="dropdown-item">
                        <Coffee size={16} className="me-2" />
                        My Collections
                      </Link>
                    </li>
                    <li>
                      <Link to="/my-reviews" className="dropdown-item">
                        <Star size={16} className="me-2" />
                        My Reviews
                      </Link>
                    </li>
                    <li>
                      <Link to="/my-visits" className="dropdown-item">
                        <MapPin size={16} className="me-2" />
                        My Visits
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link to="/profile" className="dropdown-item">
                        <User size={16} className="me-2" />
                        Profile Settings
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item text-danger">
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
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