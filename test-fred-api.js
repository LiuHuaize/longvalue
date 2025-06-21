// FRED API 测试脚本
// 测试美联储经济数据API的连接和数据获取

const FRED_API_KEY = '32c5c13c39b5985adc5af6a18fdd181c';
const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

/**
 * 测试FRED API连接
 */
async function testFredAPI() {
  console.log('🚀 开始测试FRED API...\n');

  // 测试1: 获取美国M2货币供应量数据
  await testM2MoneySupply();
  
  // 测试2: 获取通胀率数据
  await testInflationRate();
  
  // 测试3: 获取美元购买力平价数据
  await testDollarPPP();
  
  // 测试4: 获取GDP数据
  await testGDPData();

  console.log('\n✅ FRED API测试完成！');
}

/**
 * 测试M2货币供应量数据
 */
async function testM2MoneySupply() {
  console.log('📊 测试1: 获取美国M2货币供应量数据');
  
  try {
    const url = `${FRED_BASE_URL}/series/observations?series_id=M2SL&api_key=${FRED_API_KEY}&file_type=json&limit=10&sort_order=desc`;
    
    console.log('请求URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ M2数据获取成功!');
    console.log('数据条数:', data.observations?.length || 0);
    
    if (data.observations && data.observations.length > 0) {
      const latest = data.observations[0];
      console.log('最新数据:', {
        date: latest.date,
        value: latest.value,
        unit: 'Billions of Dollars'
      });
    }
    
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ M2数据获取失败:', error.message);
    console.log('---\n');
  }
}

/**
 * 测试通胀率数据
 */
async function testInflationRate() {
  console.log('📈 测试2: 获取美国通胀率数据 (CPI)');
  
  try {
    const url = `${FRED_BASE_URL}/series/observations?series_id=CPIAUCSL&api_key=${FRED_API_KEY}&file_type=json&limit=10&sort_order=desc`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ 通胀率数据获取成功!');
    console.log('数据条数:', data.observations?.length || 0);
    
    if (data.observations && data.observations.length > 0) {
      const latest = data.observations[0];
      console.log('最新数据:', {
        date: latest.date,
        value: latest.value,
        unit: 'Index 1982-1984=100'
      });
    }
    
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ 通胀率数据获取失败:', error.message);
    console.log('---\n');
  }
}

/**
 * 测试美元购买力平价数据
 */
async function testDollarPPP() {
  console.log('💰 测试3: 获取美元购买力平价数据');
  
  try {
    // 使用生产者价格指数作为购买力指标
    const url = `${FRED_BASE_URL}/series/observations?series_id=PPIFGS&api_key=${FRED_API_KEY}&file_type=json&limit=10&sort_order=desc`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ 购买力数据获取成功!');
    console.log('数据条数:', data.observations?.length || 0);
    
    if (data.observations && data.observations.length > 0) {
      const latest = data.observations[0];
      console.log('最新数据:', {
        date: latest.date,
        value: latest.value,
        unit: 'Index Dec 2009=100'
      });
    }
    
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ 购买力数据获取失败:', error.message);
    console.log('---\n');
  }
}

/**
 * 测试GDP数据
 */
async function testGDPData() {
  console.log('🏛️ 测试4: 获取美国GDP数据');
  
  try {
    const url = `${FRED_BASE_URL}/series/observations?series_id=GDP&api_key=${FRED_API_KEY}&file_type=json&limit=5&sort_order=desc`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ GDP数据获取成功!');
    console.log('数据条数:', data.observations?.length || 0);
    
    if (data.observations && data.observations.length > 0) {
      const latest = data.observations[0];
      console.log('最新数据:', {
        date: latest.date,
        value: latest.value,
        unit: 'Billions of Dollars'
      });
    }
    
    console.log('---\n');
    
  } catch (error) {
    console.error('❌ GDP数据获取失败:', error.message);
    console.log('---\n');
  }
}

/**
 * 测试系列信息获取
 */
async function testSeriesInfo() {
  console.log('ℹ️ 额外测试: 获取数据系列信息');
  
  try {
    const url = `${FRED_BASE_URL}/series?series_id=M2SL&api_key=${FRED_API_KEY}&file_type=json`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.seriess && data.seriess.length > 0) {
      const series = data.seriess[0];
      console.log('M2系列信息:', {
        id: series.id,
        title: series.title,
        units: series.units,
        frequency: series.frequency,
        last_updated: series.last_updated
      });
    }
    
  } catch (error) {
    console.error('❌ 系列信息获取失败:', error.message);
  }
}

// 运行测试
if (typeof window === 'undefined') {
  // Node.js环境
  testFredAPI().catch(console.error);
} else {
  // 浏览器环境
  console.log('请在Node.js环境中运行此测试脚本');
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testFredAPI,
    testM2MoneySupply,
    testInflationRate,
    testDollarPPP,
    testGDPData,
    FRED_API_KEY,
    FRED_BASE_URL
  };
}
