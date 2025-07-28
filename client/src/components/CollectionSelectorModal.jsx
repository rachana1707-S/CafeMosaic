/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { 
  FolderPlus,
  Folder,
  Plus,
  Check,
  Search,
  MapPin,
  Star,
  StickyNote,
  CheckCircle2,
  Circle,
  Calendar,
  X
} from "lucide-react";

export default function CollectionSelectorModal({ 
  show, 
  onHide, 
  collections = [], 
  selectedPlace = null, 
  onAddToCollection,
  onCreateCollection 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollections, setSelectedCollections] = useState(new Set());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [placeNotes, setPlaceNotes] = useState({});
  const [isVisitedFlags, setIsVisitedFlags] = useState({});
  
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    color: '#FFD700'
  });

  const predefinedColors = [
    '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', 
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
  ];

  useEffect(() => {
    if (show && selectedPlace) {
      // Check which collections already contain this place
      const existingCollections = new Set();
      const existingNotes = {};
      const existingVisited = {};
      
      collections.forEach(collection => {
        const placeInCollection = collection.places?.find(p => 
          p.id === selectedPlace.id || p.placeId === selectedPlace.placeId
        );
        
        if (placeInCollection) {
          existingCollections.add(collection.id);
          if (placeInCollection.notes) {
            existingNotes[collection.id] = placeInCollection.notes;
          }
          if (placeInCollection.isVisited !== undefined) {
            existingVisited[collection.id] = placeInCollection.isVisited;
          }
        }
      });
      
      setSelectedCollections(existingCollections);
      setPlaceNotes(existingNotes);
      setIsVisitedFlags(existingVisited);
    }
  }, [show, selectedPlace, collections]);

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    
    if (!newCollection.name.trim()) {
      alert("Please enter a collection name");
      return;
    }

    try {
      const collectionData = {
        id: Date.now().toString(),
        name: newCollection.name.trim(),
        description: newCollection.description.trim(),
        color: newCollection.color,
        isPublic: false,
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
          const result = await response.json();
          if (onCreateCollection) {
            onCreateCollection(result.collection);
          }
        } else {
          throw new Error('API failed');
        }
      } catch (apiError) {
        // Fallback to localStorage
        const savedCollections = JSON.parse(localStorage.getItem('userCollections') || '[]');
        const updatedCollections = [collectionData, ...savedCollections];
        localStorage.setItem('userCollections', JSON.stringify(updatedCollections));
        
        if (onCreateCollection) {
          onCreateCollection(collectionData);
        }
      }

      // Auto-select the new collection
      setSelectedCollections(prev => new Set([...prev, collectionData.id]));
      
      // Reset form
      setNewCollection({ name: '', description: '', color: '#FFD700' });
      setShowCreateForm(false);
      
    } catch (error) {
      console.error("Error creating collection:", error);
      alert("Error creating collection. Please try again.");
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedPlace) return;

    try {
      // Process each collection
      for (const collection of collections) {
        const isSelected = selectedCollections.has(collection.id);
        const existingPlace = collection.places?.find(p => 
          p.id === selectedPlace.id || p.placeId === selectedPlace.placeId
        );
        
        if (isSelected && !existingPlace) {
          // Add place to collection
          await addPlaceToCollection(collection.id, {
            ...selectedPlace,
            notes: placeNotes[collection.id] || '',
            isVisited: isVisitedFlags[collection.id] || false,
            dateAdded: new Date().toISOString()
          });
        } else if (!isSelected && existingPlace) {
          // Remove place from collection
          await removePlaceFromCollection(collection.id, selectedPlace.id || selectedPlace.placeId);
        } else if (isSelected && existingPlace) {
          // Update existing place in collection
          await updatePlaceInCollection(collection.id, selectedPlace.id || selectedPlace.placeId, {
            notes: placeNotes[collection.id] || '',
            isVisited: isVisitedFlags[collection.id] || false
          });
        }
      }
      
      alert("Changes saved successfully!");
      onHide();
      
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Error saving changes. Please try again.");
    }
  };

  const addPlaceToCollection = async (collectionId, placeData) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    try {
      const response = await fetch(`${apiUrl}/api/collections/${collectionId}/places`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(placeData)
      });

      if (!response.ok) throw new Error('API failed');
    } catch (apiError) {
      // Fallback to localStorage
      const savedCollections = JSON.parse(localStorage.getItem('userCollections') || '[]');
      const updatedCollections = savedCollections.map(collection => {
        if (collection.id === collectionId) {
          const updatedPlaces = [...(collection.places || []), placeData];
          return {
            ...collection,
            places: updatedPlaces,
            placesCount: updatedPlaces.length,
            visitedCount: updatedPlaces.filter(p => p.isVisited).length,
            dateModified: new Date().toISOString()
          };
        }
        return collection;
      });
      localStorage.setItem('userCollections', JSON.stringify(updatedCollections));
    }
  };

  const removePlaceFromCollection = async (collectionId, placeId) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    try {
      const response = await fetch(`${apiUrl}/api/collections/${collectionId}/places/${placeId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('API failed');
    } catch (apiError) {
      // Fallback to localStorage
      const savedCollections = JSON.parse(localStorage.getItem('userCollections') || '[]');
      const updatedCollections = savedCollections.map(collection => {
        if (collection.id === collectionId) {
          const updatedPlaces = (collection.places || []).filter(p => 
            p.id !== placeId && p.placeId !== placeId
          );
          return {
            ...collection,
            places: updatedPlaces,
            placesCount: updatedPlaces.length,
            visitedCount: updatedPlaces.filter(p => p.isVisited).length,
            dateModified: new Date().toISOString()
          };
        }
        return collection;
      });
      localStorage.setItem('userCollections', JSON.stringify(updatedCollections));
    }
  };

  const updatePlaceInCollection = async (collectionId, placeId, updateData) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    try {
      const response = await fetch(`${apiUrl}/api/collections/${collectionId}/places/${placeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('API failed');
    } catch (apiError) {
      // Fallback to localStorage
      const savedCollections = JSON.parse(localStorage.getItem('userCollections') || '[]');
      const updatedCollections = savedCollections.map(collection => {
        if (collection.id === collectionId) {
          const updatedPlaces = (collection.places || []).map(place => {
            if (place.id === placeId || place.placeId === placeId) {
              return { ...place, ...updateData };
            }
            return place;
          });
          return {
            ...collection,
            places: updatedPlaces,
            visitedCount: updatedPlaces.filter(p => p.isVisited).length,
            dateModified: new Date().toISOString()
          };
        }
        return collection;
      });
      localStorage.setItem('userCollections', JSON.stringify(updatedCollections));
    }
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCollection = (collectionId) => {
    const newSelected = new Set(selectedCollections);
    if (newSelected.has(collectionId)) {
      newSelected.delete(collectionId);
      // Clear notes and visited flag when unchecking
      const newNotes = { ...placeNotes };
      const newVisited = { ...isVisitedFlags };
      delete newNotes[collectionId];
      delete newVisited[collectionId];
      setPlaceNotes(newNotes);
      setIsVisitedFlags(newVisited);
    } else {
      newSelected.add(collectionId);
    }
    setSelectedCollections(newSelected);
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content" style={{ borderRadius: '16px' }}>
          <div className="modal-header border-0 pb-0">
            <div>
              <h5 className="modal-title fw-bold mb-1">
                <FolderPlus size={24} className="me-2" style={{ color: "#FFD700" }} />
                Add to Collections
              </h5>
              {selectedPlace && (
                <p className="text-muted mb-0 small">
                  <MapPin size={14} className="me-1" />
                  {selectedPlace.name}
                </p>
              )}
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onHide}
            ></button>
          </div>
          
          <div className="modal-body">
            {/* Search Collections */}
            <div className="mb-4">
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
            <div className="mb-4">
              <button 
                className="btn w-100 text-dark fw-bold"
                onClick={() => setShowCreateForm(!showCreateForm)}
                style={{ backgroundColor: "#FFD700", border: "1px dashed #666" }}
              >
                <Plus size={16} className="me-2" />
                Create New Collection
              </button>
            </div>

            {/* Create Collection Form */}
            {showCreateForm && (
              <div className="card mb-4" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="card-body">
                  <form onSubmit={handleCreateCollection}>
                    <div className="row g-3">
                      <div className="col-md-8">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Collection name..."
                          value={newCollection.name}
                          onChange={(e) => setNewCollection({...newCollection, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex gap-1">
                          {predefinedColors.slice(0, 4).map((color) => (
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
                    
                    <textarea
                      className="form-control mt-2"
                      rows="2"
                      placeholder="Description (optional)..."
                      value={newCollection.description}
                      onChange={(e) => setNewCollection({...newCollection, description: e.target.value})}
                    />
                    
                    <div className="d-flex gap-2 mt-3">
                      <button 
                        type="submit" 
                        className="btn btn-sm text-dark fw-bold"
                        style={{ backgroundColor: "#FFD700", border: "none" }}
                      >
                        Create
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-secondary"
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
            <div className="mb-4">
              <h6 className="fw-semibold mb-3">Select Collections ({selectedCollections.size} selected)</h6>
              
              {filteredCollections.length === 0 ? (
                <div className="text-center py-4">
                  <Folder size={48} className="text-muted mb-3" />
                  <p className="text-muted">
                    {searchQuery ? 'No collections match your search.' : 'No collections yet. Create your first one!'}
                  </p>
                </div>
              ) : (
                <div className="list-group list-group-flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {filteredCollections.map((collection) => {
                    const isSelected = selectedCollections.has(collection.id);
                    
                    return (
                      <div key={collection.id} className="list-group-item border-0 px-0">
                        <div className="d-flex align-items-start">
                          <div className="form-check me-3 mt-1">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCollection(collection.id)}
                            />
                          </div>
                          
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <div 
                                className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                style={{ 
                                  width: '32px', 
                                  height: '32px',
                                  backgroundColor: `${collection.color}20`,
                                  border: `2px solid ${collection.color}`
                                }}
                              >
                                <Folder size={14} style={{ color: collection.color }} />
                              </div>
                              <div>
                                <h6 className="mb-0 fw-semibold">{collection.name}</h6>
                                <small className="text-muted">
                                  {collection.placesCount || 0} places
                                </small>
                              </div>
                            </div>
                            
                            {/* Additional options when selected */}
                            {isSelected && (
                              <div className="mt-3 p-3 bg-light rounded">
                                {/* Visit Status */}
                                <div className="form-check mb-3">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={isVisitedFlags[collection.id] || false}
                                    onChange={(e) => setIsVisitedFlags({
                                      ...isVisitedFlags,
                                      [collection.id]: e.target.checked
                                    })}
                                  />
                                  <label className="form-check-label fw-semibold text-success">
                                    <CheckCircle2 size={16} className="me-1" />
                                    I have visited this place
                                  </label>
                                </div>
                                
                                {/* Notes */}
                                <div>
                                  <label className="form-label small fw-semibold">
                                    <StickyNote size={14} className="me-1" />
                                    Personal Notes
                                  </label>
                                  <textarea
                                    className="form-control form-control-sm"
                                    rows="2"
                                    placeholder="Add your thoughts, recommendations, or memories..."
                                    value={placeNotes[collection.id] || ''}
                                    onChange={(e) => setPlaceNotes({
                                      ...placeNotes,
                                      [collection.id]: e.target.value
                                    })}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
              onClick={handleSaveChanges}
              style={{ backgroundColor: "#FFD700", border: "none" }}
              disabled={selectedCollections.size === 0}
            >
              <Check size={16} className="me-2" />
              Save Changes ({selectedCollections.size})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}