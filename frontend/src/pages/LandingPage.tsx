import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Plane, MapPin, Sparkles, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#1e293b] selection:bg-primary/20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0e7490] to-[#22d3ee] flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Plane className="text-white" size={22} />
            </div>
            <span className="text-2xl font-black tracking-tight text-[#0f172a]">Traveloop</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-10">
            <a href="#" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Home</a>
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#explore" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Explore</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-slate-950 px-4">Log in</Link>
            <Button onClick={() => navigate('/register')} className="bg-[#0e7490] hover:bg-[#0891b2] text-white rounded-full px-8 font-bold shadow-lg shadow-cyan-600/20">
              Get started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 text-xs font-bold uppercase tracking-widest border border-cyan-100"
          >
            <Sparkles size={14} /> Built for the modern traveler
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight text-[#0f172a] leading-[0.9]"
          >
            Your next adventure, <br />
            <span className="bg-gradient-to-r from-[#fb923c] via-[#86efac] to-[#22d3ee] bg-clip-text text-transparent italic">
              beautifully planned.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed"
          >
            Wanderly turns scattered ideas into a stunning itinerary — cities, activities, budgets, and timelines, all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="h-16 px-10 rounded-2xl bg-gradient-to-r from-[#fb923c] to-[#f97316] text-white text-lg font-bold shadow-xl shadow-orange-500/30 hover:scale-105 transition-transform group"
            >
              Start Planning <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="h-16 px-10 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 text-lg font-bold hover:bg-slate-50 shadow-sm"
            >
              Explore Trips
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto rounded-[40px] bg-white shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-purple-500/5" />
          <div className="relative p-4 md:p-8">
            <div className="aspect-[16/9] rounded-3xl bg-slate-100 overflow-hidden shadow-inner flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600" 
                alt="Travel Destination" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/0 transition-all">
                <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                  <PlayIcon />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl font-black tracking-tight">Everything you need to roam.</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">From AI-powered suggestions to real-time budget tracking.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Sparkles, title: 'AI Itineraries', desc: 'Generate a perfect 7-day trip to Tokyo in 10 seconds.', color: 'text-cyan-500', bg: 'bg-cyan-50' },
              { icon: MapPin, title: 'Multi-City Route', desc: 'Drag and drop cities to find the perfect travel sequence.', color: 'text-violet-500', bg: 'bg-violet-50' },
              { icon: Heart, title: 'Shared planning', desc: 'Invite friends to vote on activities and split the costs.', color: 'text-pink-500', bg: 'bg-pink-50' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="space-y-4 group">
                <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center ${color} shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-[#0f172a] text-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Plane className="text-white" size={22} />
            </div>
            <span className="text-2xl font-black tracking-tight">Traveloop</span>
          </div>
          <div className="flex gap-10 text-white/60 text-sm font-medium">
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
          <p className="text-white/40 text-xs">© 2026 Traveloop. All adventures reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const PlayIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 6.5V17.5L17.5 12L7 6.5Z" />
  </svg>
);

export default LandingPage;
