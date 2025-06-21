/**
 * 比特币历史数据服务
 * 通过代理服务获取真实数据，避免CORS问题
 */

import { proxyDataService } from './proxyDataService';

export interface BitcoinHistoryPoint {
  date: string;
  price: number;
  marketCap?: number;
  volume?: number;
}

export interface BitcoinHistoryData {
  prices: BitcoinHistoryPoint[];
  startDate: string;
  endDate: string;
  dataSource: string;
}

class BitcoinHistoryService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any, ttlHours: number = 24): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlHours * 60 * 60 * 1000
    });
  }

  /**
   * 尝试从CoinGecko获取历史数据
   */
  private async fetchFromCoinGecko(startDate: string, endDate: string): Promise<BitcoinHistoryPoint[]> {
    try {
      // CoinGecko的历史数据API
      const start = new Date(startDate).getTime() / 1000;
      const end = new Date(endDate).getTime() / 1000;
      
      const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=${start}&to=${end}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`CoinGecko API错误: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.prices || !Array.isArray(data.prices)) {
        throw new Error('CoinGecko返回数据格式错误');
      }

      return data.prices.map(([timestamp, price]: [number, number]) => ({
        date: new Date(timestamp).toISOString().split('T')[0],
        price: price
      }));
    } catch (error) {
      console.error('CoinGecko获取失败:', error);
      throw error;
    }
  }

  /**
   * 尝试从Yahoo Finance获取历史数据 (备选方案)
   */
  private async fetchFromYahooFinance(startDate: string, endDate: string): Promise<BitcoinHistoryPoint[]> {
    try {
      // 注意：这需要一个代理服务器或者CORS代理
      // 这里提供一个示例URL，实际使用时可能需要调整
      const start = Math.floor(new Date(startDate).getTime() / 1000);
      const end = Math.floor(new Date(endDate).getTime() / 1000);
      
      const url = `https://query1.finance.yahoo.com/v7/finance/download/BTC-USD?period1=${start}&period2=${end}&interval=1d&events=history`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Yahoo Finance API错误: ${response.status}`);
      }

      const csvText = await response.text();
      const lines = csvText.split('\n').slice(1); // 跳过标题行
      
      return lines
        .filter(line => line.trim())
        .map(line => {
          const [date, , , , close] = line.split(',');
          return {
            date: date,
            price: parseFloat(close)
          };
        })
        .filter(point => !isNaN(point.price));
    } catch (error) {
      console.error('Yahoo Finance获取失败:', error);
      throw error;
    }
  }

  /**
   * 获取比特币历史数据
   */
  async getBitcoinHistory(
    startDate: string = '2011-01-01',
    endDate: string = '2020-12-31'
  ): Promise<BitcoinHistoryData> {
    const cacheKey = `bitcoin-history-${startDate}-${endDate}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    let prices: BitcoinHistoryPoint[] = [];
    let dataSource = 'mock';

    // 通过代理服务获取数据
    try {
      console.log('📈 通过代理服务获取比特币历史数据...');
      const historyData = await proxyDataService.fetchBitcoinHistory('max');

      // 过滤日期范围
      const startTime = new Date(startDate).getTime();
      const endTime = new Date(endDate).getTime();

      prices = historyData
        .filter(point => {
          const pointTime = new Date(point.date).getTime();
          return pointTime >= startTime && pointTime <= endTime;
        })
        .map(point => ({
          date: point.date,
          price: point.price
        }));

      dataSource = 'proxy';
      console.log(`✅ 代理服务成功获取 ${prices.length} 个数据点`);
    } catch (error) {
      console.log('❌ 代理服务失败，使用模拟数据:', error);
      prices = this.getMockBitcoinHistory(startDate, endDate);
      dataSource = 'mock';
    }

    const result: BitcoinHistoryData = {
      prices,
      startDate,
      endDate,
      dataSource
    };

    this.setCachedData(cacheKey, result, 24);
    return result;
  }

  /**
   * 生成模拟的比特币历史数据
   * 基于真实的历史趋势和研究报告中的数据
   */
  private getMockBitcoinHistory(startDate: string, endDate: string): BitcoinHistoryPoint[] {
    const prices: BitcoinHistoryPoint[] = [];
    
    // 基于真实历史数据的关键价格点
    const keyPrices = [
      { date: '2011-01-01', price: 0.30 },
      { date: '2011-06-01', price: 10.00 },
      { date: '2011-12-01', price: 3.00 },
      { date: '2012-01-01', price: 5.00 },
      { date: '2012-12-01', price: 13.00 },
      { date: '2013-01-01', price: 13.00 },
      { date: '2013-04-01', price: 100.00 },
      { date: '2013-12-01', price: 800.00 },
      { date: '2014-01-01', price: 650.00 },
      { date: '2014-12-01', price: 320.00 },
      { date: '2015-01-01', price: 315.00 },
      { date: '2015-12-01', price: 430.00 },
      { date: '2016-01-01', price: 430.00 },
      { date: '2016-12-01', price: 950.00 },
      { date: '2017-01-01', price: 1000.00 },
      { date: '2017-12-01', price: 19000.00 },
      { date: '2018-01-01', price: 14000.00 },
      { date: '2018-12-01', price: 3200.00 },
      { date: '2019-01-01', price: 3700.00 },
      { date: '2019-12-01', price: 7200.00 },
      { date: '2020-01-01', price: 7200.00 },
      { date: '2020-12-31', price: 29000.00 }
    ];

    // 生成月度数据点
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = new Date(start); date <= end; date.setMonth(date.getMonth() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      
      // 找到最近的关键价格点进行插值
      let price = this.interpolatePrice(dateStr, keyPrices);
      
      // 添加一些随机波动 (±10%)
      const volatility = 0.1;
      const randomFactor = 1 + (Math.random() - 0.5) * volatility;
      price *= randomFactor;
      
      prices.push({
        date: dateStr,
        price: Math.max(0.01, price) // 确保价格不为负
      });
    }

    return prices.sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * 在关键价格点之间进行插值
   */
  private interpolatePrice(targetDate: string, keyPrices: Array<{date: string, price: number}>): number {
    const target = new Date(targetDate);
    
    // 找到目标日期前后的价格点
    let beforePrice = keyPrices[0];
    let afterPrice = keyPrices[keyPrices.length - 1];
    
    for (let i = 0; i < keyPrices.length - 1; i++) {
      const current = new Date(keyPrices[i].date);
      const next = new Date(keyPrices[i + 1].date);
      
      if (target >= current && target <= next) {
        beforePrice = keyPrices[i];
        afterPrice = keyPrices[i + 1];
        break;
      }
    }
    
    // 线性插值
    const beforeDate = new Date(beforePrice.date);
    const afterDate = new Date(afterPrice.date);
    const totalDays = (afterDate.getTime() - beforeDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed = (target.getTime() - beforeDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (totalDays === 0) return beforePrice.price;
    
    const ratio = daysPassed / totalDays;
    
    // 对数插值（更适合价格数据）
    const logBefore = Math.log(beforePrice.price);
    const logAfter = Math.log(afterPrice.price);
    const logInterpolated = logBefore + (logAfter - logBefore) * ratio;
    
    return Math.exp(logInterpolated);
  }

  /**
   * 获取当前价格（从Binance，因为测试显示它可用）
   */
  async getCurrentPrice(): Promise<number> {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
      if (!response.ok) {
        throw new Error(`Binance API错误: ${response.status}`);
      }
      
      const data = await response.json();
      return parseFloat(data.price);
    } catch (error) {
      console.error('获取当前价格失败:', error);
      return 105000; // 返回一个合理的默认值
    }
  }
}

// 导出单例
export const bitcoinHistoryService = new BitcoinHistoryService();

// 导出格式化函数
export const formatBitcoinPrice = (price: number): string => {
  if (price < 1) {
    return `$${price.toFixed(4)}`;
  } else if (price < 1000) {
    return `$${price.toFixed(2)}`;
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
};
