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
import TestSearch from './pages/TestSearch';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        
        {/* Coffee Shop Search & Discovery */}
        <Route path="/search-coffee-shops" element={<SearchCoffeeShops />} />
        <Route path="/search-results" element={<SearchResults />} />
        // In App.js, temporarily replace:
        <Route path="/coffee-shop-results" element={<SearchResults />} />

        // With:
        <Route path="/coffee-shop-results" element={<TestSearch />} />
        <Route path="/coffee-shop-map" element={<CoffeeShopMap />} />
        <Route path="/coffee-shops/:coffeeShopId" element={<CoffeeShopDetails />} />

        {/* User Collections & Favorites */}
        <Route path="/my-favorites" element={<ProtectedRoute><MyFavorites /></ProtectedRoute>} />
        <Route path="/my-collections" element={<ProtectedRoute><MyFavorites /></ProtectedRoute>} />
        <Route path="/collections/:id" element={<ProtectedRoute><ViewCollection /></ProtectedRoute>} />
        <Route path="/collections/:id/edit" element={<ProtectedRoute><EditReview /></ProtectedRoute>} />
        <Route path="/collections/:id/add-shops" element={<ProtectedRoute><SearchCoffeeShops /></ProtectedRoute>} />

        {/* Reviews System - Match backend routes */}
        <Route path="/add-review" element={<ProtectedRoute><AddReview /></ProtectedRoute>} />
        <Route path="/my-reviews" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
        <Route path="/browse-reviews" element={<BrowseReviews />} />
        <Route path="/reviews/:reviewId" element={<ViewReview />} />
        <Route path="/reviews/:reviewId/edit" element={<ProtectedRoute><EditReview /></ProtectedRoute>} />
        <Route path="/review-details/:id" element={<ReviewDetails />} />
        
        {/* Coffee Shop specific reviews - matches /reviews/coffee-shop/:coffeeShopId */}
        <Route path="/coffee-shops/:coffeeShopId/reviews" element={<BrowseReviews />} />
        
        {/* User specific reviews - matches /reviews/user/:userId */}
        <Route path="/users/:userId/reviews" element={<MyReviews />} />

        {/* User Profile & Activity */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/my-visits" element={<ProtectedRoute><MyVisits /></ProtectedRoute>} />
        
        {/* Visit stats for coffee shops - matches /visits/stats/:coffeeShopId */}
        <Route path="/coffee-shops/:coffeeShopId/visits" element={<MyVisits />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}