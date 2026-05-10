import mongoose, { Document, Schema } from 'mongoose';

export interface ITripNote extends Document {
  user: mongoose.Types.ObjectId;
  trip: mongoose.Types.ObjectId;
  title: string;
  content: string;
  day?: Date;
  pinned: boolean;
  color: string;
  reminder?: Date;
}

const TripNoteSchema = new Schema<ITripNote>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    day: Date,
    pinned: { type: Boolean, default: false },
    color: { type: String, default: '#6366f1' },
    reminder: Date,
  },
  { timestamps: true }
);

export default mongoose.model<ITripNote>('TripNote', TripNoteSchema);
