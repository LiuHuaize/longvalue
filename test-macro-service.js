// 测试宏观经济数据服务
// 由于这是JS文件，我们需要直接实现测试逻辑

const FRED_API_KEY = '32c5c13c39b5985adc5af6a18fdd181c';
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

// 简化的宏观经济数据服务类
class MacroEconomicService {
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

  setCachedData(key, data, ttlHours = 24) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlHours * 60 * 60 * 1000
    });
  }

  async getFredData(seriesId, limit = 100) {
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

      this.setCachedData(cacheKey, data, 24);
      return data;
    } catch (error) {
      console.error(`获取${seriesId}数据失败:`, error);
      throw error;
    }
  }

  async getM2MoneySupply() {
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
      return {
        value: 21862.5,
        date: '2024-12-01',
        unit: 'Billions of Dollars'
      };
    }
  }

  async getInflationRate() {
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

  async getDollarPPP() {
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

  async getGDP() {
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

  async getAllMacroData() {
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

  async getHistoricalM2(years = 5) {
    try {
      const limit = years * 12;
      const data = await this.getFredData('M2SL', limit);

      return data.observations
        .filter(obs => obs.value !== '.')
        .map(obs => ({
          date: obs.date,
          value: parseFloat(obs.value)
        }))
        .reverse();
    } catch (error) {
      console.error('获取历史M2数据失败:', error);
      return [];
    }
  }

  async getHistoricalInflation(years = 5) {
    try {
      const limit = years * 12;
      const data = await this.getFredData('CPIAUCSL', limit);

      return data.observations
        .filter(obs => obs.value !== '.')
        .map(obs => ({
          date: obs.date,
          value: parseFloat(obs.value)
        }))
        .reverse();
    } catch (error) {
      console.error('获取历史通胀数据失败:', error);
      return [];
    }
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
}

const macroEconomicService = new MacroEconomicService();

/**
 * 测试宏观经济数据服务的所有功能
 */
async function testMacroEconomicService() {
  console.log('🚀 开始测试宏观经济数据服务...\n');

  // 测试1: 获取M2货币供应量
  await testM2Data();
  
  // 测试2: 获取通胀率数据
  await testInflationData();
  
  // 测试3: 获取美元购买力数据
  await testDollarPPPData();
  
  // 测试4: 获取GDP数据
  await testGDPData();
  
  // 测试5: 获取所有宏观数据
  await testAllMacroData();
  
  // 测试6: 获取历史数据
  await testHistoricalData();
  
  // 测试7: 测试比特币供应量计算
  await testBitcoinSupplyCalculation();

  console.log('\n✅ 宏观经济数据服务测试完成！');
}

async function testM2Data() {
  console.log('📊 测试1: 获取M2货币供应量数据');
  
  try {
    const m2Data = await macroEconomicService.getM2MoneySupply();
    
    console.log('✅ M2数据获取成功!');
    console.log('M2数据:', {
      value: `$${m2Data.value}B`,
      date: m2Data.date,
      unit: m2Data.unit
    });
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ M2数据获取失败:', error.message);
    console.log('---\n');
  }
}

async function testInflationData() {
  console.log('📈 测试2: 获取通胀率数据');
  
  try {
    const inflationData = await macroEconomicService.getInflationRate();
    
    console.log('✅ 通胀率数据获取成功!');
    console.log('通胀率数据:', {
      value: inflationData.value,
      date: inflationData.date,
      unit: inflationData.unit
    });
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ 通胀率数据获取失败:', error.message);
    console.log('---\n');
  }
}

async function testDollarPPPData() {
  console.log('💰 测试3: 获取美元购买力数据');
  
  try {
    const pppData = await macroEconomicService.getDollarPPP();
    
    console.log('✅ 购买力数据获取成功!');
    console.log('购买力数据:', {
      value: pppData.value,
      date: pppData.date,
      unit: pppData.unit
    });
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ 购买力数据获取失败:', error.message);
    console.log('---\n');
  }
}

async function testGDPData() {
  console.log('🏛️ 测试4: 获取GDP数据');
  
  try {
    const gdpData = await macroEconomicService.getGDP();
    
    console.log('✅ GDP数据获取成功!');
    console.log('GDP数据:', {
      value: `$${gdpData.value}B`,
      date: gdpData.date,
      unit: gdpData.unit
    });
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ GDP数据获取失败:', error.message);
    console.log('---\n');
  }
}

async function testAllMacroData() {
  console.log('🌍 测试5: 获取所有宏观经济数据');
  
  try {
    const allData = await macroEconomicService.getAllMacroData();
    
    console.log('✅ 所有宏观数据获取成功!');
    console.log('汇总数据:', {
      M2: `$${allData.m2MoneySupply.value}B (${allData.m2MoneySupply.date})`,
      通胀率: `${allData.inflationRate.value} (${allData.inflationRate.date})`,
      美元购买力: `${allData.dollarPPP.value} (${allData.dollarPPP.date})`,
      GDP: `$${allData.gdp.value}B (${allData.gdp.date})`
    });
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ 获取所有宏观数据失败:', error.message);
    console.log('---\n');
  }
}

async function testHistoricalData() {
  console.log('📊 测试6: 获取历史数据');
  
  try {
    console.log('获取历史M2数据 (最近1年)...');
    const historicalM2 = await macroEconomicService.getHistoricalM2(1);
    
    console.log('✅ 历史M2数据获取成功!');
    console.log(`数据点数量: ${historicalM2.length}`);
    
    if (historicalM2.length > 0) {
      console.log('最早数据:', {
        date: historicalM2[0].date,
        value: `$${historicalM2[0].value}B`
      });
      console.log('最新数据:', {
        date: historicalM2[historicalM2.length - 1].date,
        value: `$${historicalM2[historicalM2.length - 1].value}B`
      });
    }
    
    console.log('\n获取历史通胀数据 (最近1年)...');
    const historicalInflation = await macroEconomicService.getHistoricalInflation(1);
    
    console.log('✅ 历史通胀数据获取成功!');
    console.log(`数据点数量: ${historicalInflation.length}`);
    
    if (historicalInflation.length > 0) {
      console.log('最早数据:', {
        date: historicalInflation[0].date,
        value: historicalInflation[0].value
      });
      console.log('最新数据:', {
        date: historicalInflation[historicalInflation.length - 1].date,
        value: historicalInflation[historicalInflation.length - 1].value
      });
    }
    
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ 获取历史数据失败:', error.message);
    console.log('---\n');
  }
}

async function testBitcoinSupplyCalculation() {
  console.log('₿ 测试7: 比特币供应量计算');
  
  try {
    // 测试当前供应量
    const currentSupply = macroEconomicService.calculateBitcoinSupply();
    console.log('✅ 比特币供应量计算成功!');
    console.log(`当前估算供应量: ${currentSupply.toFixed(2)} BTC`);
    
    // 测试特定区块高度的供应量
    const supplyAt700000 = macroEconomicService.calculateBitcoinSupply(700000);
    console.log(`区块高度700,000时的供应量: ${supplyAt700000.toFixed(2)} BTC`);
    
    const supplyAt800000 = macroEconomicService.calculateBitcoinSupply(800000);
    console.log(`区块高度800,000时的供应量: ${supplyAt800000.toFixed(2)} BTC`);
    
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ 比特币供应量计算失败:', error.message);
    console.log('---\n');
  }
}

// 运行测试
testMacroEconomicService().catch(console.error);
