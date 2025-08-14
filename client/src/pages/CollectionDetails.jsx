
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import { 
  ArrowLeft,
  Folder,
  MapPin,
  Star,
  Phone,
  Globe,
  CheckCircle2,
  Circle,
  StickyNote,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  Grid3X3,
  List,
  Share2,
  Heart,
  MoreVertical,
  Users,
  Clock,
  DollarSign
} from "lucide-react";

export default function CollectionDetails() {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthUser();
  
  const [collection, setCollection] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterVisited, setFilterVisited] = useState('all'); // all, visited, not_visited
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPlace, setEditingPlace] = useState(null);
  const [showAddPlaces, setShowAddPlaces] = useState(false);

  // Food place placeholder images
  const foodImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=200&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=200&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768744?w=400&h=200&fit=crop&auto=format&q=80'
  ];

  const getRandomFoodImage = () => {
    return foodImages[Math.floor(Math.random() * foodImages.length)];
  };

  useEffect(() => {
    if (isAuthenticated()) {
      loadCollectionDetails();
    } else {
      setLoading(false);
    }
  }, [collectionId]);

  const loadCollectionDetails = async () => {
    try {
      setLoading(true);
      
      // Try API first
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const response = await fetch(`${apiUrl}/api/collections/${collectionId}`, {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setCollection(data.collection);
          setPlaces(data.collection.places || []);
        } else {
          throw new Error('API failed');
        }
      } catch (apiError) {
        // Fallback to localStorage
        const savedCollections = JSON.parse(localStorage.getItem('userCollections') || '[]');
        const foundCollection = savedCollections.find(c => c.id === collectionId);
        
        if (foundCollection) {
          setCollection(foundCollection);
          setPlaces(foundCollection.places || []);
        } else {
          throw new Error('Collection not found');
        }
      }
    } catch (error) {
      console.error("Error loading collection:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlaceNotes = async (placeId, notes) => {
    try {
      // Update in API
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const response = await fetch(`${apiUrl}/api/collections/${collectionId}/places/${placeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ notes })
        });

        if (!response.ok) throw new Error('API failed');
      } catch (apiError) {
        // Fallback to localStorage
        const savedCollections = JSON.parse(localStorage.getItem('userCollections') || '[]');
        const updatedCollections = savedCollections.map(collection => {
          if (collection.id === collectionId) {
            const updatedPlaces = collection.places.map(place => {
              if (place.id === placeId || place.placeId === placeId) {
                return { ...place, notes };
              }
              return place;
            });
            return { ...collection, places: updatedPlaces, dateModified: new Date().toISOString() };
          }
          return collection;
        });
        localStorage.setItem('userCollections', JSON.stringify(updatedCollections));
      }

      // Update local state
      setPlaces(places.map(place => {
        if (place.id === placeId || place.placeId === placeId) {
          return { ...place, notes };
        }
        return place;
      }));
      
      setEditingPlace(null);
    } catch (error) {
      console.error("Error updating notes:", error);
      alert("Error updating notes. Please try again.");
    }
  };

  const handleToggleVisited = async (place) => {
    try {
      const isCurrentlyVisited = place.isVisited;
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      if (isCurrentlyVisited) {
        // Unmark as visited - remove from visits table
        const response = await fetch(`${apiUrl}/api/visits/unmark-visited`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ 
            coffeeShopId: place.id || place.placeId 
          })
        });

        if (response.ok) {
          console.log("Place unmarked as visited");
        } else {
          console.warn("Failed to unmark place in API, continuing with local update");
        }
      } else {
        // Mark as visited - add to visits table
        const response = await fetch(`${apiUrl}/api/visits/mark-visited`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ 
            coffeeShopId: place.id || place.placeId,
            visitDate: new Date().toISOString(),
            notes: place.notes || null
          })
        });

        if (response.ok) {
          console.log("Place marked as visited");
        } else {
          console.warn("Failed to mark place in API, continuing with local update");
        }
      }

      // Update collection in API/localStorage
      try {
        const response = await fetch(`${apiUrl}/api/collections/${collectionId}/places/${place.id || place.placeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ 
            isVisited: !isCurrentlyVisited,
            visitedDate: !isCurrentlyVisited ? new Date().toISOString() : null
          })
        });

        if (!response.ok) throw new Error('API failed');
      } catch (apiError) {
        // Fallback to localStorage
        const savedCollections = JSON.parse(localStorage.getItem('userCollections') || '[]');
        const updatedCollections = savedCollections.map(collection => {
          if (collection.id === collectionId) {
            const updatedPlaces = collection.places.map(p => {
              if (p.id === place.id || p.placeId === place.placeId) {
                return { 
                  ...p, 
                  isVisited: !isCurrentlyVisited, 
                  visitedDate: !isCurrentlyVisited ? new Date().toISOString() : null 
                };
              }
              return p;
            });
            return { 
              ...collection, 
              places: updatedPlaces,
              visitedCount: updatedPlaces.filter(p => p.isVisited).length,
              dateModified: new Date().toISOString() 
            };
          }
          return collection;
        });
        localStorage.setItem('userCollections', JSON.stringify(updatedCollections));
      }

      // Update local state
      const updatedPlaces = places.map(p => {
        if (p.id === place.id || p.placeId === place.placeId) {
          return { 
            ...p, 
            isVisited: !isCurrentlyVisited, 
            visitedDate: !isCurrentlyVisited ? new Date().toISOString() : null 
          };
        }
        return p;
      });
      
      setPlaces(updatedPlaces);

      // Update collection stats
      if (collection) {
        const newVisitedCount = updatedPlaces.filter(p => p.isVisited).length;
        setCollection({ ...collection, visitedCount: newVisitedCount });
      }
      
    } catch (error) {
      console.error("Error updating visited status:", error);
      alert("Error updating visited status. Please try again.");
    }
  };

  const handleRemovePlace = async (place) => {
    if (!window.confirm(`Remove ${place.name} from this collection?`)) return;
    
    try {
      // Remove from API
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const response = await fetch(`${apiUrl}/api/collections/${collectionId}/places/${place.id || place.placeId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) throw new Error('API failed');
      } catch (apiError) {
        // Fallback to localStorage
        const savedCollections = JSON.parse(localStorage.getItem('userCollections') || '[]');
        const updatedCollections = savedCollections.map(collection => {
          if (collection.id === collectionId) {
            const updatedPlaces = collection.places.filter(p => 
              p.id !== place.id && p.placeId !== place.placeId
            );
            return { 
              ...collection, 
              places: updatedPlaces,
              placesCount: updatedPlaces.length,
              visitedCount: updatedPlaces.filter(p => p.isVisited).length,
              dateModified: new Date().toISOString() 
            };
          }
          return collection;
        });
        localStorage.setItem('userCollections', JSON.stringify(updatedCollections));
      }

      // Update local state
      const updatedPlaces = places.filter(p => p.id !== place.id && p.placeId !== place.placeId);
      setPlaces(updatedPlaces);
      
      if (collection) {
        setCollection({
          ...collection,
          placesCount: updatedPlaces.length,
          visitedCount: updatedPlaces.filter(p => p.isVisited).length
        });
      }
      
      alert(`${place.name} removed from collection!`);
      
    } catch (error) {
      console.error("Error removing place:", error);
      alert("Error removing place. Please try again.");
    }
  };

  const getFilteredAndSortedPlaces = () => {
    let filtered = places;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by visited status
    if (filterVisited === 'visited') {
      filtered = filtered.filter(place => place.isVisited);
    } else if (filterVisited === 'not_visited') {
      filtered = filtered.filter(place => !place.isVisited);
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'visitedDate':
          if (!a.visitedDate && !b.visitedDate) return 0;
          if (!a.visitedDate) return 1;
          if (!b.visitedDate) return -1;
          return new Date(b.visitedDate) - new Date(a.visitedDate);
        case 'dateAdded':
        default:
          return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
      }
    });
  };

  const filteredPlaces = getFilteredAndSortedPlaces();

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="d-flex align-items-center">
        {[1,2,3,4,5].map((star) => (
          <Star 
            key={star}
            size={16} 
            className={star <= Math.round(rating) ? "text-warning" : "text-muted"}
            fill={star <= Math.round(rating) ? "currentColor" : "none"}
          />
        ))}
        <span className="ms-2 fw-semibold">{rating}</span>
      </div>
    );
  };

  const renderPriceLevel = (level) => {
    if (!level) return null;
    return (
      <div className="d-flex align-items-center">
        {[1, 2, 3, 4].map((price) => (
          <DollarSign
            key={price}
            size={14}
            className={price <= level ? "text-success" : "text-muted"}
          />
        ))}
      </div>
    );
  };

  if (!isAuthenticated()) {
    return (
      <div className="container mt-5 pt-5">
        <div className="text-center py-5">
          <Folder size={64} className="text-muted mb-4" />
          <h3 className="text-muted mb-3">Please Log In</h3>
          <p className="text-muted mb-4">
            You need to be logged in to view collections.
          </p>
          <button 
            className="btn text-dark fw-bold px-4 py-2"
            onClick={() => navigate('/login')}
            style={{ backgroundColor: "#FFD700", border: "none", borderRadius: "25px" }}
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Folder size={64} style={{ color: "#FFD700" }} className="mb-3" />
          <h4 className="text-muted">Loading collection...</h4>
          <div className="spinner-border" style={{ color: "#FFD700" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="text-center py-5">
            <Folder size={64} className="text-danger mb-3" />
            <h4 className="text-danger mb-3">Collection Not Found</h4>
            <p className="text-muted mb-4">
              {error || "The collection you're looking for doesn't exist or has been removed."}
            </p>
            <button 
              className="btn text-dark fw-bold"
              onClick={() => navigate('/my-collections')}
              style={{ backgroundColor: "#FFD700", border: "none" }}
            >
              Back to Collections
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
          onClick={() => navigate('/my-collections')}
          style={{ width: '48px', height: '48px' }}
        >
          <ArrowLeft size={20} />
        </button>

        {/* Collection Header */}
        <div className="card shadow-lg mb-4" style={{ borderRadius: '20px', borderLeft: `6px solid ${collection.color}` }}>
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ 
                      width: '56px', 
                      height: '56px',
                      backgroundColor: `${collection.color}20`,
                      border: `3px solid ${collection.color}`
                    }}
                  >
                    <Folder size={24} style={{ color: collection.color }} />
                  </div>
                  <div>
                    <h2 className="fw-bold mb-1">{collection.name}</h2>
                    <p className="text-muted mb-0">
                      Created {new Date(collection.dateCreated).toLocaleDateString()}
                      {collection.dateModified !== collection.dateCreated && (
                        <> • Updated {new Date(collection.dateModified).toLocaleDateString()}</>
                      )}
                    </p>
                  </div>
                </div>
                
                {collection.description && (
                  <p className="lead mb-3">{collection.description}</p>
                )}
                
                {collection.isPublic && (
                  <span className="badge bg-success">
                    <Users size={14} className="me-1" />
                    Public Collection
                  </span>
                )}
              </div>
              
              <div className="col-md-4">
                <div className="row g-2 text-center">
                  <div className="col-6">
                    <div className="card bg-light border-0">
                      <div className="card-body py-3">
                        <h4 className="fw-bold mb-1">{collection.placesCount || places.length}</h4>
                        <small className="text-muted">Total Places</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card bg-light border-0">
                      <div className="card-body py-3">
                        <h4 className="fw-bold mb-1 text-success">{collection.visitedCount || places.filter(p => p.isVisited).length}</h4>
                        <small className="text-muted">Visited</small>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex gap-2 mt-3">
                  <button 
                    className="btn btn-sm text-dark fw-bold flex-fill"
                    onClick={() => navigate('/search-food-places')}
                    style={{ backgroundColor: "#FFD700", border: "none" }}
                  >
                    <Plus size={16} className="me-1" />
                    Add Places
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: collection.name,
                          text: `Check out my "${collection.name}" collection on FoodSocial!`,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }
                    }}
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        {places.length > 0 && (
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label small text-muted">Search Places</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Search size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search places, notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <label className="form-label small text-muted">Visit Status</label>
                  <select
                    className="form-select"
                    value={filterVisited}
                    onChange={(e) => setFilterVisited(e.target.value)}
                  >
                    <option value="all">All Places</option>
                    <option value="visited">Visited Only</option>
                    <option value="not_visited">Not Visited</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small text-muted">Sort By</label>
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="dateAdded">Recently Added</option>
                    <option value="name">Name</option>
                    <option value="rating">Rating</option>
                    <option value="visitedDate">Recently Visited</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small text-muted">View</label>
                  <div className="btn-group w-100" role="group">
                    <button
                      className={`btn ${viewMode === 'grid' ? 'text-dark' : 'btn-outline-secondary'} btn-sm`}
                      onClick={() => setViewMode('grid')}
                      style={viewMode === 'grid' ? { backgroundColor: "#FFD700", border: "none" } : {}}
                    >
                      <Grid3X3 size={16} />
                    </button>
                    <button
                      className={`btn ${viewMode === 'list' ? 'text-dark' : 'btn-outline-secondary'} btn-sm`}
                      onClick={() => setViewMode('list')}
                      style={viewMode === 'list' ? { backgroundColor: "#FFD700", border: "none" } : {}}
                    >
                      <List size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Places Display */}
        {places.length === 0 ? (
          <div className="text-center py-5">
            <Folder size={80} className="text-muted mb-4" />
            <h3 className="text-muted mb-3">No Places Yet</h3>
            <p className="text-muted mb-4">
              Start adding restaurants, cafes, and food places to this collection!
            </p>
            <button 
              className="btn text-dark fw-bold px-4 py-2"
              onClick={() => navigate('/search-food-places')}
              style={{ backgroundColor: "#FFD700", border: "none", borderRadius: "25px" }}
            >
              <Plus size={18} className="me-2" />
              Add Your First Place
            </button>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="text-center py-5">
            <Search size={64} className="text-muted mb-4" />
            <h4 className="text-muted mb-3">No matches found</h4>
            <p className="text-muted mb-4">
              Try adjusting your search or filter criteria.
            </p>
            <button 
              className="btn text-dark fw-bold"
              onClick={() => {
                setSearchQuery('');
                setFilterVisited('all');
              }}
              style={{ backgroundColor: "#FFD700", border: "none" }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "row g-4" : "row g-3"}>
            {filteredPlaces.map((place) => (
              <div key={place.id || place.placeId} className={viewMode === 'grid' ? "col-lg-4 col-md-6" : "col-12"}>
                {viewMode === 'grid' ? (
                  /* Grid View */
                  <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                    <div className="position-relative">
                      <img
                        src={place.imageUrl || getRandomFoodImage()}
                        alt={place.name}
                        className="card-img-top"
                        style={{ 
                          height: '200px', 
                          objectFit: 'cover',
                          borderRadius: '16px 16px 0 0'
                        }}
                        onError={(e) => {
                          e.target.src = getRandomFoodImage();
                        }}
                      />
                      
                      {/* Visit Status Badge */}
                      <div className="position-absolute top-0 start-0 m-3">
                        <button
                          className={`btn btn-sm ${place.isVisited ? 'text-white' : 'text-dark'}`}
                          onClick={() => handleToggleVisited(place)}
                          style={{
                            backgroundColor: place.isVisited ? '#28a745' : '#fff',
                            border: place.isVisited ? 'none' : '2px solid #28a745',
                            borderRadius: '20px'
                          }}
                          title={place.isVisited ? "Mark as not visited" : "Mark as visited"}
                        >
                          {place.isVisited ? (
                            <>
                              <CheckCircle2 size={14} className="me-1" />
                              Visited
                            </>
                          ) : (
                            <>
                              <Circle size={14} className="me-1" />
                              Not Visited
                            </>
                          )}
                        </button>
                      </div>

                      {/* Actions Dropdown */}
                      <div className="position-absolute top-0 end-0 m-3">
                        <div className="dropdown">
                          <button 
                            className="btn btn-sm text-white"
                            data-bs-toggle="dropdown"
                            style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%' }}
                          >
                            <MoreVertical size={16} />
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <button 
                                className="dropdown-item"
                                onClick={() => navigate(`/food-places/${place.id || place.placeId}`)}
                              >
                                View Details
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item"
                                onClick={() => setEditingPlace(place)}
                              >
                                <Edit3 size={14} className="me-2" />
                                Edit Notes
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button 
                                className="dropdown-item text-danger"
                                onClick={() => handleRemovePlace(place)}
                              >
                                <Trash2 size={14} className="me-2" />
                                Remove from Collection
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <h5 className="card-title fw-bold mb-2">{place.name}</h5>
                      <p className="card-text text-muted small mb-2">
                        <MapPin size={14} className="me-1" />
                        {place.address}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        {place.rating && renderStars(place.rating)}
                        {place.priceLevel && renderPriceLevel(place.priceLevel)}
                      </div>

                      {place.notes && (
                        <div className="mb-2">
                          <small className="text-muted">
                            <StickyNote size={12} className="me-1" />
                            {place.notes.length > 80 ? `${place.notes.substring(0, 80)}...` : place.notes}
                          </small>
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <Calendar size={12} className="me-1" />
                          Added {new Date(place.dateAdded).toLocaleDateString()}
                        </small>
                        
                        {place.isVisited && place.visitedDate && (
                          <small className="text-success">
                            <CheckCircle2 size={12} className="me-1" />
                            {new Date(place.visitedDate).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* List View */
                  <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                    <div className="row g-0">
                      <div className="col-md-3">
                        <img
                          src={place.imageUrl || getRandomFoodImage()}
                          alt={place.name}
                          className="img-fluid h-100 w-100"
                          style={{ 
                            objectFit: 'cover',
                            borderRadius: '12px 0 0 12px',
                            minHeight: '150px'
                          }}
                          onError={(e) => {
                            e.target.src = getRandomFoodImage();
                          }}
                        />
                      </div>
                      <div className="col-md-9">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="flex-grow-1">
                              <h5 className="card-title fw-bold mb-2">{place.name}</h5>
                              <p className="card-text text-muted mb-2">
                                <MapPin size={14} className="me-1" />
                                {place.address}
                              </p>
                              
                              <div className="d-flex align-items-center gap-3 mb-2">
                                {place.rating && renderStars(place.rating)}
                                {place.priceLevel && renderPriceLevel(place.priceLevel)}
                              </div>

                              {place.notes && (
                                <div className="mb-2">
                                  <small className="text-muted">
                                    <StickyNote size={12} className="me-1" />
                                    {place.notes}
                                  </small>
                                </div>
                              )}

                              <div className="d-flex gap-3">
                                <small className="text-muted">
                                  <Calendar size={12} className="me-1" />
                                  Added {new Date(place.dateAdded).toLocaleDateString()}
                                </small>
                                
                                {place.isVisited && place.visitedDate && (
                                  <small className="text-success">
                                    <CheckCircle2 size={12} className="me-1" />
                                    Visited {new Date(place.visitedDate).toLocaleDateString()}
                                  </small>
                                )}
                              </div>
                            </div>
                            
                            <div className="d-flex gap-2 ms-3">
                              <button
                                className={`btn btn-sm ${place.isVisited ? 'btn-success' : 'btn-outline-success'}`}
                                onClick={() => handleToggleVisited(place)}
                                title={place.isVisited ? "Mark as not visited" : "Mark as visited"}
                              >
                                {place.isVisited ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                              </button>
                              
                              <div className="dropdown">
                                <button 
                                  className="btn btn-sm btn-outline-secondary"
                                  data-bs-toggle="dropdown"
                                >
                                  <MoreVertical size={16} />
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                  <li>
                                    <button 
                                      className="dropdown-item"
                                      onClick={() => navigate(`/food-places/${place.id || place.placeId}`)}
                                    >
                                      View Details
                                    </button>
                                  </li>
                                  <li>
                                    <button 
                                      className="dropdown-item"
                                      onClick={() => setEditingPlace(place)}
                                    >
                                      <Edit3 size={14} className="me-2" />
                                      Edit Notes
                                    </button>
                                  </li>
                                  <li><hr className="dropdown-divider" /></li>
                                  <li>
                                    <button 
                                      className="dropdown-item text-danger"
                                      onClick={() => handleRemovePlace(place)}
                                    >
                                      <Trash2 size={14} className="me-2" />
                                      Remove
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Edit Notes Modal */}
        {editingPlace && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content" style={{ borderRadius: '16px' }}>
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">
                    <StickyNote size={24} className="me-2" style={{ color: "#FFD700" }} />
                    Edit Notes
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setEditingPlace(null)}
                  ></button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleUpdatePlaceNotes(editingPlace.id || editingPlace.placeId, formData.get('notes'));
                }}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <h6 className="fw-semibold">{editingPlace.name}</h6>
                      <small className="text-muted">{editingPlace.address}</small>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Personal Notes</label>
                      <textarea
                        name="notes"
                        className="form-control"
                        rows="4"
                        placeholder="Add your thoughts, recommendations, memories, or anything you want to remember about this place..."
                        defaultValue={editingPlace.notes || ''}
                      />
                    </div>
                  </div>
                  
                  <div className="modal-footer border-0">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setEditingPlace(null)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn text-dark fw-bold"
                      style={{ backgroundColor: "#FFD700", border: "none" }}
                    >
                      Save Notes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}