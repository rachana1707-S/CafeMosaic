// import express from 'express';
// import {
//   getUserVisits,
//   createVisit,
//   updateVisit,
//   deleteVisit,
//   getVisit,
//   markPlaceVisited,
//   unmarkPlaceVisited,
//   getVisitStatistics
// } from '../controllers/visitController.js';
// import authMiddleware from '../middleware/authMiddleware.js';
// import { catchAsync } from '../middleware/errorHandler.js';

// const router = express.Router();

// // All routes require authentication
// router.use(authMiddleware);

// // GET /api/visits/my-visits - Get current user's visits (food journey)
// router.get('/my-visits', catchAsync(getUserVisits));

// // GET /api/visits/statistics - Get user's visit statistics
// router.get('/statistics', catchAsync(getVisitStatistics));

// // GET /api/visits/:visitId - Get single visit
// router.get('/:visitId', catchAsync(getVisit));

// // POST /api/visits - Create new visit
// router.post('/', catchAsync(createVisit));

// // POST /api/visits/mark-visited - Mark a place as visited (from collections/favorites)
// router.post('/mark-visited', catchAsync(markPlaceVisited));

// // POST /api/visits/unmark-visited - Unmark a place as visited
// router.post('/unmark-visited', catchAsync(unmarkPlaceVisited));

// // PUT /api/visits/:visitId - Update visit
// router.put('/:visitId', catchAsync(updateVisit));

// // DELETE /api/visits/:visitId - Delete visit
// router.delete('/:visitId', catchAsync(deleteVisit));

// export default router;


// routes/visitRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { catchAsync } from '../middleware/errorHandler.js';
import visitController from '../controllers/visitController.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/visits/my-visits - Get current user's visits (food journey)
router.get('/my-visits', catchAsync(visitController.getUserVisits));

// GET /api/visits/statistics - Get user's visit statistics
router.get('/statistics', catchAsync(visitController.getVisitStatistics));

// GET /api/visits/:visitId - Get single visit
router.get('/:visitId', catchAsync(visitController.getVisit));

// POST /api/visits - Create new visit
router.post('/', catchAsync(visitController.createVisit));

// POST /api/visits/mark-visited - Mark a place as visited (from collections/favorites)
router.post('/mark-visited', catchAsync(visitController.markPlaceVisited));

// POST /api/visits/unmark-visited - Unmark a place as visited
router.post('/unmark-visited', catchAsync(visitController.unmarkPlaceVisited));

// PUT /api/visits/:visitId - Update visit
router.put('/:visitId', catchAsync(visitController.updateVisit));

// DELETE /api/visits/:visitId - Delete visit
router.delete('/:visitId', catchAsync(visitController.deleteVisit));

export default router;