import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Clock, 
  Info, Compass 
} from 'lucide-react';
import { tripService } from '../services/api';
import { LoadingPage } from '../components/ui/LoadingStates';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { 
  formatDate, formatCurrency, getDaysCount, 
  getActivityCategoryIcon, 
  calculateTripBudget 
} from '../utils';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';
import type { Trip, Stop } from '../types';

const SharedTripPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const { data: trip, isLoading, error } = useQuery({
    queryKey: ['shared-trip', token],
    queryFn: () => tripService.getShared(token!).then(r => r.data.trip as Trip),
  });

  if (isLoading) return <LoadingPage message="Unlocking travel secrets..." />;
  
  if (error || !trip) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="text-8xl mb-6">🏜️</div>
        <h2 className="text-3xl font-bold mb-2">Trip Missing</h2>
        <p className="text-muted-foreground mb-8">This itinerary is either private or the link has expired.</p>
        <Button asChild className="w-full">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );

  const owner = typeof trip.user === 'object' ? trip.user : null;
  const budget = calculateTripBudget(trip.stops || []);
  const totalDays = getDaysCount(trip.startDate, trip.endDate);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {trip.coverImage ? (
          <img 
            src={trip.coverImage.startsWith('/') ? `http://localhost:5000${trip.coverImage}` : trip.coverImage} 
            alt={trip.title} 
            className="w-full h-full object-cover scale-105"
          />
        ) : (
          <div className="w-full h-full hero-gradient animate-pulse"/>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"/>
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl space-y-6"
          >
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/20 backdrop-blur-md text-white border-white/20 px-3 py-1">
                Shared Itinerary
              </Badge>
              <div className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-sm font-medium text-white/80">by {(owner as any)?.name || 'Traveler'}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
              {trip.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Calendar size={14}/>
                </div>
                <span className="font-semibold">{formatDate(trip.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Clock size={14}/>
                </div>
                <span className="font-semibold">{totalDays} Days</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin size={14}/>
                </div>
                <span className="font-semibold">{trip.stops?.length || 0} Cities</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Quick Info */}
      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-20">
        <Card className="p-6 md:p-10 shadow-2xl border-none grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-border">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Budget</p>
            <p className="text-3xl font-black text-primary">{formatCurrency(budget, trip.currency)}</p>
          </div>
          <div className="md:pl-8 space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Travel Style</p>
            <p className="text-3xl font-black">Adventure</p>
          </div>
          <div className="md:pl-8 space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${trip.status === 'upcoming' ? 'bg-green-500' : 'bg-blue-500'}`} />
              <p className="text-xl font-bold capitalize">{trip.status}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-20">
          {trip.description && (
            <div className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Info size={14} /> The Vision
              </h2>
              <p className="text-2xl font-medium leading-relaxed italic text-slate-700 dark:text-slate-300">
                "{trip.description}"
              </p>
            </div>
          )}

        <div className="space-y-12">
          <h2 className="text-4xl font-black tracking-tight flex items-center gap-4">
            Itinerary <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </h2>
          
          <div className="space-y-24 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-primary before:via-primary/20 before:to-transparent">
            {trip.stops?.map((stop: Stop, idx: number) => (
              <motion.div 
                key={stop._id} 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative pl-20"
              >
                {/* Visual Connector */}
                <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-primary shadow-xl shadow-primary/40 flex items-center justify-center text-white font-black text-xl z-10">
                  {idx + 1}
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-bold tracking-tight">{stop.city}, {stop.country}</h3>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="font-medium">{formatDate(stop.arrivalDate)} — {formatDate(stop.departureDate)}</span>
                      {stop.accommodation && (
                        <>
                          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                          <span className="flex items-center gap-1">🏨 {stop.accommodation}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {stop.activities?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stop.activities.map(activity => (
                        <Card key={activity._id} className="p-6 hover:shadow-lg transition-all border-slate-200/50 dark:border-slate-800/50 group">
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-2xl group-hover:scale-125 transition-transform">{getActivityCategoryIcon(activity.category)}</span>
                            {activity.cost > 0 && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                {formatCurrency(activity.cost, trip.currency)}
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-bold text-lg mb-1">{activity.name}</h4>
                          {activity.startTime && (
                            <p className="text-sm font-medium text-primary mb-2 flex items-center gap-1">
                              <Clock size={12} /> {activity.startTime}
                            </p>
                          )}
                          {activity.description && <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-dashed border-border text-center">
                      <Compass className="mx-auto mb-3 text-muted-foreground opacity-20" size={40} />
                      <p className="text-sm text-muted-foreground">Exploring local secrets in {stop.city}...</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        </div>

        {/* Sidebar - Budget & Stats */}
        <div className="space-y-8">
          <Card className="p-8 border-none shadow-2xl shadow-slate-200 rounded-[32px] bg-white sticky top-28">
            <h3 className="text-xl font-black mb-6">Budget Breakdown</h3>
            
            <div className="h-64 w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={(() => {
                      const categories: any = {};
                      trip.stops.forEach(s => {
                        if (s.accommodationCost) categories['Hotels'] = (categories['Hotels'] || 0) + s.accommodationCost;
                        if (s.transportCost) categories['Transport'] = (categories['Transport'] || 0) + s.transportCost;
                        s.activities?.forEach(a => {
                          categories[a.category] = (categories[a.category] || 0) + a.cost;
                        });
                      });
                      return Object.entries(categories).map(([name, value]) => ({ name, value }));
                    })()}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {['#0e7490', '#fb923c', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'].map((color, i) => (
                      <Cell key={i} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Budget</span>
                <span className="text-lg font-black text-slate-900">{formatCurrency(budget, trip.currency)}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-cyan-50 border border-cyan-100">
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">Daily Average</span>
                <span className="text-lg font-black text-cyan-700">
                  {formatCurrency(budget / Math.max(1, totalDays), trip.currency)}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
              <p className="text-xs text-slate-400 font-bold text-center uppercase tracking-widest">Plan your own adventure</p>
              <Button 
                onClick={() => navigate('/register')}
                className="w-full h-14 rounded-2xl bg-[#0e7490] hover:bg-[#0891b2] text-white font-bold shadow-xl shadow-cyan-900/10"
              >
                Join Traveloop Free
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Call to Action Footer */}
      <div className="max-w-6xl mx-auto px-6 pb-20 mt-20">
        <Card className="p-10 text-center space-y-6 bg-slate-950 text-white border-none shadow-3xl overflow-hidden relative rounded-[40px]">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0e7490]/40 to-transparent" />
          <div className="relative z-10">
            <h3 className="text-4xl font-black tracking-tight">Inspired by this trip?</h3>
            <p className="text-white/60 max-w-md mx-auto mt-2 text-lg">Create your own stunning itinerary in minutes with our AI travel planner.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button asChild size="lg" className="px-12 h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-[#fb923c] to-[#f97316] border-none text-white">
                <Link to="/register">Start Planning Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-12 h-16 text-lg font-bold rounded-2xl bg-white/10 hover:bg-white/20 border-white/20 text-white">
                <Link to="/">Learn More</Link>
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-center pt-12">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Powered by Traveloop ✈️</p>
        </div>
      </div>
    </div>
  );
};

export default SharedTripPage;
