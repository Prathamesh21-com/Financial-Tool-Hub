import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line, ReferenceLine } from 'recharts'
import CalcLayout from '../components/CalcLayout'
import { calculateFIRE, formatCurrency } from '../utils/calculations'

export default function FIRECalculator() {
  const [annualExp, setAnnualExp] = useState(600000)
  const [currentAge, setCurrentAge] = useState(28)
  const [targetAge, setTargetAge] = useState(45)
  const [savings, setSavings] = useState(1000000)
  const [monthly, setMonthly] = useState(50000)
  const [rate, setRate] = useState(12)
  const [swr, setSwr] = useState(4)

  const result = useMemo(() => calculateFIRE(annualExp, currentAge, targetAge, savings, monthly, rate, swr), [annualExp, currentAge, targetAge, savings, monthly, rate, swr])

  const chartData = useMemo(() => {
    const r = rate / 100 / 12
    return Array.from({ length: Math.min(result.yearsToFIRE + 5, 40) }, (_, i) => {
      const y = i + 1
      const n = y * 12
      const sv = savings * Math.pow(1 + rate / 100, y)
      const sc = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : monthly * n
      return { year: y, corpus: Math.round(sv + sc), fire: result.fireNumber }
    })
  }, [result, savings, monthly, rate])

  return (
    <CalcLayout title="FIRE Calculator" subtitle="Financial Independence, Retire Early — Find your number"
      icon={<Flame size={26} />} color="#f97316"
      calcType="FIRE" inputs={{ annualExpenses: annualExp, currentAge, targetFIREAge: targetAge }} result={{ fireNumber: result.fireNumber, projectedCorpus: result.projectedCorpus }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-white font-semibold">FIRE Planning</h3>
          {[
            { label: 'Annual Expenses', value: annualExp, setter: setAnnualExp, min: 120000, max: 5000000, step: 12000, format: (v: number) => formatCurrency(v, true) },
            { label: 'Current Savings', value: savings, setter: setSavings, min: 0, max: 10000000, step: 50000, format: (v: number) => formatCurrency(v, true) },
            { label: 'Monthly Investment', value: monthly, setter: setMonthly, min: 1000, max: 500000, step: 1000, format: (v: number) => formatCurrency(v, true) },
            { label: 'Expected Return (%)', value: rate, setter: setRate, min: 6, max: 20, step: 0.5, format: (v: number) => `${v}%` },
            { label: 'Safe Withdrawal Rate', value: swr, setter: setSwr, min: 2, max: 6, step: 0.5, format: (v: number) => `${v}%` },
          ].map(f => (
            <div key={f.label}>
              <div className="flex justify-between mb-1">
                <label className="text-slate-400 text-sm">{f.label}</label>
                <span className="text-white text-sm font-semibold">{f.format(f.value)}</span>
              </div>
              <input type="range" className="range-slider w-full" min={f.min} max={f.max} step={f.step} value={f.value} onChange={e => f.setter(Number(e.target.value))} style={{ accentColor: '#f97316' }} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[{ l: 'Current Age', v: currentAge, s: setCurrentAge }, { l: 'Target FIRE Age', v: targetAge, s: setTargetAge }].map(f => (
              <div key={f.l}>
                <label className="text-slate-400 text-xs block mb-1">{f.l}</label>
                <input type="number" className="input-field text-center font-bold" value={f.v} onChange={e => f.s(Number(e.target.value))} min={18} max={70} />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <motion.div key={result.fireNumber} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg,rgba(249,115,22,0.18),rgba(251,191,36,0.08))', border: '1px solid rgba(249,115,22,0.35)' }}>
            <p className="text-slate-400 text-sm mb-1">Your FIRE Number 🔥</p>
            <p className="font-cinzel font-black text-4xl text-white">{formatCurrency(result.fireNumber, true)}</p>
            <p className="text-orange-400 text-xs mt-1">Based on {swr}% Safe Withdrawal Rate</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Projected Corpus', value: formatCurrency(result.projectedCorpus, true), color: result.isAchievable ? '#10b981' : '#f87171' },
              { label: 'FIRE Age', value: `${result.actualFIREAge} yrs`, color: '#f97316' },
              { label: 'Years to FIRE', value: `${result.yearsToFIRE} yrs`, color: '#a855f7' },
              { label: 'Monthly Passive Income', value: formatCurrency(result.monthlyPassiveIncome, true), color: '#f59e0b' },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-slate-500 text-xs mb-1">{item.label}</p>
                <p className="font-bold" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-white font-semibold mb-4">Corpus Growth vs FIRE Number</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fireGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `Y${v}`} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => formatCurrency(v, true)} width={75} />
              <Tooltip formatter={(v: number) => formatCurrency(v, true)} contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 10 }} />
              <Area type="monotone" dataKey="corpus" name="Your Corpus" stroke="#f97316" fill="url(#fireGrad)" strokeWidth={2} />
              <Line type="monotone" dataKey="fire" name="FIRE Target" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CalcLayout>
  )
}
