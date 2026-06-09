import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, Calculator, Gamepad2 } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-8xl mb-6">💸</motion.div>
        <h1 className="font-cinzel font-black text-6xl text-white mb-3">404</h1>
        <p className="text-gradient text-2xl font-bold mb-3">Page Not Found</p>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          Looks like this page ran off with your returns! Don't worry — your financial journey continues elsewhere.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold"
            style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
            <Home size={16} /> Go Home
          </Link>
          <Link to="/calculators" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}>
            <Calculator size={16} /> Calculators
          </Link>
          <Link to="/games" className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}>
            <Gamepad2 size={16} /> Games
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
