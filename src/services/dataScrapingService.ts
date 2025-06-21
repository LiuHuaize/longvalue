/**
 * 数据爬取服务
 * 通过代理服务获取真实的M2增长率和比特币价格数据
 */

import { proxyDataService } from './proxyDataService';

interface M2DataPoint {
  date: string;
  value: number;
}

interface BitcoinPricePoint {
  date: string;
  price: number;
}

interface ScrapedData {
  m2Data: M2DataPoint[];
  bitcoinData: BitcoinPricePoint[];
  lastUpdated: string;
}

export class DataScrapingService {
  constructor() {
    console.log('🔧 数据爬取服务已初始化（使用代理模式）');
  }

  /**
   * 获取美国M2货币供应量数据
   */
  async fetchM2Data(): Promise<M2DataPoint[]> {
    try {
      const startDate = '2012-01-01';
      const endDate = new Date().toISOString().split('T')[0];

      console.log('🔍 通过代理获取M2数据中...');

      // 使用代理服务获取原始M2数据
      const rawM2Data = await proxyDataService.fetchM2Data(startDate, endDate);

      // 计算年同比增长率
      const m2Data: M2DataPoint[] = [];

      for (let i = 12; i < rawM2Data.length; i++) {
        const current = rawM2Data[i].value;
        const yearAgo = rawM2Data[i - 12].value;

        if (current && yearAgo) {
          const growthRate = ((current - yearAgo) / yearAgo) * 100;
          m2Data.push({
            date: rawM2Data[i].date,
            value: growthRate
          });
        }
      }

      console.log(`✅ 获取到 ${m2Data.length} 个M2增长率数据点`);
      return m2Data;

    } catch (error) {
      console.error('❌ 获取M2数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取比特币历史价格数据
   */
  async fetchBitcoinData(): Promise<BitcoinPricePoint[]> {
    try {
      console.log('🔍 通过代理获取比特币价格数据中...');

      // 使用代理服务获取历史数据
      const rawBitcoinData = await proxyDataService.fetchBitcoinHistory('max');

      // 处理数据，按月采样
      const bitcoinData: BitcoinPricePoint[] = [];

      // 按月分组并取每月的平均价格
      const monthlyPrices: { [key: string]: number[] } = {};

      rawBitcoinData.forEach(point => {
        const date = new Date(point.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyPrices[monthKey]) {
          monthlyPrices[monthKey] = [];
        }
        monthlyPrices[monthKey].push(point.price);
      });

      // 计算每月平均价格
      Object.keys(monthlyPrices).forEach(monthKey => {
        const prices = monthlyPrices[monthKey];
        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

        bitcoinData.push({
          date: `${monthKey}-01`,
          price: Math.round(avgPrice)
        });
      });

      // 按日期排序
      bitcoinData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      console.log(`✅ 获取到 ${bitcoinData.length} 个比特币价格数据点`);
      return bitcoinData;

    } catch (error) {
      console.error('❌ 获取比特币数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取当前比特币价格
   */
  async fetchCurrentBitcoinPrice(): Promise<number> {
    try {
      console.log('₿ 通过代理获取当前比特币价格...');

      const priceData = await proxyDataService.fetchCurrentBitcoinPrice();

      console.log('✅ 成功获取当前比特币价格');
      return priceData.usd;

    } catch (error) {
      console.error('❌ 获取当前比特币价格失败:', error);
      throw error;
    }
  }

  /**
   * 合并M2和比特币数据
   */
  private mergeData(m2Data: M2DataPoint[], bitcoinData: BitcoinPricePoint[]): any[] {
    const mergedData: any[] = [];
    
    // 创建比特币价格查找表
    const bitcoinLookup: { [key: string]: number } = {};
    bitcoinData.forEach(point => {
      const monthKey = point.date.substring(0, 7); // YYYY-MM
      bitcoinLookup[monthKey] = point.price;
    });
    
    // 合并数据
    m2Data.forEach(m2Point => {
      const monthKey = m2Point.date.substring(0, 7);
      const bitcoinPrice = bitcoinLookup[monthKey];
      
      if (bitcoinPrice) {
        mergedData.push({
          date: m2Point.date,
          m2: m2Point.value,
          bitcoin: bitcoinPrice
        });
      }
    });
    
    return mergedData;
  }

  /**
   * 获取完整的实时数据
   */
  async fetchRealTimeData(): Promise<ScrapedData> {
    try {
      console.log('🚀 开始获取实时数据...');
      
      const [m2Data, bitcoinData] = await Promise.all([
        this.fetchM2Data(),
        this.fetchBitcoinData()
      ]);
      
      const scrapedData: ScrapedData = {
        m2Data,
        bitcoinData,
        lastUpdated: new Date().toISOString()
      };
      
      console.log('✅ 实时数据获取完成');
      return scrapedData;
      
    } catch (error) {
      console.error('❌ 获取实时数据失败:', error);
      throw error;
    }
  }

  /**
   * 生成图表数据格式
   */
  async generateChartData(): Promise<any[]> {
    try {
      const scrapedData = await this.fetchRealTimeData();
      const mergedData = this.mergeData(scrapedData.m2Data, scrapedData.bitcoinData);
      
      console.log(`📊 生成了 ${mergedData.length} 个图表数据点`);
      return mergedData;
      
    } catch (error) {
      console.error('❌ 生成图表数据失败:', error);
      throw error;
    }
  }
}

export default DataScrapingService;
