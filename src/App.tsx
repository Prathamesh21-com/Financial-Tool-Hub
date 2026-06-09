import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAppStore } from './store/useAppStore'

import NamasteIntro from './animations/NamasteIntro'
import MainLayout from './layouts/MainLayout'

// Pages
import HomePage from './pages/HomePage'
import CalculatorsPage from './pages/CalculatorsPage'
import GamesPage from './pages/GamesPage'
import AboutPage from './pages/AboutPage'
import DonatePage from './pages/DonatePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import MarketPage from './pages/MarketPage'
import DisclaimerPage from './pages/DisclaimerPage'
import NotFoundPage from './pages/NotFoundPage'

// Calculators
import SIPCalculator from './calculators/SIPCalculator'
import EMICalculator from './calculators/EMICalculator'
import FDCalculator from './calculators/FDCalculator'
import PPFCalculator from './calculators/PPFCalculator'
import CompoundCalculator from './calculators/CompoundCalculator'
import RetirementCalculator from './calculators/RetirementCalculator'
import FIRECalculator from './calculators/FIRECalculator'
import InflationCalculator from './calculators/InflationCalculator'
import EmergencyFundCalculator from './calculators/EmergencyFundCalculator'
import NetWorthCalculator from './calculators/NetWorthCalculator'
import StepUpSIPCalculator from './calculators/StepUpSIPCalculator'
import SWPCalculator from './calculators/SWPCalculator'

// Games
import CryptoRush from './games/CryptoRush'
import FinancialLiteracy from './games/FinancialLiteracy'
import StockTycoon from './games/StockTycoon'
import ScamDetector from './games/ScamDetector'
import BudgetSurvival from './games/BudgetSurvival'

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAppStore()
  return isAdmin ? <>{children}</> : <Navigate to="/login?admin=1" replace />
}

export default function App() {
  const { showNamaste, setShowNamaste, theme } = useAppStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <>
      <AnimatePresence>
        {showNamaste && (
          <NamasteIntro onComplete={() => setShowNamaste(false)} />
        )}
      </AnimatePresence>

      {!showNamaste && (
        <HashRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/calculators" element={<CalculatorsPage />} />
              <Route path="/calculators/sip" element={<SIPCalculator />} />
              <Route path="/calculators/emi" element={<EMICalculator />} />
              <Route path="/calculators/fd" element={<FDCalculator />} />
              <Route path="/calculators/ppf" element={<PPFCalculator />} />
              <Route path="/calculators/compound" element={<CompoundCalculator />} />
              <Route path="/calculators/retirement" element={<RetirementCalculator />} />
              <Route path="/calculators/fire" element={<FIRECalculator />} />
              <Route path="/calculators/inflation" element={<InflationCalculator />} />
              <Route path="/calculators/emergency" element={<EmergencyFundCalculator />} />
              <Route path="/calculators/networth" element={<NetWorthCalculator />} />
              <Route path="/calculators/stepupsip" element={<StepUpSIPCalculator />} />
              <Route path="/calculators/swp" element={<SWPCalculator />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/games/crypto-rush" element={<CryptoRush />} />
              <Route path="/games/financial-literacy" element={<FinancialLiteracy />} />
              <Route path="/games/stock-tycoon" element={<StockTycoon />} />
              <Route path="/games/scam-detector" element={<ScamDetector />} />
              <Route path="/games/budget-survival" element={<BudgetSurvival />} />
              <Route path="/market" element={<MarketPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/privacy" element={<DisclaimerPage />} />
              <Route path="/admin" element={<AdminGuard><AdminPage /></AdminGuard>} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </HashRouter>
      )}
    </>
  )
}
