import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calculator, Gamepad2, TrendingUp, Shield, Zap, Target,
  ChevronRight, Star, Users, Award, ArrowRight, Sparkles,
  BookOpen, BarChart3, PieChart, DollarSign
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const CALCULATORS = [
  { id: 'sip', name: 'SIP Calculator', desc: 'Grow wealth with monthly investments', icon: TrendingUp, color: '#6366f1', tag: 'Most Popular' },
  { id: 'emi', name: 'EMI Calculator', desc: 'Plan your loan repayments', icon: Calculator, color: '#a855f7', tag: 'Essential' },
  { id: 'fd', name: 'FD Calculator', desc: 'Maximize fixed deposit returns', icon: Shield, color: '#10b981', tag: '' },
  { id: 'retirement', name: 'Retirement Calculator', desc: 'Secure your financial future', icon: Target, color: '#f59e0b', tag: 'New' },
  { id: 'fire', name: 'FIRE Calculator', desc: 'Retire early with smart planning', icon: Zap, color: '#ec4899', tag: 'Popular' },
  { id: 'compound', name: 'Compound Interest', desc: 'The 8th wonder of the world', icon: BarChart3, color: '#38bdf8', tag: '' },
];

const GAMES = [
  { id: 'crypto-rush', name: 'Crypto Rush', desc: 'Trade crypto in a simulated market frenzy', icon: '₿', color: '#f59e0b', players: '10K+' },
  { id: 'financial-literacy', name: 'Financial Literacy Challenge', desc: 'Test your financial knowledge across 200+ questions', icon: '🎯', color: '#6366f1', players: '25K+' },
  { id: 'stock-tycoon', name: 'Stock Market Tycoon', desc: 'Build a stock portfolio empire', icon: '📈', color: '#10b981', players: '8K+' },
  { id: 'scam-detector', name: 'Scam Detector', desc: 'Learn to identify financial fraud', icon: '🔍', color: '#ec4899', players: '5K+' },
];

const STATS = [
  { label: 'Calculations Done', value: '2.5L+', icon: Calculator },
  { label: 'Active Learners', value: '50K+', icon: Users },
  { label: 'Finance Concepts', value: '200+', icon: BookOpen },
  { label: 'Games Played', value: '1L+', icon: Gamepad2 },
];

// Animated number counter
function Counter({ target, suffix = '' }: { target: string; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {target}
    </motion.span>
  );
}

// Floating blob
function Blob({ x, y, size, color, delay }: { x: string; y: string; size: number; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, filter: 'blur(80px)', opacity: 0.15 }}
      animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.95, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

// Market ticker items
const TICKER_ITEMS = [
  { symbol: 'SENSEX', value: '72,140', change: '+0.82%', up: true },
  { symbol: 'NIFTY 50', value: '21,710', change: '+0.64%', up: true },
  { symbol: 'NIFTY BANK', value: '48,250', change: '-0.12%', up: false },
  { symbol: 'GOLD', value: '₹63,850', change: '+0.45%', up: true },
  { symbol: 'SILVER', value: '₹76,200', change: '+1.2%', up: true },
  { symbol: 'USD/INR', value: '83.12', change: '-0.08%', up: false },
  { symbol: 'BTC/USD', value: '$42,800', change: '+2.1%', up: true },
  { symbol: 'ETH/USD', value: '$2,240', change: '+1.8%', up: true },
];

