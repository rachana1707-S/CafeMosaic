// eslint-disable-next-line no-unused-vars
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import CollectionDetails from './pages/CollectionDetails';
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
import Profile from './pages/Profile';
import MyFavorites from './pages/MyFavorites';
import MyReviews from './pages/MyReviews';
import ReviewDetails from './pages/ReviewDetails';
import BrowseReviews from './pages/BrowseReviews';
import ProtectedRoute from './components/ProtectedRoute';
import MyCollections from './pages/MyCollections';

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
        <Route path="/my-collections" element={<ProtectedRoute><MyCollections /></ProtectedRoute>} />
        <Route path="/collections/:collectionId" element={<ProtectedRoute><CollectionDetails /></ProtectedRoute>} />
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