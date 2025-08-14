// import prisma from '../config/db.js';

// // Simple validation helper
// const validateVisitData = (data) => {
//   const errors = [];
  
//   if (!data.coffeeShopId || !Number.isInteger(Number(data.coffeeShopId))) {
//     errors.push({ field: 'coffeeShopId', message: 'Valid coffee shop ID is required' });
//   }
  
//   if (data.rating && (data.rating < 1 || data.rating > 5)) {
//     errors.push({ field: 'rating', message: 'Rating must be between 1 and 5' });
//   }
  
//   if (data.notes && data.notes.length > 500) {
//     errors.push({ field: 'notes', message: 'Notes must be less than 500 characters' });
//   }
  
//   return { isValid: errors.length === 0, errors };
// };

// // Get user's visits (food journey)
// const getUserVisits = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { page = 1, limit = 20, sortBy = 'recent' } = req.query;
//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     // Build orderBy clause
//     let orderBy = {};
//     switch (sortBy) {
//       case 'recent':
//         orderBy = { visitDate: 'desc' };
//         break;
//       case 'oldest':
//         orderBy = { visitDate: 'asc' };
//         break;
//       case 'name':
//         orderBy = { coffeeShop: { name: 'asc' } };
//         break;
//       case 'rating':
//         orderBy = { rating: 'desc' };
//         break;
//       default:
//         orderBy = { visitDate: 'desc' };
//     }

//     const visits = await prisma.coffeeShopVisit.findMany({
//       where: {
//         userId: userId
//       },
//       include: {
//         coffeeShop: {
//           select: {
//             id: true,
//             name: true,
//             address: true,
//             imageUrl: true,
//             rating: true,
//             priceLevel: true,
//             city: true,
//             state: true,
//             categories: {
//               include: {
//                 category: true
//               }
//             }
//           }
//         }
//       },
//       orderBy,
//       skip,
//       take: parseInt(limit)
//     });

//     // Transform the data
//     const transformedVisits = visits.map(visit => ({
//       id: visit.id,
//       visitDate: visit.visitDate,
//       notes: visit.notes,
//       rating: visit.rating,
//       photoUrls: visit.photoUrls,
//       createdAt: visit.createdAt,
//       coffeeShopId: visit.coffeeShopId,
//       coffeeShop: {
//         id: visit.coffeeShop.id,
//         name: visit.coffeeShop.name,
//         address: visit.coffeeShop.address,
//         imageUrl: visit.coffeeShop.imageUrl,
//         rating: visit.coffeeShop.rating,
//         priceLevel: visit.coffeeShop.priceLevel,
//         city: visit.coffeeShop.city,
//         state: visit.coffeeShop.state,
//         category: visit.coffeeShop.categories[0]?.category?.name || 'catering.restaurant'
//       }
//     }));

//     // Get total count
//     const totalVisits = await prisma.coffeeShopVisit.count({
//       where: { userId: userId }
//     });

//     res.json({
//       visits: transformedVisits,
//       pagination: {
//         currentPage: parseInt(page),
//         totalPages: Math.ceil(totalVisits / parseInt(limit)),
//         totalVisits,
//         hasNext: skip + transformedVisits.length < totalVisits,
//         hasPrev: parseInt(page) > 1
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching user visits:', error);
//     res.status(500).json({ 
//       message: 'Failed to fetch your food journey',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Create a new visit
// const createVisit = async (req, res) => {
//   try {
//     const userId = req.user.id;
    
//     // Validate input
//     const validation = validateVisitData(req.body);
//     if (!validation.isValid) {
//       return res.status(400).json({ 
//         message: 'Invalid input data',
//         errors: validation.errors
//       });
//     }

//     const { coffeeShopId, visitDate, notes, rating, photoUrls } = req.body;

//     // Check if coffee shop exists
//     const coffeeShop = await prisma.coffeeShop.findUnique({
//       where: { id: parseInt(coffeeShopId) }
//     });

//     if (!coffeeShop) {
//       return res.status(404).json({ message: 'Coffee shop not found' });
//     }

