/* eslint-disable no-unused-vars */


import React, { useState, useEffect } from 'react';
import { 
  X, 
  Folder, 
  FolderPlus, 
  Plus, 
  Check,
  Search,
  Star,
  MapPin
} from 'lucide-react';

const CollectionSelectorModal = ({ 
  show, 
  onHide, 
  selectedPlace, 
  onPlaceAddedToCollection 
}) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [adding, setAdding] = useState(false);
  
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    color: '#FFD700',
    isPublic: false
  });

  const predefinedColors = [
    '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', 
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E9', '#82E0AA'
  ];

  useEffect(() => {
    if (show) {
      loadCollections();
    }
  }, [show]);

  const loadCollections = async () => {
    try {
      setLoading(true);
      
      // Try API first
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const response = await fetch(`${apiUrl}/api/collections`, {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setCollections(data.collections || []);
        } else {
          throw new Error('API failed');
        }
      } catch (apiError) {
        // Fallback to localStorage
        const savedCollections = JSON.parse(localStorage.getItem('userCollections') || '[]');
        setCollections(savedCollections);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollection.name.trim()) {
      alert('Please enter a collection name');
      return;
    }

    try {
      const collectionData = {
        id: Date.now().toString(),
        name: newCollection.name.trim(),
        description: newCollection.description.trim(),
        color: newCollection.color,
        isPublic: newCollection.isPublic,
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        placesCount: 0,
        visitedCount: 0,
        places: []
      };

      // Try API first
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const response = await fetch(`${apiUrl}/api/collections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(collectionData)
        });

        if (response.ok) {
          const savedCollection = await response.json();
          const newCollections = [savedCollection.collection, ...collections];
          setCollections(newCollections);
          
          // Auto-select the new collection
          setSelectedCollections([savedCollection.collection.id]);
        } else {
          throw new Error('API failed');
        }
      } catch (apiError) {
        // Fallback to localStorage
        const updatedCollections = [collectionData, ...collections];
        localStorage.setItem('userCollections', JSON.stringify(updatedCollections));
        setCollections(updatedCollections);
        
        // Auto-select the new collection
        setSelectedCollections([collectionData.id]);
      }

      // Reset form
      setNewCollection({
        name: '',
        description: '',
        color: '#FFD700',
        isPublic: false
      });
      setShowCreateForm(false);
      
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('Error creating collection. Please try again.');
    }
  };

  const handleAddToSelectedCollections = async () => {
    if (selectedCollections.length === 0) {
      alert('Please select at least one collection');
      return;
    }

    if (!selectedPlace) {
      alert('No place selected');
      return;
    }

    try {
      setAdding(true);
      
      const placeData = {
        id: selectedPlace.id || selectedPlace.placeId,
        placeId: selectedPlace.placeId || selectedPlace.id,
        name: selectedPlace.name,
        address: selectedPlace.address,
        phone: selectedPlace.phone,
        website: selectedPlace.website,
        rating: selectedPlace.rating,
        priceLevel: selectedPlace.priceLevel,
        latitude: selectedPlace.latitude,
        longitude: selectedPlace.longitude,
        imageUrl: selectedPlace.imageUrl,
        description: selectedPlace.description,
        openingHours: selectedPlace.openingHours,
        amenities: selectedPlace.amenities,
        category: selectedPlace.category,
        cuisine: selectedPlace.cuisine,
        notes: '',
        isVisited: false
      };

      // Try API first - use batch endpoint for multiple collections
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      try {
        if (selectedCollections.length > 1) {
          // Use batch endpoint for multiple collections
          const response = await fetch(`${apiUrl}/api/collections/batch/add-place`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              collectionIds: selectedCollections,
              place: placeData
            })
          });

          if (response.ok) {
            const result = await response.json();
            const addedCount = result.summary.added;
            const alreadyExistsCount = result.summary.alreadyExists;
            const failedCount = result.summary.failed;
            
            let message = `${selectedPlace.name} processing complete!\n`;
            if (addedCount > 0) message += `✅ Added to ${addedCount} collection(s)\n`;
            if (alreadyExistsCount > 0) message += `ℹ️ Already in ${alreadyExistsCount} collection(s)\n`;
            if (failedCount > 0) message += `❌ Failed to add to ${failedCount} collection(s)`;
            
            alert(message);
            
            // Callback to parent component
            if (onPlaceAddedToCollection) {
              onPlaceAddedToCollection(selectedPlace, selectedCollections);
            }
            
            onHide();
            return;
          } else {
            throw new Error('Batch API failed');
          }
        } else {
          // Single collection - use regular endpoint
          const collectionId = selectedCollections[0];
          const response = await fetch(`${apiUrl}/api/collections/${collectionId}/places`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(placeData)
          });

          if (response.ok) {
            alert(`${selectedPlace.name} added to collection!`);
            
            // Callback to parent component
            if (onPlaceAddedToCollection) {
              onPlaceAddedToCollection(selectedPlace, selectedCollections);
            }
            
            onHide();
            return;
          } else {
            const errorData = await response.json();
            if (errorData.message?.includes('already exists')) {
              alert(`${selectedPlace.name} is already in this collection!`);
              onHide();
              return;
            } else {
              throw new Error('Single API failed');
            }
          }
        }
      } catch (apiError) {
        console.log('API failed, falling back to localStorage:', apiError.message);
        
        // Fallback to localStorage for all collections
        let successCount = 0;
        const savedCollections = JSON.parse(localStorage.getItem('userCollections') || '[]');
        const updatedCollections = savedCollections.map(collection => {
          if (selectedCollections.includes(collection.id) || selectedCollections.includes(collection.id.toString())) {
            // Check if place already exists
            const placeExists = collection.places.some(place => 
              place.id === placeData.id || 
              place.placeId === placeData.placeId
            );
            
            if (!placeExists) {
              const newPlace = {
                ...placeData,
                dateAdded: new Date().toISOString()
              };
              
              successCount++;
              return {
                ...collection,
                places: [newPlace, ...collection.places],
                placesCount: (collection.placesCount || 0) + 1,
                dateModified: new Date().toISOString()
              };
            }
          }
          return collection;
        });
        
        localStorage.setItem('userCollections', JSON.stringify(updatedCollections));
        
        if (successCount > 0) {
          const message = successCount === 1 
            ? `${selectedPlace.name} added to collection!`
            : `${selectedPlace.name} added to ${successCount} collections!`;
          
          alert(message);
          
          // Callback to parent component
          if (onPlaceAddedToCollection) {
            onPlaceAddedToCollection(selectedPlace, selectedCollections);
          }
          
          onHide();
        } else {
          alert(`${selectedPlace.name} is already in the selected collection(s)!`);
          onHide();
        }
      }
    } catch (error) {
      console.error('Error adding place to collections:', error);
      alert('Error adding place to collections. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const toggleCollectionSelection = (collectionId) => {
    setSelectedCollections(prev => {
      if (prev.includes(collectionId)) {
        return prev.filter(id => id !== collectionId);
      } else {
        return [...prev, collectionId];
      }
    });
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">
              <Folder size={24} className="me-2" style={{ color: "#FFD700" }} />
              Add to Collection
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onHide}
            ></button>
          </div>
          
          <div className="modal-body">
            {/* Selected Place Info */}
            {selectedPlace && (
              <div className="card bg-light mb-4">
                <div className="card-body py-3">
                  <div className="d-flex align-items-center">
                    <img
                      src={selectedPlace.imageUrl}
                      alt={selectedPlace.name}
                      className="rounded me-3"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-1 fw-bold">{selectedPlace.name}</h6>
                      <p className="mb-0 text-muted small">
                        <MapPin size={12} className="me-1" />
                        {selectedPlace.address}
                      </p>
                      {selectedPlace.rating && (
                        <div className="d-flex align-items-center">
                          <Star size={12} className="text-warning me-1" fill="currentColor" />
                          <span className="small">{selectedPlace.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Collections */}
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Search size={16} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Create New Collection Button */}
            <div className="mb-3">
              <button
                className="btn w-100 text-dark fw-bold border-2 border-dashed"
                onClick={() => setShowCreateForm(!showCreateForm)}
                style={{ 
                  backgroundColor: showCreateForm ? "#FFD700" : "transparent",
                  borderColor: "#FFD700"
                }}
              >
                <FolderPlus size={16} className="me-2" />
                {showCreateForm ? "Cancel" : "Create New Collection"}
              </button>
            </div>

            {/* Create Collection Form */}
            {showCreateForm && (
              <div className="card border-0 bg-light mb-4">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label fw-semibold">Collection Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Weekend Brunch Spots"
                        value={newCollection.name}
                        onChange={(e) => setNewCollection({...newCollection, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Color</label>
                      <div className="d-flex flex-wrap gap-2">
                        {predefinedColors.slice(0, 6).map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`btn p-0 ${newCollection.color === color ? 'border border-dark border-2' : 'border'}`}
                            style={{ 
                              width: '25px', 
                              height: '25px', 
                              backgroundColor: color,
                              borderRadius: '50%'
                            }}
                            onClick={() => setNewCollection({...newCollection, color})}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Describe this collection..."
                      value={newCollection.description}
                      onChange={(e) => setNewCollection({...newCollection, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={newCollection.isPublic}
                        onChange={(e) => setNewCollection({...newCollection, isPublic: e.target.checked})}
                      />
                      <label className="form-check-label small">
                        Make public
                      </label>
                    </div>
                    
                    <button 
                      className="btn btn-sm text-dark fw-bold"
                      onClick={handleCreateCollection}
                      style={{ backgroundColor: "#FFD700", border: "none" }}
                    >
                      <Plus size={14} className="me-1" />
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Collections List */}
            <div className="mb-3">
              <h6 className="mb-3">Select Collections ({selectedCollections.length} selected)</h6>
              
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm" style={{ color: "#FFD700" }}></div>
                  <p className="text-muted mt-2">Loading collections...</p>
                </div>
              ) : filteredCollections.length === 0 ? (
                <div className="text-center py-4">
                  <Folder size={48} className="text-muted mb-3" />
                  <p className="text-muted">
                    {collections.length === 0 ? "No collections yet. Create your first one!" : "No collections match your search."}
                  </p>
                </div>
              ) : (
                <div className="row g-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {filteredCollections.map((collection) => (
                    <div key={collection.id} className="col-12">
                      <div 
                        className={`card border-2 ${selectedCollections.includes(collection.id) ? 'border-success bg-light' : 'border-light'}`}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => toggleCollectionSelection(collection.id)}
                      >
                        <div className="card-body py-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <div 
                                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{ 
                                  width: '40px', 
                                  height: '40px',
                                  backgroundColor: `${collection.color}20`,
                                  border: `2px solid ${collection.color}`
                                }}
                              >
                                <Folder size={16} style={{ color: collection.color }} />
                              </div>
                              <div>
                                <h6 className="mb-1 fw-bold">{collection.name}</h6>
                                <p className="mb-0 text-muted small">
                                  {collection.placesCount || 0} places
                                  {collection.description && ` • ${collection.description}`}
                                </p>
                              </div>
                            </div>
                            
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedCollections.includes(collection.id)}
                                onChange={() => toggleCollectionSelection(collection.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="modal-footer border-0">
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={onHide}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn text-dark fw-bold"
              onClick={handleAddToSelectedCollections}
              disabled={selectedCollections.length === 0 || adding}
              style={{ backgroundColor: "#FFD700", border: "none" }}
            >
              {adding ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Check size={16} className="me-2" />
                  Add to {selectedCollections.length} Collection{selectedCollections.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionSelectorModal;