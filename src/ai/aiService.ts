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
  } else {
    console.warn('Gemini API key not detected. Please check your .env file for VITE_GEMINI_API_KEY');
  }

  // Try OpenAI
  if (OPENAI_API_KEY) {
    try {
      return await callOpenAI(updatedMessages);
    } catch (e) {
      console.warn('OpenAI failed:', e);
    }
  } else {
    console.warn('OpenAI API key not detected');
  }

  // Enhanced fallback responses when no API key or all APIs fail
  return generateFallbackResponse(userMessage);
};

const callGemini = async (messages: ChatMessage[]): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing');
  }

  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  const requestBody = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] }, // Fixed: correct field name for Gemini API
    contents,
    generationConfig: {
      maxOutputTokens: 400,
      temperature: 0.7,
    }
  };

  console.log('[Gemini] Sending request with API key present?', !!GEMINI_API_KEY);
  console.log('[Gemini] Request URL:', `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY.substring(0, 8)}...`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    }
  );

  console.log('[Gemini] Response status:', response.status, response.statusText);

  if (!response.ok) {
    let errorBody = '';
    try {
      errorBody = await response.text();
      console.error('[Gemini] Error response body:', errorBody);
    } catch (e) {
      console.error('[Gemini] Could not read error body', e);
    }
    throw new Error(`Gemini API returned ${response.status}: ${response.statusText}. Body: ${errorBody}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error('[Gemini] Failed to parse JSON response', e);
    throw new Error('Invalid JSON response from Gemini');
  }

  console.log('[Gemini] Response parsed successfully', data);

  // Validate response structure
  const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidateText) {
    console.error('[Gemini] Malformed response - missing expected text content. Full response:', JSON.stringify(data, null, 2));
    throw new Error('Gemini returned empty or malformed response');
  }

  return candidateText;
};

const callOpenAI = async (messages: ChatMessage[]): Promise<string> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is missing');
  }

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

  if (!response.ok) {
    let errorBody = '';
    try {
      errorBody = await response.text();
      console.error('[OpenAI] Error response body:', errorBody);
    } catch (e) {
      console.error('[OpenAI] Could not read error body', e);
    }
    throw new Error(`OpenAI API returned ${response.status}: ${response.statusText}. Body: ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    console.error('[OpenAI] Malformed response:', JSON.stringify(data, null, 2));
    throw new Error('OpenAI returned empty response');
  }
  return content;
};

