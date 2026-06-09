import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Copy, Check, Sparkles, Star, Users, Zap } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const UPI_ID = 'kajrekarjagruti99@okaxis'

const TIERS = [
  { amount: 49, label: 'Coffee ☕', desc: 'Buy me a coffee to keep coding', color: '#f59e0b', icon: '☕' },
  { amount: 199, label: 'Supporter 🌟', desc: 'Support a month of hosting', color: '#6366f1', icon: '🌟', popular: true },
  { amount: 499, label: 'Champion 🏆', desc: 'Help add new features', color: '#10b981', icon: '🏆' },
  { amount: 999, label: 'Legend 👑', desc: 'Major support for the project', color: '#ec4899', icon: '👑' },
]

const SUPPORTERS = [
  { name: 'Rahul K.', amount: 499, msg: 'Amazing platform! Changed how I understand finance.' },
  { name: 'Priya M.', amount: 199, msg: 'The SIP calculator saved me so much time!' },
  { name: 'Arjun S.', amount: 999, msg: 'Best financial learning app in India 🇮🇳' },
  { name: 'Sneha R.', amount: 49, msg: 'Love the games!' },
  { name: 'Vikram P.', amount: 199, msg: 'Keep up the great work!' },
]

export default function DonatePage() {
  const [copied, setCopied] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(199)
  const [showThankYou, setShowThankYou] = useState(false)
  const { addNotification } = useAppStore()

  const copyUPI = () => {
    navigator.clipboard.writeText(UPI_ID)
    setCopied(true)
    addNotification({ type: 'success', message: 'UPI ID copied to clipboard!' })
    setTimeout(() => setCopied(false), 3000)
  }

  const handleDonate = () => {
    setShowThankYou(true)
    setTimeout(() => setShowThankYou(false), 5000)
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-16 max-w-4xl mx-auto">
      {/* Thank You Overlay */}
      <AnimatePresence>
        {showThankYou && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)' }}>
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="text-center p-12 rounded-3xl max-w-sm"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: 3 }} className="text-6xl mb-4">🙏</motion.div>
              <h2 className="font-cinzel font-bold text-2xl text-white mb-2">Thank You!</h2>
              <p className="text-slate-300">Your support means the world and helps keep Financial Tool Hub free for everyone in India!</p>
              <div className="mt-4 flex flex-wrap justify-center gap-1">
                {['💖', '🌟', '🚀', '🇮🇳', '✨'].map((e, i) => (
                  <motion.span key={i} animate={{ y: [0, -20, 0] }} transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }} className="text-2xl">{e}</motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl mb-4">🙏</motion.div>
        <h1 className="font-cinzel font-black text-4xl md:text-5xl text-white mb-4">Support <span className="text-gradient-gold">Financial Tool Hub</span></h1>
        <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
          Financial Tool Hub is completely free and always will be. Your support helps cover hosting, development, and adding new features for India's growing financial literacy community.
        </p>
      </motion.div>

      {/* Impact Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-10">
        {[{ icon: Users, v: '50K+', l: 'Users Helped' }, { icon: Zap, v: '2.5L+', l: 'Calculations' }, { icon: Star, v: '100%', l: 'Free Forever' }].map(s => (
          <div key={s.l} className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <s.icon size={18} className="mx-auto mb-1 text-amber-400" />
            <p className="font-bold text-white text-lg">{s.v}</p>
            <p className="text-slate-500 text-xs">{s.l}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Code Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="text-white font-bold text-xl mb-6 font-cinzel flex items-center gap-2">
            <span>📱</span> Scan & Pay
          </h2>

          {/* QR Code - replaced with real image */}
          <motion.div
            animate={{ boxShadow: ['0 0 20px rgba(99,102,241,0.2)', '0 0 50px rgba(168,85,247,0.4)', '0 0 20px rgba(99,102,241,0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mx-auto w-48 h-48 rounded-2xl flex items-center justify-center mb-6 overflow-hidden"
            style={{ background: 'white', padding: '12px' }}>
            <img
              src={`${import.meta.env.BASE_URL}my-upi-qr.png`}
              alt="UPI QR Code"
              className="w-full h-full object-contain"
            />
          </motion.div>

          <p className="text-center text-slate-400 text-sm mb-4">Scan with any UPI app: GPay, PhonePe, Paytm</p>

          {/* UPI ID */}
          <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <span className="text-indigo-300 text-sm font-mono flex-1">{UPI_ID}</span>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copyUPI}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)', color: copied ? '#34d399' : '#818cf8' }}>
              {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['GPay', 'PhonePe', 'Paytm'].map(app => (
              <div key={app} className="py-2 px-3 rounded-lg text-center text-xs text-slate-400"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {app}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-xl text-xs text-slate-600 text-center"
            style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}>
            🔒 100% Secure — Direct UPI transfer. No intermediaries.
          </div>
        </motion.div>

        {/* Amount Tiers */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-white font-bold text-xl mb-6 font-cinzel flex items-center gap-2">
            <Heart size={18} className="text-rose-400" /> Choose Amount
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {TIERS.map(tier => (
              <motion.button key={tier.amount} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedAmount(tier.amount)}
                className="relative p-4 rounded-xl text-left transition-all"
                style={{ background: selectedAmount === tier.amount ? `${tier.color}18` : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedAmount === tier.amount ? `${tier.color}50` : 'rgba(255,255,255,0.08)'}` }}>
                {tier.popular && (
                  <span className="absolute -top-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: `${tier.color}25`, color: tier.color, border: `1px solid ${tier.color}40` }}>
                    Popular
                  </span>
                )}
                <div className="text-2xl mb-2">{tier.icon}</div>
                <p className="font-bold text-white">₹{tier.amount}</p>
                <p className="text-xs font-medium" style={{ color: tier.color }}>{tier.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{tier.desc}</p>
              </motion.button>
            ))}
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDonate}
            className="w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 mb-4"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 30px rgba(245,158,11,0.4)' }}>
            <Heart size={20} className="fill-current" />
            Donate ₹{selectedAmount} with GPay
          </motion.button>

          <p className="text-center text-slate-600 text-xs">After clicking, use the QR code or UPI ID to complete payment</p>

          {/* What your support does */}
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-slate-400 text-sm font-semibold mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400" /> Your support helps:
            </p>
            {['Keep the platform 100% free', 'Add new calculators & games', 'Pay for hosting & domain', 'Improve AI features', 'Create financial education content'].map(item => (
              <div key={item} className="flex items-center gap-2 text-slate-500 text-xs mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" /> {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Supporters Wall */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12">
        <h2 className="font-cinzel font-bold text-2xl text-white mb-6 text-center">💖 Our Supporters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUPPORTERS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium text-sm">{s.name}</span>
                <span className="text-amber-400 font-bold text-sm">₹{s.amount}</span>
              </div>
              <p className="text-slate-500 text-xs italic">"{s.msg}"</p>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-slate-600 text-xs mt-4">Thank you all for your incredible support! 🙏</p>
      </motion.div>
    </div>
  )
}