import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ViewCollection from './pages/ViewCollection';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';
import FoodPlaceDetails from './pages/FoodPlaceDetails';
import EditReview from './pages/EditReview';
import ViewReview from './pages/ViewReview';
import AddReview from './pages/AddReview';
import SearchFoodPlaces from './pages/SearchFoodPlaces';
import FoodMap from './pages/FoodMap';
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
        
        {/* Food Place Search & Discovery */}
        <Route path="/search-food-places" element={<SearchFoodPlaces />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/food-results" element={<SearchResults />} />
        <Route path="/food-map" element={<FoodMap />} />
        <Route path="/food-places/:foodPlaceId" element={<FoodPlaceDetails />} />

        {/* User Collections & Favorites */}
        <Route path="/my-favorites" element={<ProtectedRoute><MyFavorites /></ProtectedRoute>} />
        <Route path="/my-collections" element={<ProtectedRoute><MyFavorites /></ProtectedRoute>} />
        <Route path="/collections/:id" element={<ProtectedRoute><ViewCollection /></ProtectedRoute>} />
        <Route path="/collections/:id/edit" element={<ProtectedRoute><EditReview /></ProtectedRoute>} />
        <Route path="/collections/:id/add-places" element={<ProtectedRoute><SearchFoodPlaces /></ProtectedRoute>} />

        {/* Reviews System */}
        <Route path="/add-review" element={<ProtectedRoute><AddReview /></ProtectedRoute>} />
        <Route path="/my-reviews" element={<ProtectedRoute><MyReviews /></ProtectedRoute>} />
        <Route path="/browse-reviews" element={<BrowseReviews />} />
        <Route path="/reviews/:reviewId" element={<ViewReview />} />
        <Route path="/reviews/:reviewId/edit" element={<ProtectedRoute><EditReview /></ProtectedRoute>} />
        <Route path="/review-details/:id" element={<ReviewDetails />} />
        
        {/* Food place specific reviews */}
        <Route path="/food-places/:foodPlaceId/reviews" element={<BrowseReviews />} />
        
        {/* User specific reviews */}
        <Route path="/users/:userId/reviews" element={<MyReviews />} />

        {/* User Profile & Activity */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/my-visits" element={<ProtectedRoute><MyVisits /></ProtectedRoute>} />
        <Route path="/my-food-journey" element={<ProtectedRoute><MyVisits /></ProtectedRoute>} />
        
        {/* Visit stats for food places */}
        <Route path="/food-places/:foodPlaceId/visits" element={<MyVisits />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Legacy Routes - Backward compatibility */}
        <Route path="/search-coffee-shops" element={<SearchFoodPlaces />} />
        <Route path="/coffee-shop-results" element={<SearchResults />} />
        <Route path="/coffee-shop-map" element={<FoodMap />} />
        <Route path="/coffee-shops/:coffeeShopId" element={<FoodPlaceDetails />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}