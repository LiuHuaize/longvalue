import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const SERVER_URL = `http://localhost:${process.env.PORT || 3001}`;

async function testAPI(endpoint, description) {
  console.log(`\n🧪 测试: ${description}`);
  console.log(`📡 请求: ${endpoint}`);
  
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log(`✅ 成功: ${data.count || 'N/A'} 个数据点`);
      if (data.data && Array.isArray(data.data)) {
        console.log(`📊 数据样本: ${JSON.stringify(data.data.slice(0, 2), null, 2)}`);
      } else if (data.data) {
        console.log(`📊 数据: ${JSON.stringify(data.data, null, 2)}`);
      }
      return true;
    } else {
      console.log(`❌ 失败: ${data.error || '未知错误'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ 网络错误: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 开始API测试...');
  console.log(`🌐 服务器地址: ${SERVER_URL}`);
  
  const tests = [
    {
      endpoint: `${SERVER_URL}/health`,
      description: '健康检查'
    },
    {
      endpoint: `${SERVER_URL}/api/fred/m2?start_date=2020-01-01&end_date=2024-12-31`,
      description: 'FRED M2数据获取'
    },
    {
      endpoint: `${SERVER_URL}/api/bitcoin/price`,
      description: '比特币当前价格'
    },
    {
      endpoint: `${SERVER_URL}/api/bitcoin/history?days=30`,
      description: '比特币30天历史数据'
    },
    {
      endpoint: `${SERVER_URL}/api/chart/bitcoin-vs-m2?start_date=2020-01-01`,
      description: 'Bitcoin vs M2组合数据'
    }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    const success = await testAPI(test.endpoint, test.description);
    if (success) passed++;
    
    // 等待一秒避免API限制
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n📊 测试结果: ${passed}/${total} 通过`);
  
  if (passed === total) {
    console.log('🎉 所有测试通过！服务器可以获取真实数据。');
  } else {
    console.log('⚠️ 部分测试失败，请检查服务器配置和API密钥。');
  }
}

// 检查服务器是否运行
async function checkServer() {
  try {
    const response = await fetch(`${SERVER_URL}/health`);
    if (response.ok) {
      console.log('✅ 服务器正在运行');
      return true;
    }
  } catch (error) {
    console.log('❌ 服务器未运行，请先启动服务器:');
    console.log('   cd server && npm install && npm start');
    return false;
  }
}

// 主函数
async function main() {
  console.log('🔍 检查服务器状态...');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    process.exit(1);
  }
  
  await runTests();
}

main().catch(console.error);
