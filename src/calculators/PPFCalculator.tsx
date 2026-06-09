import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import CalcLayout from '../components/CalcLayout'
import { calculatePPF, formatCurrency } from '../utils/calculations'

export default function PPFCalculator() {
  const [yearly, setYearly] = useState(150000)
  const [years, setYears] = useState(15)

  const result = useMemo(() => calculatePPF(yearly, years), [yearly, years])

  return (
    <CalcLayout title="PPF Calculator" subtitle="Public Provident Fund — Tax-free wealth building"
      icon={<Lock size={26} />} color="#f59e0b"
      calcType="PPF" inputs={{ yearlyInvestment: yearly, years }} result={{ maturityAmount: result.maturityAmount, totalInterest: result.totalInterest }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-white font-semibold">PPF Details</h3>
          <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <p className="text-amber-400 font-medium">Current PPF Rate: 7.1% p.a.</p>
            <p className="text-slate-500 text-xs mt-0.5">Set by Govt. India, compounded annually</p>
          </div>
          {[
            { label: 'Yearly Investment', value: yearly, setter: setYearly, min: 500, max: 150000, step: 500, format: (v: number) => formatCurrency(v, true) },
            { label: 'Tenure', value: years, setter: setYears, min: 15, max: 50, step: 5, format: (v: number) => `${v} yrs` },
          ].map(f => (
            <div key={f.label}>
              <div className="flex justify-between mb-2">
                <label className="text-slate-400 text-sm">{f.label}</label>
                <span className="text-white font-semibold text-sm px-3 py-1 rounded-lg" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>{f.format(f.value)}</span>
              </div>
              <input type="range" className="range-slider w-full" min={f.min} max={f.max} step={f.step} value={f.value} onChange={e => f.setter(Number(e.target.value))} style={{ accentColor: '#f59e0b' }} />
            </div>
          ))}
          <div className="pt-2 border-t border-white/5 space-y-2">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">PPF Benefits</p>
            {['EEE Tax Status (Exempt-Exempt-Exempt)', 'Government-backed zero risk', '80C deduction up to ₹1.5L/yr', 'Loan from 3rd year, withdrawal from 7th'].map(b => (
              <div key={b} className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {b}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <motion.div key={result.maturityAmount} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.15),rgba(251,191,36,0.08))', border: '1px solid rgba(245,158,11,0.3)' }}>
            <p className="text-slate-400 text-sm mb-1">Maturity Amount</p>
            <p className="font-cinzel font-black text-4xl text-white">{formatCurrency(result.maturityAmount, true)}</p>
            <p className="text-amber-400 text-xs mt-1">100% Tax-Free 🎉</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Invested', value: formatCurrency(result.totalInvestment, true), color: '#6366f1' },
              { label: 'Interest Earned', value: formatCurrency(result.totalInterest, true), color: '#f59e0b' },
              { label: 'Tax Saved (30%)', value: formatCurrency(yearly * 0.3 * years, true), color: '#10b981' },
              { label: 'Wealth Gain', value: `+${((result.maturityAmount / result.totalInvestment - 1) * 100).toFixed(0)}%`, color: '#a855f7' },
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
        <h3 className="text-white font-semibold mb-4">Year-wise Growth</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.yearlyData}>
              <defs>
                <linearGradient id="ppfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `Y${v}`} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => formatCurrency(v, true)} width={70} />
              <Tooltip formatter={(v: number) => formatCurrency(v, true)} contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10 }} />
              <Area type="monotone" dataKey="balance" name="Balance" stroke="#f59e0b" fill="url(#ppfGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="invested" name="Invested" stroke="#6366f1" fill="none" strokeWidth={1.5} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CalcLayout>
  )
}
