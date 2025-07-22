import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import logo from "../assets/navbar_logo_desktop.jpeg";

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
      className={`navbar navbar-expand-lg fixed-top w-100 py-0 ${
        isScrolled ? "bg-white shadow-sm" : "bg-white"
      }`}
      style={{ zIndex: 1030, transition: "background-color 0.3s ease" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="PlanVoyage" style={{ height: "40px" }} />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ backgroundColor: "#f0f0f0" }}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
          style={{
            backgroundColor: "#f8f9fa",
            padding: "0.5rem",
            borderRadius: "0.5rem",
          }}
        >
          <ul className="navbar-nav ms-auto fw-semibold text-center">
            <li className="nav-item">
              <Link
                to="/"
                className="nav-link px-3 py-2"
                style={underlineHover}
                onMouseEnter={(e) =>
                  (e.target.style.borderBottomColor = "#0d6efd")
                }
                onMouseLeave={(e) =>
                  (e.target.style.borderBottomColor = "transparent")
                }
              >
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/plan-trips"
                className="nav-link px-3 py-2"
                style={underlineHover}
                onMouseEnter={(e) =>
                  (e.target.style.borderBottomColor = "#0d6efd")
                }
                onMouseLeave={(e) =>
                  (e.target.style.borderBottomColor = "transparent")
                }
              >
                Plan Your Trip
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/suggested-plans"
                className="nav-link px-3 py-2"
                style={underlineHover}
                onMouseEnter={(e) =>
                  (e.target.style.borderBottomColor = "#0d6efd")
                }
                onMouseLeave={(e) =>
                  (e.target.style.borderBottomColor = "transparent")
                }
              >
                Suggested Iteninaries
              </Link>
            </li>

            {user && (
              <>
                <li className="nav-item">
                  <Link
                    to="/saved-plans"
                    className="nav-link px-3 py-2"
                    style={underlineHover}
                    onMouseEnter={(e) =>
                      (e.target.style.borderBottomColor = "#0d6efd")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.borderBottomColor = "transparent")
                    }
                  >
                    View Saved Plans
                  </Link>
                </li>

                <li className="nav-item d-lg-none">
                  <Link
                    to="/my-suggestions"
                    className="nav-link px-3 py-2"
                    style={underlineHover}
                    onMouseEnter={(e) =>
                      (e.target.style.borderBottomColor = "#0d6efd")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.borderBottomColor = "transparent")
                    }
                  >
                    My Suggestions
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
                      (e.target.style.borderBottomColor = "#0d6efd")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.borderBottomColor = "transparent")
                    }
                  >
                    Logout
                  </button>
                </li>

                {/* Username with dropdown only on laptop and larger */}
                <li className="nav-item dropdown d-none d-lg-block">
                  <button
                    className="nav-link dropdown-toggle px-3 py-2 btn btn-link"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      ...underlineHover,
                      textDecoration: "none",
                      color: "inherit",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.borderBottomColor = "#0d6efd")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.borderBottomColor = "transparent")
                    }
                  >
                    {user.username}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <Link to="/my-suggestions" className="dropdown-item">
                        My Suggestions
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item">
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
                  className="nav-link px-3 py-2"
                  style={underlineHover}
                  onMouseEnter={(e) =>
                    (e.target.style.borderBottomColor = "#0d6efd")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.borderBottomColor = "transparent")
                  }
                >
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
