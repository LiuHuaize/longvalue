import React, { useState, useEffect } from 'react';
import { proxyDataService } from '../../services/proxyDataService';

interface BitcoinData {
  price: number;
  marketCap: number;
  change24h: number;
  volume24h: number;
}

const SimpleBitcoinDisplay: React.FC = () => {
  const [data, setData] = useState<BitcoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const formatMarketCap = (marketCap: number): string => {
    const trillion = marketCap / 1000000000000;
    return `$${trillion.toFixed(2)}T`;
  };

  const formatPercentage = (percentage: number): string => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  const fetchBitcoinData = async () => {
    console.log('🚀 [SimpleBitcoinDisplay] 开始获取比特币数据...');
    setLoading(true);
    setError(null);

    try {
      const response = await proxyDataService.fetchCurrentBitcoinPrice();
      console.log('✅ [SimpleBitcoinDisplay] 获取到数据:', response);

      const bitcoinData: BitcoinData = {
        price: response.usd,
        marketCap: response.usd_market_cap,
        change24h: response.usd_24h_change,
        volume24h: response.usd_24h_vol
      };

      setData(bitcoinData);
      setLastUpdated(new Date().toLocaleTimeString('zh-CN'));
      setError(null);
      console.log('✅ [SimpleBitcoinDisplay] 数据设置完成');
    } catch (err) {
      console.error('❌ [SimpleBitcoinDisplay] 获取数据失败:', err);
      setError('获取数据失败');
    } finally {
      setLoading(false);
      console.log('🏁 [SimpleBitcoinDisplay] 加载状态设置为 false');
    }
  };

  useEffect(() => {
    fetchBitcoinData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">比特币实时数据</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">比特币实时数据</h3>
        <div className="text-center text-red-500">
          <div className="text-4xl mb-2">⚠️</div>
          <div>{error}</div>
          <button
            onClick={fetchBitcoinData}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            重新获取
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-900">比特币实时数据</h3>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              最后更新: {lastUpdated}
            </span>
          )}
          <button
            onClick={fetchBitcoinData}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            刷新
          </button>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-600">
            <h4 className="text-sm font-bold text-blue-600 uppercase mb-2">实时价格</h4>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(data.price)}</div>
            <div className="text-sm text-blue-500 font-medium">USD</div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-600">
            <h4 className="text-sm font-bold text-green-600 uppercase mb-2">24小时涨跌</h4>
            <div className={`text-2xl font-bold ${data.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(data.change24h)}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border-l-4 border-purple-600">
            <h4 className="text-sm font-bold text-purple-600 uppercase mb-2">市值</h4>
            <div className="text-2xl font-bold text-gray-900">{formatMarketCap(data.marketCap)}</div>
            <div className="text-sm text-purple-500 font-medium">USD</div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border-l-4 border-orange-600">
            <h4 className="text-sm font-bold text-orange-600 uppercase mb-2">24小时交易量</h4>
            <div className="text-2xl font-bold text-gray-900">{formatMarketCap(data.volume24h)}</div>
            <div className="text-sm text-orange-500 font-medium">USD</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleBitcoinDisplay;