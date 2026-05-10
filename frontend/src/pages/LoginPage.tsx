import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Plane } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fbff]">
      {/* Left panel - Decorative */}
      <div className="hidden lg:flex lg:w-[40%] bg-white border-r border-slate-200 flex-col items-center justify-center p-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="w-20 h-20 rounded-3xl bg-cyan-50 flex items-center justify-center mx-auto shadow-sm">
            <Plane className="text-[#0e7490]" size={40} />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Ready for your next <br />
              <span className="bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent italic">adventure?</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed max-w-sm mx-auto">
              Log in to access your beautifully planned itineraries and discover new destinations.
            </p>
          </div>
          <div className="pt-10 flex justify-center gap-3">
             <div className="w-2 h-2 rounded-full bg-cyan-500" />
             <div className="w-2 h-2 rounded-full bg-slate-200" />
             <div className="w-2 h-2 rounded-full bg-slate-200" />
          </div>
        </motion.div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-slate-200 border border-slate-100"
        >
          <div className="space-y-2 text-center">
             <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center">
                <Plane className="text-white" size={16} />
              </div>
              <span className="font-black text-xl tracking-tight">Traveloop</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Welcome back!</h1>
            <p className="text-slate-500">Sign in to continue your journey.</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-medium border border-rose-100 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <Input
                type="email"
                placeholder="hello@traveloop.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={18} className="text-slate-400" />}
                required
                className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <Input
                type={showPwd ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={18} className="text-slate-400" />}
                iconRight={
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                required
                className="h-14 rounded-2xl border-slate-200 bg-slate-50/50 focus:bg-white"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg shadow-xl shadow-slate-900/10 transition-all active:scale-[0.98]" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-slate-500 font-medium">
            New here?{' '}
            <Link to="/register" className="text-cyan-600 font-bold hover:underline">
              Create a free account
            </Link>
          </p>

          <div className="pt-6 border-t border-slate-100">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Demo Credentials</p>
               <p className="text-sm text-slate-600">Email: <span className="font-bold">demo@traveloop.com</span></p>
               <p className="text-sm text-slate-600">Password: <span className="font-bold">demo1234</span></p>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
