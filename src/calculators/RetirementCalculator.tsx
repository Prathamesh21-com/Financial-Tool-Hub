import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sunset } from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'
import CalcLayout from '../components/CalcLayout'
import { calculateRetirement, formatCurrency } from '../utils/calculations'

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30)
  const [retireAge, setRetireAge] = useState(60)
  const [monthlyExp, setMonthlyExp] = useState(50000)
  const [currentSavings, setCurrentSavings] = useState(500000)
  const [monthlyInvest, setMonthlyInvest] = useState(20000)
  const [returnRate, setReturnRate] = useState(12)
  const [inflation, setInflation] = useState(6)

  const result = useMemo(() => calculateRetirement(currentAge, retireAge, monthlyExp, currentSavings, monthlyInvest, returnRate, inflation), [currentAge, retireAge, monthlyExp, currentSavings, monthlyInvest, returnRate, inflation])

  const progressPct = Math.min(100, Math.round((result.projectedCorpus / result.corpusNeeded) * 100))

  return (
    <CalcLayout title="Retirement Calculator" subtitle="Plan your retirement corpus and financial freedom"
      icon={<span style={{ fontSize: 22 }}>🌅</span>} color="#ec4899"
      calcType="Retirement" inputs={{ currentAge, retireAge, monthlyExpenses: monthlyExp, returnRate, inflation }}
      result={{ corpusNeeded: result.corpusNeeded, projectedCorpus: result.projectedCorpus }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-white font-semibold">Your Retirement Plan</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Current Age', value: currentAge, setter: setCurrentAge, min: 18, max: 55, step: 1 },
              { label: 'Retire At', value: retireAge, setter: setRetireAge, min: 40, max: 70, step: 1 },
            ].map(f => (
              <div key={f.label}>
                <label className="text-slate-400 text-xs block mb-1">{f.label}</label>
                <div className="flex items-center gap-2">
                  <input type="number" className="input-field text-center text-lg font-bold py-2" value={f.value}
                    onChange={e => f.setter(Number(e.target.value))} min={f.min} max={f.max} />
                  <span className="text-slate-500 text-xs">yrs</span>
                </div>
              </div>
            ))}
          </div>
          {[
            { label: 'Monthly Expenses Today', value: monthlyExp, setter: setMonthlyExp, min: 5000, max: 500000, step: 1000, format: (v: number) => formatCurrency(v, true) },
            { label: 'Current Savings', value: currentSavings, setter: setCurrentSavings, min: 0, max: 10000000, step: 10000, format: (v: number) => formatCurrency(v, true) },
            { label: 'Monthly Investment', value: monthlyInvest, setter: setMonthlyInvest, min: 1000, max: 200000, step: 500, format: (v: number) => formatCurrency(v, true) },
            { label: 'Expected Return (%)', value: returnRate, setter: setReturnRate, min: 6, max: 20, step: 0.5, format: (v: number) => `${v}%` },
            { label: 'Inflation Rate (%)', value: inflation, setter: setInflation, min: 3, max: 12, step: 0.5, format: (v: number) => `${v}%` },
          ].map(f => (
            <div key={f.label}>
              <div className="flex justify-between mb-1">
                <label className="text-slate-400 text-sm">{f.label}</label>
                <span className="text-white text-sm font-semibold">{f.format(f.value)}</span>
              </div>
              <input type="range" className="range-slider w-full" min={f.min} max={f.max} step={f.step} value={f.value} onChange={e => f.setter(Number(e.target.value))} style={{ accentColor: '#ec4899' }} />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <motion.div key={result.projectedCorpus} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-2xl"
            style={{ background: result.isOnTrack ? 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(52,211,153,0.08))' : 'linear-gradient(135deg,rgba(239,68,68,0.15),rgba(252,165,165,0.08))', border: `1px solid ${result.isOnTrack ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-sm">Status</p>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${result.isOnTrack ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                {result.isOnTrack ? '✅ On Track!' : '⚠️ Needs Attention'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Corpus Needed</p>
                <p className="text-white font-bold text-lg">{formatCurrency(result.corpusNeeded, true)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Projected Corpus</p>
                <p className="font-bold text-lg" style={{ color: result.isOnTrack ? '#34d399' : '#f87171' }}>{formatCurrency(result.projectedCorpus, true)}</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Progress</span><span>{progressPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full" style={{ background: result.isOnTrack ? '#10b981' : '#ef4444' }} />
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Years to Retire', value: `${retireAge - currentAge} yrs`, color: '#6366f1' },
              { label: 'Monthly at Retirement', value: formatCurrency(result.monthlyExpensesAtRetirement, true), color: '#ec4899' },
              { label: 'Savings Grown', value: formatCurrency(result.savingsGrown, true), color: '#f59e0b' },
              { label: 'SIP Corpus', value: formatCurrency(result.sipCorpus, true), color: '#10b981' },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-slate-500 text-xs mb-1">{item.label}</p>
                <p className="font-bold text-sm" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
          {!result.isOnTrack && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-rose-400 font-semibold text-sm">💡 Recommendation</p>
              <p className="text-slate-400 text-xs mt-1">Increase monthly investment by {formatCurrency(Math.round(result.shortfall / ((retireAge - currentAge) * 12)), true)}/month or delay retirement by a few years.</p>
            </div>
          )}
        </div>
      </div>
    </CalcLayout>
  )
}