// Enhanced smart fallback responses
const generateFallbackResponse = (query: string): string => {
  const q = query.toLowerCase().trim();

  // ----- Existing specialized responses -----
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

  // ----- New expanded educational responses -----
  // Greetings
  if (q.match(/^(hello|hi|hey|good morning|good afternoon|good evening)$/)) {
    return `👋 Hello there! I'm Artha AI, your financial learning companion.\n\nHow can I help you today? Feel free to ask me about investing, budgeting, taxes, or any personal finance topic.\n\n💡 *Try: "What is compound interest?" or "Explain SIP"*`;
  }

  // "what is finance" / "define finance"
  if (q.includes('what is finance') || q.includes('define finance')) {
    return `📘 **Finance** is the art and science of managing money.\n\nIt covers three main areas:\n• **Personal Finance** – managing your own money (budgeting, saving, investing)\n• **Corporate Finance** – how businesses raise and use capital\n• **Public Finance** – government revenue and spending\n\nIn simple terms: finance helps you make smart decisions about earning, spending, saving, and growing money.\n\n💡 *Want to dive deeper? Ask me about budgeting, investing, or how to start your financial journey!*`;
  }

  // "who are you"
  if (q.includes('who are you')) {
    return `🧠 **I'm Artha AI** – your intelligent financial assistant for Financial Tool Hub!\n\nI'm here to help you understand financial concepts, explain calculator results, and teach you smart money management. Think of me as a friendly, knowledgeable guide on your journey to financial literacy.\n\n⚠️ *I provide educational information only. For personalized advice, please consult a SEBI-registered financial advisor.*\n\nWhat would you like to learn today? 🚀`;
  }

  // "what can you do"
  if (q.includes('what can you do')) {
    return `✨ **I can help you with:**\n\n📊 **Explain calculators** – SIP, EMI, PPF, Retirement, FIRE, and more\n🎮 **Understand financial games** – learn through interactive play\n📚 **Teach concepts** – investing, budgeting, taxes, inflation, compounding\n💡 **Give practical tips** – emergency funds, tax saving, goal planning\n🇮🇳 **Indian context** – talk about PPF, NPS, ELSS, SEBI, ₹ currency\n\n🔍 **Try asking:**\n• "How does compound interest work?"\n• "What's the 50-30-20 rule?"\n• "How to save tax in India?"\n\nI'm here to make finance fun and easy! 😊`;
  }

  // "what is investing"
  if (q.includes('what is investing')) {
    return `📈 **Investing** means putting your money to work to grow it over time.\n\nInstead of keeping cash idle, you buy assets like stocks, mutual funds, bonds, or real estate that have the potential to increase in value or generate income.\n\n**Key principles:**\n• Start early – time is your biggest ally\n• Diversify – don't put all eggs in one basket\n• Be patient – markets go up and down\n\n**Simple example:** Invest ₹5,000/month for 20 years at 10% return → you put in ₹12L, but end with ~₹38L thanks to compounding!\n\n⚠️ *All investments carry risk. Past performance doesn't guarantee future returns.*\n\n💡 *Use our SIP Calculator to see your own growth potential!*`;
  }

  // "what is budgeting"
  if (q.includes('what is budgeting')) {
    return `📋 **Budgeting** is simply planning how you'll spend your money.\n\nIt helps you:\n✅ Know where every rupee goes\n✅ Avoid overspending and debt\n✅ Save for goals (emergency fund, vacation, home)\n✅ Reduce financial stress\n\n**Popular method – 50/30/20 rule:**\n• 50% for needs (rent, groceries, bills)\n• 30% for wants (dining, entertainment)\n• 20% for savings & investments\n\n💡 *Try using our budget tracker or simply write down every expense for a week – you'll be surprised!*`;
  }

  // "what is inflation"
  if (q.includes('what is inflation')) {
    return `📉 **Inflation** is the gradual increase in prices over time – meaning your money buys less tomorrow than it does today.\n\n**Simple example:** A ₹100 movie ticket today might cost ₹110 next year.\n\n**Why it matters:**\n• If your savings earn 3% interest but inflation is 5%, you're losing purchasing power\n• This is why investing is important – to beat inflation\n\n**India context:** RBI targets ~4% inflation. When inflation is high, things like food, fuel, and rent become more expensive.\n\n💡 *To protect against inflation, consider assets like equities, real estate, or inflation-linked bonds.*`;
  }

  // "what is compound interest"
  if (q.includes('what is compound interest') || q.includes('compound interest')) {
    return `📊 **Compound Interest** is interest earned on interest – it's the eighth wonder of the world! (Einstein)\n\n**How it works:**\nYour money grows exponentially because you earn returns not just on your original investment, but also on the returns you've already made.\n\n**Example:** Invest ₹10,000 at 10% per year\n• Year 1: ₹10,000 + ₹1,000 = ₹11,000\n• Year 2: ₹11,000 + ₹1,100 = ₹12,100\n• Year 3: ₹12,100 + ₹1,210 = ₹13,310\n\n**The Rule of 72:** Divide 72 by interest rate to know how many years to double your money. E.g., 72/10 = 7.2 years to double at 10%.\n\n💡 *Start early! A 25-year-old investing ₹5,000/month can have ₹1.5 crore by 60, while starting at 35 gives only ~₹60 lakhs (assuming 10% returns).*`;
  }

  // "what is mutual fund"
  if (q.includes('what is mutual fund')) {
    return `📦 **Mutual Fund** – A pool of money collected from many investors to invest in stocks, bonds, or other assets.\n\n**Why people love them:**\n• **Diversification** – own many companies with small amount\n• **Professional management** – experts choose investments\n• **Affordable** – start with just ₹500 via SIP\n• **Liquid** – easy to redeem\n\n**Types in India:** Equity (stocks), Debt (bonds), Hybrid (mix), ELSS (tax saving), Index funds (track Nifty/Sensex)\n\n💡 *SIP in mutual funds is often recommended for long-term wealth creation. Use our SIP Calculator to see how your monthly investment can grow!*\n\n⚠️ *Mutual funds are subject to market risk. Read scheme documents carefully.*`;
  }

  // "what is stock market"
  if (q.includes('what is stock market')) {
    return `🏦 **Stock Market** – A marketplace where you can buy and sell shares of publicly listed companies.\n\n**How it works:**\nWhen you buy a share, you own a tiny piece of that company. If the company grows, your share value may increase.\n\n**Indian context:**\n• **BSE** (Bombay Stock Exchange) – oldest in Asia\n• **NSE** (National Stock Exchange) – largest by volume\n• **SEBI** regulates everything\n\n**Popular indices:** Sensex (BSE 30 companies) and Nifty 50 (NSE 50 companies)\n\n💡 *Beginners often start with mutual funds or index ETFs to avoid picking individual stocks. Long-term investing (5+ years) has historically given ~12-15% returns in India.*\n\n⚠️ *Stock market can be volatile. Never invest money you need in the next 3-5 years.*`;
  }

  // "what is savings"
  if (q.includes('what is savings')) {
    return `🏦 **Savings** – Money you set aside rather than spend immediately.\n\n**Purpose:**\n• Build emergency fund (3-6 months of expenses)\n• Achieve short-term goals (vacation, gadget, down payment)\n• Create capital for investing\n\n**Where to keep savings:**\n• Savings account (easy access, low returns ~2-4%)\n• Fixed Deposits (higher returns, locked for period)\n• Liquid funds (better than savings, still accessible)\n\n**Golden rule:** Save first, spend later. Aim to save at least 20% of your income.\n\n💡 *Even saving ₹1,000/month is a great start. Use our Savings Goal Calculator to plan!*`;
  }

  // ----- Intelligent fallback for completely unknown queries -----
  // Instead of the same generic response every time, we try to extract a topic and give a helpful educational reply.
  // If no topic identified, we still provide a conversational response that directs the user.
  
  // Try to find any financial keyword to provide a basic answer
  const financialKeywords = [
    'tax', 'fd', 'fixed deposit', 'nps', 'elss', 'retirement', 
    'goal', 'planning', 'risk', 'return', 'interest', 'debt', 
    'credit card', 'loan', 'insurance', 'term insurance', 'health insurance'
  ];
  
  for (const keyword of financialKeywords) {
    if (q.includes(keyword)) {
      return `🤔 That's a good question about **${keyword}**! While I'm in educational mode right now (AI connection temporarily limited), I can tell you:\n\n**Basics:** ${keyword} is an important part of personal finance. To learn more detailed, up-to-date information, please try asking me again or check our calculators and articles.\n\n💡 *You can also ask me specifically about SIP, PPF, EMI, FIRE, emergency funds, or crypto – I have detailed answers ready!*\n\nIs there a specific aspect of ${keyword} you'd like to understand better?`;
    }
  }
  
  // If no keyword matched, return a helpful, non-repetitive response that acknowledges the question and guides the user.
  // Extract the first few words of query for personalization.
  const queryPreview = query.length > 60 ? query.substring(0, 60) + '...' : query;
  return `🙏 Thanks for your question: "${queryPreview}"\n\nI'm Artha AI, and I'm currently operating in **offline educational mode** (AI service is not available at the moment). However, I can still help you with many financial topics!\n\n**Here's what I can teach you about:**\n• SIP, EMI, PPF, FIRE, Crypto, Emergency Funds\n• Investing, budgeting, inflation, compound interest\n• Mutual funds, stock market basics, savings\n\n**Try asking me something like:**\n• "What is compound interest?"\n• "How does a SIP work?"\n• "Explain the 50-30-20 budget rule"\n• "How to build an emergency fund?"\n\nIf you need more personalized or real-time AI answers, please contact to developer (Developers credentials are in About me section). I'm here to make finance simple and fun! 😊\n\nWhat would you like to learn next?`;
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