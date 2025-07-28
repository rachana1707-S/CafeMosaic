// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Utensils, ArrowLeft, Search, MapPin, Star, Phone, Clock, ChevronLeft, ChevronRight, Heart } from "lucide-react";

// export default function SearchResults() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [allFoodPlaces, setAllFoodPlaces] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchParams, setSearchParams] = useState({});
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
  
//   // Quick search state
//   const [quickSearchLocation, setQuickSearchLocation] = useState("");
//   const [quickSearchRadius, setQuickSearchRadius] = useState("10");
//   const [quickSearching, setQuickSearching] = useState(false);

//   const queryParams = new URLSearchParams(location.search);

//   // Category-specific placeholder images
//   const foodImages = {
//     restaurant: [
//       'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=200&fit=crop&auto=format&q=80'
//     ],
//     cafe: [
//       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=200&fit=crop&auto=format&q=80'
//     ],
//     bar: [
//       'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=200&fit=crop&auto=format&q=80'
//     ],
//     pub: [
//       'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=200&fit=crop&auto=format&q=80'
//     ],
//     fast_food: [
//       'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop&auto=format&q=80'
//     ],
//     food_court: [
//       'https://images.unsplash.com/photo-1567521464027-f32a2d9b9e89?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=200&fit=crop&auto=format&q=80'
//     ],
//     ice_cream: [
//       'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=200&fit=crop&auto=format&q=80'
//     ],
//     biergarten: [
//       'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=200&fit=crop&auto=format&q=80'
//     ],
//     taproom: [
//       'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=200&fit=crop&auto=format&q=80',
//       'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop&auto=format&q=80'
//     ]
//   };

//   const getImageForCategory = (category) => {
//     const categoryType = category ? category.replace('catering.', '') : 'restaurant';
//     const categoryImages = foodImages[categoryType] || foodImages.restaurant;
//     return categoryImages[Math.floor(Math.random() * categoryImages.length)];
//   };

//   // Pagination calculations
//   const totalPages = Math.ceil(allFoodPlaces.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentFoodPlaces = allFoodPlaces.slice(startIndex, endIndex);

//   useEffect(() => {
//     const params = {
//       location: queryParams.get("location") || "",
//       categories: queryParams.get("categories") || "catering.cafe",
//       distance: queryParams.get("distance") || "10",
//       price: queryParams.get("price") || "",
//     };

//     console.log("🔍 Search params from URL:", params);
//     setSearchParams(params);
//     setQuickSearchLocation(params.location);
//     setQuickSearchRadius(params.distance);
//     setCurrentPage(1);
//     searchFoodPlaces(params);
//     loadFavorites();
//   }, [location.search]);

//   const searchFoodPlaces = async (params) => {
//     console.log("🚀 Starting search with params:", params);
//     setLoading(true);
//     setError(null);
    
//     try {
//       const searchParams = new URLSearchParams();
//       Object.keys(params).forEach(key => {
//         if (params[key]) {
//           searchParams.append(key, params[key]);
//         }
//       });

//       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
//       const fullUrl = `${apiUrl}/api/search?${searchParams.toString()}`;
      
//       console.log("🌐 API URL:", fullUrl);
      
//       const response = await fetch(fullUrl, {
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
      
//       console.log("📡 Response status:", response.status);
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log("📦 Response data:", data);
      
//       if (data.success) {
//         const places = data.coffeeShops || [];
//         console.log("✅ Food places received:", places.length);
//         setAllFoodPlaces(places);
//       } else {
//         throw new Error(data.error || 'Search failed');
//       }
      
//     } catch (error) {
//       console.error("❌ Search error:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadFavorites = async () => {
//     try {
//       // Get from localStorage for now (you can replace with API call)
//       const savedFavorites = JSON.parse(localStorage.getItem('foodPlaceFavorites') || '[]');
//       setFavorites(savedFavorites);
//     } catch (error) {
//       console.error("Error loading favorites:", error);
//     }
//   };

//   const handleAddToFavorites = async (foodPlace) => {
//     try {
//       let updatedFavorites;
//       const isAlreadyFavorite = favorites.some(fav => fav.id === foodPlace.id || fav.placeId === foodPlace.placeId);
      
//       if (isAlreadyFavorite) {
//         // Remove from favorites
//         updatedFavorites = favorites.filter(fav => 
//           fav.id !== foodPlace.id && fav.placeId !== foodPlace.placeId
//         );
//         alert(`${foodPlace.name} removed from favorites!`);
//       } else {
//         // Add to favorites
//         const favoritePlace = {
//           id: foodPlace.id || foodPlace.placeId,
//           placeId: foodPlace.placeId || foodPlace.id,
//           name: foodPlace.name,
//           address: foodPlace.address,
//           rating: foodPlace.rating,
//           distance: foodPlace.distance,
//           category: foodPlace.category,
//           imageUrl: foodPlace.imageUrl,
//           phone: foodPlace.phone,
//           website: foodPlace.website,
//           dateAdded: new Date().toISOString()
//         };
        
//         updatedFavorites = [...favorites, favoritePlace];
//         alert(`${foodPlace.name} added to favorites!`);
//       }
      
//       // Save to localStorage (replace with API call later)
//       localStorage.setItem('foodPlaceFavorites', JSON.stringify(updatedFavorites));
//       setFavorites(updatedFavorites);
      
//       // TODO: Replace with actual API call
//       // const response = await fetch('/api/favorites', {
//       //   method: isAlreadyFavorite ? 'DELETE' : 'POST',
//       //   headers: { 'Content-Type': 'application/json' },
//       //   credentials: 'include',
//       //   body: JSON.stringify({ foodPlaceId: foodPlace.id })
//       // });
      
