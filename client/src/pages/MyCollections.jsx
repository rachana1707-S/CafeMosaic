/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import CollectionSelectorModal from "../components/CollectionSelectorModal";
import { 
  FolderPlus,
  Folder,
  MapPin,
  Star,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Circle,
  Users,
  Clock,
  Heart,
  Utensils,
  StickyNote,
  Settings,
  Eye,
  MoreVertical
} from "lucide-react";

export default function MyCollections() {
  const { user, isAuthenticated } = useAuthUser();
  const navigate = useNavigate();
  
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSelectorModal, setShowSelectorModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateCreated');
  
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
    if (isAuthenticated()) {
      loadCollections();
    } else {
      setLoading(false);
    }
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/collections`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections || []);
      } else {
        // Fallback to localStorage for demo
        const savedCollections = JSON.parse(localStorage.getItem('userCollections') || '[]');
        setCollections(savedCollections);
      }
    } catch (error) {
      console.error("Error loading collections:", error);
      // Fallback to localStorage
      const savedCollections = JSON.parse(localStorage.getItem('userCollections') || '[]');
      setCollections(savedCollections);
    } finally {
      setLoading(false);
    }
  };

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
          setCollections([savedCollection.collection, ...collections]);
        } else {
          throw new Error('API failed');
        }
      } catch (apiError) {
        // Fallback to localStorage
        const updatedCollections = [collectionData, ...collections];
        localStorage.setItem('userCollections', JSON.stringify(updatedCollections));
        setCollections(updatedCollections);
      }

      // Reset form
      setNewCollection({
        name: '',
        description: '',
        color: '#FFD700',
        isPublic: false
      });
      setShowCreateModal(false);
      
      alert("Collection created successfully!");
    } catch (error) {
      console.error("Error creating collection:", error);
      alert("Error creating collection. Please try again.");
    }
  };

  const handleEditCollection = async (collection, updatedData) => {
    try {
      const updatedCollection = {
        ...collection,
        ...updatedData,
        dateModified: new Date().toISOString()
      };

      // Try API first
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const response = await fetch(`${apiUrl}/api/collections/${collection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(updatedData)
        });

        if (response.ok) {
          const result = await response.json();
          setCollections(collections.map(c => 
            c.id === collection.id ? result.collection : c
          ));
        } else {
          throw new Error('API failed');
        }
      } catch (apiError) {
        // Fallback to localStorage
        const updatedCollections = collections.map(c => 
          c.id === collection.id ? updatedCollection : c
        );
        localStorage.setItem('userCollections', JSON.stringify(updatedCollections));
        setCollections(updatedCollections);
      }

      setEditingCollection(null);
      alert("Collection updated successfully!");
    } catch (error) {
      console.error("Error updating collection:", error);
      alert("Error updating collection. Please try again.");
    }
  };

  const handleDeleteCollection = async (collection) => {
    if (!window.confirm(`Are you sure you want to delete "${collection.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // Try API first
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const response = await fetch(`${apiUrl}/api/collections/${collection.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          setCollections(collections.filter(c => c.id !== collection.id));
        } else {
          throw new Error('API failed');
        }
      } catch (apiError) {
        // Fallback to localStorage
        const updatedCollections = collections.filter(c => c.id !== collection.id);
        localStorage.setItem('userCollections', JSON.stringify(updatedCollections));
        setCollections(updatedCollections);
      }

      alert("Collection deleted successfully!");
    } catch (error) {
      console.error("Error deleting collection:", error);
      alert("Error deleting collection. Please try again.");
    }
  };

  const getFilteredAndSortedCollections = () => {
    let filtered = collections;

    if (searchQuery) {
      filtered = filtered.filter(collection =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'placesCount':
          return (b.placesCount || 0) - (a.placesCount || 0);
        case 'dateModified':
          return new Date(b.dateModified || 0) - new Date(a.dateModified || 0);
        case 'dateCreated':
        default:
          return new Date(b.dateCreated || 0) - new Date(a.dateCreated || 0);
      }
    });
  };

  const filteredCollections = getFilteredAndSortedCollections();

  if (!isAuthenticated()) {
    return (
      <div className="container mt-5 pt-5">
        <div className="text-center py-5">
          <Folder size={64} className="text-muted mb-4" />
          <h3 className="text-muted mb-3">Please Log In</h3>
          <p className="text-muted mb-4">
            You need to be logged in to view your collections.
          </p>
          <button 
            className="btn text-dark fw-bold px-4 py-2"
            onClick={() => navigate('/login')}
            style={{ backgroundColor: "#FFD700", border: "none", borderRadius: "25px" }}
          >
            Login to View Collections
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Folder size={64} style={{ color: "#FFD700" }} className="mb-3" />
          <h4 className="text-muted">Loading your collections...</h4>
          <div className="spinner-border" style={{ color: "#FFD700" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ marginTop: '80px' }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              <Folder size={32} className="me-2" style={{ color: "#FFD700" }} />
              My Collections
            </h2>
            <p className="text-muted mb-0">
              {collections.length} collection{collections.length !== 1 ? 's' : ''} • {collections.reduce((sum, c) => sum + (c.placesCount || 0), 0)} total places
            </p>
          </div>
          
          <div className="d-flex gap-2">
            <button 
              className="btn text-dark fw-bold"
              onClick={() => setShowCreateModal(true)}
              style={{ backgroundColor: "#FFD700", border: "none" }}
            >
              <FolderPlus size={16} className="me-2" />
              New Collection
            </button>
          </div>
        </div>

        {/* Controls */}
        {collections.length > 0 && (
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-6">
                  <label className="form-label small text-muted">Search Collections</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Search size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search by name or description"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <label className="form-label small text-muted">Sort By</label>
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="dateCreated">Recently Created</option>
                    <option value="dateModified">Recently Modified</option>
                    <option value="name">Name</option>
                    <option value="placesCount">Places Count</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <button 
                    className="btn w-100 text-dark fw-bold"
                    onClick={() => navigate('/my-favorites')}
                    style={{ backgroundColor: "#FFD700", border: "none" }}
                  >
                    <Heart size={16} className="me-2" />
                    View Favorites
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collections Display */}
        {collections.length === 0 ? (
          <div className="text-center py-5">
            <Folder size={80} className="text-muted mb-4" />
            <h3 className="text-muted mb-3">No Collections Yet</h3>
            <p className="text-muted mb-4">
              Create your first collection to organize your favorite restaurants, cafes, and food places!
            </p>
            <button 
              className="btn text-dark fw-bold px-4 py-2"
              onClick={() => setShowCreateModal(true)}
              style={{ backgroundColor: "#FFD700", border: "none", borderRadius: "25px" }}
            >
              <FolderPlus size={18} className="me-2" />
              Create Your First Collection
            </button>
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="text-center py-5">
            <Search size={64} className="text-muted mb-4" />
            <h4 className="text-muted mb-3">No matches found</h4>
            <p className="text-muted mb-4">
              Try adjusting your search criteria.
            </p>
            <button 
              className="btn text-dark fw-bold"
              onClick={() => setSearchQuery('')}
              style={{ backgroundColor: "#FFD700", border: "none" }}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredCollections.map((collection) => (
              <div key={collection.id} className="col-lg-4 col-md-6">
                <div 
                  className="card h-100 border-0 shadow-sm position-relative"
                  style={{ 
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    borderLeft: `4px solid ${collection.color}`
                  }}
                  onClick={() => navigate(`/collections/${collection.id}`)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Header */}
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ 
                            width: '48px', 
                            height: '48px',
                            backgroundColor: `${collection.color}20`,
                            border: `2px solid ${collection.color}`
                          }}
                        >
                          <Folder size={20} style={{ color: collection.color }} />
                        </div>
                        <div>
                          <h5 className="fw-bold mb-1">{collection.name}</h5>
                          <small className="text-muted">
                            Created {new Date(collection.dateCreated).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                      
                      {/* Dropdown Menu */}
                      <div className="dropdown">
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          data-bs-toggle="dropdown"
                          onClick={(e) => e.stopPropagation()}
                          style={{ border: 'none' }}
                        >
                          <MoreVertical size={16} />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <button 
                              className="dropdown-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/collections/${collection.id}`);
                              }}
                            >
                              <Eye size={14} className="me-2" />
                              View Collection
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCollection(collection);
                              }}
                            >
                              <Edit3 size={14} className="me-2" />
                              Edit Details
                            </button>
                          </li>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <button 
                              className="dropdown-item text-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCollection(collection);
                              }}
                            >
                              <Trash2 size={14} className="me-2" />
                              Delete Collection
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Description */}
                    {collection.description && (
                      <p className="text-muted small mb-3">{collection.description}</p>
                    )}

                    {/* Stats */}
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <div className="text-center p-2 bg-light rounded">
                          <div className="fw-bold">{collection.placesCount || 0}</div>
                          <div className="small text-muted">Places</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center p-2 bg-light rounded">
                          <div className="fw-bold text-success">{collection.visitedCount || 0}</div>
                          <div className="small text-muted">Visited</div>
                        </div>
                      </div>
                    </div>

                    {/* Preview of places */}
                    {collection.places && collection.places.length > 0 && (
                      <div className="mb-3">
                        <div className="d-flex flex-wrap gap-1">
                          {collection.places.slice(0, 3).map((place, index) => (
                            <span 
                              key={index}
                              className="badge bg-light text-dark small"
                              style={{ fontSize: '0.7rem' }}
                            >
                              {place.name}
                            </span>
                          ))}
                          {collection.places.length > 3 && (
                            <span className="badge bg-secondary small">
                              +{collection.places.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center text-muted small">
                        <Clock size={12} className="me-1" />
                        Modified {new Date(collection.dateModified).toLocaleDateString()}
                      </div>
                      
                      {collection.isPublic && (
                        <span className="badge bg-success">Public</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Collection Modal */}
        {showCreateModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content" style={{ borderRadius: '16px' }}>
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">
                    <FolderPlus size={24} className="me-2" style={{ color: "#FFD700" }} />
                    Create New Collection
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowCreateModal(false)}
                  ></button>
                </div>
                
                <form onSubmit={handleCreateCollection}>
                  <div className="modal-body">
                    <div className="row g-4">
                      <div className="col-md-8">
                        <label className="form-label fw-semibold">Collection Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., Weekend Brunch Spots"
                          value={newCollection.name}
                          onChange={(e) => setNewCollection({...newCollection, name: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Color Theme</label>
                        <div className="d-flex flex-wrap gap-2">
                          {predefinedColors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`btn p-0 ${newCollection.color === color ? 'border border-dark border-2' : 'border'}`}
                              style={{ 
                                width: '30px', 
                                height: '30px', 
                                backgroundColor: color,
                                borderRadius: '50%'
                              }}
                              onClick={() => setNewCollection({...newCollection, color})}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Describe this collection..."
                        value={newCollection.description}
                        onChange={(e) => setNewCollection({...newCollection, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={newCollection.isPublic}
                        onChange={(e) => setNewCollection({...newCollection, isPublic: e.target.checked})}
                      />
                      <label className="form-check-label">
                        Make this collection public (others can view it)
                      </label>
                    </div>
                  </div>
                  
                  <div className="modal-footer border-0">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn text-dark fw-bold"
                      style={{ backgroundColor: "#FFD700", border: "none" }}
                    >
                      Create Collection
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Collection Modal */}
        {editingCollection && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content" style={{ borderRadius: '16px' }}>
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">
                    <Edit3 size={24} className="me-2" style={{ color: "#FFD700" }} />
                    Edit Collection
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setEditingCollection(null)}
                  ></button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleEditCollection(editingCollection, {
                    name: formData.get('name'),
                    description: formData.get('description'),
                    color: formData.get('color'),
                    isPublic: formData.get('isPublic') === 'on'
                  });
                }}>
                  <div className="modal-body">
                    <div className="row g-4">
                      <div className="col-md-8">
                        <label className="form-label fw-semibold">Collection Name *</label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          defaultValue={editingCollection.name}
                          required
                        />
                      </div>
                      
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Color Theme</label>
                        <input
                          type="hidden"
                          name="color"
                          value={editingCollection.color}
                        />
                        <div className="d-flex flex-wrap gap-2">
                          {predefinedColors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`btn p-0 ${editingCollection.color === color ? 'border border-dark border-2' : 'border'}`}
                              style={{ 
                                width: '30px', 
                                height: '30px', 
                                backgroundColor: color,
                                borderRadius: '50%'
                              }}
                              onClick={() => setEditingCollection({...editingCollection, color})}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows="3"
                        defaultValue={editingCollection.description}
                      />
                    </div>
                    
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="isPublic"
                        defaultChecked={editingCollection.isPublic}
                      />
                      <label className="form-check-label">
                        Make this collection public (others can view it)
                      </label>
                    </div>
                  </div>
                  
                  <div className="modal-footer border-0">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setEditingCollection(null)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn text-dark fw-bold"
                      style={{ backgroundColor: "#FFD700", border: "none" }}
                    >
                      Update Collection
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Collection Selector Modal */}
        {showSelectorModal && (
          <CollectionSelectorModal
            show={showSelectorModal}
            onHide={() => setShowSelectorModal(false)}
            collections={collections}
            selectedPlace={selectedCollection}
            onCreateCollection={(collectionData) => {
              // Handle new collection creation from modal
              handleCreateCollection({ preventDefault: () => {} });
            }}
          />
        )}
      </div>
    </div>
  );
}