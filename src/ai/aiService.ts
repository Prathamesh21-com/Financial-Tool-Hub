// AI service - supports Gemini or OpenAI
// Configure via .env file

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

const SYSTEM_PROMPT = `You are Artha AI, the financial assistant for Financial Tool Hub — India's most advanced interactive financial learning website.

You are a friendly, knowledgeable, and encouraging financial educator. Your role is to:
1. Explain financial concepts in simple, clear language
2. Help users understand their calculator results
3. Teach financial literacy in an engaging way
4. Provide educational insights about investment strategies
5. Explain Indian financial instruments (SIP, PPF, FD, ELSS, NPS, etc.)

CRITICAL RULES:
- NEVER give direct investment advice or stock recommendations
- NEVER guarantee returns or profits
- ALWAYS clarify that insights are educational only
- Encourage users to consult certified financial advisors for personal advice
- Focus on education, not advice
- Be encouraging and supportive of the user's financial learning journey
- Keep responses concise but informative (max 200 words unless complex topic)
- Use Indian context (₹ currency, Indian instruments, SEBI regulations)
- Add relevant emojis to make responses engaging

You have access to knowledge about: SIP, EMI, FD, PPF, NPS, ELSS, mutual funds, stock markets, crypto basics, budgeting, emergency funds, insurance, tax saving, retirement planning, FIRE, inflation, compound interest.

Always end with a helpful tip or encouraging message.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const sendMessageToAI = async (
  messages: ChatMessage[],
  userMessage: string
): Promise<string> => {
  const updatedMessages = [...messages, { role: 'user' as const, content: userMessage }];

  // Try Gemini first
  if (GEMINI_API_KEY) {
    try {
      return await callGemini(updatedMessages);
    } catch (e) {
      console.warn('Gemini failed, trying OpenAI:', e);
    }
  }

  // Try OpenAI
  if (OPENAI_API_KEY) {
    try {
      return await callOpenAI(updatedMessages);
    } catch (e) {
      console.warn('OpenAI failed:', e);
    }
  }

  // Fallback responses when no API key
  return generateFallbackResponse(userMessage);
};

const callGemini = async (messages: ChatMessage[]): Promise<string> => {
  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          maxOutputTokens: 400,
          temperature: 0.7,
        }
      })
    }
  );

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || generateFallbackResponse(messages[messages.length - 1]?.content || '');
};

const callOpenAI = async (messages: ChatMessage[]): Promise<string> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      max_tokens: 400,
      temperature: 0.7,
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || generateFallbackResponse(messages[messages.length - 1]?.content || '');
};

// Smart offline fallback
const generateFallbackResponse = (query: string): string => {
  const q = query.toLowerCase();

  if (q.includes('sip') || q.includes('systematic')) {
    return `💰 **SIP (Systematic Investment Plan)** is one of India's most powerful wealth-building tools!\n\nA SIP lets you invest a fixed amount monthly in mutual funds. The magic lies in **rupee-cost averaging** — you buy more units when markets are low and fewer when high, averaging out your cost.\n\n**Example:** ₹5,000/month for 10 years at 12% return = ₹11.6 Lakhs invested → ₹23+ Lakhs maturity! 🚀\n\nKey benefits:\n• Disciplined investing\n• Power of compounding\n• No need to time the market\n• Start with just ₹500/month\n\n💡 *Tip: Use our SIP Calculator to see exactly how your money grows!*\n\n⚠️ *Past performance doesn't guarantee future returns. Consult a SEBI-registered advisor.*`;
  }

  if (q.includes('emi') || q.includes('loan')) {
    return `🏠 **EMI (Equated Monthly Installment)** is the monthly payment you make for a loan.\n\nIt's calculated using the formula:\n**EMI = P × r × (1+r)^n / ((1+r)^n - 1)**\n\nWhere:\n• P = Principal loan amount\n• r = Monthly interest rate\n• n = Number of months\n\n💡 **Smart Tips:**\n• Higher down payment = Lower EMI\n• Shorter tenure = Less total interest\n• Always compare real interest rates (not flat rates)\n• Try to prepay when possible — it saves huge interest!\n\nUse our EMI Calculator to see your exact payments! 📊\n\n⚠️ *Always read the fine print before taking any loan.*`;
  }

  if (q.includes('ppf') || q.includes('public provident')) {
    return `🛡️ **PPF (Public Provident Fund)** is India's safest long-term investment!\n\n**Current features (2024):**\n• Interest rate: 7.1% p.a. (compounded annually)\n• Lock-in: 15 years (extendable in 5-yr blocks)\n• Investment: ₹500 to ₹1.5 Lakh/year\n• Tax benefit: EEE status (Exempt-Exempt-Exempt)\n• Backed by Government of India\n\n**Why it's special:**\n✅ Zero market risk\n✅ Tax-free returns\n✅ Loan facility from 3rd year\n✅ Partial withdrawal from 7th year\n\n💡 *Tip: Start PPF early and maximize ₹1.5L/year for 80C deduction AND tax-free corpus!*`;
  }

  if (q.includes('emergency fund')) {
    return `🆘 **Emergency Fund — Your Financial Safety Net!**\n\nFinancial experts recommend keeping **3-6 months of expenses** in an easily accessible account.\n\n**Where to keep it:**\n• High-yield savings account\n• Liquid mutual funds\n• FDs with sweep facility\n\n**Why it's critical:**\n• Job loss protection\n• Medical emergencies\n• Car/home repairs\n• Avoids debt traps\n\n**Building it:**\nStart small — even ₹5,000/month. Goal: Have 6 months of your monthly expenses secured before investing aggressively.\n\n💡 *Your emergency fund should be boring and accessible. Don't invest it in stocks!*`;
  }

  if (q.includes('fire') || q.includes('financial independence')) {
    return `🔥 **FIRE — Financial Independence, Retire Early**\n\nFIRE is the movement of achieving financial freedom well before traditional retirement age.\n\n**The 4% Rule:**\nIf your annual expenses = ₹6L, your FIRE number = 25× = **₹1.5 Crore**\n\n**FIRE Types:**\n• **LeanFIRE**: Minimalist lifestyle\n• **FatFIRE**: Comfortable lifestyle\n• **BaristaFIRE**: Semi-retired, part-time work\n• **CoastFIRE**: Invest early, let it coast\n\n**How to achieve it:**\n• High savings rate (50%+ ideally)\n• Low-cost index funds\n• Minimize lifestyle inflation\n• Multiple income streams\n\n💡 *Use our FIRE Calculator to find your number!*`;
  }

  if (q.includes('crypto') || q.includes('bitcoin')) {
    return `₿ **Crypto 101 — High Risk, High Reward**\n\nCryptocurrency is digital/virtual currency secured by cryptography.\n\n**Key concepts:**\n• **Bitcoin (BTC)**: The original, limited to 21M coins\n• **Ethereum (ETH)**: Smart contracts platform\n• **Altcoins**: All other cryptocurrencies\n\n**Indian context:**\n• 30% flat tax on crypto profits in India\n• 1% TDS on every transaction\n• Regulated but not banned\n\n**Risk factors:**\n⚠️ Extremely volatile\n⚠️ No government backing\n⚠️ Regulatory uncertainty\n⚠️ Technical risks (lost keys = lost money)\n\n💡 *Financial advisors generally recommend max 5-10% of portfolio in crypto if you choose to invest.*\n\n⚠️ *Never invest more than you can afford to lose completely.*`;
  }

  return `👋 **Namaste! I'm Artha AI, your financial learning assistant!**\n\nI can help you understand:\n\n📊 **Calculators**: SIP, EMI, FD, PPF, Retirement, FIRE\n🎮 **Games**: Financial concepts through fun gameplay\n📚 **Education**: Investment basics, tax saving, budgeting\n💡 **Tips**: Practical money management advice\n\n**Try asking me about:**\n• "How does SIP work?"\n• "What is compound interest?"\n• "How to save tax in India?"\n• "Explain the 50-30-20 rule"\n• "What is FIRE movement?"\n\n⚠️ *I'm an educational assistant. For personalized advice, consult a SEBI-registered financial advisor.*\n\nWhat would you like to learn today? 🚀`;
};

export const getCalculatorExplanation = async (
  calculatorType: string,
  inputs: Record<string, number>,
  result: Record<string, number>
): Promise<string> => {
  const prompt = `Explain in simple terms what this ${calculatorType} calculation means for the user:
Inputs: ${JSON.stringify(inputs)}
Result: ${JSON.stringify(result)}

Give practical insights, what's good/bad about this result, and actionable tips. Keep it under 150 words. Use ₹ for currency. Be encouraging.`;

  return sendMessageToAI([], prompt);
};
