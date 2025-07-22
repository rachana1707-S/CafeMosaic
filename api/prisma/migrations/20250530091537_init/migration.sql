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