//     } catch (error) {
//       console.error("Error managing favorites:", error);
//       alert("Error updating favorites. Please try again.");
//     }
//   };

//   const isFavorite = (foodPlace) => {
//     return favorites.some(fav => 
//       fav.id === foodPlace.id || 
//       fav.placeId === foodPlace.placeId ||
//       fav.id === foodPlace.placeId ||
//       fav.placeId === foodPlace.id
//     );
//   };

//   const handleQuickSearch = async (e) => {
//     e.preventDefault();
    
//     if (!quickSearchLocation.trim()) {
//       alert("Please enter a location");
//       return;
//     }

//     setQuickSearching(true);
    
//     const newParams = {
//       location: quickSearchLocation,
//       categories: "catering.cafe",
//       distance: quickSearchRadius,
//     };

//     const queryParams = new URLSearchParams(newParams);
//     navigate(`/search-results?${queryParams.toString()}`);
    
//     setQuickSearching(false);
//   };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const generatePageNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 5;
    
//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) {
//         pages.push(i);
//       }
//     } else {
//       const startPage = Math.max(1, currentPage - 2);
//       const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
//       for (let i = startPage; i <= endPage; i++) {
//         pages.push(i);
//       }
//     }
    
//     return pages;
//   };

//   if (loading) {
//     return (
//       <div className="min-vh-100 d-flex align-items-center justify-content-center">
//         <div className="text-center">
//           <Utensils size={64} className="text-warning mb-3" />
//           <h4 className="text-muted">Brewing your results...</h4>
//           <p className="text-muted">Searching for food places near you</p>
//           <div className="mt-3">
//             <div className="spinner-border" style={{ color: "#FFD700" }} role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
//         <div className="container">
//           <div className="text-center py-5">
//             <Utensils size={64} className="text-danger mb-3" />
//             <h4 className="text-danger mb-3">Search Error</h4>
//             <p className="text-muted mb-4">{error}</p>
//             <div className="d-flex gap-2 justify-content-center">
//               <button 
//                 className="btn rounded-pill px-4 text-dark fw-bold"
//                 onClick={() => navigate('/search-food-places')}
//                 style={{ backgroundColor: "#FFD700", border: "none" }}
//               >
//                 Try New Search
//               </button>
//               <button 
//                 className="btn rounded-pill px-4 text-dark fw-bold"
//                 onClick={() => window.location.reload()}
//                 style={{ backgroundColor: "#FFD700", border: "none" }}
//               >
//                 Reload Page
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
//       <div className="container">
//         {/* Header */}
//         <div className="d-flex align-items-center mb-4">
//           <button
//             className="btn btn-outline-secondary rounded-circle me-3"
//             onClick={() => navigate(-1)}
//             style={{ width: '48px', height: '48px' }}
//             title="Go Back"
//           >
//             <ArrowLeft size={20} />
//           </button>
//           <div className="flex-grow-1">
//             <h2 className="mb-1 fw-bold">
//               Food Places Near <span className="text-warning">{searchParams.location || 'You'}</span>
//             </h2>
//             <p className="text-muted mb-0">
//               {allFoodPlaces.length} result{allFoodPlaces.length !== 1 ? 's' : ''} found
//               {searchParams.distance && ` within ${searchParams.distance} km`}
//               {totalPages > 1 && (
//                 <span className="ms-2">
//                   • Page {currentPage} of {totalPages}
//                 </span>
//               )}
//             </p>
//           </div>
//         </div>

