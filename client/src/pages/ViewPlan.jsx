import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import fallbackImage from "../assets/fallback.webp";

export default function ViewPlan() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [plan, setPlan] = useState(location.state || null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(!location.state);
  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const [editedPlace, setEditedPlace] = useState({});

  useEffect(() => {
    if (!plan) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/plans/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setPlan(res.data);
          setPlaces(res.data.places || []);
        })
        .catch((err) => {
          console.error("Failed to fetch plan:", err);
        })
        .finally(() => setLoading(false));
    } else {
      setPlaces(plan.places || []);
    }
  }, [plan, id]);

  const handleDeletePlan = async () => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/plans/${plan.id}`, {
        withCredentials: true,
      });
      alert("Plan deleted successfully.");
      navigate("/saved-plans");
    } catch (err) {
      alert("Failed to delete plan.");
    }
  };

  const handleDeletePlace = async (placeId) => {
    if (!window.confirm("Delete this place from the plan?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/trip-places/${placeId}`, {
        withCredentials: true,
      });
      setPlaces((prev) => prev.filter((p) => p.id !== placeId));
    } catch (err) {
      alert("Failed to delete place.");
    }
  };

  const handleEditPlace = (place) => {
    setEditingPlaceId(place.id);
    setEditedPlace(place);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedPlace((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/trip-places/${editingPlaceId}`,
        editedPlace,
        { withCredentials: true }
      );
      setPlaces((prev) => prev.map((p) => (p.id === editingPlaceId ? res.data : p)));
      setEditingPlaceId(null);
    } catch (err) {
      alert("Failed to update place.");
    }
  };

  const getImage = () => {
    return plan.image?.trim() ? plan.image : fallbackImage;
  };

  if (loading) return <p className="text-center mt-5">Loading plan...</p>;
  if (!plan) return <p className="text-center mt-5">Plan not found.</p>;

  return (
    <div className="container-fluid px-0">
      {/* Banner */}
      <div
        className="position-relative"
        style={{
          backgroundImage: `url(${getImage()})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
        }}
      >
        <div
          className="position-absolute bottom-0 start-0 p-4 text-white"
          style={{ background: "rgba(0,0,0,0.4)", width: "100%" }}
        >
          <h1 className="fw-bold">{plan.name}</h1>
          <div className="d-flex flex-wrap gap-2 mt-2">
            <span className="badge bg-secondary">Saved Itinerary</span>
            <span className="badge bg-light text-dark">{plan.category || "Travel"}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mt-4">
        {/* Back button */}
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Planned Stops</h3>
          <button className="btn btn-outline-danger" onClick={handleDeletePlan}>
            Delete Plan
          </button>
        </div>

        {plan.description && <p className="text-muted mb-4">{plan.description}</p>}

        {places.length === 0 ? (
          <p className="text-center mt-4">No places added to this plan.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {places.map((place) => (
              <div className="col" key={place.id}>
                <div className="card h-100 shadow-sm border-0 rounded-4">
                  {place.imageUrl && (
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body d-flex flex-column justify-content-between">
                    {editingPlaceId === place.id ? (
                      <>
                        {[
                          "name",
                          "address",
                          "phone",
                          "website",
                          "category",
                          "hours",
                          "city",
                          "state",
                          "country",
                          "notes",
                          "imageUrl",
                        ].map((field) => (
                          <input
                            key={field}
                            className="form-control mb-2"
                            name={field}
                            value={editedPlace[field] || ""}
                            onChange={handleEditChange}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                          />
                        ))}
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn btn-success btn-sm" onClick={handleEditSave}>Save</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditingPlaceId(null)}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h5 className="card-title mb-2">{place.name}</h5>
                        {place.hours && <p className="mb-1"><strong>🕐 Open Hours:</strong> {place.hours}</p>}
                        {place.address && <p className="mb-1"><strong>📍 Address:</strong> {place.address}</p>}
                        {place.city && <p className="mb-1"><strong>🏙️ City:</strong> {place.city}</p>}
                        {place.state && <p className="mb-1"><strong>🗺️ State:</strong> {place.state}</p>}
                        {place.country && <p className="mb-1"><strong>🌍 Country:</strong> {place.country}</p>}
                        {place.category && <p className="mb-1"><strong>📌 Category:</strong> {place.category}</p>}
                        {place.notes && <p className="mb-1"><strong>📝 Notes:</strong> {place.notes}</p>}
                        {place.phone && <p className="mb-1"><strong>📞 Phone:</strong> {place.phone}</p>}
                        {place.website && (
                          <p className="mb-1">
                            <strong>🔗 Website:</strong>{" "}
                            <a
                              href={place.website.startsWith("http") ? place.website : `https://${place.website}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {place.website}
                            </a>
                          </p>
                        )}
                        {place.latitude && place.longitude && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-success my-2"
                          >
                            View on Google Maps
                          </a>
                        )}
                        <div className="d-flex justify-content-end gap-2 mt-2">
                          <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1" onClick={() => handleEditPlace(place)}>
                            <BsPencilSquare /> Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" onClick={() => handleDeletePlace(place.id)}>
                            <BsTrash /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
