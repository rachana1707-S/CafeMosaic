-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "preferences" JSONB, -- Store user preferences like preferred unit (km/miles), search radius
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoffeeShop" (
    "id" SERIAL NOT NULL,
    "placeId" TEXT NOT NULL, -- Geoapify place ID
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "imageUrl" TEXT,
    "rating" DOUBLE PRECISION,
    "priceLevel" INTEGER, -- 1-4 price scale
    "openingHours" JSONB, -- Store opening hours as JSON
    "amenities" JSONB, -- WiFi, outdoor seating, drive-thru, etc.
    "description" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "source" TEXT NOT NULL DEFAULT 'Geoapify',
    "isVerified" BOOLEAN NOT NULL DEFAULT false, -- For admin verification
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoffeeShop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "coffeeShopId" INTEGER NOT NULL,
    "notes" TEXT, -- Personal notes about the coffee shop
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "coffeeShopId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL, -- 1-5 stars
    "title" TEXT,
    "comment" TEXT,
    "visitDate" TIMESTAMP(3),
    "isRecommended" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "radius" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL, -- 'km' or 'miles'
    "resultsCount" INTEGER NOT NULL DEFAULT 0,
    "ipAddress" TEXT, -- For anonymous tracking
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoffeeShopVisit" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "coffeeShopId" INTEGER NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "photoUrls" JSONB, -- Array of photo URLs
    "rating" INTEGER, -- Quick rating 1-5
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoffeeShopVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoffeeShopCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT, -- For UI display
    "icon" TEXT, -- Icon name or URL
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoffeeShopCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoffeeShopCategoryMapping" (
    "id" SERIAL NOT NULL,
    "coffeeShopId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoffeeShopCategoryMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCollection" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT, -- For UI theming
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionCoffeeShop" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "coffeeShopId" INTEGER NOT NULL,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionCoffeeShop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CoffeeShop_placeId_key" ON "CoffeeShop"("placeId");

-- CreateIndex
CREATE INDEX "CoffeeShop_latitude_longitude_idx" ON "CoffeeShop"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "CoffeeShop_city_idx" ON "CoffeeShop"("city");

-- CreateIndex
CREATE INDEX "CoffeeShop_rating_idx" ON "CoffeeShop"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavorite_userId_coffeeShopId_key" ON "UserFavorite"("userId", "coffeeShopId");

-- CreateIndex
CREATE UNIQUE INDEX "UserReview_userId_coffeeShopId_key" ON "UserReview"("userId", "coffeeShopId");

-- CreateIndex
CREATE INDEX "SearchHistory_userId_idx" ON "SearchHistory"("userId");

-- CreateIndex
CREATE INDEX "SearchHistory_createdAt_idx" ON "SearchHistory"("createdAt");

-- CreateIndex
CREATE INDEX "CoffeeShopVisit_userId_idx" ON "CoffeeShopVisit"("userId");

-- CreateIndex
CREATE INDEX "CoffeeShopVisit_coffeeShopId_idx" ON "CoffeeShopVisit"("coffeeShopId");

