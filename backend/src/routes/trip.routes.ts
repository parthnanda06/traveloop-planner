import { Router } from 'express';
import {
  getTrips, getTripById, createTrip, updateTrip, deleteTrip,
  shareTrip, getSharedTrip,
  addStop, updateStop, deleteStop, reorderStops,
  addActivity, updateActivity, deleteActivity,
  getDashboardStats
} from '../controllers/trip.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Dashboard
router.get('/dashboard', authenticate, getDashboardStats);

// Public shared trip
router.get('/shared/:token', optionalAuth, getSharedTrip);

// Trip CRUD
router.get('/', authenticate, getTrips);
router.get('/:id', authenticate, getTripById);
router.post('/', authenticate, upload.single('coverImage'), createTrip);
router.put('/:id', authenticate, upload.single('coverImage'), updateTrip);
router.delete('/:id', authenticate, deleteTrip);

// Sharing
router.post('/:id/share', authenticate, shareTrip);

// Stops
router.post('/:id/stops', authenticate, addStop);
router.put('/:id/stops/:stopId', authenticate, updateStop);
router.delete('/:id/stops/:stopId', authenticate, deleteStop);
router.put('/:id/stops/reorder', authenticate, reorderStops);

// Activities
router.post('/:id/stops/:stopId/activities', authenticate, addActivity);
router.put('/:id/stops/:stopId/activities/:activityId', authenticate, updateActivity);
router.delete('/:id/stops/:stopId/activities/:activityId', authenticate, deleteActivity);

export default router;
