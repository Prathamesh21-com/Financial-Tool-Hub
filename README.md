# 🏦 Financial Tool Hub v2.0

> India's most advanced interactive financial learning ecosystem

![Financial Tool Hub](https://img.shields.io/badge/version-2.0.0-indigo)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3-teal)

---

## ✨ Features

### 🧮 12 Professional Calculators
| Calculator | Description |
|---|---|
| SIP Calculator | Systematic Investment Plan with animated charts |
| EMI Calculator | Loan EMI & full amortization schedule |
| FD Calculator | Fixed Deposit with compounding options |
| PPF Calculator | Public Provident Fund with tax savings |
| Compound Interest | Visual compound vs simple comparison |
| Retirement Calculator | Full retirement corpus planner |
| FIRE Calculator | Financial Independence Retire Early |
| Inflation Calculator | Purchasing power erosion visualizer |
| Emergency Fund | Safety net calculator |
| Net Worth | Assets vs liabilities tracker |
| Step-up SIP | Annual increment SIP calculator |
| SWP Calculator | Systematic Withdrawal Plan |

### 🎮 5 Financial Games
- **Crypto Rush** — Trade crypto in simulated market (3 min)
- **Financial Literacy Challenge** — 15+ quiz questions, XP system
- **Stock Market Tycoon** — 30-day NSE stock trading simulation
- **Scam Detector** — Identify 8 real-world financial fraud scenarios
- **Budget Survival** — 12-month real-life budget challenge

### 🤖 AI Features
- **Artha AI** — Financial learning chatbot (Gemini/OpenAI)
- AI explanation for every calculator result
- Smart financial education responses
- 100% educational — no illegal advice

### 🎬 Premium UI
- **Namaste Intro** — Cinematic particle animation on first visit
- Glassmorphism design throughout
- Framer Motion animations
- Dark/Light theme support
- Fully responsive (mobile, tablet, desktop)
- XP system, achievements, dashboard

### 📊 Market Overview
- Simulated live market data (educational)
- Indian indices, stocks, crypto, commodities

### 🔐 Admin Panel
- Analytics dashboard
- Usage statistics
- Donation tracking
- Protected by password

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org))
- **VS Code** (recommended)

### Installation

```bash
# 1. Navigate to project
cd financial-tool-hub

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your API keys

# 4. Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### That's it! 🎉

---

## ⚙️ Environment Variables

Create a `.env` file from `.env.example`:

```env
# Required for AI Chat features
VITE_GEMINI_API_KEY=your_gemini_key_here

# Admin panel password
VITE_ADMIN_PASSWORD=admin@FTH2024
```

### Getting a Free Gemini API Key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google
3. Click "Create API Key"
4. Copy and paste into `.env`

> **Note:** The app works fully without an API key — AI chat will use intelligent fallback responses.

---

## 🏗️ Project Structure

```
src/
├── ai/                    # AI service (Gemini/OpenAI)
├── animations/            # Namaste intro animation
├── calculators/           # 12 calculator components
│   ├── SIPCalculator.tsx
│   ├── EMICalculator.tsx
│   ├── FDCalculator.tsx
│   ├── PPFCalculator.tsx
│   ├── CompoundCalculator.tsx
│   ├── RetirementCalculator.tsx
│   ├── FIRECalculator.tsx
│   ├── InflationCalculator.tsx
│   ├── EmergencyFundCalculator.tsx
│   ├── NetWorthCalculator.tsx
│   ├── StepUpSIPCalculator.tsx
│   └── SWPCalculator.tsx
├── components/            # Shared UI components
│   ├── AIChat.tsx         # Floating AI chatbot
│   ├── CalcLayout.tsx     # Calculator wrapper
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── NotificationStack.tsx
│   └── SearchModal.tsx
├── games/                 # 5 financial games
│   ├── CryptoRush.tsx
│   ├── FinancialLiteracy.tsx
│   ├── StockTycoon.tsx
│   ├── ScamDetector.tsx
│   └── BudgetSurvival.tsx
├── layouts/               # MainLayout wrapper
├── pages/                 # All page components
│   ├── HomePage.tsx
│   ├── CalculatorsPage.tsx
│   ├── GamesPage.tsx
│   ├── AboutPage.tsx
│   ├── DonatePage.tsx
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── AdminPage.tsx
│   ├── MarketPage.tsx
│   ├── DisclaimerPage.tsx
│   └── NotFoundPage.tsx
├── store/                 # Zustand state management
├── types/                 # TypeScript interfaces
└── utils/                 # Financial calculation formulas
```

---

## 🔐 Admin Panel

Access at `/admin` or via login with admin mode.

**Default password:** `admin@FTH2024`

Change it in your `.env`:
```env
VITE_ADMIN_PASSWORD=your_secure_password
```

---

## 🌐 Deployment

### Vercel (Recommended — Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Netlify

```bash
npm run build
# Upload /dist folder to Netlify
```

### Manual Build

```bash
npm run build
# Serve the /dist folder with any static host
```

---

## 💰 Donation Setup

To receive donations, update the UPI ID in:

```
src/pages/DonatePage.tsx
```

Change `prathamesh@upi` to your actual UPI ID.

For real QR codes, replace the SVG placeholder with your actual GPay/PhonePe QR code image.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite 5 | Build tool & dev server |
| Tailwind CSS 3 | Styling |
| Framer Motion | Animations |
| Recharts | Charts & graphs |
| Zustand | State management |
| React Router 6 | Navigation |
| Lucide React | Icons |
| Google Gemini API | AI chatbot |

---

## ⚖️ Legal

This platform is for **educational purposes only**.

- Not SEBI-registered financial advice
- No guaranteed returns
- Always consult a qualified financial advisor
- See full disclaimer at `/disclaimer`

---

## 👤 Creator

**Prathamesh** — Full-stack developer & finance enthusiast

- 📧 prathamesh@financialtoolhub.com
- 📱 +91 98765 43210
- 🌐 financialtoolhub.com

---

## 🙏 Support

If Financial Tool Hub helped your financial learning journey, consider [supporting the project](/donate)!

Your support keeps it **100% free** for everyone in India. 🇮🇳

---

*Made with ❤️ in India*
