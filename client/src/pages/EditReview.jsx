import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditReview() {
  const { reviewId } = useParams(); 
  const [formData, setFormData] = useState({
    coffeeshopName: '',
    location: '',
    rating: '',
    coffeeQuality: '',
    ambiance: '',
    review: '',
    imageUrl: '',
    website: '',
    priceRange: '',
    wifiAvailable: false,
    petFriendly: false,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch the review data to populate the form
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setFormData({
            coffeeshopName: data.coffeeshopName || '',
            location: data.location || '',
            rating: data.rating || '',
            coffeeQuality: data.coffeeQuality || '',
            ambiance: data.ambiance || '',
            review: data.review || '',
            imageUrl: data.imageUrl || '',
            website: data.website || '',
            priceRange: data.priceRange || '',
            wifiAvailable: data.wifiAvailable || false,
            petFriendly: data.petFriendly || false,
          });
        } else {
          alert('Review not found');
          navigate('/my-reviews');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching review:', error);
        alert('Error fetching review');
        navigate('/my-reviews');
      });
  }, [reviewId, navigate]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // Handle form submission (Updating the review)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { coffeeshopName, rating, review } = formData;

    if (!coffeeshopName || !rating || !review) {
      alert('Coffee shop name, rating, and review are required.');
      return;
    }

    if (rating < 1 || rating > 5) {
      alert('Rating must be between 1 and 5.');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          rating: Number(formData.rating),
          coffeeQuality: formData.coffeeQuality ? Number(formData.coffeeQuality) : null,
          ambiance: formData.ambiance ? Number(formData.ambiance) : null,
        }),
      });

      if (res.ok) {
        const updatedReview = await res.json();
        alert('Review updated successfully');
        navigate(`/reviews/${updatedReview.id}`);
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to update review.');
      }
    } catch (error) {
      alert('Error updating review. Try again.');
    }
  };

  if (loading) {
    return <div className="container mt-5"><div className="text-center">Loading...</div></div>;
  }

  return (
    <div className="container mt-5">
      <h2>Edit Coffee Shop Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="coffeeshopName" className="form-label">Coffee Shop Name *</label>
          <input
            type="text"
            id="coffeeshopName"
            name="coffeeshopName"
            className="form-control"
            value={formData.coffeeshopName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            className="form-control"
            value={formData.location}
            onChange={handleChange}
            placeholder="Address or area"
          />
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label htmlFor="rating" className="form-label">Overall Rating *</label>
            <select
              id="rating"
              name="rating"
              className="form-control"
              value={formData.rating}
              onChange={handleChange}
              required
            >
              <option value="">Select rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label htmlFor="coffeeQuality" className="form-label">Coffee Quality</label>
            <select
              id="coffeeQuality"
              name="coffeeQuality"
              className="form-control"
              value={formData.coffeeQuality}
              onChange={handleChange}
            >
              <option value="">Select quality</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label htmlFor="ambiance" className="form-label">Ambiance</label>
            <select
              id="ambiance"
              name="ambiance"
              className="form-control"
              value={formData.ambiance}
              onChange={handleChange}
            >
              <option value="">Select ambiance</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="priceRange" className="form-label">Price Range</label>
          <select
            id="priceRange"
            name="priceRange"
            className="form-control"
            value={formData.priceRange}
            onChange={handleChange}
          >
            <option value="">Select price range</option>
            <option value="$">$ - Budget</option>
            <option value="$$">$$ - Moderate</option>
            <option value="$$$">$$$ - Expensive</option>
            <option value="$$$$">$$$$ - Very Expensive</option>
          </select>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="form-check">
              <input
                type="checkbox"
                id="wifiAvailable"
                name="wifiAvailable"
                className="form-check-input"
                checked={formData.wifiAvailable}
                onChange={handleChange}
              />
              <label htmlFor="wifiAvailable" className="form-check-label">WiFi Available</label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-check">
              <input
                type="checkbox"
                id="petFriendly"
                name="petFriendly"
                className="form-check-input"
                checked={formData.petFriendly}
                onChange={handleChange}
              />
              <label htmlFor="petFriendly" className="form-check-label">Pet Friendly</label>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="review" className="form-label">Review *</label>
          <textarea
            id="review"
            name="review"
            className="form-control"
            rows="4"
            value={formData.review}
            onChange={handleChange}
            placeholder="Share your experience at this coffee shop..."
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            className="form-control"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="website" className="form-label">Coffee Shop Website</label>
          <input
            type="url"
            id="website"
            name="website"
            className="form-control"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://coffeeshop.com"
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success flex-fill">Update Review</button>
          <button 
            type="button" 
            className="btn btn-outline-secondary flex-fill"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}