//     // Create the visit
//     const visit = await prisma.coffeeShopVisit.create({
//       data: {
//         userId,
//         coffeeShopId: parseInt(coffeeShopId),
//         visitDate: visitDate ? new Date(visitDate) : new Date(),
//         notes: notes || null,
//         rating: rating ? parseInt(rating) : null,
//         photoUrls: photoUrls || null
//       },
//       include: {
//         coffeeShop: {
//           select: {
//             id: true,
//             name: true,
//             address: true,
//             imageUrl: true,
//             rating: true,
//             priceLevel: true
//           }
//         }
//       }
//     });

//     // Transform response
//     const transformedVisit = {
//       id: visit.id,
//       visitDate: visit.visitDate,
//       notes: visit.notes,
//       rating: visit.rating,
//       photoUrls: visit.photoUrls,
//       createdAt: visit.createdAt,
//       coffeeShopId: visit.coffeeShopId,
//       coffeeShop: visit.coffeeShop
//     };

//     res.status(201).json({
//       message: 'Visit recorded successfully',
//       visit: transformedVisit
//     });

//   } catch (error) {
//     console.error('Error creating visit:', error);
//     res.status(500).json({ 
//       message: 'Failed to record visit',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Update a visit
// const updateVisit = async (req, res) => {
//   try {
//     const { visitId } = req.params;
//     const userId = req.user.id;
    
//     // Check if visit exists and belongs to user
//     const existingVisit = await prisma.coffeeShopVisit.findFirst({
//       where: {
//         id: parseInt(visitId),
//         userId: userId
//       }
//     });

//     if (!existingVisit) {
//       return res.status(404).json({ message: 'Visit not found or you do not have permission to update it' });
//     }

//     const { visitDate, notes, rating, photoUrls } = req.body;

//     // Prepare update data
//     const updateData = {};
//     if (visitDate !== undefined) updateData.visitDate = new Date(visitDate);
//     if (notes !== undefined) updateData.notes = notes;
//     if (rating !== undefined) updateData.rating = rating ? parseInt(rating) : null;
//     if (photoUrls !== undefined) updateData.photoUrls = photoUrls;

//     // Update the visit
//     const updatedVisit = await prisma.coffeeShopVisit.update({
//       where: { id: parseInt(visitId) },
//       data: updateData,
//       include: {
//         coffeeShop: {
//           select: {
//             id: true,
//             name: true,
//             address: true,
//             imageUrl: true,
//             rating: true,
//             priceLevel: true
//           }
//         }
//       }
//     });

//     // Transform response
//     const transformedVisit = {
//       id: updatedVisit.id,
//       visitDate: updatedVisit.visitDate,
//       notes: updatedVisit.notes,
//       rating: updatedVisit.rating,
//       photoUrls: updatedVisit.photoUrls,
//       createdAt: updatedVisit.createdAt,
//       coffeeShopId: updatedVisit.coffeeShopId,
//       coffeeShop: updatedVisit.coffeeShop
//     };

//     res.json({
//       message: 'Visit updated successfully',
//       visit: transformedVisit
//     });

//   } catch (error) {
//     console.error('Error updating visit:', error);
//     res.status(500).json({ 
//       message: 'Failed to update visit',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Delete a visit
// const deleteVisit = async (req, res) => {
//   try {
//     const { visitId } = req.params;
//     const userId = req.user.id;

//     // Check if visit exists and belongs to user
//     const existingVisit = await prisma.coffeeShopVisit.findFirst({
//       where: {
//         id: parseInt(visitId),
//         userId: userId
//       }
//     });

//     if (!existingVisit) {
//       return res.status(404).json({ message: 'Visit not found or you do not have permission to delete it' });
//     }

//     // Delete the visit
//     await prisma.coffeeShopVisit.delete({
//       where: { id: parseInt(visitId) }
//     });

//     res.json({ message: 'Visit removed from your journey successfully' });

//   } catch (error) {
//     console.error('Error deleting visit:', error);
//     res.status(500).json({ 
//       message: 'Failed to remove visit',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Get a single visit
// const getVisit = async (req, res) => {
//   try {
//     const { visitId } = req.params;
//     const userId = req.user.id;

//     const visit = await prisma.coffeeShopVisit.findFirst({
//       where: {
//         id: parseInt(visitId),
//         userId: userId
//       },
//       include: {
//         coffeeShop: {
//           select: {
//             id: true,
//             name: true,
//             address: true,
//             imageUrl: true,
//             rating: true,
//             priceLevel: true,
//             city: true,
//             state: true,
//             categories: {
//               include: {
//                 category: true
//               }
//             }
//           }
//         }
//       }
//     });

