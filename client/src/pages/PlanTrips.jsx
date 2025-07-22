import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImage from "../assets/wallpaper.png";

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

    let categoryValue = category;
    if (category === "any") {
      categoryValue = [
        "tourism.attraction",
        "catering.restaurant",
        "leisure.park"
      ].join(",");
    }

    localStorage.setItem(
      "tripSearch",
      JSON.stringify({ destination, distance: distanceValue, category })
    );

    navigate(
      `/search-results?city=${encodeURIComponent(destination)}&distance=${distanceValue}&category=${categoryValue}`
    );
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center px-3"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="mb-4 fw-bold text-white">Plan your Voyage!</h1>

      {/* Mobile/Tablet Layout */}
      <form
        onSubmit={handleSearch}
        className="d-block d-lg-none w-100 bg-white shadow rounded-4 px-4 py-4"
        style={{ maxWidth: "520px" }}
      >
        <div className="mb-3">
          <input
            type="text"
            className="form-control fs-6 py-2"
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="number"
            min="1"
            className="form-control fs-6 py-2"
            placeholder="Enter Distance"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <select
            className="form-select fs-6 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            <option value="tourism.attraction">Tourist Places</option>
            <option value="catering.restaurant">Restaurants</option>
            <option value="leisure.park">Parks</option>
            <option value="any">All</option>
          </select>
        </div>

        <button
          className="btn btn-primary w-100 fs-6 py-2 rounded-pill"
          type="submit"
        >
          Search
        </button>
      </form>

      {/* Desktop Layout */}
      <form
        onSubmit={handleSearch}
        className="w-100 d-none d-lg-flex align-items-center justify-content-center"
        style={{ maxWidth: "1000px" }}
      >
        <div
          className="input-group shadow rounded-pill overflow-hidden bg-white w-100"
          style={{ height: "60px" }}
        >
          <span className="input-group-text bg-white border-0 px-3">
            <FaSearch className="text-primary fs-5" />
          </span>

          <input
            type="text"
            className="form-control border-0 fs-6"
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <input
            type="number"
            min="1"
            className="form-control border-0 fs-6"
            placeholder="Distance (default 50 km)"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />

          <select
            className="form-select border-0 fs-6"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            <option value="tourism.attraction">Tourist Places</option>
            <option value="catering.restaurant">Restaurants</option>
            <option value="leisure.park">Parks</option>
            <option value="any">All</option>
          </select>

          <button
            className="btn btn-primary px-4 fs-6 rounded-0"
            type="submit"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
