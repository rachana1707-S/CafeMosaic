import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ViewCollection from './pages/ViewCollection';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
import CoffeeShopDetails from './pages/CoffeeShopDetails';
import EditReview from './pages/EditReview';
import ViewReview from './pages/ViewReview';
import AddReview from './pages/AddReview';
import SearchCoffeeShops from './pages/SearchCoffeeShops';
import CoffeeShopMap from './pages/CoffeeShopMap';
import MyVisits from './pages/MyVisits';
import Profile from './pages/Profile';
import MyFavorites from './pages/MyFavorites';
import MyReviews from './pages/MyReviews';
import ReviewDetails from './pages/ReviewDetails';
import BrowseReviews from './pages/BrowseReviews';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        
        {/* Coffee Shop Search & Discovery */}
        <Route path="/search-coffee-shops" element={<SearchCoffeeShops />} />
        <Route path="/coffee-shop-results" element={<SearchResults />} />
        <Route path="/coffee-shop-map" element={<CoffeeShopMap />} />
        <Route path="/coffee-shops/:coffeeShopId" element={<CoffeeShopDetails />} />

        {/* Collections (formerly Saved Plans) */}
        <Route path="/my-collections" element={<ProtectedRoute><MyFavorites /></ProtectedRoute>} />
        <Route path="/collections/:id" element={<ProtectedRoute><ViewCollection /></ProtectedRoute>} />
        <Route path="/collections/:id/edit" element={<ProtectedRoute><EditReview /></ProtectedRoute>} />
        <Route path="/collections/:id/add-shops" element={<ProtectedRoute><SearchCoffeeShops /></ProtectedRoute>} />

        {/* Reviews (formerly Suggestions) */}
        <Route path="/add-review" element={<ProtectedRoute><AddReview /></ProtectedRoute>} />
        <Route path="/reviews/:reviewId/edit" element={<ProtectedRoute><EditReview /></ProtectedRoute>} /> 
        <Route path="/reviews/:id" element={<ViewReview />} />
        <Route path="/review-details/:id" element={<ReviewDetails />} />
        <Route path="/my-reviews" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
        <Route path="/browse-reviews" element={<BrowseReviews />} />

        {/* User Profile & Visits */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/my-visits" element={<ProtectedRoute><MyVisits /></ProtectedRoute>} />
        <Route path="/my-favorites" element={<ProtectedRoute><MyFavorites /></ProtectedRoute>} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Legacy Routes - Redirect to new equivalents */}
        <Route path="/plan-trips" element={<SearchCoffeeShops />} />
        <Route path="/saved-plans" element={<ProtectedRoute><MyFavorites /></ProtectedRoute>} />
        <Route path="/suggested-plans" element={<BrowseReviews />}/> 
        <Route path="/view-plan/:id" element={<ProtectedRoute><ViewCollection /></ProtectedRoute>} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/add-suggestion" element={<ProtectedRoute><AddReview /></ProtectedRoute>} />
        <Route path="/edit-suggestion/:suggestionId" element={<ProtectedRoute><EditReview /></ProtectedRoute>} /> 
        <Route path="/view-suggestion/:suggestionId" element={<ViewReview />} />
        <Route path="/trip-suggestions/:suggestionId" element={<CoffeeShopDetails />} />
        <Route path="/my-suggestions" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}