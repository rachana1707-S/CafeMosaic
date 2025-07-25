import React from 'react';
import { useLocation } from 'react-router-dom';

export default function TestSearch() {
  const location = useLocation();
  
  return (
    <div className="container mt-5 pt-5">
      <h1>TEST SEARCH RESULTS</h1>
      <div className="card">
        <div className="card-body">
          <h5>URL Information:</h5>
          <p><strong>Pathname:</strong> {location.pathname}</p>
          <p><strong>Search:</strong> {location.search}</p>
          <p><strong>Full URL:</strong> {window.location.href}</p>
          
          <h5 className="mt-3">Search Parameters:</h5>
          <pre>{JSON.stringify(Object.fromEntries(new URLSearchParams(location.search)), null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}