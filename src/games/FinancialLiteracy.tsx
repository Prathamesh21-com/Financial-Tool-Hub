import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Zap, Trophy, Clock, CheckCircle, XCircle, RotateCcw, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

const QUESTIONS = [
  { id: 1, q: 'What does SIP stand for?', opts: ['Systematic Investment Plan', 'Simple Interest Plan', 'Savings Investment Program', 'Standard Income Plan'], ans: 0, cat: 'Mutual Funds', diff: 'easy', xp: 10, exp: 'SIP allows you to invest a fixed amount regularly in mutual funds, leveraging rupee cost averaging.' },
  { id: 2, q: 'What is the lock-in period of PPF?', opts: ['5 years', '10 years', '15 years', '20 years'], ans: 2, cat: 'Tax Saving', diff: 'easy', xp: 10, exp: 'PPF has a 15-year lock-in period with partial withdrawals allowed from year 7.' },
  { id: 3, q: 'What does ELSS stand for?', opts: ['Equity Linked Savings Scheme', 'Extra Large Savings System', 'Equity Loan Savings Scheme', 'Economic Linked Security Scheme'], ans: 0, cat: 'Tax Saving', diff: 'medium', xp: 15, exp: 'ELSS is a tax-saving mutual fund with the shortest lock-in period (3 years) under 80C.' },
  { id: 4, q: 'The "Rule of 72" helps estimate:', opts: ['Retirement age', 'How long to double money', 'Tax liability', 'SIP returns'], ans: 1, cat: 'Investment', diff: 'medium', xp: 15, exp: 'Divide 72 by annual return rate to estimate years needed to double your investment.' },
  { id: 5, q: 'What is the safe withdrawal rate in FIRE planning?', opts: ['2%', '3%', '4%', '6%'], ans: 2, cat: 'FIRE', diff: 'hard', xp: 20, exp: 'The 4% rule suggests withdrawing 4% of corpus annually makes retirement funds last 30+ years.' },
  { id: 6, q: 'EMI stands for:', opts: ['Equal Monthly Income', 'Equated Monthly Installment', 'Expected Monthly Interest', 'Earned Monthly Income'], ans: 1, cat: 'Loans', diff: 'easy', xp: 10, exp: 'EMI = Equal principal + interest payment made every month until loan is fully repaid.' },
  { id: 7, q: 'Which is NOT a feature of PPF?', opts: ['Tax-free returns', 'Government-backed', 'Listed on stock exchange', '80C deduction'], ans: 2, cat: 'Tax Saving', diff: 'easy', xp: 10, exp: 'PPF is a government savings scheme, not listed or traded on any stock exchange.' },
  { id: 8, q: 'What does NPS stand for?', opts: ['National Pension System', 'New Payment Scheme', 'National Provident Savings', 'Net Profit System'], ans: 0, cat: 'Retirement', diff: 'easy', xp: 10, exp: 'NPS is a voluntary retirement savings scheme regulated by PFRDA in India.' },
  { id: 9, q: 'Inflation erodes purchasing power. 6% inflation means ₹100 today = ?', opts: ['₹94 next year', '₹100 next year', '₹106 next year', '₹112 next year'], ans: 0, cat: 'Economics', diff: 'medium', xp: 15, exp: 'With 6% inflation, ₹100 today buys only ₹94 worth of goods next year.' },
  { id: 10, q: 'FD compounded quarterly means interest is calculated:', opts: ['Once a year', 'Twice a year', 'Four times a year', 'Monthly'], ans: 2, cat: 'Banking', diff: 'easy', xp: 10, exp: 'Quarterly compounding means interest is added to principal 4 times per year, every 3 months.' },
  { id: 11, q: 'Which has the shortest lock-in under Section 80C?', opts: ['PPF (15yr)', 'ELSS (3yr)', 'NSC (5yr)', 'Tax-saving FD (5yr)'], ans: 1, cat: 'Tax Saving', diff: 'medium', xp: 15, exp: 'ELSS has the shortest lock-in of just 3 years among all 80C investment options.' },
  { id: 12, q: 'Emergency fund should cover how many months of expenses?', opts: ['1-2 months', '3-6 months', '8-10 months', '12+ months'], ans: 1, cat: 'Planning', diff: 'easy', xp: 10, exp: 'Financial experts recommend 3-6 months of expenses in liquid funds for emergencies.' },
  { id: 13, q: 'Compound interest is called the "8th wonder" because:', opts: ['It is very complex', 'Money grows on itself over time', 'Government guarantees it', 'It never loses value'], ans: 1, cat: 'Investment', diff: 'easy', xp: 10, exp: 'Compound interest grows exponentially as you earn interest on previously earned interest.' },
  { id: 14, q: 'What is the maximum annual investment in PPF?', opts: ['₹50,000', '₹1,00,000', '₹1,50,000', '₹2,00,000'], ans: 2, cat: 'Tax Saving', diff: 'medium', xp: 15, exp: 'PPF allows a maximum of ₹1.5 lakh per year, which also qualifies for 80C deduction.' },
  { id: 15, q: 'SWP stands for:', opts: ['Systematic Withdrawal Plan', 'Savings Wealth Program', 'Standard Weekly Payment', 'Secured Wealth Plan'], ans: 0, cat: 'Mutual Funds', diff: 'medium', xp: 15, exp: 'SWP lets investors withdraw a fixed amount from mutual funds at regular intervals, ideal for retirement income.' },
]