//     if (!visit) {
//       return res.status(404).json({ message: 'Visit not found' });
//     }

//     // Transform response
//     const transformedVisit = {
//       id: visit.id,
//       visitDate: visit.visitDate,
//       notes: visit.notes,
//       rating: visit.rating,
//       photoUrls: visit.photoUrls,
//       createdAt: visit.createdAt,
//       coffeeShopId: visit.coffeeShopId,
//       coffeeShop: {
//         id: visit.coffeeShop.id,
//         name: visit.coffeeShop.name,
//         address: visit.coffeeShop.address,
//         imageUrl: visit.coffeeShop.imageUrl,
//         rating: visit.coffeeShop.rating,
//         priceLevel: visit.coffeeShop.priceLevel,
//         city: visit.coffeeShop.city,
//         state: visit.coffeeShop.state,
//         category: visit.coffeeShop.categories[0]?.category?.name || 'catering.restaurant'
//       }
//     };

//     res.json(transformedVisit);

//   } catch (error) {
//     console.error('Error fetching visit:', error);
//     res.status(500).json({ 
//       message: 'Failed to fetch visit',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Mark a place as visited (from collections)
// const markPlaceVisited = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { coffeeShopId, visitDate, notes, rating } = req.body;
    
//     if (!coffeeShopId) {
//       return res.status(400).json({ message: 'Coffee shop ID is required' });
//     }

//     // Check if coffee shop exists
//     const coffeeShop = await prisma.coffeeShop.findUnique({
//       where: { id: parseInt(coffeeShopId) }
//     });

//     if (!coffeeShop) {
//       return res.status(404).json({ message: 'Coffee shop not found' });
//     }

//     // Check if visit already exists
//     const existingVisit = await prisma.coffeeShopVisit.findFirst({
//       where: {
//         userId: userId,
//         coffeeShopId: parseInt(coffeeShopId)
//       }
//     });

//     if (existingVisit) {
//       // Update existing visit
//       const updatedVisit = await prisma.coffeeShopVisit.update({
//         where: { id: existingVisit.id },
//         data: {
//           visitDate: visitDate ? new Date(visitDate) : new Date(),
//           notes: notes || existingVisit.notes,
//           rating: rating ? parseInt(rating) : existingVisit.rating
//         },
//         include: {
//           coffeeShop: {
//             select: {
//               id: true,
//               name: true,
//               address: true,
//               imageUrl: true,
//               rating: true
//             }
//           }
//         }
//       });

//       return res.json({
//         message: 'Visit updated successfully',
//         visit: updatedVisit,
//         isNew: false
//       });
//     } else {
//       // Create new visit
//       const newVisit = await prisma.coffeeShopVisit.create({
//         data: {
//           userId,
//           coffeeShopId: parseInt(coffeeShopId),
//           visitDate: visitDate ? new Date(visitDate) : new Date(),
//           notes: notes || null,
//           rating: rating ? parseInt(rating) : null
//         },
//         include: {
//           coffeeShop: {
//             select: {
//               id: true,
//               name: true,
//               address: true,
//               imageUrl: true,
//               rating: true
//             }
//           }
//         }
//       });

//       return res.status(201).json({
//         message: 'Visit recorded successfully',
//         visit: newVisit,
//         isNew: true
//       });
//     }

//   } catch (error) {
//     console.error('Error marking place as visited:', error);
//     res.status(500).json({ 
//       message: 'Failed to mark place as visited',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Unmark a place as visited
// const unmarkPlaceVisited = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { coffeeShopId } = req.body;
    
//     if (!coffeeShopId) {
//       return res.status(400).json({ message: 'Coffee shop ID is required' });
//     }

//     // Find and delete the visit
//     const existingVisit = await prisma.coffeeShopVisit.findFirst({
//       where: {
//         userId: userId,
//         coffeeShopId: parseInt(coffeeShopId)
//       }
//     });

//     if (!existingVisit) {
//       return res.status(404).json({ message: 'Visit not found' });
//     }

//     await prisma.coffeeShopVisit.delete({
//       where: { id: existingVisit.id }
//     });

//     res.json({ 
//       message: 'Place unmarked as visited successfully',
//       visitId: existingVisit.id
//     });