-- CreateIndex
CREATE UNIQUE INDEX "CoffeeShopCategory_name_key" ON "CoffeeShopCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CoffeeShopCategoryMapping_coffeeShopId_categoryId_key" ON "CoffeeShopCategoryMapping"("coffeeShopId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionCoffeeShop_collectionId_coffeeShopId_key" ON "CollectionCoffeeShop"("collectionId", "coffeeShopId");

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_coffeeShopId_fkey" FOREIGN KEY ("coffeeShopId") REFERENCES "CoffeeShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReview" ADD CONSTRAINT "UserReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReview" ADD CONSTRAINT "UserReview_coffeeShopId_fkey" FOREIGN KEY ("coffeeShopId") REFERENCES "CoffeeShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchHistory" ADD CONSTRAINT "SearchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoffeeShopVisit" ADD CONSTRAINT "CoffeeShopVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoffeeShopVisit" ADD CONSTRAINT "CoffeeShopVisit_coffeeShopId_fkey" FOREIGN KEY ("coffeeShopId") REFERENCES "CoffeeShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoffeeShopCategoryMapping" ADD CONSTRAINT "CoffeeShopCategoryMapping_coffeeShopId_fkey" FOREIGN KEY ("coffeeShopId") REFERENCES "CoffeeShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoffeeShopCategoryMapping" ADD CONSTRAINT "CoffeeShopCategoryMapping_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CoffeeShopCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCollection" ADD CONSTRAINT "UserCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionCoffeeShop" ADD CONSTRAINT "CollectionCoffeeShop_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "UserCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionCoffeeShop" ADD CONSTRAINT "CollectionCoffeeShop_coffeeShopId_fkey" FOREIGN KEY ("coffeeShopId") REFERENCES "CoffeeShop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert default categories
INSERT INTO "CoffeeShopCategory" ("name", "description", "color", "icon") VALUES
('Cafe', 'Traditional coffee shops and cafes', '#8B4513', 'coffee'),
('Chain', 'Popular coffee chains like Starbucks, Dunkin', '#4A90E2', 'store'),
('Local Roaster', 'Independent local coffee roasters', '#E67E22', 'coffee-bean'),
('Drive-Thru', 'Coffee shops with drive-thru service', '#27AE60', 'car'),
('Coworking Friendly', 'Great for working with WiFi and outlets', '#9B59B6', 'wifi'),
('Specialty', 'Specialty coffee, third-wave coffee', '#E74C3C', 'star'),
('Bakery Cafe', 'Coffee shops with fresh baked goods', '#F39C12', 'bread-slice');


-- ========================================
-- COMPLETE DATABASE MIGRATION
-- Add all missing fields for full collection functionality
-- ========================================

-- 1. Add missing fields to CoffeeShop table
ALTER TABLE "CoffeeShop" 
ADD COLUMN IF NOT EXISTS "category" TEXT,
ADD COLUMN IF NOT EXISTS "cuisine" TEXT;

-- Set default values for existing records
UPDATE "CoffeeShop" SET "category" = 'restaurant' WHERE "category" IS NULL;
UPDATE "CoffeeShop" SET "cuisine" = 'International' WHERE "cuisine" IS NULL;

-- 2. Add ALL missing fields to CollectionCoffeeShop table
ALTER TABLE "CollectionCoffeeShop" 
ADD COLUMN IF NOT EXISTS "isVisited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "visitedDate" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "personalRating" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "tags" JSONB,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing records to have updatedAt = createdAt
UPDATE "CollectionCoffeeShop" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;

-- 3. Add more food categories to support restaurants, bars, etc.
INSERT INTO "CoffeeShopCategory" ("name", "description", "color", "icon") VALUES
('Restaurant', 'Full-service restaurants', '#FF6B6B', 'utensils'),
('Fast Food', 'Quick service restaurants', '#4ECDC4', 'zap'),
('Bar', 'Bars and pubs serving drinks', '#45B7D1', 'wine'),
('Ice Cream', 'Ice cream shops and gelaterias', '#96CEB4', 'ice-cream'),
('Food Court', 'Food courts and markets', '#FFEAA7', 'shopping-cart'),
('Biergarten', 'Beer gardens and outdoor dining', '#DDA0DD', 'beer'),
('Taproom', 'Craft beer taprooms', '#98D8C8', 'beer-tap'),
('Brunch Spot', 'Great places for brunch', '#F7DC6F', 'sun'),
('Late Night', 'Open late for night owls', '#BB8FCE', 'moon'),
('Family Friendly', 'Great for families with kids', '#85C1E9', 'users')
ON CONFLICT (name) DO NOTHING;

-- 4. Create indexes for better performance on new fields
CREATE INDEX IF NOT EXISTS "CoffeeShop_category_idx" ON "CoffeeShop"("category");
CREATE INDEX IF NOT EXISTS "CoffeeShop_cuisine_idx" ON "CoffeeShop"("cuisine");
CREATE INDEX IF NOT EXISTS "CollectionCoffeeShop_isVisited_idx" ON "CollectionCoffeeShop"("isVisited");
CREATE INDEX IF NOT EXISTS "CollectionCoffeeShop_visitedDate_idx" ON "CollectionCoffeeShop"("visitedDate");
CREATE INDEX IF NOT EXISTS "CollectionCoffeeShop_updatedAt_idx" ON "CollectionCoffeeShop"("updatedAt");

-- 5. Verify all changes were applied correctly
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('CoffeeShop', 'CollectionCoffeeShop')
AND column_name IN ('category', 'cuisine', 'isVisited', 'visitedDate', 'personalRating', 'tags', 'updatedAt')
ORDER BY table_name, column_name;

-- 6. Show table structures to confirm everything is correct
\echo 'CoffeeShop table structure:'
\d "CoffeeShop"

\echo 'CollectionCoffeeShop table structure:'
\d "CollectionCoffeeShop"

\echo 'Available categories:'
SELECT name, description, color FROM "CoffeeShopCategory" ORDER BY name;

-- Run these commands one by one in your database

-- Add category field to CoffeeShop
ALTER TABLE "CoffeeShop" ADD COLUMN "category" TEXT;

-- Add cuisine field to CoffeeShop
ALTER TABLE "CoffeeShop" ADD COLUMN "cuisine" TEXT;

-- Add isVisited field to CollectionCoffeeShop
ALTER TABLE "CollectionCoffeeShop" ADD COLUMN "isVisited" BOOLEAN NOT NULL DEFAULT false;

-- Add visitedDate field to CollectionCoffeeShop
ALTER TABLE "CollectionCoffeeShop" ADD COLUMN "visitedDate" TIMESTAMP(3);

-- Add personalRating field to CollectionCoffeeShop
ALTER TABLE "CollectionCoffeeShop" ADD COLUMN "personalRating" DOUBLE PRECISION;

-- Add tags field to CollectionCoffeeShop
ALTER TABLE "CollectionCoffeeShop" ADD COLUMN "tags" JSONB;

-- Add updatedAt field to CollectionCoffeeShop
ALTER TABLE "CollectionCoffeeShop" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Set defaults for existing records
UPDATE "CoffeeShop" SET "category" = 'restaurant' WHERE "category" IS NULL;
UPDATE "CoffeeShop" SET "cuisine" = 'International' WHERE "cuisine" IS NULL;
UPDATE "CollectionCoffeeShop" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;