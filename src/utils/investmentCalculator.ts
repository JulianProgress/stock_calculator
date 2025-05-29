import { InvestmentInput, CalculationResult, MonthlyData, PurchaseEntry } from '../types/investment';

export function calculateInvestment(input: InvestmentInput): CalculationResult {
  const {
    purchases,
    totalPeriodMonths,
    expectedAnnualReturn,
    annualDividendRate,
    dividendReinvestment,
    transactionFeeRate,
    taxRate,
    inflationRate
  } = input;

  // 월별 수익률 계산
  const monthlyReturn = expectedAnnualReturn / 100 / 12;
  const monthlyDividendRate = annualDividendRate / 100 / 12;
  const monthlyInflation = inflationRate / 100 / 12;

  // 월별 데이터 저장
  const monthlyData: MonthlyData[] = [];
  
  let totalShares = 0;
  let totalInvestment = 0;
  let totalDividends = 0;
  let totalFees = 0;
  let accumulatedDividends = 0;

  // 각 달별로 계산
  for (let month = 0; month <= totalPeriodMonths; month++) {
    // 해당 월에 매수가 있는지 확인
    const monthlyPurchases = purchases.filter(p => p.purchaseTime === month);
    
    let monthlyInvestment = 0;
    let monthlyShares = 0;

    for (const purchase of monthlyPurchases) {
      const investmentAmount = purchase.price * purchase.quantity;
      const fees = investmentAmount * (transactionFeeRate / 100);
      const netInvestment = investmentAmount + fees;
      
      monthlyInvestment += netInvestment;
      monthlyShares += purchase.quantity;
      totalFees += fees;
    }

    totalInvestment += monthlyInvestment;
    totalShares += monthlyShares;

    // 포트폴리오 가치 계산 (복리 효과 적용)
    let portfolioValue = 0;
    for (const purchase of purchases.filter(p => p.purchaseTime <= month)) {
      const timePassed = month - purchase.purchaseTime;
      const compoundGrowth = Math.pow(1 + monthlyReturn, timePassed);
      const shareValue = purchase.price * compoundGrowth;
      portfolioValue += shareValue * purchase.quantity;
    }

    // 배당 계산
    let monthlyDividend = 0;
    if (month > 0 && totalShares > 0) {
      // 평균 매수가격 계산
      const avgPrice = purchases.reduce((sum, p) => {
        if (p.purchaseTime <= month) {
          return sum + (p.price * p.quantity);
        }
        return sum;
      }, 0) / Math.max(totalShares, 1);
      
      monthlyDividend = avgPrice * totalShares * monthlyDividendRate;
      
      // 배당세 적용
      const dividendTax = monthlyDividend * (taxRate / 100);
      monthlyDividend -= dividendTax;
      totalFees += dividendTax;
      
      totalDividends += monthlyDividend;
      
      // 배당 재투자
      if (dividendReinvestment) {
        accumulatedDividends += monthlyDividend;
        // 재투자된 배당금도 복리 효과 적용
        const reinvestmentMonths = totalPeriodMonths - month;
        const reinvestmentGrowth = Math.pow(1 + monthlyReturn, reinvestmentMonths);
        portfolioValue += accumulatedDividends * reinvestmentGrowth;
      }
    }

    // 인플레이션 고려 실질 가치
    const realValue = portfolioValue / Math.pow(1 + monthlyInflation, month);

    monthlyData.push({
      month,
      portfolioValue,
      totalInvested: totalInvestment,
      totalReturn: portfolioValue - totalInvestment,
      dividends: totalDividends,
      realValue
    });
  }

  const finalMonthData = monthlyData[monthlyData.length - 1];
  const finalValue = finalMonthData.portfolioValue + (dividendReinvestment ? 0 : totalDividends);
  const totalReturn = finalValue - totalInvestment;
  const returnRate = (totalReturn / totalInvestment) * 100;

  return {
    totalInvestment,
    finalValue,
    totalReturn,
    returnRate,
    totalDividends,
    totalFees,
    realValue: finalMonthData.realValue,
    monthlyData
  };
}

export function validatePurchaseQuantity(assetType: string, quantity: string): boolean {
  if (assetType === 'crypto') {
    // 코인인 경우 소수점 허용
    return /^\d*\.?\d*$/.test(quantity) && parseFloat(quantity) > 0;
  } else {
    // 주식 등은 정수만 허용
    return /^\d+$/.test(quantity) && parseInt(quantity) > 0;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(rate: number): string {
  return `${rate.toFixed(2)}%`;
} 