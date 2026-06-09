// FD Calculator
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import CalcLayout from '../components/CalcLayout'
import { calculateFD, formatCurrency } from '../utils/calculations'

export default function FDCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(7.1)
  const [years, setYears] = useState(5)
  const [freq, setFreq] = useState(4)

  const result = useMemo(() => calculateFD(principal, rate, years, freq), [principal, rate, years, freq])

  return (
    <CalcLayout title="FD Calculator" subtitle="Fixed Deposit maturity & interest calculator"
      icon={<Shield size={26} />} color="#10b981"
      calcType="FD" inputs={{ principal, annualRate: rate, years }} result={{ maturityAmount: result.maturityAmount, totalInterest: result.totalInterest }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-white font-semibold">FD Details</h3>
          {[
            { label: 'Principal Amount', value: principal, setter: setPrincipal, min: 1000, max: 5000000, step: 1000, format: (v: number) => formatCurrency(v, true) },
            { label: 'Interest Rate (p.a.)', value: rate, setter: setRate, min: 3, max: 12, step: 0.1, format: (v: number) => `${v}%` },
            { label: 'Tenure', value: years, setter: setYears, min: 1, max: 10, step: 1, format: (v: number) => `${v} yrs` },
          ].map(f => (
            <div key={f.label}>
              <div className="flex justify-between mb-2">
                <label className="text-slate-400 text-sm">{f.label}</label>
                <span className="text-white font-semibold text-sm px-3 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}>{f.format(f.value)}</span>
              </div>
              <input type="range" className="range-slider w-full" min={f.min} max={f.max} step={f.step} value={f.value} onChange={e => f.setter(Number(e.target.value))} style={{ accentColor: '#10b981' }} />
            </div>
          ))}
          <div>
            <label className="text-slate-400 text-sm block mb-2">Compounding Frequency</label>
            <div className="grid grid-cols-4 gap-2">
              {[{ v: 1, l: 'Annual' }, { v: 2, l: 'Half-yr' }, { v: 4, l: 'Quarterly' }, { v: 12, l: 'Monthly' }].map(o => (
                <button key={o.v} onClick={() => setFreq(o.v)}
                  className="py-2 rounded-lg text-xs font-medium transition-all"
                  style={{ background: freq === o.v ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${freq === o.v ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)'}`, color: freq === o.v ? '#34d399' : '#64748b' }}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <motion.div key={result.maturityAmount} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(52,211,153,0.08))', border: '1px solid rgba(16,185,129,0.25)' }}>
            <p className="text-slate-400 text-sm mb-1">Maturity Amount</p>
            <p className="font-cinzel font-black text-4xl text-white">{formatCurrency(result.maturityAmount, true)}</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Principal', value: formatCurrency(principal, true), color: '#6366f1' },
              { label: 'Interest Earned', value: formatCurrency(result.totalInterest, true), color: '#10b981' },
              { label: 'Effective Yield', value: `${result.effectiveYield.toFixed(2)}%`, color: '#f59e0b' },
              { label: 'Total Growth', value: `+${((result.maturityAmount / principal - 1) * 100).toFixed(1)}%`, color: '#a855f7' },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                <p className="font-bold" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.yearlyBreakdown}>
                <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `Y${v}`} />
                <YAxis hide />
                <Tooltip formatter={(v: number) => formatCurrency(v, true)} contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10 }} />
                <Bar dataKey="amount" name="Balance" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </CalcLayout>
  )
}
