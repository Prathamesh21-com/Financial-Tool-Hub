import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

const INDICES = [
  { name: 'SENSEX', value: '72,140.35', change: '+589.12', pct: '+0.82%', up: true },
  { name: 'NIFTY 50', value: '21,710.80', change: '+138.25', pct: '+0.64%', up: true },
  { name: 'NIFTY BANK', value: '48,250.60', change: '-58.40', pct: '-0.12%', up: false },
  { name: 'NIFTY IT', value: '35,820.15', change: '+420.30', pct: '+1.19%', up: true },
  { name: 'NIFTY MIDCAP', value: '42,180.90', change: '+310.45', pct: '+0.74%', up: true },
  { name: 'INDIA VIX', value: '14.23', change: '-0.45', pct: '-3.07%', up: false },
]

const TOP_STOCKS = [
  { name: 'Reliance', price: '₹2,456', change: '+1.2%', up: true }, { name: 'TCS', price: '₹3,812', change: '+0.8%', up: true },
  { name: 'Infosys', price: '₹1,548', change: '-0.3%', up: false }, { name: 'HDFC Bank', price: '₹1,685', change: '+0.6%', up: true },
  { name: 'Wipro', price: '₹483', change: '+2.1%', up: true }, { name: 'ICICI Bank', price: '₹1,023', change: '-0.2%', up: false },
  { name: 'ITC', price: '₹439', change: '+0.9%', up: true }, { name: 'L&T', price: '₹3,245', change: '+1.5%', up: true },
]

const COMMODITIES = [
  { name: 'Gold', price: '₹63,850/10g', change: '+0.45%', up: true, icon: '🥇' },
  { name: 'Silver', price: '₹76,200/kg', change: '+1.2%', up: true, icon: '🥈' },
  { name: 'Crude Oil', price: '$76.45/barrel', change: '-0.8%', up: false, icon: '🛢️' },
  { name: 'Natural Gas', price: '$2.48/MMBtu', change: '+2.1%', up: true, icon: '⛽' },
]

const CRYPTO = [
  { name: 'Bitcoin', price: '$42,800', change: '+2.1%', up: true, icon: '₿' },
  { name: 'Ethereum', price: '$2,240', change: '+1.8%', up: true, icon: 'Ξ' },
  { name: 'BNB', price: '$312', change: '-0.5%', up: false, icon: '🔶' },
  { name: 'Solana', price: '$95.40', change: '+3.2%', up: true, icon: '◎' },
]

function ChangeTag({ up, val }: { up: boolean; val: string }) {
  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
      {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{val}
    </span>
  )
}

export default function MarketPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="font-cinzel font-bold text-3xl text-white">Market Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Simulated data for educational purposes only</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 px-3 py-2 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-emerald-400">Simulated Live Data</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 p-3 rounded-xl text-xs text-amber-400/80" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
        ⚠️ Market data shown is simulated/approximate for educational purposes. Not real-time data. Do not use for actual trading decisions.
      </div>

      {/* Indices */}
      <section className="mb-8">
        <h2 className="text-white font-semibold mb-4 text-lg">🇮🇳 Indian Indices</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {INDICES.map(idx => (
            <motion.div key={idx.name} whileHover={{ y: -3 }}
              className="p-4 rounded-xl" style={{ background: idx.up ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)', border: `1px solid ${idx.up ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
              <p className="text-slate-400 text-xs mb-1">{idx.name}</p>
              <p className="text-white font-bold text-sm">{idx.value}</p>
              <ChangeTag up={idx.up} val={idx.pct} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Stocks */}
      <section className="mb-8">
        <h2 className="text-white font-semibold mb-4 text-lg">📈 Top Stocks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TOP_STOCKS.map(s => (
            <div key={s.name} className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div>
                <p className="text-white font-medium text-sm">{s.name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{s.price}</p>
              </div>
              <ChangeTag up={s.up} val={s.change} />
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Commodities */}
        <section>
          <h2 className="text-white font-semibold mb-4 text-lg">🏅 Commodities</h2>
          <div className="space-y-2">
            {COMMODITIES.map(c => (
              <div key={c.name} className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{c.icon}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{c.name}</p>
                    <p className="text-slate-400 text-xs">{c.price}</p>
                  </div>
                </div>
                <ChangeTag up={c.up} val={c.change} />
              </div>
            ))}
          </div>
        </section>

        {/* Crypto */}
        <section>
          <h2 className="text-white font-semibold mb-4 text-lg">₿ Crypto</h2>
          <div className="space-y-2">
            {CRYPTO.map(c => (
              <div key={c.name} className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold">{c.icon}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{c.name}</p>
                    <p className="text-slate-400 text-xs">{c.price}</p>
                  </div>
                </div>
                <ChangeTag up={c.up} val={c.change} />
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-xl text-xs text-slate-500" style={{ background: 'rgba(245,158,11,0.05)' }}>
            ⚠️ Crypto is highly volatile. 30% flat tax applies in India. Not an investment recommendation.
          </div>
        </section>
      </div>
    </div>
  )
}
