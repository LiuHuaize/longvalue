// 测试前端是否能访问后端API
async function testFrontendAPI() {
  console.log('🧪 测试前端API访问...');
  
  try {
    // 测试比特币价格API
    console.log('₿ 测试比特币价格API...');
    const response = await fetch('http://localhost:3001/api/bitcoin/price');
    
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ 比特币价格API响应:', data);
    
    if (data.success && data.data.usd) {
      console.log(`💰 当前比特币价格: $${data.data.usd.toLocaleString()}`);
      console.log(`📊 市值: $${(data.data.usd_market_cap / 1e12).toFixed(2)}T`);
      console.log(`📈 24h变化: ${data.data.usd_24h_change.toFixed(2)}%`);
    }
    
  } catch (error) {
    console.error('❌ API测试失败:', error);
  }
}

// 运行测试
testFrontendAPI();
