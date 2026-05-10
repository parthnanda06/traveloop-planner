import mongoose, { Document, Schema } from 'mongoose';

export interface IPackingItem extends Document {
  user: mongoose.Types.ObjectId;
  trip: mongoose.Types.ObjectId;
  name: string;
  category: 'Clothing' | 'Electronics' | 'Documents' | 'Essentials' | 'Other';
  packed: boolean;
  quantity: number;
  notes?: string;
}

const PackingItemSchema = new Schema<IPackingItem>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Clothing', 'Electronics', 'Documents', 'Essentials', 'Other'],
      default: 'Essentials',
    },
    packed: { type: Boolean, default: false },
    quantity: { type: Number, default: 1 },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model<IPackingItem>('PackingItem', PackingItemSchema);
