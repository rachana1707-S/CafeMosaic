# 🍽️ FoodSocial - Social Food Sharing Platform

A modern social media platform focused on food sharing, restaurant reviews, and culinary experiences. Connect with fellow food enthusiasts, share your favorite dishes, discover new restaurants, and build a community around your love for food.

[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.0+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen.svg)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Project Overview

FoodSocial is a comprehensive social networking platform designed specifically for food lovers. Users can share photos of their meals, write restaurant reviews, follow other food enthusiasts, and discover new culinary experiences in their area. The platform combines social media functionality with location-based restaurant discovery and food recommendation systems.

### ✨ Key Features

- **📸 Photo Sharing**: Share beautiful photos of your meals and culinary creations
- **⭐ Restaurant Reviews**: Write and read detailed restaurant reviews and ratings
- **👥 Social Network**: Follow friends and food influencers, build your culinary network
- **📍 Location Discovery**: Find nearby restaurants and food experiences
- **🏷️ Smart Tagging**: Tag dishes, cuisines, and ingredients for better discovery
- **💬 Interactive Comments**: Engage with posts through likes, comments, and shares
- **🔍 Advanced Search**: Find specific dishes, restaurants, or users
- **📱 Mobile Responsive**: Optimized experience across all devices
- **🔔 Real-time Notifications**: Stay updated on activity in your network
- **🍳 Recipe Sharing**: Share and discover new recipes from the community

## 🚀 Live Demo

