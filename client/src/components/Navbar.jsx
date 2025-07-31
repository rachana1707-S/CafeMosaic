// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuthUser } from "../context/AuthContext";
// import { Utensils, Search, Heart, Star, MapPin, User } from "lucide-react";

// export default function Navbar() {
//   const { user, logout } = useAuthUser();
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     // Close dropdown when clicking outside
//     const handleClickOutside = (event) => {
//       if (!event.target.closest('.user-dropdown')) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//     setDropdownOpen(false);
//   };

//   const underlineHover = {
//     transition: "border-bottom 0.3s ease",
//     borderBottom: "2px solid transparent",
//   };

//   return (
//     <nav
//       className={`navbar navbar-expand-lg fixed-top w-100 py-2 ${
//         isScrolled ? "shadow-lg" : ""
//       }`}
//       style={{ 
//         zIndex: 1030, 
//         transition: "all 0.3s ease",
//         backgroundColor: "#f8f8ff", // Off-white color
//         backdropFilter: "blur(10px)"
//       }}
//     >
//       <div className="container-fluid">
//         <Link className="navbar-brand d-flex align-items-center" to="/">
//           <Utensils className="me-2" style={{ color: "#FFD700" }} size={32} />
//           <span className="fw-bold text-dark" style={{ fontSize: '1.5rem' }}>
//             FoodSocial
//           </span>
//         </Link>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//           style={{ backgroundColor: "#f0f0f0", border: "1px solid #ddd" }}
//         >
//           <span className="navbar-toggler-icon" />
//         </button>

//         <div
//           className="collapse navbar-collapse"
//           id="navbarNav"
//           style={{
//             backgroundColor: "#f0f0f0", // Light off-white
//             padding: "0.5rem",
//             borderRadius: "0.75rem",
//             marginTop: "0.5rem"
//           }}
//         >
//           <ul className="navbar-nav ms-auto fw-semibold text-center">
//             {/* Home */}
//             <li className="nav-item">
//               <Link
//                 to="/"
//                 className="nav-link px-3 py-2 d-flex align-items-center justify-content-center"
//                 style={underlineHover}
//                 onMouseEnter={(e) =>
//                   (e.target.style.borderBottomColor = "#FFD700")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.target.style.borderBottomColor = "transparent")
//                 }
//               >
//                 <Utensils size={18} className="me-1" />
//                 Home
//               </Link>
//             </li>

//             {/* Search Food Places */}
//             <li className="nav-item">
//               <Link
//                 to="/search-food-places"
//                 className="nav-link px-3 py-2 d-flex align-items-center justify-content-center"
//                 style={underlineHover}
//                 onMouseEnter={(e) =>
//                   (e.target.style.borderBottomColor = "#ffc107")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.target.style.borderBottomColor = "transparent")
//                 }
//               >
//                 <Search size={18} className="me-1" />
//                 Find Food Places
//               </Link>
//             </li>

//             {/* Browse Reviews */}
//             <li className="nav-item">
//               <Link
//                 to="/browse-reviews"
//                 className="nav-link px-3 py-2 d-flex align-items-center justify-content-center"
//                 style={underlineHover}
//                 onMouseEnter={(e) =>
//                   (e.target.style.borderBottomColor = "#ffc107")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.target.style.borderBottomColor = "transparent")
//                 }
//               >
//                 <Star size={18} className="me-1" />
//                 Reviews
//               </Link>
//             </li>

//             {/* Food Map */}
//             <li className="nav-item">
//               <Link
//                 to="/food-map"
//                 className="nav-link px-3 py-2 d-flex align-items-center justify-content-center"
//                 style={underlineHover}
//                 onMouseEnter={(e) =>
//                   (e.target.style.borderBottomColor = "#ffc107")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.target.style.borderBottomColor = "transparent")
//                 }
//               >
//                 <MapPin size={18} className="me-1" />
//                 Map
//               </Link>
//             </li>

//             {user && (
//               <>
//                 {/* My Favorites */}
//                 <li className="nav-item">
//                   <Link
//                     to="/my-favorites"
//                     className="nav-link px-3 py-2 d-flex align-items-center justify-content-center"
//                     style={underlineHover}
//                     onMouseEnter={(e) =>
//                       (e.target.style.borderBottomColor = "#ffc107")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.target.style.borderBottomColor = "transparent")
//                     }
//                   >
//                     <Heart size={18} className="me-1" />
//                     My Favorites
//                   </Link>
//                 </li>