//         {/* Quick Search Bar */}
//         <div className="card mb-4 shadow-sm" style={{ borderRadius: '16px' }}>
//           <div className="card-body">
//             <h6 className="card-title mb-3">
//               <Search size={18} className="me-2" />
//               Search Different Location
//             </h6>
//             <form onSubmit={handleQuickSearch}>
//               <div className="row g-3 align-items-end">
//                 <div className="col-md-6">
//                   <label className="form-label small text-muted">Location</label>
//                   <div className="input-group">
//                     <span className="input-group-text bg-light border-end-0">
//                       <MapPin size={16} className="text-muted" />
//                     </span>
//                     <input
//                       type="text"
//                       className="form-control border-start-0"
//                       placeholder="Enter city, address, or landmark"
//                       value={quickSearchLocation}
//                       onChange={(e) => setQuickSearchLocation(e.target.value)}
//                       style={{ 
//                         borderLeft: 'none',
//                         boxShadow: 'none'
//                       }}
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-3">
//                   <label className="form-label small text-muted">Radius (km)</label>
//                   <select
//                     className="form-select"
//                     value={quickSearchRadius}
//                     onChange={(e) => setQuickSearchRadius(e.target.value)}
//                   >
//                     <option value="5">5 km</option>
//                     <option value="10">10 km</option>
//                     <option value="15">15 km</option>
//                     <option value="20">20 km</option>
//                     <option value="30">30 km</option>
//                   </select>
//                 </div>
//                 <div className="col-md-3">
//                   <button 
//                     type="submit" 
//                     className="btn w-100 text-dark fw-bold"
//                     disabled={quickSearching || !quickSearchLocation.trim()}
//                     style={{ backgroundColor: "#FFD700", border: "none" }}
//                   >
//                     {quickSearching ? (
//                       <>
//                         <div className="spinner-border spinner-border-sm me-2" role="status">
//                           <span className="visually-hidden">Loading...</span>
//                         </div>
//                         Searching...
//                       </>
//                     ) : (
//                       <>
//                         <Search size={16} className="me-2" />
//                         Search
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* Quick Location Buttons */}
//         <div className="mb-4">
//           <div className="d-flex flex-wrap gap-2">
//             <span className="text-muted small me-3 align-self-center">Quick searches:</span>
//             {[
//               { city: 'New York', emoji: '🗽' },
//               { city: 'Los Angeles', emoji: '☀️' },
//               { city: 'Chicago', emoji: '🌆' },
//               { city: 'Seattle', emoji: '🌧️' },
//               { city: 'San Francisco', emoji: '🌉' }
//             ].map((location) => (
//               <button
//                 key={location.city}
//                 className="btn btn-sm text-dark fw-semibold"
//                 onClick={() => {
//                   setQuickSearchLocation(location.city);
//                   const params = new URLSearchParams({
//                     location: location.city,
//                     categories: "catering.cafe",
//                     distance: quickSearchRadius
//                   });
//                   navigate(`/search-results?${params.toString()}`);
//                 }}
//                 style={{ 
//                   borderRadius: '20px',
//                   backgroundColor: "#FFD700",
//                   border: "none"
//                 }}
//               >
//                 {location.emoji} {location.city}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Results */}
//         {allFoodPlaces.length === 0 ? (
//           <div className="text-center py-5">
//             <Utensils size={64} className="text-muted mb-3" />
//             <h4 className="text-muted mb-3">No food places found</h4>
//             <p className="text-muted mb-4">Try a different location or adjust your search radius.</p>
//             <button 
//               className="btn rounded-pill px-4 text-dark fw-bold"
//               onClick={() => navigate('/search-food-places')}
//               style={{ backgroundColor: "#FFD700", border: "none" }}
//             >
//               Advanced Search
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* Current Page Results */}
//             <div className="row g-4 mb-5">
//               {currentFoodPlaces.map((place, index) => (
//                 <div key={place.id || place.placeId || index} className="col-lg-6 col-xl-4">
//                   <div 
//                     className="card border-0 d-flex flex-column" 
//                     style={{ 
//                       borderRadius: "16px",
//                       cursor: "pointer",
//                       transition: "transform 0.2s ease, box-shadow 0.2s ease",
//                       height: "100%",
//                       boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
//                     }}
//                     onClick={() => navigate(`/food-places/${place.id || place.placeId}`)}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.transform = "translateY(-4px)";
//                       e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.transform = "translateY(0)";
//                       e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
//                     }}
//                   >
//                     {/* Image Container with Visible Overlays */}
//                     <div className="position-relative overflow-hidden" style={{ borderRadius: "16px 16px 0 0" }}>
//                       <img
//                         src={place.imageUrl || getImageForCategory(place.category)}
//                         alt={place.name}
//                         className="card-img-top"
//                         style={{ 
//                           height: "200px", 
//                           objectFit: "cover"
//                         }}
//                         onError={(e) => {
//                           if (!e.target.dataset.fallback) {
//                             e.target.dataset.fallback = "1";
//                             e.target.src = getImageForCategory(place.category);
//                           } else {
//                             const parent = e.target.parentNode;
//                             parent.innerHTML = `
//                               <div style="
//                                 height: 200px; 
//                                 background: linear-gradient(135deg, #8B4513, #D2691E);
//                                 display: flex;
//                                 align-items: center;
//                                 justify-content: center;
//                                 color: white;
//                                 font-size: 48px;
//                                 border-radius: 16px 16px 0 0;
//                               ">
//                                 🍽️
//                               </div>
//                             `;
//                           }
//                         }}
//                       />
                      
//                       {/* Distance Badge */}
//                       {place.distance && (
//                         <div 
//                           className="position-absolute top-0 end-0 m-3"
//                           style={{
//                             backgroundColor: 'rgba(0, 0, 0, 0.8)',
//                             color: 'white',
//                             padding: '6px 12px',
//                             borderRadius: '20px',
//                             fontSize: '0.75rem',
//                             fontWeight: '600',
//                             boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
//                           }}
//                         >
//                           📍 {place.distance} km
//                         </div>
//                       )}

//                       {/* Rating Badge */}
//                       {place.rating && (
//                         <div 
//                           className="position-absolute top-0 start-0 m-3"
//                           style={{
//                             backgroundColor: '#FFD700',
//                             color: '#000',
//                             padding: '6px 12px',
//                             borderRadius: '20px',
//                             fontSize: '0.75rem',
//                             fontWeight: '700',
//                             boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
//                           }}
//                         >
//                           ⭐ {place.rating}
//                         </div>
//                       )}

//                       {/* Category Badge */}
//                       {place.category && (
//                         <div 
//                           className="position-absolute bottom-0 start-0 m-3"
//                           style={{
//                             backgroundColor: 'rgba(255, 255, 255, 0.95)',
//                             color: '#6c757d',
//                             padding: '4px 10px',
//                             borderRadius: '15px',
//                             fontSize: '0.7rem',
//                             fontWeight: '600',
//                             textTransform: 'capitalize'
//                           }}
//                         >
//                           {place.category.replace('catering.', '').replace('_', ' ')}
//                         </div>
//                       )}
//                     </div>
                    
//                     {/* Card Body */}
//                     <div className="card-body p-4 d-flex flex-column flex-grow-1">
//                       <h5 className="card-title fw-bold mb-2" style={{ fontSize: '1.1rem' }}>
//                         {place.name}
//                       </h5>
                      