[🌐 View Live Application](https://foodsocial-demo.netlify.app) <!-- Replace with actual URL -->

## 📸 Screenshots

### Main Feed
![Main Feed](screenshots/main-feed.png)
*Discover delicious posts from your network*

### Restaurant Discovery
![Restaurant Discovery](screenshots/restaurant-discovery.png)
*Find and explore local restaurants*

### User Profile
![User Profile](screenshots/user-profile.png)
*Showcase your culinary journey*

### Mobile Experience
![Mobile View](screenshots/mobile-view.png)
*Seamless mobile experience*

## 🛠️ Technologies Used

### Frontend
- **⚛️ React 18**: Modern UI library with hooks
- **🎨 Styled Components**: CSS-in-JS styling solution
- **🚦 React Router**: Client-side routing
- **📋 React Hook Form**: Form handling and validation
- **🔄 React Query**: Server state management
- **📱 Material-UI**: Component library for consistent design
- **📍 Mapbox GL**: Interactive maps for location features

### Backend
- **🟢 Node.js**: JavaScript runtime environment
- **🚀 Express.js**: Web application framework
- **🍃 MongoDB**: NoSQL database for flexible data storage
- **🔐 JWT**: JSON Web Tokens for authentication
- **☁️ Cloudinary**: Image upload and management
- **📧 Nodemailer**: Email service integration
- **🔍 Algolia**: Search functionality

### Development Tools
- **📦 npm/yarn**: Package management
- **🔨 Webpack**: Module bundling
- **🎯 ESLint**: Code linting and formatting
- **🧪 Jest**: Testing framework
- **🐳 Docker**: Containerization (optional)

## 🏗️ Project Structure

```
FoodSocial/
├── client/                     # React frontend application
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/
│   │   │   ├── posts/
│   │   │   ├── restaurants/
│   │   │   └── user/
│   │   ├── pages/             # Main application pages
│   │   │   ├── Home/
│   │   │   ├── Profile/
│   │   │   ├── Restaurant/
│   │   │   └── Auth/
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service functions
│   │   ├── utils/             # Utility functions
│   │   ├── context/           # React context providers
│   │   ├── assets/            # Images and static files
│   │   ├── styles/            # Global styles and themes
│   │   └── App.js             # Main application component
│   ├── package.json
│   └── README.md
├── server/                    # Node.js backend API
│   ├── controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── userController.js
│   │   └── restaurantController.js
│   ├── models/               # MongoDB data models
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Restaurant.js
│   │   └── Review.js
│   ├── routes/               # API route definitions
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── users.js
│   │   └── restaurants.js
│   ├── middleware/           # Custom middleware functions
│   │   ├── auth.js
│   │   ├── upload.js
│   │   └── validation.js
│   ├── utils/               # Server utility functions
│   ├── config/              # Configuration files
│   │   ├── database.js
│   │   └── cloudinary.js
│   ├── tests/               # Backend tests
│   ├── uploads/             # Temporary file storage
│   ├── package.json
│   └── server.js            # Main server file
├── docs/                    # Documentation
│   ├── API.md               # API documentation
│   ├── DEPLOYMENT.md        # Deployment guide
│   └── CONTRIBUTING.md      # Contribution guidelines
├── .gitignore
├── docker-compose.yml       # Docker configuration
├── package.json             # Root package configuration
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v16.0 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
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
   MONGODB_URI=mongodb://localhost:27017/foodsocial
   
   # JWT Secret
   JWT_SECRET=your_jwt_secret_key_here
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email Service
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # API Keys
   MAPBOX_ACCESS_TOKEN=your_mapbox_token
   ALGOLIA_APP_ID=your_algolia_app_id
   ALGOLIA_API_KEY=your_algolia_api_key
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```
   
   **Client `.env`:**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_MAPBOX_TOKEN=your_mapbox_token
   REACT_APP_ALGOLIA_APP_ID=your_algolia_app_id
   REACT_APP_ALGOLIA_SEARCH_KEY=your_algolia_search_key
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB service (if running locally)
   mongod
   
   # Or use MongoDB Atlas cloud service
   # Update MONGODB_URI in server/.env with your Atlas connection string
   ```

5. **Start the Development Servers**
   
   **Option A: Using npm scripts (from root directory)**
   ```bash
   # Start both client and server concurrently
   npm run dev
   ```
   
   **Option B: Start separately**
   ```bash
   # Terminal 1: Start the backend server
   cd server
   npm run dev
   
   # Terminal 2: Start the React client
   cd client
   npm start
   ```

6. **Access the Application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **API Documentation**: http://localhost:5000/api-docs

## 🔧 Configuration

### Database Configuration

The application supports both local MongoDB and MongoDB Atlas:

**Local MongoDB:**
```javascript
// server/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/foodsocial');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
```

**MongoDB Atlas (Cloud):**
```javascript
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
```

### Image Upload Configuration

**Cloudinary Setup:**
```javascript
// server/config/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
```

## 📱 Features Deep Dive

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

### 🍕 Restaurant Features
- **Detailed Listings**: Comprehensive restaurant information
- **Review System**: 5-star rating system with detailed reviews
- **Photo Galleries**: Visual showcase of restaurant dishes
- **Location Integration**: Interactive maps and directions
- **Menu Integration**: Digital menu viewing and sharing

### 🔍 Search & Discovery
- **Advanced Search**: Find restaurants, dishes, or users
- **Geolocation**: Discover nearby food experiences
- **Trending Content**: See what's popular in your area
- **Recommendation Engine**: Personalized food suggestions

### 📲 Mobile Experience
- **Progressive Web App**: Install-able mobile experience
- **Touch Optimized**: Gesture-friendly interface
- **Offline Support**: Basic functionality without internet
- **Push Notifications**: Stay connected on the go

## 🔐 Authentication & Security

### Authentication Flow
```javascript
// JWT-based authentication
const authFlow = {
  register: "Email verification → Profile setup → Dashboard",
  login: "Credentials → JWT token → Protected routes",
  logout: "Token invalidation → Redirect to login"
};
```

### Security Features
- **🔒 JWT Authentication**: Secure token-based authentication
- **🛡️ Input Validation**: Server-side validation for all inputs
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
POST /api/auth/forgot       # Password reset request
PUT  /api/auth/reset        # Password reset confirmation
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

### Posts & Content
```
GET    /api/posts           # Get feed posts
POST   /api/posts           # Create new post
PUT    /api/posts/:id       # Update post
DELETE /api/posts/:id       # Delete post
POST   /api/posts/:id/like  # Like/unlike post
POST   /api/posts/:id/comment # Add comment
```

### Restaurant & Reviews
```
GET    /api/restaurants     # Get restaurants
GET    /api/restaurants/:id # Get specific restaurant
POST   /api/reviews         # Create restaurant review
GET    /api/reviews/:id     # Get restaurant reviews
PUT    /api/reviews/:id     # Update review
DELETE /api/reviews/:id     # Delete review
```

### Search & Discovery
```
GET    /api/search/restaurants # Search restaurants
GET    /api/search/users       # Search users
GET    /api/search/posts       # Search posts
GET    /api/search/nearby      # Get nearby restaurants
```

## 🎨 UI/UX Design

### Design System
- **Color Palette**: Warm, food-inspired colors
- **Typography**: Clean, readable fonts (Roboto, Open Sans)
- **Icons**: Food Awesome and custom food icons
- **Layout**: Mobile-first responsive design
- **Animation**: Smooth micro-interactions and transitions

### Component Library
```javascript
// Example reusable components
├── Button/              # Custom button variants
├── Card/                # Food post cards
├── Modal/               # Dialog components
├── Form/                # Form input components
├── Navigation/          # Header and sidebar navigation
├── Map/                 # Interactive map component
└── ImageUpload/         # Drag-and-drop image upload
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run client tests
cd client && npm test

# Run server tests
cd server && npm test

# Run tests with coverage
npm run test:coverage
```

### Test Structure
```javascript
// Example test structure
describe('User Authentication', () => {
  test('should register new user successfully', async () => {
    // Test registration flow
  });
  
  test('should login with valid credentials', async () => {
    // Test login flow
  });
  
  test('should reject invalid credentials', async () => {
    // Test error handling
  });
});
```

## 🚀 Deployment

### Environment Setup

**Development:**
```bash
npm run dev
```

**Production Build:**
```bash
# Build client
cd client && npm run build

# Start production server
cd server && npm start
```

### Deployment Options

#### 1. **Heroku Deployment**
```bash
# Install Heroku CLI
heroku create foodsocial-app

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_atlas_uri
heroku config:set JWT_SECRET=your_jwt_secret

# Deploy
git push heroku main
```

#### 2. **Netlify + Heroku**
```bash
# Frontend (Netlify)
cd client
npm run build
# Deploy build folder to Netlify

# Backend (Heroku)
cd server
git subtree push --prefix server heroku main
```

#### 3. **Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

#### 4. **AWS/DigitalOcean**
```bash
# Build production bundle
npm run build:prod

# Deploy using your preferred cloud service
# Configure environment variables
# Set up database connections
# Configure SSL certificates
```

## 🔧 Environment Variables

### Required Environment Variables

**Server Environment:**
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/foodsocial

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

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

# External APIs
MAPBOX_ACCESS_TOKEN=your_mapbox_token
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_API_KEY=your_algolia_key

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Client Environment:**
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000

# External Services
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
REACT_APP_ALGOLIA_APP_ID=your_algolia_app_id
REACT_APP_ALGOLIA_SEARCH_KEY=your_search_only_key
REACT_APP_GOOGLE_ANALYTICS_ID=your_ga_id

# App Configuration
REACT_APP_APP_NAME=FoodSocial
REACT_APP_VERSION=1.0.0
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🐛 Bug Reports
1. **Search existing issues** to avoid duplicates
2. **Use the bug report template** when creating new issues
3. **Include detailed information**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - System information

### 💡 Feature Requests
1. **Check the roadmap** to see if the feature is already planned
2. **Use the feature request template**
3. **Provide detailed use cases and mockups**

### 🔄 Pull Requests
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow coding standards**: ESLint configuration provided
4. **Write tests** for new functionality
5. **Update documentation** as needed
6. **Submit pull request** with detailed description

### 📝 Coding Standards
- Follow ESLint configuration
- Use meaningful variable and function names
- Write JSDoc comments for functions
- Maintain consistent file structure
- Add unit tests for new features

## 🔮 Roadmap

### Phase 1: Core Features ✅
- [x] User authentication and profiles
- [x] Basic post creation and sharing
- [x] Restaurant listings and reviews
- [x] Social following system

### Phase 2: Enhanced Social Features 🚧
- [ ] **Real-time Chat**: Direct messaging between users
- [ ] **Live Streaming**: Live cooking sessions and food tours
- [ ] **Events System**: Food events and meetup organization
- [ ] **Groups & Communities**: Topic-based food communities

### Phase 3: Advanced Features 📋
- [ ] **AI Recommendations**: Machine learning-based food suggestions
- [ ] **AR Menu Scanning**: Augmented reality menu translation
- [ ] **Nutrition Tracking**: Calorie and nutrition information integration
- [ ] **Delivery Integration**: Partner with food delivery services

### Phase 4: Business Features 💼
- [ ] **Restaurant Dashboard**: Business account management
- [ ] **Analytics Platform**: Insights for restaurant owners
- [ ] **Monetization**: Premium features and advertising
- [ ] **API Platform**: Third-party developer integration

## 📊 Performance Metrics

### Current Performance
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 200ms average
- **Image Upload**: < 5 seconds for standard photos
- **Search Results**: < 500ms for restaurant search
- **Mobile Performance**: 90+ Lighthouse score

### Monitoring
- **Error Tracking**: Sentry integration for error monitoring
- **Analytics**: Google Analytics for user behavior tracking
- **Performance**: Lighthouse CI for performance monitoring
- **Uptime**: StatusPage.io for service status tracking

## 🆘 Troubleshooting

### Common Issues

#### 1. **Database Connection Failed**
```bash
# Check MongoDB service
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS

# Verify connection string
echo $MONGODB_URI
```

#### 2. **Image Upload Not Working**
- Verify Cloudinary credentials in `.env`
- Check file size limits (max 10MB)
- Ensure supported formats (JPG, PNG, WebP)

#### 3. **Search Not Working**
- Verify Algolia configuration
- Check API keys and app ID
- Ensure search index is properly set up

#### 4. **Map Not Loading**
- Verify Mapbox access token
- Check network connectivity
- Ensure proper API key permissions

### Performance Issues
```bash
# Analyze bundle size
npm run analyze

# Check for memory leaks
node --inspect server.js

# Profile React components
npm install --save-dev @welldone-software/why-did-you-render
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **🍕 Food Community**: For inspiration and feedback
- **⚛️ React Team**: For the excellent frontend framework
- **🟢 Node.js Community**: For the robust backend ecosystem
- **🍃 MongoDB**: For flexible data storage solutions
- **🎨 Material-UI Team**: For beautiful UI components
- **📍 Mapbox**: For amazing mapping capabilities
- **☁️ Cloudinary**: For seamless image management

## 📞 Contact

**Rachana Sudhakar** - [rachanasudhakar17@gmail.com](mailto:rachanasudhakar17@gmail.com)

- 🌐 **Portfolio**: [https://rachana-portfolio.com](https://rachana-portfolio.com)
- 💼 **LinkedIn**: [https://linkedin.com/in/rachanasudhakar](https://linkedin.com/in/rachanasudhakar)
- 🐱 **GitHub**: [https://github.com/rachana1707-S](https://github.com/rachana1707-S)
- 📱 **Phone**: +1 (617) 602-3398
- 📍 **Location**: Boston, MA, USA

## 🎉 Fun Features

### Easter Eggs
- **🎂 Birthday Notifications**: Special celebrations for user birthdays
- **🏆 Achievement Badges**: Unlock badges for food exploration milestones
- **🌟 Food Streaks**: Track consecutive days of food posting
- **🎯 Weekly Challenges**: Fun food photography and discovery challenges

### Community Features
- **📊 Food Trends**: Discover trending dishes and restaurants
- **🗺️ Food Maps**: Visual representation of your food journey
- **👥 Foodie Meetups**: Organize local food enthusiast gatherings
- **🎓 Cooking Classes**: Virtual and in-person cooking sessions

---

🌟 **Star this repository if you found it delicious!** 🌟

*Built with ❤️ and lots of good food by Rachana Sudhakar*
