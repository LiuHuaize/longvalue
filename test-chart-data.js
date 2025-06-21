// 测试图表数据服务 - 验证四个图表的数据获取
const FRED_API_KEY = '32c5c13c39b5985adc5af6a18fdd181c';
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

// 简化的图表数据服务
class ChartDataService {
  constructor() {
    this.fredApiKey = FRED_API_KEY;
    this.fredBaseUrl = FRED_BASE_URL;
    this.cache = new Map();
  }

  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data, ttlHours = 6) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlHours * 60 * 60 * 1000
    });
  }

  async getFredData(seriesId, limit = 100) {
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

      return data;
    } catch (error) {
      console.error(`获取${seriesId}数据失败:`, error);
      throw error;
    }
  }

  // 模拟比特币历史价格数据
  getBitcoinHistoricalPrices(years = 2) {
    const currentPrice = 95420;
    const data = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - years);

    for (let i = 0; i < years * 12; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i);
      
      const monthsFromStart = i;
      const growthFactor = Math.pow(1.08, monthsFromStart / 12);
      const volatility = 0.2 * Math.sin(monthsFromStart / 3) + 0.1 * Math.random();
      const price = (currentPrice / growthFactor) * (1 + volatility);

      data.push({
        date: date.toISOString().split('T')[0],
        bitcoin: Math.max(price, 10000)
      });
    }

    return data;
  }

  calculateBitcoinSupply(blockHeight) {
    if (!blockHeight) {
      const startDate = new Date('2009-01-03');
      const now = new Date();
      const minutesPassed = (now.getTime() - startDate.getTime()) / (1000 * 60);
      blockHeight = Math.floor(minutesPassed / 10);
    }

    let totalSupply = 0;
    let currentReward = 50;
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

  async getBitcoinVsM2Data() {
    console.log('📊 获取图表1数据: Bitcoin vs Major M2');
    
    try {
      const bitcoinData = this.getBitcoinHistoricalPrices(2);
      const m2Response = await this.getFredData('M2SL', 24);
      
      const m2Data = m2Response.observations
        .filter(obs => obs.value !== '.')
        .map(obs => ({
          date: obs.date,
          value: parseFloat(obs.value)
        }))
        .reverse();

      const combinedData = [];
      const minLength = Math.min(bitcoinData.length, m2Data.length);

      for (let i = 0; i < minLength; i++) {
        combinedData.push({
          date: bitcoinData[i].date,
          bitcoin: bitcoinData[i].bitcoin,
          m2: m2Data[i]?.value || 0
        });
      }

      const result = {
        title: 'Bitcoin vs Major M2',
        description: '比特币价格与主要货币M2供应量对比',
        data: combinedData,
        bitcoinUnit: 'USD',
        m2Unit: 'Billions USD'
      };

      console.log('✅ 图表1数据获取成功!');
      console.log(`数据点数量: ${result.data.length}`);
      if (result.data.length > 0) {
        const latest = result.data[result.data.length - 1];
        console.log('最新数据点:', {
          date: latest.date,
          bitcoin: `$${latest.bitcoin?.toFixed(0)}`,
          m2: `$${latest.m2?.toFixed(1)}B`
        });
      }
      console.log('---\n');
      
      return result;

    } catch (error) {
      console.error('❌ 图表1数据获取失败:', error.message);
      console.log('---\n');
      return null;
    }
  }

  async getDollarPPPvsBitcoinData() {
    console.log('💰 获取图表2数据: Dollar PPP vs 1 Bitcoin');
    
    try {
      const bitcoinData = this.getBitcoinHistoricalPrices(2);
      
      // 模拟美元购买力数据
      const pppData = bitcoinData.map((item, index) => ({
        date: item.date,
        bitcoin: item.bitcoin,
        dollarPPP: 191.2 - (index * 0.05) // 模拟购买力缓慢下降
      }));

      const result = {
        title: 'Dollar PPP vs 1 Bitcoin',
        description: '美元购买力平价与1比特币价值对比',
        data: pppData,
        dollarPPPUnit: 'Index (Dec 2009=100)',
        bitcoinUnit: 'USD'
      };

      console.log('✅ 图表2数据获取成功!');
      console.log(`数据点数量: ${result.data.length}`);
      if (result.data.length > 0) {
        const latest = result.data[result.data.length - 1];
        console.log('最新数据点:', {
          date: latest.date,
          bitcoin: `$${latest.bitcoin?.toFixed(0)}`,
          dollarPPP: latest.dollarPPP?.toFixed(1)
        });
      }
      console.log('---\n');
      
      return result;

    } catch (error) {
      console.error('❌ 图表2数据获取失败:', error.message);
      console.log('---\n');
      return null;
    }
  }

  async getBitcoinSupplyVsInflationData() {
    console.log('📈 获取图表3数据: Bitcoin Supply vs Inflation Rate');
    
    try {
      const inflationResponse = await this.getFredData('CPIAUCSL', 24);
      
      const inflationData = inflationResponse.observations
        .filter(obs => obs.value !== '.')
        .map(obs => ({
          date: obs.date,
          value: parseFloat(obs.value)
        }))
        .reverse();

      const combinedData = inflationData.map((item, index) => {
        const startDate = new Date('2009-01-03');
        const currentDate = new Date(item.date);
        const minutesPassed = (currentDate.getTime() - startDate.getTime()) / (1000 * 60);
        const estimatedBlockHeight = Math.floor(minutesPassed / 10);
        
        const bitcoinSupply = this.calculateBitcoinSupply(estimatedBlockHeight);

        return {
          date: item.date,
          bitcoinSupply: bitcoinSupply,
          inflation: item.value
        };
      });

      const result = {
        title: 'Bitcoin Supply vs Inflation Rate',
        description: '比特币供应量与通胀率对比',
        data: combinedData,
        supplyUnit: 'BTC',
        inflationUnit: 'CPI Index'
      };

      console.log('✅ 图表3数据获取成功!');
      console.log(`数据点数量: ${result.data.length}`);
      if (result.data.length > 0) {
        const latest = result.data[result.data.length - 1];
        console.log('最新数据点:', {
          date: latest.date,
          bitcoinSupply: `${(latest.bitcoinSupply / 1000000).toFixed(2)}M BTC`,
          inflation: latest.inflation?.toFixed(1)
        });
      }
      console.log('---\n');
      
      return result;

    } catch (error) {
      console.error('❌ 图表3数据获取失败:', error.message);
      console.log('---\n');
      return null;
    }
  }

  async getBitcoinVsUSM2Data() {
    console.log('🏛️ 获取图表4数据: Bitcoin vs. US M2: 供给的稀缺性');
    
    try {
      const bitcoinData = this.getBitcoinHistoricalPrices(2);
      const usM2Response = await this.getFredData('M2SL', 24);
      
      const usM2Data = usM2Response.observations
        .filter(obs => obs.value !== '.')
        .map(obs => ({
          date: obs.date,
          value: parseFloat(obs.value)
        }))
        .reverse();

      const combinedData = [];
      const minLength = Math.min(bitcoinData.length, usM2Data.length);

      for (let i = 0; i < minLength; i++) {
        combinedData.push({
          date: bitcoinData[i].date,
          bitcoin: bitcoinData[i].bitcoin,
          usM2: usM2Data[i]?.value || 0
        });
      }

      const result = {
        title: 'Bitcoin vs. US M2: 供给的稀缺性',
        description: '比特币与美国M2货币供应量对比，展示数字黄金的稀缺性',
        data: combinedData,
        bitcoinUnit: 'USD',
        usM2Unit: 'Billions USD'
      };

      console.log('✅ 图表4数据获取成功!');
      console.log(`数据点数量: ${result.data.length}`);
      if (result.data.length > 0) {
        const latest = result.data[result.data.length - 1];
        console.log('最新数据点:', {
          date: latest.date,
          bitcoin: `$${latest.bitcoin?.toFixed(0)}`,
          usM2: `$${latest.usM2?.toFixed(1)}B`
        });
      }
      console.log('---\n');
      
      return result;

    } catch (error) {
      console.error('❌ 图表4数据获取失败:', error.message);
      console.log('---\n');
      return null;
    }
  }

  async getAllChartData() {
    console.log('🚀 开始获取所有图表数据...\n');

    const [chart1, chart2, chart3, chart4] = await Promise.all([
      this.getBitcoinVsM2Data(),
      this.getDollarPPPvsBitcoinData(),
      this.getBitcoinSupplyVsInflationData(),
      this.getBitcoinVsUSM2Data()
    ]);

    const results = {
      bitcoinVsM2: chart1,
      dollarPPPvsBitcoin: chart2,
      bitcoinSupplyVsInflation: chart3,
      bitcoinVsUSM2: chart4
    };

    console.log('📊 所有图表数据获取完成!');
    console.log('成功获取的图表数量:', Object.values(results).filter(chart => chart !== null).length);
    
    return results;
  }
}

// 运行测试
const chartDataService = new ChartDataService();
chartDataService.getAllChartData().catch(console.error);
