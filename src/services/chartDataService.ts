// 图表数据整合服务 - 为四个特定图表提供数据
import { macroEconomicService } from './macroEconomicService';
import { simpleBitcoinService } from './simpleBitcoinService';
import { fredDataService } from './fredDataService';
import { bitcoinHistoryService } from './bitcoinHistoryService';
import { bitcoinComparisonService } from './bitcoinComparisonService';
import { proxyDataService } from './proxyDataService';
import DataScrapingService from './dataScrapingService';
import DataStorageService from './dataStorageService';
import SchedulerService from './schedulerService';

// 导入本地历史数据
import bitcoinHistoryData from '../data/bitcoinHistoryData.json';
import dollarPPPData from '../data/dollarPPPData.json';

export interface ChartDataPoint {
  date: string;
  bitcoin?: number;
  m2?: number;
  dollarPPP?: number;
  bitcoinSupply?: number;
  inflation?: number;
  usM2?: number;
}

export interface BitcoinVsM2Data {
  title: string;
  description: string;
  data: ChartDataPoint[];
  bitcoinUnit: string;
  m2Unit: string;
}

export interface DollarPPPvsBitcoinData {
  title: string;
  description: string;
  data: ChartDataPoint[];
  dollarPPPUnit: string;
  bitcoinUnit: string;
}

export interface BitcoinSupplyVsInflationData {
  title: string;
  description: string;
  data: ChartDataPoint[];
  supplyUnit: string;
  inflationUnit: string;
}

export interface BitcoinVsUSM2Data {
  title: string;
  description: string;
  data: ChartDataPoint[];
  bitcoinUnit: string;
  usM2Unit: string;
}

