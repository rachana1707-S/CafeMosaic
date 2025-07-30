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
            },
            orderBy: { order: 'asc' }
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
        visitedCount: collection.coffeeShops.filter(item => item.isVisited || false).length,
        places: collection.coffeeShops.map(item => ({
          id: item.coffeeShop.id.toString(),
          placeId: item.coffeeShop.placeId,
          name: item.coffeeShop.name,
          address: item.coffeeShop.address,
          phone: item.coffeeShop.phone,
          website: item.coffeeShop.website,
          rating: item.coffeeShop.rating,
          priceLevel: item.coffeeShop.priceLevel,
          category: 'restaurant', // Default since DB doesn't have this field yet
          cuisine: 'International', // Default since DB doesn't have this field yet
          description: item.coffeeShop.description,
          imageUrl: item.coffeeShop.imageUrl,
          latitude: item.coffeeShop.latitude,
          longitude: item.coffeeShop.longitude,
          distance: null,
          notes: item.notes,
          isVisited: false, // Default since DB doesn't have this field yet
          visitedDate: null, // Default since DB doesn't have this field yet
          dateAdded: item.createdAt,
          personalRating: null, // Default since DB doesn't have this field yet
          tags: null, // Default since DB doesn't have this field yet
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
        visitedCount: collection.coffeeShops.filter(item => item.isVisited || false).length,
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
          category: 'restaurant', // Default since DB doesn't have this field yet
          cuisine: 'International', // Default since DB doesn't have this field yet
          description: item.coffeeShop.description,
          imageUrl: item.coffeeShop.imageUrl,
          latitude: item.coffeeShop.latitude,
          longitude: item.coffeeShop.longitude,
          distance: null,
          notes: canEdit ? item.notes : '', // Only show notes to owner
          isVisited: false, // Default since DB doesn't have this field yet
          visitedDate: null, // Default since DB doesn't have this field yet
          dateAdded: item.createdAt,
          personalRating: null, // Default since DB doesn't have this field yet
          tags: null, // Default since DB doesn't have this field yet
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

  // Add a place to a collection (FIXED - removes problematic fields)
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
        category,  // We receive this but don't save to DB yet
        cuisine,   // We receive this but don't save to DB yet
        notes,
        isVisited  // We receive this but don't save to DB yet
      } = req.body;

      console.log('🔄 Adding place to collection:', { collectionId, placeName: name });

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

      console.log('✅ Collection found:', collection.name);

      // Use the provided placeId or id as the unique identifier
      const placeIdentifier = placeId || id?.toString();
      
      if (!placeIdentifier) {
        return res.status(400).json({
          success: false,
          message: 'Place ID is required'
        });
      }

      console.log('🔍 Looking for existing coffee shop with placeId:', placeIdentifier);

      // Find or create the coffee shop/food place
      let coffeeShop = await prisma.coffeeShop.findFirst({
        where: { 
          placeId: placeIdentifier
        }
      });

      if (!coffeeShop) {
        console.log('🆕 Creating new coffee shop entry...');
        
        try {
          // Create with only fields that exist in current DB schema
          coffeeShop = await prisma.coffeeShop.create({
            data: {
              placeId: placeIdentifier,
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
              source: 'FoodPlaceDetails'
              // REMOVED: category and cuisine (don't exist in DB yet)
            }
          });
          
          console.log('✅ Created coffee shop with ID:', coffeeShop.id);
        } catch (createError) {
          console.error('❌ Error creating coffee shop:', createError);
          throw createError;
        }
      } else {
        console.log('📍 Found existing coffee shop:', coffeeShop.name);
        
        // Update existing coffee shop with any new information
        const updateData = {};
        if (name && name.trim() !== coffeeShop.name) updateData.name = name.trim();
        if (address && address !== coffeeShop.address) updateData.address = address;
        if (phone && phone !== coffeeShop.phone) updateData.phone = phone;
        if (website && website !== coffeeShop.website) updateData.website = website;
        if (rating && parseFloat(rating) !== coffeeShop.rating) updateData.rating = parseFloat(rating);
        if (priceLevel && parseInt(priceLevel) !== coffeeShop.priceLevel) updateData.priceLevel = parseInt(priceLevel);
        if (imageUrl && imageUrl !== coffeeShop.imageUrl) updateData.imageUrl = imageUrl;
        if (description && description !== coffeeShop.description) updateData.description = description;
        if (latitude && parseFloat(latitude) !== coffeeShop.latitude) updateData.latitude = parseFloat(latitude);
        if (longitude && parseFloat(longitude) !== coffeeShop.longitude) updateData.longitude = parseFloat(longitude);
        if (openingHours && JSON.stringify(openingHours) !== JSON.stringify(coffeeShop.openingHours)) updateData.openingHours = openingHours;
        if (amenities && JSON.stringify(amenities) !== JSON.stringify(coffeeShop.amenities)) updateData.amenities = amenities;
        // REMOVED: category and cuisine updates (don't exist in DB yet)

        if (Object.keys(updateData).length > 0) {
          console.log('🔄 Updating coffee shop with new data:', Object.keys(updateData));
          try {
            coffeeShop = await prisma.coffeeShop.update({
              where: { id: coffeeShop.id },
              data: updateData
            });
          } catch (updateError) {
            console.error('❌ Error updating coffee shop:', updateError);
            throw updateError;
          }
        }
      }

      console.log('🔍 Checking if place already exists in collection...');
      
      // Check if place is already in collection
      const existingPlace = await prisma.collectionCoffeeShop.findFirst({
        where: {
          collectionId: collection.id,
          coffeeShopId: coffeeShop.id
        }
      });

      if (existingPlace) {
        console.log('⚠️ Place already exists in collection');
        return res.status(409).json({
          success: false,
          message: 'Place already exists in this collection'
        });
      }

      console.log('📊 Getting current maximum order...');
      
      // Get the current maximum order for proper ordering
      const maxOrderResult = await prisma.collectionCoffeeShop.findFirst({
        where: { collectionId: collection.id },
        orderBy: { order: 'desc' },
        select: { order: true }
      });

      const nextOrder = (maxOrderResult?.order || 0) + 1;
      console.log('📝 Next order will be:', nextOrder);

      console.log('💾 Creating collection place entry...');
      
      // Add place to collection with only fields that exist in current DB schema
      let collectionPlace;
      try {
        collectionPlace = await prisma.collectionCoffeeShop.create({
          data: {
            collectionId: collection.id,
            coffeeShopId: coffeeShop.id,
            notes: notes || '',
            order: nextOrder
            // REMOVED: isVisited, visitedDate (don't exist in DB yet)
          }
        });

        console.log('✅ Created collection place entry with ID:', collectionPlace.id);
      } catch (collectionPlaceError) {
        console.error('❌ Error creating collection place entry:', collectionPlaceError);
        throw collectionPlaceError;
      }

      console.log('📊 Updating collection timestamp...');
      
      // Update collection timestamp
      try {
        await prisma.userCollection.update({
          where: { id: collection.id },
          data: {
            updatedAt: new Date()
          }
        });
      } catch (timestampError) {
        console.error('❌ Error updating timestamp (non-critical):', timestampError);
        // Don't throw, it's not critical
      }

      console.log('✅ Successfully added place to collection!');

      res.status(201).json({
        success: true,
        message: 'Place added to collection successfully',
        place: {
          id: coffeeShop.id.toString(),
          placeId: coffeeShop.placeId,
          name: coffeeShop.name,
          address: coffeeShop.address,
          phone: coffeeShop.phone,
          website: coffeeShop.website,
          rating: coffeeShop.rating,
          priceLevel: coffeeShop.priceLevel,
          category: category || 'restaurant', // Return to frontend but not saved to DB
          cuisine: cuisine || 'International', // Return to frontend but not saved to DB
          description: coffeeShop.description,
          imageUrl: coffeeShop.imageUrl,
          latitude: coffeeShop.latitude,
          longitude: coffeeShop.longitude,
          openingHours: coffeeShop.openingHours,
          amenities: coffeeShop.amenities,
          notes: collectionPlace.notes,
          isVisited: isVisited || false, // Return to frontend but not saved to DB
          visitedDate: null,
          dateAdded: collectionPlace.createdAt
        }
      });
    } catch (error) {
      console.error('❌ CRITICAL ERROR in addPlaceToCollection:', error);
      console.error('🔍 Error stack:', error.stack);
      
      res.status(500).json({
        success: false,
        message: 'Error adding place to collection',
        error: error.message
      });
    }
  },

  // Batch add places to multiple collections (FIXED SYNTAX)
  batchAddPlaceToCollections: async (req, res) => {
    try {
      const {
        collectionIds,
        place
      } = req.body;

      if (!collectionIds || !Array.isArray(collectionIds) || collectionIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Collection IDs are required'
        });
      }

      if (!place || !place.name) {
        return res.status(400).json({
          success: false,
          message: 'Place data is required'
        });
      }

      console.log('📦 Batch adding place to', collectionIds.length, 'collections:', place.name);

      const results = [];
      const failures = [];

      for (const collectionId of collectionIds) {
        try {
          // Verify collection belongs to user
          const collection = await prisma.userCollection.findFirst({
            where: { 
              id: parseInt(collectionId),
              userId: req.user.id 
            }
          });

          if (!collection) {
            failures.push({
              collectionId,
              error: 'Collection not found or access denied'
            });
            continue;
          }

          // Use the provided placeId or id as the unique identifier
          const placeIdentifier = place.placeId || place.id?.toString();
          
          if (!placeIdentifier) {
            failures.push({
              collectionId,
              error: 'Place ID is required'
            });
            continue;
          }

          // Find or create the coffee shop/food place
          let coffeeShop = await prisma.coffeeShop.findFirst({
            where: { 
              placeId: placeIdentifier
            }
          });

          if (!coffeeShop) {
            coffeeShop = await prisma.coffeeShop.create({
              data: {
                placeId: placeIdentifier,
                name: place.name.trim(),
                address: place.address || '',
                latitude: parseFloat(place.latitude) || 0,
                longitude: parseFloat(place.longitude) || 0,
                phone: place.phone || null,
                website: place.website || null,
                rating: place.rating ? parseFloat(place.rating) : null,
                priceLevel: place.priceLevel ? parseInt(place.priceLevel) : null,
                imageUrl: place.imageUrl || null,
                description: place.description || null,
                openingHours: place.openingHours || null,
                amenities: place.amenities || null,
                source: 'BatchAdd'
                // REMOVED: category and cuisine (don't exist in DB yet)
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
            results.push({
              collectionId,
              collectionName: collection.name,
              status: 'already_exists',
              message: 'Place already in collection'
            });
            continue;
          }

          // Get the current maximum order for proper ordering
          const maxOrderResult = await prisma.collectionCoffeeShop.findFirst({
            where: { collectionId: collection.id },
            orderBy: { order: 'desc' },
            select: { order: true }
          });

          const nextOrder = (maxOrderResult?.order || 0) + 1;

          // Add place to collection
          await prisma.collectionCoffeeShop.create({
            data: {
              collectionId: collection.id,
              coffeeShopId: coffeeShop.id,
              notes: '',
              order: nextOrder
              // REMOVED: isVisited, visitedDate (don't exist in DB yet)
            }
          });

          // Update collection timestamp
          await prisma.userCollection.update({
            where: { id: collection.id },
            data: {
              updatedAt: new Date()
            }
          });

          results.push({
            collectionId,
            collectionName: collection.name,
            status: 'added',
            message: 'Successfully added to collection'
          });

        } catch (collectionError) {
          console.error(`❌ Error adding to collection ${collectionId}:`, collectionError);
          failures.push({
            collectionId,
            error: collectionError.message
          });
        }
      }

      const successCount = results.filter(r => r.status === 'added').length;
      const alreadyExistsCount = results.filter(r => r.status === 'already_exists').length;

      res.json({
        success: true,
        message: `Place processing complete: ${successCount} added, ${alreadyExistsCount} already existed, ${failures.length} failed`,
        results,
        failures,
        summary: {
          total: collectionIds.length,
          added: successCount,
          alreadyExists: alreadyExistsCount,
          failed: failures.length
        }
      });

    } catch (error) {
      console.error('❌ Error in batch add place to collections:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding place to collections',
        error: error.message
      });
    }
  },

  // Update a place in a collection (notes, visited status, etc.)
  updatePlaceInCollection: async (req, res) => {
    try {
      const collectionId = parseInt(req.params.collectionId);
      const placeId = req.params.placeId;
      const { notes } = req.body; // Only use notes for now

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
      // REMOVED: isVisited, personalRating, tags (don't exist in DB yet)

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
          isVisited: false, // Default
          visitedDate: null, // Default
          personalRating: null, // Default
          tags: null // Default
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
        visitedCount: 0, // Default since DB doesn't have isVisited field yet
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