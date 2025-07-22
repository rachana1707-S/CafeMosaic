import React, { useEffect, useState } from "react";
import { Coffee, Plus, X } from "lucide-react";
import axios from "axios";

export default function CollectionSelectorModal({ 
  coffeeShop, 
  userId, 
  onClose, 
  selectedCollection, 
  setSelectedCollection 
}) {
  const [collections, setCollections] = useState([]);
  const [localSelectedCollection, setLocalSelectedCollection] = useState(selectedCollection?.id || "");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/collections/user/${userId}`, 
          { withCredentials: true }
        );
        if (res.data.success) {
          setCollections(res.data.collections);
        } else {
          setCollections(res.data); // Fallback for direct array response
        }
      } catch (err) {
        console.error("Failed to fetch collections:", err);
        alert("Failed to load collections. Please try again.");
      }
    }
    fetchCollections();
  }, [userId]);

  const handleAddToCollection = async () => {
    const chosenCollectionId = localSelectedCollection;

    if (!chosenCollectionId) {
      alert("Please select or create a collection.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/collections/${chosenCollectionId}/coffee-shops`,
        {
          coffeeShopId: coffeeShop.id,
          notes: "",
          order: 0,
        },
        { withCredentials: true }
      );

      alert(`Added "${coffeeShop.name}" to your collection!`);
      onClose();
    } catch (error) {
      console.error("Error adding coffee shop to collection:", error);
      if (error.response?.data?.message?.includes("already in collection")) {
        alert("This coffee shop is already in the selected collection.");
      } else {
        alert("Failed to add to collection. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewCollection = async () => {
    if (!newCollectionName.trim()) {
      alert("Please enter a collection name.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/collections`,
        {
          name: newCollectionName,
          description: newCollectionDescription,
          isPublic: false,
        },
        { withCredentials: true }
      );
      
      const newCollection = res.data.collection || res.data;
      setCollections([...collections, newCollection]);
      setLocalSelectedCollection(newCollection.id);
      setSelectedCollection(newCollection); 
      setNewCollectionName("");
      setNewCollectionDescription("");
      alert("Collection created successfully!");
    } catch (err) {
      console.error("Error creating collection:", err);
      alert("Failed to create collection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "16px" }}>
          
          {/* Header */}
          <div className="modal-header border-0 pb-0">
            <div className="d-flex align-items-center">
              <Coffee className="text-warning me-2" size={24} />
              <h5 className="modal-title fw-bold mb-0">Add to Collection</h5>
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            {/* Coffee Shop Info */}
            <div className="alert alert-info border-0 mb-4" style={{ borderRadius: "12px" }}>
              <div className="d-flex align-items-center">
                <Coffee className="text-info me-2" size={20} />
                <div>
                  <strong>{coffeeShop.name}</strong>
                  <br />
                  <small className="text-muted">{coffeeShop.address}</small>
                </div>
              </div>
            </div>

            {/* Existing Collections */}
            <div className="mb-4">
              <label className="form-label fw-semibold mb-3">
                Choose an existing collection:
              </label>
              
              {collections.length === 0 ? (
                <div className="text-center text-muted py-3">
                  <Coffee size={48} className="text-muted mb-2" />
                  <p>No collections yet. Create your first one below!</p>
                </div>
              ) : (
                <div className="row g-2">
                  {collections.map((collection) => (
                    <div key={collection.id} className="col-md-6">
                      <div
                        className={`card border-2 cursor-pointer ${
                          localSelectedCollection == collection.id 
                            ? "border-warning bg-warning bg-opacity-10" 
                            : "border-light"
                        }`}
                        style={{ 
                          borderRadius: "12px",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                        onClick={() => {
                          setLocalSelectedCollection(collection.id);
                          setSelectedCollection(collection);
                        }}
                      >
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="card-title mb-1 fw-semibold">
                                {collection.name}
                              </h6>
                              {collection.description && (
                                <p className="card-text small text-muted mb-1">
                                  {collection.description}
                                </p>
                              )}
                              <small className="text-muted">
                                {collection._count?.coffeeShops || 0} coffee shop
                                {collection._count?.coffeeShops !== 1 ? 's' : ''}
                              </small>
                            </div>
                            {localSelectedCollection == collection.id && (
                              <div className="text-warning">
                                <i className="fas fa-check-circle"></i>
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

            <div className="text-center my-4">
              <span className="badge bg-light text-muted px-3 py-2">OR</span>
            </div>

            {/* Create New Collection */}
            <div className="border rounded-3 p-4" style={{ backgroundColor: "#f8f9fa" }}>
              <label className="form-label fw-semibold mb-3 d-flex align-items-center">
                <Plus className="me-2" size={18} />
                Create a new collection:
              </label>
              
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control border-0 shadow-sm"
                  placeholder="Collection name (e.g., 'Study Spots', 'Date Places')"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  style={{ borderRadius: "10px" }}
                />
              </div>
              
              <div className="mb-3">
                <textarea
                  className="form-control border-0 shadow-sm"
                  rows="2"
                  placeholder="Description (optional)"
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  style={{ borderRadius: "10px" }}
                />
              </div>
              
              <button 
                className="btn btn-outline-warning rounded-pill px-4" 
                onClick={handleCreateNewCollection}
                disabled={loading || !newCollectionName.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={16} className="me-2" />
                    Create Collection
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 pt-0">
            <button 
              className="btn btn-light rounded-pill px-4" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="btn btn-warning rounded-pill px-4" 
              onClick={handleAddToCollection}
              disabled={loading || !localSelectedCollection}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Adding...
                </>
              ) : (
                <>
                  <Coffee size={16} className="me-2" />
                  Add to Collection
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}