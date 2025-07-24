import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";

export default function MyCollections() {
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCollections();
    }
  }, [user]);

  const fetchCollections = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/collections`, {
        credentials: "include",
      });
      const data = await res.json();
      setCollections(data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    
    if (!newCollectionName.trim()) {
      alert("Collection name is required.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/collections`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCollectionName }),
      });

      if (res.ok) {
        const newCollection = await res.json();
        setCollections([newCollection, ...collections]);
        setNewCollectionName("");
        setShowCreateForm(false);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to create collection.");
      }
    } catch (error) {
      alert("Error creating collection. Try again.");
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (!window.confirm("Are you sure you want to delete this collection?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/collections/${collectionId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setCollections(collections.filter(c => c.id !== collectionId));
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to delete collection.");
      }
    } catch (error) {
      alert("Error deleting collection.");
    }
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <p>Please log in to view your coffee shop collections.</p>
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="container mt-5"><div className="text-center">Loading collections...</div></div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Coffee Shop Collections</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "Create New Collection"}
        </button>
      </div>

      {/* Create Collection Form */}
      {showCreateForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Create New Collection</h5>
            <form onSubmit={handleCreateCollection}>
              <div className="mb-3">
                <label className="form-label">Collection Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g., Favorite Cafes, Weekend Spots, Work-Friendly Places"
                  required
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">Create Collection</button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collections List */}
      {collections.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="fas fa-coffee" style={{ fontSize: "4rem", color: "#6c757d" }}></i>
          </div>
          <h4 className="text-muted mb-3">No collections yet</h4>
          <p className="text-muted mb-4">
            Create your first collection to organize your favorite coffee shops!
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            Create Your First Collection
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {collections.map((collection) => (
            <div key={collection.id} className="col">
              <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">{collection.name}</h5>
                    <div className="dropdown">
                      <button 
                        className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                        data-bs-toggle="dropdown"
                      >
                        ⋮
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button 
                            className="dropdown-item"
                            onClick={() => navigate(`/collections/${collection.id}/edit`)}
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button 
                            className="dropdown-item text-danger"
                            onClick={() => handleDeleteCollection(collection.id)}
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <p className="text-muted mb-3">
                    {collection.coffeeShops?.length || 0} coffee shop{(collection.coffeeShops?.length || 0) !== 1 ? 's' : ''}
                  </p>

                  {collection.description && (
                    <p className="card-text mb-3">{collection.description}</p>
                  )}

                  {/* Preview of coffee shops in collection */}
                  {collection.coffeeShops && collection.coffeeShops.length > 0 && (
                    <div className="mb-3">
                      <h6 className="small text-muted mb-2">Coffee Shops:</h6>
                      <ul className="list-unstyled small">
                        {collection.coffeeShops.slice(0, 3).map((shop) => (
                          <li key={shop.id} className="mb-1">
                            <i className="fas fa-coffee me-2 text-primary"></i>
                            {shop.name}
                          </li>
                        ))}
                        {collection.coffeeShops.length > 3 && (
                          <li className="text-muted">
                            + {collection.coffeeShops.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="mt-auto">
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-primary flex-fill"
                        onClick={() => navigate(`/collections/${collection.id}`)}
                      >
                        View Collection
                      </button>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => navigate(`/collections/${collection.id}/add-shops`)}
                      >
                        Add Shops
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-muted small">
                    Created: {new Date(collection.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-5 p-4 bg-light rounded">
        <h5 className="mb-3">Quick Actions</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <button 
              className="btn btn-outline-primary w-100"
              onClick={() => navigate("/search-coffee-shops")}
            >
              <i className="fas fa-search me-2"></i>
              Find New Coffee Shops
            </button>
          </div>
          <div className="col-md-4">
            <button 
              className="btn btn-outline-success w-100"
              onClick={() => navigate("/my-reviews")}
            >
              <i className="fas fa-star me-2"></i>
              My Reviews
            </button>
          </div>
          <div className="col-md-4">
            <button 
              className="btn btn-outline-info w-100"
              onClick={() => navigate("/coffee-shop-map")}
            >
              <i className="fas fa-map me-2"></i>
              Coffee Shop Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}