//                       <div className="d-flex align-items-start mb-3">
//                         <MapPin size={14} className="text-muted me-2 mt-1 flex-shrink-0" />
//                         <p className="card-text text-muted small mb-0">
//                           {place.address || 'Address not available'}
//                         </p>
//                       </div>

//                       {/* Food Place Details */}
//                       <div className="mb-3 flex-grow-1">
//                         {place.rating && (
//                           <div className="d-flex align-items-center mb-2">
//                             <div className="d-flex me-2">
//                               {[1,2,3,4,5].map((star) => (
//                                 <Star 
//                                   key={star}
//                                   size={16} 
//                                   className={star <= Math.round(place.rating) ? "text-warning" : "text-muted"}
//                                   fill={star <= Math.round(place.rating) ? "currentColor" : "none"}
//                                 />
//                               ))}
//                             </div>
//                             <span className="fw-semibold me-1">{place.rating}</span>
//                             <span className="text-muted small">/5</span>
//                           </div>
//                         )}

//                         {place.phone && (
//                           <div className="d-flex align-items-center mb-2">
//                             <Phone size={14} className="text-muted me-2" />
//                             <a 
//                               href={`tel:${place.phone}`} 
//                               className="text-decoration-none small text-primary"
//                               onClick={(e) => e.stopPropagation()}
//                             >
//                               {place.phone}
//                             </a>
//                           </div>
//                         )}

//                         {place.openingHours && (
//                           <div className="d-flex align-items-center mb-2">
//                             <Clock size={14} className="text-success me-2" />
//                             <span className="text-muted small">
//                               {typeof place.openingHours === 'object' ? 'Check hours' : place.openingHours}
//                             </span>
//                           </div>
//                         )}

//                         {place.website && (
//                           <div className="d-flex align-items-center mb-2">
//                             <Utensils size={14} className="text-primary me-2" />
//                             <a 
//                               href={place.website.startsWith('http') ? place.website : `https://${place.website}`} 
//                               target="_blank" 
//                               rel="noopener noreferrer"
//                               className="text-decoration-none small text-primary"
//                               onClick={(e) => e.stopPropagation()}
//                             >
//                               Visit Website
//                             </a>
//                           </div>
//                         )}
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="d-flex gap-2 mt-auto">
//                         <button 
//                           className="btn btn-sm flex-fill text-dark fw-bold"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate(`/food-places/${place.id || place.placeId}`);
//                           }}
//                           style={{ borderRadius: '8px', backgroundColor: "#FFD700", border: "none" }}
//                         >
//                           View Details
//                         </button>
//                         <button 
//                           className={`btn btn-sm ${isFavorite(place) ? 'text-danger' : 'text-dark'} fw-bold`}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleAddToFavorites(place);
//                           }}
//                           style={{ 
//                             borderRadius: '8px', 
//                             width: '45px',
//                             backgroundColor: "#FFD700",
//                             border: "none"
//                           }}
//                           title={isFavorite(place) ? "Remove from Favorites" : "Add to Favorites"}
//                         >
//                           <Heart 
//                             size={16} 
//                             fill={isFavorite(place) ? "currentColor" : "none"}
//                           />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="d-flex justify-content-center align-items-center mb-4">
//                 <nav aria-label="Food place search pagination">
//                   <ul className="pagination pagination-lg">
//                     <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                       <button
//                         className="page-link"
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         style={{ borderRadius: '12px 0 0 12px' }}
//                       >
//                         <ChevronLeft size={18} />
//                       </button>
//                     </li>

//                     {currentPage > 3 && (
//                       <>
//                         <li className="page-item">
//                           <button
//                             className="page-link"
//                             onClick={() => handlePageChange(1)}
//                           >
//                             1
//                           </button>
//                         </li>
//                         {currentPage > 4 && (
//                           <li className="page-item disabled">
//                             <span className="page-link">...</span>
//                           </li>
//                         )}
//                       </>
//                     )}

//                     {generatePageNumbers().map((pageNum) => (
//                       <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
//                         <button
//                           className="page-link"
//                           onClick={() => handlePageChange(pageNum)}
//                           style={{
//                             backgroundColor: currentPage === pageNum ? '#FFD700' : 'transparent',
//                             borderColor: currentPage === pageNum ? '#FFD700' : '#dee2e6',
//                             color: currentPage === pageNum ? '#000' : '#6c757d'
//                           }}
//                         >
//                           {pageNum}
//                         </button>
//                       </li>
//                     ))}

//                     {currentPage < totalPages - 2 && (
//                       <>
//                         {currentPage < totalPages - 3 && (
//                           <li className="page-item disabled">
//                             <span className="page-link">...</span>
//                           </li>
//                         )}
//                         <li className="page-item">
//                           <button
//                             className="page-link"
//                             onClick={() => handlePageChange(totalPages)}
//                           >
//                             {totalPages}
//                           </button>
//                         </li>
//                       </>
//                     )}

//                     <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                       <button
//                         className="page-link"
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         style={{ borderRadius: '0 12px 12px 0' }}
//                       >
//                         <ChevronRight size={18} />
//                       </button>
//                     </li>
//                   </ul>
//                 </nav>
//               </div>
//             )}

//             {totalPages > 1 && (
//               <div className="text-center text-muted small mb-4">
//                 Showing {startIndex + 1} - {Math.min(endIndex, allFoodPlaces.length)} of {allFoodPlaces.length} food places
//               </div>
//             )}
//           </>
//         )}

