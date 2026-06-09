import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import CalcLayout from '../components/CalcLayout'
import { calculateSIP, formatCurrency, formatLakh } from '../utils/calculations'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(99,102,241,0.3)' }}>
      <p className="text-slate-400 mb-1">Month {label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {formatCurrency(p.value, true)}
        </p>
      ))}
    </div>
  )
}

export default function SIPCalculator() {
  const [monthly, setMonthly] = useState(5000)
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(10)

  const result = useMemo(() => calculateSIP(monthly, rate, years), [monthly, rate, years])

  // Downsample chart data for performance
  const chartData = useMemo(() => {
    const step = Math.max(1, Math.floor(result.monthlyData.length / 60))
    return result.monthlyData.filter((_, i) => i % step === 0 || i === result.monthlyData.length - 1)
  }, [result])

  const wealthGain = ((result.estimatedReturns / result.totalInvestment) * 100).toFixed(1)

  const inputs = { monthlyInvestment: monthly, annualRate: rate, years }
  const res = { totalInvestment: result.totalInvestment, maturityValue: result.maturityValue, estimatedReturns: result.estimatedReturns }

  return (
    <CalcLayout
      title="SIP Calculator"
      subtitle="Calculate returns on your Systematic Investment Plan"
      icon={<TrendingUp size={26} />}
      color="#6366f1"
      calcType="SIP"
      inputs={inputs}
      result={res}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-6 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-white font-semibold text-lg">Your Investment</h3>

          {[
            { label: 'Monthly Investment', value: monthly, setter: setMonthly, min: 100, max: 200000, step: 500, prefix: '₹', format: (v: number) => formatCurrency(v, true) },
            { label: 'Expected Annual Return', value: rate, setter: setRate, min: 1, max: 30, step: 0.5, suffix: '%', format: (v: number) => `${v}%` },
            { label: 'Investment Period', value: years, setter: setYears, min: 1, max: 40, step: 1, suffix: 'yrs', format: (v: number) => `${v} years` },
          ].map(field => (
            <div key={field.label}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-slate-400 text-sm">{field.label}</label>
                <span className="text-white font-semibold text-sm px-3 py-1 rounded-lg"
                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>
                  {field.format(field.value)}
                </span>
              </div>
              <input type="range" className="range-slider w-full"
                min={field.min} max={field.max} step={field.step}
                value={field.value} onChange={e => field.setter(Number(e.target.value))}
                style={{ accentColor: '#6366f1' }} />
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>{field.prefix || ''}{field.min}{field.suffix || ''}</span>
                <span>{field.prefix || ''}{field.max}{field.suffix || ''}</span>
              </div>
            </div>
          ))}

          {/* Or type directly */}
          <div className="pt-2 border-t border-white/5">
            <label className="text-slate-500 text-xs block mb-2">Or enter amount directly:</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                <input type="number" value={monthly} onChange={e => setMonthly(Math.max(100, Number(e.target.value)))}
                  className="input-field pl-7 text-sm" placeholder="Monthly SIP" />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Main result */}
          <motion.div key={result.maturityValue}
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))', border: '1px solid rgba(99,102,241,0.25)' }}>
            <p className="text-slate-400 text-sm mb-1">Maturity Value</p>
            <p className="font-cinzel font-black text-4xl md:text-5xl text-white mb-1">{formatCurrency(result.maturityValue, true)}</p>
            <p className="text-indigo-300 text-sm">{formatLakh(result.maturityValue)}</p>
          </motion.div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Invested', value: result.totalInvestment, color: '#6366f1' },
              { label: 'Est. Returns', value: result.estimatedReturns, color: '#10b981' },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                <p className="font-bold text-lg" style={{ color: item.color }}>{formatCurrency(item.value, true)}</p>
              </div>
            ))}
          </div>

          {/* Wealth gain badge */}
          <div className="p-4 rounded-xl flex items-center justify-between"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <span className="text-slate-400 text-sm">Wealth Gain</span>
            <span className="text-emerald-400 font-bold text-lg">+{wealthGain}%</span>
          </div>

          {/* Donut visual */}
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-slate-400 text-sm mb-3">Portfolio Mix</p>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#6366f1" strokeWidth="3.5"
                    strokeDasharray={`${(result.totalInvestment / result.maturityValue) * 100.5} 100.5`} />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#10b981" strokeWidth="3.5"
                    strokeDasharray={`${(result.estimatedReturns / result.maturityValue) * 100.5} 100.5`}
                    strokeDashoffset={`-${(result.totalInvestment / result.maturityValue) * 100.5}`} />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-slate-400">Invested: {((result.totalInvestment / result.maturityValue) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-400">Returns: {((result.estimatedReturns / result.maturityValue) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-white font-semibold mb-4">Growth Over Time</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="sipInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="sipValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} axisLine={false}
                tickFormatter={v => `M${v}`} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} tickLine={false} axisLine={false}
                tickFormatter={v => formatCurrency(v, true)} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="invested" name="Invested" stroke="#6366f1" fill="url(#sipInvested)" strokeWidth={2} />
              <Area type="monotone" dataKey="value" name="Portfolio Value" stroke="#10b981" fill="url(#sipValue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CalcLayout>
  )
}
