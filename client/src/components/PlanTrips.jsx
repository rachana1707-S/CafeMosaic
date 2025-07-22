


import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImage from "../assets/travel.jpg";

export default function PlanTrips() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tripSearch"));
    if (saved) {
      setDestination(saved.destination || "");
      setDistance(saved.distance || "");
      setCategory(saved.category || "");
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!destination || !category) {
      alert("Please fill all required fields!");
      return;
    }

    const distanceValue = distance.trim() === "" ? "50" : distance;
    localStorage.setItem(
      "tripSearch",
      JSON.stringify({ destination, distance: distanceValue, category })
    );

    navigate(
      `/search-results?city=${encodeURIComponent(destination)}&distance=${distanceValue}&category=${category}`
    );
  };

  return (
    <div
      className="position-relative d-flex flex-column align-items-center justify-content-center min-vh-100 text-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      ></div>

      {/* Content */}
      <div style={{ zIndex: 2, width: "100%", padding: "1rem" }}>
        <h1 className="mb-4 fw-bold text-white">Plan your Voyage!</h1>

        <form onSubmit={handleSearch} className="col-12 col-md-10 col-lg-8 mx-auto">
          <div className="input-group shadow-lg rounded-pill p-2 bg-white">
            <span className="input-group-text bg-transparent border-0">
              <FaSearch className="text-info" />
            </span>

            <input
              type="text"
              className="form-control border-0"
              placeholder="Where are you going?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />

            <input
              type="number"
              min="1"
              className="form-control border-0"
              placeholder="Distance (default 50 km)"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
            />

            <select
              className="form-select border-0"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              <option value="tourism.attraction">Tourist Places</option>
              <option value="catering.restaurant">Restaurants</option>
              <option value="leisure.park">Parks</option>
            </select>

            <button className="btn btn-info rounded-pill px-4" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
