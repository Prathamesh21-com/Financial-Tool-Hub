export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  streak: number;
  xp: number;
  level: number;
  achievements: Achievement[];
  financialHealthScore: number;
  savedCalculations: SavedCalculation[];
  gameProgress: GameProgress;
  favoriteTools: string[];
  theme: 'dark' | 'light';
  isAdmin?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SavedCalculation {
  id: string;
  type: string;
  name: string;
  inputs: Record<string, number | string>;
  result: Record<string, number | string>;
  savedAt: Date;
}

export interface GameProgress {
  cryptoRush: CryptoRushProgress;
  financialLiteracy: FinancialLiteracyProgress;
  stockMarket: StockMarketProgress;
}

export interface CryptoRushProgress {
  highScore: number;
  level: number;
  totalXP: number;
  achievements: string[];
  portfolio: { [key: string]: number };
}

export interface FinancialLiteracyProgress {
  highestScore: number;
  totalQuestions: number;
  streak: number;
  completedCategories: string[];
  badges: string[];
}

export interface StockMarketProgress {
  portfolioValue: number;
  totalTrades: number;
  bestTrade: number;
  level: number;
}

export interface Calculator {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'investment' | 'loan' | 'savings' | 'planning' | 'tax';
  color: string;
  featured: boolean;
}

export interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  color: string;
  players: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xp: number;
}

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  icon: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  category: string;
  timestamp: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface DonationTier {
  name: string;
  amount: number;
  perks: string[];
  color: string;
  icon: string;
}

export interface AppState {
  user: User | null;
  theme: 'dark' | 'light';
  showNamaste: boolean;
  aiChatOpen: boolean;
  searchQuery: string;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: Date;
}

export interface SIPResult {
  totalInvestment: number;
  estimatedReturns: number;
  maturityValue: number;
  monthlyData: { month: number; invested: number; value: number }[];
}

export interface EMIResult {
  emi: number;
  totalAmount: number;
  totalInterest: number;
  amortization: { month: number; principal: number; interest: number; balance: number }[];
}

export interface FDResult {
  maturityAmount: number;
  totalInterest: number;
  effectiveYield: number;
  yearlyBreakdown: { year: number; amount: number }[];
}

export interface CompoundResult {
  finalAmount: number;
  totalInterest: number;
  yearlyBreakdown: { year: number; amount: number; interest: number }[];
}

export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  totalCalculations: number;
  totalGameSessions: number;
  topCalculators: { name: string; uses: number }[];
  topGames: { name: string; plays: number }[];
  dailyVisitors: { date: string; count: number }[];
}
