#!/usr/bin/env node

/**
 * API调试脚本 - 详细诊断API问题
 */

import https from 'https';

// 详细的请求函数，包含调试信息
function makeDetailedRequest(url) {
  return new Promise((resolve, reject) => {
    console.log(`🔍 正在请求: ${url}`);
    
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site'
      }
    };

    console.log(`📡 请求选项:`, JSON.stringify(options, null, 2));

    const req = https.request(options, (res) => {
      console.log(`📊 响应状态: ${res.statusCode} ${res.statusMessage}`);
      console.log(`📋 响应头:`, JSON.stringify(res.headers, null, 2));
      
      let data = '';
      let chunks = [];
      
      res.on('data', (chunk) => {
        chunks.push(chunk);
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📦 响应大小: ${data.length} 字节`);
        console.log(`🔤 响应内容 (前500字符):`);
        console.log(data.substring(0, 500));
        
        try {
          const jsonData = JSON.parse(data);
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
            rawData: data
          });
        } catch (error) {
          console.log(`❌ JSON解析失败: ${error.message}`);
          resolve({
            success: false,
            status: res.statusCode,
            headers: res.headers,
            error: 'Invalid JSON response',
            rawData: data
          });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`💥 请求错误: ${error.message}`);
      console.log(`🔍 错误详情:`, error);
      reject(error);
    });

    req.setTimeout(15000, () => {
      console.log(`⏰ 请求超时`);
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// 测试不同的API端点
async function testDifferentAPIs() {
  const apis = [
    {
      name: 'CoinCap - Bitcoin Info',
      url: 'https://api.coincap.io/v2/assets/bitcoin'
    },
    {
      name: 'CoinCap - All Assets (前10个)',
      url: 'https://api.coincap.io/v2/assets?limit=10'
    },
    {
      name: 'CoinGecko - Simple Price',
      url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
    },
    {
      name: 'Binance - Bitcoin Price',
      url: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'
    }
  ];

  for (const api of apis) {
    console.log('\n' + '='.repeat(60));
    console.log(`🧪 测试: ${api.name}`);
    console.log('='.repeat(60));
    
    try {
      const result = await makeDetailedRequest(api.url);
      
      if (result.success) {
        console.log(`✅ 成功! 状态码: ${result.status}`);
        
        // 检查CORS头
        const corsOrigin = result.headers['access-control-allow-origin'];
        if (corsOrigin) {
          console.log(`🌐 CORS支持: ✅ (${corsOrigin})`);
        } else {
          console.log(`🌐 CORS支持: ❌`);
        }
        
        // 显示数据结构
        if (result.data) {
          console.log(`📊 数据结构:`);
          console.log(JSON.stringify(result.data, null, 2).substring(0, 800));
        }
      } else {
        console.log(`❌ 失败! 状态码: ${result.status}`);
        console.log(`📄 响应内容: ${result.rawData}`);
      }
      
    } catch (error) {
      console.log(`💥 请求异常: ${error.message}`);
    }
    
    // 等待2秒避免请求过快
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// 测试网络连接
async function testNetworkConnectivity() {
  console.log('\n🌐 测试网络连接...');
  
  const testSites = [
    'https://www.google.com',
    'https://api.github.com',
    'https://httpbin.org/get'
  ];
  
  for (const site of testSites) {
    try {
      console.log(`\n🔍 测试连接到: ${site}`);
      const result = await makeDetailedRequest(site);
      if (result.success) {
        console.log(`✅ 连接成功`);
      } else {
        console.log(`❌ 连接失败: ${result.status}`);
      }
    } catch (error) {
      console.log(`💥 连接错误: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🚀 开始详细API诊断...\n');
  
  // 首先测试网络连接
  await testNetworkConnectivity();
  
  // 然后测试各种API
  await testDifferentAPIs();
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 诊断总结');
  console.log('='.repeat(60));
  console.log('💡 如果所有API都返回404或连接失败，可能是:');
  console.log('   1. 网络连接问题');
  console.log('   2. 防火墙或代理设置');
  console.log('   3. DNS解析问题');
  console.log('   4. API服务暂时不可用');
  console.log('\n🔧 建议解决方案:');
  console.log('   1. 检查网络连接');
  console.log('   2. 尝试使用VPN或更换网络');
  console.log('   3. 检查防火墙设置');
  console.log('   4. 使用模拟数据作为备选方案');
}

main().catch(console.error);
