// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthUser } from "../context/AuthContext";

// export default function Profile() {
//   const { user, updateUser } = useAuthUser();
//   const navigate = useNavigate();
  
//   // Debug: Check what's available in the auth context
//   console.log("Auth context:", { user, updateUser, typeOfUpdateUser: typeof updateUser });
  
//   const [isEditing, setIsEditing] = useState(false);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [recentActivity, setRecentActivity] = useState([]);
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     name: "",
//     preferences: {}
//   });
//   const [stats, setStats] = useState({
//     totalReviews: 0,
//     totalCollections: 0,
//     totalVisits: 0,
//     totalFavorites: 0,
//     avgRating: 0,
//     joinDate: null,
//     recentVisits: []
//   });
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         username: user.username || "",
//         email: user.email || "",
//         name: user.name || "",
//         preferences: user.preferences || {}
//       });
//       fetchUserData();
//     }
//   }, [user]);

//   const fetchUserData = async () => {
//     try {
//       // Fetch user profile with stats
//       const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, {
//         credentials: "include",
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch profile data');
//       }
      
//       const data = await response.json();
      
//       // Set stats based on actual database relationships
//       setStats({
//         totalReviews: data.reviews?.length || 0,
//         totalCollections: data.collections?.length || 0,
//         totalVisits: data.visits?.length || 0,
//         totalFavorites: data.favorites?.length || 0,
//         avgRating: data.avgRating || 0,
//         joinDate: data.createdAt,
//         recentVisits: data.visits?.slice(0, 5) || []
//       });

//       // Fetch recent activity (visits, reviews, collections)
//       const activityResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/activity`, {
//         credentials: "include",
//       });
      
//       if (activityResponse.ok) {
//         const activityData = await activityResponse.json();
//         setRecentActivity(activityData);
//       }

//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith('preferences.')) {
//       const prefKey = name.split('.')[1];
//       setFormData(prev => ({
//         ...prev,
//         preferences: { ...prev.preferences, [prefKey]: value }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setUpdating(true);

//     try {
//       console.log("Sending profile update:", formData);
      
//       const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, {
//         method: "PUT",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       console.log("Response status:", response.status);
      
//       if (response.ok) {
//         const updatedUser = await response.json();
//         console.log("Profile updated successfully:", updatedUser);
        
//         // Check if updateUser is a function before calling it
//         if (typeof updateUser === 'function') {
//           updateUser(updatedUser);
//         } else {
//           console.warn("updateUser is not a function, skipping user context update");
//         }
        
//         // Update local form data to reflect the changes
//         setFormData(prev => ({
//           ...prev,
//           username: updatedUser.username,
//           email: updatedUser.email,
//           name: updatedUser.name,
//           preferences: updatedUser.preferences || {}
//         }));
        
//         setIsEditing(false);
//         alert("Profile updated successfully!");
//       } else {
//         const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
//         console.error("Update failed:", errorData);
//         alert(`Failed to update profile: ${errorData.message || `Server returned ${response.status}`}`);
//       }
//     } catch (error) {
//       console.error("Network error updating profile:", error);
//       alert(`Network error: ${error.message}. Please check your connection and try again.`);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleDeleteAccount = async () => {
//     const confirmMessage = "Are you sure you want to delete your account? This will permanently delete all your reviews, collections, visits, and favorites.";
    
//     if (!window.confirm(confirmMessage)) return;
    
//     const finalConfirm = window.prompt("Type 'DELETE' to confirm account deletion:");
//     if (finalConfirm !== "DELETE") {
//       alert("Account deletion cancelled.");
//       return;
//     }

//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, {
//         method: "DELETE",
//         credentials: "include",
//       });

//       if (response.ok) {
//         alert("Account deleted successfully.");
//         updateUser(null);
//         navigate("/");
//       } else {
//         const errorData = await response.json();
//         alert(errorData.message || "Failed to delete account.");
//       }
//     } catch (error) {
//       console.error("Error deleting account:", error);
//       alert("Error deleting account. Please try again.");
//     }
//   };

//   const getActivityIcon = (type) => {
//     switch (type) {
//       case "review": return "⭐";
//       case "collection": return "📁";
//       case "visit": return "📍";
//       case "favorite": return "❤️";
//       default: return "📝";
//     }
//   };