//   } catch (error) {
//     console.error('Error unmarking place as visited:', error);
//     res.status(500).json({ 
//       message: 'Failed to unmark place as visited',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Get visit statistics
// const getVisitStatistics = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Get total visits count
//     const totalVisits = await prisma.coffeeShopVisit.count({
//       where: { userId }
//     });

//     // Get visits with ratings
//     const ratedVisits = await prisma.coffeeShopVisit.findMany({
//       where: { 
//         userId,
//         rating: { not: null }
//       },
//       select: { rating: true }
//     });

//     // Get unique months with visits
//     const visitsWithDates = await prisma.coffeeShopVisit.findMany({
//       where: { userId },
//       select: { visitDate: true }
//     });

//     const uniqueMonths = new Set(
//       visitsWithDates.map(v => 
//         new Date(v.visitDate).toISOString().slice(0, 7) // YYYY-MM format
//       )
//     );

//     // Get highly rated visits (4+ stars)
//     const highlyRatedCount = ratedVisits.filter(v => v.rating >= 4).length;

//     // Calculate average rating
//     const avgRating = ratedVisits.length > 0 
//       ? (ratedVisits.reduce((sum, v) => sum + v.rating, 0) / ratedVisits.length).toFixed(1)
//       : null;

//     res.json({
//       totalVisits,
//       ratedVisits: ratedVisits.length,
//       averageRating: avgRating,
//       activeMonths: uniqueMonths.size,
//       highlyRatedCount
//     });

//   } catch (error) {
//     console.error('Error fetching visit statistics:', error);
//     res.status(500).json({ 
//       message: 'Failed to fetch statistics',
//       error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//     });
//   }
// };

// // Export all functions
// export {
//   getUserVisits,
//   createVisit,
//   updateVisit,
//   deleteVisit,
//   getVisit,
//   markPlaceVisited,
//   unmarkPlaceVisited,
//   getVisitStatistics
// };

// controllers/visitController.js
import prisma from '../config/db.js';

