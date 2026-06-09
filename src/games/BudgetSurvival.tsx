import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Heart, Wallet, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

interface Event { title: string; desc: string; options: { label: string; cost: number; happiness: number; wisdom: string }[]; icon: string }

const SALARY = 35000
const EXPENSES = { Rent: 10000, Food: 6000, Transport: 2500, Utilities: 1500 }
const FIXED_MONTHLY = Object.values(EXPENSES).reduce((a, b) => a + b, 0)

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const EVENTS: Event[] = [
  { icon: '🎂', title: 'Friend\'s Birthday Party', desc: 'Your close friend is celebrating. How much do you gift?',
    options: [{ label: 'Cash gift ₹2,000', cost: 2000, happiness: 10, wisdom: 'Thoughtful and within budget.' }, { label: 'Gift ₹500', cost: 500, happiness: 5, wisdom: 'Modest but considerate.' }, { label: 'Skip the party', cost: 0, happiness: -5, wisdom: 'Saved money but strained friendship.' }] },
  { icon: '🏥', title: 'Medical Emergency', desc: 'Sudden doctor visit and medicines needed.',
    options: [{ label: 'Visit doctor ₹1,500', cost: 1500, happiness: 0, wisdom: 'Health comes first always.' }, { label: 'Buy medicines only ₹500', cost: 500, happiness: -5, wisdom: 'Risky — symptoms may worsen.' }, { label: 'Ignore it', cost: 0, happiness: -15, wisdom: 'Very risky! Emergency fund is vital.' }] },
  { icon: '📱', title: 'Phone Screen Cracked!', desc: 'Your smartphone screen is shattered.',
    options: [{ label: 'Repair it ₹3,000', cost: 3000, happiness: 5, wisdom: 'Smart — repair is cheaper than replace.' }, { label: 'Buy new phone ₹15,000', cost: 15000, happiness: 10, wisdom: 'Expensive upgrade impacted savings.' }, { label: 'Use cracked screen', cost: 0, happiness: -10, wisdom: 'Inconvenient but budget-friendly short-term.' }] },
  { icon: '🎉', title: 'Diwali Celebration', desc: 'Festival season — shopping and gifts.',
    options: [{ label: 'Budget shopping ₹3,500', cost: 3500, happiness: 12, wisdom: 'Festive within budget!' }, { label: 'Splurge ₹8,000', cost: 8000, happiness: 18, wisdom: 'Great celebration but dented savings.' }, { label: 'Skip shopping', cost: 0, happiness: -8, wisdom: 'Missed celebration but saved well.' }] },
  { icon: '📚', title: 'Online Course Opportunity', desc: 'A valuable skill-building course for your career.',
    options: [{ label: 'Invest in course ₹2,999', cost: 2999, happiness: 8, wisdom: 'Skills are the best investment!' }, { label: 'Find free alternative', cost: 0, happiness: 3, wisdom: 'Smart! Many free resources available.' }, { label: 'Skip it', cost: 0, happiness: 0, wisdom: 'Missed opportunity for growth.' }] },
  { icon: '🚗', title: 'Vehicle Breakdown', desc: 'Your scooter needs urgent repair.',
    options: [{ label: 'Full repair ₹4,000', cost: 4000, happiness: 0, wisdom: 'Necessary cost — kept your mobility.' }, { label: 'Patch fix ₹800', cost: 800, happiness: -3, wisdom: 'Saved now but may need full repair later.' }, { label: 'Use public transport', cost: 1200, happiness: -5, wisdom: 'Inconvenient but practical.' }] },
  { icon: '🏋️', title: 'Gym Membership Renewal', desc: 'Annual gym membership due.',
    options: [{ label: 'Renew membership ₹6,000/yr', cost: 6000, happiness: 8, wisdom: 'Investing in health is always worth it.' }, { label: 'Month-to-month ₹800/mo', cost: 800, happiness: 5, wisdom: 'Flexible but costs more annually.' }, { label: 'Exercise outdoors (free)', cost: 0, happiness: 4, wisdom: 'Free and equally effective!' }] },
  { icon: '🌊', title: 'Friends\' Goa Trip', desc: 'Your friend group is planning a weekend trip.',
    options: [{ label: 'Join the trip ₹8,000', cost: 8000, happiness: 20, wisdom: 'Experiences matter! But plan budget trips.' }, { label: 'Partial trip ₹3,000', cost: 3000, happiness: 12, wisdom: 'Good compromise between fun and savings.' }, { label: 'Decline this time', cost: 0, happiness: -5, wisdom: 'FOMO is real but savings are real too.' }] },
  { icon: '💡', title: 'Electricity Bill Spike', desc: 'Summer heat led to 40% higher electricity bill.',
    options: [{ label: 'Pay full ₹2,200', cost: 2200, happiness: 0, wisdom: 'Necessary. Plan to be energy efficient.' }, { label: 'Call for bill review', cost: 0, happiness: 2, wisdom: 'Smart! Always question unexpected spikes.' }, { label: 'Delay payment', cost: 0, happiness: -8, wisdom: 'Penalty charges will make it worse later.' }] },
  { icon: '🎓', title: 'Sibling\'s College Fees', desc: 'Your sibling needs help with semester fees.',
    options: [{ label: 'Help ₹5,000', cost: 5000, happiness: 10, wisdom: 'Family support is priceless.' }, { label: 'Help ₹2,000', cost: 2000, happiness: 6, wisdom: 'Within your means — still helpful.' }, { label: 'Cannot help this month', cost: 0, happiness: -5, wisdom: 'Sometimes budget constraints are real.' }] },
  { icon: '💼', title: 'Year-end Bonus!', desc: 'You got a performance bonus from work!',
    options: [{ label: 'Invest 80% (₹4,000)', cost: -4000, happiness: 5, wisdom: '🎉 Smart! Invest bonuses before spending.' }, { label: 'Save 50% spend 50%', cost: -2500, happiness: 10, wisdom: 'Good balance of save and reward.' }, { label: 'Treat yourself ₹5,000', cost: -5000, happiness: 18, wisdom: 'You deserved it! But also save a bit.' }] },
  { icon: '🏠', title: 'December — Year End Review', desc: 'Final month! Make one last financial decision.',
    options: [{ label: 'Invest in ELSS ₹5,000 (80C)', cost: 5000, happiness: 5, wisdom: '💰 Smart! Tax-saving investment for the win!' }, { label: 'Start emergency fund ₹3,000', cost: 3000, happiness: 8, wisdom: '🛡️ Building safety net — excellent decision!' }, { label: 'Celebrate year-end ₹4,000', cost: 4000, happiness: 15, wisdom: 'Celebration is fine if budget allows.' }] },
]

