import { Request, Response } from 'express';
import TripNote from '../models/TripNote';

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await TripNote.find({
      trip: req.params.tripId,
      user: req.user!.userId,
    }).sort({ pinned: -1, createdAt: -1 });
    res.json({ success: true, notes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNote = async (req: Request, res: Response) => {
  try {
    const note = await TripNote.create({
      ...req.body,
      trip: req.params.tripId,
      user: req.user!.userId,
    });
    res.status(201).json({ success: true, note });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const note = await TripNote.findOneAndUpdate(
      { _id: req.params.id, user: req.user!.userId },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, note });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    await TripNote.findOneAndDelete({ _id: req.params.id, user: req.user!.userId });
    res.json({ success: true, message: 'Note deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
