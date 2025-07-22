import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";

export default function ViewSuggestion() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suggestions/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        console.error("Failed to fetch suggestion", err);
      }
    };

    if (!location.state) {
      fetchSuggestion();
    } else {
      setFormData(location.state);
    }
  }, [location.state, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { destination, description, image, website, category } = formData;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suggestions/${formData.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, description, image, website, category }),
      });

      if (res.ok) {
        alert("Suggestion updated successfully");
        navigate("/suggested-plans");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update suggestion.");
      }
    } catch (error) {
      alert("Error updating suggestion.");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this suggestion?");
    if (!confirm) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suggestions/${formData.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        navigate("/suggested-plans");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to delete suggestion.");
      }
    } catch (error) {
      alert("Error deleting suggestion.");
    }
  };

  const handleAddPlace = async () => {
    if (!newPlaceName.trim()) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suggestions/${formData.id}/places`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPlaceName }),
      });

      const data = await res.json();
      if (res.ok) {
        setNewPlaceName("");
        // Navigate back so next view fetches fresh data
        navigate("/suggested-plans");
      } else {
        alert(data.message || "Failed to add place");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemovePlace = async (placeId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suggestions/place/${placeId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          places: prev.places.filter((p) => p.id !== placeId),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPlace = async (placeId, newName) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suggestions/place/${placeId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          places: prev.places.map((p) => (p.id === placeId ? { ...p, name: newName } : p)),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const ensureHttp = (url) =>
    url?.startsWith("http://") || url?.startsWith("https://") ? url : `https://${url}`;

  if (!formData) return <div className="text-center mt-5">Loading suggestion...</div>;

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2 className="mb-4 text-center fw-bold">Viewing {formData.destination}</h2>
      <div className="card shadow-sm overflow-hidden">
        {formData.image && (
          <img
            src={ensureHttp(formData.image)}
            alt="Trip"
            className="w-100"
            style={{ height: "400px", objectFit: "cover" }}
          />
        )}

        <div className="card-body">
          <h5 className="card-title text-center mb-4">Itinerary Details</h5>

          <div className="mb-3"><strong>Destination:</strong> {formData.destination}</div>

          <div className="mb-4">
            <strong>Places:</strong>
            <ul className="list-group mt-2">
              {Array.isArray(formData.places) && formData.places.length > 0 ? (
                formData.places.map((place) => (
                  <li key={place.id || place.name} className="list-group-item d-flex justify-content-between align-items-center">
                    {isEditing ? (
                      <>
                        <input
                          className="form-control me-2"
                          value={place.name}
                          onChange={(e) => handleEditPlace(place.id, e.target.value)}
                        />
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemovePlace(place.id)}>✕</button>
                      </>
                    ) : (
                      place.name
                    )}
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted">No places added</li>
              )}
            </ul>

            {isEditing && (
              <div className="d-flex mt-3">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Add new place"
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                />
                <button className="btn btn-outline-primary" type="button" onClick={handleAddPlace}>Add</button>
              </div>
            )}
          </div>

          <div className="mb-3"><strong>Description:</strong> {formData.description}</div>
          <div className="mb-3"><strong>Website:</strong> {formData.website ? (
            <a href={ensureHttp(formData.website)} target="_blank" rel="noreferrer">{formData.website}</a>) : "N/A"}
          </div>
          <div className="mb-4"><strong>Category:</strong> {formData.category}</div>

          {user && formData.userId === user.id && !isEditing && (
            <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
              <button className="btn btn-outline-primary w-100" onClick={() => setIsEditing(true)}>✏️ Edit Suggestion</button>
              <button className="btn btn-outline-danger w-100" onClick={handleDelete}>🗑️ Delete Suggestion</button>
            </div>
          )}

          {isEditing && (
            <form onSubmit={handleUpdate} className="mt-4">
              <div className="mb-3">
                <label className="form-label">Destination</label>
                <input type="text" name="destination" className="form-control" value={formData.destination || ""} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-control" value={formData.description || ""} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <input type="text" name="image" className="form-control" value={formData.image || ""} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Website</label>
                <input type="text" name="website" className="form-control" value={formData.website || ""} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Category</label>
                <input type="text" name="category" className="form-control" value={formData.category || ""} onChange={handleChange} />
              </div>

              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-success w-100">✅ Save Changes</button>
                <button type="button" className="btn btn-secondary w-100" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
