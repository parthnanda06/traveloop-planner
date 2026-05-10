// All TypeScript types for Traveloop

export type TravelUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  preferences: {
    currency: string;
    darkMode: boolean;
    notifications: boolean;
  };
  createdAt?: string;
};

export type Activity = {
  _id: string;
  name: string;
  category: 'Adventure' | 'Food' | 'Relaxation' | 'Sightseeing' | 'Culture' | 'Shopping' | 'Other';
  description?: string;
  startTime?: string;
  duration?: number;
  cost: number;
  currency: string;
  location?: string;
  notes?: string;
  completed: boolean;
};

export type Stop = {
  _id: string;
  city: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  accommodation?: string;
  accommodationCost: number;
  transportCost: number;
  notes?: string;
  activities: Activity[];
  order: number;
};

export type Trip = {
  _id: string;
  user: string | TravelUser;
  title: string;
  description?: string;
  coverImage?: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed';
  currency: string;
  stops: Stop[];
  isPublic: boolean;
  shareToken?: string;
  tags: string[];
  totalBudget: number;
  createdAt: string;
  updatedAt: string;
};

export type PackingItem = {
  _id: string;
  trip: string;
  user: string;
  name: string;
  category: 'Clothing' | 'Electronics' | 'Documents' | 'Essentials' | 'Other';
  packed: boolean;
  quantity: number;
  notes?: string;
};

export type TripNote = {
  _id: string;
  trip: string;
  user: string;
  title: string;
  content: string;
  day?: string;
  pinned: boolean;
  color: string;
  reminder?: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardStats = {
  totalTrips: number;
  upcomingTrips: number;
  completedTrips: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type ActivityCategory = 'Adventure' | 'Food' | 'Relaxation' | 'Sightseeing' | 'Culture' | 'Shopping' | 'Other';
export type PackingCategory = 'Clothing' | 'Electronics' | 'Documents' | 'Essentials' | 'Other';
export type TripStatus = 'planning' | 'upcoming' | 'ongoing' | 'completed';