export default function BudgetSurvival() {
  const [monthIdx, setMonthIdx] = useState(0)
  const [savings, setSavings] = useState(0)
  const [happiness, setHappiness] = useState(70)
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const [history, setHistory] = useState<{ month: string; saving: number; choice: string }[]>([])
  const [showResult, setShowResult] = useState(false)
  const [lastResult, setLastResult] = useState<{ label: string; wisdom: string; cost: number } | null>(null)
  const { addXP, addNotification } = useAppStore()

  const event = EVENTS[monthIdx]
  const disposable = SALARY - FIXED_MONTHLY // ₹15,000

  const choose = (opt: { label: string; cost: number; happiness: number; wisdom: string }) => {
    const monthlySaving = disposable - opt.cost
    setSavings(s => s + Math.max(-s, monthlySaving))
    setHappiness(h => Math.max(0, Math.min(100, h + opt.happiness)))
    setLastResult(opt)
    setShowResult(true)
    setHistory(prev => [...prev, { month: MONTHS[monthIdx], saving: monthlySaving, choice: opt.label }])
    setTimeout(() => {
      setShowResult(false)
      if (monthIdx + 1 >= EVENTS.length) setDone(true)
      else setMonthIdx(m => m + 1)
    }, 2200)
  }

  const xpEarned = Math.max(50, Math.round(savings / 500) + Math.round(happiness / 2))
  const grade = savings >= 50000 ? 'A+' : savings >= 30000 ? 'A' : savings >= 15000 ? 'B' : savings >= 5000 ? 'C' : 'D'

  if (!started) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <Link to="/games" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 justify-center"><ArrowLeft size={16} />Back</Link>
        <div className="text-5xl mb-4">💰</div>
        <h1 className="font-cinzel font-bold text-3xl text-white mb-3">Budget Survival</h1>
        <p className="text-slate-400 mb-6">You earn ₹35,000/month. Fixed expenses: ₹20,000. You have ₹15,000 disposable income. Survive 12 months of real-life financial decisions!</p>
        <div className="p-4 rounded-xl mb-6 text-left" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
          <p className="text-purple-400 font-semibold mb-2 text-sm">Monthly Budget:</p>
          {Object.entries(EXPENSES).map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm text-slate-400 mb-1"><span>{k}</span><span className="text-white">₹{v.toLocaleString()}</span></div>
          ))}
          <div className="border-t border-white/10 mt-2 pt-2 flex justify-between text-sm font-bold">
            <span className="text-slate-300">Disposable</span><span className="text-emerald-400">₹{disposable.toLocaleString()}</span>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => setStarted(true)}
          className="px-8 py-4 rounded-2xl text-white font-bold text-lg w-full" style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)', boxShadow: '0 8px 30px rgba(168,85,247,0.4)' }}>
          💸 Start Budget Challenge
        </motion.button>
      </div>
    </div>
  )

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-lg w-full p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎊</div>
          <h2 className="font-cinzel text-2xl font-bold text-white">Year Complete!</h2>
          <p className="text-slate-400 mt-1">You survived 12 months of financial decisions</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[{ l: 'Total Saved', v: `₹${savings.toLocaleString()}`, c: savings > 0 ? '#10b981' : '#ef4444' }, { l: 'Happiness', v: `${happiness}%`, c: happiness > 50 ? '#f59e0b' : '#ef4444' }, { l: 'Grade', v: grade, c: '#6366f1' }].map(s => (
            <div key={s.l} className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="font-bold text-xl" style={{ color: s.c }}>{s.v}</p>
              <p className="text-slate-500 text-xs">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="max-h-48 overflow-y-auto custom-scroll space-y-1 mb-6">
          {history.map((h, i) => (
            <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-slate-500">{h.month}</span>
              <span className="text-slate-300 truncate mx-2 max-w-[150px]">{h.choice}</span>
              <span className={`font-bold ${h.saving >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{h.saving >= 0 ? '+' : ''}₹{h.saving.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setMonthIdx(0); setSavings(0); setHappiness(70); setHistory([]); setDone(false) }}
            className="flex-1 py-3 rounded-xl text-white" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>Retry</button>
          <button onClick={() => { addXP(xpEarned); addNotification({ type: 'success', message: `+${xpEarned} XP earned!` }) }}
            className="flex-1 py-3 rounded-xl text-white font-bold" style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>Save +{xpEarned} XP</button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setStarted(false)} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm"><ArrowLeft size={16} />Quit</button>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-emerald-400"><Wallet size={13} />₹{savings.toLocaleString()}</span>
          <span className="flex items-center gap-1 text-amber-400"><Heart size={13} />{happiness}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2 text-xs text-slate-500">
        <span>{MONTHS[monthIdx]} (Month {monthIdx + 1}/12)</span>
        <span>Disposable: ₹{disposable.toLocaleString()}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all" style={{ width: `${((monthIdx) / EVENTS.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div key={monthIdx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
            <div className="p-6 rounded-2xl mb-6" style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{event.icon}</span>
                <div>
                  <h2 className="text-white font-bold text-lg">{event.title}</h2>
                  <p className="text-slate-400 text-sm">{event.desc}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {event.options.map((opt, i) => (
                <motion.button key={i} whileHover={{ x: 4 }} onClick={() => choose(opt)}
                  className="w-full p-4 rounded-xl text-left flex items-center justify-between transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span className="text-white text-sm font-medium">{opt.label}</span>
                  <div className="flex items-center gap-3 text-xs flex-shrink-0 ml-3">
                    <span className={opt.cost > 0 ? 'text-rose-400' : opt.cost < 0 ? 'text-emerald-400' : 'text-slate-400'}>
                      {opt.cost > 0 ? `-₹${opt.cost.toLocaleString()}` : opt.cost < 0 ? `+₹${Math.abs(opt.cost).toLocaleString()}` : 'Free'}
                    </span>
                    <span className={opt.happiness > 0 ? 'text-amber-400' : opt.happiness < 0 ? 'text-rose-400' : 'text-slate-500'}>
                      {opt.happiness > 0 ? `+${opt.happiness}😊` : opt.happiness < 0 ? `${opt.happiness}😟` : ''}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl text-center" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)' }}>
            <div className="text-3xl mb-3">{lastResult && lastResult.cost > 0 ? '💸' : '💰'}</div>
            <p className="text-purple-300 font-semibold mb-2">{lastResult?.label}</p>
            <p className="text-slate-300 text-sm">{lastResult?.wisdom}</p>
            <p className="mt-3 font-bold" style={{ color: (lastResult?.cost || 0) > 0 ? '#f87171' : '#34d399' }}>
              {(lastResult?.cost || 0) > 0 ? `Spent ₹${lastResult?.cost.toLocaleString()}` : `Saved ₹${Math.abs(lastResult?.cost || 0).toLocaleString()}`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
