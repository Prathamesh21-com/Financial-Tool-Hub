import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PieChart as PieIcon, Plus, Trash2 } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import CalcLayout from '../components/CalcLayout'
import { calculateNetWorth, formatCurrency } from '../utils/calculations'

interface Item { id: number; name: string; value: number }

const ASSET_COLORS = ['#6366f1','#10b981','#f59e0b','#38bdf8','#a855f7','#ec4899']
const LIA_COLORS = ['#ef4444','#f97316','#eab308','#14b8a6']

export default function NetWorthCalculator() {
  const [assets, setAssets] = useState<Item[]>([
    { id: 1, name: 'Bank Savings', value: 200000 },
    { id: 2, name: 'Mutual Funds', value: 500000 },
    { id: 3, name: 'Real Estate', value: 3000000 },
    { id: 4, name: 'PPF/EPF', value: 300000 },
  ])
  const [liabilities, setLiabilities] = useState<Item[]>([
    { id: 1, name: 'Home Loan', value: 1500000 },
    { id: 2, name: 'Car Loan', value: 200000 },
  ])

  const result = useMemo(() => calculateNetWorth(assets, liabilities), [assets, liabilities])

  const updateItem = (list: Item[], setList: (v: Item[]) => void, id: number, field: 'name' | 'value', val: string) => {
    setList(list.map(i => i.id === id ? { ...i, [field]: field === 'value' ? Number(val) || 0 : val } : i))
  }

  const addItem = (list: Item[], setList: (v: Item[]) => void, name: string) => {
    setList([...list, { id: Date.now(), name, value: 0 }])
  }

  const removeItem = (list: Item[], setList: (v: Item[]) => void, id: number) => {
    setList(list.filter(i => i.id !== id))
  }

  const pieData = assets.map(a => ({ name: a.name, value: a.value }))

  return (
    <CalcLayout title="Net Worth Calculator" subtitle="Track your total wealth — assets minus liabilities"
      icon={<PieIcon size={26} />} color="#8b5cf6"
      calcType="Net Worth" inputs={{}} result={{ totalAssets: result.totalAssets, totalLiabilities: result.totalLiabilities, netWorth: result.netWorth }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Assets 📈</h3>
            <button onClick={() => addItem(assets, setAssets, 'New Asset')}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-emerald-400 hover:bg-emerald-400/10 transition-all" style={{ border: '1px solid rgba(16,185,129,0.3)' }}>
              <Plus size={12} /> Add
            </button>
          </div>
          {assets.map(a => (
            <div key={a.id} className="flex gap-2 mb-2">
              <input value={a.name} onChange={e => updateItem(assets, setAssets, a.id, 'name', e.target.value)} className="input-field text-sm flex-1 py-2" />
              <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₹</span>
                <input type="number" value={a.value} onChange={e => updateItem(assets, setAssets, a.id, 'value', e.target.value)} className="input-field pl-6 text-sm w-32 py-2" />
              </div>
              <button onClick={() => removeItem(assets, setAssets, a.id)} className="text-slate-600 hover:text-rose-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-white/10 flex justify-between">
            <span className="text-slate-400 text-sm">Total Assets</span>
            <span className="text-emerald-400 font-bold">{formatCurrency(result.totalAssets, true)}</span>
          </div>
        </div>

        {/* Liabilities */}
        <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Liabilities 📉</h3>
            <button onClick={() => addItem(liabilities, setLiabilities, 'New Liability')}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-400/10 transition-all" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
              <Plus size={12} /> Add
            </button>
          </div>
          {liabilities.map(l => (
            <div key={l.id} className="flex gap-2 mb-2">
              <input value={l.name} onChange={e => updateItem(liabilities, setLiabilities, l.id, 'name', e.target.value)} className="input-field text-sm flex-1 py-2" />
              <div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₹</span>
                <input type="number" value={l.value} onChange={e => updateItem(liabilities, setLiabilities, l.id, 'value', e.target.value)} className="input-field pl-6 text-sm w-32 py-2" />
              </div>
              <button onClick={() => removeItem(liabilities, setLiabilities, l.id)} className="text-slate-600 hover:text-rose-400 transition-colors"><Trash2 size={14} /></button>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-white/10 flex justify-between">
            <span className="text-slate-400 text-sm">Total Liabilities</span>
            <span className="text-rose-400 font-bold">{formatCurrency(result.totalLiabilities, true)}</span>
          </div>
        </div>
      </div>

      {/* Net Worth Result */}
      <motion.div key={result.netWorth} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="mt-6 p-8 rounded-2xl text-center"
        style={{ background: result.netWorth >= 0 ? 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))' : 'linear-gradient(135deg,rgba(239,68,68,0.15),rgba(252,165,165,0.08))', border: `1px solid ${result.netWorth >= 0 ? 'rgba(99,102,241,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
        <p className="text-slate-400 mb-2">Your Net Worth</p>
        <p className="font-cinzel font-black text-5xl" style={{ color: result.netWorth >= 0 ? '#818cf8' : '#f87171' }}>{formatCurrency(result.netWorth, true)}</p>
        <p className="text-slate-500 text-sm mt-2">Debt-to-Asset Ratio: {result.debtToAssetRatio}%</p>
      </motion.div>

      {pieData.length > 0 && (
        <div className="mt-6 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-white font-semibold mb-4">Asset Allocation</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={ASSET_COLORS[i % ASSET_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v, true)} contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </CalcLayout>
  )
}
