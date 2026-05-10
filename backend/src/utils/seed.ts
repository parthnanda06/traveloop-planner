import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/traveloop';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await mongoose.connection.collection('users').deleteMany({});
  await mongoose.connection.collection('trips').deleteMany({});
  console.log('Cleared existing data');

  // Create demo user
  const passwordHash = await bcrypt.hash('demo1234', 12);
  const user = await mongoose.connection.collection('users').insertOne({
    name: 'Demo Traveler',
    email: 'demo@traveloop.com',
    password: passwordHash,
    avatar: '',
    bio: 'Passionate traveler exploring the world one city at a time! 🌍',
    preferences: { currency: 'USD', darkMode: false, notifications: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create sample trips
  await mongoose.connection.collection('trips').insertMany([
    {
      user: user.insertedId,
      title: 'European Summer Dream 🌟',
      description: 'A magical journey through the best of Western Europe',
      coverImage: '',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-07-21'),
      status: 'completed',
      currency: 'EUR',
      tags: ['europe', 'summer', 'culture'],
      isPublic: false,
      totalBudget: 4500,
      stops: [
        {
          _id: new mongoose.Types.ObjectId(),
          city: 'Paris', country: 'France',
          arrivalDate: new Date('2024-07-01'), departureDate: new Date('2024-07-07'),
          accommodation: 'Le Marais Boutique Hotel',
          accommodationCost: 800, transportCost: 150, order: 0, notes: '',
          activities: [
            { _id: new mongoose.Types.ObjectId(), name: 'Eiffel Tower Visit', category: 'Sightseeing', cost: 35, currency: 'EUR', completed: true, description: '', notes: '' },
            { _id: new mongoose.Types.ObjectId(), name: 'Seine River Cruise', category: 'Relaxation', cost: 25, currency: 'EUR', completed: true, description: '', notes: '' },
            { _id: new mongoose.Types.ObjectId(), name: 'Louvre Museum', category: 'Culture', cost: 22, currency: 'EUR', completed: true, description: '', notes: '' },
          ],
        },
        {
          _id: new mongoose.Types.ObjectId(),
          city: 'Rome', country: 'Italy',
          arrivalDate: new Date('2024-07-07'), departureDate: new Date('2024-07-14'),
          accommodation: 'Colosseum View Hotel',
          accommodationCost: 700, transportCost: 120, order: 1, notes: '',
          activities: [
            { _id: new mongoose.Types.ObjectId(), name: 'Colosseum Tour', category: 'Culture', cost: 18, currency: 'EUR', completed: true, description: '', notes: '' },
            { _id: new mongoose.Types.ObjectId(), name: 'Vatican Museums', category: 'Culture', cost: 22, currency: 'EUR', completed: true, description: '', notes: '' },
            { _id: new mongoose.Types.ObjectId(), name: 'Pasta Making Class', category: 'Food', cost: 80, currency: 'EUR', completed: true, description: '', notes: '' },
          ],
        },
      ],
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      user: user.insertedId,
      title: 'Bali Paradise Escape 🌴',
      description: 'Wellness, temples, rice terraces and stunning sunsets',
      coverImage: '',
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-03-25'),
      status: 'upcoming',
      currency: 'USD',
      tags: ['bali', 'wellness', 'beach', 'asia'],
      isPublic: false,
      totalBudget: 2200,
      stops: [
        {
          _id: new mongoose.Types.ObjectId(),
          city: 'Ubud', country: 'Indonesia',
          arrivalDate: new Date('2025-03-15'), departureDate: new Date('2025-03-20'),
          accommodation: 'Jungle Villa Retreat',
          accommodationCost: 400, transportCost: 80, order: 0, notes: 'Book rice terrace trek in advance',
          activities: [
            { _id: new mongoose.Types.ObjectId(), name: 'Rice Terrace Trek', category: 'Adventure', cost: 30, currency: 'USD', completed: false, description: '', notes: '' },
            { _id: new mongoose.Types.ObjectId(), name: 'Traditional Cooking Class', category: 'Food', cost: 45, currency: 'USD', completed: false, description: '', notes: '' },
          ],
        },
      ],
      createdAt: new Date(), updatedAt: new Date(),
    },
  ]);

  console.log('✅ Demo data seeded!');
  console.log('📧 Login: demo@traveloop.com | 🔑 Password: demo1234');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
