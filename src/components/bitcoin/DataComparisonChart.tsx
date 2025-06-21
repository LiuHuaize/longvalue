import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import { chartDataService, ChartDataPoint } from '../../services/chartDataService';

interface DataComparisonChartProps {
  title: string;
  isLoading?: boolean;
  data?: any; // 预留给实际数据的接口
}

interface ChartData {
  title: string;
  description: string;
  data: ChartDataPoint[];
  bitcoinUnit?: string;
  m2Unit?: string;
  dollarPPPUnit?: string;
  supplyUnit?: string;
  inflationUnit?: string;
  usM2Unit?: string;
}

const DataComparisonChart: React.FC<DataComparisonChartProps> = ({
  title,
  isLoading: propIsLoading = false,
  data: propData
}) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forceRefresh, setForceRefresh] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(`🔄 开始获取图表数据: ${title}`);

        let result: ChartData | null = null;

        switch (title) {
          case 'Bitcoin vs Major M2':
            console.log('📊 获取Bitcoin vs Major M2数据...');
            result = await chartDataService.getBitcoinVsM2Data();
            break;
          case 'Dollar PPP vs 1 Bitcoin':
            console.log('📊 获取Dollar PPP vs Bitcoin数据...');
            result = await chartDataService.getDollarPPPvsBitcoinData();
            break;
          case 'Bitcoin Supply vs Inflation Rate':
            console.log('📊 获取Bitcoin Supply vs Inflation数据...');
            result = await chartDataService.getBitcoinSupplyVsInflationData();
            break;
          case 'Bitcoin vs. US M2: 供给的稀缺性':
            console.log('📊 获取Bitcoin vs US M2数据...');
            result = await chartDataService.getBitcoinVsUSM2Data();
            break;
          default:
            throw new Error(`未知的图表类型: ${title}`);
        }

        console.log(`✅ 图表数据获取成功: ${title}`, result);
        setChartData(result);
        setLastUpdated(new Date().toLocaleTimeString('zh-CN'));
      } catch (err) {
        console.error('获取图表数据失败:', err);
        setError(err instanceof Error ? err.message : '数据获取失败');
      } finally {
        setIsLoading(false);
      }
    };

    if (!propData) {
      fetchChartData();
    } else {
      setChartData(propData);
      setIsLoading(propIsLoading);
    }
  }, [title, propData, propIsLoading, forceRefresh]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  const formatValue = (value: number, unit?: string) => {
    if (unit?.includes('Billions')) {
      return `$${(value / 1000).toFixed(1)}T`;
    }
    if (unit?.includes('USD')) {
      return `$${value.toLocaleString()}`;
    }
    if (unit?.includes('Million BTC')) {
      return `${value.toFixed(2)}M BTC`;
    }
    if (unit?.includes('BTC')) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    if (unit?.includes('Inflation Rate')) {
      return `${value.toFixed(1)}%`;
    }
    if (unit?.includes('M2 Growth Rate')) {
      return `${value.toFixed(1)}%`;
    }
    return value.toFixed(1);
  };

  const renderChart = () => {
    if (!chartData || !chartData.data || chartData.data.length === 0) {
      return (
        <div className="text-center text-gray-500">
          暂无数据
        </div>
      );
    }

    const processedData = chartData.data.map(item => ({
      ...item,
      date: formatDate(item.date)
    }));

    // 根据图表类型渲染不同的图表
    switch (title) {
      case 'Bitcoin vs Major M2':
        return (
          <ComposedChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="date"
              stroke="#666"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#4A90E2"
              domain={[-5, 15]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#FF7300"
              domain={['dataMin * 0.8', 'dataMax * 1.1']}
              tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value.toString()}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === 'bitcoin' ? `$${value.toLocaleString()}` : `${value.toFixed(1)}%`,
                name === 'bitcoin' ? 'Bitcoin / USD' : 'M2 Growth of Major Central Banks'
              ]}
              labelFormatter={(value) => value}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Bar
              yAxisId="left"
              dataKey="m2"
              fill="#4A90E2"
              name="M2 Growth of Major Central Banks (L)"
              barSize={6}
              opacity={0.8}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bitcoin"
              stroke="#FF7300"
              strokeWidth={2.5}
              name="Bitcoin / USD (R)"
              dot={false}
              activeDot={{ r: 4, stroke: '#FF7300', strokeWidth: 2 }}
            />
          </ComposedChart>
        );

      case 'Bitcoin vs. US M2: 供给的稀缺性':
        return (
          <ComposedChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === 'bitcoin' ? formatValue(value, 'USD') : formatValue(value, 'Billions USD'),
                name === 'bitcoin' ? '比特币价格' : 'M2供应量'
              ]}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="bitcoin"
              stroke="#f59e0b"
              strokeWidth={2}
              name="比特币价格"
            />
            <Bar
              yAxisId="right"
              dataKey="usM2"
              fill="#3b82f6"
              opacity={0.6}
              name="M2供应量"
            />
          </ComposedChart>
        );

      case 'Dollar PPP vs 1 Bitcoin':
      case 'Purchasing Power Over Time: 1 USD vs 1 BTC':
        return (
          <ComposedChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="date"
              stroke="#666"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              domain={[0.3, 1.2]}
              stroke="#ef4444"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.toFixed(1)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              scale="log"
              domain={[1, 100000]}
              stroke="#f59e0b"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value.toString()}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                name === 'bitcoin' ? `$${formatValue(value, 'USD')}` : `$${value.toFixed(2)}`,
                name === 'bitcoin' ? 'BTC购买力 (Dec 2011 USD)' : 'USD购买力 (Dec 2011 USD)'
              ]}
            />
            <Legend />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bitcoin"
              stroke="#f59e0b"
              strokeWidth={2}
              name="BTC购买力"
              dot={false}
              activeDot={{ r: 4, fill: '#f59e0b' }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="dollarPPP"
              stroke="#ef4444"
              strokeWidth={2}
              name="USD购买力"
              dot={false}
              activeDot={{ r: 4, fill: '#ef4444' }}
            />
          </ComposedChart>
        );

      case 'Bitcoin Supply vs Inflation Rate':
        return (
          <ComposedChart data={processedData}>
            <CartesianGrid strokeDasharray="2 2" stroke="#e0e0e0" opacity={0.5} />
            <XAxis
              dataKey="date"
              stroke="#666"
              tick={{ fontSize: 11 }}
              axisLine={{ stroke: '#666', strokeWidth: 1 }}
              tickLine={{ stroke: '#666', strokeWidth: 1 }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="#ef4444"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 11 }}
              axisLine={{ stroke: '#ef4444', strokeWidth: 2 }}
              tickLine={{ stroke: '#ef4444', strokeWidth: 1 }}
              label={{ value: '通胀率', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#8B4513"
              domain={[0, 21]}
              tickFormatter={(value) => `${value}M`}
              tick={{ fontSize: 11 }}
              axisLine={{ stroke: '#8B4513', strokeWidth: 2 }}
              tickLine={{ stroke: '#8B4513', strokeWidth: 1 }}
              label={{ value: '比特币供应量', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
            />
            <Tooltip
              content={() => null}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
              payload={[
                { value: '比特币供应量', type: 'line', color: '#8B4513' },
                { value: '通胀率', type: 'line', color: '#ef4444' }
              ]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bitcoinSupply"
              stroke="#8B4513"
              strokeWidth={4}
              name="比特币供应量"
              dot={false}
              activeDot={false}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="inflation"
              stroke="#ef4444"
              strokeWidth={3}
              name="通胀率"
              dot={false}
              activeDot={false}
            />
          </ComposedChart>
        );

      default:
        return (
          <div className="text-center text-gray-500">
            未知的图表类型
          </div>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        </div>
        <button
          onClick={() => setForceRefresh(prev => prev + 1)}
          disabled={isLoading}
          className={`
            flex items-center space-x-1 text-sm px-3 py-1 rounded transition-all duration-200
            ${isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:shadow-sm'
            }
          `}
          title="刷新最新数据（历史数据2022-2024已保存，仅更新2025年6月后数据）"
        >
          <svg
            className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>{isLoading ? '刷新中' : '刷新'}</span>
        </button>
      </div>
      {chartData?.description && (
        <div className="text-sm text-gray-600 mb-4 whitespace-pre-line">
          {chartData.description}
        </div>
      )}
      <div className="h-64">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mx-auto mb-2"></div>
              <span className="text-gray-500">图表数据加载中...</span>
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️</div>
              <span className="text-red-500 text-sm">{error}</span>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DataComparisonChart;
