import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface SupplyData {
  date: string;
  value: number;
}

interface SupplyComparisonData {
  usM2: {
    data: SupplyData[];
    total: string;
    timeRange: string;
  };
  bitcoin: {
    data: SupplyData[];
    total: string;
    timeRange: string;
  };
}

const SupplyComparisonChart: React.FC = () => {
  const [data, setData] = useState<SupplyComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSupplyData();
  }, []);

  const loadSupplyData = async () => {
    try {
      setLoading(true);
      
      // 模拟美国M2货币供应量数据（1960-2025）
      const usM2Data: SupplyData[] = [];
      const startYear = 1960;
      const endYear = 2025;
      
      for (let year = startYear; year <= endYear; year++) {
        // 模拟M2增长趋势：从1960年的0.3万亿到2025年的21.7万亿
        const progress = (year - startYear) / (endYear - startYear);
        let value;
        
        if (year <= 2000) {
          // 1960-2000年缓慢增长
          value = 0.3 + progress * 4;
        } else if (year <= 2008) {
          // 2000-2008年稳定增长
          value = 4.3 + (year - 2000) * 0.3;
        } else if (year <= 2020) {
          // 2008-2020年加速增长
          value = 6.7 + (year - 2008) * 0.7;
        } else {
          // 2020年后急剧增长（COVID刺激）
          value = 15.1 + (year - 2020) * 1.32;
        }
        
        usM2Data.push({
          date: year.toString(),
          value: value
        });
      }

      // 模拟比特币供应量数据（2009-2140）
      const bitcoinData: SupplyData[] = [];
      const btcStartYear = 2009;
      const btcEndYear = 2140;
      
      for (let year = btcStartYear; year <= Math.min(btcEndYear, 2060); year += 2) {
        // 比特币供应量增长模型：逐渐趋向21M
        const yearsFromStart = year - btcStartYear;
        const halvingCycles = Math.floor(yearsFromStart / 4);
        
        let supply;
        if (year <= 2012) {
          supply = yearsFromStart * 2.625; // 早期快速增长
        } else if (year <= 2016) {
          supply = 10.5 + (year - 2012) * 1.3125;
        } else if (year <= 2020) {
          supply = 15.75 + (year - 2016) * 0.65625;
        } else if (year <= 2024) {
          supply = 18.375 + (year - 2020) * 0.328125;
        } else {
          // 2024年后增长极慢，趋向21M
          supply = 19.6875 + (year - 2024) * 0.05;
        }
        
        supply = Math.min(supply, 21); // 最大21M
        
        bitcoinData.push({
          date: year.toString(),
          value: supply
        });
      }

      const supplyData: SupplyComparisonData = {
        usM2: {
          data: usM2Data,
          total: '$21.7T',
          timeRange: '1960-2025'
        },
        bitcoin: {
          data: bitcoinData,
          total: '₿21M',
          timeRange: '2009-2140'
        }
      };

      setData(supplyData);
    } catch (err) {
      setError('加载数据失败');
      console.error('Error loading supply data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-600">{error || '数据加载失败'}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* 标题和刷新按钮 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Bitcoin vs. US M2: 供给的稀缺性</h3>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          🔄 刷新
        </button>
      </div>

      {/* 注释部分 - 放在图表上方 */}
      <div className="mb-6 space-y-2">
        <div className="flex items-start space-x-2">
          <span className="text-red-500 text-sm">📈</span>
          <p className="text-sm text-gray-700">
            美国M2货币供应量从1960年的$0.3万亿增长到2025年的$21.7万亿，<br/>
            增长超过70倍
          </p>
        </div>
        <div className="flex items-start space-x-2">
          <span className="text-orange-500 text-sm">₿</span>
          <p className="text-sm text-gray-700">
            比特币总供应量固定在2100万枚，展现出绝对的稀缺性
          </p>
        </div>
        <div className="flex items-start space-x-2">
          <span className="text-blue-500 text-sm">⚖️</span>
          <p className="text-sm text-gray-700">
            对比显示：比特币固定供应 vs 法币无限印刷的根本差异
          </p>
        </div>
        <div className="flex items-start space-x-2">
          <span className="text-orange-600 text-sm">🔥</span>
          <p className="text-sm text-gray-700">
            稀缺性价值：比特币作为对冲货币政策的最佳工具日益凸显
          </p>
        </div>
      </div>

      {/* 对比图表 - 紧凑布局 */}
      <div className="flex gap-4 items-center justify-center">
        {/* 美国M2货币供应量 */}
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-4">
            {/* 数值显示 */}
            <div className="text-center mb-3">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {data.usM2.total}
              </div>
              <div className="text-sm font-semibold text-gray-700 mb-1">
                U.S. M2 Money Supply
              </div>
              <div className="text-xs text-gray-500">
                {data.usM2.timeRange}
              </div>
            </div>

            {/* 图表 */}
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.usM2.data}>
                  <defs>
                    <linearGradient id="usM2Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#usM2Gradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* VS 分隔符 */}
        <div className="text-lg font-bold text-gray-400 mx-2">
          VS
        </div>

        {/* 比特币货币供应量 */}
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-4">
            {/* 数值显示 */}
            <div className="text-center mb-3">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {data.bitcoin.total}
              </div>
              <div className="text-sm font-semibold text-gray-700 mb-1">
                Bitcoin Money Supply
              </div>
              <div className="text-xs text-gray-500">
                {data.bitcoin.timeRange}
              </div>
            </div>

            {/* 图表 */}
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.bitcoin.data}>
                  <defs>
                    <linearGradient id="bitcoinGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fill="url(#bitcoinGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SupplyComparisonChart;