//   const getActivityDescription = (activity) => {
//     switch (activity.type) {
//       case "review":
//         return `Reviewed ${activity.coffeeShop?.name || 'a coffee shop'}`;
//       case "collection":
//         return `Created collection "${activity.name}"`;
//       case "visit":
//         return `Visited ${activity.coffeeShop?.name || 'a coffee shop'}`;
//       case "favorite":
//         return `Added ${activity.coffeeShop?.name || 'a coffee shop'} to favorites`;
//       default:
//         return activity.description || "Unknown activity";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mt-5">
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="container mt-5">
//         <div className="text-center">
//           <div className="mb-4">
//             <i className="fas fa-user-circle" style={{ fontSize: "4rem", color: "#6c757d" }}></i>
//           </div>
//           <h4 className="text-muted mb-3">Please log in to view your profile</h4>
//           <button className="btn btn-primary" onClick={() => navigate("/login")}>
//             Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-5">
//       <div className="row">
//         {/* Profile Header */}
//         <div className="col-12 mb-4">
//           <div className="card shadow-sm">
//             <div className="card-body">
//               <div className="row align-items-center">
//                 <div className="col-md-2 text-center">
//                   <div 
//                     className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
//                     style={{ width: "80px", height: "80px", fontSize: "2rem" }}
//                   >
//                     {user.username ? user.username.charAt(0).toUpperCase() : "U"}
//                   </div>
//                 </div>
//                 <div className="col-md-8">
//                   <h2 className="mb-1">{formData.name || formData.username}</h2>
//                   <p className="text-muted mb-2">@{formData.username}</p>
//                   <p className="text-muted mb-0">
//                     Member since {stats.joinDate ? new Date(stats.joinDate).toLocaleDateString() : "Unknown"}
//                   </p>
//                 </div>
//                 <div className="col-md-2 text-end">
//                   <button 
//                     className="btn btn-outline-primary"
//                     onClick={() => setIsEditing(!isEditing)}
//                   >
//                     {isEditing ? "Cancel" : "Edit Profile"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="col-12 mb-4">
//           <div className="row g-3">
//             <div className="col-md-3">
//               <div className="card text-center">
//                 <div className="card-body">
//                   <i className="fas fa-star fs-2 text-warning mb-2"></i>
//                   <h4 className="mb-1">{stats.totalReviews}</h4>
//                   <p className="text-muted mb-0">Reviews</p>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3">
//               <div className="card text-center">
//                 <div className="card-body">
//                   <i className="fas fa-folder fs-2 text-info mb-2"></i>
//                   <h4 className="mb-1">{stats.totalCollections}</h4>
//                   <p className="text-muted mb-0">Collections</p>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3">
//               <div className="card text-center">
//                 <div className="card-body">
//                   <i className="fas fa-map-marker-alt fs-2 text-success mb-2"></i>
//                   <h4 className="mb-1">{stats.totalVisits}</h4>
//                   <p className="text-muted mb-0">Visits</p>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3">
//               <div className="card text-center">
//                 <div className="card-body">
//                   <i className="fas fa-heart fs-2 text-danger mb-2"></i>
//                   <h4 className="mb-1">{stats.totalFavorites}</h4>
//                   <p className="text-muted mb-0">Favorites</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Profile Form */}
//         {isEditing && (
//           <div className="col-12 mb-4">
//             <div className="card">
//               <div className="card-header">
//                 <h5 className="mb-0">Edit Profile</h5>
//               </div>
//               <div className="card-body">
//                 <form onSubmit={handleSubmit}>
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">Username</label>
//                       <input
//                         type="text"
//                         name="username"
//                         className="form-control"
//                         value={formData.username}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">Email</label>
//                       <input
//                         type="email"
//                         name="email"
//                         className="form-control"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Display Name</label>
//                     <input
//                       type="text"
//                       name="name"
//                       className="form-control"
//                       value={formData.name}
//                       onChange={handleChange}
//                       placeholder="Your display name"
//                     />
//                   </div>

//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">Favorite Coffee Type</label>
//                       <select
//                         name="preferences.favoriteCoffeeType"
//                         className="form-control"
//                         value={formData.preferences.favoriteCoffeeType || ""}
//                         onChange={handleChange}
//                       >
//                         <option value="">Select your favorite</option>
//                         <option value="Espresso">Espresso</option>
//                         <option value="Americano">Americano</option>
//                         <option value="Latte">Latte</option>
//                         <option value="Cappuccino">Cappuccino</option>
//                         <option value="Macchiato">Macchiato</option>
//                         <option value="Mocha">Mocha</option>
//                         <option value="Cold Brew">Cold Brew</option>
//                         <option value="Pour Over">Pour Over</option>
//                         <option value="French Press">French Press</option>
//                       </select>
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">Preferred Location</label>
//                       <input
//                         type="text"
//                         name="preferences.location"
//                         className="form-control"
//                         value={formData.preferences.location || ""}
//                         onChange={handleChange}
//                         placeholder="City, State"
//                       />
//                     </div>
//                   </div>

