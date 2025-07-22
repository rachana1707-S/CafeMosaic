import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TripSelectorModal({ place, userId, onClose, selectedPlan, setSelectedPlan }) {
  const [trips, setTrips] = useState([]);
  const [localSelectedTrip, setLocalSelectedTrip] = useState(selectedPlan?.id || "");
  const [newTripName, setNewTripName] = useState("");

  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/plans/user/${userId}`, { withCredentials: true });
        setTrips(res.data);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
      }
    }
    fetchTrips();
  }, [userId]);

  const handleAddToTrip = async () => {
    const chosenTripId = localSelectedTrip;

    if (!chosenTripId) {
      alert("Please select or create a trip.");
      return;
    }

    try {
        await axios.post(
            `${import.meta.env.VITE_API_URL}/api/plans/${chosenTripId}/places`,
            {
              placeId: place.properties.place_id,
              name: place.properties.name,
              address: place.properties.formatted,
              latitude: place.properties.lat,
              longitude: place.properties.lon,
              category: place.properties.categories[0] || "Uncategorized",
              source: "Geoapify",
              phone: place.properties.contact?.phone || "",
              website: place.properties.website || place.properties.datasource?.url || "",
              imageUrl: "", // if available
              notes: "",
              order: 0,
            },
            { withCredentials: true }
          );
          

      onClose();
    } catch (error) {
      console.error("Error adding place to trip:", error);
      alert("Failed to add to plan. Try again.");
    }
  };

  const handleCreateNewTrip = async () => {
    if (!newTripName.trim()) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/plans`,
        {
          userId,
          name: newTripName,
          description: "",
        },
        { withCredentials: true }
      );
      
      const newTrip = res.data;
      setTrips([...trips, newTrip]);
      setLocalSelectedTrip(newTrip.id);
      setSelectedPlan(newTrip); 
      setNewTripName("");
    } catch (err) {
      console.error("Error creating trip:", err);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Select or Create a Trip</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <label className="form-label">Choose an existing plan:</label>
            <select
              className="form-select mb-3"
              value={localSelectedTrip}
              onChange={(e) => {
                const selected = trips.find((trip) => trip.id === parseInt(e.target.value));
                setLocalSelectedTrip(e.target.value);
                if (selected) setSelectedPlan(selected); 
              }}
            >
              <option value="">-- Select a Trip --</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name}
                </option>
              ))}
            </select>

            <hr />

            <label className="form-label">Or create a new plan:</label>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="New trip name"
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
              />
              <button className="btn btn-outline-secondary" onClick={handleCreateNewTrip}>
                Create
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddToTrip}>Add to Plan</button>
          </div>
        </div>
      </div>
    </div>
  );
}