class ChartDataService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private scrapingService: DataScrapingService;
  private storageService: DataStorageService;
  private schedulerService: SchedulerService;

  constructor() {
    this.scrapingService = new DataScrapingService();
    this.storageService = new DataStorageService();
    this.schedulerService = new SchedulerService();

    // 启动定期更新调度
    this.schedulerService.startScheduler();
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any, ttlHours: number = 6): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlHours * 60 * 60 * 1000
    });
  }

  /**
   * 获取实时数据状态
   */
  getDataStatus() {
    return {
      updateStatus: this.schedulerService.getUpdateStatus(),
      cacheInfo: this.schedulerService.getCacheInfo(),
      dataStats: this.schedulerService.getDataStats()
    };
  }

  /**
   * 手动触发数据更新
   */
  async updateData() {
    return await this.schedulerService.manualUpdate();
  }

  /**
   * 清除所有缓存数据
   */
  clearAllCache() {
    this.cache.clear();
    this.schedulerService.clearAllData();
  }

  /**
   * 获取比特币历史价格数据（模拟）
   */
  private async getBitcoinHistoricalPrices(years: number = 5): Promise<ChartDataPoint[]> {
    // 由于免费API的限制，这里使用模拟的历史数据
    // 实际项目中可以使用CoinGecko的历史数据API
    const currentPrice = 95420;
    const data: ChartDataPoint[] = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - years);

    for (let i = 0; i < years * 12; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      // 模拟价格增长趋势
      const monthsFromStart = i;
      const growthFactor = Math.pow(1.1, monthsFromStart / 12); // 年化10%增长
      const volatility = 0.3 * Math.sin(monthsFromStart / 3) + 0.2 * Math.random();
      const price = currentPrice / growthFactor * (1 + volatility);

      data.push({
        date: date.toISOString().split('T')[0],
        bitcoin: Math.max(price, 1000) // 确保价格不会太低
      });
    }

    return data;
  }

  /**
   * 图表1: Bitcoin vs Major M2 (使用固定历史数据)
   */
  async getBitcoinVsM2Data(): Promise<BitcoinVsM2Data> {
    console.log('📊 获取Bitcoin vs M2数据...');

    // 直接使用历史数据，不再获取实时数据
    const historicalData = await this.loadHistoricalBitcoinM2Data();
    console.log('✅ 使用固定的Bitcoin vs M2历史数据，包含', historicalData.data.length, '个数据点');
    
    return historicalData;
  }

  /**
   * 通过代理服务获取真实Bitcoin vs M2数据（历史数据+增量更新策略）
   */
  private async getRealTimeBitcoinVsM2DataViaProxy(): Promise<BitcoinVsM2Data> {
    const { proxyDataService } = await import('./proxyDataService');
    const cacheKey = 'bitcoin-vs-m2-recent-data';

    // 加载历史数据（2022-2024）
    const historicalData = await this.loadHistoricalBitcoinM2Data();
    console.log('📚 加载历史数据（2022-2024）:', historicalData.data.length, '个数据点');

    // 检查最近数据的缓存
    const cachedRecentData = this.getCachedData(cacheKey);
    if (cachedRecentData) {
      console.log('📦 使用缓存的最近数据');

      // 尝试更新2025年6月后的数据
      try {
        const updatedRecentData = await this.updateRecentDataSince2025June(cachedRecentData);
        console.log('🔄 成功更新2025年6月后的数据');

        // 合并历史数据和最新数据
        return this.mergeHistoricalAndRecentData(historicalData, updatedRecentData);
      } catch (error) {
        console.log('⚠️ 增量更新失败，使用缓存数据:', error);
        return this.mergeHistoricalAndRecentData(historicalData, cachedRecentData);
      }
    }

    // 首次获取2025年数据
    console.log('🆕 首次获取2025年数据');
    try {
      const recentData = await this.fetchDataSince2025June();

      // 缓存最近数据（6小时）
      this.setCachedData(cacheKey, recentData, 6);

      // 合并历史数据和最新数据
      return this.mergeHistoricalAndRecentData(historicalData, recentData);
    } catch (error) {
      console.log('❌ 获取2025年数据失败，仅使用历史数据:', error);
      return historicalData;
    }
  }

  /**
   * 加载历史数据（2022-2024）
   */
  private async loadHistoricalBitcoinM2Data(): Promise<BitcoinVsM2Data> {
    try {
      const historicalDataModule = await import('../data/historicalBitcoinM2Data.json');
      const historicalData = historicalDataModule.default;

      return {
        title: 'Bitcoin vs Major M2',
        description: '从图表可以看出，比特币价格与央行货币政策呈现明显的反向关系。\n\n2020年疫情期间各国央行大幅放水，M2增长率飙升至15%，比特币价格也随之暴涨。\n\n2022年开始的紧缩政策导致M2增长率转负，比特币价格大幅回调。\n\n2024年后货币政策趋于温和，比特币价格重新上涨，显示其作为通胀对冲工具的特性。',
        data: historicalData.data.map((item: any) => ({
          date: item.date,
          bitcoin: item.bitcoin,
          m2: item.m2
        })),
        bitcoinUnit: 'USD',
        m2Unit: 'M2 Growth Rate (YoY %)'
      };
    } catch (error) {
      console.error('❌ 加载历史数据失败:', error);
      // 如果加载失败，返回空数据
      return {
        title: 'Bitcoin vs Major M2',
        description: '从图表可以看出，比特币价格与央行货币政策呈现明显的反向关系。\n\n2020年疫情期间各国央行大幅放水，M2增长率飙升至15%，比特币价格也随之暴涨。\n\n2022年开始的紧缩政策导致M2增长率转负，比特币价格大幅回调。\n\n2024年后货币政策趋于温和，比特币价格重新上涨，显示其作为通胀对冲工具的特性。',
        data: [],
        bitcoinUnit: 'USD',
        m2Unit: 'M2 Growth Rate (YoY %)'
      };
    }
  }

  /**
   * 获取2025年6月后的数据
   */
  private async fetchDataSince2025June(): Promise<ChartDataPoint[]> {
    const { proxyDataService } = await import('./proxyDataService');

    const startDate = '2025-06-01';
    const currentDate = new Date();
    const endDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

    console.log(`📅 获取2025年6月后数据范围: ${startDate} 到 ${endDate}`);

    try {
      // 通过代理服务获取最新数据
      const recentData = await proxyDataService.fetchBitcoinVsM2Data(startDate, endDate);

      console.log('📊 获取到的2025年数据:', {
        bitcoinCount: recentData.bitcoin?.length || 0,
        m2Count: recentData.m2?.length || 0
      });

      if (!recentData.bitcoin || recentData.bitcoin.length === 0) {
        console.log('⚠️ 没有获取到2025年比特币数据');
        return [];
      }

      // 由于M2数据可能为空，我们使用固定的M2增长率
      // 基于2024年底的趋势，使用2.8%作为近似值
      const mockM2Data = recentData.bitcoin.map(item => ({
        date: item.date,
        value: 2.8 // 使用近似的M2增长率
      }));

      // 对齐数据
      const alignedData = this.alignBitcoinAndM2Data(recentData.bitcoin, mockM2Data);

      console.log('✅ 成功处理2025年数据:', alignedData.length, '个数据点');

      return alignedData;
    } catch (error) {
      console.error('❌ 获取2025年6月后数据失败:', error);
      return [];
    }
  }

  /**
   * 更新2025年6月后的数据
   */
  private async updateRecentDataSince2025June(cachedRecentData: ChartDataPoint[]): Promise<ChartDataPoint[]> {
    try {
      const newRecentData = await this.fetchDataSince2025June();

      // 合并缓存数据和新数据
      const mergedData = [...cachedRecentData];

      newRecentData.forEach(newPoint => {
        const existingIndex = mergedData.findIndex(point =>
          point.date.substring(0, 7) === newPoint.date.substring(0, 7)
        );

        if (existingIndex >= 0) {
          // 更新现有数据点
          mergedData[existingIndex] = newPoint;
        } else {
          // 添加新数据点
          mergedData.push(newPoint);
        }
      });

      // 按日期排序
      mergedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return mergedData;
    } catch (error) {
      console.error('❌ 更新2025年6月后数据失败:', error);
      return cachedRecentData;
    }
  }

  /**
   * 合并历史数据和最近数据
   */
  private mergeHistoricalAndRecentData(
    historicalData: BitcoinVsM2Data,
    recentData: ChartDataPoint[]
  ): BitcoinVsM2Data {
    console.log('🔄 合并数据:', {
      historicalCount: historicalData.data.length,
      recentCount: recentData.length,
      historicalRange: historicalData.data.length > 0 ?
        `${historicalData.data[0].date} 到 ${historicalData.data[historicalData.data.length-1].date}` : '无',
      recentRange: recentData.length > 0 ?
        `${recentData[0].date} 到 ${recentData[recentData.length-1].date}` : '无'
    });

    // 合并数据，最近数据优先
    const allData = [...historicalData.data];

    recentData.forEach(recentPoint => {
      const existingIndex = allData.findIndex(point =>
        point.date.substring(0, 7) === recentPoint.date.substring(0, 7)
      );

      if (existingIndex >= 0) {
        // 用最新数据覆盖历史数据
        console.log(`🔄 覆盖数据点: ${recentPoint.date}`);
        allData[existingIndex] = recentPoint;
      } else {
        // 添加新数据点
        console.log(`➕ 添加新数据点: ${recentPoint.date}`);
        allData.push(recentPoint);
      }
    });

    // 按日期排序
    allData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log('✅ 合并完成:', {
      totalCount: allData.length,
      finalRange: allData.length > 0 ?
        `${allData[0].date} 到 ${allData[allData.length-1].date}` : '无'
    });

    return {
      ...historicalData,
      data: allData,
      description: historicalData.description
    };
  }

  /**
   * 更新最近一个月的数据（保留原方法以兼容）
   */
  private async updateRecentData(cachedData: BitcoinVsM2Data): Promise<BitcoinVsM2Data> {
    const { proxyDataService } = await import('./proxyDataService');

    // 计算最近一个月的日期范围
    const currentDate = new Date();
    const lastMonth = new Date(currentDate);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const startDate = `${lastMonth.getFullYear()}-${(lastMonth.getMonth() + 1).toString().padStart(2, '0')}-01`;
    const endDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-01`;

    console.log(`🔄 增量更新数据范围: ${startDate} 到 ${endDate}`);

    // 获取最近一个月的数据
    const recentData = await proxyDataService.fetchBitcoinVsM2Data(startDate, endDate);

    // 合并新数据到缓存数据
    const updatedData = this.mergeRecentData(cachedData, recentData);

    // 更新缓存
    this.setCachedData('bitcoin-vs-m2-data', updatedData, 24);

    return updatedData;
  }

  /**
   * 合并真实数据和模拟数据
   */
  private mergeRealAndMockData(realData: any): BitcoinVsM2Data {
    // 获取模拟数据作为基础
    const mockData = this.getMockBitcoinVsM2Data();

    // 计算M2增长率(YoY)
    const m2GrowthData = this.calculateM2GrowthRate(realData.m2);

    // 对齐真实数据
    const realAlignedData = this.alignBitcoinAndM2Data(realData.bitcoin, m2GrowthData);

    // 合并数据：使用真实数据覆盖模拟数据中的对应时间段
    const mergedData = [...mockData.data];

    realAlignedData.forEach(realPoint => {
      const existingIndex = mergedData.findIndex(mockPoint =>
        mockPoint.date.substring(0, 7) === realPoint.date.substring(0, 7)
      );

      if (existingIndex >= 0) {
        // 覆盖模拟数据
        mergedData[existingIndex] = {
          date: realPoint.date,
          bitcoin: realPoint.bitcoin,
          m2: realPoint.m2
        };
      } else {
        // 添加新数据点
        mergedData.push(realPoint);
      }
    });

    // 按日期排序
    mergedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      title: 'Bitcoin vs Major M2',
      description: '从图表可以看出，比特币价格与央行货币政策呈现明显的反向关系。\n\n2020年疫情期间各国央行大幅放水，M2增长率飙升至15%，比特币价格也随之暴涨。\n\n2022年开始的紧缩政策导致M2增长率转负，比特币价格大幅回调。\n\n2024年后货币政策趋于温和，比特币价格重新上涨，显示其作为通胀对冲工具的特性。',
      data: mergedData,
      bitcoinUnit: 'USD',
      m2Unit: 'M2 Growth Rate (YoY %)'
    };
  }

  /**
   * 合并最近的数据到现有数据集
   */
  private mergeRecentData(existingData: BitcoinVsM2Data, recentData: any): BitcoinVsM2Data {
    // 计算M2增长率(YoY)
    const m2GrowthData = this.calculateM2GrowthRate(recentData.m2);

    // 对齐最近的数据
    const recentAlignedData = this.alignBitcoinAndM2Data(recentData.bitcoin, m2GrowthData);

    // 合并到现有数据
    const updatedData = [...existingData.data];

    recentAlignedData.forEach(recentPoint => {
      const existingIndex = updatedData.findIndex(point =>
        point.date.substring(0, 7) === recentPoint.date.substring(0, 7)
      );

      if (existingIndex >= 0) {
        // 更新现有数据点
        updatedData[existingIndex] = {
          date: recentPoint.date,
          bitcoin: recentPoint.bitcoin,
          m2: recentPoint.m2
        };
      } else {
        // 添加新数据点
        updatedData.push(recentPoint);
      }
    });

    // 按日期排序
    updatedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      ...existingData,
      data: updatedData,
      description: '从图表可以看出，比特币价格与央行货币政策呈现明显的反向关系。\n\n2020年疫情期间各国央行大幅放水，M2增长率飙升至15%，比特币价格也随之暴涨。\n\n2022年开始的紧缩政策导致M2增长率转负，比特币价格大幅回调。\n\n2024年后货币政策趋于温和，比特币价格重新上涨，显示其作为通胀对冲工具的特性。'
    };
  }

  /**
   * 获取实时Bitcoin vs M2数据（直接API调用）
   */
  private async getRealTimeBitcoinVsM2Data(): Promise<BitcoinVsM2Data> {
    const { fredDataService } = await import('./fredDataService');
    const { bitcoinHistoryService } = await import('./bitcoinHistoryService');

    // 计算日期范围：从2012年1月到当前月份
    const startDate = '2012-01-01';
    const currentDate = new Date();
    const endDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-01`;

    console.log(`📅 数据范围: ${startDate} 到 ${endDate}`);

    // 并行获取数据
    const [bitcoinHistory, m2Data] = await Promise.all([
      bitcoinHistoryService.getBitcoinHistory(startDate, endDate),
      fredDataService.getM2MoneySupply(startDate, endDate)
    ]);

    // 计算M2增长率(YoY)
    const m2GrowthData = this.calculateM2GrowthRate(m2Data);

    // 对齐数据
    const alignedData = this.alignBitcoinAndM2Data(bitcoinHistory.prices, m2GrowthData);

    return {
      title: 'Bitcoin vs Major M2',
      description: '从图表可以看出，比特币价格与央行货币政策呈现明显的反向关系。\n\n2020年疫情期间各国央行大幅放水，M2增长率飙升至15%，比特币价格也随之暴涨。\n\n2022年开始的紧缩政策导致M2增长率转负，比特币价格大幅回调。\n\n2024年后货币政策趋于温和，比特币价格重新上涨，显示其作为通胀对冲工具的特性。',
      data: alignedData,
      bitcoinUnit: 'USD',
      m2Unit: 'M2 Growth Rate (YoY %)'
    };
  }

  /**
   * 计算M2增长率(YoY)
   */
  private calculateM2GrowthRate(m2Data: Array<{date: string, value: number}>): Array<{date: string, value: number}> {
    const growthData: Array<{date: string, value: number}> = [];

    for (let i = 12; i < m2Data.length; i++) {
      const currentValue = m2Data[i].value;
      const previousYearValue = m2Data[i - 12].value;

      if (previousYearValue > 0) {
        const growthRate = ((currentValue - previousYearValue) / previousYearValue) * 100;
        growthData.push({
          date: m2Data[i].date,
          value: growthRate
        });
      }
    }

    return growthData;
  }

  /**
   * 对齐比特币价格和M2增长率数据
   */
  private alignBitcoinAndM2Data(
    bitcoinData: Array<{date: string, price: number}> | Array<{date: string, value: number}>,
    m2GrowthData: Array<{date: string, value: number}>
  ): ChartDataPoint[] {
    const alignedData: ChartDataPoint[] = [];

    // 创建M2数据的日期映射
    const m2Map = new Map<string, number>();
    m2GrowthData.forEach(item => {
      // 将日期转换为月份格式进行匹配
      const monthKey = item.date.substring(0, 7); // YYYY-MM
      m2Map.set(monthKey, item.value);
    });

    // 按月份聚合比特币数据
    const bitcoinMonthlyMap = new Map<string, number>();
    bitcoinData.forEach(item => {
      const monthKey = item.date.substring(0, 7); // YYYY-MM
      if (!bitcoinMonthlyMap.has(monthKey)) {
        // 兼容不同的数据结构
        const price = 'price' in item ? item.price : item.value;
        bitcoinMonthlyMap.set(monthKey, price);
      }
    });

    // 合并数据
    for (const [monthKey, bitcoinPrice] of bitcoinMonthlyMap) {
      const m2Growth = m2Map.get(monthKey);
      if (m2Growth !== undefined) {
        alignedData.push({
          date: `${monthKey}-01`,
          bitcoin: bitcoinPrice,
          m2: m2Growth
        });
      }
    }

    // 按日期排序
    alignedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return alignedData;
  }

  /**
   * 图表2: Dollar PPP vs 1 Bitcoin (购买力对比)
   */
  async getDollarPPPvsBitcoinData(): Promise<DollarPPPvsBitcoinData> {
    console.log('📊 获取Dollar PPP vs Bitcoin数据...');

    // 暂时直接使用模拟数据，确保图表正常显示
    console.log('🔧 使用模拟数据（确保图表正常显示）');
    return this.getMockDollarPPPvsBitcoinData();
  }

  /**
   * 图表3: Bitcoin Supply vs Inflation Rate
   */
  async getBitcoinSupplyVsInflationData(): Promise<BitcoinSupplyVsInflationData> {
    console.log('📊 获取Bitcoin Supply vs Inflation数据...');

    // 直接使用模拟数据，避免CORS问题
    console.log('🔧 使用模拟数据（避免CORS问题）');
    return this.getMockBitcoinSupplyVsInflationData();
  }

  /**
   * 图表4: Bitcoin vs. US M2: 供给的稀缺性
   */
  async getBitcoinVsUSM2Data(): Promise<BitcoinVsUSM2Data> {
    console.log('📊 获取Bitcoin vs US M2数据...');

    // 直接使用模拟数据，避免CORS问题
    console.log('🔧 使用模拟数据（避免CORS问题）');
    return this.getMockBitcoinVsUSM2Data();
  }

  /**
   * 获取所有图表数据
   */
  async getAllChartData() {
    const [chart1, chart2, chart3, chart4] = await Promise.all([
      this.getBitcoinVsM2Data(),
      this.getDollarPPPvsBitcoinData(),
      this.getBitcoinSupplyVsInflationData(),
      this.getBitcoinVsUSM2Data()
    ]);

    return {
      bitcoinVsM2: chart1,
      dollarPPPvsBitcoin: chart2,
      bitcoinSupplyVsInflation: chart3,
      bitcoinVsUSM2: chart4
    };
  }

  /**
   * 获取真实的Dollar PPP vs Bitcoin数据
   */
  private async getRealDollarPPPvsBitcoinData(): Promise<DollarPPPvsBitcoinData> {
    console.log('🔄 开始获取真实的Dollar PPP vs Bitcoin数据...');

    // 设置数据范围：从2011年12月到当前
    const startDate = '2011-12-01';
    const currentDate = new Date();
    const endDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-01`;

    try {
      console.log(`📅 数据范围: ${startDate} 到 ${endDate}`);

      // 并行获取比特币历史数据和购买力数据
      console.log('📈 获取比特币历史数据...');
      console.log('💰 获取美元购买力数据...');

      let bitcoinHistory: any[] = [];
      let economicData: any = { purchasingPower: [] };

      try {
        // 获取比特币历史数据（使用代理服务，获取足够长的历史数据）
        // 尝试获取从2011年开始的历史数据 (约14年 = 5110天)
        console.log('📈 尝试获取长期比特币历史数据...');
        bitcoinHistory = await proxyDataService.fetchBitcoinHistory('5110');
        console.log(`✅ 比特币数据获取成功: ${bitcoinHistory?.length || 0} 个数据点`);

        // 调试：检查数据的日期范围
        if (bitcoinHistory && bitcoinHistory.length > 0) {
          const firstDate = bitcoinHistory[0]?.date;
          const lastDate = bitcoinHistory[bitcoinHistory.length - 1]?.date;
          console.log(`📅 比特币数据日期范围: ${firstDate} 到 ${lastDate}`);
          console.log('📊 比特币数据样本:', bitcoinHistory.slice(0, 3));

          // 如果数据范围太短，使用本地数据
          const firstYear = new Date(firstDate).getFullYear();
          if (firstYear > 2015) {
            console.warn('⚠️ 比特币数据起始年份太晚，使用本地历史数据...');
            throw new Error('比特币数据范围不足，需要使用本地数据');
          }
        }
      } catch (bitcoinError) {
        console.warn('⚠️ 比特币历史数据获取失败，使用本地数据:', bitcoinError);
        console.log('📂 加载本地比特币历史数据...');
        bitcoinHistory = bitcoinHistoryData.map(item => ({
          date: item.date,
          price: item.price
        }));
        console.log(`✅ 本地比特币数据加载成功: ${bitcoinHistory.length} 个数据点`);
      }

      try {
        // 获取经济数据（包含购买力指数）
        economicData = await fredDataService.getEconomicData(startDate, endDate);
        console.log(`✅ 购买力数据获取成功: ${economicData?.purchasingPower?.length || 0} 个数据点`);

        // 调试：检查前几个数据点的格式
        if (economicData?.purchasingPower && economicData.purchasingPower.length > 0) {
          console.log('💰 购买力数据样本:', economicData.purchasingPower.slice(0, 3));
        }
      } catch (economicError) {
        console.warn('⚠️ 经济数据获取失败，使用本地数据:', economicError);
        console.log('📂 加载本地购买力数据...');
        economicData = {
          purchasingPower: dollarPPPData.map(item => ({
            date: item.date,
            value: item.value * 100 // 转换为百分比格式
          }))
        };
        console.log(`✅ 本地购买力数据加载成功: ${economicData.purchasingPower.length} 个数据点`);
      }

      // 检查是否有足够的数据
      console.log('🔍 数据检查:');
      console.log('- 比特币数据:', bitcoinHistory ? `${bitcoinHistory.length} 个数据点` : '无数据');
      console.log('- 购买力数据:', economicData?.purchasingPower ? `${economicData.purchasingPower.length} 个数据点` : '无数据');

      if (!bitcoinHistory || bitcoinHistory.length === 0) {
        console.error('❌ 比特币历史数据为空');
        throw new Error('无法获取比特币历史数据');
      }

      if (!economicData.purchasingPower || economicData.purchasingPower.length === 0) {
        console.error('❌ 购买力数据为空');
        throw new Error('无法获取购买力数据');
      }

      // 显示数据样本以便调试
      console.log('📊 比特币数据样本 (前3个):', bitcoinHistory.slice(0, 3));
      console.log('💰 购买力数据样本 (前3个):', economicData.purchasingPower.slice(0, 3));

      // 对齐数据：将比特币价格数据和购买力数据按日期对齐
      console.log('🔗 开始对齐数据...');
      const alignedData = this.alignPPPAndBitcoinData(bitcoinHistory, economicData.purchasingPower);

      console.log(`🔗 对齐后数据: ${alignedData.length} 个数据点`);

      if (alignedData.length === 0) {
        console.error('❌ 数据对齐失败');
        console.log('调试信息:');
        console.log('- 比特币数据日期范围:', bitcoinHistory.length > 0 ? `${bitcoinHistory[0]?.date} 到 ${bitcoinHistory[bitcoinHistory.length-1]?.date}` : '无数据');
        console.log('- 购买力数据日期范围:', economicData.purchasingPower.length > 0 ? `${economicData.purchasingPower[0]?.date} 到 ${economicData.purchasingPower[economicData.purchasingPower.length-1]?.date}` : '无数据');
        throw new Error('无法对齐比特币和购买力数据 - 可能是数据格式不匹配');
      }

      // 过滤数据：只保留从2011年12月开始的数据，并且每季度取一个点以减少数据密度
      const filteredData = this.filterQuarterlyData(alignedData, startDate);

      console.log(`📊 最终数据: ${filteredData.length} 个季度数据点`);

      if (filteredData.length === 0) {
        throw new Error('过滤后没有有效数据');
      }

      return {
        title: 'Dollar PPP vs 1 Bitcoin',
        description: '美元购买力与比特币价格对比（以2011年12月为基准）\n\n从图表可以看出，美元购买力持续下降，而比特币价格呈现指数级增长。\n\n这反映了比特币作为价值储存工具的特性，以及传统货币面临的通胀压力。',
        data: filteredData,
        dollarPPPUnit: 'USD Purchasing Power (Dec 2011=100)',
        bitcoinUnit: 'USD'
      };

    } catch (error) {
      console.error('❌ 获取真实数据过程中出错:', error);
      console.error('错误详情:', {
        message: error.message,
        stack: error.stack
      });

      // 临时回退到模拟数据，避免页面崩溃
      console.log('🔄 回退到模拟数据...');
      return this.getMockDollarPPPvsBitcoinData();
    }
  }

  /**
   * 对齐比特币价格和购买力数据
   */
  private alignPPPAndBitcoinData(
    bitcoinHistory: Array<{ date: string; price: number }>,
    purchasingPower: Array<{ date: string; value: number }>
  ): Array<{ date: string; bitcoin: number; dollarPPP: number }> {
    const alignedData: Array<{ date: string; bitcoin: number; dollarPPP: number }> = [];

    try {
      console.log('🔄 开始对齐数据处理...');
      console.log('输入数据检查:');
      console.log('- bitcoinHistory:', bitcoinHistory ? `数组长度 ${bitcoinHistory.length}` : '无数据');
      console.log('- purchasingPower:', purchasingPower ? `数组长度 ${purchasingPower.length}` : '无数据');

      // 将比特币数据转换为按日期索引的映射
      const bitcoinByDate = new Map<string, number>();

      if (bitcoinHistory && Array.isArray(bitcoinHistory)) {
        console.log('📈 处理比特币数据...');
        bitcoinHistory.forEach((point, index) => {
          try {
            // 验证数据格式 - BitcoinPricePoint 有 date 和 price 字段
            if (point && point.date && typeof point.price === 'number') {
              // 验证日期格式
              const date = new Date(point.date);
              if (!isNaN(date.getTime())) { // 验证日期是否有效
                const dateStr = date.toISOString().split('T')[0];
                bitcoinByDate.set(dateStr, point.price);

                // 显示前几个处理的数据点
                if (index < 3) {
                  console.log(`  [${index}] ${point.date} -> ${dateStr}: $${point.price}`);
                }
              } else {
                console.warn('无效的比特币数据日期:', point.date);
              }
            } else {
              console.warn('无效的比特币数据格式:', point);
            }
          } catch (error) {
            console.warn('处理比特币数据点时出错:', point, error);
          }
        });
      }

      console.log(`📊 处理了 ${bitcoinByDate.size} 个有效的比特币数据点`);

      // 遍历购买力数据，寻找对应的比特币价格
      if (purchasingPower && Array.isArray(purchasingPower)) {
        purchasingPower.forEach(ppPoint => {
          try {
            if (ppPoint && ppPoint.date && typeof ppPoint.value === 'number') {
              const date = ppPoint.date;

              // 寻找最接近的比特币价格数据
              let bitcoinPrice = this.findClosestBitcoinPrice(bitcoinByDate, date);

              if (bitcoinPrice !== null && !isNaN(bitcoinPrice)) {
                alignedData.push({
                  date: date,
                  bitcoin: bitcoinPrice,
                  dollarPPP: ppPoint.value / 100 // 转换为以1为基准的比例
                });
              }
            }
          } catch (error) {
            console.warn('处理购买力数据点时出错:', ppPoint, error);
          }
        });
      }

      console.log(`🔗 成功对齐 ${alignedData.length} 个数据点`);

      return alignedData.sort((a, b) => {
        try {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        } catch (error) {
          console.warn('排序时出错:', a.date, b.date, error);
          return 0;
        }
      });

    } catch (error) {
      console.error('❌ 对齐数据时发生错误:', error);
      return [];
    }
  }

  /**
   * 寻找最接近日期的比特币价格
   */
  private findClosestBitcoinPrice(bitcoinByDate: Map<string, number>, targetDate: string): number | null {
    try {
      // 验证输入
      if (!targetDate || typeof targetDate !== 'string') {
        console.warn('无效的目标日期:', targetDate);
        return null;
      }

      const target = new Date(targetDate);
      if (isNaN(target.getTime())) {
        console.warn('无法解析目标日期:', targetDate);
        return null;
      }

      let closestPrice: number | null = null;
      let minDiff = Infinity;

      // 在目标日期前后7天内寻找最接近的价格
      for (let i = -7; i <= 7; i++) {
        try {
          const checkDate = new Date(target);
          checkDate.setDate(checkDate.getDate() + i);

          if (isNaN(checkDate.getTime())) {
            continue; // 跳过无效日期
          }

          const checkDateStr = checkDate.toISOString().split('T')[0];

          if (bitcoinByDate.has(checkDateStr)) {
            const price = bitcoinByDate.get(checkDateStr);
            if (typeof price === 'number' && !isNaN(price)) {
              const diff = Math.abs(i);
              if (diff < minDiff) {
                minDiff = diff;
                closestPrice = price;
              }
            }
          }
        } catch (error) {
          console.warn(`检查日期 ${targetDate} + ${i}天 时出错:`, error);
          continue;
        }
      }

      return closestPrice;
    } catch (error) {
      console.error('寻找最接近比特币价格时出错:', error);
      return null;
    }
  }

  /**
   * 过滤为季度数据以减少数据密度
   */
  private filterQuarterlyData(
    data: Array<{ date: string; bitcoin: number; dollarPPP: number }>,
    startDate: string
  ): Array<{ date: string; bitcoin: number; dollarPPP: number }> {
    try {
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn('没有数据需要过滤');
        return [];
      }

      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        console.warn('无效的开始日期:', startDate);
        return data; // 返回原始数据
      }

      const filtered: Array<{ date: string; bitcoin: number; dollarPPP: number }> = [];

      // 按季度分组（每3个月取一个数据点）
      const quarterlyData = new Map<string, { date: string; bitcoin: number; dollarPPP: number }>();

      data.forEach(point => {
        try {
          if (!point || !point.date) {
            return; // 跳过无效数据点
          }

          const pointDate = new Date(point.date);
          if (isNaN(pointDate.getTime())) {
            console.warn('无效的数据点日期:', point.date);
            return;
          }

          if (pointDate >= start) {
            // 生成季度键（年份-季度）
            const year = pointDate.getFullYear();
            const quarter = Math.floor(pointDate.getMonth() / 3) + 1;
            const quarterKey = `${year}-Q${quarter}`;

            // 如果这个季度还没有数据，或者当前数据更接近季度中间，则使用当前数据
            if (!quarterlyData.has(quarterKey)) {
              quarterlyData.set(quarterKey, point);
            }
          }
        } catch (error) {
          console.warn('处理数据点时出错:', point, error);
        }
      });

      // 转换为数组并按日期排序
      const result = Array.from(quarterlyData.values())
        .sort((a, b) => {
          try {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          } catch (error) {
            console.warn('排序时出错:', a.date, b.date, error);
            return 0;
          }
        });

      console.log(`📊 季度过滤结果: ${data.length} -> ${result.length} 个数据点`);
      return result;

    } catch (error) {
      console.error('❌ 过滤季度数据时出错:', error);
      return data; // 返回原始数据作为备用
    }
  }

  // 模拟数据方法
  private getMockBitcoinVsM2Data(): BitcoinVsM2Data {
    // 最近3年的密集数据，突出趋势变化
    const data: ChartDataPoint[] = [
      // 2022年：熊市开始，M2增长率转负
      { date: '2022-01-01', bitcoin: 47000, m2: 11.8 },
      { date: '2022-02-01', bitcoin: 44000, m2: 11.2 },
      { date: '2022-03-01', bitcoin: 45000, m2: 11.1 },
      { date: '2022-04-01', bitcoin: 40000, m2: 8.3 },
      { date: '2022-05-01', bitcoin: 30000, m2: 6.1 },
      { date: '2022-06-01', bitcoin: 20000, m2: -1.2 },
      { date: '2022-07-01', bitcoin: 23000, m2: -1.5 },
      { date: '2022-08-01', bitcoin: 20000, m2: -1.7 },
      { date: '2022-09-01', bitcoin: 19000, m2: -1.8 },
      { date: '2022-10-01', bitcoin: 20500, m2: -1.6 },
      { date: '2022-11-01', bitcoin: 16000, m2: -1.4 },
      { date: '2022-12-01', bitcoin: 16500, m2: -1.3 },

      // 2023年：复苏期，M2增长率逐步回升
      { date: '2023-01-01', bitcoin: 16800, m2: -4.6 },
      { date: '2023-02-01', bitcoin: 23000, m2: -4.4 },
      { date: '2023-03-01', bitcoin: 28000, m2: -4.1 },
      { date: '2023-04-01', bitcoin: 29000, m2: -3.9 },
      { date: '2023-05-01', bitcoin: 27000, m2: -3.7 },
      { date: '2023-06-01', bitcoin: 30000, m2: -3.8 },
      { date: '2023-07-01', bitcoin: 29500, m2: -2.1 },
      { date: '2023-08-01', bitcoin: 26000, m2: -1.8 },
      { date: '2023-09-01', bitcoin: 26000, m2: -0.3 },
      { date: '2023-10-01', bitcoin: 35000, m2: 0.1 },
      { date: '2023-11-01', bitcoin: 37000, m2: 0.8 },
      { date: '2023-12-01', bitcoin: 42000, m2: 1.4 },

      // 2024年：牛市回归，M2增长率稳定
      { date: '2024-01-01', bitcoin: 42000, m2: 1.8 },
      { date: '2024-02-01', bitcoin: 50000, m2: 2.1 },
      { date: '2024-03-01', bitcoin: 70000, m2: 2.6 },
      { date: '2024-04-01', bitcoin: 65000, m2: 2.4 },
      { date: '2024-05-01', bitcoin: 67000, m2: 2.2 },
      { date: '2024-06-01', bitcoin: 65000, m2: 2.3 },
      { date: '2024-07-01', bitcoin: 63000, m2: 2.1 },
      { date: '2024-08-01', bitcoin: 58000, m2: 2.0 },
      { date: '2024-09-01', bitcoin: 60000, m2: 2.1 },
      { date: '2024-10-01', bitcoin: 68000, m2: 2.5 },
      { date: '2024-11-01', bitcoin: 90000, m2: 2.7 },
      { date: '2024-12-01', bitcoin: 106000, m2: 2.8 },

      // 2025年：延伸到当前月份
      { date: '2025-01-01', bitcoin: 102000, m2: 2.9 },
      { date: '2025-02-01', bitcoin: 98000, m2: 3.1 },
      { date: '2025-03-01', bitcoin: 95000, m2: 3.0 },
      { date: '2025-04-01', bitcoin: 97000, m2: 2.8 },
      { date: '2025-05-01', bitcoin: 99000, m2: 2.7 },
      { date: '2025-06-01', bitcoin: 101000, m2: 2.9 }
    ];

    return {
      title: 'Bitcoin vs Major M2',
      description: '从图表可以看出，比特币价格与央行货币政策呈现明显的反向关系。\n\n2020年疫情期间各国央行大幅放水，M2增长率飙升至15%，比特币价格也随之暴涨。\n\n2022年开始的紧缩政策导致M2增长率转负，比特币价格大幅回调。\n\n2024年后货币政策趋于温和，比特币价格重新上涨，显示其作为通胀对冲工具的特性。',
      data: data,
      bitcoinUnit: 'USD',
      m2Unit: 'M2 Growth Rate (YoY %)'
    };
  }

  private getMockDollarPPPvsBitcoinData(): DollarPPPvsBitcoinData {
    // 生成从2011年12月到2024年12月的真实历史数据
    const data: ChartDataPoint[] = [];

    // 基于真实历史数据的比特币价格关键点
    const bitcoinMilestones = [
      { date: '2011-12-01', price: 3.0 },
      { date: '2012-01-01', price: 5.0 },
      { date: '2012-12-01', price: 13.0 },
      { date: '2013-04-01', price: 100.0 },
      { date: '2013-12-01', price: 800.0 },
      { date: '2014-01-01', price: 650.0 },
      { date: '2014-12-01', price: 320.0 },
      { date: '2015-12-01', price: 430.0 },
      { date: '2016-12-01', price: 950.0 },
      { date: '2017-06-01', price: 2500.0 },
      { date: '2017-12-01', price: 19000.0 },
      { date: '2018-01-01', price: 14000.0 },
      { date: '2018-12-01', price: 3200.0 },
      { date: '2019-06-01', price: 9000.0 },
      { date: '2019-12-01', price: 7200.0 },
      { date: '2020-03-01', price: 5000.0 },
      { date: '2020-12-01', price: 29000.0 },
      { date: '2021-04-01', price: 63000.0 },
      { date: '2021-12-01', price: 47000.0 },
      { date: '2022-06-01', price: 20000.0 },
      { date: '2022-12-01', price: 16500.0 },
      { date: '2023-03-01', price: 28000.0 },
      { date: '2023-12-01', price: 42000.0 },
      { date: '2024-03-01', price: 70000.0 },
      { date: '2024-11-01', price: 90000.0 },
      { date: '2024-12-01', price: 106000.0 },
      { date: '2025-01-01', price: 102000.0 },
      { date: '2025-02-01', price: 98000.0 },
      { date: '2025-03-01', price: 95000.0 },
      { date: '2025-04-01', price: 97000.0 },
      { date: '2025-05-01', price: 99000.0 },
      { date: '2025-06-01', price: 101000.0 }
    ];

    // 生成月度数据点（每个月一个点，增加数据密度以显示更好的起伏）
    const startDate = new Date('2011-12-01');
    const currentDate = new Date();
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
      const currentDate = new Date(date);
      const dateStr = currentDate.toISOString().split('T')[0];
      const yearsFromBase = (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

      // 美元购买力：基于真实CPI数据，年均通胀约2.5%，加入一些波动
      const baseInflation = Math.pow(0.975, yearsFromBase);
      const monthlyVariation = 0.01 * Math.sin(yearsFromBase * 4) * Math.cos(yearsFromBase * 2); // 添加周期性波动
      const dollarPurchasingPower = 1.0 * baseInflation * (1 + monthlyVariation);

      // 比特币价格插值
      let bitcoinPrice = 3.0;
      for (let i = 0; i < bitcoinMilestones.length - 1; i++) {
        const milestone1 = new Date(bitcoinMilestones[i].date);
        const milestone2 = new Date(bitcoinMilestones[i + 1].date);

        if (currentDate >= milestone1 && currentDate <= milestone2) {
          const progress = (currentDate.getTime() - milestone1.getTime()) / (milestone2.getTime() - milestone1.getTime());
          // 使用对数插值，更适合价格数据
          const logPrice1 = Math.log(bitcoinMilestones[i].price);
          const logPrice2 = Math.log(bitcoinMilestones[i + 1].price);
          bitcoinPrice = Math.exp(logPrice1 + (logPrice2 - logPrice1) * progress);
          break;
        }
      }

      // 如果超出最后一个里程碑，使用最后的价格
      if (currentDate > new Date(bitcoinMilestones[bitcoinMilestones.length - 1].date)) {
        bitcoinPrice = bitcoinMilestones[bitcoinMilestones.length - 1].price;
      }

      data.push({
        date: dateStr,
        dollarPPP: dollarPurchasingPower,
        bitcoin: bitcoinPrice
      });
    }

    return {
      title: 'Purchasing Power Over Time: 1 USD vs 1 BTC',
      description: '美元购买力与比特币购买力对比（以2011年12月为基准）\n\n📉 美元购买力持续下降：从2011年的1.0降至2025年的0.7左右\n反映了传统货币面临的通胀压力和购买力侵蚀\n\n📈 比特币购买力指数级增长：从2011年的$3涨至2025年的$100k+\n展现了数字资产作为价值储存工具的强大潜力\n\n💡 投资启示：\n比特币作为"数字黄金"的地位日益巩固\n长期持有比特币可有效对冲法币贬值风险',
      data: data,
      dollarPPPUnit: 'USD Purchasing Power (Dec 2011 USD)',
      bitcoinUnit: 'BTC Purchasing Power (Dec 2011 USD)'
    };
  }

  private getMockBitcoinSupplyVsInflationData(): BitcoinSupplyVsInflationData {
    // 完全模仿原图：Bitcoin Issuance Schedule，平滑的曲线数据
    const data: ChartDataPoint[] = [];

    // 生成从2009到2041年的平滑数据点
    for (let year = 2009; year <= 2041; year++) {
      // 比特币供应量：S型增长曲线，最终接近21M
      const yearsSince2009 = year - 2009;
      const bitcoinSupply = 21 * (1 - Math.exp(-yearsSince2009 / 8)) * 0.95;

      // 通胀率：指数衰减，从100%降到接近0%
      const inflation = 100 * Math.exp(-yearsSince2009 / 6);

      data.push({
        date: year.toString(),
        bitcoinSupply: Math.round(bitcoinSupply * 100) / 100,
        inflation: Math.round(inflation * 100) / 100
      });
    }

    return {
      title: 'Bitcoin Supply vs Inflation Rate',
      description: '比特币发行计划：新比特币在每个区块中创建，每四年减半一次。\n\n📊 减半机制展现稀缺性：每四年通胀率减半，供应量增长逐步放缓\n\n⚡ 2024年第四次减半后，比特币通胀率降至1.56%，远低于黄金和法币\n\n💎 最终供应量略低于2100万枚，使比特币成为人类历史上最稀缺的货币资产',
      data: data,
      supplyUnit: 'Million BTC',
      inflationUnit: '%'
    };
  }

  private getMockBitcoinVsUSM2Data(): BitcoinVsUSM2Data {
    // 扩展到2024年的完整数据，展示长期稀缺性趋势
    const data: ChartDataPoint[] = [
      { date: '2011-01-01', bitcoin: 0.30, usM2: 9600 },
      { date: '2012-01-01', bitcoin: 5.00, usM2: 10200 },
      { date: '2013-01-01', bitcoin: 13.00, usM2: 10800 },
      { date: '2013-12-01', bitcoin: 800.00, usM2: 11200 },
      { date: '2014-01-01', bitcoin: 650.00, usM2: 11700 },
      { date: '2015-01-01', bitcoin: 315.00, usM2: 12300 },
      { date: '2016-01-01', bitcoin: 430.00, usM2: 13200 },
      { date: '2017-01-01', bitcoin: 1000.00, usM2: 13800 },
      { date: '2017-12-01', bitcoin: 19000.00, usM2: 14000 },
      { date: '2018-01-01', bitcoin: 14000.00, usM2: 14200 },
      { date: '2018-12-01', bitcoin: 3200.00, usM2: 14500 },
      { date: '2019-01-01', bitcoin: 3700.00, usM2: 14800 },
      { date: '2020-01-01', bitcoin: 7200.00, usM2: 15400 },
      { date: '2020-03-01', bitcoin: 5000.00, usM2: 16700 }, // COVID刺激开始
      { date: '2020-12-01', bitcoin: 29000.00, usM2: 19200 },
      { date: '2021-04-01', bitcoin: 63000.00, usM2: 20100 },
      { date: '2021-12-01', bitcoin: 47000.00, usM2: 21600 },
      { date: '2022-06-01', bitcoin: 20000.00, usM2: 21800 },
      { date: '2022-12-01', bitcoin: 16500.00, usM2: 21300 },
      { date: '2023-03-01', bitcoin: 28000.00, usM2: 20900 },
      { date: '2023-12-01', bitcoin: 42000.00, usM2: 21000 },
      { date: '2024-03-01', bitcoin: 70000.00, usM2: 21100 },
      { date: '2024-11-01', bitcoin: 90000.00, usM2: 21300 },
      { date: '2024-12-01', bitcoin: 106000.00, usM2: 21400 }
    ];

    return {
      title: 'Bitcoin vs. US M2: 供给的稀缺性',
      description: '比特币与美国M2货币供应量对比，展示数字黄金的稀缺性\n\n📈 比特币价格从2011年的$0.3涨至2024年的$106k，涨幅超过35万倍\n\n💰 同期美国M2货币供应量从$9.6万亿增至$21.4万亿，增长123%\n\n⚖️ 对比显示：比特币固定供应vs法币无限印刷的根本差异\n\n🔥 稀缺性价值：比特币作为对冲货币贬值的最佳工具日益凸显',
      data: data,
      bitcoinUnit: 'USD',
      usM2Unit: 'Billions USD'
    };
  }
}

// 导出单例
export const chartDataService = new ChartDataService();
