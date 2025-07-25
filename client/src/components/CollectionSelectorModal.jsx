import React, { useState, useEffect } from 'react';
import { X, Plus, Folder } from 'lucide-react';

export default function CollectionSelectorModal({ 
  coffeeShop, 
  userId, 
  onClose, 
  selectedCollection, 
  setSelectedCollection 
}) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadCollections();
  }, [userId]);

  const loadCollections = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/collections/user/${userId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections || data || []);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    setCreating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          name: newCollectionName,
          description: `Collection created for ${coffeeShop.name}`
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newCollection = data.collection || data;
        setCollections(prev => [newCollection, ...prev]);
        setNewCollectionName('');
        setShowCreateForm(false);
        
        // Auto-select the newly created collection
        setSelectedCollection(newCollection.id);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create collection');
      }
    } catch (error) {
      alert('Error creating collection');
    } finally {
      setCreating(false);
    }
  };

  const handleAddToCollection = async (collectionId) => {
    setAdding(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/collections/${collectionId}/coffee-shops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          coffeeShopId: coffeeShop.id || coffeeShop.placeId,
          notes: `Added ${coffeeShop.name} to collection`
        })
      });

      if (response.ok) {
        alert(`${coffeeShop.name} added to collection successfully!`);
        onClose();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to add to collection');
      }
    } catch (error) {
      alert('Error adding to collection');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div 
      className="modal fade show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">
              Add "{coffeeShop.name}" to Collection
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          
          <div className="modal-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading your collections...</p>
              </div>
            ) : (
              <>
                {/* Existing Collections */}
                {collections.length > 0 ? (
                  <div className="mb-4">
                    <h6 className="text-muted mb-3">Select a collection:</h6>
                    <div className="row g-2">
                      {collections.map((collection) => (
                        <div key={collection.id} className="col-12">
                          <div 
                            className={`card h-100 border ${selectedCollection === collection.id ? 'border-primary' : 'border-light'}`}
                            style={{ 
                              cursor: 'pointer',
                              borderRadius: '12px',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => setSelectedCollection(collection.id)}
                          >
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center">
                                <Folder size={20} className="text-primary me-3" />
                                <div className="flex-grow-1">
                                  <h6 className="mb-1">{collection.name}</h6>
                                  <p className="text-muted small mb-0">
                                    {collection._count?.coffeeShops || 0} coffee shop{(collection._count?.coffeeShops || 0) !== 1 ? 's' : ''}
                                  </p>
                                </div>
                                {selectedCollection === collection.id && (
                                  <div className="text-primary">
                                    <i className="fas fa-check-circle"></i>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 mb-4">
                    <Folder size={48} className="text-muted mb-3" />
                    <p className="text-muted">You don't have any collections yet.</p>
                    <p className="text-muted small">Create your first collection below!</p>
                  </div>
                )}

                {/* Create New Collection */}
                <div className="border-top pt-4">
                  {!showCreateForm ? (
                    <button 
                      className="btn btn-outline-primary w-100"
                      onClick={() => setShowCreateForm(true)}
                    >
                      <Plus size={16} className="me-2" />
                      Create New Collection
                    </button>
                  ) : (
                    <form onSubmit={handleCreateCollection}>
                      <div className="mb-3">
                        <label className="form-label small text-muted">Collection Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newCollectionName}
                          onChange={(e) => setNewCollectionName(e.target.value)}
                          placeholder="e.g., Favorite Cafes, Work Spots"
                          required
                          autoFocus
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          type="submit" 
                          className="btn btn-primary flex-fill"
                          disabled={creating || !newCollectionName.trim()}
                        >
                          {creating ? 'Creating...' : 'Create'}
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary flex-fill"
                          onClick={() => {
                            setShowCreateForm(false);
                            setNewCollectionName('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </>
            )}
          </div>
          
          <div className="modal-footer border-0 pt-0">
            <div className="d-flex gap-2 w-100">
              <button 
                type="button" 
                className="btn btn-outline-secondary flex-fill"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary flex-fill"
                onClick={() => handleAddToCollection(selectedCollection)}
                disabled={!selectedCollection || adding}
              >
                {adding ? 'Adding...' : 'Add to Collection'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}