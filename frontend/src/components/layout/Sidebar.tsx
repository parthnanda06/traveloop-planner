import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Map, Plus, Sparkles,
  User, LogOut, Moon, Sun, Menu, X, ChevronRight, Plane
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trips', icon: Map, label: 'My Trips' },
  { to: '/trips/new', icon: Plus, label: 'New Trip' },
  { to: '/ai-generator', icon: Sparkles, label: 'AI Planner', badge: 'New' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden lg:flex flex-col h-screen sticky top-0 bg-card border-r border-border overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0e7490] to-[#22d3ee] flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/30">
          <Plane className="text-white" size={20} />
        </div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-black text-xl tracking-tight text-slate-900"
          >
            Traveloop
          </motion.span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'sidebar-link',
                isActive && 'active',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        <button
          onClick={toggleTheme}
          className={cn('sidebar-link w-full', isCollapsed && 'justify-center px-2')}
          title={isCollapsed ? 'Toggle Theme' : undefined}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          {!isCollapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* User info */}
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className={cn(
            'sidebar-link w-full text-destructive hover:bg-destructive/10',
            isCollapsed && 'justify-center px-2'
          )}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

// Mobile navbar
export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0e7490] to-[#22d3ee] flex items-center justify-center">
            <Plane className="text-white" size={16} />
          </div>
          <span className="font-black text-lg tracking-tight">Traveloop</span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="text-foreground p-2 rounded-xl hover:bg-muted"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border flex flex-col"
          >
              <div className="flex items-center justify-between px-5 py-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0e7490] to-[#22d3ee] flex items-center justify-center">
                    <Plane className="text-white" size={18} />
                  </div>
                  <span className="font-black text-lg tracking-tight">Traveloop</span>
                </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
              {navItems.map(({ to, icon: Icon, label }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className={cn('sidebar-link', isActive && 'active')}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="px-4 py-4 border-t border-border space-y-2">
              <button onClick={toggleTheme} className="sidebar-link w-full">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="sidebar-link w-full text-destructive hover:bg-destructive/10"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};
