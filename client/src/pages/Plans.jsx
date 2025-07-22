import React from "react";
import { usePlans } from "../context/PlansContext"; // Import context

export default function Plans() {
  const { plans } = usePlans();

  return (
    <div className="container mt-5">
      <h1>My Saved Plans</h1>

      {plans.length === 0 ? (
        <p>No saved plans yet.</p>
      ) : (
        <ul className="list-group">
          {plans.map((plan, index) => (
            <li key={index} className="list-group-item">
              <h5>{plan.name}</h5>
              <ul>
                {plan.places.map((place) => (
                  <li key={place.id}>{place.name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
