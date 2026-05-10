import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString('en-US', options || {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function getDaysCount(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function calculateTripBudget(stops: any[]) {
  return stops.reduce((total: number, stop: any) => {
    const activitiesCost = stop.activities.reduce((sum: number, a: any) => sum + (a.cost || 0), 0);
    return total + (stop.accommodationCost || 0) + (stop.transportCost || 0) + activitiesCost;
  }, 0);
}

export function getBudgetBreakdown(stops: any[]) {
  let accommodation = 0;
  let transport = 0;
  let activities = 0;
  let food = 0;

  stops.forEach((stop: any) => {
    accommodation += stop.accommodationCost || 0;
    transport += stop.transportCost || 0;
    stop.activities?.forEach((a: any) => {
      if (a.category === 'Food') food += a.cost || 0;
      else activities += a.cost || 0;
    });
  });

  return { accommodation, transport, activities, food, total: accommodation + transport + activities + food };
}

export function getTripStatusColor(status: string) {
  const colors: Record<string, string> = {
    planning: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    upcoming: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    ongoing: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  };
  return colors[status] || colors.planning;
}

export function getActivityCategoryColor(category: string) {
  const colors: Record<string, string> = {
    Adventure: 'bg-orange-100 text-orange-700',
    Food: 'bg-red-100 text-red-700',
    Relaxation: 'bg-teal-100 text-teal-700',
    Sightseeing: 'bg-blue-100 text-blue-700',
    Culture: 'bg-purple-100 text-purple-700',
    Shopping: 'bg-pink-100 text-pink-700',
    Other: 'bg-gray-100 text-gray-700',
  };
  return colors[category] || colors.Other;
}

export function getActivityCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    Adventure: '🧗',
    Food: '🍽️',
    Relaxation: '🏖️',
    Sightseeing: '🗺️',
    Culture: '🏛️',
    Shopping: '🛍️',
    Other: '📌',
  };
  return icons[category] || '📌';
}

export function truncate(str: string, length = 60) {
  return str.length > length ? `${str.slice(0, length)}...` : str;
}

export function resolveImageUrl(path?: string) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://localhost:5000${path}`;
}

export const POPULAR_DESTINATIONS = [
  { city: 'Paris', country: 'France', emoji: '🗼', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
  { city: 'Tokyo', country: 'Japan', emoji: '🗾', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
  { city: 'New York', country: 'USA', emoji: '🗽', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400' },
  { city: 'Bali', country: 'Indonesia', emoji: '🌴', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400' },
  { city: 'Dubai', country: 'UAE', emoji: '🏙️', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400' },
  { city: 'Rome', country: 'Italy', emoji: '🏛️', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400' },
  { city: 'Barcelona', country: 'Spain', emoji: '🌊', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400' },
  { city: 'Santorini', country: 'Greece', emoji: '🏝️', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400' },
];
