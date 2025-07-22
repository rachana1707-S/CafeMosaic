/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditSuggestion() {
  const { suggestionId } = useParams(); 
  const [formData, setFormData] = useState({
    destination: '',
    places: '',
    description: '',
    image: '',
    website: '',
    category: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch the suggestion data to populate the form
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/suggestions/${suggestionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setFormData({
            destination: data.destination,
            places: data.places ? JSON.parse(data.places).join(', ') : '',
            description: data.description,
            image: data.image,
            website: data.website,
            category: data.category,
          });
        } else {
          alert('Suggestion not found');
          navigate('/suggested-plans');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching suggestion:', error);
        alert('Error fetching suggestion');
        navigate('/suggested-plans');
      });
  }, [suggestionId, navigate]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (Updating the suggestion)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { destination, places, description, image, website, category } = formData;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suggestions/${suggestionId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          places: places ? JSON.stringify(places.split(',').map((place) => place.trim())) : null,
          description,
          image,
          website,
          category,
        }),
      });

      if (res.ok) {
        const updatedSuggestion = await res.json();
        alert('Suggestion updated successfully');
        navigate(`/trip-suggestions/${updatedSuggestion.id}`); // Redirect to the updated suggestion page
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to update suggestion.');
      }
    } catch (error) {
      alert('Error updating suggestion. Try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Edit Suggestion</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="destination" className="form-label">Destination</label>
          <input
            type="text"
            id="destination"
            name="destination"
            className="form-control"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="places" className="form-label">Places to Visit (comma-separated)</label>
          <input
            type="text"
            id="places"
            name="places"
            className="form-control"
            value={formData.places}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            className="form-control"
            value={formData.image}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="website" className="form-label">Website URL</label>
          <input
            type="text"
            id="website"
            name="website"
            className="form-control"
            value={formData.website}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Update Suggestion</button>
      </form>
    </div>
  );
}
