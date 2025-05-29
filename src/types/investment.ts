export type AssetType = 'stock' | 'crypto' | 'real-estate' | 'bond' | 'fund';

export interface PurchaseEntry {
  id: string;
  purchaseTime: number; // 투자 시작 후 경과 개월
  price: number; // 매수 가격
  quantity: number; // 수량 (코인인 경우 소수점 가능)
}

export interface InvestmentInput {
  assetType: AssetType;
  purchases: PurchaseEntry[];
  totalPeriodMonths: number; // 총 투자 기간 (개월)
  expectedAnnualReturn: number; // 연평균 예상 수익률 (%)
  annualDividendRate: number; // 연 배당률 (%)
  dividendReinvestment: boolean; // 배당 재투자 여부
  transactionFeeRate: number; // 거래 수수료율 (%)
  taxRate: number; // 세금율 (%)
  inflationRate: number; // 연간 물가상승률 (%)
}

export interface CalculationResult {
  totalInvestment: number; // 총 투자 원금
  finalValue: number; // 최종 자산 가치
  totalReturn: number; // 총 수익 금액
  returnRate: number; // 총 투자 수익률 (%)
  totalDividends: number; // 배당을 통한 총 수익
  totalFees: number; // 총 수수료 및 세금
  realValue: number; // 인플레이션 고려 실질 가치
  monthlyData: MonthlyData[]; // 월별 데이터
}

export interface MonthlyData {
  month: number;
  portfolioValue: number;
  totalInvested: number;
  totalReturn: number;
  dividends: number;
  realValue: number;
} 