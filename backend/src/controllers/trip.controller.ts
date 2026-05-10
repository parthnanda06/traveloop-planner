import { Request, Response } from 'express';
import crypto from 'crypto';
import Trip from '../models/Trip';
import PackingItem from '../models/PackingItem';
import TripNote from '../models/TripNote';

// @route GET /api/trips
export const getTrips = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const filter: any = { user: req.user!.userId };

    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const trips = await Trip.find(filter).sort({ startDate: 1 }).lean();
    res.json({ success: true, trips });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/trips/:id
export const getTripById = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user!.userId });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, trip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/trips
export const createTrip = async (req: Request, res: Response) => {
  try {
    const { title, description, startDate, endDate, currency, tags } = req.body;
    const coverImageFile = req.file;

    const trip = await Trip.create({
      user: req.user!.userId,
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      currency: currency || 'USD',
      tags: tags ? JSON.parse(tags) : [],
      coverImage: coverImageFile ? `/uploads/${coverImageFile.filename}` : '',
    });

    res.status(201).json({ success: true, trip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/trips/:id
export const updateTrip = async (req: Request, res: Response) => {
  try {
    const coverImageFile = req.file;
    const updateData: any = { ...req.body };

    if (coverImageFile) updateData.coverImage = `/uploads/${coverImageFile.filename}`;
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = JSON.parse(updateData.tags);
    }

    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.user!.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, trip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/trips/:id
export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user!.userId });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    // Cleanup related data
    await PackingItem.deleteMany({ trip: req.params.id });
    await TripNote.deleteMany({ trip: req.params.id });

    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/trips/:id/share
export const shareTrip = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user!.userId });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    if (!trip.shareToken) {
      trip.shareToken = crypto.randomBytes(16).toString('hex');
    }
    trip.isPublic = true;
    await trip.save();

    res.json({
      success: true,
      shareUrl: `${process.env.CLIENT_URL}/shared/${trip.shareToken}`,
      shareToken: trip.shareToken,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/trips/shared/:token (public)
export const getSharedTrip = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findOne({ shareToken: req.params.token, isPublic: true }).populate(
      'user',
      'name avatar'
    );
    if (!trip) return res.status(404).json({ success: false, message: 'Shared trip not found' });
    res.json({ success: true, trip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// === STOPS ===
export const addStop = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user!.userId });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const { city, country, arrivalDate, departureDate, accommodation, accommodationCost, transportCost, notes } = req.body;
    const newStop = {
      city,
      country,
      arrivalDate: new Date(arrivalDate),
      departureDate: new Date(departureDate),
      accommodation,
      accommodationCost: accommodationCost || 0,
      transportCost: transportCost || 0,
      notes,
      activities: [],
      order: trip.stops.length,
    };

    trip.stops.push(newStop as any);
    await trip.save();
    res.status(201).json({ success: true, trip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStop = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user!.userId });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const stop = (trip.stops as any).id(req.params.stopId);
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });

    Object.assign(stop, req.body);
    await trip.save();
    res.json({ success: true, trip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStop = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user!.userId });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    trip.stops = trip.stops.filter((s: any) => s._id.toString() !== req.params.stopId) as any;
    await trip.save();
    res.json({ success: true, trip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reorderStops = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user!.userId });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const { orderedIds } = req.body; // array of stop ids in new order
    const stopsMap = new Map(trip.stops.map((s: any) => [s._id.toString(), s]));
    trip.stops = orderedIds.map((id: string, idx: number) => {
      const stop = stopsMap.get(id);
      if (stop) (stop as any).order = idx;
      return stop;
    }).filter(Boolean) as any;

    await trip.save();
    res.json({ success: true, trip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// === ACTIVITIES ===
export const addActivity = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user!.userId });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const stop = (trip.stops as any).id(req.params.stopId);
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });

    stop.activities.push(req.body);
    await trip.save();
    res.status(201).json({ success: true, trip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user!.userId });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const stop = (trip.stops as any).id(req.params.stopId);
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });

    const activity = (stop.activities as any).id(req.params.activityId);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    Object.assign(activity, req.body);
    await trip.save();
    res.json({ success: true, trip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user!.userId });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const stop = (trip.stops as any).id(req.params.stopId);
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });

    stop.activities = stop.activities.filter(
      (a: any) => a._id.toString() !== req.params.activityId
    ) as any;
    await trip.save();
    res.json({ success: true, trip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// === DASHBOARD STATS ===
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const totalTrips = await Trip.countDocuments({ user: userId });
    const upcomingTrips = await Trip.countDocuments({ user: userId, status: 'upcoming' });
    const completedTrips = await Trip.countDocuments({ user: userId, status: 'completed' });

    const recentTrips = await Trip.find({ user: userId }).sort({ updatedAt: -1 }).limit(3).lean();
    const upcomingList = await Trip.find({ user: userId, status: 'upcoming' })
      .sort({ startDate: 1 })
      .limit(3)
      .lean();

    const allTrips = await Trip.find({ user: userId }).select('stops.country').lean();
    const countries = new Set();
    allTrips.forEach(t => t.stops.forEach(s => countries.add(s.country)));

    res.json({
      success: true,
      stats: { totalTrips, upcomingTrips, completedTrips },
      countriesCount: countries.size,
      recentTrips,
      upcomingList,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
