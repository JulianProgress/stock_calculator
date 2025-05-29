import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, PiggyBank, Receipt } from 'lucide-react';
import { CalculationResult } from '../types/investment';
import { formatCurrency, formatPercentage } from '../utils/investmentCalculator';

interface ResultSummaryProps {
  result: CalculationResult;
  showRealValue?: boolean;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ result, showRealValue = false }) => {
  const {
    totalInvestment,
    finalValue,
    totalReturn,
    returnRate,
    totalDividends,
    totalFees,
    realValue
  } = result;

  const isPositiveReturn = totalReturn >= 0;

  const summaryItems = [
    {
      title: '총 투자 원금',
      value: formatCurrency(totalInvestment),
      icon: <PiggyBank className="w-6 h-6" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600'
    },
    {
      title: '최종 자산 가치',
      value: formatCurrency(finalValue),
      icon: <DollarSign className="w-6 h-6" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconColor: 'text-green-600'
    },
    {
      title: '총 수익',
      value: formatCurrency(totalReturn),
      icon: isPositiveReturn ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />,
      bgColor: isPositiveReturn ? 'bg-green-50' : 'bg-red-50',
      textColor: isPositiveReturn ? 'text-green-700' : 'text-red-700',
      iconColor: isPositiveReturn ? 'text-green-600' : 'text-red-600'
    },
    {
      title: '투자 수익률',
      value: formatPercentage(returnRate),
      icon: <Percent className="w-6 h-6" />,
      bgColor: isPositiveReturn ? 'bg-green-50' : 'bg-red-50',
      textColor: isPositiveReturn ? 'text-green-700' : 'text-red-700',
      iconColor: isPositiveReturn ? 'text-green-600' : 'text-red-600'
    },
    {
      title: '배당 수익',
      value: formatCurrency(totalDividends),
      icon: <DollarSign className="w-6 h-6" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      iconColor: 'text-purple-600'
    },
    {
      title: '총 수수료·세금',
      value: formatCurrency(totalFees),
      icon: <Receipt className="w-6 h-6" />,
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      iconColor: 'text-gray-600'
    }
  ];

  if (showRealValue) {
    summaryItems.push({
      title: '인플레이션 고려 실질 가치',
      value: formatCurrency(realValue),
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-600'
    });
  }

  return (
    <div className="space-y-6">
      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryItems.map((item, index) => (
          <div
            key={index}
            className={`${item.bgColor} p-6 rounded-lg border border-gray-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {item.title}
                </p>
                <p className={`text-2xl font-bold ${item.textColor}`}>
                  {item.value}
                </p>
              </div>
              <div className={`${item.iconColor}`}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 상세 분석 */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          투자 성과 분석
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 수익률 분석 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">수익률 분석</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">총 투자 수익률</span>
                <span className={`font-medium ${isPositiveReturn ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(returnRate)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">연평균 수익률</span>
                <span className={`font-medium ${isPositiveReturn ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(returnRate / (result.monthlyData.length / 12))}
                </span>
              </div>
              
              {totalDividends > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">배당 수익률</span>
                  <span className="font-medium text-purple-600">
                    {formatPercentage((totalDividends / totalInvestment) * 100)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 비용 분석 */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">비용 분석</h4>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">총 비용</span>
                <span className="font-medium text-gray-700">
                  {formatCurrency(totalFees)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">비용 비율</span>
                <span className="font-medium text-gray-700">
                  {formatPercentage((totalFees / totalInvestment) * 100)}
                </span>
              </div>
              
              {showRealValue && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">인플레이션 영향</span>
                  <span className="font-medium text-yellow-600">
                    {formatCurrency(finalValue - realValue)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 복리 효과 설명 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">복리 효과</h5>
          <p className="text-sm text-blue-800">
            복리 효과로 인해 시간이 지날수록 투자 수익이 기하급수적으로 증가합니다. 
            장기 투자를 통해 복리의 힘을 최대한 활용해보세요.
          </p>
          {totalDividends > 0 && (
            <p className="text-sm text-blue-800 mt-2">
              배당금을 재투자하면 복리 효과가 더욱 극대화됩니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultSummary; 