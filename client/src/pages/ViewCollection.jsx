import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";

export default function ViewCollection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const { id } = useParams();
  const [collection, setCollection] = useState(location.state || null);
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [loading, setLoading] = useState(!location.state);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCollection, setEditedCollection] = useState({});

  useEffect(() => {
    if (!collection) {
      fetchCollection();
    } else {
      setCoffeeShops(collection.coffeeShops || []);
      setEditedCollection({
        name: collection.name,
        description: collection.description || ""
      });
    }
  }, [collection, id]);

  const fetchCollection = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/collections/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setCollection(data);
      setCoffeeShops(data.coffeeShops || []);
      setEditedCollection({
        name: data.name,
        description: data.description || ""
      });
    } catch (err) {
      console.error("Failed to fetch collection:", err);
      navigate("/my-collections");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCollection = async (e) => {
    e.preventDefault();
    
    if (!editedCollection.name.trim()) {
      alert("Collection name is required.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/collections/${collection.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedCollection),
      });

      if (res.ok) {
        const updatedCollection = await res.json();
        setCollection(updatedCollection);
        setIsEditing(false);
        alert("Collection updated successfully!");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update collection.");
      }
    } catch (error) {
      alert("Error updating collection.");
    }
  };

  const handleDeleteCollection = async () => {
    if (!window.confirm("Are you sure you want to delete this collection? This cannot be undone.")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/collections/${collection.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        navigate("/my-collections");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to delete collection.");
      }
    } catch (error) {
      alert("Error deleting collection.");
    }
  };

  const handleRemoveFromCollection = async (coffeeShopId) => {
    if (!window.confirm("Remove this coffee shop from the collection?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/collections/${collection.id}/coffee-shops/${coffeeShopId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        setCoffeeShops(coffeeShops.filter(shop => shop.id !== coffeeShopId));
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to remove coffee shop.");
      }
    } catch (error) {
      alert("Error removing coffee shop from collection.");
    }
  };

  const renderStars = (rating) => {
    if (!rating) return "Not rated";
    return "⭐".repeat(Math.round(rating)) + ` (${rating}/5)`;
  };

  const ensureHttp = (url) =>
    url?.startsWith("http://") || url?.startsWith("https://") ? url : `https://${url}`;

  if (loading) return <div className="text-center mt-5">Loading collection...</div>;
  if (!collection) return <div className="text-center mt-5">Collection not found.</div>;

  return (
    <div className="container mt-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        ← Back to Collections
      </button>

      {/* Collection Header */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          {!isEditing ? (
            <>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h1 className="mb-2">{collection.name}</h1>
                  {collection.description && (
                    <p className="text-muted mb-0">{collection.description}</p>
                  )}
                </div>
                {user && collection.userId === user.id && (
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn btn-outline-danger"
                      onClick={handleDeleteCollection}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
              
              <div className="d-flex align-items-center gap-4 text-muted">
                <span>☕ {coffeeShops.length} coffee shop{coffeeShops.length !== 1 ? 's' : ''}</span>
                <span>👤 Created by {collection.user?.username || "Anonymous"}</span>
                <span>📅 {new Date(collection.createdAt).toLocaleDateString()}</span>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdateCollection}>
              <div className="mb-3">
                <label className="form-label">Collection Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={editedCollection.name}
                  onChange={(e) => setEditedCollection({...editedCollection, name: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={editedCollection.description}
                  onChange={(e) => setEditedCollection({...editedCollection, description: e.target.value})}
                  placeholder="Describe your collection..."
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">Save Changes</button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {user && collection.userId === user.id && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex gap-2 justify-content-center">
              <button 
                className="btn btn-primary"
                onClick={() => navigate(`/collections/${collection.id}/add-shops`)}
              >
                ➕ Add Coffee Shops
              </button>
              <button 
                className="btn btn-outline-success"
                onClick={() => navigate("/search-coffee-shops")}
              >
                🔍 Find New Shops
              </button>
              <button 
                className="btn btn-outline-info"
                onClick={() => navigate(`/collections/${collection.id}/share`)}
              >
                📤 Share Collection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coffee Shops Grid */}
      <div className="mb-4">
        <h3 className="mb-3">Coffee Shops in this Collection</h3>
        
        {coffeeShops.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="fas fa-coffee" style={{ fontSize: "4rem", color: "#6c757d" }}></i>
            </div>
            <h4 className="text-muted mb-3">No coffee shops yet</h4>
            <p className="text-muted mb-4">
              Start building your collection by adding some amazing coffee shops!
            </p>
            {user && collection.userId === user.id && (
              <button 
                className="btn btn-primary"
                onClick={() => navigate(`/collections/${collection.id}/add-shops`)}
              >
                Add Your First Coffee Shop
              </button>
            )}
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {coffeeShops.map((shop) => (
              <div className="col" key={shop.id}>
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                  {shop.imageUrl && (
                    <img
                      src={ensureHttp(shop.imageUrl)}
                      alt={shop.name}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-2">{shop.name}</h5>
                    
                    {shop.location && (
                      <p className="mb-2 small text-muted">
                        📍 {shop.location}
                      </p>
                    )}

                    {shop.rating && (
                      <p className="mb-2 small">
                        {renderStars(shop.rating)}
                      </p>
                    )}

                    {shop.priceRange && (
                      <p className="mb-2">
                        <span className="badge bg-light text-dark">{shop.priceRange}</span>
                      </p>
                    )}

                    {shop.specialties && shop.specialties.length > 0 && (
                      <div className="mb-2">
                        <small className="text-muted">Specialties:</small>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {shop.specialties.slice(0, 3).map((specialty, index) => (
                            <span key={index} className="badge bg-primary">{specialty}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto">
                      <div className="d-flex gap-2 mb-2">
                        <button 
                          className="btn btn-primary btn-sm flex-fill"
                          onClick={() => navigate(`/coffee-shops/${shop.id}`)}
                        >
                          View Details
                        </button>
                        <button 
                          className="btn btn-outline-success btn-sm flex-fill"
                          onClick={() => navigate(`/add-review?shop=${shop.id}`)}
                        >
                          Review
                        </button>
                      </div>

                      {user && collection.userId === user.id && (
                        <button 
                          className="btn btn-outline-danger btn-sm w-100"
                          onClick={() => handleRemoveFromCollection(shop.id)}
                        >
                          Remove from Collection
                        </button>
                      )}

                      {shop.website && (
                        <div className="mt-2">
                          <a
                            href={ensureHttp(shop.website)}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline-info btn-sm w-100"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}

                      {(shop.latitude && shop.longitude) && (
                        <div className="mt-2">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${shop.latitude},${shop.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline-secondary btn-sm w-100"
                          >
                            📍 View on Map
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collection Stats */}
      {coffeeShops.length > 0 && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title mb-3">Collection Statistics</h5>
            <div className="row text-center">
              <div className="col-md-3">
                <div className="h4 text-primary">{coffeeShops.length}</div>
                <div className="small text-muted">Total Coffee Shops</div>
              </div>
              <div className="col-md-3">
                <div className="h4 text-success">
                  {coffeeShops.filter(s => s.rating >= 4).length}
                </div>
                <div className="small text-muted">Highly Rated (4+ stars)</div>
              </div>
              <div className="col-md-3">
                <div className="h4 text-warning">
                  {coffeeShops.filter(s => s.priceRange === "$" || s.priceRange === "$$").length}
                </div>
                <div className="small text-muted">Budget Friendly</div>
              </div>
              <div className="col-md-3">
                <div className="h4 text-info">
                  {coffeeShops.filter(s => s.wifiAvailable).length}
                </div>
                <div className="small text-muted">With WiFi</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}