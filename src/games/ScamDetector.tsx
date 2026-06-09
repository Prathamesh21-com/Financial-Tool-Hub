import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShieldCheck, ShieldX, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

const SCENARIOS = [
  { id: 1, type: 'message', title: 'WhatsApp Investment Alert', content: '"Join our exclusive crypto group! We guarantee 40% returns every month. Limited slots available! Pay ₹5,000 joining fee. Trusted by 10,000+ members 🚀💰"', isScam: true, redFlags: ['Guaranteed high returns', 'Joining fee required', 'Urgency pressure', 'Unregulated scheme'], explanation: 'No legitimate investment guarantees fixed monthly returns. The joining fee and urgency are classic Ponzi scheme red flags.' },
  { id: 2, type: 'email', title: 'Bank Email', content: 'Subject: Action Required\n\nDear Customer,\nYour HDFC Bank account has been suspended. Click the link below to verify your KYC immediately or your account will be permanently closed within 24 hours.\n\nwww.hdfc-bank-kyc-verify.com', isScam: true, redFlags: ['Suspicious domain (not official HDFC)', 'Urgency & fear tactics', 'KYC via external link', 'Threatening account closure'], explanation: 'Banks never ask for KYC through unofficial links. Always visit the official bank website directly.' },
  { id: 3, type: 'offer', title: 'Mutual Fund Offer', content: '"Invest in SEBI-registered ABC Mutual Fund. Expected returns based on historical performance: 12-15% CAGR. Investment subject to market risks. Past performance not indicative of future results. Read offer document carefully before investing."', isScam: false, redFlags: [], explanation: 'This is legitimate. It mentions SEBI registration, gives expected (not guaranteed) returns, and includes proper risk disclaimers.' },
  { id: 4, type: 'call', title: 'Phone Call Script', content: '"Hello, I\'m calling from SEBI Investor Protection Cell. We have noticed suspicious trading in your Demat account. To avoid legal action, transfer ₹50,000 to our verification account immediately. This is confidential — do not tell anyone."', isScam: true, redFlags: ['SEBI never calls asking for money', 'Secrecy demand', 'Urgency + fear', 'Transfer money to verify = scam'], explanation: 'Government bodies never demand money transfers over phone calls. This is a common fraud tactic.' },
  { id: 5, type: 'app', title: 'Investment App Ad', content: '"EasyMoney App — SEBI Registered Stockbroker\n• Zero commission trades\n• Invest from ₹100\n• CDSL/NSDL depository participant\n• RBI regulated\n• 4.8 stars on Play Store\n\nDownload and invest in stocks, mutual funds, and IPOs."', isScam: false, redFlags: [], explanation: 'This has multiple legitimate markers: SEBI registration, CDSL/NSDL partnership, RBI regulation, and reasonable claims without guaranteed returns.' },
  { id: 6, type: 'social', title: 'Instagram Post', content: '"💎 FOREX TRADING SECRET 💎\nI turned ₹10,000 into ₹5,00,000 in 30 days using my secret strategy!\nDM me for the course — only ₹2,999\nProof: [screenshot of account showing ₹5L balance]\n⚡ Only 5 spots left!"', isScam: true, redFlags: ['Unrealistic returns (50x in 30 days)', 'Course fee required', 'Fake "proof" screenshots', 'Artificial scarcity'], explanation: 'Forex trading scams often use fake profit screenshots. Turning ₹10K to ₹5L in 30 days is mathematically impossible without extreme risk.' },
  { id: 7, type: 'message', title: 'Friend Referral', content: '"Bro, I just made ₹15,000 in one week from this app called GrowWealth! They give 2% daily returns. Download from this link and use my code to get ₹500 bonus. They paid me, I can show you screenshots!"', isScam: true, redFlags: ['2% daily = 730% yearly (impossible)', 'Referral code pressure', 'Screenshot "proof" unreliable', 'Often friend\'s account is also fake'], explanation: '2% daily returns compound to 730% annually — no real investment delivers this. This is a Ponzi scheme that pays early members with new investor money.' },
  { id: 8, type: 'offer', title: 'PPF vs Fixed Deposit', content: '"Open a 5-year Tax Saving FD with our bank. Interest rate: 7.0% per annum. Investment qualifies for Section 80C deduction up to ₹1.5 lakh. TDS applicable on interest earned. FDIC insured."', isScam: false, redFlags: [], explanation: 'Tax-saving FDs are legitimate products. The mention of 80C, TDS, and insurance are all correct regulatory details.' },
]

