import React, { useState } from "react";
import { useAuthUser } from "../context/AuthContext";

export default function AddSuggestion() {
  const { user } = useAuthUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/suggestions`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Suggestion added successfully!");
        setError("");
        setTitle("");
        setDescription("");
      } else {
        setError(data.message || "Failed to add suggestion.");
      }
    } catch (error) {
      setError("Server error. Try again.");
    }
  };

  if (!user) {
    return <p>Please log in to add a suggestion.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Add a Trip Suggestion</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Add Suggestion</button>
      </form>
    </div>
  );
}
