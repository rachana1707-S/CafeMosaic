import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 

export default function TripSuggestions() {
  const { suggestionId } = useParams(); 
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    // Fetch the suggestion details based on the id
    fetch(`${import.meta.env.VITE_API_URL}/api/suggestions/${suggestionId}`)
      .then((res) => res.json())
      .then((data) => setSuggestion(data))
      .catch((error) => {
        console.error("Error fetching suggestion:", error);
        // Show 404 error or handle it appropriately
      });
  }, [suggestionId]);

  if (!suggestion) return <p>Loading...</p>; // Display loading message while fetching data

  return (
    <div className="container mt-4" style={{ paddingTop: "60px" }}>
      <div className="destination-box" style={{
        padding: "20px", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "8px", 
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px"
      }}>
        <h2 className="text-center" style={{ fontSize: "2rem", fontWeight: "bold" }}>{suggestion.destination}</h2>
      </div>

      {/* Content Box */}
      <div className="content-box" style={{
        padding: "20px", 
        backgroundColor: "#ffffff", 
        borderRadius: "8px", 
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px"
      }}>
        <p><strong>Places:</strong> {suggestion.places ? JSON.parse(suggestion.places).join(', ') : 'N/A'}</p>
        <p><strong>Description:</strong> {suggestion.description}</p>

        {/* Display image from the image URL */}
        {suggestion.image && (
          <div className="image-container" style={{ marginBottom: "20px" }}>
            <img
              src={suggestion.image}
              alt="Suggestion Image"
              className="img-fluid"
              style={{
                maxWidth: "100%",
                height: "auto", 
                borderRadius: "10px", 
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
              }}
            />
          </div>
        )}

        <p><strong>Website:</strong> 
          {suggestion.website ? (
            <a href={suggestion.website} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
              {suggestion.website}
            </a>
          ) : 'N/A'}
        </p>

        <p><strong>Category:</strong> {suggestion.category}</p>
        <p><strong>Suggested By:</strong> {suggestion.user?.username}</p>
      </div>
    </div>
  );
}
