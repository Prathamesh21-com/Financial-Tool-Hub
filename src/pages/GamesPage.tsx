import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gamepad2, Users, Star, Zap } from 'lucide-react'

const GAMES = [
  {
    id: 'crypto-rush', name: 'Crypto Rush', desc: 'Trade crypto in a fast-paced simulated market. Manage your portfolio, react to market news, and try to multiply your initial investment!',
    icon: '₿', color: '#f59e0b', gradient: 'from-amber-500/20 to-orange-500/10', players: '10K+', difficulty: 'Medium', category: 'Trading', xp: 500, tag: 'Hot 🔥'
  },
  {
    id: 'financial-literacy', name: 'Financial Literacy Challenge', desc: 'Test your financial knowledge with 200+ questions across 8 categories. Earn XP, unlock achievements, and track your streaks!',
    icon: '🎯', color: '#6366f1', gradient: 'from-indigo-500/20 to-purple-500/10', players: '25K+', difficulty: 'All levels', category: 'Quiz', xp: 300, tag: 'Most Popular'
  },
  {
    id: 'stock-tycoon', name: 'Stock Market Tycoon', desc: 'Build a stock portfolio from scratch. Buy low, sell high, manage risk, and become the ultimate market tycoon!',
    icon: '📈', color: '#10b981', gradient: 'from-emerald-500/20 to-teal-500/10', players: '8K+', difficulty: 'Hard', category: 'Strategy', xp: 700, tag: 'New'
  },
  {
    id: 'scam-detector', name: 'Scam Detector', desc: 'Learn to identify common financial scams and frauds. Can you spot the red flags before losing your virtual money?',
    icon: '🔍', color: '#ec4899', gradient: 'from-pink-500/20 to-rose-500/10', players: '5K+', difficulty: 'Easy', category: 'Education', xp: 200, tag: 'Important'
  },
  {
    id: 'budget-survival', name: 'Budget Survival', desc: 'Survive 12 months on a fixed budget. Handle unexpected expenses, make smart choices, and see if you finish in the green!',
    icon: '💰', color: '#a855f7', gradient: 'from-purple-500/20 to-violet-500/10', players: '3K+', difficulty: 'Medium', category: 'Budgeting', xp: 400, tag: 'New'
  },
]

const diffColors: Record<string, string> = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444', 'All levels': '#6366f1' }

export default function GamesPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 py-16 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <Gamepad2 size={14} className="text-amber-400" />
          <span className="text-amber-400">5 Financial Games</span>
        </div>
        <h1 className="font-cinzel font-black text-4xl md:text-5xl text-white mb-4">Learn by <span className="text-gradient-gold">Playing</span></h1>
        <p className="text-slate-400 max-w-xl mx-auto">Gamified financial education — earn XP, unlock achievements, and master money management through gameplay</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-10 max-w-md mx-auto">
        {[{ icon: Users, label: '50K+ Players', color: '#6366f1' }, { icon: Star, label: '200+ Questions', color: '#f59e0b' }, { icon: Zap, label: 'Earn XP', color: '#10b981' }].map(s => (
          <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <s.icon size={16} style={{ color: s.color }} className="mx-auto mb-1" />
            <p className="text-slate-400 text-xs">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GAMES.map((game, i) => (
          <motion.div key={game.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={`/games/${game.id}`}>
              <motion.div whileHover={{ y: -5 }} className={`group relative p-6 rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br ${game.gradient}`}
                style={{ border: `1px solid ${game.color}25` }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                  style={{ background: `radial-gradient(circle, ${game.color}, transparent)`, filter: 'blur(20px)', transform: 'translate(30%, -30%)' }} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{game.icon}</div>
                    <div className="flex flex-col items-end gap-1.5">
                      {game.tag && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: `${game.color}25`, color: game.color, border: `1px solid ${game.color}40` }}>
                          {game.tag}
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${diffColors[game.difficulty]}20`, color: diffColors[game.difficulty] }}>
                        {game.difficulty}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-white font-bold text-xl mb-2 font-cinzel">{game.name}</h2>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">{game.desc}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Users size={12} />{game.players}</span>
                      <span className="flex items-center gap-1"><Zap size={12} />+{game.xp} XP</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>{game.category}</span>
                    </div>
                    <motion.div whileHover={{ x: 4 }} className="flex items-center gap-2 text-sm font-semibold" style={{ color: game.color }}>
                      Play Now →
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="mt-10 p-6 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-slate-400 text-sm">🏆 All games award XP to your dashboard. Sign in to track progress & compete on leaderboards!</p>
      </motion.div>
    </div>
  )
}
