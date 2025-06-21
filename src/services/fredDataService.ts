/**
 * FRED (Federal Reserve Economic Data) API服务
 * 通过代理服务获取美国经济数据，包括通胀率、M2货币供应量等
 */

import { proxyDataService } from './proxyDataService';

export interface FREDDataPoint {
  date: string;
  value: number;
}

export interface FREDResponse {
  observations: Array<{
    date: string;
    value: string;
  }>;
}

export interface EconomicData {
  cpi: FREDDataPoint[];           // 消费者价格指数
  m2MoneySupply: FREDDataPoint[]; // M2货币供应量
  inflationRate: FREDDataPoint[]; // 通胀率
  purchasingPower: FREDDataPoint[]; // 购买力指数
}

class FREDDataService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  constructor() {
    console.log('🏦 FRED数据服务已初始化（使用代理模式）');
  }

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
   * 获取FRED数据系列
   */
  private async getFREDSeries(
    seriesId: string, 
    startDate: string = '2011-01-01', 
    endDate: string = '2020-12-31'
  ): Promise<FREDDataPoint[]> {
    const cacheKey = `fred-${seriesId}-${startDate}-${endDate}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // 目前只支持M2数据通过代理服务
      if (seriesId === 'M2SL') {
        console.log('🏦 通过代理获取M2货币供应量数据...');
        const m2Data = await proxyDataService.fetchM2Data(startDate, endDate);
        this.setCachedData(cacheKey, m2Data, 24);
        console.log(`✅ 成功获取 ${m2Data.length} 个M2数据点`);
        return m2Data;
      } else {
        // 其他数据系列使用模拟数据
        console.log(`⚠️ ${seriesId} 数据暂不支持，使用模拟数据`);
        const mockData = this.getMockDataForSeries(seriesId, startDate, endDate);
        this.setCachedData(cacheKey, mockData, 24);
        return mockData;
      }

    } catch (error) {
      console.error(`获取FRED数据失败 (${seriesId}):`, error);
      // 返回模拟数据作为备用
      const mockData = this.getMockDataForSeries(seriesId, startDate, endDate);
      this.setCachedData(cacheKey, mockData, 24);
      return mockData;
    }
  }

  /**
   * 获取模拟数据
   */
  private getMockDataForSeries(seriesId: string, startDate: string, endDate: string): FREDDataPoint[] {
    const mockData = this.getMockEconomicData();

    switch (seriesId) {
      case 'CPIAUCSL':
        return mockData.cpi;
      case 'M2SL':
        return mockData.m2MoneySupply;
      default:
        // 生成基本的模拟数据
        const start = new Date(startDate);
        const end = new Date(endDate);
        const data: FREDDataPoint[] = [];

        for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
          data.push({
            date: d.toISOString().split('T')[0],
            value: 100 + Math.random() * 50
          });
        }

        return data;
    }
  }

  /**
   * 获取消费者价格指数 (CPI)
   */
  async getCPI(startDate?: string, endDate?: string): Promise<FREDDataPoint[]> {
    return this.getFREDSeries('CPIAUCSL', startDate, endDate);
  }

  /**
   * 获取M2货币供应量
   */
  async getM2MoneySupply(startDate?: string, endDate?: string): Promise<FREDDataPoint[]> {
    try {
      console.log('🏦 通过代理获取M2货币供应量数据...');

      const m2Data = await proxyDataService.fetchM2Data(startDate, endDate);

      console.log(`✅ 成功获取 ${m2Data.length} 个M2数据点`);
      return m2Data;

    } catch (error) {
      console.error('❌ 获取M2数据失败，使用模拟数据:', error);
      // 如果代理服务失败，返回模拟数据
      return this.getMockM2Data(startDate, endDate);
    }
  }

  /**
   * 获取模拟M2数据
   */
  private getMockM2Data(startDate?: string, endDate?: string): FREDDataPoint[] {
    const mockData = this.getMockEconomicData();
    return mockData.m2MoneySupply;
  }

  /**
   * 计算通胀率 (基于CPI)
   */
  async getInflationRate(startDate?: string, endDate?: string): Promise<FREDDataPoint[]> {
    const cpi = await this.getCPI(startDate, endDate);
    
    const inflationRate: FREDDataPoint[] = [];
    for (let i = 12; i < cpi.length; i++) {
      const currentCPI = cpi[i].value;
      const previousYearCPI = cpi[i - 12].value;
      const inflation = ((currentCPI - previousYearCPI) / previousYearCPI) * 100;
      
      inflationRate.push({
        date: cpi[i].date,
        value: inflation
      });
    }
    
    return inflationRate;
  }

  /**
   * 计算美元购买力指数 (以2011年为基准100)
   */
  async getPurchasingPowerIndex(startDate?: string, endDate?: string): Promise<FREDDataPoint[]> {
    const cpi = await this.getCPI(startDate, endDate);
    
    if (cpi.length === 0) return [];
    
    // 以第一个数据点为基准 (2011年 = 100)
    const baseCPI = cpi[0].value;
    
    return cpi.map(point => ({
      date: point.date,
      value: (baseCPI / point.value) * 100 // 购买力与CPI成反比
    }));
  }

  /**
   * 获取完整的经济数据
   */
  async getEconomicData(
    startDate: string = '2011-01-01',
    endDate?: string
  ): Promise<EconomicData> {
    // 如果没有提供结束日期，使用当前日期
    if (!endDate) {
      const currentDate = new Date();
      endDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-01`;
    }
    try {
      const [cpi, m2MoneySupply, inflationRate, purchasingPower] = await Promise.all([
        this.getCPI(startDate, endDate),
        this.getM2MoneySupply(startDate, endDate),
        this.getInflationRate(startDate, endDate),
        this.getPurchasingPowerIndex(startDate, endDate)
      ]);

      return {
        cpi,
        m2MoneySupply,
        inflationRate,
        purchasingPower
      };
    } catch (error) {
      console.error('获取经济数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取模拟数据（当API不可用时）
   */
  getMockEconomicData(): EconomicData {
    // 基于研究报告的大致数据趋势
    const dates = [];
    const cpi = [];
    const m2MoneySupply = [];
    const purchasingPower = [];
    
    // 生成2011-2020年的月度数据
    for (let year = 2011; year <= 2020; year++) {
      for (let month = 1; month <= 12; month++) {
        const date = `${year}-${month.toString().padStart(2, '0')}-01`;
        dates.push(date);
        
        // 模拟CPI增长 (年均约2-3%)
        const yearsFromStart = year - 2011 + (month - 1) / 12;
        const baseCPI = 224.9; // 2011年基准
        const cpiValue = baseCPI * Math.pow(1.025, yearsFromStart);
        cpi.push({ date, value: cpiValue });
        
        // 模拟M2增长
        const baseM2 = 9600; // 2011年基准 (十亿美元)
        const m2Value = baseM2 * Math.pow(1.07, yearsFromStart);
        m2MoneySupply.push({ date, value: m2Value });
        
        // 计算购买力 (与CPI成反比)
        const purchasingPowerValue = (baseCPI / cpiValue) * 100;
        purchasingPower.push({ date, value: purchasingPowerValue });
      }
    }
    
    // 计算通胀率
    const inflationRate = [];
    for (let i = 12; i < cpi.length; i++) {
      const currentCPI = cpi[i].value;
      const previousYearCPI = cpi[i - 12].value;
      const inflation = ((currentCPI - previousYearCPI) / previousYearCPI) * 100;
      
      inflationRate.push({
        date: cpi[i].date,
        value: inflation
      });
    }

    return {
      cpi,
      m2MoneySupply,
      inflationRate,
      purchasingPower
    };
  }
}

// 创建服务实例（使用代理模式）
export const fredDataService = new FREDDataService();

// 导出格式化函数
export const formatEconomicValue = (value: number, type: 'currency' | 'percentage' | 'index' = 'index'): string => {
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'index':
    default:
      return value.toFixed(1);
  }
};
