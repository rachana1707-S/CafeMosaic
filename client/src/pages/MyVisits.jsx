import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";

export default function MyVisits() {
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, visited, want-to-visit
  const [sortBy, setSortBy] = useState("date"); // date, rating, name
  const [showAddVisitForm, setShowAddVisitForm] = useState(false);
  const [newVisit, setNewVisit] = useState({
    coffeeShopName: "",
    location: "",
    visitDate: "",
    notes: "",
    status: "visited", // visited, want-to-visit
    rating: ""
  });

  useEffect(() => {
    if (user) {
      fetchVisits();
    }
  }, [user]);

  const fetchVisits = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/visits`, {
        credentials: "include",
      });
      const data = await res.json();
      setVisits(data);
    } catch (error) {
      console.error("Error fetching visits:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVisit = async (e) => {
    e.preventDefault();
    
    if (!newVisit.coffeeShopName) {
      alert("Coffee shop name is required.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/visits`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newVisit,
          rating: newVisit.rating ? Number(newVisit.rating) : null,
        }),
      });

      if (res.ok) {
        const visitData = await res.json();
        setVisits([visitData, ...visits]);
        setNewVisit({
          coffeeShopName: "",
          location: "",
          visitDate: "",
          notes: "",
          status: "visited",
          rating: ""
        });
        setShowAddVisitForm(false);
        alert("Visit added successfully!");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to add visit.");
      }
    } catch (error) {
      alert("Error adding visit. Try again.");
    }
  };

  const handleDeleteVisit = async (visitId) => {
    if (!window.confirm("Are you sure you want to delete this visit?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/visits/${visitId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setVisits(visits.filter(v => v.id !== visitId));
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to delete visit.");
      }
    } catch (error) {
      alert("Error deleting visit.");
    }
  };

  const handleUpdateVisitStatus = async (visitId, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/visits/${visitId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedVisit = await res.json();
        setVisits(visits.map(v => v.id === visitId ? updatedVisit : v));
      } else {
        alert("Failed to update visit status.");
      }
    } catch (error) {
      alert("Error updating visit status.");
    }
  };

  const filteredVisits = visits.filter(visit => {
    if (filter === "all") return true;
    return visit.status === filter.replace("-", "_");
  });

  const sortedVisits = [...filteredVisits].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.visitDate || b.createdAt) - new Date(a.visitDate || a.createdAt);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "name":
        return a.coffeeShopName.localeCompare(b.coffeeShopName);
      default:
        return 0;
    }
  });

  const renderStars = (rating) => {
    if (!rating) return "Not rated";
    return "⭐".repeat(rating) + "☆".repeat(5 - rating) + ` (${rating}/5)`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "visited":
        return <span className="badge bg-success">Visited ✓</span>;
      case "want_to_visit":
        return <span className="badge bg-warning">Want to Visit</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <p>Please log in to track your coffee shop visits.</p>
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="container mt-5"><div className="text-center">Loading visits...</div></div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Coffee Shop Visits</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddVisitForm(!showAddVisitForm)}
        >
          {showAddVisitForm ? "Cancel" : "Add Visit"}
        </button>
      </div>

      {/* Add Visit Form */}
      {showAddVisitForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Add New Visit</h5>
            <form onSubmit={handleAddVisit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Coffee Shop Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newVisit.coffeeShopName}
                    onChange={(e) => setNewVisit({...newVisit, coffeeShopName: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newVisit.location}
                    onChange={(e) => setNewVisit({...newVisit, location: e.target.value})}
                    placeholder="Address or area"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Visit Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newVisit.visitDate}
                    onChange={(e) => setNewVisit({...newVisit, visitDate: e.target.value})}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={newVisit.status}
                    onChange={(e) => setNewVisit({...newVisit, status: e.target.value})}
                  >
                    <option value="visited">Visited</option>
                    <option value="want_to_visit">Want to Visit</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Rating (if visited)</label>
                  <select
                    className="form-control"
                    value={newVisit.rating}
                    onChange={(e) => setNewVisit({...newVisit, rating: e.target.value})}
                    disabled={newVisit.status === "want_to_visit"}
                  >
                    <option value="">No rating</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={newVisit.notes}
                  onChange={(e) => setNewVisit({...newVisit, notes: e.target.value})}
                  placeholder="Add any notes about your visit or why you want to visit..."
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">Add Visit</button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setShowAddVisitForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex gap-2 flex-wrap">
                <button 
                  className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => setFilter("all")}
                >
                  All ({visits.length})
                </button>
                <button 
                  className={`btn ${filter === "visited" ? "btn-success" : "btn-outline-success"}`}
                  onClick={() => setFilter("visited")}
                >
                  Visited ({visits.filter(v => v.status === "visited").length})
                </button>
                <button 
                  className={`btn ${filter === "want-to-visit" ? "btn-warning" : "btn-outline-warning"}`}
                  onClick={() => setFilter("want-to-visit")}
                >
                  Want to Visit ({visits.filter(v => v.status === "want_to_visit").length})
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center justify-content-md-end">
                <label className="me-2">Sort by:</label>
                <select 
                  className="form-select w-auto"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visits List */}
      {sortedVisits.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="fas fa-map-marker-alt" style={{ fontSize: "4rem", color: "#6c757d" }}></i>
          </div>
          <h4 className="text-muted mb-3">
            {filter === "all" ? "No visits tracked yet" : `No ${filter.replace("-", " ")} visits`}
          </h4>
          <p className="text-muted mb-4">
            Start tracking your coffee shop visits to build your personal coffee journey!
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddVisitForm(true)}
          >
            Add Your First Visit
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {sortedVisits.map((visit) => (
            <div key={visit.id} className="col">
              <div className="card h-100 shadow-sm border-0 rounded-4">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{visit.coffeeShopName}</h5>
                    {getStatusBadge(visit.status)}
                  </div>

                  {visit.location && (
                    <p className="text-muted mb-2">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {visit.location}
                    </p>
                  )}

                  {visit.visitDate && (
                    <p className="text-muted mb-2">
                      <i className="fas fa-calendar me-1"></i>
                      {new Date(visit.visitDate).toLocaleDateString()}
                    </p>
                  )}

                  {visit.rating && (
                    <p className="mb-2">
                      <strong>Rating:</strong> {renderStars(visit.rating)}
                    </p>
                  )}

                  {visit.notes && (
                    <p className="card-text mb-3 flex-grow-1">
                      <strong>Notes:</strong> {visit.notes}
                    </p>
                  )}

                  <div className="mt-auto">
                    <div className="d-flex gap-2 mb-2">
                      {visit.status === "want_to_visit" && (
                        <button 
                          className="btn btn-sm btn-success flex-fill"
                          onClick={() => handleUpdateVisitStatus(visit.id, "visited")}
                        >
                          Mark as Visited
                        </button>
                      )}
                      {visit.status === "visited" && (
                        <button 
                          className="btn btn-sm btn-warning flex-fill"
                          onClick={() => handleUpdateVisitStatus(visit.id, "want_to_visit")}
                        >
                          Mark as Want to Visit
                        </button>
                      )}
                    </div>
                    
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-outline-primary flex-fill"
                        onClick={() => navigate(`/visits/${visit.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger flex-fill"
                        onClick={() => handleDeleteVisit(visit.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-muted small">
                    Added: {new Date(visit.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {visits.length > 0 && (
        <div className="mt-5 p-4 bg-light rounded">
          <h5 className="mb-3">Visit Summary</h5>
          <div className="row text-center">
            <div className="col-md-3">
              <div className="h4 text-success">{visits.filter(v => v.status === "visited").length}</div>
              <div className="text-muted">Places Visited</div>
            </div>
            <div className="col-md-3">
              <div className="h4 text-warning">{visits.filter(v => v.status === "want_to_visit").length}</div>
              <div className="text-muted">Want to Visit</div>
            </div>
            <div className="col-md-3">
              <div className="h4 text-info">
                {visits.filter(v => v.rating).length > 0 
                  ? (visits.filter(v => v.rating).reduce((sum, v) => sum + v.rating, 0) / visits.filter(v => v.rating).length).toFixed(1)
                  : "N/A"
                }
              </div>
              <div className="text-muted">Average Rating</div>
            </div>
            <div className="col-md-3">
              <div className="h4 text-primary">{visits.length}</div>
              <div className="text-muted">Total Tracked</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}