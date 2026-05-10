import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Plane, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPwd) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fbff]">
      {/* Right panel - Form (Flipped for variety) */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100 my-10"
        >
          <div className="space-y-2 text-center">
             <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center">
                <Plane className="text-white" size={16} />
              </div>
              <span className="font-black text-xl tracking-tight">Traveloop</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Create account ✨</h1>
            <p className="text-slate-500">Start your journey with us today.</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-medium border border-rose-100 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User size={18} className="text-slate-400" />}
                required
                className="h-14 rounded-2xl border-slate-200 bg-slate-50/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <Input
                type="email"
                placeholder="hello@traveloop.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={18} className="text-slate-400" />}
                required
                className="h-14 rounded-2xl border-slate-200 bg-slate-50/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <Input
                type={showPwd ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={18} className="text-slate-400" />}
                iconRight={
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="p-2 text-slate-400">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                required
                className="h-14 rounded-2xl border-slate-200 bg-slate-50/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
              <Input
                type={showPwd ? 'text' : 'password'}
                placeholder="Repeat your password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                icon={<ShieldCheck size={18} className="text-slate-400" />}
                required
                className="h-14 rounded-2xl border-slate-200 bg-slate-50/50"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-lg shadow-xl shadow-cyan-900/10 transition-all mt-4" 
              disabled={loading}
            >
              {loading ? "Creating account..." : "Join Wanderly"}
            </Button>
          </form>

          <p className="text-center text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-600 font-bold hover:underline">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Left panel - Decorative */}
      <div className="hidden lg:flex lg:w-[40%] bg-slate-900 flex-col items-center justify-center p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/50 to-transparent" />
        <div className="relative z-10 space-y-8 text-white">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto border border-white/10">
            <Plane className="text-cyan-400" size={40} />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tight leading-tight">
              Join thousands of <br />
              <span className="text-cyan-400 italic">happy travelers.</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-sm mx-auto">
              Start building your dream itineraries and sharing adventures with the world today.
            </p>
          </div>
          <div className="pt-10 grid grid-cols-2 gap-4">
            {[
              { label: '50k+', sub: 'Users' },
              { label: '120+', sub: 'Countries' }
            ].map(stat => (
              <div key={stat.label} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-2xl font-black text-white">{stat.label}</div>
                <div className="text-xs font-bold text-white/40 uppercase tracking-widest">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
