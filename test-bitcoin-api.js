#!/usr/bin/env node

/**
 * Bitcoin API 测试脚本
 * 用于诊断和测试不同的比特币数据API
 */

import https from 'https';
import http from 'http';

// 测试配置
const TEST_CONFIG = {
  timeout: 10000, // 10秒超时
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
};

// API端点配置
const API_ENDPOINTS = {
  coincap: {
    name: 'CoinCap API',
    current: 'https://api.coincap.io/v2/assets/bitcoin',
    history: 'https://api.coincap.io/v2/assets/bitcoin/history?interval=d1&start=1640995200000&end=1672531200000',
    description: '免费，无CORS限制，推荐使用'
  },
  coingecko: {
    name: 'CoinGecko API',
    current: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true',
    history: 'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365',
    description: '免费，但有CORS限制'
  },
  binance: {
    name: 'Binance API',
    current: 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
    history: 'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=365',
    description: '免费，无CORS限制'
  }
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': TEST_CONFIG.userAgent,
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        ...options.headers
      },
      timeout: TEST_CONFIG.timeout
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData,
            success: res.statusCode >= 200 && res.statusCode < 300
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
            success: false,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', (error) => {
      reject({
        success: false,
        error: error.message,
        code: error.code
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        success: false,
        error: 'Request timeout',
        code: 'TIMEOUT'
      });
    });

    req.end();
  });
}

async function testAPI(name, url, description) {
  log(`\n🧪 测试 ${name}`, 'cyan');
  log(`📝 描述: ${description}`, 'blue');
  log(`🔗 URL: ${url}`, 'blue');
  
  try {
    const startTime = Date.now();
    const result = await makeRequest(url);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    if (result.success) {
      log(`✅ 成功! 响应时间: ${responseTime}ms`, 'green');
      log(`📊 状态码: ${result.status}`, 'green');
      
      // 检查CORS头
      const corsHeaders = {
        'access-control-allow-origin': result.headers['access-control-allow-origin'],
        'access-control-allow-methods': result.headers['access-control-allow-methods'],
        'access-control-allow-headers': result.headers['access-control-allow-headers']
      };
      
      const hasCORS = corsHeaders['access-control-allow-origin'];
      if (hasCORS) {
        log(`🌐 CORS支持: ✅ (${hasCORS})`, 'green');
      } else {
        log(`🌐 CORS支持: ❌ (可能导致浏览器CORS错误)`, 'yellow');
      }
      
      // 显示数据样本
      if (typeof result.data === 'object') {
        log(`📋 数据样本:`, 'blue');
        console.log(JSON.stringify(result.data, null, 2).substring(0, 500) + '...');
      }
      
      return { success: true, responseTime, hasCORS: !!hasCORS, data: result.data };
    } else {
      log(`❌ 失败! 状态码: ${result.status}`, 'red');
      if (result.error) {
        log(`💥 错误: ${result.error}`, 'red');
      }
      return { success: false, error: result.error || `HTTP ${result.status}` };
    }
  } catch (error) {
    log(`💥 请求失败: ${error.error || error.message}`, 'red');
    if (error.code) {
      log(`🔍 错误代码: ${error.code}`, 'red');
    }
    return { success: false, error: error.error || error.message };
  }
}

async function testAllAPIs() {
  log('🚀 开始测试比特币API端点...', 'bright');
  log('=' * 60, 'blue');
  
  const results = {};
  
  for (const [key, config] of Object.entries(API_ENDPOINTS)) {
    // 测试当前价格API
    log(`\n📈 测试 ${config.name} - 当前价格`, 'magenta');
    results[`${key}_current`] = await testAPI(
      `${config.name} (当前价格)`,
      config.current,
      config.description
    );
    
    // 等待1秒避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 测试历史数据API
    log(`\n📊 测试 ${config.name} - 历史数据`, 'magenta');
    results[`${key}_history`] = await testAPI(
      `${config.name} (历史数据)`,
      config.history,
      config.description
    );
    
    // 等待1秒避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

function generateReport(results) {
  log('\n' + '=' * 60, 'blue');
  log('📊 测试报告', 'bright');
  log('=' * 60, 'blue');
  
  const successful = Object.values(results).filter(r => r.success).length;
  const total = Object.values(results).length;
  
  log(`\n📈 总体结果: ${successful}/${total} 个API端点成功`, successful === total ? 'green' : 'yellow');
  
  // 按API分组显示结果
  const apiGroups = {};
  for (const [key, result] of Object.entries(results)) {
    const [apiName, type] = key.split('_');
    if (!apiGroups[apiName]) {
      apiGroups[apiName] = {};
    }
    apiGroups[apiName][type] = result;
  }
  
  log('\n🔍 详细结果:', 'cyan');
  for (const [apiName, tests] of Object.entries(apiGroups)) {
    const config = API_ENDPOINTS[apiName];
    log(`\n📡 ${config.name}`, 'bright');
    log(`   描述: ${config.description}`, 'blue');
    
    for (const [type, result] of Object.entries(tests)) {
      const typeLabel = type === 'current' ? '当前价格' : '历史数据';
      if (result.success) {
        const corsStatus = result.hasCORS ? '✅' : '❌';
        log(`   ${typeLabel}: ✅ 成功 (${result.responseTime}ms) CORS: ${corsStatus}`, 'green');
      } else {
        log(`   ${typeLabel}: ❌ 失败 (${result.error})`, 'red');
      }
    }
  }
  
  // 推荐方案
  log('\n💡 推荐方案:', 'bright');
  
  const coincapCurrent = results.coincap_current;
  const coincapHistory = results.coincap_history;
  
  if (coincapCurrent?.success && coincapHistory?.success) {
    log('🎯 推荐使用 CoinCap API:', 'green');
    log('   ✅ 当前价格和历史数据都可用', 'green');
    log('   ✅ 无CORS限制，适合前端直接调用', 'green');
    log('   ✅ 免费且稳定', 'green');
    log('   📝 实现代码已在 src/services/simpleBitcoinService.ts', 'blue');
  } else {
    log('⚠️  CoinCap API 测试失败，建议检查网络连接', 'yellow');
    
    // 检查其他可用选项
    const workingAPIs = Object.entries(results)
      .filter(([key, result]) => result.success && result.hasCORS)
      .map(([key]) => key.split('_')[0]);
    
    if (workingAPIs.length > 0) {
      log(`🔄 备选方案: ${workingAPIs.join(', ')}`, 'yellow');
    } else {
      log('🚨 所有API都不可用，建议使用代理服务器或后端API', 'red');
    }
  }
}

async function main() {
  try {
    const results = await testAllAPIs();
    generateReport(results);
    
    log('\n🎉 测试完成!', 'bright');
    log('💡 如果CoinCap API可用，你的应用应该能正常工作', 'green');
    log('🔧 如果遇到问题，请检查网络连接或防火墙设置', 'blue');
    
  } catch (error) {
    log(`💥 测试过程中发生错误: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 运行测试
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 检查是否直接运行此文件
if (process.argv[1] === __filename) {
  main();
}

export { testAPI, testAllAPIs, generateReport };
