import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Calculator, Gamepad2, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const searchItems = [
  // Calculators
  { id: 'sip', type: 'Calculator', label: 'SIP Calculator', description: 'Systematic Investment Plan calculator', path: '/calculators/sip', icon: Calculator, color: '#6366f1' },
  { id: 'emi', type: 'Calculator', label: 'EMI Calculator', description: 'Loan EMI calculator with amortization', path: '/calculators/emi', icon: Calculator, color: '#a855f7' },
  { id: 'fd', type: 'Calculator', label: 'FD Calculator', description: 'Fixed deposit maturity calculator', path: '/calculators/fd', icon: Calculator, color: '#10b981' },
  { id: 'ppf', type: 'Calculator', label: 'PPF Calculator', description: 'Public Provident Fund calculator', path: '/calculators/ppf', icon: Calculator, color: '#f59e0b' },
  { id: 'compound', type: 'Calculator', label: 'Compound Interest', description: 'Power of compounding calculator', path: '/calculators/compound', icon: Calculator, color: '#38bdf8' },
  { id: 'retirement', type: 'Calculator', label: 'Retirement Calculator', description: 'Plan your retirement corpus', path: '/calculators/retirement', icon: Calculator, color: '#ec4899' },
  { id: 'fire', type: 'Calculator', label: 'FIRE Calculator', description: 'Financial Independence Retire Early', path: '/calculators/fire', icon: Calculator, color: '#f97316' },
  { id: 'inflation', type: 'Calculator', label: 'Inflation Calculator', description: 'Impact of inflation on your money', path: '/calculators/inflation', icon: Calculator, color: '#84cc16' },
  { id: 'emergency', type: 'Calculator', label: 'Emergency Fund', description: 'Calculate your safety net', path: '/calculators/emergency', icon: Calculator, color: '#06b6d4' },
  { id: 'networth', type: 'Calculator', label: 'Net Worth Calculator', description: 'Track your total wealth', path: '/calculators/networth', icon: Calculator, color: '#8b5cf6' },
  { id: 'stepupsip', type: 'Calculator', label: 'Step-up SIP', description: 'Increasing SIP calculator', path: '/calculators/stepupsip', icon: Calculator, color: '#f59e0b' },
  { id: 'swp', type: 'Calculator', label: 'SWP Calculator', description: 'Systematic Withdrawal Plan', path: '/calculators/swp', icon: Calculator, color: '#10b981' },

  // Games
  { id: 'crypto-rush', type: 'Game', label: 'Crypto Rush', description: 'Trade crypto in a simulated market', path: '/games/crypto-rush', icon: Gamepad2, color: '#f59e0b' },
  { id: 'fin-literacy', type: 'Game', label: 'Financial Literacy Challenge', description: 'Quiz yourself on finance', path: '/games/financial-literacy', icon: Gamepad2, color: '#6366f1' },
  { id: 'stock-tycoon', type: 'Game', label: 'Stock Market Tycoon', description: 'Build your stock portfolio', path: '/games/stock-tycoon', icon: Gamepad2, color: '#10b981' },
  { id: 'scam-detector', type: 'Game', label: 'Scam Detector', description: 'Spot financial scams', path: '/games/scam-detector', icon: Gamepad2, color: '#ec4899' },
  { id: 'budget-survival', type: 'Game', label: 'Budget Survival', description: 'Survive on a budget', path: '/games/budget-survival', icon: Gamepad2, color: '#f97316' },

  // Market
  { id: 'market', type: 'Feature', label: 'Market Overview', description: 'Live market data & indices', path: '/market', icon: TrendingUp, color: '#10b981' },
  { id: 'dashboard', type: 'Feature', label: 'My Dashboard', description: 'Your personal finance dashboard', path: '/dashboard', icon: BookOpen, color: '#a855f7' },
];

export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useAppStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = query.length > 0
    ? searchItems.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
      )
    : searchItems.slice(0, 8);

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [searchOpen, setSearchOpen]);

  const handleSelect = (path: string) => {
    navigate(path);
    setSearchOpen(false);
  };

  const typeColors = { Calculator: '#6366f1', Game: '#f59e0b', Feature: '#10b981' };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh]"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-xl mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="glass rounded-2xl border border-white/10 overflow-hidden"
              style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.2)' }}>

              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
                <Search size={18} className="text-slate-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search calculators, games, features..."
                  className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none text-base"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 bg-white/5 px-2 py-1 rounded">ESC</span>
                  <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto custom-scroll py-2">
                {filtered.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Search size={24} className="mx-auto mb-2 opacity-30" />
                    <p>No results found</p>
                  </div>
                ) : (
                  <div className="px-2">
                    {!query && <p className="text-xs text-slate-600 px-2 mb-2 uppercase tracking-wider">Popular</p>}
                    {filtered.map(item => (
                      <motion.button
                        key={item.id}
                        whileHover={{ x: 4 }}
                        onClick={() => handleSelect(item.path)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${item.color}20`, border: `1px solid ${item.color}30` }}>
                          <item.icon size={14} style={{ color: item.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">{item.label}</div>
                          <div className="text-xs text-slate-500 truncate">{item.description}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: `${typeColors[item.type as keyof typeof typeColors]}20`, color: typeColors[item.type as keyof typeof typeColors] }}>
                            {item.type}
                          </span>
                          <ArrowRight size={12} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span>↑↓ navigate</span>
                  <span>↵ select</span>
                </div>
                <span className="text-xs text-slate-600">Ctrl+K to open</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