//                   <div className="d-flex gap-2">
//                     <button 
//                       type="submit" 
//                       className="btn btn-success"
//                       disabled={updating}
//                     >
//                       {updating ? "Updating..." : "Save Changes"}
//                     </button>
//                     <button 
//                       type="button" 
//                       className="btn btn-outline-secondary"
//                       onClick={() => setIsEditing(false)}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Tabs Navigation */}
//         <div className="col-12 mb-4">
//           <ul className="nav nav-tabs">
//             <li className="nav-item">
//               <button 
//                 className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
//                 onClick={() => setActiveTab("overview")}
//               >
//                 Overview
//               </button>
//             </li>
//             <li className="nav-item">
//               <button 
//                 className={`nav-link ${activeTab === "activity" ? "active" : ""}`}
//                 onClick={() => setActiveTab("activity")}
//               >
//                 Recent Activity
//               </button>
//             </li>
//             <li className="nav-item">
//               <button 
//                 className={`nav-link ${activeTab === "settings" ? "active" : ""}`}
//                 onClick={() => setActiveTab("settings")}
//               >
//                 Settings
//               </button>
//             </li>
//           </ul>
//         </div>

//         {/* Tab Content */}
//         <div className="col-12">
//           {/* Overview Tab */}
//           {activeTab === "overview" && (
//             <div className="row">
//               <div className="col-md-6 mb-4">
//                 <div className="card">
//                   <div className="card-header">
//                     <h6 className="mb-0">Coffee Journey Stats</h6>
//                   </div>
//                   <div className="card-body">
//                     <div className="mb-3">
//                       <div className="d-flex justify-content-between">
//                         <span>Average Rating Given:</span>
//                         <strong>{stats.avgRating ? stats.avgRating.toFixed(1) : "N/A"}</strong>
//                       </div>
//                     </div>
//                     <div className="mb-3">
//                       <div className="d-flex justify-content-between">
//                         <span>Favorite Coffee:</span>
//                         <strong>{formData.preferences?.favoriteCoffeeType || "Not set"}</strong>
//                       </div>
//                     </div>
//                     <div>
//                       <div className="d-flex justify-content-between">
//                         <span>Preferred Location:</span>
//                         <strong>{formData.preferences?.location || "Not set"}</strong>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-md-6 mb-4">
//                 <div className="card">
//                   <div className="card-header">
//                     <h6 className="mb-0">Quick Actions</h6>
//                   </div>
//                   <div className="card-body">
//                     <div className="d-grid gap-2">
//                       <button 
//                         className="btn btn-primary"
//                         onClick={() => navigate("/coffee-shops")}
//                       >
//                         <i className="fas fa-search me-2"></i>Find Coffee Shops
//                       </button>
//                       <button 
//                         className="btn btn-outline-primary"
//                         onClick={() => navigate("/collections")}
//                       >
//                         <i className="fas fa-folder me-2"></i>My Collections
//                       </button>
//                       <button 
//                         className="btn btn-outline-success"
//                         onClick={() => navigate("/visits")}
//                       >
//                         <i className="fas fa-map-marker-alt me-2"></i>My Visits
//                       </button>
//                       <button 
//                         className="btn btn-outline-danger"
//                         onClick={() => navigate("/favorites")}
//                       >
//                         <i className="fas fa-heart me-2"></i>My Favorites
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Recent Activity Tab */}
//           {activeTab === "activity" && (
//             <div className="card">
//               <div className="card-header">
//                 <h6 className="mb-0">Recent Activity</h6>
//               </div>
//               <div className="card-body">
//                 {recentActivity.length === 0 ? (
//                   <div className="text-center py-4">
//                     <i className="fas fa-clock fs-2 text-muted mb-3"></i>
//                     <p className="text-muted">No recent activity to show.</p>
//                     <p className="text-muted">Start exploring coffee shops to see your activity here!</p>
//                   </div>
//                 ) : (
//                   <div className="list-group list-group-flush">
//                     {recentActivity.map((activity, index) => (
//                       <div key={index} className="list-group-item d-flex align-items-center">
//                         <span className="fs-4 me-3">{getActivityIcon(activity.type)}</span>
//                         <div className="flex-grow-1">
//                           <div className="fw-medium">{getActivityDescription(activity)}</div>
//                           <small className="text-muted">
//                             {new Date(activity.createdAt).toLocaleDateString()}
//                           </small>
//                         </div>
//                         {activity.rating && (
//                           <span className="badge bg-warning">
//                             ⭐ {activity.rating}
//                           </span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Settings Tab */}
//           {activeTab === "settings" && (
//             <div className="row">
//               <div className="col-md-6 mb-4">
//                 <div className="card">
//                   <div className="card-header">
//                     <h6 className="mb-0">Account Settings</h6>
//                   </div>
//                   <div className="card-body">
//                     <div className="d-grid gap-2">
//                       <button 
//                         className="btn btn-outline-primary"
//                         onClick={() => navigate("/change-password")}
//                       >
//                         <i className="fas fa-key me-2"></i>Change Password
//                       </button>
//                       <button 
//                         className="btn btn-outline-info"
//                         onClick={() => navigate("/privacy")}
//                       >
//                         <i className="fas fa-shield-alt me-2"></i>Privacy Settings
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-md-6 mb-4">
//                 <div className="card border-danger">
//                   <div className="card-header bg-danger text-white">
//                     <h6 className="mb-0">Danger Zone</h6>
//                   </div>
//                   <div className="card-body">
//                     <p className="card-text small text-muted">
//                       Once you delete your account, there is no going back. Please be certain.
//                     </p>
//                     <button 
//                       className="btn btn-danger"
//                       onClick={handleDeleteAccount}
//                     >
//                       <i className="fas fa-trash me-2"></i>Delete Account
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";

