import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Search, MapPin, Calendar, Clock, Trash2, Edit,
  Eye, MoreHorizontal, Filter, Plane
} from 'lucide-react';
import { tripService } from '../services/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { SkeletonCard, EmptyState, Modal } from '../components/ui/LoadingStates';
import { formatDate, getTripStatusColor, getDaysCount, calculateTripBudget, formatCurrency } from '../utils';
import type { Trip } from '../types';

const TripsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; trip: Trip | null }>({ open: false, trip: null });

  const { data, isLoading } = useQuery({
    queryKey: ['trips', search, statusFilter],
    queryFn: () => tripService.getAll({ search: search || undefined, status: statusFilter || undefined }).then(r => r.data.trips),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tripService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteModal({ open: false, trip: null });
    },
  });

  const trips: Trip[] = data || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground mt-1">
            {trips.length} trip{trips.length !== 1 ? 's' : ''} in total
          </p>
        </div>
        <Button onClick={() => navigate('/trips/new')} size="lg">
          <Plus size={20} /> New Trip
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search trips..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={16} />}
          className="sm:max-w-xs"
        />
        <div className="flex gap-2 flex-wrap">
          {['', 'planning', 'upcoming', 'ongoing', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status === '' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Trip Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : trips.length === 0 ? (
        <EmptyState
          icon={<Plane size={40} />}
          title="No trips found"
          description="Start planning your first adventure or try different filters."
          action={
            <Button onClick={() => navigate('/trips/new')}>
              <Plus size={16} /> Create Your First Trip
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip, idx) => (
            <motion.div
              key={trip._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card hover className="overflow-hidden group">
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden bg-muted">
                  {trip.coverImage ? (
                    <img
                      src={trip.coverImage.startsWith('/') ? `http://localhost:5000${trip.coverImage}` : trip.coverImage}
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full hero-gradient flex items-center justify-center text-6xl">
                      ✈️
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <Badge className={getTripStatusColor(trip.status)}>{trip.status}</Badge>
                    <div className="flex gap-1">
                      {trip.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-white/20 backdrop-blur-sm text-white rounded-full px-2 py-0.5">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2">{trip.title}</h3>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {formatDate(trip.startDate, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {getDaysCount(trip.startDate, trip.endDate)} days
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin size={13} />
                    <span className="truncate">
                      {trip.stops?.length > 0
                        ? trip.stops.map(s => s.city).join(' → ')
                        : 'No stops yet'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="font-semibold text-sm">
                        {formatCurrency(calculateTripBudget(trip.stops || []), trip.currency)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => navigate(`/trips/${trip._id}`)}
                        title="View"
                      >
                        <Eye size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => navigate(`/trips/${trip._id}/edit`)}
                        title="Edit"
                      >
                        <Edit size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteModal({ open: true, trip })}
                        title="Delete"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, trip: null })}
        title="Delete Trip"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to delete <strong>{deleteModal.trip?.title}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteModal({ open: false, trip: null })}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(deleteModal.trip!._id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Trip'}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default TripsPage;
