import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CreditCard } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import CalcLayout from '../components/CalcLayout'
import { calculateEMI, formatCurrency } from '../utils/calculations'

export default function EMICalculator() {
  const [principal, setPrincipal] = useState(1000000)
  const [rate, setRate] = useState(8.5)
  const [years, setYears] = useState(20)

  const result = useMemo(() => calculateEMI(principal, rate, years), [principal, rate, years])

  const chartData = useMemo(() => {
    const step = Math.max(1, Math.floor(result.amortization.length / 48))
    return result.amortization.filter((_, i) => i % step === 0).map(row => ({
      month: row.month,
      Principal: row.principal,
      Interest: row.interest,
    }))
  }, [result])

  return (
    <CalcLayout
      title="EMI Calculator"
      subtitle="Calculate your Equated Monthly Installment for any loan"
      icon={<CreditCard size={26} />}
      color="#a855f7"
      calcType="EMI"
      inputs={{ principal, annualRate: rate, years }}
      result={{ emi: result.emi, totalAmount: result.totalAmount, totalInterest: result.totalInterest }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-white font-semibold text-lg">Loan Details</h3>
          {[
            { label: 'Loan Amount', value: principal, setter: setPrincipal, min: 10000, max: 10000000, step: 10000, format: (v: number) => formatCurrency(v, true) },
            { label: 'Interest Rate (p.a.)', value: rate, setter: setRate, min: 1, max: 25, step: 0.25, format: (v: number) => `${v}%` },
            { label: 'Loan Tenure', value: years, setter: setYears, min: 1, max: 30, step: 1, format: (v: number) => `${v} yrs` },
          ].map(field => (
            <div key={field.label}>
              <div className="flex justify-between mb-2">
                <label className="text-slate-400 text-sm">{field.label}</label>
                <span className="text-white font-semibold text-sm px-3 py-1 rounded-lg"
                  style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.25)' }}>
                  {field.format(field.value)}
                </span>
              </div>
              <input type="range" className="range-slider w-full" min={field.min} max={field.max} step={field.step}
                value={field.value} onChange={e => field.setter(Number(e.target.value))}
                style={{ accentColor: '#a855f7' }} />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <motion.div key={result.emi} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="p-6 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.1))', border: '1px solid rgba(168,85,247,0.25)' }}>
            <p className="text-slate-400 text-sm mb-1">Monthly EMI</p>
            <p className="font-cinzel font-black text-4xl md:text-5xl text-white">{formatCurrency(result.emi)}</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Principal Amount', value: principal, color: '#6366f1' },
              { label: 'Total Interest', value: result.totalInterest, color: '#a855f7' },
              { label: 'Total Payment', value: result.totalAmount, color: '#f59e0b' },
              { label: 'Interest %', value: ((result.totalInterest / result.totalAmount) * 100).toFixed(1) + '%', color: '#10b981', raw: true },
            ].map(item => (
              <div key={item.label} className="p-4 rounded-xl text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                <p className="font-bold" style={{ color: item.color }}>
                  {item.raw ? item.value : formatCurrency(item.value as number, true)}
                </p>
              </div>
            ))}
          </div>

          {result.totalInterest > principal && (
            <div className="p-4 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="text-rose-400">⚠️ You pay more in interest than the loan itself!</span>
              <p className="text-slate-500 text-xs mt-1">Consider prepayment or shorter tenure.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 className="text-white font-semibold mb-4">Principal vs Interest Over Time</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `M${v}`} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => formatCurrency(v, true)} width={70} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 12 }} />
              <Bar dataKey="Principal" fill="#6366f1" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Interest" fill="#a855f7" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CalcLayout>
  )
}
