import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownCircle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import CalcLayout from '../components/CalcLayout'
import { calculateSWP, formatCurrency } from '../utils/calculations'

export default function SWPCalculator() {
  const [corpus, setCorpus] = useState(5000000)
  const [withdrawal, setWithdrawal] = useState(25000)
  const [rate, setRate] = useState(10)

  const result = useMemo(() => calculateSWP(corpus, withdrawal, rate), [corpus, withdrawal, rate])

  return (
    <CalcLayout title="SWP Calculator" subtitle="Systematic Withdrawal Plan — Plan your retirement income"
      icon={<ArrowDownCircle size={26} />} color="#10b981"
      calcType="SWP" inputs={{ corpus, monthlyWithdrawal: withdrawal, annualReturn: rate }} result={{ sustainableYears: result.sustainableYears, totalWithdrawn: result.totalWithdrawn }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-white font-semibold">Withdrawal Plan</h3>
          {[
            { label: 'Initial Corpus', value: corpus, setter: setCorpus, min: 500000, max: 50000000, step: 100000, format: (v: number) => formatCurrency(v, true) },
            { label: 'Monthly Withdrawal', value: withdrawal, setter: setWithdrawal, min: 1000, max: 500000, step: 1000, format: (v: number) => formatCurrency(v, true) },
            { label: 'Expected Return (%)', value: rate, setter: setRate, min: 4, max: 15, step: 0.5, format: (v: number) => `${v}%` },
          ].map(f => (
            <div key={f.label}>
              <div className="flex justify-between mb-2">
                <label className="text-slate-400 text-sm">{f.label}</label>
                <span className="text-white font-semibold text-sm px-3 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>{f.format(f.value)}</span>
              </div>
              <input type="range" className="range-slider w-full" min={f.min} max={f.max} step={f.step} value={f.value} onChange={e => f.setter(Number(e.target.value))} style={{ accentColor: '#10b981' }} />
            </div>
          ))}
          <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <p className="text-emerald-400 font-medium">Withdrawal Rate: {((withdrawal * 12 / corpus) * 100).toFixed(2)}% p.a.</p>
            <p className="text-slate-500 text-xs mt-0.5">Sustainable if below your return rate</p>
          </div>
        </div>
        <div className="space-y-4">
          <motion.div key={result.sustainableYears} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="p-6 rounded-2xl text-center mb-3" style={{ background: result.sustainableYears > 30 ? 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(52,211,153,0.08))' : 'linear-gradient(135deg,rgba(239,68,68,0.15),rgba(252,165,165,0.08))', border: `1px solid ${result.sustainableYears > 30 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
              <p className="text-slate-400 text-sm mb-1">Corpus Lasts</p>
              <p className="font-cinzel font-black text-4xl text-white">{result.sustainableYears > 99 ? '100+' : result.sustainableYears} years</p>
              <p className="text-xs mt-1" style={{ color: result.sustainableYears > 30 ? '#34d399' : '#f87171' }}>
                {result.sustainableYears > 30 ? '✅ Well-structured plan' : '⚠️ Increase corpus or reduce withdrawal'}
              </p>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Monthly Income', value: formatCurrency(withdrawal, true), color: '#10b981' },
              { label: 'Annual Income', value: formatCurrency(withdrawal * 12, true), color: '#6366f1' },
              { label: 'Total Withdrawn', value: formatCurrency(result.totalWithdrawn, true), color: '#f59e0b' },
              { label: 'Final Balance', value: formatCurrency(result.finalBalance, true), color: '#a855f7' },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                <p className="font-bold text-sm" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-white font-semibold mb-4">Corpus Depletion Over Time</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.yearlyData}>
              <defs>
                <linearGradient id="swpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `Y${v}`} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => formatCurrency(v, true)} width={75} />
              <Tooltip formatter={(v: number) => formatCurrency(v, true)} contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10 }} />
              <Area type="monotone" dataKey="balance" name="Corpus Balance" stroke="#10b981" fill="url(#swpGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CalcLayout>
  )
}
