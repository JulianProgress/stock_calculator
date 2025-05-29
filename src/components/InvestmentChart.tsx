import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { CalculationResult } from '../types/investment';
import { formatCurrency } from '../utils/investmentCalculator';

interface InvestmentChartProps {
  result: CalculationResult;
  showRealValue?: boolean;
}

const InvestmentChart: React.FC<InvestmentChartProps> = ({ result, showRealValue = false }) => {
  const chartData = result.monthlyData.map(data => ({
    month: data.month,
    '포트폴리오 가치': data.portfolioValue,
    '투자 원금': data.totalInvested,
    '수익금': data.totalReturn,
    '실질 가치': data.realValue,
    '배당 수익': data.dividends,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{`${label}개월`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* 포트폴리오 가치 변화 차트 */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          포트폴리오 가치 변화
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              label={{ value: '개월', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              label={{ value: '원', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="투자 원금"
              stackId="1"
              stroke="#94a3b8"
              fill="#94a3b8"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="수익금"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
            />
            {showRealValue && (
              <Line
                type="monotone"
                dataKey="실질 가치"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 수익 구성 차트 */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          수익 구성
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              label={{ value: '개월', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              label={{ value: '원', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="포트폴리오 가치"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="투자 원금"
              stroke="#94a3b8"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="배당 수익"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 월별 데이터 테이블 */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          월별 상세 데이터
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  개월
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  투자 원금
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  포트폴리오 가치
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수익금
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  배당 수익
                </th>
                {showRealValue && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    실질 가치
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {result.monthlyData
                .filter((_, index) => index % 6 === 0 || index === result.monthlyData.length - 1)
                .map((data) => (
                <tr key={data.month} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {data.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(data.totalInvested)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(data.portfolioValue)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    data.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(data.totalReturn)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                    {formatCurrency(data.dividends)}
                  </td>
                  {showRealValue && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                      {formatCurrency(data.realValue)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvestmentChart; 