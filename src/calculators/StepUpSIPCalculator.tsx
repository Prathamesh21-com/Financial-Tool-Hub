import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import CalcLayout from '../components/CalcLayout'
import { calculateStepUpSIP, formatCurrency } from '../utils/calculations'

export default function StepUpSIPCalculator() {
  const [monthly, setMonthly] = useState(5000)
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(15)
  const [stepUp, setStepUp] = useState(10)

  const result = useMemo(() => calculateStepUpSIP(monthly, rate, years, stepUp), [monthly, rate, years, stepUp])
  const normalSIP = useMemo(() => {
    const r = rate / 100 / 12, n = years * 12
    return r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : monthly * n
  }, [monthly, rate, years])

  return (
    <CalcLayout title="Step-up SIP Calculator" subtitle="Increase your SIP annually for accelerated wealth creation"
      icon={<TrendingUp size={26} />} color="#f59e0b"
      calcType="Step-up SIP" inputs={{ monthlyInvestment: monthly, annualRate: rate, years, stepUpPercent: stepUp }}
      result={{ maturityValue: result.maturityValue, totalInvested: result.totalInvested }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-white font-semibold">Step-up SIP Details</h3>
          {[
            { label: 'Starting Monthly SIP', value: monthly, setter: setMonthly, min: 500, max: 100000, step: 500, format: (v: number) => formatCurrency(v, true) },
            { label: 'Expected Annual Return', value: rate, setter: setRate, min: 1, max: 30, step: 0.5, format: (v: number) => `${v}%` },
            { label: 'Investment Period', value: years, setter: setYears, min: 1, max: 40, step: 1, format: (v: number) => `${v} yrs` },
            { label: 'Annual Step-up (%)', value: stepUp, setter: setStepUp, min: 1, max: 30, step: 1, format: (v: number) => `${v}%` },
          ].map(f => (
            <div key={f.label}>
              <div className="flex justify-between mb-2">
                <label className="text-slate-400 text-sm">{f.label}</label>
                <span className="text-white font-semibold text-sm px-3 py-1 rounded-lg" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>{f.format(f.value)}</span>
              </div>
              <input type="range" className="range-slider w-full" min={f.min} max={f.max} step={f.step} value={f.value} onChange={e => f.setter(Number(e.target.value))} style={{ accentColor: '#f59e0b' }} />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <motion.div key={result.maturityValue} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.18),rgba(251,191,36,0.08))', border: '1px solid rgba(245,158,11,0.35)' }}>
            <p className="text-slate-400 text-sm mb-1">Step-up Maturity Value</p>
            <p className="font-cinzel font-black text-4xl text-white">{formatCurrency(result.maturityValue, true)}</p>
          </motion.div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <p className="text-slate-400 text-sm mb-2">vs Normal SIP</p>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Extra wealth created</span>
              <span className="text-emerald-400 font-bold">{formatCurrency(Math.max(0, result.maturityValue - normalSIP), true)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Invested', value: formatCurrency(result.totalInvested, true), color: '#6366f1' },
              { label: 'Returns', value: formatCurrency(result.estimatedReturns, true), color: '#10b981' },
              { label: 'Normal SIP', value: formatCurrency(normalSIP, true), color: '#94a3b8' },
              { label: 'Final Monthly SIP', value: formatCurrency(result.yearlyData[result.yearlyData.length - 1]?.monthly || monthly, true), color: '#f59e0b' },
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
        <h3 className="text-white font-semibold mb-4">Year-wise Portfolio Growth</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.yearlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="year" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `Y${v}`} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => formatCurrency(v, true)} width={75} />
              <Tooltip formatter={(v: number) => formatCurrency(v, true)} contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10 }} />
              <Bar dataKey="invested" name="Invested" fill="#6366f1" radius={[2, 2, 0, 0]} />
              <Bar dataKey="value" name="Portfolio Value" fill="#f59e0b" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CalcLayout>
  )
}
