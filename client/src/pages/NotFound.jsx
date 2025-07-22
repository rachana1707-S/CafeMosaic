// when unknown endpoint is called
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1 className="display-1 text-danger">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="text-muted">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary mt-3">Go Back Home</Link>
      </div>
    </div>
  );
}