//                 {/* Mobile-only menu items */}
//                 <li className="nav-item d-lg-none">
//                   <Link
//                     to="/my-collections"
//                     className="nav-link px-3 py-2"
//                     style={underlineHover}
//                     onMouseEnter={(e) =>
//                       (e.target.style.borderBottomColor = "#ffc107")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.target.style.borderBottomColor = "transparent")
//                     }
//                   >
//                     My Collections
//                   </Link>
//                 </li>

//                 <li className="nav-item d-lg-none">
//                   <Link
//                     to="/my-reviews"
//                     className="nav-link px-3 py-2"
//                     style={underlineHover}
//                     onMouseEnter={(e) =>
//                       (e.target.style.borderBottomColor = "#ffc107")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.target.style.borderBottomColor = "transparent")
//                     }
//                   >
//                     My Reviews
//                   </Link>
//                 </li>

//                 <li className="nav-item d-lg-none">
//                   <Link
//                     to="/my-visits"
//                     className="nav-link px-3 py-2"
//                     style={underlineHover}
//                     onMouseEnter={(e) =>
//                       (e.target.style.borderBottomColor = "#ffc107")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.target.style.borderBottomColor = "transparent")
//                     }
//                   >
//                     My Food Journey
//                   </Link>
//                 </li>

//                 <li className="nav-item d-lg-none">
//                   <button
//                     onClick={handleLogout}
//                     className="nav-link px-3 py-2 btn btn-link"
//                     style={{
//                       ...underlineHover,
//                       textDecoration: "none",
//                       color: "inherit",
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.target.style.borderBottomColor = "#ffc107")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.target.style.borderBottomColor = "transparent")
//                     }
//                   >
//                     Logout
//                   </button>
//                 </li>

//                 {/* Desktop dropdown menu */}
//                 {/* Desktop dropdown menu - Custom Implementation */}
//                 <li className="nav-item d-none d-lg-block">
//                   <div className="position-relative user-dropdown">
//                     <button
//                       className="nav-link px-3 py-2 btn btn-link d-flex align-items-center"
//                       onClick={() => setDropdownOpen(!dropdownOpen)}
//                       style={{
//                         textDecoration: "none",
//                         color: "inherit",
//                         border: "none",
//                         background: "none"
//                       }}
//                     >
//                       <User size={18} className="me-1" />
//                       {user.username}
//                       <span className="ms-1">▼</span>
//                     </button>
                    
//                     {dropdownOpen && (
//                       <div
//                         className="position-absolute bg-white shadow-lg rounded"
//                         style={{
//                           top: '100%',
//                           right: '0',
//                           minWidth: '200px',
//                           zIndex: 1000,
//                           border: '1px solid #e0e0e0',
//                           borderRadius: '8px'
//                         }}
//                       >
//                         <Link 
//                           to="/profile" 
//                           className="dropdown-item d-flex align-items-center px-3 py-2 text-decoration-none"
//                           onClick={() => setDropdownOpen(false)}
//                           style={{ color: '#333' }}
//                           onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
//                           onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                         >
//                           <User size={16} className="me-2" />
//                           Profile Settings
//                         </Link>
                        
//                         <hr className="dropdown-divider my-1" />
                        
//                         <button 
//                           onClick={handleLogout} 
//                           className="dropdown-item d-flex align-items-center px-3 py-2 text-danger w-100 border-0 bg-transparent"
//                           style={{ textAlign: 'left' }}
//                           onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
//                           onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                         >
//                           <i className="fas fa-sign-out-alt me-2"></i>
//                           Logout
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </li>
//               </>
//             )}

//             {!user && (
//               <li className="nav-item">
//                 <Link
//                   to="/login"
//                   className="nav-link px-3 py-2 d-flex align-items-center justify-content-center"
//                   style={underlineHover}
//                   onMouseEnter={(e) =>
//                     (e.target.style.borderBottomColor = "#ffc107")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.target.style.borderBottomColor = "transparent")
//                   }
//                 >
//                   <User size={18} className="me-1" />
//                   Login
//                 </Link>
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }


