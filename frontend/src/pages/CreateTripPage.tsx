import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronLeft, Upload, Calendar, MapPin, Tag, X, Plus
} from 'lucide-react';
import { tripService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea, Select } from '../components/ui/FormElements';

const CreateTripPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    currency: 'USD',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    if (city && country) {
      setForm(prev => ({
        ...prev,
        title: `${city} Exploration 🌍`,
        description: `Planning an amazing journey to ${city}, ${country}!`,
        tags: [city.toLowerCase(), country.toLowerCase()]
      }));
    }
  }, [searchParams]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => tripService.create(formData),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate(`/trips/${res.data.trip._id}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create trip');
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.startDate || !form.endDate) {
      setError('Title, start date, and end date are required');
      return;
    }
    if (new Date(form.startDate) > new Date(form.endDate)) {
      setError('End date must be after start date');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('startDate', form.startDate);
    formData.append('endDate', form.endDate);
    formData.append('currency', form.currency);
    formData.append('tags', JSON.stringify(form.tags));
    if (coverImage) formData.append('coverImage', coverImage);

    mutation.mutate(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon-sm" onClick={() => navigate(-1)}>
          <ChevronLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Trip ✈️</h1>
          <p className="text-muted-foreground">Plan your next great adventure</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm border border-destructive/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cover Image */}
        <div
          className="relative h-56 rounded-2xl overflow-hidden border-2 border-dashed border-border cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white font-medium">Change Cover Image</p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <Upload size={32} />
              <div className="text-center">
                <p className="font-medium">Upload Cover Image</p>
                <p className="text-sm">PNG, JPG, WEBP up to 5MB</p>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Basic Info */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Trip Details</h2>
          <Input
            label="Trip Title *"
            placeholder="e.g., European Summer Adventure"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            icon={<MapPin size={16} />}
          />
          <Textarea
            label="Description"
            placeholder="What's this trip about? Add some notes..."
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date *"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
              icon={<Calendar size={16} />}
            />
            <Input
              label="End Date *"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
              icon={<Calendar size={16} />}
            />
          </div>
          <Select
            label="Currency"
            value={form.currency}
            onChange={(e) => setForm(prev => ({ ...prev, currency: e.target.value }))}
            options={[
              { value: 'USD', label: '🇺🇸 USD - US Dollar' },
              { value: 'EUR', label: '🇪🇺 EUR - Euro' },
              { value: 'GBP', label: '🇬🇧 GBP - British Pound' },
              { value: 'JPY', label: '🇯🇵 JPY - Japanese Yen' },
              { value: 'INR', label: '🇮🇳 INR - Indian Rupee' },
              { value: 'AUD', label: '🇦🇺 AUD - Australian Dollar' },
              { value: 'CAD', label: '🇨🇦 CAD - Canadian Dollar' },
            ]}
          />
        </div>

        {/* Tags */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Tags</h2>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., beach, adventure, family"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              icon={<Tag size={16} />}
              className="flex-1"
            />
            <Button type="button" variant="secondary" onClick={addTag}>Add</Button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>
                    <X size={12} className="hover:text-destructive" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" size="lg" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Plus size={18} /> Create Trip
              </span>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateTripPage;
