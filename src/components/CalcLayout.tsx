import { ReactNode, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles, BookOpen, Share2, Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { getCalculatorExplanation } from '../ai/aiService'

interface CalcLayoutProps {
  title: string
  subtitle: string
  icon: ReactNode
  color: string
  children: ReactNode
  calcType?: string
  inputs?: Record<string, number>
  result?: Record<string, number>
}

export default function CalcLayout({ title, subtitle, icon, color, children, calcType, inputs, result }: CalcLayoutProps) {
  const { setAiChatOpen, addNotification } = useAppStore()
  const [aiExplanation, setAiExplanation] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)
  const [showAI, setShowAI] = useState(false)

  const handleAIExplain = async () => {
    if (!calcType || !inputs || !result) { setAiChatOpen(true); return }
    setLoadingAI(true)
    setShowAI(true)
    try {
      const explanation = await getCalculatorExplanation(calcType, inputs, result)
      setAiExplanation(explanation)
    } catch {
      setAiExplanation('Unable to generate AI explanation. Please check your API key in .env file.')
    }
    setLoadingAI(false)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    addNotification({ type: 'success', message: 'Calculator link copied to clipboard!' })
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 max-w-5xl mx-auto">
      {/* Back + actions */}
      <div className="flex items-center justify-between mb-8">
        <Link to="/calculators" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} />
          All Calculators
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={handleShare}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: `${color}20`, border: `1px solid ${color}35` }}>
            <span style={{ color }}>{icon}</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white font-cinzel">{title}</h1>
            <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {children}
      </motion.div>

      {/* AI Explanation */}
      {showAI && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 rounded-2xl"
          style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-indigo-400" />
            <span className="text-indigo-300 font-semibold text-sm">Artha AI Explanation</span>
          </div>
          {loadingAI ? (
            <div className="flex gap-1.5">
              {[0,1,2].map(i => (
                <motion.div key={i} className="w-2 h-2 rounded-full bg-indigo-400"
                  animate={{ scale: [1,1.5,1] }} transition={{ duration: 0.8, repeat: Infinity, delay: i*0.2 }} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: aiExplanation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
          )}
        </motion.div>
      )}

      {/* AI Button */}
      {!showAI && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6">
          <button onClick={handleAIExplain}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#818cf8' }}>
            <Sparkles size={14} />
            Get AI Explanation for Results
          </button>
        </motion.div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-3 rounded-xl text-xs text-slate-600"
        style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)' }}>
        ⚠️ Results are estimates for educational purposes only. Actual returns may vary. Consult a SEBI-registered financial advisor before investing.
      </div>
    </div>
  )
}
