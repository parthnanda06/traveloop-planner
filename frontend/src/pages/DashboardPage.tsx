import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Plus, MapPin, Calendar, Clock, Globe,
  ArrowRight, Star, Compass
} from 'lucide-react';
import { tripService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard, EmptyState } from '../components/ui/LoadingStates';
import { formatDate, getTripStatusColor, getDaysCount, POPULAR_DESTINATIONS, resolveImageUrl } from '../utils';
import type { Trip } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: dashData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => tripService.getDashboard().then(r => r.data),
  });

  const stats = dashData?.stats || { totalTrips: 0, upcomingTrips: 0, completedTrips: 0 };
  const upcomingList: Trip[] = dashData?.upcomingList || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Welcome */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl hero-gradient p-8 lg:p-10 text-white"
      >
        <div className="relative z-10">
          <p className="text-white/80 mb-1">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},</p>
          <h1 className="text-3xl lg:text-4xl font-bold mb-3">{user?.name} ✈️</h1>
          <p className="text-white/80 text-lg mb-6">Ready for your next adventure?</p>
          <Button
            variant="glass"
            size="lg"
            onClick={() => navigate('/trips/new')}
            className="font-semibold"
          >
            <Plus size={20} />
            Plan a New Trip
          </Button>
        </div>
        {/* Decorative */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10 text-[120px] font-bold hidden lg:block">
          🌍
        </div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full border border-white/10"
        />
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Trips', value: stats.totalTrips, icon: Globe, color: 'text-violet-500', bg: 'bg-violet-500/10' },
          { label: 'Upcoming', value: stats.upcomingTrips, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Completed', value: stats.completedTrips, icon: Star, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Countries', value: dashData?.countriesCount || 0, icon: MapPin, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="p-5 border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
                <Icon className={color} size={22} />
              </div>
              <div>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Trips */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upcoming Trips</h2>
            <Link to="/trips" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : upcomingList.length === 0 ? (
            <EmptyState
              icon={<Compass size={32} />}
              title="No upcoming trips"
              description="Start planning your next adventure!"
              action={
                <Button onClick={() => navigate('/trips/new')} size="sm">
                  <Plus size={16} /> Create Trip
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {upcomingList.map((trip) => (
                <Card
                  key={trip._id}
                  hover
                  onClick={() => navigate(`/trips/${trip._id}`)}
                  className="overflow-hidden"
                >
                  <div className="flex gap-4 p-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">
                      {trip.coverImage ? (
                        <img
                          src={resolveImageUrl(trip.coverImage)!}
                          alt={trip.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full hero-gradient flex items-center justify-center text-3xl">
                          {trip.stops?.[0]?.city?.charAt(0) || '✈️'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold truncate">{trip.title}</h3>
                        <Badge className={getTripStatusColor(trip.status)}>{trip.status}</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                        <Calendar size={13} />
                        <span>{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin size={12} /> {trip.stops?.length || 0} cities
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} /> {getDaysCount(trip.startDate, trip.endDate)} days
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions + Recommended */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Trip', icon: '✈️', to: '/trips/new', gradient: 'from-violet-500 to-purple-500' },
              { label: 'My Trips', icon: '🗺️', to: '/trips', gradient: 'from-blue-500 to-cyan-500' },
              { label: 'Profile', icon: '👤', to: '/profile', gradient: 'from-pink-500 to-rose-500' },
              { label: 'Explore', icon: '🌍', to: '/trips', gradient: 'from-orange-500 to-amber-500' },
            ].map(({ label, icon, to, gradient }) => (
              <Link
                key={label}
                to={to}
                className={`rounded-2xl bg-gradient-to-br ${gradient} p-4 text-white text-center hover:-translate-y-1 transition-transform duration-200 shadow-lg`}
              >
                <div className="text-3xl mb-2">{icon}</div>
                <div className="text-sm font-semibold">{label}</div>
              </Link>
            ))}
          </div>

          <h2 className="text-xl font-semibold pt-2">Popular Destinations</h2>
          <div className="space-y-2">
            {POPULAR_DESTINATIONS.slice(0, 4).map(({ city, country, emoji }) => (
              <Card 
                key={city} 
                hover 
                className="p-3 cursor-pointer"
                onClick={() => navigate(`/trips/new?city=${city}&country=${country}`)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <p className="font-medium text-sm">{city}</p>
                    <p className="text-xs text-muted-foreground">{country}</p>
                  </div>
                  <ArrowRight size={14} className="ml-auto text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
