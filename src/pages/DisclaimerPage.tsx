import { motion } from 'framer-motion'
import { Shield, AlertTriangle, BookOpen, Mail } from 'lucide-react'

export default function DisclaimerPage() {
  const isPrivacy = window.location.pathname === '/privacy'

  return (
    <div className="min-h-screen px-4 sm:px-6 py-16 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <Shield size={22} className="text-amber-400" />
          </div>
          <div>
            <h1 className="font-cinzel font-bold text-3xl text-white">
              {isPrivacy ? 'Privacy Policy' : 'Legal Disclaimer'}
            </h1>
            <p className="text-slate-500 text-sm">Last updated: January 2024</p>
          </div>
        </div>

        {!isPrivacy ? (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-rose-400 font-bold mb-2">Important Notice</h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Financial Tool Hub is an <strong>educational platform only</strong>. All content, calculators, games, and AI responses are strictly for learning purposes and do not constitute financial, investment, tax, or legal advice.
                  </p>
                </div>
              </div>
            </div>

            {[
              {
                icon: BookOpen, title: 'Educational Purpose Only', color: '#6366f1',
                content: 'All calculators, tools, games, simulations, and AI-generated content on Financial Tool Hub are designed solely for financial education and literacy. Results are estimates based on mathematical formulas and should not be relied upon for actual investment decisions.'
              },
              {
                icon: AlertTriangle, title: 'No Financial Advice', color: '#f59e0b',
                content: 'Nothing on this website constitutes financial advice, investment recommendations, or guaranteed returns. The website creator (Prathamesh) is not a SEBI-registered investment advisor. Always consult a qualified, SEBI-registered financial advisor before making any investment decisions.'
              },
              {
                icon: Shield, title: 'Investment Risk Warning', color: '#ec4899',
                content: 'All investments involve risk. Mutual funds, stocks, cryptocurrencies, and other financial instruments are subject to market risks. Past performance does not guarantee future results. The calculators use assumed rates of return which may not reflect actual market performance.'
              },
              {
                icon: BookOpen, title: 'AI Assistant Limitations', color: '#10b981',
                content: 'Artha AI is an educational chatbot powered by AI APIs. Its responses are for learning purposes only. The AI may make errors and should never be used as the sole basis for financial decisions. Always verify information with qualified professionals.'
              },
              {
                icon: Shield, title: 'Market Data', color: '#38bdf8',
                content: 'Market data shown on the platform is simulated or approximate and may not reflect real-time prices. Do not use this data for actual trading or investment decisions. Always check official exchanges (NSE, BSE, CoinMarketCap) for real-time data.'
              },
              {
                icon: Shield, title: 'Games & Simulations', color: '#a855f7',
                content: 'All games use virtual currency and simulated markets. Performance in games does not predict real-world investment performance. Games are designed purely for entertainment and educational purposes about financial concepts.'
              },
            ].map(section => (
              <div key={section.title} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <section.icon size={16} style={{ color: section.color }} />
                  <h2 className="text-white font-semibold">{section.title}</h2>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{section.content}</p>
              </div>
            ))}

            <div className="p-5 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Mail size={16} className="text-emerald-400" />
                <h2 className="text-white font-semibold">Contact</h2>
              </div>
              <p className="text-slate-400 text-sm">
                For questions about this disclaimer, contact:{' '}
                <a href="mailto:prathamesh@financialtoolhub.com" className="text-indigo-400 hover:underline">
                  prathamesh@financialtoolhub.com
                </a>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {[
              {
                title: 'Data We Collect',
                content: 'Financial Tool Hub collects minimal data. When you create an account, we store your name, email, and usage preferences locally in your browser (localStorage). We do not collect sensitive financial data or payment information.'
              },
              {
                title: 'How We Use Data',
                content: 'Data is used solely to provide personalized dashboard features, save your progress in games, and remember your calculator preferences. We do not sell, share, or monetize user data in any form.'
              },
              {
                title: 'AI Chat Data',
                content: 'Messages sent to Artha AI are processed through third-party AI APIs (Google Gemini or OpenAI). Please do not share personal financial information, account numbers, or sensitive data in the AI chat. Chat history is stored only in your current browser session.'
              },
              {
                title: 'Cookies & Storage',
                content: 'We use browser localStorage for preferences and session data only. No tracking cookies. No advertising cookies. No cross-site tracking.'
              },
              {
                title: 'Donations',
                content: 'Donation payments are processed directly through UPI/GPay. We do not store payment card details or bank information. Transactions are between you and your UPI payment provider.'
              },
              {
                title: 'Your Rights',
                content: 'You can clear all your data at any time by clearing browser storage. To request account deletion or data removal, email: prathamesh@financialtoolhub.com'
              },
              {
                title: 'Third-Party Services',
                content: 'The platform may use Google Fonts (for typography) and AI APIs (Gemini/OpenAI) for the chatbot. These services have their own privacy policies. We do not share personally identifiable information with these services.'
              },
            ].map(s => (
              <div key={s.title} className="p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h2 className="text-white font-semibold mb-2">{s.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
