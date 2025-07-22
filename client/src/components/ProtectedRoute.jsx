import { Navigate, useLocation } from "react-router-dom";
import { useAuthUser } from "../context/AuthContext";
import { Coffee } from "lucide-react";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <Coffee 
            size={64} 
            className="text-warning mb-4 animate-pulse" 
          />
          <div 
            className="spinner-border text-warning mb-3" 
            role="status" 
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-muted fw-semibold">Loading Coffee Finder...</h4>
          <p className="text-muted">Brewing your experience...</p>
        </div>
        
        {/* Coffee beans animation */}
        <div className="position-absolute" style={{ top: '20%', left: '10%' }}>
          <Coffee size={24} className="text-warning opacity-25 animate-bounce" />
        </div>
        <div className="position-absolute" style={{ top: '30%', right: '15%' }}>
          <Coffee size={20} className="text-warning opacity-25 animate-pulse" />
        </div>
        <div className="position-absolute" style={{ bottom: '25%', left: '20%' }}>
          <Coffee size={28} className="text-warning opacity-25 animate-bounce" />
        </div>
        <div className="position-absolute" style={{ bottom: '35%', right: '10%' }}>
          <Coffee size={22} className="text-warning opacity-25 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;