import React, { useState, useCallback } from 'react';
import { Calculator, BarChart3, Settings, Info } from 'lucide-react';
import { InvestmentInput, PurchaseEntry, AssetType, CalculationResult } from './types/investment';
import { calculateInvestment } from './utils/investmentCalculator';
import PurchaseEntryForm from './components/PurchaseEntryForm';
import ResultSummary from './components/ResultSummary';
import InvestmentChart from './components/InvestmentChart';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'input' | 'results' | 'chart'>('input');
  const [showRealValue, setShowRealValue] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  
  const [formData, setFormData] = useState<InvestmentInput>({
    assetType: 'stock',
    purchases: [],
    totalPeriodMonths: 60,
    expectedAnnualReturn: 8,
    annualDividendRate: 2,
    dividendReinvestment: true,
    transactionFeeRate: 0.5,
    taxRate: 15.4,
    inflationRate: 2.5,
  });

  const handleInputChange = useCallback((field: keyof InvestmentInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePurchasesChange = useCallback((purchases: PurchaseEntry[]) => {
    setFormData(prev => ({ ...prev, purchases }));
  }, []);

  const handleCalculate = useCallback(() => {
    if (formData.purchases.length === 0) {
      alert('매수 내역을 추가해주세요.');
      return;
    }

    // 수량 유효성 검사
    const hasValidQuantities = formData.purchases.every(p => p.quantity > 0);
    if (!hasValidQuantities) {
      alert('모든 매수 내역의 수량을 올바르게 입력해주세요.');
      return;
    }

    try {
      const calculationResult = calculateInvestment(formData);
      setResult(calculationResult);
      setActiveTab('results');
    } catch (error) {
      console.error('계산 중 오류 발생:', error);
      alert('계산 중 오류가 발생했습니다. 입력 값을 확인해주세요.');
    }
  }, [formData]);

  const assetTypes: { value: AssetType; label: string }[] = [
    { value: 'stock', label: '주식' },
    { value: 'crypto', label: '암호화폐' },
    { value: 'real-estate', label: '부동산' },
    { value: 'bond', label: '채권' },
    { value: 'fund', label: '펀드' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">투자 수익률 계산기</h1>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showRealValue}
                  onChange={(e) => setShowRealValue(e.target.checked)}
                  className="rounded"
                />
                <span>인플레이션 고려</span>
              </label>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 탭 네비게이션 */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'input'
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings size={16} />
            입력
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'results'
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            disabled={!result}
          >
            <Calculator size={16} />
            계산 결과
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'chart'
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            disabled={!result}
          >
            <BarChart3 size={16} />
            차트 분석
          </button>
        </div>

        {/* 콘텐츠 영역 */}
        {activeTab === 'input' && (
          <div className="space-y-8">
            {/* 기본 설정 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">기본 설정</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    자산 종류
                  </label>
                  <select
                    value={formData.assetType}
                    onChange={(e) => handleInputChange('assetType', e.target.value as AssetType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {assetTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    총 투자 기간 (개월)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalPeriodMonths}
                    onChange={(e) => handleInputChange('totalPeriodMonths', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연평균 예상 수익률 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.expectedAnnualReturn}
                    onChange={(e) => handleInputChange('expectedAnnualReturn', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연 배당률 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.annualDividendRate}
                    onChange={(e) => handleInputChange('annualDividendRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    거래 수수료율 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.transactionFeeRate}
                    onChange={(e) => handleInputChange('transactionFeeRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    세금율 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.taxRate}
                    onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연간 물가상승률 (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.inflationRate}
                    onChange={(e) => handleInputChange('inflationRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.dividendReinvestment}
                      onChange={(e) => handleInputChange('dividendReinvestment', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">배당 재투자</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 분할 매수 입력 */}
            <PurchaseEntryForm
              assetType={formData.assetType}
              purchases={formData.purchases}
              onPurchasesChange={handlePurchasesChange}
            />

            {/* 계산 버튼 */}
            <div className="flex justify-center">
              <button
                onClick={handleCalculate}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                수익률 계산하기
              </button>
            </div>

            {/* 사용법 안내 */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">사용법</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 자산 종류를 선택하고 기본 투자 조건을 입력하세요</li>
                    <li>• 분할 매수 내역에서 각 매수 시점, 가격, 수량을 입력하세요</li>
                    <li>• 암호화폐 선택 시 수량에 소수점 입력이 가능합니다</li>
                    <li>• 복리 효과가 자동으로 계산되어 시간에 따른 자산 증식을 보여줍니다</li>
                    <li>• 배당 재투자 옵션을 체크하면 배당금도 복리 효과가 적용됩니다</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && result && (
          <ResultSummary result={result} showRealValue={showRealValue} />
        )}

        {activeTab === 'chart' && result && (
          <InvestmentChart result={result} showRealValue={showRealValue} />
        )}
      </div>
    </div>
  );
}

export default App;
