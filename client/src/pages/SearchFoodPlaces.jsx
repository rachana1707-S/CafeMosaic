import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImage from "../assets/wallpaper.avif";

export default function SearchFoodPlaces() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("foodPlaceSearch"));
    if (saved) {
      setLocation(saved.location || "");
      setDistance(saved.distance || "");
      setCategory(saved.category || "");
      setPriceRange(saved.priceRange || "");
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!location) {
      alert("Please enter a location!");
      return;
    }

    const distanceValue = distance.trim() === "" ? "10" : distance;

    // Use comprehensive food categories
    let categoryValue = category;
    if (category === "any") {
      categoryValue = [
        "catering.cafe",
        "catering.restaurant",
        "catering.fast_food",
        "catering.bar",
        "catering.pub",
        "catering.food_court",
        "catering.ice_cream",
        "catering.biergarten"
      ].join(",");
    } else if (!category) {
      // Default to popular food categories
      categoryValue = "catering.restaurant,catering.cafe,catering.bar";
    }

    const searchParams = {
      location,
      distance: distanceValue,
      category: categoryValue,
      priceRange
    };

    localStorage.setItem("foodPlaceSearch", JSON.stringify(searchParams));

    const queryParams = new URLSearchParams({
      location: encodeURIComponent(location),
      distance: distanceValue,
      categories: categoryValue,
      ...(priceRange && { price: priceRange })
    });

    navigate(`/search-results?${queryParams.toString()}`);
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
      <h1 className="mb-4 fw-bold text-white">Find Your Perfect Food Experience!</h1>
      <p className="mb-5 text-white fs-5">Discover restaurants, cafes, bars, and more amazing places to eat & drink</p>

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
            placeholder="Enter your location (city, address)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="number"
            min="1"
            max="50"
            className="form-control fs-6 py-2"
            placeholder="Distance in km (default: 10)"
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
            <option value="">All food places (default: Popular)</option>
            <option value="catering.restaurant">🍽️ Restaurants</option>
            <option value="catering.cafe">☕ Cafes & Coffee Shops</option>
            <option value="catering.bar">🍺 Bars & Pubs</option>
            <option value="catering.fast_food">🍔 Fast Food & Chains</option>
            <option value="catering.food_court">🥘 Food Courts</option>
            <option value="catering.ice_cream">🍦 Ice Cream & Desserts</option>
            <option value="catering.biergarten">🍻 Beer Gardens</option>
            <option value="any">🌟 All Food & Drink Places</option>
          </select>
        </div>

        <div className="mb-3">
          <select
            className="form-select fs-6 py-2"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Any price range</option>
            <option value="$">$ - Budget Friendly</option>
            <option value="$$">$$ - Moderate</option>
            <option value="$$$">$$$ - Premium</option>
            <option value="$$$$">$$$$ - Fine Dining</option>
          </select>
        </div>

        <button
          className="btn btn-primary w-100 fs-6 py-2 rounded-pill"
          type="submit"
        >
          <FaSearch className="me-2" />
          Find Food Places
        </button>
      </form>

      {/* Desktop Layout */}
      <form
        onSubmit={handleSearch}
        className="w-100 d-none d-lg-flex align-items-center justify-content-center"
        style={{ maxWidth: "1200px" }}
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
            placeholder="Enter your location (city, address)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <input
            type="number"
            min="1"
            max="50"
            className="form-control border-0 fs-6"
            placeholder="Distance (km)"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />

          <select
            className="form-select border-0 fs-6"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Food type (default: Popular)</option>
            <option value="catering.restaurant">🍽️ Restaurants</option>
            <option value="catering.cafe">☕ Cafes</option>
            <option value="catering.bar">🍺 Bars</option>
            <option value="catering.fast_food">🍔 Fast Food</option>
            <option value="catering.food_court">🥘 Food Courts</option>
            <option value="catering.ice_cream">🍦 Desserts</option>
            <option value="catering.biergarten">🍻 Beer Gardens</option>
            <option value="any">🌟 All Types</option>
          </select>

          <select
            className="form-select border-0 fs-6"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Any price</option>
            <option value="$">$</option>
            <option value="$$">$$</option>
            <option value="$$$">$$$</option>
            <option value="$$$$">$$$$</option>
          </select>

          <button
            className="btn btn-primary px-4 fs-6 rounded-0"
            type="submit"
          >
            Search
          </button>
        </div>
      </form>

      <div className="mt-4 text-white">
        <div className="row text-center">
          <div className="col-md-4 mb-2">
            <small>💡 <strong>Tip:</strong> Leave distance empty for 10km default</small>
          </div>
          <div className="col-md-4 mb-2">
            <small>🍽️ <strong>Default:</strong> Searches restaurants, cafes & bars</small>
          </div>
          <div className="col-md-4 mb-2">
            <small>🌍 <strong>Coverage:</strong> Powered by Geoapify</small>
          </div>
        </div>
      </div>
    </div>
  );
}