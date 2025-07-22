import React from "react";
import placeholderAttractions from "../assets/tourism.jpeg";
import placeholderRestaurants from "../assets/restaurant.jpeg";
import placeholderParks from "../assets/park.jpeg";

export default function PlaceCard({ place, onAdd, selectedTrip, isAdded }) {
  const categories = place.properties.categories || [];

  const getImageForCategory = () => {
    if (categories.some((c) => c.includes("restaurant") || c.includes("catering"))) {
      return placeholderRestaurants;
    }
    if (categories.some((c) => c.includes("park") || c.includes("recreation"))) {
      return placeholderParks;
    }
    return placeholderAttractions;
  };

  const getCategoryLabel = () => {
    if (categories.some((c) => c.includes("restaurant") || c.includes("catering"))) {
      return { text: "Restaurant", color: "danger" };
    }
    if (categories.some((c) => c.includes("park") || c.includes("recreation"))) {
      return { text: "Park", color: "success" };
    }
    return { text: "Tourist Place", color: "primary" };
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!isAdded) onAdd(place);
  };

  const categoryLabel = getCategoryLabel();
  const openingHours = place.properties.opening_hours;
  const phone =
    place.properties.contact?.phone ||
    place.properties.datasource?.raw?.phone ||
    null;

  return (
    <div className="col" style={{ cursor: "pointer" }}>
      <div
        className="card h-100 border-0 shadow-sm position-relative"
        style={{
          borderRadius: "12px",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";
        }}
      >
        <div className="position-relative">
          <img
            src={getImageForCategory()}
            alt={place.properties.name}
            className="card-img-top"
            loading="lazy"
            style={{
              height: "180px",
              objectFit: "cover",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
            }}
          />

          {/* Category Label */}
          <span
            className={`badge bg-${categoryLabel.color} position-absolute top-0 start-0 m-2`}
            style={{
              fontSize: "0.75rem",
              padding: "6px 10px",
              borderRadius: "8px",
              backdropFilter: "blur(6px)",
              opacity: 0.95,
            }}
          >
            {categoryLabel.text}
          </span>

          {/* Add Button */}
          <button
            className={`btn position-absolute top-0 end-0 m-2 rounded-circle ${
              isAdded ? "btn-success" : "btn-primary"
            }`}
            style={{ width: "36px", height: "36px", fontWeight: "bold" }}
            disabled={isAdded}
            onClick={handleAdd}
            title={isAdded ? "Already Added" : "Add to Plan"}
          >
            {isAdded ? "✓" : "+"}
          </button>
        </div>

        <div className="card-body p-3">
          <h5 className="fw-bold mb-2 text-dark">{place.properties.name}</h5>
          <p className="text-muted mb-1">
            {place.properties.city}, {place.properties.state}
          </p>
          <p className="text-muted">{place.properties.country}</p>

          {openingHours && (
            <p className="text-muted small mb-1">
              <strong>Hours:</strong> {openingHours}
            </p>
          )}

          {phone && (
            <p className="text-muted small mb-0">
              <strong>Phone:</strong>{" "}
              <a href={`tel:${phone}`} className="text-decoration-none text-dark">
                {phone}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
