import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Shield, BarChart3 } from 'lucide-react'
import CalcLayout from '../components/CalcLayout'
import { calculateEmergencyFund, formatCurrency } from '../utils/calculations'

export default function EmergencyFundCalculator() {
  const [monthlyExp, setMonthlyExp] = useState(40000)
  const [months, setMonths] = useState(6)
  const [saved, setSaved] = useState(50000)

  const result = useMemo(() => calculateEmergencyFund(monthlyExp, months, saved), [monthlyExp, months, saved])

  const categories = [
    { label: 'Rent/EMI', pct: 35 }, { label: 'Food & Groceries', pct: 20 },
    { label: 'Transport', pct: 10 }, { label: 'Utilities', pct: 10 },
    { label: 'Healthcare', pct: 10 }, { label: 'Other', pct: 15 },
  ]

  return (
    <CalcLayout title="Emergency Fund Calculator" subtitle="Build your financial safety net"
      icon={<Shield size={26} />} color="#06b6d4"
      calcType="Emergency Fund" inputs={{ monthlyExpenses: monthlyExp, monthsOfCoverage: months }} result={{ target: result.target, remaining: result.remaining }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-white font-semibold">Your Emergency Fund</h3>
          {[
            { label: 'Monthly Expenses', value: monthlyExp, setter: setMonthlyExp, min: 5000, max: 500000, step: 1000, format: (v: number) => formatCurrency(v, true) },
            { label: 'Months of Coverage', value: months, setter: setMonths, min: 3, max: 12, step: 1, format: (v: number) => `${v} months` },
            { label: 'Currently Saved', value: saved, setter: setSaved, min: 0, max: 2000000, step: 5000, format: (v: number) => formatCurrency(v, true) },
          ].map(f => (
            <div key={f.label}>
              <div className="flex justify-between mb-2">
                <label className="text-slate-400 text-sm">{f.label}</label>
                <span className="text-white font-semibold text-sm px-3 py-1 rounded-lg" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>{f.format(f.value)}</span>
              </div>
              <input type="range" className="range-slider w-full" min={f.min} max={f.max} step={f.step} value={f.value} onChange={e => f.setter(Number(e.target.value))} style={{ accentColor: '#06b6d4' }} />
            </div>
          ))}
          <div>
            <p className="text-slate-400 text-sm mb-3">Where to keep it?</p>
            {['High-yield savings account', 'Liquid mutual funds', 'FD with sweep facility', 'Short-term debt funds'].map(o => (
              <div key={o} className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" /> {o}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className={`p-6 rounded-2xl text-center`}
            style={{ background: result.percentComplete >= 100 ? 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(52,211,153,0.08))' : 'linear-gradient(135deg,rgba(6,182,212,0.15),rgba(56,189,248,0.08))', border: `1px solid ${result.percentComplete >= 100 ? 'rgba(16,185,129,0.3)' : 'rgba(6,182,212,0.3)'}` }}>
            <p className="text-slate-400 text-sm mb-2">Emergency Fund Target</p>
            <p className="font-cinzel font-black text-4xl text-white mb-3">{formatCurrency(result.target, true)}</p>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${result.percentComplete}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full" style={{ background: result.percentComplete >= 100 ? '#10b981' : 'linear-gradient(90deg, #06b6d4, #38bdf8)' }} />
            </div>
            <p className="text-sm mt-2" style={{ color: result.percentComplete >= 100 ? '#34d399' : '#38bdf8' }}>
              {result.percentComplete >= 100 ? '✅ Emergency Fund Complete!' : `${result.percentComplete}% complete — ${formatCurrency(result.remaining, true)} to go`}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Target', value: formatCurrency(result.target, true), color: '#06b6d4' },
              { label: 'Saved', value: formatCurrency(saved, true), color: '#10b981' },
              { label: 'Remaining', value: formatCurrency(result.remaining, true), color: '#f59e0b' },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-slate-500 text-xs mb-1">{item.label}</p>
                <p className="font-bold text-xs" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)' }}>
            <p className="text-cyan-400 font-semibold text-sm mb-2">📊 Monthly Budget Breakdown</p>
            {categories.map(c => (
              <div key={c.label} className="mb-1.5">
                <div className="flex justify-between text-xs text-slate-500 mb-0.5">
                  <span>{c.label}</span><span>{formatCurrency(monthlyExp * c.pct / 100, true)}</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full">
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalcLayout>
  )
}
