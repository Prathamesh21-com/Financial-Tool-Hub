import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, Gamepad2, User, Settings, Search, Menu, X,
  MessageCircle, TrendingUp, Home, Info, Heart, Shield, Bell
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const navLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/calculators', label: 'Calculators', icon: Calculator },
  { path: '/games', label: 'Games', icon: Gamepad2 },
  { path: '/market', label: 'Market', icon: TrendingUp },
  { path: '/about', label: 'About', icon: Info },
  { path: '/donate', label: 'Donate', icon: Heart },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { setAiChatOpen, setSearchOpen, user, isAdmin } = useAppStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-white/5 shadow-2xl'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                className="relative w-9 h-9"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} />
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #38bdf8)', filter: 'blur(8px)' }} />
                <span className="relative z-10 flex items-center justify-center h-full font-cinzel font-bold text-white text-sm">₹</span>
              </motion.div>
              <div className="hidden sm:block">
                <span className="font-cinzel font-bold text-white text-lg leading-none block">
                  Financial
                </span>
                <span className="font-cinzel font-bold text-lg leading-none"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Tool Hub
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    location.pathname === link.path
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navActive"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <link.icon size={14} />
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                title="Search"
              >
                <Search size={18} />
              </button>

              {/* AI Chat */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAiChatOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))', border: '1px solid rgba(99,102,241,0.3)' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                />
                <span className="text-indigo-300">Artha AI</span>
              </motion.button>

              {/* User / Login */}
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                    {user.name?.charAt(0) || 'U'}
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="hidden sm:block px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                >
                  Sign In
                </button>
              )}

              {/* Admin */}
              {isAdmin && (
                <button onClick={() => navigate('/admin')} className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-all">
                  <Shield size={16} />
                </button>
              )}

              {/* Mobile Menu */}
              <button
                className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-40 w-72 glass border-l border-white/10"
            style={{ paddingTop: '4rem' }}
          >
            <div className="p-6 space-y-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      location.pathname === link.path
                        ? 'text-white bg-indigo-500/20 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <link.icon size={18} />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </motion.div>
              ))}

              <div className="pt-4 border-t border-white/10 space-y-2">
                <button
                  onClick={() => { setAiChatOpen(true); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-300 hover:bg-indigo-500/10 transition-all"
                >
                  <MessageCircle size={18} />
                  <span>Artha AI Assistant</span>
                </button>
                {!user && (
                  <button
                    onClick={() => { navigate('/login'); setMobileOpen(false); }}
                    className="w-full px-4 py-3 rounded-xl text-center font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/60" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}
