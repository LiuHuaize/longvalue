#!/usr/bin/env node

/**
 * 简单的比特币API测试脚本
 * 专门测试当前项目使用的CoinCap API
 */

import https from 'https';

// 测试CoinCap API
async function testCoinCapAPI() {
  console.log('🧪 测试 CoinCap API...\n');
  
  // 测试当前价格
  console.log('📈 测试当前价格API...');
  try {
    const currentData = await makeRequest('https://api.coincap.io/v2/assets/bitcoin');
    if (currentData.success) {
      console.log('✅ 当前价格API成功!');
      console.log(`💰 比特币价格: $${parseFloat(currentData.data.data.priceUsd).toFixed(2)}`);
      console.log(`📊 市值: $${(parseFloat(currentData.data.data.marketCapUsd) / 1e9).toFixed(2)}B`);
      console.log(`📈 24h变化: ${parseFloat(currentData.data.data.changePercent24Hr).toFixed(2)}%`);
    } else {
      console.log('❌ 当前价格API失败:', currentData.error);
    }
  } catch (error) {
    console.log('💥 当前价格API错误:', error.message);
  }
  
  console.log('\n📊 测试历史数据API...');
  try {
    // 获取最近30天的数据
    const endTime = Date.now();
    const startTime = endTime - (30 * 24 * 60 * 60 * 1000); // 30天前
    
    const historyData = await makeRequest(
      `https://api.coincap.io/v2/assets/bitcoin/history?interval=d1&start=${startTime}&end=${endTime}`
    );
    
    if (historyData.success) {
      console.log('✅ 历史数据API成功!');
      console.log(`📅 获取到 ${historyData.data.data.length} 天的历史数据`);
      
      if (historyData.data.data.length > 0) {
        const firstPrice = parseFloat(historyData.data.data[0].priceUsd);
        const lastPrice = parseFloat(historyData.data.data[historyData.data.data.length - 1].priceUsd);
        const change = ((lastPrice - firstPrice) / firstPrice * 100).toFixed(2);
        console.log(`📈 30天变化: ${change}%`);
      }
    } else {
      console.log('❌ 历史数据API失败:', historyData.error);
    }
  } catch (error) {
    console.log('💥 历史数据API错误:', error.message);
  }
}

// 测试我们的服务类
async function testOurService() {
  console.log('\n🔧 测试我们的服务实现...\n');
  
  // 模拟我们的SimpleBitcoinService类
  class TestBitcoinService {
    constructor() {
      this.baseURL = 'https://api.coincap.io/v2';
    }
    
    async getCurrentData() {
      try {
        const response = await makeRequest(`${this.baseURL}/assets/bitcoin`);
        
        if (!response.success) {
          throw new Error(`API错误: ${response.status}`);
        }

        const data = response.data.data;

        return {
          price: parseFloat(data.priceUsd),
          priceChange24h: parseFloat(data.changePercent24Hr),
          priceChangePercentage24h: parseFloat(data.changePercent24Hr),
          marketCap: parseFloat(data.marketCapUsd),
          volume24h: parseFloat(data.volumeUsd24Hr),
          circulatingSupply: parseFloat(data.supply),
          totalSupply: parseFloat(data.maxSupply) || 21000000,
          lastUpdated: new Date(response.data.timestamp).toISOString()
        };
      } catch (error) {
        console.error('获取比特币数据失败:', error);
        throw error;
      }
    }
    
    async getReturnsData() {
      try {
        const endTime = Date.now();
        const startTime = endTime - (365 * 24 * 60 * 60 * 1000); // 1年前

        const response = await makeRequest(
          `${this.baseURL}/assets/bitcoin/history?interval=d1&start=${startTime}&end=${endTime}`
        );

        if (!response.success) {
          throw new Error(`历史数据API错误: ${response.status}`);
        }

        const historyData = response.data.data;

        if (historyData.length === 0) {
          throw new Error('历史数据为空');
        }

        const currentPrice = parseFloat(historyData[historyData.length - 1].priceUsd);
        
        return {
          threeMonthReturn: this.calculateReturn(historyData, currentPrice, 90),
          oneYearReturn: this.calculateReturn(historyData, currentPrice, 365),
          tenYearReturn: 8900.2, // 估算值
          allTimeHigh: 108135,
          allTimeLow: 0.0008
        };
      } catch (error) {
        console.error('获取历史回报率失败:', error);
        throw error;
      }
    }
    
    calculateReturn(historyData, currentPrice, days) {
      const targetIndex = Math.max(0, historyData.length - days);
      const pastPrice = parseFloat(historyData[targetIndex].priceUsd);
      return ((currentPrice - pastPrice) / pastPrice) * 100;
    }
  }
  
  const service = new TestBitcoinService();
  
  try {
    console.log('📊 测试getCurrentData()...');
    const currentData = await service.getCurrentData();
    console.log('✅ getCurrentData() 成功!');
    console.log(`💰 价格: $${currentData.price.toFixed(2)}`);
    console.log(`📈 24h变化: ${currentData.priceChange24h.toFixed(2)}%`);
    console.log(`💎 市值: $${(currentData.marketCap / 1e9).toFixed(2)}B`);
  } catch (error) {
    console.log('❌ getCurrentData() 失败:', error.message);
  }
  
  try {
    console.log('\n📈 测试getReturnsData()...');
    const returnsData = await service.getReturnsData();
    console.log('✅ getReturnsData() 成功!');
    console.log(`📅 3个月回报: ${returnsData.threeMonthReturn.toFixed(2)}%`);
    console.log(`📅 1年回报: ${returnsData.oneYearReturn.toFixed(2)}%`);
    console.log(`🚀 历史最高: $${returnsData.allTimeHigh.toFixed(2)}`);
  } catch (error) {
    console.log('❌ getReturnsData() 失败:', error.message);
  }
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            data: jsonData
          });
        } catch (error) {
          resolve({
            success: false,
            status: res.statusCode,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function main() {
  console.log('🚀 开始测试比特币API集成...\n');
  console.log('=' * 50);
  
  await testCoinCapAPI();
  await testOurService();
  
  console.log('\n' + '=' * 50);
  console.log('🎉 测试完成!');
  console.log('\n💡 如果所有测试都成功，说明API工作正常');
  console.log('🔧 如果测试失败，可能是网络问题或API暂时不可用');
  console.log('🌐 在浏览器中，CORS问题可能仍然存在，但这个测试证明API本身是可用的');
}

main().catch(console.error);
