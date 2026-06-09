import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw, Zap, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

const COINS = [
  { id: 'BTC', name: 'Bitcoin', icon: '₿', color: '#f59e0b', volatility: 0.08 },
  { id: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#6366f1', volatility: 0.1 },
  { id: 'SOL', name: 'Solana', icon: '◎', color: '#14b8a6', volatility: 0.15 },
  { id: 'DOGE', name: 'Dogecoin', icon: 'Ð', color: '#f97316', volatility: 0.2 },
  { id: 'ADA', name: 'Cardano', icon: '₳', color: '#3b82f6', volatility: 0.12 },
]

const NEWS_EVENTS = [
  { msg: '🚀 Institutional adoption surge!', impact: 1.12 },
  { msg: '📉 Regulatory crackdown feared', impact: 0.88 },
  { msg: '🔥 Whale wallet moves millions', impact: 1.06 },
  { msg: '⚡ Network upgrade successful', impact: 1.09 },
  { msg: '😱 Exchange hack reported!', impact: 0.82 },
  { msg: '🌍 Country adopts crypto as legal tender', impact: 1.15 },
  { msg: '📊 ETF approval expected soon', impact: 1.1 },
  { msg: '💸 Crypto winter fears spread', impact: 0.9 },
  { msg: '🎯 Major partnership announced', impact: 1.07 },
  { msg: '⚠️ Market manipulation probe', impact: 0.93 },
]

interface CoinState {
  id: string; name: string; icon: string; color: string; price: number; change: number; history: number[]; volatility: number
}

const initialPrices: Record<string, number> = { BTC: 42000, ETH: 2200, SOL: 95, DOGE: 0.08, ADA: 0.45 }

export default function CryptoRush() {
  const [coins, setCoins] = useState<CoinState[]>(
    COINS.map(c => ({ ...c, price: initialPrices[c.id], change: 0, history: [initialPrices[c.id]] }))
  )
  const [portfolio, setPortfolio] = useState<Record<string, number>>({})
  const [cash, setCash] = useState(10000)
  const [news, setNews] = useState('🎮 Market is open! Buy low, sell high!')
  const [newsImpact, setNewsImpact] = useState<{ coinId: string; factor: number } | null>(null)
  const [tick, setTick] = useState(0)
  const [gameTime, setGameTime] = useState(180)
  const [running, setRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [tradeQty, setTradeQty] = useState<Record<string, number>>({})
  const [trades, setTrades] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const { addXP, addNotification } = useAppStore()

  const totalValue = coins.reduce((sum, c) => sum + (portfolio[c.id] || 0) * c.price, 0) + cash
  const pnl = totalValue - 10000
  const pnlPct = ((pnl / 10000) * 100).toFixed(2)

  const tick$ = useCallback(() => {
    setTick(t => t + 1)
    setGameTime(prev => {
      if (prev <= 1) { setRunning(false); setGameOver(true); return 0 }
      return prev - 1
    })

    // Random news event every ~15 ticks
    if (Math.random() < 0.07) {
      const event = NEWS_EVENTS[Math.floor(Math.random() * NEWS_EVENTS.length)]
      const affectedCoin = COINS[Math.floor(Math.random() * COINS.length)]
      setNews(`${event.msg} — ${affectedCoin.name} affected!`)
      setNewsImpact({ coinId: affectedCoin.id, factor: event.impact })
      setTimeout(() => setNewsImpact(null), 3000)
    }

    setCoins(prev => prev.map(c => {
      const trend = (Math.random() - 0.48) * c.volatility
      let newPrice = c.price * (1 + trend)
      if (newsImpact?.coinId === c.id) newPrice *= newsImpact.factor
      newPrice = Math.max(newPrice, c.price * 0.5)
      const change = ((newPrice - c.price) / c.price) * 100
      const history = [...c.history.slice(-30), newPrice]
      return { ...c, price: newPrice, change, history }
    }))
  }, [newsImpact])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick$, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, tick$])

  const buy = (coinId: string) => {
    const coin = coins.find(c => c.id === coinId)!
    const qty = tradeQty[coinId] || 1
    const cost = coin.price * qty
    if (cost > cash) { addNotification({ type: 'error', message: 'Not enough cash!' }); return }
    setCash(prev => prev - cost)
    setPortfolio(prev => ({ ...prev, [coinId]: (prev[coinId] || 0) + qty }))
    setTrades(t => t + 1)
  }

  const sell = (coinId: string) => {
    const coin = coins.find(c => c.id === coinId)!
    const qty = Math.min(tradeQty[coinId] || 1, portfolio[coinId] || 0)
    if (qty <= 0) { addNotification({ type: 'error', message: 'No holdings to sell!' }); return }
    setCash(prev => prev + coin.price * qty)
    setPortfolio(prev => ({ ...prev, [coinId]: (prev[coinId] || 0) - qty }))
    setTrades(t => t + 1)
  }

  const startGame = () => {
    setCoins(COINS.map(c => ({ ...c, price: initialPrices[c.id], change: 0, history: [initialPrices[c.id]] })))
    setPortfolio({}); setCash(10000); setTick(0); setGameTime(180)
    setTrades(0); setGameOver(false); setRunning(true)
    setNews('🎮 Market is open! Buy low, sell high!')
  }

  const xpEarned = Math.max(50, Math.round(Math.abs(pnl) / 100) + trades * 5)

  const fmt = (n: number) => n >= 1 ? `$${n.toLocaleString('en', { maximumFractionDigits: 2 })}` : `$${n.toFixed(4)}`

  if (gameOver) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md text-center p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="text-5xl mb-4">{pnl >= 0 ? '🏆' : '📉'}</div>
        <h2 className="font-cinzel font-bold text-2xl text-white mb-2">Game Over!</h2>
        <p className="text-slate-400 mb-6">Final Portfolio Value: <span className="text-white font-bold">${totalValue.toFixed(2)}</span></p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { l: 'P&L', v: `${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`, c: pnl >= 0 ? '#10b981' : '#ef4444' },
            { l: 'Return', v: `${pnl >= 0 ? '+' : ''}${pnlPct}%`, c: pnl >= 0 ? '#10b981' : '#ef4444' },
            { l: 'Trades', v: trades, c: '#6366f1' },
            { l: 'XP Earned', v: `+${xpEarned}`, c: '#f59e0b' },
          ].map(s => (
            <div key={s.l} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-slate-500 text-xs mb-1">{s.l}</p>
              <p className="font-bold text-lg" style={{ color: s.c }}>{s.v}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={startGame} className="flex-1 py-3 rounded-xl text-white font-semibold" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
            <RefreshCw size={16} className="inline mr-2" />Play Again
          </button>
          <button onClick={() => { addXP(xpEarned); addNotification({ type: 'success', message: `+${xpEarned} XP saved!` }) }}
            className="flex-1 py-3 rounded-xl text-white font-bold" style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
            <Trophy size={16} className="inline mr-2" />Save XP
          </button>
        </div>
      </motion.div>
    </div>
  )

  if (!running && !gameOver) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg text-center">
        <Link to="/games" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 justify-center">
          <ArrowLeft size={16} />Back to Games
        </Link>
        <div className="text-6xl mb-4">₿</div>
        <h1 className="font-cinzel font-black text-4xl text-white mb-3">Crypto Rush</h1>
        <p className="text-slate-400 mb-4">Start with $10,000 virtual cash. Trade 5 cryptocurrencies in 3 minutes. Maximize your portfolio!</p>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[{ l: 'Starting Cash', v: '$10,000' }, { l: 'Time Limit', v: '3 min' }, { l: 'Coins', v: '5' }].map(s => (
            <div key={s.l} className="p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p className="text-amber-400 font-bold">{s.v}</p>
              <p className="text-slate-500 text-xs">{s.l}</p>
            </div>
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={startGame}
          className="px-10 py-4 rounded-2xl text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 8px 30px rgba(245,158,11,0.4)' }}>
          🚀 Start Trading
        </motion.button>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen px-3 sm:px-6 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <span className="font-cinzel font-bold text-white">Crypto Rush</span>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-red-400 text-sm font-mono">{Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400">Cash: <span className="text-white font-bold">${cash.toFixed(0)}</span></span>
          <span className="text-slate-400">Portfolio: <span className={`font-bold ${pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{pnl >= 0 ? '+' : ''}${pnl.toFixed(0)} ({pnlPct}%)</span></span>
        </div>
      </div>

      {/* News Ticker */}
      <motion.div key={news} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="mb-4 p-3 rounded-xl text-sm font-medium" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
        📰 {news}
      </motion.div>

      {/* Coins Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coins.map(coin => {
          const held = portfolio[coin.id] || 0
          const qty = tradeQty[coin.id] || 1
          return (
            <motion.div key={coin.id} layout className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${coin.change >= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold" style={{ color: coin.color }}>{coin.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{coin.id}</p>
                    <p className="text-slate-500 text-xs">{coin.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold font-mono text-sm">{fmt(coin.price)}</p>
                  <p className={`text-xs flex items-center gap-1 justify-end ${coin.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {coin.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Mini price chart */}
              <div className="h-8 mb-3 flex items-end gap-px">
                {coin.history.slice(-20).map((p, i, arr) => {
                  const max = Math.max(...arr); const min = Math.min(...arr)
                  const h = max === min ? 50 : ((p - min) / (max - min)) * 100
                  return <div key={i} className="flex-1 rounded-sm" style={{ height: `${Math.max(10, h)}%`, background: coin.change >= 0 ? 'rgba(16,185,129,0.6)' : 'rgba(239,68,68,0.6)' }} />
                })}
              </div>

              {held > 0 && <p className="text-xs text-amber-400 mb-2">Holdings: {held} • ${(held * coin.price).toFixed(2)}</p>}

              <div className="flex items-center gap-2">
                <input type="number" min={1} value={qty} onChange={e => setTradeQty(prev => ({ ...prev, [coin.id]: Math.max(1, Number(e.target.value)) }))}
                  className="w-16 px-2 py-1.5 rounded-lg text-center text-sm text-white" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }} />
                <button onClick={() => buy(coin.id)} className="flex-1 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:scale-105"
                  style={{ background: 'rgba(16,185,129,0.25)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' }}>
                  BUY ${(coin.price * qty).toFixed(0)}
                </button>
                <button onClick={() => sell(coin.id)} disabled={!held} className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105 disabled:opacity-30"
                  style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }}>
                  SELL
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