const CATEGORIES = ['All', 'Mutual Funds', 'Tax Saving', 'Investment', 'Loans', 'Retirement', 'Banking', 'Planning', 'FIRE', 'Economics']
const DIFF_COLORS: Record<string, string> = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' }

type Screen = 'menu' | 'quiz' | 'result'

export default function FinancialLiteracy() {
  const [screen, setScreen] = useState<Screen>('menu')
  const [category, setCategory] = useState('All')
  const [questions, setQuestions] = useState<typeof QUESTIONS>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [xpEarned, setXpEarned] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [timeLeft, setTimeLeft] = useState(20)
  const [streak, setStreak] = useState(0)
  const [showExplain, setShowExplain] = useState(false)
  const { addXP, addNotification } = useAppStore()

  const startQuiz = () => {
    const pool = category === 'All' ? QUESTIONS : QUESTIONS.filter(q => q.cat === category)
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10)
    setQuestions(shuffled)
    setCurrent(0); setSelected(null); setScore(0); setXpEarned(0)
    setAnswers([]); setTimeLeft(20); setStreak(0); setShowExplain(false)
    setScreen('quiz')
  }

  useEffect(() => {
    if (screen !== 'quiz' || selected !== null) return
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { handleAnswer(-1); return 20 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [screen, selected, current])

  const handleAnswer = useCallback((idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    const q = questions[current]
    const correct = idx === q.ans
    setAnswers(prev => [...prev, correct])
    if (correct) {
      const bonus = streak >= 2 ? q.xp * 1.5 : q.xp
      setScore(prev => prev + Math.round(bonus))
      setXpEarned(prev => prev + Math.round(bonus))
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }
    setShowExplain(true)
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setScreen('result')
      } else {
        setCurrent(prev => prev + 1)
        setSelected(null); setTimeLeft(20); setShowExplain(false)
      }
    }, 2200)
  }, [selected, questions, current, streak])

  const finishAndSave = () => {
    addXP(xpEarned)
    addNotification({ type: 'success', message: `🎯 Quiz complete! +${xpEarned} XP earned!` })
    setScreen('menu')
  }

  if (screen === 'menu') return (
    <div className="min-h-screen px-4 sm:px-6 py-10 max-w-3xl mx-auto">
      <Link to="/games" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8">
        <ArrowLeft size={16} /> Back to Games
      </Link>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="font-cinzel font-black text-4xl text-white mb-3">Financial Literacy Challenge</h1>
        <p className="text-slate-400 max-w-md mx-auto">Test your financial knowledge. Answer 10 questions, earn XP, and climb the leaderboard!</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[{ l: 'Questions', v: '15+' }, { l: 'Categories', v: '10' }, { l: 'Max XP', v: '200' }].map(s => (
          <div key={s.l} className="p-4 rounded-xl text-center" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="text-white font-bold text-xl">{s.v}</p>
            <p className="text-slate-500 text-xs">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <p className="text-slate-400 text-sm mb-3">Choose Category:</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className="px-3 py-1.5 rounded-xl text-sm transition-all"
              style={{ background: category === c ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${category === c ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`, color: category === c ? '#818cf8' : '#64748b' }}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={startQuiz}
        className="w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3"
        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 8px 30px rgba(99,102,241,0.4)' }}>
        <Zap size={20} /> Start Quiz
      </motion.button>
    </div>
  )

  if (screen === 'result') {
    const pct = Math.round((answers.filter(Boolean).length / questions.length) * 100)
    return (
      <div className="min-h-screen px-4 sm:px-6 py-10 max-w-2xl mx-auto flex flex-col items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full">
          <div className="text-center mb-8">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 3 }} className="text-6xl mb-4">
              {pct >= 80 ? '🏆' : pct >= 60 ? '🌟' : '📚'}
            </motion.div>
            <h2 className="font-cinzel font-black text-3xl text-white mb-2">
              {pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good Job!' : 'Keep Learning!'}
            </h2>
            <p className="text-slate-400">{answers.filter(Boolean).length}/{questions.length} correct — {pct}%</p>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[{ l: 'Score', v: score, color: '#f59e0b' }, { l: 'XP Earned', v: `+${xpEarned}`, color: '#6366f1' }, { l: 'Streak', v: streak, color: '#10b981' }].map(s => (
              <div key={s.l} className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="font-bold text-2xl" style={{ color: s.color }}>{s.v}</p>
                <p className="text-slate-500 text-xs">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 mb-8 max-h-64 overflow-y-auto custom-scroll">
            {questions.map((q, i) => (
              <div key={q.id} className="flex items-center gap-3 p-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${answers[i] ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                {answers[i] ? <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" /> : <XCircle size={16} className="text-rose-400 flex-shrink-0" />}
                <span className="text-slate-300 truncate">{q.q}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={startQuiz} className="flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <RotateCcw size={16} /> Play Again
            </button>
            <button onClick={finishAndSave} className="flex-1 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              <Trophy size={16} /> Save +{xpEarned} XP
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setScreen('menu')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
          <ArrowLeft size={16} /> Quit
        </button>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-amber-400"><Star size={14} />{score}</span>
          {streak > 1 && <span className="flex items-center gap-1 text-orange-400">🔥 {streak}x streak</span>}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: timeLeft <= 5 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)' }}>
            <Clock size={13} style={{ color: timeLeft <= 5 ? '#f87171' : '#94a3b8' }} />
            <span style={{ color: timeLeft <= 5 ? '#f87171' : '#94a3b8' }}>{timeLeft}s</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Q {current + 1}/{questions.length}</span>
          <span style={{ color: DIFF_COLORS[q.diff] }}>{q.diff} · +{q.xp} XP</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
        </div>
      </div>

      <motion.div key={current} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
        <div className="p-6 rounded-2xl mb-6" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <span className="text-xs px-2 py-1 rounded-full mb-3 inline-block" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>{q.cat}</span>
          <h2 className="text-white font-semibold text-lg leading-relaxed">{q.q}</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-4">
          {q.opts.map((opt, i) => {
            let bg = 'rgba(255,255,255,0.04)'; let border = 'rgba(255,255,255,0.1)'; let color = '#94a3b8'
            if (selected !== null) {
              if (i === q.ans) { bg = 'rgba(16,185,129,0.15)'; border = 'rgba(16,185,129,0.4)'; color = '#34d399' }
              else if (i === selected && selected !== q.ans) { bg = 'rgba(239,68,68,0.15)'; border = 'rgba(239,68,68,0.4)'; color = '#f87171' }
            } else if (selected === null) { color = '#e2e8f0' }
            return (
              <motion.button key={i} whileHover={selected === null ? { x: 4 } : {}} onClick={() => handleAnswer(i)} disabled={selected !== null}
                className="w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 text-sm font-medium"
                style={{ background: bg, border: `1px solid ${border}`, color }}>
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
                {selected !== null && i === q.ans && <CheckCircle size={16} className="ml-auto text-emerald-400" />}
                {selected === i && i !== q.ans && <XCircle size={16} className="ml-auto text-rose-400" />}
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence>
          {showExplain && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-4 rounded-xl text-sm text-slate-300"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <span className="text-indigo-400 font-semibold">💡 </span>{q.exp}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
