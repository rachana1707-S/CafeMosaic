import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import backgroundImage from "../assets/wallpaper.webp";

export default function SearchCoffeeShops() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("coffeeShopSearch"));
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

    // For coffee shops, we'll use different categories
    let categoryValue = category;
    if (category === "any") {
      categoryValue = [
        "catering.cafe",
        "catering.restaurant.coffee",
        "catering.fast_food.coffee"
      ].join(",");
    }

    const searchParams = {
      location,
      distance: distanceValue,
      category: categoryValue,
      priceRange
    };

    localStorage.setItem("coffeeShopSearch", JSON.stringify(searchParams));

    const queryParams = new URLSearchParams({
      location: encodeURIComponent(location),
      distance: distanceValue,
      category: categoryValue,
      ...(priceRange && { price: priceRange })
    });

    navigate(`/coffee-shop-results?${queryParams.toString()}`);
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
      <h1 className="mb-4 fw-bold text-white">Find Your Perfect Coffee Shop!</h1>
      <p className="mb-5 text-white fs-5">Discover amazing coffee experiences near you</p>

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
            <option value="">Select coffee shop type</option>
            <option value="catering.cafe">Cafes</option>
            <option value="catering.restaurant.coffee">Coffee Restaurants</option>
            <option value="catering.fast_food.coffee">Coffee Chains</option>
            <option value="any">All Coffee Shops</option>
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
            <option value="$$$$">$$$$ - Luxury</option>
          </select>
        </div>

        <button
          className="btn btn-primary w-100 fs-6 py-2 rounded-pill"
          type="submit"
        >
          <FaSearch className="me-2" />
          Find Coffee Shops
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
            <option value="">Coffee shop type</option>
            <option value="catering.cafe">Cafes</option>
            <option value="catering.restaurant.coffee">Coffee Restaurants</option>
            <option value="catering.fast_food.coffee">Coffee Chains</option>
            <option value="any">All Coffee Shops</option>
          </select>

          <select
            className="form-select border-0 fs-6"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="">Price range</option>
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
        <small>💡 Tip: Leave distance empty to search within 10km by default</small>
      </div>
    </div>
  );
}