export default function ScamDetector() {
  const [current, setCurrent] = useState(0)
  const [answered, setAnswered] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [done, setDone] = useState(false)
  const [started, setStarted] = useState(false)
  const { addXP, addNotification } = useAppStore()

  const scenario = SCENARIOS[current]

  const answer = (isScam: boolean) => {
    if (answered !== null) return
    const correct = isScam === scenario.isScam
    setAnswered(correct)
    if (correct) setScore(s => s + 20)
    setResults(r => [...r, correct])
    setTimeout(() => {
      if (current + 1 >= SCENARIOS.length) { setDone(true) }
      else { setCurrent(c => c + 1); setAnswered(null) }
    }, 2500)
  }

  const typeIcons: Record<string, string> = { message: '💬', email: '📧', offer: '📄', call: '📞', app: '📱', social: '📸' }

  if (!started) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <Link to="/games" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 justify-center"><ArrowLeft size={16} />Back</Link>
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="font-cinzel font-bold text-3xl text-white mb-3">Scam Detector</h1>
        <p className="text-slate-400 mb-6">Can you spot the financial scam? Review 8 real-world scenarios and identify which are frauds. Protect your money!</p>
        <div className="space-y-2 mb-8 text-left p-4 rounded-xl" style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)' }}>
          <p className="text-pink-400 font-semibold text-sm mb-2">⚠️ Common Scam Red Flags:</p>
          {['Guaranteed/fixed returns', 'Urgency & fear tactics', 'Requests for money/OTP via call', 'Unofficial links or apps', 'Too-good-to-be-true offers'].map(f => (
            <p key={f} className="text-slate-400 text-sm flex items-center gap-2"><AlertTriangle size={12} className="text-amber-400" />{f}</p>
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => setStarted(true)}
          className="px-8 py-4 rounded-2xl text-white font-bold text-lg w-full" style={{ background: 'linear-gradient(135deg,#ec4899,#be185d)', boxShadow: '0 8px 30px rgba(236,72,153,0.4)' }}>
          🔍 Start Detecting
        </motion.button>
      </div>
    </div>
  )

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full text-center p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="text-5xl mb-3">{score >= 120 ? '🛡️' : score >= 80 ? '🔍' : '⚠️'}</div>
        <h2 className="font-cinzel text-2xl font-bold text-white mb-2">{score >= 120 ? 'Scam Shield!' : score >= 80 ? 'Good Detector!' : 'Keep Learning!'}</h2>
        <p className="text-slate-400 mb-6">{results.filter(Boolean).length}/{SCENARIOS.length} correct — Score: {score}/160</p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {results.map((r, i) => (
            <div key={i} className={`p-2 rounded-lg flex items-center justify-center`} style={{ background: r ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}>
              {r ? <CheckCircle size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-rose-400" />}
            </div>
          ))}
        </div>
        <p className="text-slate-400 text-sm mb-6">In India, over ₹10,000 crore is lost to financial scams every year. Stay vigilant!</p>
        <div className="flex gap-3">
          <button onClick={() => { setCurrent(0); setAnswered(null); setScore(0); setResults([]); setDone(false) }}
            className="flex-1 py-3 rounded-xl text-white" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>Retry</button>
          <button onClick={() => { addXP(score); addNotification({ type: 'success', message: `+${score} XP earned!` }) }}
            className="flex-1 py-3 rounded-xl text-white font-bold" style={{ background: 'linear-gradient(135deg,#ec4899,#be185d)' }}>Save XP</button>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setStarted(false)} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm"><ArrowLeft size={16} />Quit</button>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm">Q{current + 1}/{SCENARIOS.length}</span>
          <span className="text-pink-400 font-bold text-sm">Score: {score}</span>
        </div>
      </div>

      <div className="h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all" style={{ width: `${(current / SCENARIOS.length) * 100}%` }} />
      </div>

      <motion.div key={current} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
        <div className="p-6 rounded-2xl mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{typeIcons[scenario.type]}</span>
            <div>
              <p className="text-white font-semibold">{scenario.title}</p>
              <p className="text-slate-500 text-xs capitalize">{scenario.type}</p>
            </div>
          </div>
          <pre className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed font-outfit">{scenario.content}</pre>
        </div>

        {answered === null ? (
          <div className="grid grid-cols-2 gap-4">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => answer(true)}
              className="py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 text-lg"
              style={{ background: 'linear-gradient(135deg,rgba(239,68,68,0.25),rgba(239,68,68,0.15))', border: '2px solid rgba(239,68,68,0.4)' }}>
              <ShieldX size={22} />🚨 SCAM!
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => answer(false)}
              className="py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 text-lg"
              style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.25),rgba(16,185,129,0.15))', border: '2px solid rgba(16,185,129,0.4)' }}>
              <ShieldCheck size={22} />✅ Legit
            </motion.button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl" style={{ background: answered ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${answered ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
            <div className="flex items-center gap-2 mb-3">
              {answered ? <CheckCircle size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-rose-400" />}
              <span className={`font-bold ${answered ? 'text-emerald-400' : 'text-rose-400'}`}>
                {answered ? `✅ Correct! +20 points` : `❌ ${scenario.isScam ? 'This WAS a scam!' : 'This was legitimate!'}`}
              </span>
            </div>
            <p className="text-slate-300 text-sm mb-3">{scenario.explanation}</p>
            {scenario.isScam && scenario.redFlags.length > 0 && (
              <div>
                <p className="text-amber-400 text-xs font-semibold mb-1">🚩 Red Flags:</p>
                {scenario.redFlags.map(f => <p key={f} className="text-slate-400 text-xs flex items-center gap-1"><AlertTriangle size={10} className="text-amber-400" />{f}</p>)}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
