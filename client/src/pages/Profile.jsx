import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";

export default function Profile() {
  const { user, updateUser } = useAuthUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [recentActivity, setRecentActivity] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    favoriteCoffeeType: "",
    profileImage: "",
  });
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalCollections: 0,
    avgRating: 0,
    joinDate: null,
    totalVisits: 0,
    mostActiveMonth: null,
    coffeeTypesTried: 0,
    citiesExplored: 0,
    favoriteCoffeeShops: []
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        location: user.location || "",
        favoriteCoffeeType: user.favoriteCoffeeType || "",
        profileImage: user.profileImage || "",
      });
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user stats
      const statsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile/stats`, {
        credentials: "include",
      });
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch recent activity
      const activityRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile/activity`, {
        credentials: "include",
      });
      const activityData = await activityRes.json();
      setRecentActivity(activityData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        updateUser(updatedUser);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update profile.");
      }
    } catch (error) {
      alert("Error updating profile. Try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = () => {
    navigate("/change-password");
  };

  const handleDeleteAccount = async () => {
    const confirmMessage = "Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your reviews, collections, and personal data.";
    
    if (!window.confirm(confirmMessage)) return;
    
    const finalConfirm = window.prompt("Type 'DELETE' to confirm account deletion:");
    if (finalConfirm !== "DELETE") {
      alert("Account deletion cancelled.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("Account deleted successfully.");
        updateUser(null);
        navigate("/");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to delete account.");
      }
    } catch (error) {
      alert("Error deleting account. Try again.");
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "review": return "⭐";
      case "collection": return "📁";
      case "visit": return "📍";
      default: return "📝";
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case "review":
        return `Reviewed ${activity.coffeeShopName}`;
      case "collection":
        return `Created collection "${activity.collectionName}"`;
      case "visit":
        return `Visited ${activity.coffeeShopName}`;
      default:
        return activity.description || "Unknown activity";
    }
  };

  const renderStars = (rating) => {
    if (!rating) return "No ratings yet";
    return "⭐".repeat(Math.round(rating)) + ` (${rating}/5)`;
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="mb-4">
            <i className="fas fa-user-circle" style={{ fontSize: "4rem", color: "#6c757d" }}></i>
          </div>
          <h4 className="text-muted mb-3">Please log in to view your profile</h4>
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Profile Header */}
        <div className="col-12 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-2 text-center">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                  ) : (
                    <div 
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{ width: "80px", height: "80px", fontSize: "2rem" }}
                    >
                      {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
                <div className="col-md-8">
                  <h2 className="mb-1">{formData.firstName || formData.lastName ? 
                    `${formData.firstName} ${formData.lastName}`.trim() : formData.username}</h2>
                  <p className="text-muted mb-2">@{formData.username}</p>
                  {formData.location && (
                    <p className="mb-2"><i className="fas fa-map-marker-alt me-2"></i>{formData.location}</p>
                  )}
                  {formData.favoriteCoffeeType && (
                    <p className="mb-2"><i className="fas fa-coffee me-2"></i>Favorite: {formData.favoriteCoffeeType}</p>
                  )}
                  {formData.bio && (
                    <p className="mb-0 text-muted">{formData.bio}</p>
                  )}
                </div>
                <div className="col-md-2 text-end">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="col-12 mb-4">
          <div className="row g-3">
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className="fas fa-star fs-2 text-warning mb-2"></i>
                  <h4 className="mb-1">{stats.totalReviews}</h4>
                  <p className="text-muted mb-0">Reviews Written</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className="fas fa-folder fs-2 text-info mb-2"></i>
                  <h4 className="mb-1">{stats.totalCollections}</h4>
                  <p className="text-muted mb-0">Collections</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className="fas fa-map-marker-alt fs-2 text-success mb-2"></i>
                  <h4 className="mb-1">{stats.totalVisits || 0}</h4>
                  <p className="text-muted mb-0">Places Visited</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className="fas fa-calendar fs-2 text-primary mb-2"></i>
                  <h4 className="mb-1">{stats.joinDate ? new Date(stats.joinDate).getFullYear() : "N/A"}</h4>
                  <p className="text-muted mb-0">Member Since</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        {isEditing && (
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Edit Profile</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        name="username"
                        className="form-control"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        name="location"
                        className="form-control"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, State/Country"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Favorite Coffee Type</label>
                      <select
                        name="favoriteCoffeeType"
                        className="form-control"
                        value={formData.favoriteCoffeeType}
                        onChange={handleChange}
                      >
                        <option value="">Select your favorite</option>
                        <option value="Espresso">Espresso</option>
                        <option value="Americano">Americano</option>
                        <option value="Latte">Latte</option>
                        <option value="Cappuccino">Cappuccino</option>
                        <option value="Macchiato">Macchiato</option>
                        <option value="Mocha">Mocha</option>
                        <option value="Cold Brew">Cold Brew</option>
                        <option value="Frappuccino">Frappuccino</option>
                        <option value="Pour Over">Pour Over</option>
                        <option value="French Press">French Press</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Profile Image URL</label>
                    <input
                      type="url"
                      name="profileImage"
                      className="form-control"
                      value={formData.profileImage}
                      onChange={handleChange}
                      placeholder="https://example.com/your-photo.jpg"
                    />
                    <div className="form-text">Enter a URL to your profile photo</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                      name="bio"
                      className="form-control"
                      rows="3"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about your coffee journey..."
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-success"
                      disabled={updating}
                    >
                      {updating ? "Updating..." : "Save Changes"}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="col-12 mb-4">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "activity" ? "active" : ""}`}
                onClick={() => setActiveTab("activity")}
              >
                Recent Activity
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "favorites" ? "active" : ""}`}
                onClick={() => setActiveTab("favorites")}
              >
                Favorite Places
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "settings" ? "active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                Settings
              </button>
            </li>
          </ul>
        </div>

        {/* Tab Content */}
        <div className="col-12">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Coffee Journey Stats</h6>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Average Rating Given:</span>
                        <strong>{stats.avgRating ? stats.avgRating.toFixed(1) : "N/A"}</strong>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Most Active Month:</span>
                        <strong>{stats.mostActiveMonth || "N/A"}</strong>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Coffee Types Tried:</span>
                        <strong>{stats.coffeeTypesTried || 0}</strong>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between">
                        <span>Cities Explored:</span>
                        <strong>{stats.citiesExplored || 0}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Quick Actions</h6>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-primary"
                        onClick={() => navigate("/add-review")}
                      >
                        <i className="fas fa-star me-2"></i>Write a Review
                      </button>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => navigate("/my-collections")}
                      >
                        <i className="fas fa-folder me-2"></i>Manage Collections
                      </button>
                      <button 
                        className="btn btn-outline-success"
                        onClick={() => navigate("/my-visits")}
                      >
                        <i className="fas fa-map-marker-alt me-2"></i>Track Visits
                      </button>
                      <button 
                        className="btn btn-outline-info"
                        onClick={() => navigate("/search-coffee-shops")}
                      >
                        <i className="fas fa-search me-2"></i>Find Coffee Shops
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity Tab */}
          {activeTab === "activity" && (
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">Recent Activity</h6>
              </div>
              <div className="card-body">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="fas fa-clock fs-2 text-muted mb-3"></i>
                    <p className="text-muted">No recent activity to show.</p>
                    <p className="text-muted">Start exploring coffee shops to see your activity here!</p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="list-group-item d-flex align-items-center">
                        <span className="fs-4 me-3">{getActivityIcon(activity.type)}</span>
                        <div className="flex-grow-1">
                          <div className="fw-medium">{getActivityDescription(activity)}</div>
                          <small className="text-muted">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        {activity.rating && (
                          <span className="badge bg-warning">
                            ⭐ {activity.rating}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Favorite Places Tab */}
          {activeTab === "favorites" && (
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">Your Favorite Coffee Shops</h6>
              </div>
              <div className="card-body">
                {stats.favoriteCoffeeShops && stats.favoriteCoffeeShops.length > 0 ? (
                  <div className="row row-cols-1 row-cols-md-2 g-3">
                    {stats.favoriteCoffeeShops.map((shop, index) => (
                      <div key={index} className="col">
                        <div className="card border-0 bg-light">
                          <div className="card-body">
                            <h6 className="card-title">{shop.name}</h6>
                            <p className="card-text small text-muted">{shop.location}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="badge bg-warning">⭐ {shop.yourRating}/5</span>
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => navigate(`/coffee-shops/${shop.id}`)}
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-heart fs-2 text-muted mb-3"></i>
                    <p className="text-muted">No favorite coffee shops yet.</p>
                    <p className="text-muted">Rate some coffee shops 4+ stars to see them here!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h6 className="mb-0">Account Settings</h6>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={handlePasswordChange}
                      >
                        <i className="fas fa-key me-2"></i>Change Password
                      </button>
                      <button 
                        className="btn btn-outline-info"
                        onClick={() => navigate("/privacy-settings")}
                      >
                        <i className="fas fa-shield-alt me-2"></i>Privacy Settings
                      </button>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/export-data")}
                      >
                        <i className="fas fa-download me-2"></i>Export My Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card border-danger">
                  <div className="card-header bg-danger text-white">
                    <h6 className="mb-0">Danger Zone</h6>
                  </div>
                  <div className="card-body">
                    <p className="card-text small text-muted">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button 
                      className="btn btn-danger"
                      onClick={handleDeleteAccount}
                    >
                      <i className="fas fa-trash me-2"></i>Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}