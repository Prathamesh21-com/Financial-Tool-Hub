import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

const STOCKS = [
  { id: 'RELIANCE', name: 'Reliance Ind.', sector: 'Energy', color: '#6366f1', vol: 0.03, price: 2450 },
  { id: 'TCS', name: 'Tata Consult.', sector: 'IT', color: '#10b981', vol: 0.025, price: 3800 },
  { id: 'INFY', name: 'Infosys', sector: 'IT', color: '#38bdf8', vol: 0.028, price: 1550 },
  { id: 'HDFC', name: 'HDFC Bank', sector: 'Banking', color: '#f59e0b', vol: 0.022, price: 1680 },
  { id: 'WIPRO', name: 'Wipro Ltd.', sector: 'IT', color: '#a855f7', vol: 0.035, price: 480 },
  { id: 'ADANI', name: 'Adani Ent.', sector: 'Conglomerate', color: '#ec4899', vol: 0.055, price: 2200 },
]

interface StockState { id: string; name: string; sector: string; color: string; price: number; change: number; history: number[]; vol: number }

export default function StockTycoon() {
  const [stocks, setStocks] = useState<StockState[]>(STOCKS.map(s => ({ ...s, change: 0, history: [s.price] })))
  const [portfolio, setPortfolio] = useState<Record<string, number>>({})
  const [cash, setCash] = useState(100000)
  const [running, setRunning] = useState(false)
  const [day, setDay] = useState(1)
  const [maxDays] = useState(30)
  const [gameOver, setGameOver] = useState(false)
  const [news, setNews] = useState('📊 Markets open! Build your portfolio wisely.')
  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const { addXP, addNotification } = useAppStore()

  const totalValue = stocks.reduce((sum, s) => sum + (portfolio[s.id] || 0) * s.price, 0) + cash
  const pnl = totalValue - 100000

  const MARKET_NEWS = [
    { msg: '🇮🇳 Budget 2024 boost for tech sector', affect: 'IT', factor: 1.04 },
    { msg: '⚡ RBI holds repo rate steady', affect: 'Banking', factor: 1.02 },
    { msg: '📉 Global recession fears hit markets', affect: 'ALL', factor: 0.97 },
    { msg: '🛢️ Oil prices surge 8%', affect: 'Energy', factor: 1.06 },
    { msg: '💻 IT exports hit record high', affect: 'IT', factor: 1.05 },
    { msg: '🏦 NPA concerns in banking sector', affect: 'Banking', factor: 0.96 },
  ]

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setDay(d => {
        if (d >= maxDays) { setRunning(false); setGameOver(true); clearInterval(intervalRef.current); return d }
        return d + 1
      })
      // News event
      if (Math.random() < 0.15) {
        const ev = MARKET_NEWS[Math.floor(Math.random() * MARKET_NEWS.length)]
        setNews(ev.msg)
        setStocks(prev => prev.map(s => {
          const affected = ev.affect === 'ALL' || s.sector === ev.affect
          const trend = (Math.random() - 0.48) * s.vol * (affected ? ev.factor : 1)
          const newPrice = Math.max(s.price * 0.5, s.price * (1 + trend))
          return { ...s, price: newPrice, change: ((newPrice - s.price) / s.price) * 100, history: [...s.history.slice(-50), newPrice] }
        }))
      } else {
        setStocks(prev => prev.map(s => {
          const trend = (Math.random() - 0.48) * s.vol
          const newPrice = Math.max(s.price * 0.5, s.price * (1 + trend))
          return { ...s, price: newPrice, change: ((newPrice - s.price) / s.price) * 100, history: [...s.history.slice(-50), newPrice] }
        }))
      }
    }, 1500)
    return () => clearInterval(intervalRef.current)
  }, [running])

  const buy = (id: string, qty: number = 1) => {
    const s = stocks.find(x => x.id === id)!
    if (s.price * qty > cash) { addNotification({ type: 'error', message: 'Insufficient funds!' }); return }
    setCash(c => c - s.price * qty)
    setPortfolio(p => ({ ...p, [id]: (p[id] || 0) + qty }))
  }

  const sell = (id: string, qty: number = 1) => {
    const held = portfolio[id] || 0
    if (held < qty) { addNotification({ type: 'error', message: 'Insufficient holdings!' }); return }
    const s = stocks.find(x => x.id === id)!
    setCash(c => c + s.price * qty)
    setPortfolio(p => ({ ...p, [id]: p[id] - qty }))
  }

  const reset = () => {
    setStocks(STOCKS.map(s => ({ ...s, change: 0, history: [s.price] })))
    setPortfolio({}); setCash(100000); setDay(1); setGameOver(false)
    setNews('📊 Markets open! Build your portfolio wisely.')
  }

  if (!running && !gameOver) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <Link to="/games" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 justify-center"><ArrowLeft size={16} />Back</Link>
        <div className="text-5xl mb-4">📈</div>
        <h1 className="font-cinzel font-bold text-3xl text-white mb-3">Stock Market Tycoon</h1>
        <p className="text-slate-400 mb-6">Start with ₹1,00,000. Trade real NSE stocks over 30 simulated days. Beat the index!</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[{ l: 'Starting Capital', v: '₹1L' }, { l: 'Trading Days', v: '30' }, { l: 'Stocks', v: '6' }].map(s => (
            <div key={s.l} className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <p className="text-emerald-400 font-bold">{s.v}</p><p className="text-slate-500 text-xs">{s.l}</p>
            </div>
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => setRunning(true)}
          className="px-8 py-4 rounded-2xl text-white font-bold text-lg w-full" style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 8px 30px rgba(16,185,129,0.4)' }}>
          🏦 Start Trading
        </motion.button>
      </div>
    </div>
  )

  if (gameOver) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full text-center p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="text-5xl mb-3">{pnl >= 0 ? '🏆' : '📉'}</div>
        <h2 className="font-cinzel text-2xl font-bold text-white mb-2">Market Closed!</h2>
        <p className="text-slate-400 mb-6">30 days complete. Final portfolio: <span className="text-white font-bold">₹{totalValue.toFixed(0)}</span></p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { l: 'P&L', v: `${pnl >= 0 ? '+' : ''}₹${pnl.toFixed(0)}`, c: pnl >= 0 ? '#10b981' : '#ef4444' },
            { l: 'Return', v: `${((pnl / 100000) * 100).toFixed(1)}%`, c: pnl >= 0 ? '#10b981' : '#ef4444' },
          ].map(s => (
            <div key={s.l} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-slate-500 text-xs mb-1">{s.l}</p>
              <p className="font-bold text-lg" style={{ color: s.c }}>{s.v}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={reset} className="flex-1 py-3 rounded-xl text-white" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <RefreshCw size={14} className="inline mr-2" />Retry
          </button>
          <button onClick={() => { addXP(Math.max(100, Math.round(Math.abs(pnl) / 500))); addNotification({ type: 'success', message: 'XP saved!' }) }}
            className="flex-1 py-3 rounded-xl text-white font-bold" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>Save & Claim XP</button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen px-3 sm:px-6 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="font-cinzel font-bold text-white text-sm">Stock Tycoon</span>
          <span className="text-slate-400 text-xs">Day {day}/{maxDays}</span>
          <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${(day / maxDays) * 100}%` }} />
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="text-slate-400">Cash: <span className="text-white font-bold">₹{cash.toFixed(0)}</span></span>
          <span className={`font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{pnl >= 0 ? '+' : ''}₹{pnl.toFixed(0)}</span>
        </div>
      </div>
      <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#86efac' }}>{news}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map(s => (
          <div key={s.id} className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.change >= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-white font-bold text-sm">{s.id}</p>
                <p className="text-slate-500 text-xs">{s.sector}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold font-mono">₹{s.price.toFixed(0)}</p>
                <p className={`text-xs flex items-center gap-1 justify-end ${s.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {s.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="h-8 flex items-end gap-px mb-3">
              {s.history.slice(-20).map((p, i, arr) => {
                const max = Math.max(...arr); const min = Math.min(...arr)
                const h = max === min ? 50 : ((p - min) / (max - min)) * 100
                return <div key={i} className="flex-1 rounded-sm" style={{ height: `${Math.max(10, h)}%`, background: s.change >= 0 ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)' }} />
              })}
            </div>
            {(portfolio[s.id] || 0) > 0 && <p className="text-amber-400 text-xs mb-2">Held: {portfolio[s.id]} • ₹{((portfolio[s.id] || 0) * s.price).toFixed(0)}</p>}
            <div className="flex gap-2">
              <button onClick={() => buy(s.id)} className="flex-1 py-1.5 rounded-lg text-xs font-bold" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>BUY</button>
              <button onClick={() => sell(s.id)} disabled={!(portfolio[s.id] || 0)} className="flex-1 py-1.5 rounded-lg text-xs font-bold disabled:opacity-30" style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>SELL</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
