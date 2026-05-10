import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/traveloop';
const TARGET_EMAIL = 'parthnanda256@gmail.com';

async function seedForUser() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const user = await mongoose.connection.collection('users').findOne({ email: TARGET_EMAIL });

  if (!user) {
    console.error(`User with email ${TARGET_EMAIL} not found. Please register first.`);
    await mongoose.disconnect();
    return;
  }

  const userId = user._id;

  // Create sample trips for this user
  await mongoose.connection.collection('trips').insertMany([
    {
      user: userId,
      title: 'Summer in Switzerland 🏔️',
      description: 'Exploring the Swiss Alps and crystal clear lakes',
      coverImage: '',
      startDate: new Date('2024-08-10'),
      endDate: new Date('2024-08-20'),
      status: 'completed',
      currency: 'CHF',
      isPublic: true,
      stops: [
        {
          _id: new mongoose.Types.ObjectId(),
          city: 'Lucerne', country: 'Switzerland',
          arrivalDate: new Date('2024-08-10'), departureDate: new Date('2024-08-15'),
          accommodation: 'Lake View Palace',
          accommodationCost: 1200, transportCost: 200, order: 0,
          activities: [
            { _id: new mongoose.Types.ObjectId(), name: 'Mount Pilatus Cogwheel Railway', category: 'Adventure', cost: 72, completed: true },
            { _id: new mongoose.Types.ObjectId(), name: 'Lucerne Lake Cruise', category: 'Relaxation', cost: 45, completed: true }
          ]
        },
        {
          _id: new mongoose.Types.ObjectId(),
          city: 'Zermatt', country: 'Switzerland',
          arrivalDate: new Date('2024-08-15'), departureDate: new Date('2024-08-20'),
          accommodation: 'Matterhorn Lodge',
          accommodationCost: 1500, transportCost: 100, order: 1,
          activities: [
            { _id: new mongoose.Types.ObjectId(), name: 'Gornergrat Observation Deck', category: 'Sightseeing', cost: 110, completed: true }
          ]
        }
      ],
      createdAt: new Date(), updatedAt: new Date()
    },
    {
      user: userId,
      title: 'Tokyo Food Tour 🍱',
      description: 'A culinary journey through the heart of Japan',
      coverImage: '',
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-05-10'),
      status: 'upcoming',
      currency: 'JPY',
      isPublic: false,
      stops: [
        {
          _id: new mongoose.Types.ObjectId(),
          city: 'Tokyo', country: 'Japan',
          arrivalDate: new Date('2025-05-01'), departureDate: new Date('2025-05-10'),
          accommodation: 'Park Hyatt Tokyo',
          accommodationCost: 250000, transportCost: 50000, order: 0,
          activities: [
            { _id: new mongoose.Types.ObjectId(), name: 'Tsukiji Fish Market Tour', category: 'Food', cost: 15000, completed: false },
            { _id: new mongoose.Types.ObjectId(), name: 'Shinjuku Gyoen Garden', category: 'Culture', cost: 500, completed: false }
          ]
        }
      ],
      createdAt: new Date(), updatedAt: new Date()
    }
  ]);

  console.log(`✅ Data successfully added for ${TARGET_EMAIL}!`);
  await mongoose.disconnect();
}

seedForUser().catch(err => { console.error(err); process.exit(1); });
