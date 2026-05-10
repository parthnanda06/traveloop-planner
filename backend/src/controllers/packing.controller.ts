import { Request, Response } from 'express';
import PackingItem from '../models/PackingItem';

export const getPackingItems = async (req: Request, res: Response) => {
  try {
    const items = await PackingItem.find({
      trip: req.params.tripId,
      user: req.user!.userId,
    }).sort({ category: 1, createdAt: 1 });
    res.json({ success: true, items });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPackingItem = async (req: Request, res: Response) => {
  try {
    const item = await PackingItem.create({
      ...req.body,
      trip: req.params.tripId,
      user: req.user!.userId,
    });
    res.status(201).json({ success: true, item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePackingItem = async (req: Request, res: Response) => {
  try {
    const item = await PackingItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user!.userId },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePackingItem = async (req: Request, res: Response) => {
  try {
    await PackingItem.findOneAndDelete({ _id: req.params.id, user: req.user!.userId });
    res.json({ success: true, message: 'Item deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkUpdatePackingItems = async (req: Request, res: Response) => {
  try {
    const { packed } = req.body;
    await PackingItem.updateMany(
      { trip: req.params.tripId, user: req.user!.userId },
      { packed }
    );
    res.json({ success: true, message: 'Items updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
