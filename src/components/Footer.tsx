import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Shield } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Footer() {
  const { setAiChatOpen } = useAppStore();

  return (
    <footer className="relative mt-20 border-t border-white/5">
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(99,102,241,0.03), transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="font-cinzel font-bold text-xl text-white mb-1">Financial</div>
            <div className="font-cinzel font-bold text-xl mb-4"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Tool Hub
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              India's most advanced interactive financial learning ecosystem. Learn, calculate, and grow your financial knowledge.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span>Made with</span>
              <Heart size={11} className="text-rose-500 fill-rose-500" />
              <span>in India 🇮🇳</span>
            </div>
          </div>

          {/* Calculators */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Calculators</h4>
            <ul className="space-y-2">
              {['SIP Calculator', 'EMI Calculator', 'FD Calculator', 'PPF Calculator', 'Retirement', 'FIRE Calculator'].map(item => (
                <li key={item}>
                  <Link to={`/calculators/${item.toLowerCase().replace(/ /g, '-').replace('calculator', '').trim()}`}
                    className="text-slate-500 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block transition-transform">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Games */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Games</h4>
            <ul className="space-y-2">
              {[
                { label: 'Crypto Rush', path: '/games/crypto-rush' },
                { label: 'Financial Literacy Challenge', path: '/games/financial-literacy' },
                { label: 'Stock Market Tycoon', path: '/games/stock-tycoon' },
                { label: 'Scam Detector', path: '/games/scam-detector' },
                { label: 'Budget Survival', path: '/games/budget-survival' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.path} className="text-slate-500 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-slate-500 hover:text-white text-sm transition-colors">About Me</Link></li>
              <li><Link to="/donate" className="text-slate-500 hover:text-white text-sm transition-colors">Support / Donate</Link></li>
              <li><Link to="/dashboard" className="text-slate-500 hover:text-white text-sm transition-colors">My Dashboard</Link></li>
              <li>
                <button onClick={() => setAiChatOpen(true)} className="text-slate-500 hover:text-white text-sm transition-colors text-left">
                  Artha AI Assistant
                </button>
              </li>
              <li><Link to="/disclaimer" className="text-slate-500 hover:text-white text-sm transition-colors flex items-center gap-1"><Shield size={11} /> Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl mb-6"
          style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <p className="text-xs text-amber-400/70 text-center leading-relaxed">
            ⚠️ <strong className="text-amber-400/90">Educational Disclaimer:</strong> Financial Tool Hub is for educational purposes only. Nothing on this website constitutes financial advice, investment recommendation, or guaranteed returns. Always consult a SEBI-registered financial advisor before making investment decisions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <span>© 2024 Financial Tool Hub. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/disclaimer" className="hover:text-slate-400 transition-colors">Disclaimer</Link>
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <span>v2.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