const visitController = {
  // Get user's visits (food journey)
  getUserVisits: async (req, res) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20, sortBy = 'recent' } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build orderBy clause
      let orderBy = {};
      switch (sortBy) {
        case 'recent':
          orderBy = { visitDate: 'desc' };
          break;
        case 'oldest':
          orderBy = { visitDate: 'asc' };
          break;
        case 'name':
          orderBy = { coffeeShop: { name: 'asc' } };
          break;
        case 'rating':
          orderBy = { rating: 'desc' };
          break;
        default:
          orderBy = { visitDate: 'desc' };
      }

      const visits = await prisma.coffeeShopVisit.findMany({
        where: {
          userId: userId
        },
        include: {
          coffeeShop: {
            select: {
              id: true,
              name: true,
              address: true,
              imageUrl: true,
              rating: true,
              priceLevel: true,
              city: true,
              state: true,
              categories: {
                include: {
                  category: true
                }
              }
            }
          }
        },
        orderBy,
        skip,
        take: parseInt(limit)
      });

      // Transform the data
      const transformedVisits = visits.map(visit => ({
        id: visit.id,
        visitDate: visit.visitDate,
        notes: visit.notes,
        rating: visit.rating,
        photoUrls: visit.photoUrls,
        createdAt: visit.createdAt,
        coffeeShopId: visit.coffeeShopId,
        coffeeShop: {
          id: visit.coffeeShop.id,
          name: visit.coffeeShop.name,
          address: visit.coffeeShop.address,
          imageUrl: visit.coffeeShop.imageUrl,
          rating: visit.coffeeShop.rating,
          priceLevel: visit.coffeeShop.priceLevel,
          city: visit.coffeeShop.city,
          state: visit.coffeeShop.state,
          category: visit.coffeeShop.categories[0]?.category?.name || 'catering.restaurant'
        }
      }));

      // Get total count
      const totalVisits = await prisma.coffeeShopVisit.count({
        where: { userId: userId }
      });

      res.json({
        success: true,
        visits: transformedVisits,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalVisits / parseInt(limit)),
          totalVisits,
          hasNext: skip + transformedVisits.length < totalVisits,
          hasPrev: parseInt(page) > 1
        }
      });

    } catch (error) {
      console.error('Error fetching user visits:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to fetch your food journey',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // Create a new visit
  createVisit: async (req, res) => {
    try {
      const userId = req.user.id;
      const { coffeeShopId, visitDate, notes, rating, photoUrls } = req.body;

      if (!coffeeShopId) {
        return res.status(400).json({ 
          success: false,
          message: 'Coffee shop ID is required'
        });
      }

      // Check if coffee shop exists
      const coffeeShop = await prisma.coffeeShop.findUnique({
        where: { id: parseInt(coffeeShopId) }
      });

      if (!coffeeShop) {
        return res.status(404).json({ 
          success: false,
          message: 'Coffee shop not found' 
        });
      }

      // Create the visit
      const visit = await prisma.coffeeShopVisit.create({
        data: {
          userId,
          coffeeShopId: parseInt(coffeeShopId),
          visitDate: visitDate ? new Date(visitDate) : new Date(),
          notes: notes || null,
          rating: rating ? parseInt(rating) : null,
          photoUrls: photoUrls || null
        },
        include: {
          coffeeShop: {
            select: {
              id: true,
              name: true,
              address: true,
              imageUrl: true,
              rating: true,
              priceLevel: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Visit recorded successfully',
        visit: visit
      });

    } catch (error) {
      console.error('Error creating visit:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to record visit',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // Update a visit
  updateVisit: async (req, res) => {
    try {
      const { visitId } = req.params;
      const userId = req.user.id;
      
      // Check if visit exists and belongs to user
      const existingVisit = await prisma.coffeeShopVisit.findFirst({
        where: {
          id: parseInt(visitId),
          userId: userId
        }
      });

      if (!existingVisit) {
        return res.status(404).json({ 
          success: false,
          message: 'Visit not found or you do not have permission to update it' 
        });
      }

      const { visitDate, notes, rating, photoUrls } = req.body;

      // Prepare update data
      const updateData = {};
      if (visitDate !== undefined) updateData.visitDate = new Date(visitDate);
      if (notes !== undefined) updateData.notes = notes;
      if (rating !== undefined) updateData.rating = rating ? parseInt(rating) : null;
      if (photoUrls !== undefined) updateData.photoUrls = photoUrls;

      // Update the visit
      const updatedVisit = await prisma.coffeeShopVisit.update({
        where: { id: parseInt(visitId) },
        data: updateData,
        include: {
          coffeeShop: {
            select: {
              id: true,
              name: true,
              address: true,
              imageUrl: true,
              rating: true,
              priceLevel: true
            }
          }
        }
      });

      res.json({
        success: true,
        message: 'Visit updated successfully',
        visit: updatedVisit
      });

    } catch (error) {
      console.error('Error updating visit:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to update visit',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // Delete a visit
  deleteVisit: async (req, res) => {
    try {
      const { visitId } = req.params;
      const userId = req.user.id;

      // Check if visit exists and belongs to user
      const existingVisit = await prisma.coffeeShopVisit.findFirst({
        where: {
          id: parseInt(visitId),
          userId: userId
        }
      });

      if (!existingVisit) {
        return res.status(404).json({ 
          success: false,
          message: 'Visit not found or you do not have permission to delete it' 
        });
      }

      // Delete the visit
      await prisma.coffeeShopVisit.delete({
        where: { id: parseInt(visitId) }
      });

      res.json({ 
        success: true,
        message: 'Visit removed from your journey successfully' 
      });

    } catch (error) {
      console.error('Error deleting visit:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to remove visit',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // Get a single visit
  getVisit: async (req, res) => {
    try {
      const { visitId } = req.params;
      const userId = req.user.id;

      const visit = await prisma.coffeeShopVisit.findFirst({
        where: {
          id: parseInt(visitId),
          userId: userId
        },
        include: {
          coffeeShop: {
            select: {
              id: true,
              name: true,
              address: true,
              imageUrl: true,
              rating: true,
              priceLevel: true,
              city: true,
              state: true,
              categories: {
                include: {
                  category: true
                }
              }
            }
          }
        }
      });

      if (!visit) {
        return res.status(404).json({ 
          success: false,
          message: 'Visit not found' 
        });
      }

      res.json({
        success: true,
        visit: visit
      });

    } catch (error) {
      console.error('Error fetching visit:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to fetch visit',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // Mark a place as visited (from collections)
  markPlaceVisited: async (req, res) => {
    try {
      const userId = req.user.id;
      const { coffeeShopId, visitDate, notes, rating } = req.body;
      
      if (!coffeeShopId) {
        return res.status(400).json({ 
          success: false,
          message: 'Coffee shop ID is required' 
        });
      }

      // Check if coffee shop exists
      const coffeeShop = await prisma.coffeeShop.findUnique({
        where: { id: parseInt(coffeeShopId) }
      });

      if (!coffeeShop) {
        return res.status(404).json({ 
          success: false,
          message: 'Coffee shop not found' 
        });
      }

      // Check if visit already exists
      const existingVisit = await prisma.coffeeShopVisit.findFirst({
        where: {
          userId: userId,
          coffeeShopId: parseInt(coffeeShopId)
        }
      });

      if (existingVisit) {
        // Update existing visit
        const updatedVisit = await prisma.coffeeShopVisit.update({
          where: { id: existingVisit.id },
          data: {
            visitDate: visitDate ? new Date(visitDate) : new Date(),
            notes: notes || existingVisit.notes,
            rating: rating ? parseInt(rating) : existingVisit.rating
          },
          include: {
            coffeeShop: {
              select: {
                id: true,
                name: true,
                address: true,
                imageUrl: true,
                rating: true
              }
            }
          }
        });

        return res.json({
          success: true,
          message: 'Visit updated successfully',
          visit: updatedVisit,
          isNew: false
        });
      } else {
        // Create new visit
        const newVisit = await prisma.coffeeShopVisit.create({
          data: {
            userId,
            coffeeShopId: parseInt(coffeeShopId),
            visitDate: visitDate ? new Date(visitDate) : new Date(),
            notes: notes || null,
            rating: rating ? parseInt(rating) : null
          },
          include: {
            coffeeShop: {
              select: {
                id: true,
                name: true,
                address: true,
                imageUrl: true,
                rating: true
              }
            }
          }
        });

        return res.status(201).json({
          success: true,
          message: 'Visit recorded successfully',
          visit: newVisit,
          isNew: true
        });
      }

    } catch (error) {
      console.error('Error marking place as visited:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to mark place as visited',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // Unmark a place as visited
  unmarkPlaceVisited: async (req, res) => {
    try {
      const userId = req.user.id;
      const { coffeeShopId } = req.body;
      
      if (!coffeeShopId) {
        return res.status(400).json({ 
          success: false,
          message: 'Coffee shop ID is required' 
        });
      }

      // Find and delete the visit
      const existingVisit = await prisma.coffeeShopVisit.findFirst({
        where: {
          userId: userId,
          coffeeShopId: parseInt(coffeeShopId)
        }
      });

      if (!existingVisit) {
        return res.status(404).json({ 
          success: false,
          message: 'Visit not found' 
        });
      }

      await prisma.coffeeShopVisit.delete({
        where: { id: existingVisit.id }
      });

      res.json({ 
        success: true,
        message: 'Place unmarked as visited successfully',
        visitId: existingVisit.id
      });

    } catch (error) {
      console.error('Error unmarking place as visited:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to unmark place as visited',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // Get visit statistics
  getVisitStatistics: async (req, res) => {
    try {
      const userId = req.user.id;

      // Get total visits count
      const totalVisits = await prisma.coffeeShopVisit.count({
        where: { userId }
      });

      // Get visits with ratings
      const ratedVisits = await prisma.coffeeShopVisit.findMany({
        where: { 
          userId,
          rating: { not: null }
        },
        select: { rating: true }
      });

      // Get unique months with visits
      const visitsWithDates = await prisma.coffeeShopVisit.findMany({
        where: { userId },
        select: { visitDate: true }
      });

      const uniqueMonths = new Set(
        visitsWithDates.map(v => 
          new Date(v.visitDate).toISOString().slice(0, 7) // YYYY-MM format
        )
      );

      // Get highly rated visits (4+ stars)
      const highlyRatedCount = ratedVisits.filter(v => v.rating >= 4).length;

      // Calculate average rating
      const avgRating = ratedVisits.length > 0 
        ? (ratedVisits.reduce((sum, v) => sum + v.rating, 0) / ratedVisits.length).toFixed(1)
        : null;

      res.json({
        success: true,
        statistics: {
          totalVisits,
          ratedVisits: ratedVisits.length,
          averageRating: avgRating,
          activeMonths: uniqueMonths.size,
          highlyRatedCount
        }
      });

    } catch (error) {
      console.error('Error fetching visit statistics:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to fetch statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
};

export default visitController;