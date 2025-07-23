import React, { useState, useEffect } from 'react';
import { useAuthUser } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import fallbackImage from '../assets/fallback.webp'; 

export default function MySuggestions() {
  const { user } = useAuthUser();
  const [showModal, setShowModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({
    destination: '',
    description: '',
    image: '',
    website: '',
    category: '',
  });
  const [newPlace, setNewPlace] = useState('');
  const [placeList, setPlaceList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/suggestions`)
      .then((res) => res.json())
      .then((data) => {
        const userSuggestions = data.filter(
          (s) => s.userId === user?.id || s.username === user?.username
        );
        setSuggestions(userSuggestions);
      })
      .catch((error) => console.error('Error fetching suggestions:', error));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddPlace = () => {
    if (newPlace.trim()) {
      setPlaceList((prev) => [...prev, newPlace.trim()]);
      setNewPlace('');
    }
  };

  const handleRemovePlace = (index) => {
    setPlaceList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSuggestion = async (e) => {
    e.preventDefault();
    if (!formData.destination) {
      alert('Destination is required!');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suggestions`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const newSuggestion = await res.json();
      if (!res.ok) {
        alert(newSuggestion.message || 'Failed to add suggestion.');
        return;
      }

      for (let place of placeList) {
        await fetch(`${import.meta.env.VITE_API_URL}/api/suggestions/${newSuggestion.id}/places`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: place }),
        });
      }

      setSuggestions([...suggestions, { ...newSuggestion, places: placeList }]);
      setShowModal(false);
      setFormData({ destination: '', description: '', image: '', website: '', category: '' });
      setPlaceList([]);
    } catch (error) {
      alert('Error adding suggestion. Try again.');
    }
  };

  const handleViewClick = (suggestion) => {
    navigate(`/view-suggestion/${suggestion.id}`, { state: suggestion });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this suggestion?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suggestions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setSuggestions(suggestions.filter((s) => s.id !== id));
      } else {
        alert('Failed to delete suggestion.');
      }
    } catch (error) {
      alert('Error deleting suggestion.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">My Suggestions</h1>

      {user && (
        <div className="mb-4 text-center">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add Suggestion
          </button>
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {suggestions.length === 0 ? (
          <div className="col-12 text-center">
            <p>You haven't made any suggestions yet.</p>
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <div className="col" key={suggestion.id}>
              <div className="card h-100">
                <img
                  src={suggestion.image?.trim() ? suggestion.image : fallbackImage}
                  alt="Suggestion"
                  className="card-img-top"
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{suggestion.destination}</h5>
                  <p><strong>Category:</strong> {suggestion.category}</p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button className="btn btn-info btn-sm" onClick={() => handleViewClick(suggestion)}>
                    View
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(suggestion.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Suggestion</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddSuggestion}>
                  {['destination', 'description', 'image', 'website', 'category'].map((field) => (
                    <div className="mb-3" key={field}>
                      <label htmlFor={field} className="form-label">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type="text"
                        id={field}
                        name={field}
                        className="form-control"
                        value={formData[field]}
                        onChange={handleChange}
                      />
                    </div>
                  ))}

                  {/* Add Place Section */}
                  <div className="mb-3">
                    <label htmlFor="newPlace" className="form-label">Add Place</label>
                    <div className="input-group">
                      <input
                        type="text"
                        id="newPlace"
                        className="form-control"
                        value={newPlace}
                        onChange={(e) => setNewPlace(e.target.value)}
                        placeholder="Enter place name"
                      />
                      <button type="button" className="btn btn-primary" onClick={handleAddPlace}>
                        Add
                      </button>
                    </div>
                    {placeList.length > 0 && (
                      <ul className="list-group mt-2">
                        {placeList.map((place, idx) => (
                          <li className="list-group-item d-flex justify-content-between align-items-center" key={idx}>
                            {place}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemovePlace(idx)}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary w-100">Add Suggestion</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
