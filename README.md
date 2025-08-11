# 🍽️ FoodSocial - Social Food Sharing Platform

A modern social media platform focused on food sharing, restaurant reviews, and culinary experiences. Connect with fellow food enthusiasts, share your favorite dishes, discover new restaurants, and build a community around your love for food.

[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.0+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue.svg)](https://postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-Latest-brightgreen.svg)](https://prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Project Overview

FoodSocial is a comprehensive social networking platform designed specifically for food lovers. Users can share photos of their meals, write restaurant reviews, follow other food enthusiasts, and discover new culinary experiences in their area. The platform combines social media functionality with location-based restaurant discovery using real-world data from external APIs.

### ✨ Key Features

- **📸 Photo Sharing**: Share beautiful photos of your meals and culinary creations
- **⭐ Restaurant Reviews**: Write and read detailed restaurant reviews and ratings
- **👥 Social Network**: Follow friends and food influencers, build your culinary network
- **📍 Location Discovery**: Find nearby restaurants using Geoapify API with real-world data
- **🏷️ Smart Categorization**: Browse restaurants by cuisine categories from Geoapify
- **💬 Interactive Comments**: Engage with posts through likes, comments, and shares
- **🔍 Advanced Search**: Find specific dishes, restaurants, or users
- **🗺️ Interactive Maps**: Visual restaurant discovery with integrated mapping
- **📱 Mobile Responsive**: Optimized experience across all devices
- **🔔 Real-time Notifications**: Stay updated on activity in your network
- **📚 Collections**: Create and manage personalized restaurant collections

## 🚀 Live Demo

[🌐 View Live Application](https://foodsocialapp.netlify.app)

## 📸 Screenshots

### Main Feed
![Main Feed](client/src/screenshots/main1.png)
![Main Feed](client/src/screenshots/main2.png)
![Main Feed](client/src/screenshots/main3.png)
*Discover delicious posts from your network*

### Restaurant Discovery
![Restaurant Discovery](client/src/screenshots/restaurant1-discovery.png)
![Restaurant Discovery](client/src/screenshots/restaurant2-discovery.png)
![Restaurant Discovery](client/src/screenshots/restaurant3-discovery.png)
*Find and explore local restaurants with real-world data*

### User Profile
![User Profile](client/src/screenshots/collection.png)
![User Profile](client/src/screenshots/fav.png)
*Showcase your culinary journey*

### Mobile Experience
![Mobile View](client/src/screenshots/mobile1.png)
![Mobile View](client/src/screenshots/mobile2.png)

*Seamless mobile experience*

## 🛠️ Technologies Used

### Frontend
- **⚛️ React 18**: Modern UI library with hooks
- **🎨 Tailwind CSS**: Utility-first CSS framework
- **🚦 React Router**: Client-side routing
- **📋 React Hook Form**: Form handling and validation
- **🔄 React Query**: Server state management
- **🗺️ React Maps**: Interactive maps integration
- **🎭 Lucide React**: Beautiful icon library

### Backend
- **🟢 Node.js**: JavaScript runtime environment
- **🚀 Express.js**: Web application framework
- **🐘 PostgreSQL**: Robust relational database
- **🔷 Prisma ORM**: Type-safe database access
- **🔐 JWT**: JSON Web Tokens for authentication
- **☁️ Cloudinary**: Image upload and management
- **📧 Nodemailer**: Email service integration

### External APIs & Services
- **🌍 Geoapify API**: Real-world restaurant data and location services
- **📍 Geoapify Categories**: Restaurant categorization and filtering
- **🗺️ Geoapify Maps**: Interactive mapping and geolocation
- **🔍 Geoapify Places**: Restaurant search and discovery

### Development Tools
- **📦 npm**: Package management
- **⚡ Vite**: Fast build tool and development server
- **🎯 ESLint**: Code linting and formatting
- **🧪 Vitest**: Testing framework
- **🐳 Docker**: Containerization (optional)

## 🏗️ Project Structure

```
FOODSOCIAL/
├── client/                     # React frontend application
│   ├── .vite/
│   │   └── deps/              # Vite dependencies
│   ├── public/
│   │   └── assets/            # Public static assets
│   │       ├── cafe_placeholder.jpeg
│   │       ├── chain_coffee_placeholder.jpeg
│   │       ├── coffee_home_bg.jpg
│   │       ├── coffee_logo.jpeg
│   │       ├── coffee_register_bg.jpg
│   │       ├── drive_thru_placeholder.jpg
│   │       ├── food_background.avif
│   │       ├── food_background.jpg
│   │       ├── food_backgroundd.avif
│   │       ├── food_home_bg.jpg
│   │       ├── local_roaster_placeholder.jpg
│   │       ├── restaurant.png
│   │       └── wallpaper.avif
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── AddReview.jsx
│   │   │   ├── CollectionSelectorModal.jsx
│   │   │   ├── EditReview.jsx
│   │   │   ├── FoodPlaceCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── SearchCoffeeShops.jsx
│   │   ├── context/           # React context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── FoodPlaceContext.jsx
│   │   ├── pages/             # Main application pages
│   │   │   ├── AddReview.jsx
│   │   │   ├── BrowseReviews.jsx
│   │   │   ├── CollectionDetails.jsx
│   │   │   ├── EditReview.jsx
│   │   │   ├── FoodMap.jsx
│   │   │   ├── FoodPlaceDetails.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyCollections.jsx
│   │   │   ├── MyFavorites.jsx
│   │   │   ├── MyReviews.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ReviewDetails.jsx
│   │   │   ├── SearchFoodPlaces.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── TestSearch.jsx
│   │   │   └── ViewReview.jsx
│   │   ├── screenshots/       # Project screenshots
│   │   │   ├── collection.png
│   │   │   ├── fav.png
│   │   │   ├── main1.png
│   │   │   ├── main2.png
│   │   │   ├── main3.png
│   │   │   ├── map.png
│   │   │   ├── mobile1.png
│   │   │   ├── mobile2.png
│   │   │   ├── restaurant-discovery1.png
│   │   │   ├── restaurant-discovery2.png
│   │   │   ├── restaurant-discovery3.png
│   │   │   └── review.png
│   │   ├── tests/             # Frontend tests
│   │   │   ├── Navbar.test.jsx
│   │   │   ├── SearchBar.test.jsx
│   │   │   └── TripPlanner.test.jsx
│   │   ├── App.css            # Application styles
│   │   ├── App.jsx            # Main application component
│   │   ├── index.css          # Global styles
│   │   ├── index.html         # HTML template
│   │   └── main.jsx           # Application entry point
│   ├── .env                   # Client environment variables
│   ├── .gitignore
│   ├── eslint.config.js       # ESLint configuration
│   ├── index.html             # Root HTML file
│   ├── package-lock.json
│   ├── package.json           # Client dependencies
│   ├── vercel.json           # Vercel deployment config
│   └── vite.config.js        # Vite configuration
├── api/                      # Backend API (Node.js/Express)
│   ├── node_modules/         # Backend dependencies
│   ├── prisma/              # Prisma ORM configuration
│   │   ├── migrations/       # Database migrations
│   │   │   └── 20250530091537_init/
│   │   ├── migration_lock.toml
│   │   └── schema.prisma     # Database schema
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   └── db.js        # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── categoryController.js
│   │   │   ├── coffeeShopController.js
│   │   │   ├── collectionsController.js
│   │   │   ├── searchController.js
│   │   │   ├── userController.js
│   │   │   ├── userFavoriteController.js
│   │   │   └── userReviewController.js
│   │   ├── middleware/      # Custom middleware
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   └── routes/          # API route definitions
│   │       ├── authRoutes.js
│   │       ├── categoryRoutes.js
│   │       ├── coffeeShopRoutes.js
│   │       ├── collectionRoutes.js
│   │       ├── favoriteRoutes.js
│   │       ├── pingRoutes.js
│   │       ├── reviewRoutes.js
│   │       ├── searchRoutes.js
│   │       └── userRoutes.js
│   ├── .env                 # Server environment variables
│   ├── .gitignore
│   ├── index.js             # Main server file
│   ├── package-lock.json
│   ├── package.json         # Server dependencies
│   └── test-db.js          # Database testing utility
├── .gitignore              # Root gitignore
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v16.0 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12.0 or higher)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rachana1707-S/FoodSocial.git
   cd FoodSocial
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both client and server directories:
   
   **Server `.env`:**
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/foodsocial_db"
   
   # JWT Secret
   JWT_SECRET=your_jwt_secret_key_here
   
   # External APIs
   GEOAPIFY_API_KEY=your_geoapify_api_key
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email Service
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```
   
   **Client `.env`:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_GEOAPIFY_API_KEY=your_geoapify_api_key
   ```

4. **Database Setup**
   ```bash
   # Navigate to server directory
   cd server
   
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev --name init
   
   # Optional: Seed the database
   npx prisma db seed
   ```

5. **Start the Development Servers**
   
   **Option A: Start separately**
   ```bash
   # Terminal 1: Start the backend server
   cd server
   npm run dev
   
   # Terminal 2: Start the React client
   cd client
   npm run dev
   ```

6. **Access the Application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5000
   - **Prisma Studio**: http://localhost:5555 (run `npx prisma studio`)

## 🔧 Configuration

### Database Configuration

The application uses PostgreSQL with Prisma ORM:

**Prisma Schema Example:**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  name      String?
  bio       String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  reviews    Review[]
  favorites  Favorite[]
  collections Collection[]
  
  @@map("users")
}

model Restaurant {
  id          String  @id @default(cuid())
  name        String
  address     String
  latitude    Float
  longitude   Float
  category    String
  rating      Float?
  geoapifyId  String? @unique
  
  reviews     Review[]
  favorites   Favorite[]
  
  @@map("restaurants")
}
```

### External API Configuration

**Geoapify Integration:**
```javascript
// server/src/services/geoapifyService.js
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;
const BASE_URL = 'https://api.geoapify.com/v2';

class GeoapifyService {
  async searchRestaurants(lat, lon, radius = 5000) {
    const response = await fetch(
      `${BASE_URL}/places?categories=catering&filter=circle:${lon},${lat},${radius}&limit=20&apiKey=${GEOAPIFY_API_KEY}`
    );
    return response.json();
  }

  async getCategories() {
    // Get restaurant categories from Geoapify
    return [
      'catering.restaurant',
      'catering.fast_food',
      'catering.cafe',
      'catering.bar',
      'catering.pub'
    ];
  }
}

module.exports = new GeoapifyService();
```

## 📱 Features Deep Dive

### 🗺️ Location-Based Discovery
- **Real-World Data**: Restaurant information from Geoapify's comprehensive database
- **Interactive Maps**: Visual restaurant discovery with precise locations
- **Category Filtering**: Browse by restaurant types (cafes, fast food, fine dining, etc.)
- **Proximity Search**: Find restaurants within customizable radius

### 🏠 Main Feed
- **Real-time Updates**: See latest posts from your network
- **Interactive Engagement**: Like, comment, and share posts
- **Smart Filtering**: Filter by cuisine type, location, or friends
- **Infinite Scroll**: Seamless browsing experience

### 👤 User Profiles
- **Personal Dashboard**: View your posts, followers, and following
- **Profile Customization**: Upload profile pictures and cover photos
- **Activity Timeline**: Track your food journey and reviews
- **Statistics**: View your review count, followers, and engagement

### 📚 Collections System
- **Personal Collections**: Create themed restaurant lists
- **Public/Private**: Control visibility of your collections
- **Collaborative Collections**: Share and collaborate with friends
- **Smart Suggestions**: AI-powered collection recommendations

## 🔐 Authentication & Security

### Authentication Flow
```javascript
// JWT-based authentication with Prisma
const authFlow = {
  register: "Email verification → Profile setup → Dashboard",
  login: "Credentials → JWT token → Protected routes",
  logout: "Token invalidation → Redirect to login"
};
```

### Security Features
- **🔒 JWT Authentication**: Secure token-based authentication
- **🛡️ Input Validation**: Server-side validation with express-validator
- **🔐 Password Hashing**: Bcrypt for secure password storage
- **🚫 Rate Limiting**: Prevent spam and abuse
- **🔍 XSS Protection**: Cross-site scripting prevention
- **🌐 CORS Configuration**: Controlled cross-origin requests

## 📡 API Documentation

### Authentication Endpoints
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
POST /api/auth/logout       # User logout
GET  /api/auth/me           # Get current user
```

### User Management
```
GET    /api/users/profile   # Get user profile
PUT    /api/users/profile   # Update user profile
GET    /api/users/:id       # Get specific user
POST   /api/users/follow    # Follow/unfollow user
GET    /api/users/followers # Get user followers
GET    /api/users/following # Get user following
```

### Restaurant & Reviews
```
GET    /api/coffee-shops        # Get restaurants from Geoapify
GET    /api/coffee-shops/:id    # Get specific restaurant
POST   /api/reviews             # Create restaurant review
GET    /api/reviews/:id         # Get restaurant reviews
PUT    /api/reviews/:id         # Update review
DELETE /api/reviews/:id         # Delete review
```

### Search & Discovery
```
GET    /api/search/restaurants  # Search restaurants via Geoapify
GET    /api/search/users        # Search users
GET    /api/categories          # Get restaurant categories
GET    /api/search/nearby       # Get nearby restaurants
```

### Collections & Favorites
```
GET    /api/collections         # Get user collections
POST   /api/collections         # Create new collection
PUT    /api/collections/:id     # Update collection
DELETE /api/collections/:id     # Delete collection
POST   /api/favorites           # Add to favorites
DELETE /api/favorites/:id       # Remove from favorites
```

## 🚀 Deployment

### Environment Setup

**Production Build:**
```bash
# Build client
cd client && npm run build

# Start production server
cd server && npm start
```

### Deployment Options

#### 1. **Netlify (Frontend) + Render (Backend)**
```bash
# Frontend (Netlify)
cd client
npm run build
# Deploy dist folder to Netlify

# Backend (Render)
# Connect your GitHub repository to Render
# Set environment variables in Render dashboard
# Configure PostgreSQL database on Render
```

#### 2. **Vercel + Railway**
```bash
# Frontend (Vercel)
cd client
vercel --prod

# Backend (Railway)
# Connect repository to Railway
# Configure PostgreSQL database
# Set environment variables
```

## 🔧 Environment Variables

### Required Environment Variables

**Server Environment:**
```env
# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# External APIs
GEOAPIFY_API_KEY=your_geoapify_api_key

# Image Upload Service
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Email Service
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Client Environment:**
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# External Services
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_GEOAPIFY_API_KEY=your_geoapify_key

# App Configuration
VITE_APP_NAME=FoodSocial
VITE_APP_VERSION=1.0.0
```

## 📊 Performance Metrics

### Current Performance
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 200ms average
- **Image Upload**: < 5 seconds for standard photos
- **Geoapify API Response**: < 500ms for restaurant search
- **Database Queries**: Optimized with Prisma ORM
- **Mobile Performance**: 90+ Lighthouse score

## 🆘 Troubleshooting

### Common Issues

#### 1. **Database Connection Failed**
```bash
# Check PostgreSQL service
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# Verify connection string
echo $DATABASE_URL

# Test connection with Prisma
npx prisma db push
```

#### 2. **Geoapify API Issues**
```bash
# Verify API key
curl "https://api.geoapify.com/v2/places?categories=catering&limit=1&apiKey=YOUR_API_KEY"

# Check rate limits and quotas in Geoapify dashboard
```

#### 3. **Prisma Issues**
```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate

# View database in browser
npx prisma studio
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **🍕 Food Community**: For inspiration and feedback
- **⚛️ React Team**: For the excellent frontend framework
- **🟢 Node.js Community**: For the robust backend ecosystem
- **🐘 PostgreSQL**: For reliable database performance
- **🔷 Prisma Team**: For the amazing ORM experience
- **🌍 Geoapify**: For comprehensive location data and mapping services
- **☁️ Cloudinary**: For seamless image management

## 📞 Contact

**Rachana Sudhakar** - [rachanasudhakar17@gmail.com](mailto:rachanasudhakar17@gmail.com)

- 🌐 **Portfolio**: [https://rachana-portfolio.com](https://rachana-portfolio.com)
- 💼 **LinkedIn**: [https://linkedin.com/in/rachanasudhakar](https://linkedin.com/in/rachanasudhakar)
- 🐱 **GitHub**: [https://github.com/rachana1707-S](https://github.com/rachana1707-S)
- 📱 **Phone**: +1 (617) 602-3398
- 📍 **Location**: Boston, MA, USA

---

🌟 **Star this repository if you found it delicious!** 🌟

*Built with ❤️ and lots of good food by Rachana Sudhakar*