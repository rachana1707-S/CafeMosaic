import React, { createContext, useState, useContext } from "react";

const PlansContext = createContext();

export function usePlans() {
  return useContext(PlansContext);
}

export function PlansProvider({ children }) {
  const [plans, setPlans] = useState([]);

  const savePlan = (planName, places) => {
    setPlans([...plans, { name: planName, places }]);
  };

  return (
    <PlansContext.Provider value={{ plans, savePlan }}>
      {children}
    </PlansContext.Provider>
  );
}
