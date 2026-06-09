import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calculator, Gamepad2, Zap, Trophy, TrendingUp, Target, BookOpen, Settings, LogOut, Star } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const ACHIEVEMENTS = [
  { id: 'first_calc', icon: '🧮', label: 'First Calculation', desc: 'Used a calculator', unlocked: true, rarity: 'common' },
  { id: 'quiz_master', icon: '🎯', label: 'Quiz Master', desc: 'Score 100% in a quiz', unlocked: false, rarity: 'rare' },
  { id: 'sip_starter', icon: '📈', label: 'SIP Starter', desc: 'Used SIP calculator', unlocked: true, rarity: 'common' },
  { id: 'crypto_trader', icon: '₿', label: 'Crypto Trader', desc: 'Played Crypto Rush', unlocked: false, rarity: 'epic' },
  { id: 'fire_planner', icon: '🔥', label: 'FIRE Planner', desc: 'Used FIRE calculator', unlocked: false, rarity: 'rare' },
  { id: 'scam_shield', icon: '🛡️', label: 'Scam Shield', desc: 'Completed Scam Detector', unlocked: false, rarity: 'legendary' },
]

const rarityColors: Record<string, string> = {
  common: '#94a3b8', rare: '#6366f1', epic: '#a855f7', legendary: '#f59e0b'
}

export default function DashboardPage() {
  const { user, setUser, addNotification } = useAppStore()
  const navigate = useNavigate()

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-white font-bold text-xl mb-2 font-cinzel">Sign in to view dashboard</h2>
        <p className="text-slate-400 mb-6">Track your progress, achievements, and saved calculations</p>
        <button onClick={() => navigate('/login')} className="px-6 py-3 rounded-xl text-white font-semibold" style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
          Sign In
        </button>
      </div>
    </div>
  )

  const xpForNextLevel = user.level * 1000
  const xpProgress = (user.xp % 1000 / 10)

  const logout = () => {
    setUser(null)
    addNotification({ type: 'info', message: 'Signed out successfully' })
    navigate('/')
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        {/* Profile header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="font-cinzel font-bold text-2xl text-white">{user.name}</h1>
              <p className="text-slate-400 text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>
                  Level {user.level}
                </span>
                <span className="text-slate-500 text-xs">🔥 {user.streak} day streak</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <Settings size={18} />
            </button>
            <button onClick={logout} className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-all">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400 flex items-center gap-1"><Zap size={13} className="text-indigo-400" /> {user.xp} XP</span>
            <span className="text-slate-500">Level {user.level + 1} in {xpForNextLevel - (user.xp % 1000)} XP</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 1 }}
              className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Calculator, label: 'Calculations', value: user.savedCalculations?.length || 0, color: '#6366f1' },
          { icon: Gamepad2, label: 'Games Played', value: 0, color: '#f59e0b' },
          { icon: Trophy, label: 'Achievements', value: ACHIEVEMENTS.filter(a => a.unlocked).length, color: '#10b981' },
          { icon: TrendingUp, label: 'Financial Score', value: `${user.financialHealthScore || 0}/100`, color: '#ec4899' },
        ].map(stat => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <stat.icon size={20} style={{ color: stat.color }} className="mx-auto mb-2" />
            <p className="font-bold text-white text-lg">{stat.value}</p>
            <p className="text-slate-500 text-xs">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-amber-400" /> Achievements
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {ACHIEVEMENTS.map(a => (
              <div key={a.id} className={`p-3 rounded-xl text-center transition-all ${!a.unlocked ? 'opacity-30 grayscale' : ''}`}
                style={{ background: a.unlocked ? `${rarityColors[a.rarity]}15` : 'rgba(255,255,255,0.03)', border: `1px solid ${a.unlocked ? rarityColors[a.rarity] + '30' : 'rgba(255,255,255,0.05)'}` }}>
                <div className="text-2xl mb-1">{a.icon}</div>
                <p className="text-xs font-medium" style={{ color: a.unlocked ? rarityColors[a.rarity] : '#475569' }}>{a.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <Target size={16} className="text-indigo-400" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'SIP Calculator', icon: '📈', path: '/calculators/sip', color: '#6366f1' },
              { label: 'Play Quiz', icon: '🎯', path: '/games/financial-literacy', color: '#f59e0b' },
              { label: 'FIRE Calculator', icon: '🔥', path: '/calculators/fire', color: '#f97316' },
              { label: 'Crypto Rush', icon: '₿', path: '/games/crypto-rush', color: '#f59e0b' },
              { label: 'Retirement Plan', icon: '🌅', path: '/calculators/retirement', color: '#ec4899' },
              { label: 'Scam Detector', icon: '🛡️', path: '/games/scam-detector', color: '#10b981' },
            ].map(item => (
              <button key={item.label} onClick={() => navigate(item.path)}
                className="flex items-center gap-2 p-3 rounded-xl text-left hover:scale-105 transition-all"
                style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs font-medium text-white">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Learning Tips */}
        <div className="p-6 rounded-2xl lg:col-span-2" style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.06))', border: '1px solid rgba(99,102,241,0.2)' }}>
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-400" /> Today's Financial Tip
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '💡', title: 'Start Early', tip: 'Investing ₹5,000/month from age 25 at 12% gives ₹5.5 Cr by 60. Wait until 35 and you only get ₹1.8 Cr.' },
              { icon: '🛡️', title: 'Emergency First', tip: 'Before investing, build 6 months of expenses in liquid funds. This prevents panic-selling during emergencies.' },
              { icon: '📊', title: 'Diversify', tip: 'Don\'t put all eggs in one basket. Mix equity, debt, gold, and real estate based on your risk tolerance.' },
            ].map(tip => (
              <div key={tip.title} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <span className="text-2xl block mb-2">{tip.icon}</span>
                <h3 className="text-white font-semibold text-sm mb-1">{tip.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{tip.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
