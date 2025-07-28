import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  Globe, 
  Star, 
  Heart, 
  Share2,
  Utensils,
  DollarSign,
  Wifi,
  Car,
  CreditCard,
  Users
} from "lucide-react";

export default function FoodPlaceDetails() {
  const { foodPlaceId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthUser();
  
  const [foodPlace, setFoodPlace] = useState(null);
  const [similarPlaces, setSimilarPlaces] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: '',
    comment: '',
    visitDate: ''
  });

  // Category-specific placeholder images for different food types
  const foodImages = {
    restaurant: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&auto=format&q=80', // Fine dining restaurant
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop&auto=format&q=80', // Restaurant interior
      'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop&auto=format&q=80', // Elegant restaurant
      'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=600&h=400&fit=crop&auto=format&q=80'  // Modern restaurant
    ],
    cafe: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&auto=format&q=80', // Coffee shop interior
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop&auto=format&q=80', // Cozy cafe
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop&auto=format&q=80', // Cafe exterior
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format&q=80'  // Modern cafe
    ],
    bar: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=600&h=400&fit=crop&auto=format&q=80', // Bar interior
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&h=400&fit=crop&auto=format&q=80', // Cocktail bar
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop&auto=format&q=80', // Sports bar
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop&auto=format&q=80'  // Pub atmosphere
    ],
    pub: [
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop&auto=format&q=80', // Traditional pub
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop&auto=format&q=80', // Beer pub
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&auto=format&q=80', // Cozy pub
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop&auto=format&q=80'  // British pub
    ],
    fast_food: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop&auto=format&q=80', // Burger place
      'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=600&h=400&fit=crop&auto=format&q=80', // Fast food counter
      'https://images.unsplash.com/photo-1586816001966-79b736744398?w=600&h=400&fit=crop&auto=format&q=80', // Modern fast food
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&auto=format&q=80'  // Quick service
    ],
    food_court: [
      'https://images.unsplash.com/photo-1567521464027-f32a2d9b9e89?w=600&h=400&fit=crop&auto=format&q=80', // Food court
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&auto=format&q=80', // Mall food court
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop&auto=format&q=80', // Food hall
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&auto=format&q=80'  // Market food court
    ],
    ice_cream: [
      'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&h=400&fit=crop&auto=format&q=80', // Ice cream shop
      'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=400&fit=crop&auto=format&q=80', // Gelato shop
      'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=600&h=400&fit=crop&auto=format&q=80', // Ice cream parlor
      'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=400&fit=crop&auto=format&q=80'  // Dessert shop
    ],
    biergarten: [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&auto=format&q=80', // Beer garden
      'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=600&h=400&fit=crop&auto=format&q=80', // Outdoor beer garden
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop&auto=format&q=80', // Beer hall
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop&auto=format&q=80'  // German beer garden
    ],
    taproom: [
      'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop&auto=format&q=80', // Brewery taproom
      'https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=600&h=400&fit=crop&auto=format&q=80', // Craft beer taproom
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop&auto=format&q=80', // Beer tasting room
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop&auto=format&q=80'  // Industrial taproom
    ]
  };

  const getRandomFoodImage = () => foodImages['restaurant'][Math.floor(Math.random() * foodImages['restaurant'].length)];

  const getImageForCategory = (category) => {
    // Extract the category type from the full category string (e.g., "catering.restaurant" -> "restaurant")
    const categoryType = category ? category.replace('catering.', '') : 'restaurant';
    
    // Get images for this category, fallback to restaurant if not found
    const categoryImages = foodImages[categoryType] || foodImages.restaurant;
    
    // Return a random image from this category
    return categoryImages[Math.floor(Math.random() * categoryImages.length)];
  };

  useEffect(() => {
    fetchFoodPlaceDetails();
  }, [foodPlaceId]);

  const fetchFoodPlaceDetails = async () => {
    try {
      setLoading(true);
      
      // Simulate API call - replace with your actual API
      // For now, we'll create mock data based on the foodPlaceId
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      
      const mockFoodPlace = {
        id: foodPlaceId,
        placeId: foodPlaceId,
        name: "Delicious Bistro",
        address: "123 Food Street, Culinary District, Boston, MA 02110",
        phone: "+1-617-555-0123",
        website: "https://deliciousbistro.com",
        rating: 4.5,
        priceLevel: 2,
        category: "restaurant",
        cuisine: "Italian, Mediterranean",
        description: "A cozy bistro serving authentic Italian cuisine with a modern twist. Perfect for romantic dinners and family gatherings.",
        imageUrl: getImageForCategory("restaurant"),
        latitude: 42.3601,
        longitude: -71.0589,
        openingHours: {
          monday: "11:00 - 22:00",
          tuesday: "11:00 - 22:00", 
          wednesday: "11:00 - 22:00",
          thursday: "11:00 - 22:00",
          friday: "11:00 - 23:00",
          saturday: "10:00 - 23:00",
          sunday: "10:00 - 21:00"
        },
        amenities: {
          wifi: true,
          parking: true,
          creditCards: true,
          outdoorSeating: true,
          wheelchair: true,
          delivery: true,
          takeout: true
        },
        distance: "0.5"
      };

      setFoodPlace(mockFoodPlace);
      
      // Fetch similar places
      fetchSimilarPlaces(mockFoodPlace);
      
      // Fetch reviews
      fetchReviews();
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarPlaces = async (currentPlace) => {
    try {
      // Simulate finding similar places
      const mockSimilarPlaces = [
        {
          id: "similar1",
          name: "Pasta Paradise",
          address: "456 Taste Ave, Boston, MA",
          rating: 4.3,
          distance: "0.8",
          category: "restaurant",
          imageUrl: getImageForCategory("restaurant"),
          priceLevel: 2
        },
        {
          id: "similar2", 
          name: "Mediterranean Magic",
          address: "789 Flavor St, Boston, MA",
          rating: 4.6,
          distance: "1.2",
          category: "restaurant",
          imageUrl: getImageForCategory("restaurant"),
          priceLevel: 3
        },
        {
          id: "similar3",
          name: "Cozy Corner Cafe",
          address: "321 Brew Blvd, Boston, MA", 
          rating: 4.4,
          distance: "1.5",
          category: "cafe",
          imageUrl: getImageForCategory("cafe"),
          priceLevel: 1
        }
      ];
      
      setSimilarPlaces(mockSimilarPlaces);
    } catch (error) {
      console.error("Error fetching similar places:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      // Mock reviews
      const mockReviews = [
        {
          id: 1,
          user: { username: "foodie123" },
          rating: 5,
          comment: "Amazing pasta and great service! Will definitely come back.",
          visitDate: "2024-01-15",
          createdAt: "2024-01-16T10:30:00Z"
        },
        {
          id: 2,
          user: { username: "diningexpert" },
          rating: 4,
          comment: "Good food and nice atmosphere. The tiramisu was exceptional!",
          visitDate: "2024-01-10", 
          createdAt: "2024-01-11T14:20:00Z"
        }
      ];
      
      setReviews(mockReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleAddToFavorites = async () => {
    if (!isAuthenticated()) {
      alert("Please log in to add favorites");
      navigate("/login");
      return;
    }
    
    // Simulate API call
    setIsFavorite(!isFavorite);
    alert(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: foodPlace.name,
          text: `Check out ${foodPlace.name} on FoodSocial!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      alert("Please log in to write a review");
      navigate("/login");
      return;
    }
    
    if (!newReview.rating || !newReview.comment) {
      alert("Please provide a rating and comment");
      return;
    }
    
    try {
      // Try to submit to real API first
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          coffeeShopId: foodPlaceId,
          rating: parseInt(newReview.rating),
          title: `Review for ${foodPlace.name}`,
          comment: newReview.comment,
          visitDate: newReview.visitDate || null
        })
      });

      if (response.ok) {
        const submittedReview = await response.json();
        console.log("Review submitted successfully to API:", submittedReview);
        
        // Add the new review to the local list with user info
        const reviewWithUser = {
          ...submittedReview,
          user: { username: user.username, id: user.id }
        };
        
        setReviews([reviewWithUser, ...reviews]);
        setNewReview({ rating: '', comment: '', visitDate: '' });
        setShowReviewForm(false);
        alert("Review submitted successfully! It will appear in the Reviews page.");
      } else {
        throw new Error("API submission failed");
      }
    } catch (error) {
      console.log("API submission failed, using local simulation:", error);
      
      // Fallback to local simulation if API fails
      const review = {
        id: Date.now(),
        user: { username: user.username, id: user.id },
        rating: parseInt(newReview.rating),
        title: `Review for ${foodPlace.name}`,
        comment: newReview.comment,
        visitDate: newReview.visitDate,
        createdAt: new Date().toISOString(),
        foodPlace: {
          id: foodPlace.id,
          name: foodPlace.name,
          address: foodPlace.address,
          category: foodPlace.category
        },
        helpfulCount: 0
      };
      
      setReviews([review, ...reviews]);
      setNewReview({ rating: '', comment: '', visitDate: '' });
      setShowReviewForm(false);
      alert("Review added successfully!");
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="d-flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={star <= rating ? "text-warning" : "text-muted"}
            fill={star <= rating ? "currentColor" : "none"}
          />
        ))}
      </div>
    );
  };

  const renderPriceLevel = (level) => {
    return (
      <div className="d-flex align-items-center">
        {[1, 2, 3, 4].map((price) => (
          <DollarSign
            key={price}
            size={16}
            className={price <= level ? "text-success" : "text-muted"}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Utensils size={64} style={{ color: "#FFD700" }} className="mb-3" />
          <h4 className="text-muted">Loading food place details...</h4>
          <div className="spinner-border" style={{ color: "#FFD700" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !foodPlace) {
    return (
      <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="text-center py-5">
            <Utensils size={64} className="text-danger mb-3" />
            <h4 className="text-danger mb-3">Food Place Not Found</h4>
            <p className="text-muted mb-4">
              {error || "The food place you're looking for doesn't exist or has been removed."}
            </p>
            <button 
              className="btn rounded-pill px-4 text-dark fw-bold"
              onClick={() => navigate('/search-food-places')}
              style={{ backgroundColor: "#FFD700", border: "none" }}
            >
              Find Other Food Places
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
      <div className="container">
        {/* Back Button */}
        <button
          className="btn btn-outline-secondary rounded-circle mb-4"
          onClick={() => navigate(-1)}
          style={{ width: '48px', height: '48px' }}
        >
          <ArrowLeft size={20} />
        </button>

        {/* Main Food Place Card */}
        <div className="card shadow-lg mb-5" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          {/* Hero Image */}
          <div className="position-relative">
            <img
              src={foodPlace.imageUrl || getImageForCategory(foodPlace.category)}
              alt={foodPlace.name}
              className="w-100"
              style={{ height: '400px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = getImageForCategory(foodPlace.category);
              }}
            />
            
            {/* Action Buttons Overlay */}
            <div className="position-absolute top-0 end-0 m-4">
              <div className="d-flex gap-2">
                <button
                  className="btn rounded-circle text-dark"
                  onClick={handleAddToFavorites}
                  style={{ 
                    backgroundColor: "#FFD700",
                    border: "none",
                    width: '50px',
                    height: '50px'
                  }}
                >
                  <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                </button>
                <button
                  className="btn rounded-circle text-dark"
                  onClick={handleShare}
                  style={{ 
                    backgroundColor: "#FFD700",
                    border: "none",
                    width: '50px',
                    height: '50px'
                  }}
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Category Badge */}
            <div className="position-absolute bottom-0 start-0 m-4">
              <span 
                className="badge px-3 py-2 text-dark fw-bold"
                style={{ 
                  backgroundColor: "#FFD700",
                  fontSize: '0.9rem',
                  borderRadius: '15px'
                }}
              >
                {foodPlace.category.charAt(0).toUpperCase() + foodPlace.category.slice(1)}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="card-body p-5">
            <div className="row">
              <div className="col-lg-8">
                {/* Header */}
                <div className="mb-4">
                  <h1 className="fw-bold mb-2">{foodPlace.name}</h1>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    {renderStars(foodPlace.rating)}
                    <span className="fw-semibold">{foodPlace.rating}/5</span>
                    <span className="text-muted">({reviews.length} reviews)</span>
                    {renderPriceLevel(foodPlace.priceLevel)}
                  </div>
                  {foodPlace.cuisine && (
                    <p className="text-muted fs-5 mb-3">{foodPlace.cuisine}</p>
                  )}
                  {foodPlace.description && (
                    <p className="lead">{foodPlace.description}</p>
                  )}
                </div>

                {/* Contact Information */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <MapPin size={20} className="text-muted me-3" />
                      <div>
                        <strong>Address</strong><br />
                        <span className="text-muted">{foodPlace.address}</span>
                      </div>
                    </div>
                    
                    {foodPlace.phone && (
                      <div className="d-flex align-items-center mb-3">
                        <Phone size={20} className="text-muted me-3" />
                        <div>
                          <strong>Phone</strong><br />
                          <a href={`tel:${foodPlace.phone}`} className="text-decoration-none">
                            {foodPlace.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    {foodPlace.website && (
                      <div className="d-flex align-items-center mb-3">
                        <Globe size={20} className="text-muted me-3" />
                        <div>
                          <strong>Website</strong><br />
                          <a 
                            href={foodPlace.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            Visit Website
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {foodPlace.distance && (
                      <div className="d-flex align-items-center mb-3">
                        <MapPin size={20} className="text-muted me-3" />
                        <div>
                          <strong>Distance</strong><br />
                          <span className="text-muted">{foodPlace.distance} km away</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Opening Hours */}
                {foodPlace.openingHours && (
                  <div className="mb-4">
                    <h5 className="mb-3"><Clock size={20} className="me-2" />Opening Hours</h5>
                    <div className="row">
                      {Object.entries(foodPlace.openingHours).map(([day, hours]) => (
                        <div key={day} className="col-md-6 mb-2">
                          <div className="d-flex justify-content-between">
                            <span className="fw-semibold text-capitalize">{day}:</span>
                            <span className="text-muted">{hours}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities */}
                {foodPlace.amenities && (
                  <div className="mb-4">
                    <h5 className="mb-3">Amenities</h5>
                    <div className="row">
                      {Object.entries(foodPlace.amenities).map(([amenity, available]) => (
                        available && (
                          <div key={amenity} className="col-md-4 mb-2">
                            <div className="d-flex align-items-center">
                              {amenity === 'wifi' && <Wifi size={16} className="me-2 text-success" />}
                              {amenity === 'parking' && <Car size={16} className="me-2 text-success" />}
                              {amenity === 'creditCards' && <CreditCard size={16} className="me-2 text-success" />}
                              {amenity === 'outdoorSeating' && <Users size={16} className="me-2 text-success" />}
                              <span className="text-capitalize">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Sidebar */}
              <div className="col-lg-4">
                <div className="sticky-top" style={{ top: '100px' }}>
                  <div className="card border-0 shadow">
                    <div className="card-body">
                      <h5 className="mb-3">Quick Actions</h5>
                      
                      <div className="d-grid gap-2 mb-3">
                        <button 
                          className="btn text-dark fw-bold"
                          onClick={() => window.open(`https://maps.google.com/?q=${foodPlace.latitude},${foodPlace.longitude}`, '_blank')}
                          style={{ backgroundColor: "#FFD700", border: "none" }}
                        >
                          <MapPin size={16} className="me-2" />
                          Get Directions
                        </button>
                        
                        {foodPlace.phone && (
                          <button 
                            className="btn text-dark fw-bold"
                            onClick={() => window.open(`tel:${foodPlace.phone}`)}
                            style={{ backgroundColor: "#FFD700", border: "none" }}
                          >
                            <Phone size={16} className="me-2" />
                            Call Now
                          </button>
                        )}
                        
                        <button 
                          className="btn text-dark fw-bold"
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          style={{ backgroundColor: "#FFD700", border: "none" }}
                        >
                          <Star size={16} className="me-2" />
                          Write Review
                        </button>
                      </div>

                      {/* Quick Stats */}
                      <div className="border-top pt-3">
                        <div className="row text-center">
                          <div className="col-6">
                            <div className="fw-bold">{foodPlace.rating}</div>
                            <div className="small text-muted">Rating</div>
                          </div>
                          <div className="col-6">
                            <div className="fw-bold">{reviews.length}</div>
                            <div className="small text-muted">Reviews</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="card shadow mb-5" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4">
              <h5 className="mb-3">Write a Review</h5>
              <form onSubmit={handleReviewSubmit}>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Rating *</label>
                    <select 
                      className="form-select"
                      value={newReview.rating}
                      onChange={(e) => setNewReview({...newReview, rating: e.target.value})}
                      required
                    >
                      <option value="">Select rating</option>
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Visit Date</label>
                    <input 
                      type="date"
                      className="form-control"
                      value={newReview.visitDate}
                      onChange={(e) => setNewReview({...newReview, visitDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3 d-flex align-items-end">
                    <button 
                      type="submit" 
                      className="btn w-100 text-dark fw-bold"
                      style={{ backgroundColor: "#FFD700", border: "none" }}
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Your Review *</label>
                  <textarea 
                    className="form-control"
                    rows="4"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    placeholder="Share your experience..."
                    required
                  />
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="card shadow mb-5" style={{ borderRadius: '15px' }}>
          <div className="card-body p-4">
            <h4 className="mb-4">Customer Reviews ({reviews.length})</h4>
            
            {reviews.length === 0 ? (
              <div className="text-center py-4">
                <Star size={48} className="text-muted mb-3" />
                <p className="text-muted">No reviews yet. Be the first to review this place!</p>
              </div>
            ) : (
              <div className="row g-4">
                {reviews.map((review) => (
                  <div key={review.id} className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="mb-1">{review.user.username}</h6>
                            <div className="d-flex align-items-center">
                              {renderStars(review.rating)}
                              <span className="ms-2 small text-muted">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="mb-0">{review.comment}</p>
                        {review.visitDate && (
                          <small className="text-muted">
                            Visited: {new Date(review.visitDate).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Similar Places Section */}
        <div className="mb-5">
          <h4 className="mb-4">Similar Places Nearby</h4>
          
          {similarPlaces.length === 0 ? (
            <div className="text-center py-4">
              <Utensils size={48} className="text-muted mb-3" />
              <p className="text-muted">No similar places found.</p>
            </div>
          ) : (
            <div className="row g-4">
              {similarPlaces.map((place) => (
                <div key={place.id} className="col-lg-4 col-md-6">
                  <div 
                    className="card h-100 border-0 shadow-sm"
                    style={{ 
                      borderRadius: '15px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onClick={() => navigate(`/food-places/${place.id}`)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <img
                      src={place.imageUrl || getImageForCategory(place.category)}
                      alt={place.name}
                      className="card-img-top"
                      style={{ 
                        height: '200px', 
                        objectFit: 'cover',
                        borderRadius: '15px 15px 0 0'
                      }}
                      onError={(e) => {
                        e.target.src = getImageForCategory(place.category);
                      }}
                    />
                    
                    {/* Distance Badge */}
                    <div 
                      className="position-absolute top-0 end-0 m-3 badge text-white"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        fontSize: '0.75rem'
                      }}
                    >
                      {place.distance} km
                    </div>
                    
                    <div className="card-body">
                      <h5 className="card-title fw-bold mb-2">{place.name}</h5>
                      <p className="card-text text-muted small mb-2">
                        <MapPin size={14} className="me-1" />
                        {place.address}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          {renderStars(place.rating)}
                          <span className="ms-2 fw-semibold">{place.rating}</span>
                        </div>
                        {renderPriceLevel(place.priceLevel)}
                      </div>
                      
                      <button 
                        className="btn btn-sm w-100 mt-3 text-dark fw-bold"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/food-places/${place.id}`);
                        }}
                        style={{ backgroundColor: "#FFD700", border: "none" }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}