//         {/* Footer Info */}
//         <div className="mt-5 pt-4 border-top">
//           <div className="row text-center">
//             <div className="col-md-4 mb-3">
//               <div className="text-muted small">
//                 <Utensils size={16} className="me-1" />
//                 Powered by Geoapify
//               </div>
//             </div>
//             <div className="col-md-4 mb-3">
//               <div className="text-muted small">
//                 <MapPin size={16} className="me-1" />
//                 Real-time food place data
//               </div>
//             </div>
//             <div className="col-md-4 mb-3">
//               <div className="text-muted small">
//                 <Star size={16} className="me-1" />
//                 Community reviewed
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Utensils, ArrowLeft, Search, MapPin, Star, Phone, Clock, ChevronLeft, ChevronRight, Heart } from "lucide-react";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [allFoodPlaces, setAllFoodPlaces] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Quick search state
  const [quickSearchLocation, setQuickSearchLocation] = useState("");
  const [quickSearchRadius, setQuickSearchRadius] = useState("10");
  const [quickSearching, setQuickSearching] = useState(false);

  const queryParams = new URLSearchParams(location.search);

  // Category-specific placeholder images
  const foodImages = {
    restaurant: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&h=200&fit=crop&auto=format&q=80'
    ],
    cafe: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=200&fit=crop&auto=format&q=80'
    ],
    bar: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=200&fit=crop&auto=format&q=80'
    ],
    pub: [
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=200&fit=crop&auto=format&q=80'
    ],
    fast_food: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop&auto=format&q=80'
    ],
    food_court: [
      'https://images.unsplash.com/photo-1567521464027-f32a2d9b9e89?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=200&fit=crop&auto=format&q=80'
    ],
    ice_cream: [
      'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=200&fit=crop&auto=format&q=80'
    ],
    biergarten: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=200&fit=crop&auto=format&q=80'
    ],
    taproom: [
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=400&h=200&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop&auto=format&q=80'
    ]
  };

  const getImageForCategory = (category) => {
    const categoryType = category ? category.replace('catering.', '') : 'restaurant';
    const categoryImages = foodImages[categoryType] || foodImages.restaurant;
    return categoryImages[Math.floor(Math.random() * categoryImages.length)];
  };

  // Pagination calculations
  const totalPages = Math.ceil(allFoodPlaces.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFoodPlaces = allFoodPlaces.slice(startIndex, endIndex);

  useEffect(() => {
    const params = {
      location: queryParams.get("location") || "",
      categories: queryParams.get("categories") || "catering.cafe",
      distance: queryParams.get("distance") || "10",
      price: queryParams.get("price") || "",
    };

    console.log("🔍 Search params from URL:", params);
    setSearchParams(params);
    setQuickSearchLocation(params.location);
    setQuickSearchRadius(params.distance);
    setCurrentPage(1);
    searchFoodPlaces(params);
    loadFavorites();
  }, [location.search]);

  const searchFoodPlaces = async (params) => {
    console.log("🚀 Starting search with params:", params);
    setLoading(true);
    setError(null);
    
    try {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) {
          searchParams.append(key, params[key]);
        }
      });

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const fullUrl = `${apiUrl}/api/search?${searchParams.toString()}`;
      
      console.log("🌐 API URL:", fullUrl);
      
      const response = await fetch(fullUrl, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("📡 Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📦 Response data:", data);
      
      if (data.success) {
        const places = data.coffeeShops || [];
        console.log("✅ Food places received:", places.length);
        
        // Enhance places with additional data and save to localStorage
        const enhancedPlaces = places.map((place, index) => {
          // Create a unique ID if none exists
          const uniqueId = place.id || place.placeId || place.place_id || `place_${Date.now()}_${index}`;
          
          return {
            ...place,
            // Ensure consistent ID fields
            id: uniqueId,
            placeId: uniqueId,
            place_id: place.place_id || uniqueId,
            
            // Standardize address field
            address: place.address || place.vicinity || place.formatted_address || 'Address not available',
            
            // Add image if not present
            imageUrl: place.imageUrl || (place.photos && place.photos[0]) || getImageForCategory(place.category),
            
            // Ensure phone number format
            phone: place.phone || place.formatted_phone_number,
            
            // Add website if not present
            website: place.website || place.url,
            
            // Add search timestamp
            searchedAt: new Date().toISOString(),
            
            // Add location coordinates if available
            latitude: place.latitude || (place.geometry && place.geometry.location && place.geometry.location.lat),
            longitude: place.longitude || (place.geometry && place.geometry.location && place.geometry.location.lng),
            
            // Standardize category
            category: place.category || (place.types && place.types[0]) || 'restaurant',
            
            // Add cuisine info if available
            cuisine: place.cuisine || (place.types && place.types.slice(0,2).join(', ')) || 'International',
            
            // Add description if not present
            description: place.description || `Experience ${place.name || 'this restaurant'} with great food and atmosphere.`
          };
        });
        
        setAllFoodPlaces(enhancedPlaces);
        
        // Save search results to localStorage for detail page access
        const existingResults = JSON.parse(localStorage.getItem('searchResults') || '[]');
        
        // Create a map for quick lookup and deduplication
        const resultsMap = new Map();
        
        // Add existing results to map
        existingResults.forEach(result => {
          const key = result.id || result.placeId || result.place_id;
          if (key) resultsMap.set(String(key), result);
        });
        
        // Add new results to map, overwriting existing ones with same ID
        enhancedPlaces.forEach(newPlace => {
          const key = newPlace.id || newPlace.placeId || newPlace.place_id;
          if (key) {
            resultsMap.set(String(key), { ...resultsMap.get(String(key)), ...newPlace });
          }
        });
        
        // Convert map back to array and keep only recent results
        const mergedResults = Array.from(resultsMap.values())
          .sort((a, b) => new Date(b.searchedAt || 0) - new Date(a.searchedAt || 0))
          .slice(0, 100);
        
        localStorage.setItem('searchResults', JSON.stringify(mergedResults));
        console.log("💾 Saved search results to localStorage:", mergedResults.length, "items");
        console.log("🔍 Sample saved items:", mergedResults.slice(0, 3).map(r => ({ id: r.id, name: r.name })));
        
      } else {
        throw new Error(data.error || 'Search failed');
      }
      
    } catch (error) {
      console.error("❌ Search error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      // Get from localStorage for now (you can replace with API call)
      const savedFavorites = JSON.parse(localStorage.getItem('foodPlaceFavorites') || '[]');
      setFavorites(savedFavorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const handleAddToFavorites = async (foodPlace) => {
    try {
      let updatedFavorites;
      const isAlreadyFavorite = favorites.some(fav => 
        fav.id === foodPlace.id || 
        fav.placeId === foodPlace.placeId ||
        fav.place_id === foodPlace.place_id
      );
      
      if (isAlreadyFavorite) {
        // Remove from favorites
        updatedFavorites = favorites.filter(fav => 
          fav.id !== foodPlace.id && 
          fav.placeId !== foodPlace.placeId &&
          fav.place_id !== foodPlace.place_id
        );
        alert(`${foodPlace.name} removed from favorites!`);
      } else {
        // Add to favorites with complete data
        const favoritePlace = {
          id: foodPlace.id || foodPlace.placeId || foodPlace.place_id,
          placeId: foodPlace.placeId || foodPlace.id || foodPlace.place_id,
          place_id: foodPlace.place_id || foodPlace.id || foodPlace.placeId,
          name: foodPlace.name,
          address: foodPlace.address || foodPlace.vicinity || foodPlace.formatted_address,
          rating: foodPlace.rating,
          distance: foodPlace.distance,
          category: foodPlace.category,
          cuisine: foodPlace.cuisine,
          imageUrl: foodPlace.imageUrl,
          phone: foodPlace.phone || foodPlace.formatted_phone_number,
          website: foodPlace.website || foodPlace.url,
          latitude: foodPlace.latitude || foodPlace.geometry?.location?.lat,
          longitude: foodPlace.longitude || foodPlace.geometry?.location?.lng,
          priceLevel: foodPlace.priceLevel || foodPlace.price_level,
          dateAdded: new Date().toISOString(),
          // Store additional data that might be useful
          types: foodPlace.types,
          geometry: foodPlace.geometry,
          photos: foodPlace.photos,
          opening_hours: foodPlace.opening_hours,
          reviews: foodPlace.reviews
        };
        
        updatedFavorites = [...favorites, favoritePlace];
        alert(`${foodPlace.name} added to favorites!`);
      }
      
      // Save to localStorage (replace with API call later)
      localStorage.setItem('foodPlaceFavorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('favoritesChanged'));
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/favorites', {
      //   method: isAlreadyFavorite ? 'DELETE' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      //   body: JSON.stringify({ foodPlaceId: foodPlace.id })
      // });
      
    } catch (error) {
      console.error("Error managing favorites:", error);
      alert("Error updating favorites. Please try again.");
    }
  };

  const isFavorite = (foodPlace) => {
    return favorites.some(fav => 
      fav.id === foodPlace.id || 
      fav.placeId === foodPlace.placeId ||
      fav.place_id === foodPlace.place_id ||
      fav.id === foodPlace.placeId ||
      fav.placeId === foodPlace.id
    );
  };

  // Enhanced navigation function that saves place data
  const handlePlaceClick = (place) => {
    console.log("🔗 Navigating to place:", place.name, "with ID:", place.id);
    
    // Ensure the place data is saved to localStorage for the detail page
    const searchResults = JSON.parse(localStorage.getItem('searchResults') || '[]');
    
    // Update or add this place in search results
    const updatedResults = searchResults.filter(p => 
      p.id !== place.id && 
      p.placeId !== place.placeId && 
      p.place_id !== place.place_id
    );
    
    // Add the current place with complete data
    const completePlace = {
      ...place,
      // Ensure all ID fields are consistent
      id: place.id || place.placeId || place.place_id,
      placeId: place.id || place.placeId || place.place_id,
      place_id: place.place_id || place.id || place.placeId,
      
      // Add timestamp for navigation tracking
      lastViewed: new Date().toISOString()
    };
    
    updatedResults.push(completePlace);
    localStorage.setItem('searchResults', JSON.stringify(updatedResults));
    
    console.log("💾 Saved place data for navigation:", completePlace.name);
    
    // Navigate to detail page
    const placeId = place.id || place.placeId || place.place_id;
    navigate(`/food-places/${placeId}`);
  };

  const handleQuickSearch = async (e) => {
    e.preventDefault();
    
    if (!quickSearchLocation.trim()) {
      alert("Please enter a location");
      return;
    }

    setQuickSearching(true);
    
    const newParams = {
      location: quickSearchLocation,
      categories: "catering.cafe",
      distance: quickSearchRadius,
    };

    const queryParams = new URLSearchParams(newParams);
    navigate(`/search-results?${queryParams.toString()}`);
    
    setQuickSearching(false);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Utensils size={64} className="text-warning mb-3" />
          <h4 className="text-muted">Brewing your results...</h4>
          <p className="text-muted">Searching for food places near you</p>
          <div className="mt-3">
            <div className="spinner-border" style={{ color: "#FFD700" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="text-center py-5">
            <Utensils size={64} className="text-danger mb-3" />
            <h4 className="text-danger mb-3">Search Error</h4>
            <p className="text-muted mb-4">{error}</p>
            <div className="d-flex gap-2 justify-content-center">
              <button 
                className="btn rounded-pill px-4 text-dark fw-bold"
                onClick={() => navigate('/search-food-places')}
                style={{ backgroundColor: "#FFD700", border: "none" }}
              >
                Try New Search
              </button>
              <button 
                className="btn rounded-pill px-4 text-dark fw-bold"
                onClick={() => window.location.reload()}
                style={{ backgroundColor: "#FFD700", border: "none" }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <button
            className="btn btn-outline-secondary rounded-circle me-3"
            onClick={() => navigate(-1)}
            style={{ width: '48px', height: '48px' }}
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-grow-1">
            <h2 className="mb-1 fw-bold">
              Food Places Near <span className="text-warning">{searchParams.location || 'You'}</span>
            </h2>
            <p className="text-muted mb-0">
              {allFoodPlaces.length} result{allFoodPlaces.length !== 1 ? 's' : ''} found
              {searchParams.distance && ` within ${searchParams.distance} km`}
              {totalPages > 1 && (
                <span className="ms-2">
                  • Page {currentPage} of {totalPages}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="card mb-4 shadow-sm" style={{ borderRadius: '16px' }}>
          <div className="card-body">
            <h6 className="card-title mb-3">
              <Search size={18} className="me-2" />
              Search Different Location
            </h6>
            <form onSubmit={handleQuickSearch}>
              <div className="row g-3 align-items-end">
                <div className="col-md-6">
                  <label className="form-label small text-muted">Location</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <MapPin size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Enter city, address, or landmark"
                      value={quickSearchLocation}
                      onChange={(e) => setQuickSearchLocation(e.target.value)}
                      style={{ 
                        borderLeft: 'none',
                        boxShadow: 'none'
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label small text-muted">Radius (km)</label>
                  <select
                    className="form-select"
                    value={quickSearchRadius}
                    onChange={(e) => setQuickSearchRadius(e.target.value)}
                  >
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="15">15 km</option>
                    <option value="20">20 km</option>
                    <option value="30">30 km</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <button 
                    type="submit" 
                    className="btn w-100 text-dark fw-bold"
                    disabled={quickSearching || !quickSearchLocation.trim()}
                    style={{ backgroundColor: "#FFD700", border: "none" }}
                  >
                    {quickSearching ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search size={16} className="me-2" />
                        Search
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Location Buttons */}
        <div className="mb-4">
          <div className="d-flex flex-wrap gap-2">
            <span className="text-muted small me-3 align-self-center">Quick searches:</span>
            {[
              { city: 'New York', emoji: '🗽' },
              { city: 'Los Angeles', emoji: '☀️' },
              { city: 'Chicago', emoji: '🌆' },
              { city: 'Seattle', emoji: '🌧️' },
              { city: 'San Francisco', emoji: '🌉' }
            ].map((location) => (
              <button
                key={location.city}
                className="btn btn-sm text-dark fw-semibold"
                onClick={() => {
                  setQuickSearchLocation(location.city);
                  const params = new URLSearchParams({
                    location: location.city,
                    categories: "catering.cafe",
                    distance: quickSearchRadius
                  });
                  navigate(`/search-results?${params.toString()}`);
                }}
                style={{ 
                  borderRadius: '20px',
                  backgroundColor: "#FFD700",
                  border: "none"
                }}
              >
                {location.emoji} {location.city}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {allFoodPlaces.length === 0 ? (
          <div className="text-center py-5">
            <Utensils size={64} className="text-muted mb-3" />
            <h4 className="text-muted mb-3">No food places found</h4>
            <p className="text-muted mb-4">Try a different location or adjust your search radius.</p>
            <button 
              className="btn rounded-pill px-4 text-dark fw-bold"
              onClick={() => navigate('/search-food-places')}
              style={{ backgroundColor: "#FFD700", border: "none" }}
            >
              Advanced Search
            </button>
          </div>
        ) : (
          <>
            {/* Current Page Results */}
            <div className="row g-4 mb-5">
              {currentFoodPlaces.map((place, index) => (
                <div key={place.id || place.placeId || index} className="col-lg-6 col-xl-4">
                  <div 
                    className="card border-0 d-flex flex-column" 
                    style={{ 
                      borderRadius: "16px",
                      cursor: "pointer",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      height: "100%",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                    }}
                    onClick={() => handlePlaceClick(place)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
                    }}
                  >
                    {/* Image Container with Visible Overlays */}
                    <div className="position-relative overflow-hidden" style={{ borderRadius: "16px 16px 0 0" }}>
                      <img
                        src={place.imageUrl || getImageForCategory(place.category)}
                        alt={place.name}
                        className="card-img-top"
                        style={{ 
                          height: "200px", 
                          objectFit: "cover"
                        }}
                        onError={(e) => {
                          if (!e.target.dataset.fallback) {
                            e.target.dataset.fallback = "1";
                            e.target.src = getImageForCategory(place.category);
                          } else {
                            const parent = e.target.parentNode;
                            parent.innerHTML = `
                              <div style="
                                height: 200px; 
                                background: linear-gradient(135deg, #8B4513, #D2691E);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-size: 48px;
                                border-radius: 16px 16px 0 0;
                              ">
                                🍽️
                              </div>
                            `;
                          }
                        }}
                      />
                      
                      {/* Distance Badge */}
                      {place.distance && (
                        <div 
                          className="position-absolute top-0 end-0 m-3"
                          style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                          }}
                        >
                          📍 {place.distance} km
                        </div>
                      )}

                      {/* Rating Badge */}
                      {place.rating && (
                        <div 
                          className="position-absolute top-0 start-0 m-3"
                          style={{
                            backgroundColor: '#FFD700',
                            color: '#000',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                          }}
                        >
                          ⭐ {place.rating}
                        </div>
                      )}

                      {/* Category Badge */}
                      {place.category && (
                        <div 
                          className="position-absolute bottom-0 start-0 m-3"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            color: '#6c757d',
                            padding: '4px 10px',
                            borderRadius: '15px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            textTransform: 'capitalize'
                          }}
                        >
                          {place.category.replace('catering.', '').replace('_', ' ')}
                        </div>
                      )}
                    </div>
                    
                    {/* Card Body */}
                    <div className="card-body p-4 d-flex flex-column flex-grow-1">
                      <h5 className="card-title fw-bold mb-2" style={{ fontSize: '1.1rem' }}>
                        {place.name}
                      </h5>
                      
                      <div className="d-flex align-items-start mb-3">
                        <MapPin size={14} className="text-muted me-2 mt-1 flex-shrink-0" />
                        <p className="card-text text-muted small mb-0">
                          {place.address || place.vicinity || place.formatted_address || 'Address not available'}
                        </p>
                      </div>

                      {/* Food Place Details */}
                      <div className="mb-3 flex-grow-1">
                        {place.rating && (
                          <div className="d-flex align-items-center mb-2">
                            <div className="d-flex me-2">
                              {[1,2,3,4,5].map((star) => (
                                <Star 
                                  key={star}
                                  size={16} 
                                  className={star <= Math.round(place.rating) ? "text-warning" : "text-muted"}
                                  fill={star <= Math.round(place.rating) ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                            <span className="fw-semibold me-1">{place.rating}</span>
                            <span className="text-muted small">/5</span>
                          </div>
                        )}

                        {(place.phone || place.formatted_phone_number) && (
                          <div className="d-flex align-items-center mb-2">
                            <Phone size={14} className="text-muted me-2" />
                            <a 
                              href={`tel:${place.phone || place.formatted_phone_number}`} 
                              className="text-decoration-none small text-primary"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {place.phone || place.formatted_phone_number}
                            </a>
                          </div>
                        )}

                        {place.openingHours && (
                          <div className="d-flex align-items-center mb-2">
                            <Clock size={14} className="text-success me-2" />
                            <span className="text-muted small">
                              {typeof place.openingHours === 'object' ? 'Check hours' : place.openingHours}
                            </span>
                          </div>
                        )}

                        {(place.website || place.url) && (
                          <div className="d-flex align-items-center mb-2">
                            <Utensils size={14} className="text-primary me-2" />
                            <a 
                              href={(place.website || place.url).startsWith('http') ? (place.website || place.url) : `https://${place.website || place.url}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-decoration-none small text-primary"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Visit Website
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-2 mt-auto">
                        <button 
                          className="btn btn-sm flex-fill text-dark fw-bold"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlaceClick(place);
                          }}
                          style={{ borderRadius: '8px', backgroundColor: "#FFD700", border: "none" }}
                        >
                          View Details
                        </button>
                        <button 
                          className={`btn btn-sm ${isFavorite(place) ? 'text-danger' : 'text-dark'} fw-bold`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToFavorites(place);
                          }}
                          style={{ 
                            borderRadius: '8px', 
                            width: '45px',
                            backgroundColor: "#FFD700",
                            border: "none"
                          }}
                          title={isFavorite(place) ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Heart 
                            size={16} 
                            fill={isFavorite(place) ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center mb-4">
                <nav aria-label="Food place search pagination">
                  <ul className="pagination pagination-lg">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{ borderRadius: '12px 0 0 12px' }}
                      >
                        <ChevronLeft size={18} />
                      </button>
                    </li>

                    {currentPage > 3 && (
                      <>
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(1)}
                          >
                            1
                          </button>
                        </li>
                        {currentPage > 4 && (
                          <li className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        )}
                      </>
                    )}

                    {generatePageNumbers().map((pageNum) => (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pageNum)}
                          style={{
                            backgroundColor: currentPage === pageNum ? '#FFD700' : 'transparent',
                            borderColor: currentPage === pageNum ? '#FFD700' : '#dee2e6',
                            color: currentPage === pageNum ? '#000' : '#6c757d'
                          }}
                        >
                          {pageNum}
                        </button>
                      </li>
                    ))}

                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <li className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        )}
                        <li className="page-item">
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </button>
                        </li>
                      </>
                    )}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{ borderRadius: '0 12px 12px 0' }}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}

            {totalPages > 1 && (
              <div className="text-center text-muted small mb-4">
                Showing {startIndex + 1} - {Math.min(endIndex, allFoodPlaces.length)} of {allFoodPlaces.length} food places
              </div>
            )}
          </>
        )}

        {/* Footer Info */}
        <div className="mt-5 pt-4 border-top">
          <div className="row text-center">
            <div className="col-md-4 mb-3">
              <div className="text-muted small">
                <Utensils size={16} className="me-1" />
                Powered by Geoapify
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="text-muted small">
                <MapPin size={16} className="me-1" />
                Real-time food place data
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="text-muted small">
                <Star size={16} className="me-1" />
                Community reviewed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}