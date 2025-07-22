import React, { useState, useEffect } from "react";
import fallbackImage from "../assets/fallback.webp";
import { useNavigate } from "react-router-dom";

export default function SuggestedPlans() {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/suggestions`)
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch((error) => console.error("Error fetching suggestions:", error));
  }, []);

  const getImage = (url) => {
    return url && url.trim() !== "" ? url : fallbackImage;
  };

  const formatPlaces = (places) => {
    if (!places) return [];
    if (Array.isArray(places)) {
      if (typeof places[0] === "object") {
        return places.map(p => p.name); 
      }
      return places;
    }

    try {
      const parsed = JSON.parse(places);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return typeof places === "string" ? places.split(",") : [];
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #f8f9fa, #e9ecef)",
        minHeight: "100vh",
        paddingTop: "80px",
        paddingBottom: "40px",
      }}
    >
      {selectedSuggestion ? (
        <>
          {/* Header Image */}
          <div
            className="position-relative w-100 bg-dark"
            style={{
              backgroundImage: `url(${getImage(selectedSuggestion.image)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="d-block d-lg-none" style={{ aspectRatio: "16/9" }} />
            <div className="d-none d-lg-block" style={{ height: "75vh" }} />

            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: "rgba(0, 0, 0, 0.3)" }} />

            <button
              className="btn btn-light position-absolute top-0 start-0 m-3"
              onClick={() => setSelectedSuggestion(null)}
              style={{ zIndex: 2 }}
            >
              ← Back
            </button>

            <div className="position-absolute bottom-0 start-0 text-white p-4" style={{ zIndex: 2 }}>
              <h1 className="fw-bold display-5">{selectedSuggestion.destination}</h1>
              <div className="d-flex flex-wrap gap-2 mt-2">
                <span className="badge bg-secondary">Suggested Itinerary</span>
                <span className="badge bg-dark">{selectedSuggestion.category || "Travel"}</span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="container mt-4">
            <div className="d-flex align-items-center mb-3">
              <img
                src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${selectedSuggestion.user?.username}`}
                alt={selectedSuggestion.user?.username}
                className="rounded-circle me-2"
                style={{ width: "40px", height: "40px" }}
              />
              <div>
                <div className="fw-semibold">{selectedSuggestion.user?.username}</div>
                <div className="text-muted small">Shared itinerary</div>
              </div>
            </div>

            <p className="lead">{selectedSuggestion.description || "No description available."}</p>

            <div className="mt-4">
              <h5>Places to Visit</h5>
              <ul className="list-unstyled ps-3">
                {formatPlaces(selectedSuggestion.places).map((place, idx) => (
                  <li key={idx}>• {place}</li>
                ))}
              </ul>
            </div>

            <div className="mt-3">
              <h6 className="mb-1">Website:</h6>
              {selectedSuggestion.website ? (
                <a
                  href={selectedSuggestion.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  {selectedSuggestion.website}
                </a>
              ) : (
                <p className="text-muted">N/A</p>
              )}
            </div>

            <div className="mt-2">
              <h6 className="mb-1">Category:</h6>
              <p>{selectedSuggestion.category || "N/A"}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="container">
          <h2 className="text-center mb-4 fw-bold">Travel Itineraries for you</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
            {suggestions.length === 0 ? (
              <div className="col-12 text-center">
                <p>No trip suggestions available.</p>
              </div>
            ) : (
              suggestions.map((suggestion) => (
                <div
                  className="col"
                  key={suggestion.id}
                  onClick={() => setSelectedSuggestion(suggestion)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="card h-100 border-0 shadow-sm"
                    style={{
                      borderRadius: "10px",
                      overflow: "hidden",
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
                    <img
                      src={getImage(suggestion.image)}
                      alt={suggestion.destination}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title fw-semibold text-truncate mb-2">
                        {suggestion.destination}
                      </h5>
                      <p
                        className="card-text text-muted"
                        style={{ maxHeight: "60px", overflow: "hidden" }}
                      >
                        {suggestion.description?.slice(0, 100) || "No description available"}...
                      </p>
                    </div>
                    <div className="card-footer d-flex align-items-center bg-transparent border-0 px-3 pb-3">
                      <img
                        src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${suggestion.user?.username}`}
                        alt={suggestion.user?.username}
                        className="rounded-circle me-2"
                        style={{ width: "30px", height: "30px" }}
                      />
                      <span className="fw-medium small">{suggestion.user?.username}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
