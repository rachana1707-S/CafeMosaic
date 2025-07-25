import React, { useEffect, useState } from "react";
import { useAuthUser } from "../context/AuthContext";
import { useCoffeeShops } from "../context/FoodPlaceContext";
import { useNavigate } from "react-router-dom";
import { Heart, Coffee, Star, MapPin, Phone, Clock, ExternalLink } from "lucide-react";

export default function MyFavorites() {
  const { user } = useAuthUser();
  const { favorites, loadFavorites, removeFromFavorites, favoritesLoading } = useCoffeeShops();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    }
  }, [user, loadFavorites]);

  const handleRemoveFromFavorites = async (coffeeShopId) => {
    if (window.confirm('Remove this coffee shop from your favorites?')) {
      const result = await removeFromFavorites(coffeeShopId);
      if (!result.success) {
        alert(result.error || 'Failed to remove from favorites');
      }
    }
  };

  const handleViewCoffeeShop = (coffeeShopId) => {
    navigate(`/coffee-shops/${coffeeShopId}`);
  };

  const handleGetDirections = (coffeeShop) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coffeeShop.latitude},${coffeeShop.longitude}`;
    window.open(url, '_blank');
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="text-muted small">No rating</span>;
    
    return (
      <div className="d-flex align-items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={14}
            className={index < rating ? "text-warning" : "text-muted"}
            fill={index < rating ? "currentColor" : "none"}
          />
        ))}
        <span className="text-muted small ms-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const filteredAndSortedFavorites = favorites
    .filter(fav => {
      if (filter === 'all') return true;
      if (filter === 'rated') return fav.coffeeShop?.rating > 0;
      if (filter === 'unrated') return !fav.coffeeShop?.rating;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'rating':
          return (b.coffeeShop?.rating || 0) - (a.coffeeShop?.rating || 0);
        case 'name':
          return a.coffeeShop?.name.localeCompare(b.coffeeShop?.name);
        default:
          return 0;
      }
    });

  if (favoritesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <Heart size={48} className="text-danger mb-3 animate-pulse" />
          <p className="text-muted">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 d-flex align-items-center">
            <Heart className="text-danger me-2" size={32} />
            My Favorite Coffee Shops
          </h2>
          <p className="text-muted mb-0">
            {favorites.length} favorite coffee shop{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button 
          className="btn btn-warning rounded-pill px-4 d-flex align-items-center"
          onClick={() => navigate('/search')}
        >
          <Coffee size={20} className="me-2" />
          Discover More
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-5">
          <Heart size={64} className="text-muted mb-3" />
          <h4 className="text-muted mb-3">No favorites yet</h4>
          <p className="text-muted mb-4">
            Start exploring coffee shops and save your favorites for easy access!
          </p>
          <button 
            className="btn btn-warning rounded-pill px-4"
            onClick={() => navigate('/search')}
          >
            <Coffee size={20} className="me-2" />
            Find Coffee Shops
          </button>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="d-flex gap-2">
                <button
                  className={`btn btn-sm rounded-pill ${filter === 'all' ? 'btn-warning' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter('all')}
                >
                  All ({favorites.length})
                </button>
                <button
                  className={`btn btn-sm rounded-pill ${filter === 'rated' ? 'btn-warning' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter('rated')}
                >
                  Rated ({favorites.filter(f => f.coffeeShop?.rating).length})
                </button>
                <button
                  className={`btn btn-sm rounded-pill ${filter === 'unrated' ? 'btn-warning' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter('unrated')}
                >
                  Unrated ({favorites.filter(f => !f.coffeeShop?.rating).length})
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <select 
                className="form-select form-select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ maxWidth: '200px', marginLeft: 'auto' }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Favorites Grid */}
          <div className="row g-4">
            {filteredAndSortedFavorites.map((favorite) => (
              <div key={favorite.id} className="col-lg-6 col-xl-4">
                <div 
                  className="card h-100 border-0 shadow-sm position-relative"
                  style={{ borderRadius: "16px" }}
                >
                  {/* Remove Heart Button */}
                  <button
                    className="btn btn-sm position-absolute top-0 end-0 m-3 rounded-circle bg-white shadow-sm"
                    onClick={() => handleRemoveFromFavorites(favorite.coffeeShopId)}
                    style={{ width: "40px", height: "40px", zIndex: 2 }}
                  >
                    <Heart size={18} className="text-danger" fill="currentColor" />
                  </button>

                  {/* Coffee Shop Image */}
                  <div 
                    className="position-relative overflow-hidden"
                    style={{ borderRadius: "16px 16px 0 0", cursor: 'pointer' }}
                    onClick={() => handleViewCoffeeShop(favorite.coffeeShopId)}
                  >
                    <img
                      src={favorite.coffeeShop?.imageUrl || '/assets/cafe_placeholder.jpg'}
                      alt={favorite.coffeeShop?.name}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="position-absolute bottom-0 start-0 w-100 p-3" 
                         style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
                      <h5 className="text-white fw-bold mb-0">{favorite.coffeeShop?.name}</h5>
                    </div>
                  </div>

                  <div className="card-body p-4">
                    {/* Rating */}
                    <div className="mb-2">
                      {renderStars(favorite.coffeeShop?.rating)}
                    </div>

                    {/* Address */}
                    <div className="d-flex align-items-start mb-2">
                      <MapPin size={16} className="text-muted me-2 mt-1 flex-shrink-0" />
                      <span className="text-muted small">
                        {favorite.coffeeShop?.address}
                      </span>
                    </div>

                    {/* Phone */}
                    {favorite.coffeeShop?.phone && (
                      <div className="d-flex align-items-center mb-2">
                        <Phone size={16} className="text-muted me-2" />
                        <a 
                          href={`tel:${favorite.coffeeShop.phone}`}
                          className="text-decoration-none small"
                        >
                          {favorite.coffeeShop.phone}
                        </a>
                      </div>
                    )}

                    {/* Hours */}
                    {favorite.coffeeShop?.openingHours && (
                      <div className="d-flex align-items-center mb-3">
                        <Clock size={16} className="text-muted me-2" />
                        <span className="text-muted small">
                          {typeof favorite.coffeeShop.openingHours === 'object' 
                            ? favorite.coffeeShop.openingHours.today || 'Check website'
                            : favorite.coffeeShop.openingHours}
                        </span>
                      </div>
                    )}

                    {/* Personal Notes */}
                    {favorite.notes && (
                      <div className="mb-3 p-2 bg-light rounded-3">
                        <small className="text-muted fw-semibold">My Notes:</small>
                        <p className="mb-0 small">{favorite.notes}</p>
                      </div>
                    )}

                    {/* Categories */}
                    {favorite.coffeeShop?.categories?.length > 0 && (
                      <div className="mb-3">
                        {favorite.coffeeShop.categories.slice(0, 2).map((cat) => (
                          <span 
                            key={cat.category.id}
                            className="badge bg-light text-dark me-1"
                            style={{ fontSize: '0.7rem' }}
                          >
                            {cat.category.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning btn-sm rounded-pill flex-fill"
                        onClick={() => handleViewCoffeeShop(favorite.coffeeShopId)}
                      >
                        <Coffee size={14} className="me-1" />
                        View Details
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                        onClick={() => handleGetDirections(favorite.coffeeShop)}
                        title="Get Directions"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>

                    {/* Favorite Date */}
                    <div className="text-center mt-3 pt-2 border-top">
                      <small className="text-muted">
                        ❤️ Added {new Date(favorite.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="row mt-5 pt-4 border-top">
            <div className="col-12 mb-3">
              <h5>Your Favorites Overview</h5>
            </div>
            <div className="col-md-3 col-6 text-center mb-3">
              <div className="card border-0 bg-light">
                <div className="card-body">
                  <Heart className="text-danger mb-2" size={24} />
                  <h6 className="fw-bold">{favorites.length}</h6>
                  <small className="text-muted">Total Favorites</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6 text-center mb-3">
              <div className="card border-0 bg-light">
                <div className="card-body">
                  <Star className="text-warning mb-2" size={24} />
                  <h6 className="fw-bold">
                    {favorites.filter(f => f.coffeeShop?.rating >= 4).length}
                  </h6>
                  <small className="text-muted">Highly Rated (4+ ⭐)</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6 text-center mb-3">
              <div className="card border-0 bg-light">
                <div className="card-body">
                  <MapPin className="text-info mb-2" size={24} />
                  <h6 className="fw-bold">
                    {new Set(favorites.map(f => f.coffeeShop?.city)).size}
                  </h6>
                  <small className="text-muted">Cities</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6 text-center mb-3">
              <div className="card border-0 bg-light">
                <div className="card-body">
                  <Coffee className="text-warning mb-2" size={24} />
                  <h6 className="fw-bold">
                    {favorites.filter(f => f.notes).length}
                  </h6>
                  <small className="text-muted">With Notes</small>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}