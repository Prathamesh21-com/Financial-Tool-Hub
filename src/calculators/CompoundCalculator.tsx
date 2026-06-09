import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import CalcLayout from '../components/CalcLayout'
import { calculateCompound, formatCurrency } from '../utils/calculations'

export default function CompoundCalculator() {
  const [principal, setPrincipal] = useState(100000)
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(15)
  const [freq, setFreq] = useState(1)

  const result = useMemo(() => calculateCompound(principal, rate, years, freq), [principal, rate, years, freq])

  const simpleInterest = principal * (rate / 100) * years
  const extraFromCompounding = result.totalInterest - simpleInterest

  return (
    <CalcLayout title="Compound Interest" subtitle="See the magic of compounding over time"
      icon={<Zap size={26} />} color="#38bdf8"
      calcType="Compound Interest" inputs={{ principal, annualRate: rate, years }} result={{ finalAmount: result.finalAmount, totalInterest: result.totalInterest }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-white font-semibold">Compound Details</h3>
          {[
            { label: 'Principal Amount', value: principal, setter: setPrincipal, min: 1000, max: 10000000, step: 1000, format: (v: number) => formatCurrency(v, true) },
            { label: 'Annual Rate', value: rate, setter: setRate, min: 1, max: 30, step: 0.5, format: (v: number) => `${v}%` },
            { label: 'Time Period', value: years, setter: setYears, min: 1, max: 40, step: 1, format: (v: number) => `${v} yrs` },
          ].map(f => (
            <div key={f.label}>
              <div className="flex justify-between mb-2">
                <label className="text-slate-400 text-sm">{f.label}</label>
                <span className="text-white font-semibold text-sm px-3 py-1 rounded-lg" style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.25)' }}>{f.format(f.value)}</span>
              </div>
              <input type="range" className="range-slider w-full" min={f.min} max={f.max} step={f.step} value={f.value} onChange={e => f.setter(Number(e.target.value))} style={{ accentColor: '#38bdf8' }} />
            </div>
          ))}
          <div>
            <label className="text-slate-400 text-sm block mb-2">Compounding</label>
            <div className="grid grid-cols-4 gap-2">
              {[{ v: 1, l: 'Annual' }, { v: 2, l: 'Semi' }, { v: 4, l: 'Qtly' }, { v: 12, l: 'Monthly' }].map(o => (
                <button key={o.v} onClick={() => setFreq(o.v)}
                  className="py-2 rounded-lg text-xs font-medium transition-all"
                  style={{ background: freq === o.v ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${freq === o.v ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.08)'}`, color: freq === o.v ? '#38bdf8' : '#64748b' }}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <motion.div key={result.finalAmount} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg,rgba(56,189,248,0.15),rgba(99,102,241,0.1))', border: '1px solid rgba(56,189,248,0.3)' }}>
            <p className="text-slate-400 text-sm mb-1">Final Amount</p>
            <p className="font-cinzel font-black text-4xl text-white">{formatCurrency(result.finalAmount, true)}</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Principal', value: formatCurrency(principal, true), color: '#6366f1' },
              { label: 'Interest Earned', value: formatCurrency(result.totalInterest, true), color: '#38bdf8' },
              { label: 'Simple Interest', value: formatCurrency(simpleInterest, true), color: '#94a3b8' },
              { label: 'Extra via Compounding', value: formatCurrency(Math.max(0, extraFromCompounding), true), color: '#10b981' },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                <p className="font-bold text-sm" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)' }}>
            <p className="text-sky-400 text-sm font-medium">📈 Rule of 72</p>
            <p className="text-slate-400 text-xs mt-1">At {rate}%, your money doubles every <span className="text-white font-bold">{(72 / rate).toFixed(1)} years</span></p>
          </div>
        </div>
      </div>
      <div className="mt-6 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-white font-semibold mb-4">Compound vs Simple Interest</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={result.yearlyBreakdown.map((d, i) => ({ ...d, simple: principal + simpleInterest / years * (i + 1) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `Y${v}`} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => formatCurrency(v, true)} width={70} />
              <Tooltip formatter={(v: number) => formatCurrency(v, true)} contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 10 }} />
              <Line type="monotone" dataKey="amount" name="Compound" stroke="#38bdf8" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="simple" name="Simple" stroke="#475569" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CalcLayout>
  )
}
