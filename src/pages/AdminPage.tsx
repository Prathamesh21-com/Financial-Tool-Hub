import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, BarChart3, TrendingUp, Gamepad2, Calculator, LogOut, Eye, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { useAppStore } from '../store/useAppStore'

const MOCK_STATS = {
  totalUsers: 52847,
  activeToday: 1243,
  totalCalculations: 284920,
  totalGameSessions: 98430,
  topCalcs: [
    { name: 'SIP', uses: 45230 }, { name: 'EMI', uses: 38910 }, { name: 'FD', uses: 22100 },
    { name: 'Retirement', uses: 18560 }, { name: 'FIRE', uses: 15820 }, { name: 'PPF', uses: 14300 },
  ],
  topGames: [
    { name: 'Financial Literacy', plays: 34560 }, { name: 'Crypto Rush', plays: 28900 },
    { name: 'Stock Tycoon', plays: 19200 }, { name: 'Scam Detector', plays: 12400 }, { name: 'Budget Survival', plays: 8800 },
  ],
  dailyVisitors: [
    { date: 'Mon', count: 1820 }, { date: 'Tue', count: 2340 }, { date: 'Wed', count: 1950 },
    { date: 'Thu', count: 2890 }, { date: 'Fri', count: 3120 }, { date: 'Sat', count: 2650 }, { date: 'Sun', count: 1980 },
  ],
  donations: [
    { amount: 49, name: 'Anonymous', date: '2024-01-15' }, { amount: 199, name: 'Rahul K', date: '2024-01-14' },
    { amount: 499, name: 'Priya M', date: '2024-01-13' }, { amount: 999, name: 'Arjun S', date: '2024-01-12' },
  ],
}

export default function AdminPage() {
  const { setIsAdmin, addNotification } = useAppStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'overview' | 'calculators' | 'games' | 'donations'>('overview')

  const logout = () => {
    setIsAdmin(false)
    addNotification({ type: 'info', message: 'Admin session ended' })
    navigate('/')
  }

  const totalDonations = MOCK_STATS.donations.reduce((s, d) => s + d.amount, 0)

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-cinzel font-bold text-xl text-white">Admin Dashboard</h1>
            <p className="text-slate-500 text-xs">Financial Tool Hub — Analytics</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl text-rose-400 hover:bg-rose-400/10 transition-all text-sm" style={{ border: '1px solid rgba(239,68,68,0.25)' }}>
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(['overview', 'calculators', 'games', 'donations'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all capitalize"
            style={{ background: tab === t ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${tab === t ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`, color: tab === t ? '#fbbf24' : '#64748b' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Total Users', value: MOCK_STATS.totalUsers.toLocaleString(), color: '#6366f1', delta: '+234 today' },
              { icon: Activity, label: 'Active Today', value: MOCK_STATS.activeToday.toLocaleString(), color: '#10b981', delta: '↑ 12%' },
              { icon: Calculator, label: 'Calculations', value: MOCK_STATS.totalCalculations.toLocaleString(), color: '#f59e0b', delta: '+1.2K today' },
              { icon: Gamepad2, label: 'Game Sessions', value: MOCK_STATS.totalGameSessions.toLocaleString(), color: '#ec4899', delta: '+340 today' },
            ].map(s => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center justify-between mb-2">
                  <s.icon size={16} style={{ color: s.color }} />
                  <span className="text-xs text-emerald-400">{s.delta}</span>
                </div>
                <p className="font-bold text-white text-xl">{s.value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Daily visitors chart */}
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-indigo-400" />Weekly Visitors</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_STATS.dailyVisitors}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10 }} />
                  <Line type="monotone" dataKey="count" name="Visitors" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donations summary */}
          <div className="p-5 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div className="flex items-center justify-between">
              <p className="text-amber-400 font-semibold">💰 Total Donations Received</p>
              <p className="text-white font-bold text-xl">₹{totalDonations.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'calculators' && (
        <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2"><Calculator size={16} className="text-indigo-400" />Calculator Usage</h3>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS.topCalcs} layout="vertical">
                <XAxis type="number" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} width={80} />
                <Tooltip contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10 }} />
                <Bar dataKey="uses" name="Total Uses" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {MOCK_STATS.topCalcs.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-indigo-400 font-mono text-xs w-6">#{i + 1}</span>
                  <span className="text-white text-sm font-medium">{c.name}</span>
                </div>
                <span className="text-slate-400 text-sm">{c.uses.toLocaleString()} uses</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'games' && (
        <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2"><Gamepad2 size={16} className="text-amber-400" />Game Analytics</h3>
          <div className="h-52 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STATS.topGames}>
                <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10 }} />
                <Bar dataKey="plays" name="Plays" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === 'donations' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <p className="text-amber-400 font-bold text-2xl">₹{totalDonations}</p>
            <p className="text-slate-400 text-sm">Total from {MOCK_STATS.donations.length} supporters</p>
          </div>
          {MOCK_STATS.donations.map((d, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div>
                <p className="text-white font-medium text-sm">{d.name}</p>
                <p className="text-slate-500 text-xs">{d.date}</p>
              </div>
              <span className="text-amber-400 font-bold">₹{d.amount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
