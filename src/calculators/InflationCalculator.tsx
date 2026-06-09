import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import CalcLayout from '../components/CalcLayout'
import { calculateInflation, formatCurrency } from '../utils/calculations'

export default function InflationCalculator() {
  const [amount, setAmount] = useState(100000)
  const [inflationRate, setInflationRate] = useState(6)
  const [years, setYears] = useState(20)

  const result = useMemo(() => calculateInflation(amount, inflationRate, years), [amount, inflationRate, years])

  return (
    <CalcLayout title="Inflation Calculator" subtitle="Understand how inflation erodes purchasing power"
      icon={<TrendingDown size={26} />} color="#84cc16"
      calcType="Inflation" inputs={{ currentAmount: amount, inflationRate, years }} result={{ futureValue: result.futureValue, presentValue: result.presentValue }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-white font-semibold">Inflation Details</h3>
          <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(132,204,22,0.07)', border: '1px solid rgba(132,204,22,0.2)' }}>
            <p className="text-lime-400 font-medium">India Average CPI Inflation: ~5-6% p.a.</p>
          </div>
          {[
            { label: 'Current Amount', value: amount, setter: setAmount, min: 1000, max: 10000000, step: 1000, format: (v: number) => formatCurrency(v, true) },
            { label: 'Inflation Rate (%)', value: inflationRate, setter: setInflationRate, min: 1, max: 15, step: 0.5, format: (v: number) => `${v}%` },
            { label: 'Time Period', value: years, setter: setYears, min: 1, max: 40, step: 1, format: (v: number) => `${v} yrs` },
          ].map(f => (
            <div key={f.label}>
              <div className="flex justify-between mb-2">
                <label className="text-slate-400 text-sm">{f.label}</label>
                <span className="text-white font-semibold text-sm px-3 py-1 rounded-lg" style={{ background: 'rgba(132,204,22,0.12)', border: '1px solid rgba(132,204,22,0.25)' }}>{f.format(f.value)}</span>
              </div>
              <input type="range" className="range-slider w-full" min={f.min} max={f.max} step={f.step} value={f.value} onChange={e => f.setter(Number(e.target.value))} style={{ accentColor: '#84cc16' }} />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <motion.div key={result.futureValue} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="grid grid-cols-1 gap-3">
            <div className="p-5 rounded-2xl text-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <p className="text-slate-400 text-sm mb-1">Today's {formatCurrency(amount, true)} will cost</p>
              <p className="font-cinzel font-black text-3xl text-white">{formatCurrency(result.futureValue, true)}</p>
              <p className="text-rose-400 text-xs mt-1">in {years} years</p>
            </div>
            <div className="p-5 rounded-2xl text-center" style={{ background: 'rgba(132,204,22,0.08)', border: '1px solid rgba(132,204,22,0.2)' }}>
              <p className="text-slate-400 text-sm mb-1">Today's value of future {formatCurrency(amount, true)}</p>
              <p className="font-cinzel font-black text-3xl text-white">{formatCurrency(result.presentValue, true)}</p>
              <p className="text-lime-400 text-xs mt-1">in today's purchasing power</p>
            </div>
          </motion.div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Purchasing Power Loss</span>
              <span className="text-rose-400 font-bold text-lg">{result.purchasingPowerLoss}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/10">
              <motion.div initial={{ width: 0 }} animate={{ width: `${result.purchasingPowerLoss}%` }} transition={{ duration: 1 }}
                className="h-full rounded-full bg-rose-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-white font-semibold mb-4">Purchasing Power Over Time</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.yearlyData}>
              <defs>
                <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#84cc16" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#84cc16" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `Y${v}`} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => formatCurrency(v, true)} width={70} />
              <Tooltip formatter={(v: number) => formatCurrency(v, true)} contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(132,204,22,0.3)', borderRadius: 10 }} />
              <Area type="monotone" dataKey="presentValue" name="Purchasing Power" stroke="#84cc16" fill="url(#pvGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="futureValue" name="Nominal Cost" stroke="#ef4444" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CalcLayout>
  )
}
