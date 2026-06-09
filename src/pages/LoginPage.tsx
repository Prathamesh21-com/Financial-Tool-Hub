import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Lock, User, Shield, Sparkles } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

export default function LoginPage() {
  const [params] = useSearchParams()
  const isAdminMode = params.get('admin') === '1'
  const [mode, setMode] = useState<'user' | 'admin'>(isAdminMode ? 'admin' : 'user')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUser, setIsAdmin, adminPassword, addNotification } = useAppStore()
  const navigate = useNavigate()

  const handleUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 800))
    const user = {
      id: Date.now().toString(), name: name || email.split('@')[0], email,
      createdAt: new Date(), streak: 0, xp: 0, level: 1, achievements: [],
      financialHealthScore: 0, savedCalculations: [], gameProgress: {
        cryptoRush: { highScore: 0, level: 1, totalXP: 0, achievements: [], portfolio: {} },
        financialLiteracy: { highestScore: 0, totalQuestions: 0, streak: 0, completedCategories: [], badges: [] },
        stockMarket: { portfolioValue: 100000, totalTrades: 0, bestTrade: 0, level: 1 },
      },
      favoriteTools: [], theme: 'dark' as const,
    }
    setUser(user)
    addNotification({ type: 'success', message: `Welcome, ${user.name}! 🎉` })
    setLoading(false)
    navigate('/dashboard')
  }

  const handleAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 600))
    if (password === adminPassword) {
      setIsAdmin(true)
      addNotification({ type: 'success', message: '🔐 Admin access granted' })
      navigate('/admin')
    } else {
      setError('Incorrect admin password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            {mode === 'admin' ? <Shield size={28} className="text-white" /> : <Sparkles size={28} className="text-white" />}
          </motion.div>
          <h1 className="font-cinzel font-bold text-3xl text-white mb-2">
            {mode === 'admin' ? 'Admin Access' : 'Welcome Back'}
          </h1>
          <p className="text-slate-400 text-sm">{mode === 'admin' ? 'Secure admin login' : 'Sign in or create your free account'}</p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['user', 'admin'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize flex items-center justify-center gap-2"
              style={{ background: mode === m ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent', color: mode === m ? '#fff' : '#64748b' }}>
              {m === 'admin' ? <Shield size={14} /> : <User size={14} />}{m === 'admin' ? 'Admin' : 'User'}
            </button>
          ))}
        </div>

        <div className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {mode === 'user' ? (
            <form onSubmit={handleUser} className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm block mb-1.5">Name (optional)</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                  className="input-field w-full" />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                  className="input-field w-full" />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                    className="input-field w-full pr-10" />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-rose-400 text-sm">{error}</p>}
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl text-white font-bold transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                {loading ? 'Signing in...' : 'Sign In / Create Account'}
              </motion.button>
              <p className="text-slate-600 text-xs text-center mt-2">No email verification needed. Data stored locally.</p>
            </form>
          ) : (
            <form onSubmit={handleAdmin} className="space-y-4">
              <div className="p-3 rounded-xl text-xs text-amber-400/70 mb-2" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
                🔒 Admin access is restricted. Default password in .env file.
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-1.5">Admin Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter admin password" required
                    className="input-field w-full pl-9 pr-10" />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-rose-400 text-sm">{error}</p>}
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }}
                className="w-full py-3 rounded-xl text-white font-bold"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                {loading ? 'Verifying...' : '🔐 Access Admin Panel'}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
