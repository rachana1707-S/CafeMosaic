// controllers/collectionsController.js
import prisma from '../config/db.js';
import { validationResult } from 'express-validator';

const collectionsController = {
  // Get all collections for the authenticated user
  getUserCollections: async (req, res) => {
    try {
      const collections = await prisma.userCollection.findMany({
        where: { userId: req.user.id },
        include: {
          coffeeShops: {
            include: {
              coffeeShop: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Transform data to match frontend expectations
      const transformedCollections = collections.map(collection => ({
        id: collection.id.toString(),
        name: collection.name,
        description: collection.description,
        color: collection.color || '#FFD700',
        isPublic: collection.isPublic,
        dateCreated: collection.createdAt,
        dateModified: collection.updatedAt,
        placesCount: collection.coffeeShops.length,
        visitedCount: collection.coffeeShops.filter(item => item.isVisited).length,
        places: collection.coffeeShops.map(item => ({
          id: item.coffeeShop.id.toString(),
          placeId: item.coffeeShop.placeId,
          name: item.coffeeShop.name,
          address: item.coffeeShop.address,
          phone: item.coffeeShop.phone,
          website: item.coffeeShop.website,
          rating: item.coffeeShop.rating,
          priceLevel: item.coffeeShop.priceLevel,
          category: 'coffee_shop',
          cuisine: 'Coffee & Tea',
          description: item.coffeeShop.description,
          imageUrl: item.coffeeShop.imageUrl,
          latitude: item.coffeeShop.latitude,
          longitude: item.coffeeShop.longitude,
          distance: null,
          notes: item.notes,
          isVisited: item.isVisited || false,
          visitedDate: item.visitedDate,
          dateAdded: item.createdAt,
          personalRating: item.personalRating,
          tags: item.tags,
          openingHours: item.coffeeShop.openingHours,
          amenities: item.coffeeShop.amenities
        }))
      }));

      res.json({
        success: true,
        collections: transformedCollections
      });
    } catch (error) {
      console.error('Error fetching collections:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching collections',
        error: error.message
      });
    }
  },

  // Get a specific collection by ID
  getCollectionById: async (req, res) => {
    try {
      const collectionId = parseInt(req.params.collectionId);

      const collection = await prisma.userCollection.findFirst({
        where: { 
          id: collectionId,
          OR: [
            { userId: req.user.id }, // User owns the collection
            { isPublic: true }       // Or it's public
          ]
        },
        include: {
          coffeeShops: {
            include: {
              coffeeShop: true
            },
            orderBy: { order: 'asc' }
          },
          user: {
            select: {
              id: true,
              username: true,
              name: true
            }
          }
        }
      });

      if (!collection) {
        return res.status(404).json({
          success: false,
          message: 'Collection not found or access denied'
        });
      }

      // Check if user can edit (only owner can edit)
      const canEdit = req.user && collection.userId === req.user.id;

      // Transform data
      const transformedCollection = {
        id: collection.id.toString(),
        name: collection.name,
        description: collection.description,
        color: collection.color || '#FFD700',
        isPublic: collection.isPublic,
        dateCreated: collection.createdAt,
        dateModified: collection.updatedAt,
        placesCount: collection.coffeeShops.length,
        visitedCount: collection.coffeeShops.filter(item => item.isVisited).length,
        canEdit: canEdit,
        creator: {
          username: collection.user.username,
          name: collection.user.name
        },
        places: collection.coffeeShops.map(item => ({
          id: item.coffeeShop.id.toString(),
          placeId: item.coffeeShop.placeId,
          name: item.coffeeShop.name,
          address: item.coffeeShop.address,
          phone: item.coffeeShop.phone,
          website: item.coffeeShop.website,
          rating: item.coffeeShop.rating,
          priceLevel: item.coffeeShop.priceLevel,
          category: 'coffee_shop',
          cuisine: 'Coffee & Tea',
          description: item.coffeeShop.description,
          imageUrl: item.coffeeShop.imageUrl,
          latitude: item.coffeeShop.latitude,
          longitude: item.coffeeShop.longitude,
          distance: null,
          notes: canEdit ? item.notes : '', // Only show notes to owner
          isVisited: canEdit ? (item.isVisited || false) : false,
          visitedDate: canEdit ? item.visitedDate : null,
          dateAdded: item.createdAt,
          personalRating: canEdit ? item.personalRating : null,
          tags: canEdit ? item.tags : null,
          openingHours: item.coffeeShop.openingHours,
          amenities: item.coffeeShop.amenities
        }))
      };

      res.json({
        success: true,
        collection: transformedCollection
      });
    } catch (error) {
      console.error('Error fetching collection:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching collection',
        error: error.message
      });
    }
  },

  // Create a new collection
  createCollection: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, description, color, isPublic } = req.body;

      const collection = await prisma.userCollection.create({
        data: {
          name: name.trim(),
          description: description?.trim() || null,
          color: color || '#FFD700',
          isPublic: isPublic || false,
          userId: req.user.id
        }
      });

      res.status(201).json({
        success: true,
        message: 'Collection created successfully',
        collection: {
          id: collection.id.toString(),
          name: collection.name,
          description: collection.description,
          color: collection.color,
          isPublic: collection.isPublic,
          dateCreated: collection.createdAt,
          dateModified: collection.updatedAt,
          placesCount: 0,
          visitedCount: 0,
          places: []
        }
      });
    } catch (error) {
      console.error('Error creating collection:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating collection',
        error: error.message
      });
    }
  },

  // Update a collection
  updateCollection: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const collectionId = parseInt(req.params.collectionId);
      const { name, description, color, isPublic } = req.body;

      // Check if collection exists and belongs to user
      const existingCollection = await prisma.userCollection.findFirst({
        where: { 
          id: collectionId,
          userId: req.user.id 
        }
      });

      if (!existingCollection) {
        return res.status(404).json({
          success: false,
          message: 'Collection not found or access denied'
        });
      }

      const updateData = {};
      if (name !== undefined) updateData.name = name.trim();
      if (description !== undefined) updateData.description = description?.trim() || null;
      if (color !== undefined) updateData.color = color;
      if (isPublic !== undefined) updateData.isPublic = isPublic;

      const collection = await prisma.userCollection.update({
        where: { id: collectionId },
        data: updateData
      });

      res.json({
        success: true,
        message: 'Collection updated successfully',
        collection: {
          id: collection.id.toString(),
          name: collection.name,
          description: collection.description,
          color: collection.color,
          isPublic: collection.isPublic,
          dateCreated: collection.createdAt,
          dateModified: collection.updatedAt
        }
      });
    } catch (error) {
      console.error('Error updating collection:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating collection',
        error: error.message
      });
    }
  },

  // Delete a collection
  deleteCollection: async (req, res) => {
    try {
      const collectionId = parseInt(req.params.collectionId);

      // Check if collection exists and belongs to user
      const existingCollection = await prisma.userCollection.findFirst({
        where: { 
          id: collectionId,
          userId: req.user.id 
        }
      });

      if (!existingCollection) {
        return res.status(404).json({
          success: false,
          message: 'Collection not found or access denied'
        });
      }

      // Delete the collection (cascade will handle CollectionCoffeeShop records)
      await prisma.userCollection.delete({
        where: { id: collectionId }
      });

      res.json({
        success: true,
        message: 'Collection deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting collection:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting collection',
        error: error.message
      });
    }
  },

  // Add a place to a collection
  addPlaceToCollection: async (req, res) => {
    try {
      const collectionId = parseInt(req.params.collectionId);
      const { 
        id, 
        placeId, 
        name, 
        address, 
        phone, 
        website, 
        rating, 
        priceLevel, 
        latitude, 
        longitude,
        imageUrl,
        description,
        openingHours,
        amenities,
        notes,
        isVisited
      } = req.body;

      // Verify collection belongs to user
      const collection = await prisma.userCollection.findFirst({
        where: { 
          id: collectionId,
          userId: req.user.id 
        }
      });

      if (!collection) {
        return res.status(404).json({
          success: false,
          message: 'Collection not found or access denied'
        });
      }

      // Find or create the coffee shop
      let coffeeShop = await prisma.coffeeShop.findFirst({
        where: { 
          placeId: placeId || id?.toString()
        }
      });

      if (!coffeeShop) {
        coffeeShop = await prisma.coffeeShop.create({
          data: {
            placeId: placeId || id?.toString(),
            name: name.trim(),
            address: address || '',
            latitude: parseFloat(latitude) || 0,
            longitude: parseFloat(longitude) || 0,
            phone: phone || null,
            website: website || null,
            rating: rating ? parseFloat(rating) : null,
            priceLevel: priceLevel ? parseInt(priceLevel) : null,
            imageUrl: imageUrl || null,
            description: description || null,
            openingHours: openingHours || null,
            amenities: amenities || null,
            source: 'Manual'
          }
        });
      }

      // Check if place is already in collection
      const existingPlace = await prisma.collectionCoffeeShop.findFirst({
        where: {
          collectionId: collection.id,
          coffeeShopId: coffeeShop.id
        }
      });

      if (existingPlace) {
        return res.status(400).json({
          success: false,
          message: 'Place already exists in this collection'
        });
      }

      // Add place to collection
      const collectionPlace = await prisma.collectionCoffeeShop.create({
        data: {
          collectionId: collection.id,
          coffeeShopId: coffeeShop.id,
          notes: notes || '',
          isVisited: isVisited || false,
          visitedDate: isVisited ? new Date() : null,
          order: 0
        }
      });

      res.status(201).json({
        success: true,
        message: 'Place added to collection successfully',
        place: {
          id: coffeeShop.id.toString(),
          placeId: coffeeShop.placeId,
          name: coffeeShop.name,
          address: coffeeShop.address,
          notes: collectionPlace.notes,
          isVisited: collectionPlace.isVisited,
          visitedDate: collectionPlace.visitedDate,
          dateAdded: collectionPlace.createdAt
        }
      });
    } catch (error) {
      console.error('Error adding place to collection:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding place to collection',
        error: error.message
      });
    }
  },

  // Update a place in a collection (notes, visited status, etc.)
  updatePlaceInCollection: async (req, res) => {
    try {
      const collectionId = parseInt(req.params.collectionId);
      const placeId = req.params.placeId;
      const { notes, isVisited, personalRating, tags } = req.body;

      // Verify collection belongs to user
      const collection = await prisma.userCollection.findFirst({
        where: { 
          id: collectionId,
          userId: req.user.id 
        }
      });

      if (!collection) {
        return res.status(404).json({
          success: false,
          message: 'Collection not found or access denied'
        });
      }

      // Find the coffee shop
      const coffeeShop = await prisma.coffeeShop.findFirst({
        where: { 
          OR: [
            { id: parseInt(placeId) || 0 },
            { placeId: placeId }
          ]
        }
      });

      if (!coffeeShop) {
        return res.status(404).json({
          success: false,
          message: 'Coffee shop not found'
        });
      }

      // Find and update the collection place
      const collectionPlace = await prisma.collectionCoffeeShop.findFirst({
        where: {
          collectionId: collection.id,
          coffeeShopId: coffeeShop.id
        }
      });

      if (!collectionPlace) {
        return res.status(404).json({
          success: false,
          message: 'Place not found in collection'
        });
      }

      const updateData = {};
      if (notes !== undefined) updateData.notes = notes;
      if (isVisited !== undefined) {
        updateData.isVisited = isVisited;
        updateData.visitedDate = isVisited ? new Date() : null;
      }
      if (personalRating !== undefined) updateData.personalRating = personalRating;
      if (tags !== undefined) updateData.tags = tags;

      const updatedPlace = await prisma.collectionCoffeeShop.update({
        where: { id: collectionPlace.id },
        data: updateData
      });

      res.json({
        success: true,
        message: 'Place updated successfully',
        place: {
          id: coffeeShop.id.toString(),
          placeId: coffeeShop.placeId,
          name: coffeeShop.name,
          notes: updatedPlace.notes,
          isVisited: updatedPlace.isVisited,
          visitedDate: updatedPlace.visitedDate,
          personalRating: updatedPlace.personalRating,
          tags: updatedPlace.tags
        }
      });
    } catch (error) {
      console.error('Error updating place in collection:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating place in collection',
        error: error.message
      });
    }
  },

  // Remove a place from a collection
  removePlaceFromCollection: async (req, res) => {
    try {
      const collectionId = parseInt(req.params.collectionId);
      const placeId = req.params.placeId;

      // Verify collection belongs to user
      const collection = await prisma.userCollection.findFirst({
        where: { 
          id: collectionId,
          userId: req.user.id 
        }
      });

      if (!collection) {
        return res.status(404).json({
          success: false,
          message: 'Collection not found or access denied'
        });
      }

      // Find the coffee shop
      const coffeeShop = await prisma.coffeeShop.findFirst({
        where: { 
          OR: [
            { id: parseInt(placeId) || 0 },
            { placeId: placeId }
          ]
        }
      });

      if (!coffeeShop) {
        return res.status(404).json({
          success: false,
          message: 'Coffee shop not found'
        });
      }

      // Remove from collection
      const deletedPlace = await prisma.collectionCoffeeShop.deleteMany({
        where: {
          collectionId: collection.id,
          coffeeShopId: coffeeShop.id
        }
      });

      if (deletedPlace.count === 0) {
        return res.status(404).json({
          success: false,
          message: 'Place not found in collection'
        });
      }

      res.json({
        success: true,
        message: 'Place removed from collection successfully'
      });
    } catch (error) {
      console.error('Error removing place from collection:', error);
      res.status(500).json({
        success: false,
        message: 'Error removing place from collection',
        error: error.message
      });
    }
  },

  // Get public collections (for discovery)
  getPublicCollections: async (req, res) => {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const whereClause = { isPublic: true };
      if (search) {
        whereClause.name = { contains: search, mode: 'insensitive' };
      }

      const [collections, totalCount] = await Promise.all([
        prisma.userCollection.findMany({
          where: whereClause,
          include: {
            coffeeShops: {
              include: {
                coffeeShop: true
              }
            },
            user: {
              select: {
                id: true,
                username: true,
                name: true
              }
            }
          },
          take: parseInt(limit),
          skip: offset,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.userCollection.count({ where: whereClause })
      ]);

      const transformedCollections = collections.map(collection => ({
        id: collection.id.toString(),
        name: collection.name,
        description: collection.description,
        color: collection.color || '#FFD700',
        placesCount: collection.coffeeShops.length,
        visitedCount: collection.coffeeShops.filter(item => item.isVisited).length,
        dateCreated: collection.createdAt,
        creator: {
          username: collection.user.username,
          name: collection.user.name
        }
      }));

      res.json({
        success: true,
        collections: transformedCollections,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / parseInt(limit)),
          totalCollections: totalCount,
          hasNext: offset + parseInt(limit) < totalCount,
          hasPrev: parseInt(page) > 1
        }
      });
    } catch (error) {
      console.error('Error fetching public collections:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching public collections',
        error: error.message
      });
    }
  }
};

export default collectionsController;