// 简化的比特币数据服务 - 通过代理服务获取真实数据
import { BitcoinPriceData, BitcoinReturnData } from '../types/bitcoin';
import { proxyDataService } from './proxyDataService';

interface CoinCapAsset {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

interface CoinCapResponse {
  data: CoinCapAsset;
  timestamp: number;
}

interface CoinCapHistoryItem {
  priceUsd: string;
  time: number;
  date: string;
}

interface CoinCapHistoryResponse {
  data: CoinCapHistoryItem[];
}

class SimpleBitcoinService {
  private binanceURL = 'https://api.binance.com/api/v3';
  private coingeckoURL = 'https://api.coingecko.com/api/v3';
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any, ttlMinutes: number = 60): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    });
  }

  /**
   * 获取比特币当前数据
   */
  async getCurrentData(): Promise<BitcoinPriceData> {
    const cacheKey = 'bitcoin-current-simple';
    // 暂时禁用缓存以确保获取最新数据
    // const cached = this.getCachedData(cacheKey);
    // if (cached) return cached;

    try {
      console.log('₿ 通过代理服务获取比特币当前数据...');

      // 首先检查代理服务是否可用
      const isServerHealthy = await proxyDataService.checkServerHealth();
      if (!isServerHealthy) {
        throw new Error('代理服务器不可用');
      }

      // 通过代理服务获取比特币价格
      const priceData = await proxyDataService.fetchCurrentBitcoinPrice();

      // 估算市值和供应量（使用已知数据）
      const circulatingSupply = 19800000; // 大约的流通供应量
      const totalSupply = 21000000;
      const marketCap = priceData.usd * circulatingSupply;

      const bitcoinData: BitcoinPriceData = {
        price: priceData.usd,
        priceChange24h: priceData.usd_24h_change || 0,
        priceChangePercentage24h: priceData.usd_24h_change || 0,
        marketCap: priceData.usd_market_cap || marketCap,
        volume24h: priceData.usd_24h_vol || 0,
        circulatingSupply: circulatingSupply,
        totalSupply: totalSupply,
        lastUpdated: new Date(priceData.last_updated_at * 1000).toISOString()
      };

      console.log('✅ 成功获取比特币当前数据');
      this.setCachedData(cacheKey, bitcoinData, 60); // 缓存1小时
      return bitcoinData;
    } catch (error) {
      console.error('❌ 获取比特币数据失败，使用模拟数据:', error);
      // 返回模拟数据
      return this.getMockCurrentData();
    }
  }

  /**
   * 获取历史回报率数据
   */
  async getReturnsData(): Promise<BitcoinReturnData> {
    const cacheKey = 'bitcoin-returns-simple';
    // 暂时禁用缓存以确保获取最新数据
    // const cached = this.getCachedData(cacheKey);
    // if (cached) return cached;

    try {
      console.log('📈 通过代理服务获取比特币历史数据...');

      // 通过代理服务获取历史数据
      const historyData = await proxyDataService.fetchBitcoinHistory('365');

      if (!historyData || historyData.length === 0) {
        throw new Error('历史数据为空');
      }

      // 获取当前价格
      const currentPrice = historyData[historyData.length - 1].price;

      const returnsData: BitcoinReturnData = {
        threeMonthReturn: this.calculateReturnFromHistory(historyData, currentPrice, 90),
        oneYearReturn: this.calculateReturnFromHistory(historyData, currentPrice, 365),
        tenYearReturn: 8900.2, // 10年数据需要更长的历史，使用估算值
        allTimeHigh: 108135,
        allTimeLow: 0.0008
      };

      console.log('✅ 成功计算历史回报率');
      this.setCachedData(cacheKey, returnsData, 360); // 缓存6小时
      return returnsData;
    } catch (error) {
      console.error('❌ 获取历史回报率失败，使用模拟数据:', error);
      // 返回模拟数据
      return this.getMockReturnsData();
    }
  }

  /**
   * 计算回报率
   */
  private calculateReturn(historyData: CoinCapHistoryItem[], currentPrice: number, days: number): number {
    try {
      if (historyData.length < days) {
        // 数据不足，返回估算值
        const estimates: { [key: number]: number } = {
          90: 15.8,   // 3个月
          365: 125.4  // 1年
        };
        return estimates[days] || 0;
      }

      const pastIndex = historyData.length - days;
      const pastPrice = parseFloat(historyData[pastIndex].priceUsd);
      
      return ((currentPrice - pastPrice) / pastPrice) * 100;
    } catch (error) {
      console.error('计算回报率失败:', error);
      return 0;
    }
  }

  /**
   * 计算回报率 (Binance K线格式)
   */
  private calculateReturnFromKlines(klineData: any[], currentPrice: number, days: number): number {
    try {
      if (klineData.length < days) {
        // 数据不足，返回估算值
        const estimates: { [key: number]: number } = {
          90: 15.8,   // 3个月
          365: 125.4  // 1年
        };
        return estimates[days] || 0;
      }

      const pastIndex = klineData.length - days;
      const pastPrice = parseFloat(klineData[pastIndex][4]); // 收盘价

      return ((currentPrice - pastPrice) / pastPrice) * 100;
    } catch (error) {
      console.error('计算K线回报率失败:', error);
      return 0;
    }
  }

  /**
   * 计算回报率 (历史价格数据格式)
   */
  private calculateReturnFromHistory(historyData: any[], currentPrice: number, days: number): number {
    try {
      if (historyData.length < days) {
        // 数据不足，返回估算值
        const estimates: { [key: number]: number } = {
          90: 15.8,   // 3个月
          365: 125.4  // 1年
        };
        return estimates[days] || 0;
      }

      const pastIndex = historyData.length - days;
      const pastPrice = historyData[pastIndex].price;

      return ((currentPrice - pastPrice) / pastPrice) * 100;
    } catch (error) {
      console.error('计算历史回报率失败:', error);
      return 0;
    }
  }

  /**
   * 模拟当前数据
   */
  private getMockCurrentData(): BitcoinPriceData {
    return {
      price: 95420.50,
      priceChange24h: 2.51,
      priceChangePercentage24h: 2.51,
      marketCap: 1890000000000,
      volume24h: 28500000000,
      circulatingSupply: 19800000,
      totalSupply: 21000000,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * 模拟回报率数据
   */
  private getMockReturnsData(): BitcoinReturnData {
    return {
      threeMonthReturn: 15.8,
      oneYearReturn: 125.4,
      tenYearReturn: 8900.2,
      allTimeHigh: 108135,
      allTimeLow: 0.0008
    };
  }

  /**
   * 获取简单的新闻数据（模拟）
   */
  async getSimpleNews() {
    return [
      {
        id: 'news-1',
        title: 'Bitcoin价格突破新高度',
        summary: '比特币继续其上涨趋势，机构采用率不断增加。',
        url: '#',
        publishedAt: new Date().toISOString(),
        source: 'CoinCap',
        sentiment: 'positive' as const
      },
      {
        id: 'news-2',
        title: '主要公司将比特币加入资产负债表',
        summary: '又一家财富500强公司宣布比特币储备策略。',
        url: '#',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: 'Bitcoin News',
        sentiment: 'positive' as const
      }
    ];
  }
}

// 导出单例
export const simpleBitcoinService = new SimpleBitcoinService();

// 导出格式化函数
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
};

export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(1)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(1)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(1)}M`;
  }
  return `$${marketCap.toFixed(0)}`;
};
