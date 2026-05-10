import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity {
  _id?: mongoose.Types.ObjectId;
  name: string;
  category: 'Adventure' | 'Food' | 'Relaxation' | 'Sightseeing' | 'Culture' | 'Shopping' | 'Other';
  description?: string;
  startTime?: string;
  duration?: number; // in minutes
  cost: number;
  currency: string;
  location?: string;
  notes?: string;
  completed: boolean;
}

export interface IStop {
  _id?: mongoose.Types.ObjectId;
  city: string;
  country: string;
  arrivalDate: Date;
  departureDate: Date;
  accommodation?: string;
  accommodationCost: number;
  transportCost: number;
  notes?: string;
  activities: IActivity[];
  order: number;
}

export interface ITrip extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  coverImage?: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed';
  currency: string;
  stops: IStop[];
  isPublic: boolean;
  shareToken: string;
  tags: string[];
  totalBudget: number;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Adventure', 'Food', 'Relaxation', 'Sightseeing', 'Culture', 'Shopping', 'Other'],
    default: 'Sightseeing',
  },
  description: String,
  startTime: String,
  duration: Number,
  cost: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  location: String,
  notes: String,
  completed: { type: Boolean, default: false },
});

const StopSchema = new Schema<IStop>({
  city: { type: String, required: true },
  country: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  departureDate: { type: Date, required: true },
  accommodation: String,
  accommodationCost: { type: Number, default: 0 },
  transportCost: { type: Number, default: 0 },
  notes: String,
  activities: [ActivitySchema],
  order: { type: Number, default: 0 },
});

const TripSchema = new Schema<ITrip>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: String,
    coverImage: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['planning', 'upcoming', 'ongoing', 'completed'],
      default: 'planning',
    },
    currency: { type: String, default: 'USD' },
    stops: [StopSchema],
    isPublic: { type: Boolean, default: false },
    shareToken: { type: String, unique: true, sparse: true },
    tags: [String],
    totalBudget: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-update status based on dates
TripSchema.pre('save', function (next) {
  const now = new Date();
  if (this.startDate > now) this.status = 'upcoming';
  else if (this.endDate < now) this.status = 'completed';
  else this.status = 'ongoing';
  next();
});

export default mongoose.model<ITrip>('Trip', TripSchema);
