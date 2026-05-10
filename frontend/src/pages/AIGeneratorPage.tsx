import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Send, MapPin, Calendar, DollarSign, 
  Compass, Coffee, Info, Save, RefreshCw
} from 'lucide-react';
import { aiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingPage } from '../components/ui/LoadingStates';

const AIGeneratorPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    budget: 'Medium',
    travelStyle: 'Balanced',
    interests: ''
  });
  const [itinerary, setItinerary] = useState<any>(null);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await aiService.generate(formData);
      setItinerary(res.data.itinerary);
    } catch (error) {
      console.error(error);
      alert('Failed to generate itinerary. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!itinerary) return;
    setLoading(true);
    try {
      const res = await aiService.save(itinerary);
      navigate(`/trips/${res.data.tripId}`);
    } catch (error) {
      console.error(error);
      alert('Failed to save trip');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage message="Our AI is crafting your perfect journey..." />;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold"
        >
          <Sparkles size={16} /> AI-Powered Travel Planning
        </motion.div>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">Where to next?</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Tell us your preferences and let our AI create a personalized, day-by-day itinerary tailored just for you.
        </p>
      </div>

      {!itinerary ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <Card className="lg:col-span-2 p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input 
                label="Destination" 
                placeholder="e.g. Tokyo, Japan" 
                value={formData.destination} 
                onChange={e => setFormData({...formData, destination: e.target.value})}
                icon={<MapPin size={18} />}
              />
              <Input 
                label="Duration (Days)" 
                type="number" 
                value={String(formData.days)} 
                onChange={e => setFormData({...formData, days: Number(e.target.value)})}
                icon={<Calendar size={18} />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Budget Level</label>
                <div className="flex gap-2">
                  {['Economy', 'Medium', 'Luxury'].map(b => (
                    <button
                      key={b}
                      onClick={() => setFormData({...formData, budget: b})}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${formData.budget === b ? 'bg-primary text-primary-foreground border-primary shadow-lg' : 'bg-card hover:bg-muted border-border'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Travel Style</label>
                <div className="flex gap-2">
                  {['Relaxed', 'Balanced', 'Fast-paced'].map(s => (
                    <button
                      key={s}
                      onClick={() => setFormData({...formData, travelStyle: s})}
                      className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${formData.travelStyle === s ? 'bg-primary text-primary-foreground border-primary shadow-lg' : 'bg-card hover:bg-muted border-border'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground ml-1">Interests & Preferences</label>
              <textarea 
                className="w-full h-32 px-4 py-3 rounded-2xl border border-border bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                placeholder="e.g. Foodie, Anime, History, Nature, Nightlife..."
                value={formData.interests}
                onChange={e => setFormData({...formData, interests: e.target.value})}
              />
            </div>

            <Button size="lg" className="w-full h-14 text-lg font-bold gap-2" onClick={handleGenerate} disabled={!formData.destination}>
              Generate My Dream Trip <Send size={20} />
            </Button>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 hero-gradient text-white">
              <h3 className="text-xl font-bold mb-4">Why use AI?</h3>
              <ul className="space-y-4">
                {[
                  { icon: Compass, text: 'Discover hidden gems' },
                  { icon: DollarSign, text: 'Smart budget allocation' },
                  { icon: Coffee, text: 'Authentic food spots' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                    <span className="font-medium">{text}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <div className="p-6 bg-muted/50 rounded-3xl border border-dashed border-border flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">✨</div>
              <p className="text-sm text-muted-foreground">Detailed daily schedule with timing, costs and local secrets.</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">{itinerary.tripTitle}</h2>
              <p className="text-muted-foreground">Total Estimated Budget: <span className="text-foreground font-semibold">{itinerary.totalEstimatedBudget}</span></p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2" onClick={() => setItinerary(null)}>
                <RefreshCw size={16} /> Regenerate
              </Button>
              <Button className="gap-2" onClick={handleSave}>
                <Save size={16} /> Save to My Trips
              </Button>
            </div>
          </div>

          {/* Tips Section */}
          <Card className="p-6 bg-primary/5 border-primary/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Info size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Local Travel Tips</h4>
                <div className="flex flex-wrap gap-2">
                  {itinerary.travelTips.map((tip: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-white dark:bg-black/20">{tip}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Itinerary Timeline */}
          <div className="space-y-12 relative before:absolute before:left-[17px] before:top-8 before:bottom-8 before:w-0.5 before:bg-border">
            {itinerary.days.map((day: any, idx: number) => (
              <div key={idx} className="relative pl-12">
                {/* Day Dot */}
                <div className="absolute left-0 top-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold border-4 border-background z-10">
                  {day.day}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold">Day {day.day}: {day.city}</h3>
                    <Badge className="bg-muted text-muted-foreground">Budget: {day.dailyBudget}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {day.activities.map((act: any, i: number) => (
                      <Card key={i} className="p-5 hover:border-primary/30 transition-colors group">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm font-bold text-primary group-hover:underline">{act.time}</span>
                          <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-lg">{act.estimatedCost}</span>
                        </div>
                        <h4 className="font-bold text-lg mb-1">{act.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{act.description}</p>
                      </Card>
                    ))}
                  </div>

                  {day.foodSuggestions?.length > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                      <Coffee size={18} className="text-orange-500" />
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm font-semibold text-orange-600 mr-2">Food Suggestions:</span>
                        {day.foodSuggestions.map((food: string, i: number) => (
                          <span key={i} className="text-sm text-muted-foreground">{food}{i < day.foodSuggestions.length - 1 ? ' • ' : ''}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIGeneratorPage;