export default function HomePage() {
  const { setAiChatOpen } = useAppStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const [tickerDuplicate] = useState([...TICKER_ITEMS, ...TICKER_ITEMS]);

  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <Blob x="10%" y="5%" size={400} color="#6366f1" delay={0} />
      <Blob x="70%" y="10%" size={300} color="#a855f7" delay={3} />
      <Blob x="50%" y="40%" size={350} color="#10b981" delay={6} />
      <Blob x="20%" y="70%" size={250} color="#f59e0b" delay={9} />

      {/* Grid pattern overlay */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />

      {/* ======== HERO SECTION ======== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6">
        {/* Removed opacity animation – now always fully visible */}
        <motion.div style={{ y: heroY }} className="text-center max-w-5xl mx-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
              <Sparkles size={14} className="text-indigo-400" />
            </motion.div>
            <span className="text-indigo-300">India's Most Advanced Financial Learning Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-cinzel font-black text-5xl md:text-7xl lg:text-8xl leading-none mb-6"
          >
            <span className="text-white block">Your Financial</span>
            <span className="block mt-2"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #38bdf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.4))' }}>
              Universe
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Calculators, games, AI assistant, and interactive learning tools — all in one place. From SIP to FIRE, master every aspect of your financial life.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/calculators"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold transition-all"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' }}>
                <Calculator size={18} />
                Explore Calculators
                <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link to="/games"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}>
                <Gamepad2 size={18} />
                Play & Learn
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-cinzel font-black text-2xl md:text-3xl text-white">
                  <Counter target={stat.value} />
                </div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
        >
          <div className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 rounded-full bg-indigo-500"
            />
          </div>
          <span className="text-xs">Scroll</span>
        </motion.div>
      </section>

      {/* ======== MARKET TICKER ======== */}
      <div className="relative overflow-hidden py-3 border-y border-white/5"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex gap-8 whitespace-nowrap"
        >
          {tickerDuplicate.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm flex-shrink-0">
              <span className="text-slate-400 font-medium">{item.symbol}</span>
              <span className="text-white font-mono">{item.value}</span>
              <span className={item.up ? 'text-emerald-400' : 'text-rose-400'}>
                {item.up ? '▲' : '▼'} {item.change}
              </span>
              <span className="text-slate-700 mx-2">|</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ======== CALCULATORS ======== */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <Calculator size={14} className="text-indigo-400" />
            <span className="text-indigo-300">Powerful Calculators</span>
          </div>
          <h2 className="section-title text-white mb-4">Calculate Your <span className="text-gradient">Future</span></h2>
          <p className="text-slate-400 max-w-xl mx-auto">Animated, interactive calculators with AI explanations and real-time chart visualizations</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {CALCULATORS.map((calc, i) => (
            <motion.div
              key={calc.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={`/calculators/${calc.id}`}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="group relative p-6 rounded-2xl h-full cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${calc.color}15, transparent 70%)`, border: `1px solid ${calc.color}30` }} />

                  <div className="relative z-10">
                    {/* Tag */}
                    {calc.tag && (
                      <span className="absolute -top-3 left-4 text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: `${calc.color}25`, color: calc.color, border: `1px solid ${calc.color}40` }}>
                        {calc.tag}
                      </span>
                    )}

                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: `${calc.color}15`, border: `1px solid ${calc.color}30` }}>
                      <calc.icon size={22} style={{ color: calc.color }} />
                    </div>

                    <h3 className="text-white font-semibold text-lg mb-2">{calc.name}</h3>
                    <p className="text-slate-500 text-sm mb-4">{calc.desc}</p>

                    <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all"
                      style={{ color: calc.color }}>
                      Calculate now
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/calculators"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            View all 12+ calculators
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ======== GAMES ======== */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Gamepad2 size={14} className="text-amber-400" />
            <span className="text-amber-400">Financial Games</span>
          </div>
          <h2 className="section-title text-white mb-4">Learn by <span className="text-gradient-gold">Playing</span></h2>
          <p className="text-slate-400 max-w-xl mx-auto">Gamified financial education that makes learning fun, competitive, and effective</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {GAMES.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/games/${game.id}`}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="group relative p-6 rounded-2xl cursor-pointer overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(ellipse at 50% -20%, ${game.color}20, transparent 70%)` }} />

                  <div className="relative z-10 flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `${game.color}15`, border: `1px solid ${game.color}25` }}>
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-white font-semibold text-lg leading-tight">{game.name}</h3>
                        <span className="text-xs text-slate-500 ml-2 mt-1 flex-shrink-0">{game.players} players</span>
                      </div>
                      <p className="text-slate-500 text-sm mb-3">{game.desc}</p>
                      <div className="flex items-center gap-2 text-sm font-medium"
                        style={{ color: game.color }}>
                        Play now <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/games"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            View all games
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ======== AI ASSISTANT SECTION ======== */}
      <section className="relative max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-8 md:p-12"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))', border: '1px solid rgba(99,102,241,0.25)' }}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #6366f1, transparent)', filter: 'blur(40px)' }} />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                >
                  <Sparkles size={22} className="text-white" />
                </motion.div>
                <div>
                  <div className="text-white font-bold text-xl">Artha AI</div>
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    />
                    <span className="text-emerald-400 text-xs">Online</span>
                  </div>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-cinzel">
                Your AI Financial<br />Learning Companion
              </h2>
              <p className="text-slate-400 mb-6 max-w-md">
                Get instant explanations for calculator results, learn complex financial concepts in simple language, and get personalized educational insights.
              </p>
              <div className="space-y-2 mb-8">
                {[
                  'Explains your calculator results in plain language',
                  'Teaches financial concepts interactively',
                  'Answers questions about Indian finance & investments',
                  '100% educational — no illegal financial advice',
                ].map((point, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 text-sm text-slate-300">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(16,185,129,0.2)' }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    {point}
                  </motion.div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setAiChatOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}>
                <Sparkles size={16} />
                Chat with Artha AI
              </motion.button>
            </div>

            {/* AI Chat preview */}
            <div className="flex-shrink-0 w-full md:w-72">
              <div className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(99,102,241,0.2)', backdropFilter: 'blur(20px)' }}>
                <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-400" />
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-500 ml-2">Artha AI Chat</span>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { role: 'user', text: 'How does SIP work?' },
                    { role: 'ai', text: 'SIP lets you invest monthly in mutual funds. The power is rupee-cost averaging... 📈' },
                    { role: 'user', text: 'What\'s compound interest?' },
                  ].map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.15 }} viewport={{ once: true }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[80%] px-3 py-2 rounded-xl text-xs"
                        style={{
                          background: msg.role === 'user' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.07)',
                          color: '#fff'
                        }}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  <div className="flex items-center gap-2 opacity-50">
                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span className="text-xs text-slate-500">Artha AI is typing...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ======== FEATURES GRID ======== */}
      <section className="relative max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title text-white mb-4">Why Choose <span className="text-gradient">Financial Tool Hub?</span></h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: '🎯', title: 'Precise Calculators', desc: 'Professional-grade calculations with animated charts and AI insights', color: '#6366f1' },
            { icon: '🎮', title: 'Gamified Learning', desc: 'Financial education through fun, competitive games with XP and achievements', color: '#f59e0b' },
            { icon: '🤖', title: 'AI-Powered', desc: 'Intelligent explanations that adapt to your level of understanding', color: '#a855f7' },
            { icon: '🇮🇳', title: 'India-First', desc: 'Built for Indian investors with ₹, PPF, NPS, ELSS and SEBI context', color: '#10b981' },
            { icon: '📱', title: 'Mobile-First', desc: 'Perfectly responsive design that works beautifully on any device', color: '#38bdf8' },
            { icon: '🔒', title: 'Safe & Legal', desc: 'Educational only — no illegal advice, proper disclaimers, data privacy', color: '#ec4899' },
            { icon: '⚡', title: 'Lightning Fast', desc: 'Vite-powered SPA with instant calculations and smooth animations', color: '#f97316' },
            { icon: '🏆', title: 'Achievements', desc: 'Track your learning progress and earn badges for financial milestones', color: '#84cc16' },
          ].map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="text-3xl mb-3">{feat.icon}</div>
              <h3 className="text-white font-semibold mb-2">{feat.title}</h3>
              <p className="text-slate-500 text-sm">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ======== DONATE CTA ======== */}
      <section className="relative max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center p-10 rounded-3xl"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(251,191,36,0.05))', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          <div className="text-4xl mb-4">🙏</div>
          <h2 className="text-2xl font-bold text-white mb-3 font-cinzel">Support Financial Tool Hub</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-6">This platform is completely free. If it helps your financial journey, consider supporting its growth with a small donation.</p>
          <Link to="/donate"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 24px rgba(245,158,11,0.3)' }}>
            <Star size={16} />
            Support This Project
          </Link>
        </motion.div>
      </section>
    </div>
  );
}