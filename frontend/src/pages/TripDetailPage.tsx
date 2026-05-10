import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  ChevronLeft, Plus, MapPin, Calendar, DollarSign, Clock,
  Share2, Edit, Trash2, GripVertical, ChevronDown, ChevronUp,
  Copy, Check, Backpack, BookOpen
} from 'lucide-react';
import { tripService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal, LoadingPage, EmptyState } from '../components/ui/LoadingStates';
import { Textarea, Select } from '../components/ui/FormElements';
import {
  formatDate, formatCurrency, getTripStatusColor, getDaysCount,
  getBudgetBreakdown, getActivityCategoryIcon,
  getActivityCategoryColor, resolveImageUrl
} from '../utils';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import type { Trip, Stop, Activity } from '../types';

const ACTIVITY_CATEGORIES = ['Adventure','Food','Relaxation','Sightseeing','Culture','Shopping','Other'];

const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'itinerary'|'budget'|'packing'|'notes'>('itinerary');
  const [expandedStops, setExpandedStops] = useState<Set<string>>(new Set());
  const [addStopModal, setAddStopModal] = useState(false);
  const [addActivityModal, setAddActivityModal] = useState<{open:boolean;stopId:string}>({open:false,stopId:''});
  const [shareModal, setShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Packing & Notes state
  const [packingItemForm, setPackingItemForm] = useState({ name: '', category: 'Essentials', quantity: 1 });
  const [noteForm, setNoteForm] = useState({ title: '', content: '', color: '#fef3c7' });

  const [stopForm, setStopForm] = useState({ city:'', country:'', arrivalDate:'', departureDate:'', accommodation:'', accommodationCost:0, transportCost:0, notes:'' });
  const [activityForm, setActivityForm] = useState({ name:'', category:'Sightseeing', description:'', cost:0, startTime:'', notes:'' });

  const { data, isLoading } = useQuery({
    queryKey: ['trip', id],
    queryFn: () => tripService.getById(id!).then(r => r.data.trip as Trip),
  });

  const addStopMutation = useMutation({
    mutationFn: (data: any) => tripService.addStop(id!, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['trip', id] }); setAddStopModal(false); setStopForm({ city:'', country:'', arrivalDate:'', departureDate:'', accommodation:'', accommodationCost:0, transportCost:0, notes:'' }); },
  });

  const deleteStopMutation = useMutation({
    mutationFn: (stopId: string) => tripService.deleteStop(id!, stopId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trip', id] }),
  });

  const addActivityMutation = useMutation({
    mutationFn: ({ stopId, data }: any) => tripService.addActivity(id!, stopId, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['trip', id] }); setAddActivityModal({open:false,stopId:''}); setActivityForm({ name:'', category:'Sightseeing', description:'', cost:0, startTime:'', notes:'' }); },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: ({ stopId, activityId }: any) => tripService.deleteActivity(id!, stopId, activityId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trip', id] }),
  });

  const shareMutation = useMutation({
    mutationFn: () => tripService.share(id!),
    onSuccess: (res) => { setShareUrl(res.data.shareUrl); setShareModal(true); },
  });

  const { data: packingItems, refetch: refetchPacking } = useQuery({
    queryKey: ['packing', id],
    queryFn: () => tripService.getPackingItems(id!).then(r => r.data.items),
    enabled: activeTab === 'packing',
  });

  const { data: notes, refetch: refetchNotes } = useQuery({
    queryKey: ['notes', id],
    queryFn: () => tripService.getNotes(id!).then(r => r.data.notes),
    enabled: activeTab === 'notes',
  });

  const addPackingMutation = useMutation({
    mutationFn: (data: any) => tripService.addPackingItem(id!, data),
    onSuccess: () => { refetchPacking(); setPackingItemForm({ name: '', category: 'Essentials', quantity: 1 }); },
  });

  const togglePackingMutation = useMutation({
    mutationFn: ({ itemId, packed }: any) => tripService.updatePackingItem(id!, itemId, { packed }),
    onSuccess: () => refetchPacking(),
  });

  const addNoteMutation = useMutation({
    mutationFn: (data: any) => tripService.addNote(id!, data),
    onSuccess: () => { refetchNotes(); setNoteForm({ title: '', content: '', color: '#fef3c7' }); },
  });

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !data) return;
    const items = Array.from(data.stops);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    await tripService.reorderStops(id!, items.map((s: any) => s._id));
    queryClient.invalidateQueries({ queryKey: ['trip', id] });
  };

  const toggleStop = (stopId: string) => {
    setExpandedStops(prev => {
      const next = new Set(prev);
      next.has(stopId) ? next.delete(stopId) : next.add(stopId);
      return next;
    });
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return <LoadingPage message="Loading trip details..." />;
  if (!data) return <div className="text-center py-20">Trip not found</div>;

  const budget = getBudgetBreakdown(data.stops || []);
  const totalDays = getDaysCount(data.startDate, data.endDate);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate('/trips')}><ChevronLeft size={18}/></Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{data.title}</h1>
          <div className="flex items-center gap-3 text-muted-foreground text-sm mt-1 flex-wrap">
            <span className="flex items-center gap-1"><Calendar size={13}/>{formatDate(data.startDate)} — {formatDate(data.endDate)}</span>
            <span className="flex items-center gap-1"><Clock size={13}/>{totalDays} days</span>
            <Badge className={getTripStatusColor(data.status)}>{data.status}</Badge>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={() => shareMutation.mutate()}>
            <Share2 size={15}/> Share
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/trips/${id}/edit`)}>
            <Edit size={15}/> Edit
          </Button>
        </div>
      </div>

      {/* Cover */}
      {data.coverImage && (
        <div className="h-52 rounded-2xl overflow-hidden">
          <img src={resolveImageUrl(data.coverImage)!} alt={data.title} className="w-full h-full object-cover"/>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl overflow-x-auto">
        {[
          { key: 'itinerary', label: 'Itinerary', icon: MapPin },
          { key: 'budget', label: 'Budget', icon: DollarSign },
          { key: 'packing', label: 'Packing', icon: Backpack },
          { key: 'notes', label: 'Notes', icon: BookOpen },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === key ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Icon size={15}/>{label}
          </button>
        ))}
      </div>

      {/* ITINERARY TAB */}
      {activeTab === 'itinerary' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Trip Stops ({data.stops?.length || 0})</h2>
            <Button size="sm" onClick={() => setAddStopModal(true)}><Plus size={16}/> Add City</Button>
          </div>

          {!data.stops?.length ? (
            <EmptyState icon="🗺️" title="No stops yet" description="Add cities to build your itinerary" action={<Button onClick={() => setAddStopModal(true)}><Plus size={16}/>Add First City</Button>}/>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="stops">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-6 relative before:absolute before:left-[19px] before:top-8 before:bottom-8 before:w-0.5 before:bg-border">
                    {data.stops.map((stop: Stop, idx: number) => (
                      <Draggable key={stop._id} draggableId={stop._id} index={idx}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps}>
                            <Card className="overflow-hidden">
                              <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => toggleStop(stop._id)}>
                                <div {...provided.dragHandleProps} className="text-muted-foreground cursor-grab active:cursor-grabbing" onClick={e=>e.stopPropagation()}>
                                  <GripVertical size={18}/>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                                  {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold">{stop.city}, {stop.country}</h3>
                                  <p className="text-xs text-muted-foreground">{formatDate(stop.arrivalDate)} → {formatDate(stop.departureDate)} · {stop.activities?.length || 0} activities</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-green-600">{formatCurrency((stop.accommodationCost||0)+(stop.transportCost||0)+(stop.activities?.reduce((s:number,a:any)=>s+a.cost,0)||0))}</span>
                                  <Button variant="ghost" size="icon-sm" onClick={e=>{e.stopPropagation();deleteStopMutation.mutate(stop._id)}} className="text-destructive hover:bg-destructive/10">
                                    <Trash2 size={14}/>
                                  </Button>
                                  {expandedStops.has(stop._id) ? <ChevronUp size={16} className="text-muted-foreground"/> : <ChevronDown size={16} className="text-muted-foreground"/>}
                                </div>
                              </div>

                              {expandedStops.has(stop._id) && (
                                <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                                  <div className="grid grid-cols-3 gap-3 text-sm">
                                    <div className="bg-muted/50 rounded-xl p-3">
                                      <p className="text-muted-foreground text-xs">🏨 Hotel</p>
                                      <p className="font-semibold">{formatCurrency(stop.accommodationCost||0)}</p>
                                    </div>
                                    <div className="bg-muted/50 rounded-xl p-3">
                                      <p className="text-muted-foreground text-xs">🚗 Transport</p>
                                      <p className="font-semibold">{formatCurrency(stop.transportCost||0)}</p>
                                    </div>
                                    <div className="bg-muted/50 rounded-xl p-3">
                                      <p className="text-muted-foreground text-xs">🎯 Activities</p>
                                      <p className="font-semibold">{formatCurrency(stop.activities?.reduce((s:number,a:any)=>s+a.cost,0)||0)}</p>
                                    </div>
                                  </div>
                                  {stop.accommodation && <p className="text-sm text-muted-foreground">🏨 {stop.accommodation}</p>}

                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-sm">Activities</h4>
                                    <Button size="sm" variant="outline" onClick={()=>setAddActivityModal({open:true,stopId:stop._id})}>
                                      <Plus size={13}/> Add Activity
                                    </Button>
                                  </div>
                                  <div className="space-y-2">
                                    {stop.activities?.map((activity: Activity) => (
                                      <div key={activity._id} className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                                        <span className="text-lg">{getActivityCategoryIcon(activity.category)}</span>
                                        <div className="flex-1">
                                          <p className="font-medium text-sm">{activity.name}</p>
                                          <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getActivityCategoryColor(activity.category)}`}>{activity.category}</span>
                                            {activity.startTime && <span className="text-xs text-muted-foreground">⏰ {activity.startTime}</span>}
                                          </div>
                                        </div>
                                        <span className="text-sm font-semibold text-green-600">{formatCurrency(activity.cost||0)}</span>
                                        <Button variant="ghost" size="icon-sm" className="text-destructive" onClick={()=>deleteActivityMutation.mutate({stopId:stop._id,activityId:activity._id})}>
                                          <Trash2 size={13}/>
                                        </Button>
                                      </div>
                                    ))}
                                    {!stop.activities?.length && <p className="text-sm text-muted-foreground text-center py-3">No activities yet</p>}
                                  </div>
                                </div>
                              )}
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      )}

      {/* BUDGET TAB */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Budget Breakdown</h2>
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
              {data.currency}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 p-6 flex flex-col items-center justify-center min-h-[300px]">
              {budget.total > 0 ? (
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Accommodation', value: budget.accommodation, color: '#3b82f6' },
                          { name: 'Transport', value: budget.transport, color: '#f97316' },
                          { name: 'Food', value: budget.food, color: '#ef4444' },
                          { name: 'Activities', value: budget.activities, color: '#8b5cf6' },
                        ].filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {[
                          { name: 'Accommodation', color: '#3b82f6' },
                          { name: 'Transport', color: '#f97316' },
                          { name: 'Food', color: '#ef4444' },
                          { name: 'Activities', color: '#8b5cf6' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value, data.currency)}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <div className="text-4xl">📊</div>
                  <p className="text-sm text-muted-foreground">No data to display</p>
                </div>
              )}
            </Card>

            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label:'Hotel', value: budget.accommodation, color:'bg-blue-500', icon: '🏨' },
                  { label:'Transport', value: budget.transport, color:'bg-orange-500', icon: '🚗' },
                  { label:'Food', value: budget.food, color:'bg-red-500', icon: '🍽️' },
                  { label:'Activities', value: budget.activities, color:'bg-violet-500', icon: '🎯' },
                ].map(({ label, value, color, icon }) => (
                  <Card key={label} className="p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform">{icon}</div>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{label}</p>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(value, data.currency)}</p>
                    <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: budget.total ? `${(value/budget.total*100)}%` : '0%' }}/>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-6 bg-gradient-to-br from-violet-600 to-indigo-600 text-white border-none shadow-xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex justify-between items-end">
                  <div>
                    <p className="text-white/80 text-sm font-medium">Total Trip Cost</p>
                    <p className="text-4xl font-black mt-1">{formatCurrency(budget.total, data.currency)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-xs font-medium uppercase">Daily Average</p>
                    <p className="text-xl font-bold">{formatCurrency(totalDays > 0 ? budget.total/totalDays : 0, data.currency)}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {budget.total > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6">Budget Trend per City</h3>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.stops.map((stop) => {
                      const stopCost = (stop.accommodationCost||0) + (stop.transportCost||0) + (stop.activities?.reduce((s,a) => s+a.cost, 0)||0);
                      return {
                        name: stop.city,
                        cost: stopCost,
                      };
                    })}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#64748b' }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#64748b' }}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(val: number) => [formatCurrency(val, data.currency), 'Cost']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="#8b5cf6" 
                      strokeWidth={3} 
                      dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {budget.total === 0 && (
            <div className="text-center text-muted-foreground py-8 bg-muted/30 rounded-3xl border border-dashed border-border">
              Add stops and activities with costs to see your detailed budget breakdown
            </div>
          )}
        </div>
      )}

      {/* PACKING + NOTES tabs */}
      {activeTab === 'packing' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🎒 Quick Add</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                placeholder="e.g. Passport, Charger..." 
                value={packingItemForm.name}
                onChange={e => setPackingItemForm({...packingItemForm, name: e.target.value})}
                className="flex-1"
              />
              <Select 
                value={packingItemForm.category}
                onChange={e => setPackingItemForm({...packingItemForm, category: e.target.value})}
                options={['Essentials', 'Clothing', 'Electronics', 'Documents', 'Other'].map(c => ({ value: c, label: c }))}
                className="w-full sm:w-40"
              />
              <Button 
                onClick={() => addPackingMutation.mutate(packingItemForm)}
                disabled={!packingItemForm.name || addPackingMutation.isPending}
              >
                Add
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['Essentials', 'Clothing', 'Electronics', 'Documents', 'Other'].map(category => {
              const items = packingItems?.filter((i: any) => i.category === category) || [];
              if (items.length === 0 && activeTab === 'packing' && packingItems?.length > 0) return null;
              return (
                <Card key={category} className="p-6">
                  <h4 className="font-bold mb-4 flex items-center justify-between">
                    {category}
                    <Badge variant="outline">{items.length}</Badge>
                  </h4>
                  <div className="space-y-2">
                    {items.map((item: any) => (
                      <div 
                        key={item._id} 
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${item.packed ? 'bg-green-50/50 opacity-60' : 'bg-muted/30'}`}
                      >
                        <input 
                          type="checkbox" 
                          checked={item.packed} 
                          onChange={(e) => togglePackingMutation.mutate({ itemId: item._id, packed: e.target.checked })}
                          className="w-5 h-5 rounded-lg border-border text-primary focus:ring-primary"
                        />
                        <span className={`flex-1 text-sm ${item.packed ? 'line-through' : ''}`}>
                          {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                        </span>
                      </div>
                    ))}
                    {items.length === 0 && <p className="text-xs text-muted-foreground italic text-center py-4">No items in this category</p>}
                  </div>
                </Card>
              );
            })}
          </div>
          {(!packingItems || packingItems.length === 0) && (
            <EmptyState icon="🎒" title="Your suitcase is empty" description="Start adding items you don't want to forget!" />
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">📓 New Note</h3>
            <div className="space-y-4">
              <Input 
                placeholder="Title..." 
                value={noteForm.title}
                onChange={e => setNoteForm({...noteForm, title: e.target.value})}
              />
              <Textarea 
                placeholder="Write something memorable..." 
                value={noteForm.content}
                onChange={e => setNoteForm({...noteForm, content: e.target.value})}
                rows={3}
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {['#fef3c7', '#dcfce7', '#dbeafe', '#f3e8ff', '#ffe4e6'].map(color => (
                    <button 
                      key={color} 
                      onClick={() => setNoteForm({...noteForm, color})}
                      className={`w-8 h-8 rounded-full border-2 ${noteForm.color === color ? 'border-primary' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <Button 
                  onClick={() => addNoteMutation.mutate(noteForm)}
                  disabled={!noteForm.content || addNoteMutation.isPending}
                >
                  Save Note
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes?.map((note: any) => (
              <motion.div 
                key={note._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl shadow-sm border border-border/50 relative overflow-hidden"
                style={{ backgroundColor: note.color }}
              >
                {note.title && <h4 className="font-bold text-lg mb-2 text-slate-900">{note.title}</h4>}
                <p className="text-sm text-slate-800 leading-relaxed">{note.content}</p>
                <p className="text-[10px] text-slate-500 mt-4 uppercase font-bold tracking-widest">{formatDate(note.createdAt)}</p>
              </motion.div>
            ))}
          </div>
          {(!notes || notes.length === 0) && (
            <EmptyState icon="📝" title="No notes yet" description="Capture thoughts, reminders, or journal entries." />
          )}
        </div>
      )}

      {/* Add Stop Modal */}
      <Modal isOpen={addStopModal} onClose={() => setAddStopModal(false)} title="Add City Stop" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="City *" placeholder="Paris" value={stopForm.city} onChange={e=>setStopForm(p=>({...p,city:e.target.value}))} icon={<MapPin size={15}/>}/>
            <Input label="Country *" placeholder="France" value={stopForm.country} onChange={e=>setStopForm(p=>({...p,country:e.target.value}))}/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Arrival Date" type="date" value={stopForm.arrivalDate} onChange={e=>setStopForm(p=>({...p,arrivalDate:e.target.value}))}/>
            <Input label="Departure Date" type="date" value={stopForm.departureDate} onChange={e=>setStopForm(p=>({...p,departureDate:e.target.value}))}/>
          </div>
          <Input label="Accommodation" placeholder="Hotel / Airbnb name" value={stopForm.accommodation} onChange={e=>setStopForm(p=>({...p,accommodation:e.target.value}))}/>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Hotel Cost ($)" type="number" value={String(stopForm.accommodationCost)} onChange={e=>setStopForm(p=>({...p,accommodationCost:Number(e.target.value)}))}/>
            <Input label="Transport Cost ($)" type="number" value={String(stopForm.transportCost)} onChange={e=>setStopForm(p=>({...p,transportCost:Number(e.target.value)}))}/>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={()=>setAddStopModal(false)}>Cancel</Button>
            <Button onClick={()=>addStopMutation.mutate(stopForm)} disabled={addStopMutation.isPending || !stopForm.city || !stopForm.country}>
              {addStopMutation.isPending ? 'Adding...' : 'Add Stop'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Activity Modal */}
      <Modal isOpen={addActivityModal.open} onClose={()=>setAddActivityModal({open:false,stopId:''})} title="Add Activity">
        <div className="space-y-4">
          <Input label="Activity Name *" placeholder="Visit Eiffel Tower" value={activityForm.name} onChange={e=>setActivityForm(p=>({...p,name:e.target.value}))}/>
          <Select label="Category" value={activityForm.category} onChange={e=>setActivityForm(p=>({...p,category:e.target.value}))} options={ACTIVITY_CATEGORIES.map(c=>({value:c,label:c}))}/>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Time" type="time" value={activityForm.startTime} onChange={e=>setActivityForm(p=>({...p,startTime:e.target.value}))}/>
            <Input label="Cost ($)" type="number" value={String(activityForm.cost)} onChange={e=>setActivityForm(p=>({...p,cost:Number(e.target.value)}))}/>
          </div>
          <Textarea label="Notes" placeholder="Any notes..." value={activityForm.notes} onChange={e=>setActivityForm(p=>({...p,notes:e.target.value}))} rows={2}/>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={()=>setAddActivityModal({open:false,stopId:''})}>Cancel</Button>
            <Button onClick={()=>addActivityMutation.mutate({stopId:addActivityModal.stopId,data:activityForm})} disabled={addActivityMutation.isPending||!activityForm.name}>
              {addActivityMutation.isPending ? 'Adding...' : 'Add Activity'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal isOpen={shareModal} onClose={()=>setShareModal(false)} title="Share Trip">
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">Anyone with this link can view your trip itinerary.</p>
          <div className="flex gap-2">
            <input readOnly value={shareUrl} className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-muted text-sm"/>
            <Button variant="outline" onClick={copyShareUrl}>
              {copied ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
            </Button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={()=>window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=Check out my trip!`,'_blank')}>
              Twitter
            </Button>
            <Button variant="outline" size="sm" onClick={()=>window.open(`https://wa.me/?text=Check out my trip! ${shareUrl}`,'_blank')}>
              WhatsApp
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default TripDetailPage;
