import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthUser } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SavedPlans() {
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/plans/user/${user.id}`, {
        withCredentials: true,
      })
      .then((res) => setPlans(res.data))
      .catch((err) => console.error("Error loading saved plans:", err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleView = (plan) => {
    navigate(`/view-plan/${plan.id}`, { state: plan });
  };

  const handleCreatePlan = async () => {
    const name = prompt("Enter a name for your new plan:");
    if (!name?.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/plans`,
        { name, description: "", userId: user.id },
        { withCredentials: true }
      );
      setPlans((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error("Failed to create plan:", error);
      alert("Error creating plan");
    }
  };

  const handleEditClick = (plan) => {
    setEditingPlanId(plan.id);
    setEditedName(plan.name);
  };

  const handleEditSubmit = async (planId) => {
    if (!editedName.trim()) return;
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/plans/${planId}`,
        { name: editedName },
        { withCredentials: true }
      );
      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === planId ? { ...plan, name: res.data.name } : plan
        )
      );
      setEditingPlanId(null);
    } catch (err) {
      console.error("Error updating plan name:", err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mt-4 mb-0">My Saved Plans</h2>
        <button className="btn btn-outline-primary" onClick={handleCreatePlan}>
          + Create Plan
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : plans.length === 0 ? (
        <p className="text-center">You don't have any saved plans yet.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-4 g-4 text-center">
          {plans.map((plan) => (
            <div className="col" key={plan.id}>
              <div
                className="card h-100 border-0 shadow-sm position-relative"
                style={{
                  backgroundColor: "#f1f3f5",
                  borderRadius: "12px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";
                }}
              >
                <img
                  src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${plan.name}`}
                  className="card-img-top"
                  alt={plan.name}
                  style={{
                    height: "140px",
                    objectFit: "cover",
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                  }}
                />

                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    {editingPlanId === plan.id ? (
                      <input
                        className="form-control text-center mb-2"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onBlur={() => handleEditSubmit(plan.id)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleEditSubmit(plan.id)
                        }
                        autoFocus
                      />
                    ) : (
                      <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                        <h5 className="fw-bold mb-0 text-truncate">{plan.name}</h5>
                        <button
                          className="btn btn-sm p-0 border-0 text-primary"
                          onClick={() => handleEditClick(plan)}
                          title="Edit name"
                        >
                          ✏️
                        </button>
                      </div>
                    )}

                    {plan.description && (
                      <p className="text-muted small mb-2">{plan.description}</p>
                    )}
                    <p className="small text-muted">
                      {plan.places?.length || 0} place
                      {plan.places?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    className="btn btn-outline-primary w-100 mt-3"
                    onClick={() => handleView(plan)}
                  >
                    View Plan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}