import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import { 
  Utensils, 
  Search, 
  Heart, 
  Star, 
  MapPin, 
  User, 
  Folder,
  ChevronDown,
  Plus
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuthUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if current route is active
  const isActiveRoute = (routePath) => {
    if (routePath === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(routePath);
  };

  // Helper function to check if any route in the library group is active
  const isLibraryActive = () => {
    const libraryRoutes = ['/my-favorites', '/my-collections', '/my-reviews', '/my-visits'];
    return libraryRoutes.some(route => location.pathname.startsWith(route));
  };

  // Style for active nav items
  const getNavLinkStyle = (routePath) => ({
    ...underlineHover,
    borderBottomColor: isActiveRoute(routePath) ? "#FFD700" : "transparent",
    color: isActiveRoute(routePath) ? "#000" : "inherit"
  });

  // Style for library dropdown button
  const getLibraryDropdownStyle = () => ({
    textDecoration: "none",
    color: isLibraryActive() ? "#000" : "inherit",
    border: "none",
    background: "none",
    borderBottom: "2px solid " + (isLibraryActive() ? "#FFD700" : "transparent"),
    transition: "border-bottom 0.3s ease"
  });

  // Style for user dropdown button  
  const getUserDropdownStyle = () => ({
    textDecoration: "none",
    color: isActiveRoute('/profile') ? "#000" : "inherit",
    border: "none",
    background: "none",
    borderBottom: "2px solid " + (isActiveRoute('/profile') ? "#FFD700" : "transparent"),
    transition: "border-bottom 0.3s ease"
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
      if (!event.target.closest('.collections-dropdown')) {
        setCollectionsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setUserDropdownOpen(false);
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
                className="nav-link px-3 py-2 d-flex align-items-center justify-content-center text-dark"
                style={getNavLinkStyle('/')}
                onMouseEnter={(e) => {
                  if (!isActiveRoute('/')) {
                    e.target.style.borderBottomColor = "#FFD700";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute('/')) {
                    e.target.style.borderBottomColor = "transparent";
                  }
                }}
              >
                <Utensils size={18} className="me-1" />
                Home
              </Link>
            </li>

            {/* Search Food Places */}
            <li className="nav-item">
              <Link
                to="/search-food-places"
                className="nav-link px-3 py-2 d-flex align-items-center justify-content-center text-dark"
                style={getNavLinkStyle('/search-food-places')}
                onMouseEnter={(e) => {
                  if (!isActiveRoute('/search-food-places')) {
                    e.target.style.borderBottomColor = "#FFD700";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute('/search-food-places')) {
                    e.target.style.borderBottomColor = "transparent";
                  }
                }}
              >
                <Search size={18} className="me-1" />
                Find Food Places
              </Link>
            </li>

            {/* Browse Reviews */}
            <li className="nav-item">
              <Link
                to="/browse-reviews"
                className="nav-link px-3 py-2 d-flex align-items-center justify-content-center text-dark"
                style={getNavLinkStyle('/browse-reviews')}
                onMouseEnter={(e) => {
                  if (!isActiveRoute('/browse-reviews')) {
                    e.target.style.borderBottomColor = "#FFD700";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute('/browse-reviews')) {
                    e.target.style.borderBottomColor = "transparent";
                  }
                }}
              >
                <Star size={18} className="me-1" />
                Reviews
              </Link>
            </li>

            {/* Food Map */}
            <li className="nav-item">
              <Link
                to="/food-map"
                className="nav-link px-3 py-2 d-flex align-items-center justify-content-center text-dark"
                style={getNavLinkStyle('/food-map')}
                onMouseEnter={(e) => {
                  if (!isActiveRoute('/food-map')) {
                    e.target.style.borderBottomColor = "#FFD700";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveRoute('/food-map')) {
                    e.target.style.borderBottomColor = "transparent";
                  }
                }}
              >
                <MapPin size={18} className="me-1" />
                Map
              </Link>
            </li>

            {user && (
              <>
                {/* My Collections & Favorites Dropdown - Desktop */}
                <li className="nav-item d-none d-lg-block">
                  <div className="position-relative collections-dropdown">
                    <button
                      className="nav-link px-3 py-2 btn btn-link d-flex align-items-center text-dark"
                      onClick={() => setCollectionsDropdownOpen(!collectionsDropdownOpen)}
                      style={getLibraryDropdownStyle()}
                      onMouseEnter={(e) => {
                        if (!collectionsDropdownOpen && !isLibraryActive()) {
                          e.target.style.borderBottomColor = "#FFD700";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!collectionsDropdownOpen && !isLibraryActive()) {
                          e.target.style.borderBottomColor = "transparent";
                        }
                      }}
                    >
                      <Folder size={18} className="me-1" />
                      My Library
                      <ChevronDown 
                        size={14} 
                        className="ms-1" 
                        style={{ 
                          transform: collectionsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }} 
                      />
                    </button>
                    
                    {collectionsDropdownOpen && (
                      <div
                        className="position-absolute bg-white shadow-lg rounded"
                        style={{
                          top: '100%',
                          right: '0',
                          minWidth: '240px',
                          zIndex: 1000,
                          border: '1px solid #e0e0e0',
                          borderRadius: '12px',
                          overflow: 'hidden'
                        }}
                      >
                        <div className="px-3 py-2" style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
                          <small className="text-muted fw-semibold">MY LIBRARY</small>
                        </div>
                        
                        <Link 
                          to="/my-favorites" 
                          className="dropdown-item d-flex align-items-start px-3 py-2 text-decoration-none"
                          onClick={() => setCollectionsDropdownOpen(false)}
                          style={{ color: '#333' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <Heart size={16} className="me-3 mt-1" style={{ color: '#e74c3c', flexShrink: 0 }} />
                          <div className="text-start">
                            <div className="fw-semibold text-dark">My Favorites</div>
                            <small className="text-muted">Saved places you love</small>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/my-collections" 
                          className="dropdown-item d-flex align-items-start px-3 py-2 text-decoration-none"
                          onClick={() => setCollectionsDropdownOpen(false)}
                          style={{ color: '#333' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <Folder size={16} className="me-3 mt-1" style={{ color: '#FFD700', flexShrink: 0 }} />
                          <div className="text-start">
                            <div className="fw-semibold text-dark">My Collections</div>
                            <small className="text-muted">Organized place lists</small>
                          </div>
                        </Link>

                        <hr className="dropdown-divider my-1" />
                        
                        <Link 
                          to="/my-reviews" 
                          className="dropdown-item d-flex align-items-start px-3 py-2 text-decoration-none"
                          onClick={() => setCollectionsDropdownOpen(false)}
                          style={{ color: '#333' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <Star size={16} className="me-3 mt-1" style={{ color: '#f39c12', flexShrink: 0 }} />
                          <div className="text-start">
                            <div className="fw-semibold text-dark">My Reviews</div>
                            <small className="text-muted">Places you've reviewed</small>
                          </div>
                        </Link>
                        
                        <Link 
                          to="/my-visits" 
                          className="dropdown-item d-flex align-items-start px-3 py-2 text-decoration-none"
                          onClick={() => setCollectionsDropdownOpen(false)}
                          style={{ color: '#333' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <MapPin size={16} className="me-3 mt-1" style={{ color: '#27ae60', flexShrink: 0 }} />
                          <div className="text-start">
                            <div className="fw-semibold text-dark">My Food Journey</div>
                            <small className="text-muted">Places you've visited</small>
                          </div>
                        </Link>

                        <hr className="dropdown-divider my-1" />
                        
                        <Link 
                          to="/my-collections?create=true" 
                          className="dropdown-item d-flex align-items-start px-3 py-2 text-decoration-none"
                          onClick={() => setCollectionsDropdownOpen(false)}
                          style={{ color: '#FFD700', backgroundColor: '#fffbf0' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#fff8e1'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#fffbf0'}
                        >
                          <Plus size={16} className="me-3 mt-1" style={{ flexShrink: 0 }} />
                          <div className="fw-semibold text-start">Create New Collection</div>
                        </Link>
                      </div>
                    )}
                  </div>
                </li>

                {/* Mobile-only menu items */}
                <li className="nav-item d-lg-none">
                  <Link
                    to="/my-favorites"
                    className="nav-link px-3 py-2 d-flex align-items-center justify-content-center text-dark"
                    style={getNavLinkStyle('/my-favorites')}
                    onMouseEnter={(e) => {
                      if (!isActiveRoute('/my-favorites')) {
                        e.target.style.borderBottomColor = "#FFD700";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActiveRoute('/my-favorites')) {
                        e.target.style.borderBottomColor = "transparent";
                      }
                    }}
                  >
                    <Heart size={18} className="me-1" />
                    My Favorites
                  </Link>
                </li>

                <li className="nav-item d-lg-none">
                  <Link
                    to="/my-collections"
                    className="nav-link px-3 py-2 d-flex align-items-center justify-content-center text-dark"
                    style={getNavLinkStyle('/my-collections')}
                    onMouseEnter={(e) => {
                      if (!isActiveRoute('/my-collections')) {
                        e.target.style.borderBottomColor = "#FFD700";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActiveRoute('/my-collections')) {
                        e.target.style.borderBottomColor = "transparent";
                      }
                    }}
                  >
                    <Folder size={18} className="me-1" />
                    My Collections
                  </Link>
                </li>

                <li className="nav-item d-lg-none">
                  <Link
                    to="/my-reviews"
                    className="nav-link px-3 py-2 text-dark"
                    style={getNavLinkStyle('/my-reviews')}
                    onMouseEnter={(e) => {
                      if (!isActiveRoute('/my-reviews')) {
                        e.target.style.borderBottomColor = "#FFD700";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActiveRoute('/my-reviews')) {
                        e.target.style.borderBottomColor = "transparent";
                      }
                    }}
                  >
                    My Reviews
                  </Link>
                </li>

                <li className="nav-item d-lg-none">
                  <Link
                    to="/my-visits"
                    className="nav-link px-3 py-2 text-dark"
                    style={getNavLinkStyle('/my-visits')}
                    onMouseEnter={(e) => {
                      if (!isActiveRoute('/my-visits')) {
                        e.target.style.borderBottomColor = "#FFD700";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActiveRoute('/my-visits')) {
                        e.target.style.borderBottomColor = "transparent";
                      }
                    }}
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

                {/* Desktop User dropdown menu */}
                <li className="nav-item d-none d-lg-block">
                  <div className="position-relative user-dropdown">
                    <button
                      className="nav-link px-3 py-2 btn btn-link d-flex align-items-center text-dark"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      style={getUserDropdownStyle()}
                      onMouseEnter={(e) => {
                        if (!userDropdownOpen && !isActiveRoute('/profile')) {
                          e.target.style.borderBottomColor = "#FFD700";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!userDropdownOpen && !isActiveRoute('/profile')) {
                          e.target.style.borderBottomColor = "transparent";
                        }
                      }}
                    >
                      <User size={18} className="me-1" />
                      {user.username}
                      <ChevronDown 
                        size={14} 
                        className="ms-1" 
                        style={{ 
                          transform: userDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease'
                        }} 
                      />
                    </button>
                    
                    {userDropdownOpen && (
                      <div
                        className="position-absolute bg-white shadow-lg rounded"
                        style={{
                          top: '100%',
                          right: '0',
                          minWidth: '200px',
                          zIndex: 1000,
                          border: '1px solid #e0e0e0',
                          borderRadius: '12px',
                          overflow: 'hidden'
                        }}
                      >
                        <div className="px-3 py-2" style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
                          <small className="text-muted fw-semibold">ACCOUNT</small>
                        </div>
                        
                        <Link 
                          to="/profile" 
                          className="dropdown-item d-flex align-items-start px-3 py-2 text-decoration-none"
                          onClick={() => setUserDropdownOpen(false)}
                          style={{ color: '#333' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <User size={16} className="me-3 mt-1" style={{ flexShrink: 0 }} />
                          <div className="text-start">
                            <div className="fw-semibold text-dark">Profile Settings</div>
                            <small className="text-muted">Manage your account</small>
                          </div>
                        </Link>
                        
                        <hr className="dropdown-divider my-1" />
                        
                        <button 
                          onClick={handleLogout} 
                          className="dropdown-item d-flex align-items-start px-3 py-2 text-danger w-100 border-0 bg-transparent"
                          style={{ textAlign: 'left' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          <i className="fas fa-sign-out-alt me-3 mt-1" style={{ fontSize: '16px', flexShrink: 0 }}></i>
                          <div className="fw-semibold text-start text-danger">Logout</div>
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
                  className="nav-link px-3 py-2 d-flex align-items-center justify-content-center text-dark"
                  style={getNavLinkStyle('/login')}
                  onMouseEnter={(e) => {
                    if (!isActiveRoute('/login')) {
                      e.target.style.borderBottomColor = "#FFD700";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveRoute('/login')) {
                      e.target.style.borderBottomColor = "transparent";
                    }
                  }}
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