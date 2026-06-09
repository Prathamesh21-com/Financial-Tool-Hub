import { motion } from 'framer-motion'
import { Mail, Phone, Github, Youtube, Instagram, Heart, Code, BookOpen, Award, Linkedin } from 'lucide-react'

const TIMELINE = [
  { year: '2022', title: 'The Idea', desc: 'Started learning personal finance and realized how confusing it was for beginners in India.', icon: '💡' },
  { year: '2023', title: 'Building Begins', desc: 'Started building Financial Tool Hub to make financial education accessible and interactive for everyone.', icon: '🔨' },
  { year: '2024', title: 'Launch v1.0', desc: 'Launched with basic calculators and games. Community started growing rapidly.', icon: '🚀' },
  { year: '2024', title: 'v2.0 — AI Powered', desc: 'Complete rebuild with AI integration, premium UI, new games, and advanced calculators.', icon: '🤖' },
]

const SKILLS = [
  { name: 'React / TypeScript', level: 90 }, { name: 'Financial Modeling', level: 80 },
  { name: 'UI/UX Design', level: 75 }, { name: 'Python / Data', level: 70 },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen px-4 sm:px-6 py-16 max-w-5xl mx-auto">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <div className="relative inline-block mb-6">
          {/* Rotating gradient ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full"
            style={{ background: 'conic-gradient(from 0deg, #6366f1, #a855f7, #38bdf8, #10b981, #6366f1)', filter: 'blur(3px)', margin: '-3px' }}
          />
          {/* Profile image container - same dimensions and circular design */}
          <div
            className="relative w-28 h-28 rounded-full overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0a0f1e, #1a1040)' }}
          >
            <img
              src={`${import.meta.env.BASE_URL}myphoto.jpg`}
              alt="Prathamesh"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h1 className="font-cinzel font-black text-4xl md:text-5xl text-white mb-3">Prathamesh</h1>
        <p className="text-gradient text-xl font-semibold mb-4">Creator of Financial Tool Hub</p>
        <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
          Developer, finance enthusiast, and educator on a mission to make financial literacy accessible, fun, and interactive for every Indian.
        </p>
      </motion.div>

      {/* Contact Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {[
          { icon: Phone, label: 'Phone / WhatsApp', value: '+91 98331 73637', href: 'tel:+919833173637', color: '#10b981' },
          { icon: Mail, label: 'Email', value: 'prathameshkajrekar21@gmail.com', href: 'mailto:prathameshkajrekar21@gmail.com', color: '#6366f1' },
          { icon: Linkedin, label: 'LinkedIn', value: 'Prathamesh Kajrekar', href: 'https://www.linkedin.com/in/prathamesh-kajrekar-b59723357', color: '#a855f7' },
          { icon: Instagram, label: 'Instagram', value: 'Prathamesh Kajrekar', href: 'https://www.instagram.com/prathamesh_kajrekar/', color: '#ec4899' },
        ].map(contact => (
          <motion.a key={contact.label} href={contact.href} whileHover={{ y: -3, scale: 1.01 }}
            className="flex items-center gap-4 p-5 rounded-2xl transition-all cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${contact.color}18`, border: `1px solid ${contact.color}30` }}>
              <contact.icon size={20} style={{ color: contact.color }} />
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-0.5">{contact.label}</p>
              <p className="text-white font-medium text-sm">{contact.value}</p>
            </div>
          </motion.a>
        ))}
      </motion.div>

      {/* Mission */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="p-8 rounded-2xl mb-12"
        style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(168,85,247,0.08))', border: '1px solid rgba(99,102,241,0.25)' }}>
        <div className="flex items-start gap-4">
          <div className="text-3xl">🎯</div>
          <div>
            <h2 className="text-white font-bold text-xl mb-3 font-cinzel">My Mission</h2>
            <p className="text-slate-300 leading-relaxed mb-3">
              Growing up in India, I noticed that financial education was either too complex, too boring, or simply not accessible to the average person. Banks talk in jargon, advisors are expensive, and most apps are designed for experts.
            </p>
            <p className="text-slate-300 leading-relaxed mb-3">
              I built Financial Tool Hub to change that. A platform where a college student can understand SIP for the first time, where a working professional can plan their retirement, and where a senior can calculate FD returns — all through intuitive, interactive, and beautiful tools.
            </p>
            <p className="text-slate-400 leading-relaxed">
              The goal: make financial literacy as engaging as a mobile game, as powerful as a professional tool, and as friendly as a conversation with a knowledgeable friend.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
        <h2 className="font-cinzel font-bold text-2xl text-white mb-8 text-center">The Journey</h2>
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, transparent, #6366f1, #a855f7, transparent)' }} />
          <div className="space-y-8">
            {TIMELINE.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex gap-6 pl-0">
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl z-10 relative"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-indigo-400 text-sm font-mono">{item.year}</span>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-12">
        <h2 className="font-cinzel font-bold text-2xl text-white mb-6 text-center">Skills & Expertise</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SKILLS.map((skill, i) => (
            <div key={skill.name} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white font-medium">{skill.name}</span>
                <span className="text-indigo-400">{skill.level}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1 }}
                  className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="text-center p-8 rounded-2xl" style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.1),rgba(251,191,36,0.05))', border: '1px solid rgba(245,158,11,0.2)' }}>
        <div className="text-3xl mb-3">🙏</div>
        <h2 className="text-white font-bold text-xl mb-2 font-cinzel">Thank You for Using FTH!</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-4">If this platform helped your financial journey, please consider supporting it. Your support keeps it free for everyone.</p>
        <a href={`${import.meta.env.BASE_URL}donate`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          <Heart size={16} className="fill-current" /> Support This Project
        </a>
      </motion.div>
    </div>
  )
}