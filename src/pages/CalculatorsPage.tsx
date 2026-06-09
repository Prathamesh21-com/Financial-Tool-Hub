import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Calculator, TrendingUp, Shield, Zap, Lock, Target, Flame, TrendingDown, DollarSign, PieChart, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

const ALL_CALCS = [
  { id: 'sip', name: 'SIP Calculator', desc: 'Systematic Investment Plan returns', icon: TrendingUp, color: '#6366f1', category: 'Investment', tag: 'Popular' },
  { id: 'emi', name: 'EMI Calculator', desc: 'Loan EMI & amortization schedule', icon: Calculator, color: '#a855f7', category: 'Loan', tag: 'Essential' },
  { id: 'fd', name: 'FD Calculator', desc: 'Fixed Deposit maturity value', icon: Shield, color: '#10b981', category: 'Savings', tag: '' },
  { id: 'ppf', name: 'PPF Calculator', desc: 'Public Provident Fund corpus', icon: Lock, color: '#f59e0b', category: 'Tax Saving', tag: 'Tax Free' },
  { id: 'compound', name: 'Compound Interest', desc: 'Power of compounding', icon: Zap, color: '#38bdf8', category: 'Investment', tag: '' },
  { id: 'retirement', name: 'Retirement Calculator', desc: 'Retirement corpus planning', icon: Target, color: '#ec4899', category: 'Planning', tag: 'New' },
  { id: 'fire', name: 'FIRE Calculator', desc: 'Financial Independence Retire Early', icon: Flame, color: '#f97316', category: 'Planning', tag: 'New' },
  { id: 'inflation', name: 'Inflation Calculator', desc: 'Purchasing power erosion', icon: TrendingDown, color: '#84cc16', category: 'Planning', tag: '' },
  { id: 'emergency', name: 'Emergency Fund', desc: 'Financial safety net target', icon: Shield, color: '#06b6d4', category: 'Savings', tag: '' },
  { id: 'networth', name: 'Net Worth Calculator', desc: 'Total wealth calculation', icon: PieChart, color: '#8b5cf6', category: 'Planning', tag: '' },
  { id: 'stepupsip', name: 'Step-up SIP', desc: 'Increasing SIP with annual top-up', icon: ArrowUpCircle, color: '#f59e0b', category: 'Investment', tag: 'Smart' },
  { id: 'swp', name: 'SWP Calculator', desc: 'Systematic Withdrawal Plan', icon: ArrowDownCircle, color: '#10b981', category: 'Retirement', tag: '' },
]

const CATEGORIES = ['All', 'Investment', 'Loan', 'Savings', 'Planning', 'Tax Saving', 'Retirement']

export default function CalculatorsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = ALL_CALCS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || c.category === category
    return matchSearch && matchCat
  })

  return (
    <div className="min-h-screen px-4 sm:px-6 py-16 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Calculator size={14} className="text-indigo-400" />
          <span className="text-indigo-300">12 Professional Calculators</span>
        </div>
        <h1 className="font-cinzel font-black text-4xl md:text-5xl text-white mb-4">Financial <span className="text-gradient">Calculators</span></h1>
        <p className="text-slate-400 max-w-xl mx-auto">AI-powered calculators with live charts, animated results and educational insights</p>
      </motion.div>

      {/* Search + Filter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search calculators..."
            className="input-field pl-12 text-base py-3 w-full max-w-md" />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: category === cat ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${category === cat ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`, color: category === cat ? '#818cf8' : '#64748b' }}>
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((calc, i) => (
          <motion.div key={calc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link to={`/calculators/${calc.id}`}>
              <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 400 }}
                className="group relative p-5 rounded-2xl h-full cursor-pointer overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${calc.color}18, transparent 70%)`, border: `1px solid ${calc.color}30` }} />
                <div className="relative z-10">
                  {calc.tag && (
                    <span className="absolute -top-2 right-0 text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: `${calc.color}25`, color: calc.color, border: `1px solid ${calc.color}40` }}>
                      {calc.tag}
                    </span>
                  )}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${calc.color}15`, border: `1px solid ${calc.color}30` }}>
                    <calc.icon size={20} style={{ color: calc.color }} />
                  </div>
                  <h3 className="text-white font-semibold mb-1 text-sm">{calc.name}</h3>
                  <p className="text-slate-500 text-xs mb-3 leading-relaxed">{calc.desc}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}>{calc.category}</span>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Calculator size={40} className="mx-auto mb-3 opacity-20" />
          <p>No calculators found for "{search}"</p>
        </div>
      )}
    </div>
  )
}
