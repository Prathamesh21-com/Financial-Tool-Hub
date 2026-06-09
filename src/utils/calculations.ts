// ============ FORMATTERS ============

export const formatCurrency = (amount: number, compact = false): string => {
  if (compact) {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string =>
  new Intl.NumberFormat('en-IN').format(Math.round(num));

export const formatPercent = (num: number, decimals = 2): string =>
  `${num.toFixed(decimals)}%`;

export const formatLakh = (num: number): string => {
  if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Crore`;
  if (num >= 100000) return `${(num / 100000).toFixed(2)} Lakh`;
  return formatNumber(num);
};

export const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).format(date);

// ============ SIP CALCULATIONS ============
export const calculateSIP = (
  monthlyInvestment: number,
  annualRate: number,
  years: number
) => {
  const n = years * 12;
  const r = annualRate / 100 / 12;
  const totalInvestment = monthlyInvestment * n;

  if (r === 0) {
    return {
      totalInvestment,
      maturityValue: totalInvestment,
      estimatedReturns: 0,
      monthlyData: Array.from({ length: n }, (_, i) => ({
        month: i + 1,
        invested: monthlyInvestment * (i + 1),
        value: monthlyInvestment * (i + 1),
      })),
    };
  }

  const maturityValue = monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const estimatedReturns = maturityValue - totalInvestment;

  const monthlyData = [];
  let currentValue = 0;
  for (let i = 1; i <= n; i++) {
    currentValue = (currentValue + monthlyInvestment) * (1 + r);
    monthlyData.push({
      month: i,
      invested: monthlyInvestment * i,
      value: Math.round(currentValue),
    });
  }

  return { totalInvestment, maturityValue, estimatedReturns, monthlyData };
};

// ============ EMI CALCULATIONS ============
export const calculateEMI = (
  principal: number,
  annualRate: number,
  years: number
) => {
  const n = years * 12;
  const r = annualRate / 100 / 12;

  if (r === 0) {
    const emi = principal / n;
    return {
      emi,
      totalAmount: principal,
      totalInterest: 0,
      amortization: Array.from({ length: n }, (_, i) => ({
        month: i + 1,
        principal: emi,
        interest: 0,
        balance: principal - emi * (i + 1),
      })),
    };
  }

  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalAmount = emi * n;
  const totalInterest = totalAmount - principal;

  const amortization = [];
  let balance = principal;
  for (let i = 1; i <= n; i++) {
    const interestComponent = balance * r;
    const principalComponent = emi - interestComponent;
    balance -= principalComponent;
    amortization.push({
      month: i,
      principal: Math.round(principalComponent),
      interest: Math.round(interestComponent),
      balance: Math.max(0, Math.round(balance)),
    });
  }

  return { emi, totalAmount, totalInterest, amortization };
};

// ============ COMPOUND INTEREST ============
export const calculateCompound = (
  principal: number,
  annualRate: number,
  years: number,
  frequency: number = 1
) => {
  const r = annualRate / 100;
  const yearlyBreakdown = [];
  let amount = principal;

  for (let y = 1; y <= years; y++) {
    amount = principal * Math.pow(1 + r / frequency, frequency * y);
    yearlyBreakdown.push({
      year: y,
      amount: Math.round(amount),
      interest: Math.round(amount - principal),
    });
  }

  return {
    finalAmount: amount,
    totalInterest: amount - principal,
    yearlyBreakdown,
  };
};

// ============ FD CALCULATIONS ============
export const calculateFD = (
  principal: number,
  annualRate: number,
  years: number,
  compoundingFrequency: number = 4
) => {
  const r = annualRate / 100;
  const n = compoundingFrequency;
  const maturityAmount = principal * Math.pow(1 + r / n, n * years);
  const totalInterest = maturityAmount - principal;

  const yearlyBreakdown = Array.from({ length: years }, (_, i) => ({
    year: i + 1,
    amount: Math.round(principal * Math.pow(1 + r / n, n * (i + 1))),
  }));

  return {
    maturityAmount: Math.round(maturityAmount),
    totalInterest: Math.round(totalInterest),
    effectiveYield: ((maturityAmount / principal - 1) / years) * 100,
    yearlyBreakdown,
  };
};

// ============ PPF CALCULATIONS ============
export const calculatePPF = (
  yearlyInvestment: number,
  years: number = 15,
  rate: number = 7.1
) => {
  const r = rate / 100;
  let balance = 0;
  const yearlyData = [];

  for (let y = 1; y <= years; y++) {
    balance = (balance + yearlyInvestment) * (1 + r);
    yearlyData.push({
      year: y,
      invested: yearlyInvestment * y,
      balance: Math.round(balance),
      interest: Math.round(balance - yearlyInvestment * y),
    });
  }

  return {
    maturityAmount: Math.round(balance),
    totalInvestment: yearlyInvestment * years,
    totalInterest: Math.round(balance - yearlyInvestment * years),
    yearlyData,
  };
};

// ============ RETIREMENT ============
export const calculateRetirement = (
  currentAge: number,
  retirementAge: number,
  monthlyExpenses: number,
  currentSavings: number,
  monthlyInvestment: number,
  expectedReturn: number,
  inflationRate: number
) => {
  const yearsToRetirement = retirementAge - currentAge;
  const lifeExpectancy = 85;
  const retirementYears = lifeExpectancy - retirementAge;

  const r = expectedReturn / 100 / 12;
  const n = yearsToRetirement * 12;
  const inflationAdjustedExpenses = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);

  // Corpus needed at retirement
  const corpusNeeded = inflationAdjustedExpenses * 12 * retirementYears * 25; // 4% rule

  // Corpus from current savings
  const savingsGrown = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);

  // Corpus from monthly investments
  const sipCorpus = r > 0
    ? monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
    : monthlyInvestment * n;

  const projectedCorpus = savingsGrown + sipCorpus;
  const shortfall = Math.max(0, corpusNeeded - projectedCorpus);
  const surplus = Math.max(0, projectedCorpus - corpusNeeded);

  return {
    corpusNeeded: Math.round(corpusNeeded),
    projectedCorpus: Math.round(projectedCorpus),
    monthlyExpensesAtRetirement: Math.round(inflationAdjustedExpenses),
    shortfall: Math.round(shortfall),
    surplus: Math.round(surplus),
    isOnTrack: projectedCorpus >= corpusNeeded,
    savingsGrown: Math.round(savingsGrown),
    sipCorpus: Math.round(sipCorpus),
  };
};

// ============ FIRE CALCULATOR ============
export const calculateFIRE = (
  annualExpenses: number,
  currentAge: number,
  targetFIREAge: number,
  currentSavings: number,
  monthlyInvestment: number,
  expectedReturn: number,
  safeWithdrawalRate: number = 4
) => {
  const fireNumber = annualExpenses * (100 / safeWithdrawalRate);
  const yearsToFIRE = targetFIREAge - currentAge;
  const r = expectedReturn / 100 / 12;
  const n = yearsToFIRE * 12;

  const savingsGrown = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToFIRE);
  const sipCorpus = r > 0 ? monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : monthlyInvestment * n;
  const projectedCorpus = savingsGrown + sipCorpus;

  let actualFIREYear = yearsToFIRE;
  let testCorpus = 0;
  for (let y = 1; y <= 50; y++) {
    const testSavings = currentSavings * Math.pow(1 + expectedReturn / 100, y);
    const testSIP = r > 0 ? monthlyInvestment * ((Math.pow(1 + r, y * 12) - 1) / r) * (1 + r) : monthlyInvestment * y * 12;
    testCorpus = testSavings + testSIP;
    if (testCorpus >= fireNumber) {
      actualFIREYear = y;
      break;
    }
  }

  return {
    fireNumber: Math.round(fireNumber),
    projectedCorpus: Math.round(projectedCorpus),
    yearsToFIRE: actualFIREYear,
    actualFIREAge: currentAge + actualFIREYear,
    isAchievable: projectedCorpus >= fireNumber,
    monthlyPassiveIncome: Math.round((projectedCorpus * safeWithdrawalRate) / 100 / 12),
    savingsGrown: Math.round(savingsGrown),
    sipCorpus: Math.round(sipCorpus),
  };
};

// ============ EMERGENCY FUND ============
export const calculateEmergencyFund = (
  monthlyExpenses: number,
  monthsOfCoverage: number = 6,
  currentSaved: number = 0
) => {
  const target = monthlyExpenses * monthsOfCoverage;
  const remaining = Math.max(0, target - currentSaved);
  const percentComplete = Math.min(100, (currentSaved / target) * 100);

  return {
    target: Math.round(target),
    currentSaved: Math.round(currentSaved),
    remaining: Math.round(remaining),
    percentComplete: Math.round(percentComplete),
    monthsOfCoverage,
  };
};

// ============ NET WORTH ============
export const calculateNetWorth = (
  assets: { name: string; value: number }[],
  liabilities: { name: string; value: number }[]
) => {
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.value, 0);
  const netWorth = totalAssets - totalLiabilities;
  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    debtToAssetRatio: Math.round(debtToAssetRatio),
  };
};

// ============ INFLATION ============
export const calculateInflation = (
  currentAmount: number,
  inflationRate: number,
  years: number
) => {
  const futureValue = currentAmount * Math.pow(1 + inflationRate / 100, years);
  const presentValue = currentAmount / Math.pow(1 + inflationRate / 100, years);
  const purchasingPowerLoss = ((currentAmount - presentValue) / currentAmount) * 100;

  const yearlyData = Array.from({ length: years }, (_, i) => ({
    year: i + 1,
    futureValue: Math.round(currentAmount * Math.pow(1 + inflationRate / 100, i + 1)),
    presentValue: Math.round(currentAmount / Math.pow(1 + inflationRate / 100, i + 1)),
  }));

  return {
    futureValue: Math.round(futureValue),
    presentValue: Math.round(presentValue),
    purchasingPowerLoss: Math.round(purchasingPowerLoss),
    yearlyData,
  };
};

// ============ STEP-UP SIP ============
export const calculateStepUpSIP = (
  monthlyInvestment: number,
  annualRate: number,
  years: number,
  stepUpPercent: number
) => {
  const yearlyData = [];
  let totalInvested = 0;
  let currentValue = 0;
  let currentMonthly = monthlyInvestment;
  const r = annualRate / 100 / 12;

  for (let y = 1; y <= years; y++) {
    for (let m = 1; m <= 12; m++) {
      currentValue = (currentValue + currentMonthly) * (1 + r);
      totalInvested += currentMonthly;
    }
    yearlyData.push({
      year: y,
      monthly: Math.round(currentMonthly),
      invested: Math.round(totalInvested),
      value: Math.round(currentValue),
    });
    currentMonthly *= (1 + stepUpPercent / 100);
  }

  return {
    maturityValue: Math.round(currentValue),
    totalInvested: Math.round(totalInvested),
    estimatedReturns: Math.round(currentValue - totalInvested),
    yearlyData,
  };
};

// ============ SWP ============
export const calculateSWP = (
  corpus: number,
  monthlyWithdrawal: number,
  annualReturn: number
) => {
  const r = annualReturn / 100 / 12;
  const months = [];
  let balance = corpus;
  let month = 0;

  while (balance > 0 && month < 1200) {
    balance = balance * (1 + r) - monthlyWithdrawal;
    month++;
    if (month % 12 === 0) {
      months.push({
        year: month / 12,
        balance: Math.max(0, Math.round(balance)),
      });
    }
    if (balance <= 0) break;
  }

  return {
    sustainableYears: Math.floor(month / 12),
    finalBalance: Math.max(0, Math.round(balance)),
    totalWithdrawn: monthlyWithdrawal * month,
    yearlyData: months,
  };
};

// ============ FINANCIAL HEALTH SCORE ============
export const calculateFinancialHealthScore = (inputs: {
  emergencyFundMonths: number;
  debtToIncomeRatio: number;
  savingsRate: number;
  hasInsurance: boolean;
  hasInvestments: boolean;
  creditScore: number;
}): number => {
  let score = 0;
  if (inputs.emergencyFundMonths >= 6) score += 25;
  else if (inputs.emergencyFundMonths >= 3) score += 15;
  if (inputs.debtToIncomeRatio <= 20) score += 20;
  else if (inputs.debtToIncomeRatio <= 40) score += 10;
  if (inputs.savingsRate >= 20) score += 20;
  else if (inputs.savingsRate >= 10) score += 12;
  if (inputs.hasInsurance) score += 15;
  if (inputs.hasInvestments) score += 10;
  if (inputs.creditScore >= 750) score += 10;
  else if (inputs.creditScore >= 650) score += 5;
  return Math.min(100, score);
};

// ============ RANDOM HELPERS ============
export const lerp = (start: number, end: number, t: number): number =>
  start + (end - start) * t;

export const clamp = (val: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, val));

export const generateId = (): string =>
  Math.random().toString(36).slice(2, 11);

export const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number): T => {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
};
