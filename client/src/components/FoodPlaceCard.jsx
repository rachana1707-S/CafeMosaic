import React from "react";
import { Star, Phone, Clock, MapPin, Heart, Plus } from "lucide-react";
import cafePlaceholder from "../assets/cafe_placeholder.jpeg";
import chainCoffeePlaceholder from "../assets/chain_coffee_placeholder.jpeg";
import localRoasterPlaceholder from "../assets/local_roaster_placeholder.jpg";
import driveThruPlaceholder from "../assets/drive_thru_placeholder.jpg";

export default function CoffeeShopCard({ 
  coffeeShop, 
  onAddToFavorites, 
  onAddToCollection, 
  selectedCollection, 
  isInFavorites,
  isInCollection,
  showAddToCollection = true 
}) {
  const categories = coffeeShop.categories || [];

  const getImageForCategory = () => {
    if (categories.some((c) => c.category?.name?.includes("Chain"))) {
      return chainCoffeePlaceholder;
    }
    if (categories.some((c) => c.category?.name?.includes("Local Roaster"))) {
      return localRoasterPlaceholder;
    }
    if (categories.some((c) => c.category?.name?.includes("Drive-Thru"))) {
      return driveThruPlaceholder;
    }
    return cafePlaceholder;
  };

  const getCategoryLabel = () => {
    if (categories.length > 0) {
      const category = categories[0].category;
      return {
        text: category.name,
        color: category.color || "primary"
      };
    }
    return { text: "Coffee Shop", color: "primary" };
  };

  const handleAddToFavorites = (e) => {
    e.stopPropagation();
    if (!isInFavorites) onAddToFavorites(coffeeShop);
  };

  const handleAddToCollection = (e) => {
    e.stopPropagation();
    if (!isInCollection && showAddToCollection) onAddToCollection(coffeeShop);
  };

  const categoryLabel = getCategoryLabel();
  const openingHours = coffeeShop.openingHours;
  const phone = coffeeShop.phone;
  const distance = coffeeShop.distance;

  // Format rating
  const rating = coffeeShop.rating || 0;
  const reviewCount = coffeeShop._count?.reviews || 0;
  const favoritesCount = coffeeShop._count?.favorites || 0;

  return (
    <div className="col" style={{ cursor: "pointer" }}>
      <div
        className="card h-100 border-0 shadow-sm position-relative"
        style={{
          borderRadius: "16px",
          transition: "all 0.3s ease",
          overflow: "hidden"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        }}
      >
        <div className="position-relative">
          <img
            src={coffeeShop.imageUrl || getImageForCategory()}
            alt={coffeeShop.name}
            className="card-img-top"
            loading="lazy"
            style={{
              height: "200px",
              objectFit: "cover",
            }}
          />

          {/* Category Badge */}
          <span
            className={`badge position-absolute top-0 start-0 m-3`}
            style={{
              fontSize: "0.75rem",
              padding: "8px 12px",
              borderRadius: "12px",
              backgroundColor: categoryLabel.color === "primary" ? "#0d6efd" : 
                             categoryLabel.color === "success" ? "#198754" :
                             categoryLabel.color === "warning" ? "#ffc107" :
                             categoryLabel.color === "danger" ? "#dc3545" : "#6c757d",
              backdropFilter: "blur(8px)",
              fontWeight: "600"
            }}
          >
            {categoryLabel.text}
          </span>

          {/* Distance Badge */}
          {distance && (
            <span
              className="badge bg-dark position-absolute top-0 end-0 m-3"
              style={{
                fontSize: "0.75rem",
                padding: "8px 12px",
                borderRadius: "12px",
                backdropFilter: "blur(8px)",
              }}
            >
              {distance} km
            </span>
          )}

          {/* Action Buttons */}
          <div className="position-absolute bottom-0 end-0 m-3 d-flex gap-2">
            {/* Add to Favorites */}
            <button
              className={`btn btn-sm rounded-circle ${
                isInFavorites ? "btn-danger" : "btn-light"
              }`}
              style={{ 
                width: "40px", 
                height: "40px", 
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(8px)",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
              disabled={isInFavorites}
              onClick={handleAddToFavorites}
              title={isInFavorites ? "Already in Favorites" : "Add to Favorites"}
            >
              <Heart 
                size={18} 
                fill={isInFavorites ? "currentColor" : "none"}
                className={isInFavorites ? "text-white" : "text-danger"}
              />
            </button>

            {/* Add to Collection */}
            {showAddToCollection && (
              <button
                className={`btn btn-sm rounded-circle ${
                  isInCollection ? "btn-success" : "btn-warning"
                }`}
                style={{ 
                  width: "40px", 
                  height: "40px",
                  display: "flex",
                  alignItems: "center", 
                  justifyContent: "center",
                  backdropFilter: "blur(8px)",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
                disabled={isInCollection}
                onClick={handleAddToCollection}
                title={isInCollection ? "Already in Collection" : "Add to Collection"}
              >
                {isInCollection ? (
                  <i className="fas fa-check text-white"></i>
                ) : (
                  <Plus size={18} className="text-white" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="card-body p-4">
          {/* Coffee Shop Name */}
          <h5 className="fw-bold mb-2 text-dark" style={{ fontSize: "1.1rem" }}>
            {coffeeShop.name}
          </h5>
          
          {/* Rating */}
          {rating > 0 && (
            <div className="d-flex align-items-center mb-2">
              <div className="d-flex me-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= rating ? "text-warning" : "text-muted"}
                    fill={star <= rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-muted small">
                ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
              </span>
            </div>
          )}

          {/* Address */}
          <div className="d-flex align-items-start mb-2">
            <MapPin size={16} className="text-muted me-2 mt-1 flex-shrink-0" />
            <p className="text-muted mb-0 small">
              {coffeeShop.address}
            </p>
          </div>

          {/* Opening Hours */}
          {openingHours && (
            <div className="d-flex align-items-center mb-2">
              <Clock size={16} className="text-muted me-2" />
              <p className="text-muted small mb-0">
                <strong>Hours:</strong> {typeof openingHours === 'object' ? 
                  openingHours.today || 'Check website' : openingHours}
              </p>
            </div>
          )}

          {/* Phone */}
          {phone && (
            <div className="d-flex align-items-center mb-2">
              <Phone size={16} className="text-muted me-2" />
              <p className="text-muted small mb-0">
                <a href={`tel:${phone}`} className="text-decoration-none text-dark">
                  {phone}
                </a>
              </p>
            </div>
          )}

          {/* Price Level */}
          {coffeeShop.priceLevel && (
            <div className="d-flex align-items-center mb-2">
              <span className="text-muted small me-2">Price:</span>
              <span className="text-warning">
                {'$'.repeat(coffeeShop.priceLevel)}
                <span className="text-muted">
                  {'$'.repeat(4 - coffeeShop.priceLevel)}
                </span>
              </span>
            </div>
          )}

          {/* Amenities */}
          {coffeeShop.amenities && Object.keys(coffeeShop.amenities).length > 0 && (
            <div className="mt-3">
              <div className="d-flex flex-wrap gap-1">
                {Object.entries(coffeeShop.amenities).slice(0, 3).map(([key, value]) => (
                  value && (
                    <span 
                      key={key}
                      className="badge bg-light text-dark"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="mt-3 pt-2 border-top">
            <div className="d-flex justify-content-between text-muted small">
              <span>
                <Heart size={14} className="me-1" />
                {favoritesCount} favorite{favoritesCount !== 1 ? 's' : ''}
              </span>
              <span>
                <Star size={14} className="me-1" />
                {reviewCount} review{reviewCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}