export default function Profile() {
  const { user, updateUser, setUser } = useAuthUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    preferences: {}
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        name: user.name || "",
        preferences: user.preferences || {}
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: { ...prev.preferences, [prefKey]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        
        if (typeof updateUser === 'function') {
          updateUser(updatedUser);
        } else if (typeof setUser === 'function') {
          setUser(updatedUser);
        }
        
        setFormData(prev => ({
          ...prev,
          username: updatedUser.username,
          email: updatedUser.email,
          name: updatedUser.name,
          preferences: updatedUser.preferences || {}
        }));
        
        setIsEditing(false);
        
        // FoodSocial themed success notification
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 4px; height: 40px; background: #FFD700; border-radius: 2px;"></div>
            <div>
              <div style="font-weight: 600; color: #2c3e50; margin-bottom: 2px;">Profile Updated!</div>
              <div style="font-size: 14px; color: #6c757d;">Your information has been saved successfully</div>
            </div>
            <i class="fas fa-check-circle" style="color: #28a745; font-size: 20px; margin-left: auto;"></i>
          </div>
        `;
        notification.style.cssText = `
          position: fixed;
          top: 80px;
          right: 20px;
          background: white;
          padding: 16px 20px;
          border-radius: 12px;
          font-size: 15px;
          z-index: 9999;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          border: 1px solid #e9ecef;
          min-width: 320px;
          animation: slideInRight 0.4s ease-out;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
      } else {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        alert(`Failed to update profile: ${errorData.message || `Server returned ${response.status}`}`);
      }
    } catch (error) {
      alert(`Network error: ${error.message}. Please check your connection and try again.`);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1
        }}></div>
        <div className="text-center" style={{ position: 'relative', zIndex: 2 }}>
          <div className="mb-4">
            <div className="spinner-border text-white" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <p className="text-white" style={{ fontSize: '16px', fontWeight: '500', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1
        }}></div>
        <div className="text-center" style={{ position: 'relative', zIndex: 2 }}>
          <div className="mb-4">
            <i className="fas fa-user-circle text-white" style={{ fontSize: '4rem', textShadow: '0 4px 8px rgba(0,0,0,0.5)' }}></i>
          </div>
          <h2 className="mb-3 text-white" style={{ fontWeight: '600', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Welcome to FoodSocial</h2>
          <p className="text-white mb-4" style={{ fontSize: '16px', opacity: '0.9', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Please sign in to access your profile</p>
          <button 
            className="btn btn-warning btn-lg px-4 py-2"
            onClick={() => navigate("/login")}
            style={{ 
              backgroundColor: '#FFD700',
              border: 'none',
              color: '#2c3e50',
              fontWeight: '600',
              borderRadius: '8px',
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ 
      backgroundImage: 'url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative'
    }}>
      {/* Dark overlay for better text readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1
      }}></div>
      
      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .profile-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(15px);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: fadeInUp 0.5s ease-out;
          position: relative;
          z-index: 2;
        }
        .form-control:focus {
          border-color: #FFD700;
          box-shadow: 0 0 0 0.2rem rgba(255, 215, 0, 0.25);
        }
        .btn-foodsocial {
          background-color: #FFD700;
          border: none;
          color: #2c3e50;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .btn-foodsocial:hover {
          background-color: #FFC107;
          color: #2c3e50;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }
        .btn-outline-foodsocial {
          border: 2px solid #FFD700;
          color: #FFD700;
          background: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .btn-outline-foodsocial:hover {
          background-color: #FFD700;
          color: #2c3e50;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
        }
        .yellow-accent {
          background: linear-gradient(45deg, #FFD700, #FFC107);
          width: 4px;
          height: 60px;
          border-radius: 2px;
        }
        .content-wrapper {
          position: relative;
          z-index: 2;
        }
      `}</style>
      
      <div className="container py-5 content-wrapper">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="profile-card">
              {/* Yellow accent bar */}
              <div className="yellow-accent mx-auto mb-4"></div>
              
              <div className="p-5 pt-2">
                {/* Profile Header */}
                <div className="text-center mb-5">
                  <div className="position-relative d-inline-block mb-4">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        backgroundColor: '#f8f9fa',
                        color: '#2c3e50',
                        border: '3px solid #FFD700'
                      }}
                    >
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div 
                      className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '32px', 
                        height: '32px',
                        backgroundColor: '#FFD700',
                        border: '2px solid white'
                      }}
                    >
                      <i className="fas fa-utensils" style={{ color: '#2c3e50', fontSize: '12px' }}></i>
                    </div>
                  </div>
                  
                  <h1 className="mb-2" style={{ color: '#2c3e50', fontWeight: '700', fontSize: '2rem' }}>
                    {formData.name || formData.username}
                  </h1>
                  <p className="text-muted mb-2" style={{ fontSize: '16px', fontWeight: '500' }}>
                    @{formData.username}
                  </p>
                  <p className="text-muted mb-4" style={{ fontSize: '14px' }}>
                    {formData.email}
                  </p>
                  
                  <button 
                    className={`btn btn-lg px-4 py-2 ${isEditing ? 'btn-outline-foodsocial' : 'btn-foodsocial'}`}
                    onClick={() => setIsEditing(!isEditing)}
                    style={{ borderRadius: '8px', fontSize: '16px', minWidth: '140px' }}
                  >
                    <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'} me-2`}></i>
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {/* Edit Form */}
                {isEditing && (
                  <div className="border-top pt-4 mt-4" style={{ borderColor: '#e9ecef' }}>
                    <h4 className="mb-4 text-center" style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.3rem' }}>
                      Update Your Information
                    </h4>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label" style={{ color: '#2c3e50', fontWeight: '600', fontSize: '14px' }}>
                            USERNAME
                          </label>
                          <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={{ 
                              border: '2px solid #e9ecef',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              fontSize: '15px',
                              fontWeight: '500'
                            }}
                          />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                          <label className="form-label" style={{ color: '#2c3e50', fontWeight: '600', fontSize: '14px' }}>
                            EMAIL ADDRESS
                          </label>
                          <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ 
                              border: '2px solid #e9ecef',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              fontSize: '15px',
                              fontWeight: '500'
                            }}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label" style={{ color: '#2c3e50', fontWeight: '600', fontSize: '14px' }}>
                          DISPLAY NAME
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your display name"
                          style={{ 
                            border: '2px solid #e9ecef',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            fontSize: '15px',
                            fontWeight: '500'
                          }}
                        />
                      </div>

                      <div className="d-flex gap-3 justify-content-center pt-3">
                        <button 
                          type="submit" 
                          className="btn btn-foodsocial btn-lg px-4 py-2"
                          disabled={updating}
                          style={{ borderRadius: '8px', fontSize: '16px', minWidth: '140px' }}
                        >
                          {updating ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i>
                              Save Changes
                            </>
                          )}
                        </button>
                        
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary btn-lg px-4 py-2"
                          onClick={() => setIsEditing(false)}
                          style={{ 
                            borderRadius: '8px', 
                            fontSize: '16px',
                            color: '#6c757d',
                            borderColor: '#6c757d'
                          }}
                        >
                          <i className="fas fa-times me-2"></i>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}