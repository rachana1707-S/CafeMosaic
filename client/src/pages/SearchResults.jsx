import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import { useCoffeeShops } from "../context/CoffeeShopContext";
import CoffeeShopCard from "../components/CoffeeShopCard";
import CollectionSelectorModal from "../components/CollectionSelectorModal";
import { Coffee, Filter, MapPin, ArrowLeft, Grid3X3, List } from "lucide-react";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthUser();
  const { 
    coffeeShops, 
    loading, 
    searchCoffeeShops, 
    addToFavorites, 
    isFavorite,
    collections,
    loadCollections 
  } = useCoffeeShops();

  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('distance');
  const [filterRating, setFilterRating] = useState(0);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedCoffeeShop, setSelectedCoffeeShop] = useState(null);
  const [searchParams, setSearchParams] = useState({});

  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    const params = {
      location: queryParams.get("location") || "",
      latitude: queryParams.get("latitude") || "",
      longitude: queryParams.get("longitude") || "",
      distance: queryParams.get("distance") || "5",
      unit: queryParams.get("unit") || "km",
      category: queryParams.get("category") || "",
    };

    setSearchParams(params);
    searchCoffeeShops(params);
  }, [location.search, searchCoffeeShops]);

  useEffect(() => {
    if (isAuthenticated()) {
      loadCollections();
    }
  }, [isAuthenticated, loadCollections]);

  const handleAddToFavorites = async (coffeeShop) => {
    if (!isAuthenticated()) {
      alert("Please log in to add favorites");
      navigate("/login");
      return;
    }

    const result = await addToFavorites(coffeeShop);
    if (!result.success) {
      alert(result.error || "Failed to add to favorites");
    }
  };

  const handleAddToCollection = (coffeeShop) => {
    if (!isAuthenticated()) {
      alert("Please log in to add to collections");
      navigate("/login");
      return;
    }

    setSelectedCoffeeShop(coffeeShop);
    setShowCollectionModal(true);
  };

  const handleViewCoffeeShop = (coffeeShopId) => {
    navigate(`/coffee-shops/${coffeeShopId}`);
  };

  const getSortedAndFilteredShops = () => {
    let filtered = coffeeShops.filter(shop => {
      if (filterRating > 0) {
        return (shop.rating || 0) >= filterRating;
      }
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return parseFloat(a.distance || 999) - parseFloat(b.distance || 999);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'reviews':
          return (b._count?.reviews || 0) - (a._count?.reviews || 0);
        default:
          return 0;
      }
    });
  };

  const filteredShops = getSortedAndFilteredShops();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Coffee size={64} className="text-warning mb-3 animate-pulse" />
          <h4 className="text-muted">Brewing your results...</h4>
          <p className="text-muted">Searching for coffee shops near you</p>
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
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-grow-1">
            <h2 className="mb-1 fw-bold">
              Coffee Shops Near{" "}
              <span className="text-warning">
                {searchParams.location || "You"}
              </span>
            </h2>
            <p className="text-muted mb-0">
              {filteredShops.length} result{filteredShops.length !== 1 ? 's' : ''} 
              {searchParams.distance && ` within ${searchParams.distance} ${searchParams.unit}`}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="d-flex flex-wrap gap-3 align-items-center">
              {/* Sort */}
              <div className="d-flex align-items-center">
                <label className="text-muted small me-2">Sort by:</label>
                <select 
                  className="form-select form-select-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ minWidth: '120px' }}
                >
                  <option value="distance">Distance</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="d-flex align-items-center">
                <label className="text-muted small me-2">Min Rating:</label>
                <select 
                  className="form-select form-select-sm"
                  value={filterRating}
                  onChange={(e) => setFilterRating(Number(e.target.value))}
                  style={{ minWidth: '100px' }}
                >
                  <option value="0">Any</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              {/* Search Info */}
              <div className="d-flex align-items-center text-muted small">
                <MapPin size={16} className="me-1" />
                {searchParams.distance} {searchParams.unit} radius
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="d-flex justify-content-end gap-2">
              {/* View Mode Toggle */}
              <div className="btn-group" role="group">
                <button
                  className={`btn ${viewMode === 'grid' ? 'btn-warning' : 'btn-outline-secondary'} btn-sm`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  className={`btn ${viewMode === 'list' ? 'btn-warning' : 'btn-outline-secondary'} btn-sm`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={16} />
                </button>
              </div>

              {/* New Search */}
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={() => navigate('/search')}
              >
                New Search
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredShops.length === 0 ? (
          <div className="text-center py-5">
            <Coffee size={64} className="text-muted mb-3" />
            <h4 className="text-muted mb-3">No coffee shops found</h4>
            <p className="text-muted mb-4">
              Try adjusting your filters or search in a different area.
            </p>
            <button 
              className="btn btn-warning rounded-pill px-4"
              onClick={() => navigate('/search')}
            >
              <Coffee size={20} className="me-2" />
              New Search
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="row g-4">
            {filteredShops.map((coffeeShop) => (
              <div key={coffeeShop.id || coffeeShop.placeId} className="col-lg-4 col-md-6">
                <div onClick={() => handleViewCoffeeShop(coffeeShop.id || coffeeShop.placeId)}>
                  <CoffeeShopCard
                    coffeeShop={coffeeShop}
                    onAddToFavorites={handleAddToFavorites}
                    onAddToCollection={handleAddToCollection}
                    selectedCollection={selectedCollection}
                    isInFavorites={isFavorite(coffeeShop.id || coffeeShop.placeId)}
                    isInCollection={false}
                    showAddToCollection={isAuthenticated()}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row g-3">
            {filteredShops.map((coffeeShop) => (
              <div key={coffeeShop.id || coffeeShop.placeId} className="col-12">
                <div 
                  className="card border-0 shadow-sm"
                  style={{ borderRadius: "12px", cursor: 'pointer' }}
                  onClick={() => handleViewCoffeeShop(coffeeShop.id || coffeeShop.placeId)}
                >
                  <div className="row g-0">
                    <div className="col-md-3">
                      <img
                        src={coffeeShop.imageUrl || '/assets/cafe_placeholder.jpg'}
                        alt={coffeeShop.name}
                        className="img-fluid h-100 w-100"
                        style={{ 
                          objectFit: 'cover',
                          borderRadius: "12px 0 0 12px",
                          minHeight: "150px"
                        }}
                      />
                    </div>
                    <div className="col-md-9">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="fw-bold mb-1">{coffeeShop.name}</h5>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-danger rounded-circle"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToFavorites(coffeeShop);
                              }}
                              style={{ width: '36px', height: '36px' }}
                            >
                              ❤️
                            </button>
                            {isAuthenticated() && (
                              <button
                                className="btn btn-sm btn-outline-warning rounded-circle"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCollection(coffeeShop);
                                }}
                                style={{ width: '36px', height: '36px' }}
                              >
                                +
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-muted mb-2">{coffeeShop.address}</p>
                        
                        <div className="d-flex align-items-center gap-3 mb-2">
                          {coffeeShop.rating && (
                            <div className="d-flex align-items-center">
                              <span className="text-warning me-1">⭐</span>
                              <span className="fw-semibold">{coffeeShop.rating}</span>
                              {coffeeShop._count?.reviews && (
                                <span className="text-muted ms-1">
                                  ({coffeeShop._count.reviews} reviews)
                                </span>
                              )}
                            </div>
                          )}
                          
                          {coffeeShop.distance && (
                            <span className="text-muted small">
                              📍 {coffeeShop.distance} {searchParams.unit} away
                            </span>
                          )}
                        </div>

                        {coffeeShop.phone && (
                          <p className="text-muted small mb-0">
                            📞 {coffeeShop.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Collection Modal */}
        {showCollectionModal && selectedCoffeeShop && (
          <CollectionSelectorModal
            coffeeShop={selectedCoffeeShop}
            userId={user?.id}
            onClose={() => {
              setShowCollectionModal(false);
              setSelectedCoffeeShop(null);
            }}
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
          />
        )}
      </div>
    </div>
  );
}