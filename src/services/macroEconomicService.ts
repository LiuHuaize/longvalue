// 宏观经济数据服务 - 获取FRED API数据
export interface MacroEconomicData {
  m2MoneySupply: {
    value: number;
    date: string;
    unit: string;
  };
  inflationRate: {
    value: number;
    date: string;
    unit: string;
  };
  dollarPPP: {
    value: number;
    date: string;
    unit: string;
  };
  gdp: {
    value: number;
    date: string;
    unit: string;
  };
}

export interface HistoricalData {
  date: string;
  value: number;
}

export interface ChartData {
  bitcoinVsM2: {
    bitcoin: HistoricalData[];
    m2: HistoricalData[];
  };
  dollarPPPvsBitcoin: {
    dollarPPP: HistoricalData[];
    bitcoin: HistoricalData[];
  };
  bitcoinSupplyVsInflation: {
    bitcoinSupply: HistoricalData[];
    inflation: HistoricalData[];
  };
  bitcoinVsUSM2: {
    bitcoin: HistoricalData[];
    usM2: HistoricalData[];
  };
}

class MacroEconomicService {
  private fredApiKey = '32c5c13c39b5985adc5af6a18fdd181c';
  private fredBaseUrl = 'https://api.stlouisfed.org/fred';
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
   * 获取FRED数据的通用方法
   */
  private async getFredData(seriesId: string, limit: number = 100): Promise<any> {
    const cacheKey = `fred-${seriesId}-${limit}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const url = `${this.fredBaseUrl}/series/observations?series_id=${seriesId}&api_key=${this.fredApiKey}&file_type=json&limit=${limit}&sort_order=desc`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`FRED API错误: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.observations || data.observations.length === 0) {
        throw new Error(`没有找到${seriesId}的数据`);
      }

      this.setCachedData(cacheKey, data, 24); // 缓存24小时
      return data;
    } catch (error) {
      console.error(`获取${seriesId}数据失败:`, error);
      throw error;
    }
  }

  /**
   * 获取美国M2货币供应量数据
   */
  async getM2MoneySupply(): Promise<{ value: number; date: string; unit: string }> {
    try {
      const data = await this.getFredData('M2SL', 1);
      const latest = data.observations[0];
      
      return {
        value: parseFloat(latest.value),
        date: latest.date,
        unit: 'Billions of Dollars'
      };
    } catch (error) {
      console.error('获取M2数据失败:', error);
      // 返回模拟数据
      return {
        value: 21862.5,
        date: '2024-12-01',
        unit: 'Billions of Dollars'
      };
    }
  }

  /**
   * 获取通胀率数据 (CPI)
   */
  async getInflationRate(): Promise<{ value: number; date: string; unit: string }> {
    try {
      const data = await this.getFredData('CPIAUCSL', 1);
      const latest = data.observations[0];
      
      return {
        value: parseFloat(latest.value),
        date: latest.date,
        unit: 'Index 1982-1984=100'
      };
    } catch (error) {
      console.error('获取通胀率数据失败:', error);
      return {
        value: 320.321,
        date: '2024-12-01',
        unit: 'Index 1982-1984=100'
      };
    }
  }

  /**
   * 获取美元购买力平价数据
   */
  async getDollarPPP(): Promise<{ value: number; date: string; unit: string }> {
    try {
      const data = await this.getFredData('PPIFGS', 1);
      const latest = data.observations[0];
      
      return {
        value: parseFloat(latest.value),
        date: latest.date,
        unit: 'Index Dec 2009=100'
      };
    } catch (error) {
      console.error('获取购买力数据失败:', error);
      return {
        value: 191.2,
        date: '2024-12-01',
        unit: 'Index Dec 2009=100'
      };
    }
  }

  /**
   * 获取GDP数据
   */
  async getGDP(): Promise<{ value: number; date: string; unit: string }> {
    try {
      const data = await this.getFredData('GDP', 1);
      const latest = data.observations[0];
      
      return {
        value: parseFloat(latest.value),
        date: latest.date,
        unit: 'Billions of Dollars'
      };
    } catch (error) {
      console.error('获取GDP数据失败:', error);
      return {
        value: 29976.638,
        date: '2024-10-01',
        unit: 'Billions of Dollars'
      };
    }
  }

  /**
   * 获取历史M2数据（用于图表）
   */
  async getHistoricalM2(years: number = 5): Promise<HistoricalData[]> {
    try {
      const limit = years * 12; // 月度数据
      const data = await this.getFredData('M2SL', limit);
      
      return data.observations
        .filter((obs: any) => obs.value !== '.')
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value)
        }))
        .reverse(); // 按时间正序排列
    } catch (error) {
      console.error('获取历史M2数据失败:', error);
      return [];
    }
  }

  /**
   * 获取历史通胀数据（用于图表）
   */
  async getHistoricalInflation(years: number = 5): Promise<HistoricalData[]> {
    try {
      const limit = years * 12; // 月度数据
      const data = await this.getFredData('CPIAUCSL', limit);
      
      return data.observations
        .filter((obs: any) => obs.value !== '.')
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value)
        }))
        .reverse();
    } catch (error) {
      console.error('获取历史通胀数据失败:', error);
      return [];
    }
  }

  /**
   * 获取所有宏观经济数据
   */
  async getAllMacroData(): Promise<MacroEconomicData> {
    const [m2, inflation, dollarPPP, gdp] = await Promise.all([
      this.getM2MoneySupply(),
      this.getInflationRate(),
      this.getDollarPPP(),
      this.getGDP()
    ]);

    return {
      m2MoneySupply: m2,
      inflationRate: inflation,
      dollarPPP: dollarPPP,
      gdp: gdp
    };
  }

  /**
   * 计算比特币供应量（基于区块高度的算法）
   */
  calculateBitcoinSupply(blockHeight?: number): number {
    // 如果没有提供区块高度，使用当前估算值
    if (!blockHeight) {
      // 大约每10分钟一个区块，从2009年开始
      const startDate = new Date('2009-01-03');
      const now = new Date();
      const minutesPassed = (now.getTime() - startDate.getTime()) / (1000 * 60);
      blockHeight = Math.floor(minutesPassed / 10);
    }

    let totalSupply = 0;
    let currentReward = 50; // 初始奖励
    let blocksProcessed = 0;

    while (blocksProcessed < blockHeight) {
      const blocksUntilHalving = 210000 - (blocksProcessed % 210000);
      const blocksToProcess = Math.min(blocksUntilHalving, blockHeight - blocksProcessed);
      
      totalSupply += blocksToProcess * currentReward;
      blocksProcessed += blocksToProcess;
      
      if (blocksProcessed % 210000 === 0 && blocksProcessed < blockHeight) {
        currentReward /= 2;
      }
    }

    return totalSupply;
  }
}

// 导出单例
export const macroEconomicService = new MacroEconomicService();

// 导出格式化函数
export const formatBillions = (value: number): string => {
  return `$${(value / 1000).toFixed(1)}T`;
};

export const formatIndex = (value: number): string => {
  return value.toFixed(1);
};
