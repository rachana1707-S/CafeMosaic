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