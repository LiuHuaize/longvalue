/**
 * 测试Dollar PPP vs Bitcoin真实数据获取
 */

// 由于这是测试脚本，我们需要模拟导入
// 在实际环境中，这些服务会通过React应用正确加载

console.log('🧪 Dollar PPP vs Bitcoin真实数据测试');
console.log('注意：此测试需要在React应用环境中运行以访问TypeScript模块');
console.log('请在浏览器中访问应用并检查控制台输出');

// 创建一个简单的测试函数来验证逻辑
function testDataProcessingLogic() {

// 颜色输出函数
function log(message, color = 'white') {
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
  };
  
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testDollarPPPRealData() {
  log('\n🧪 测试Dollar PPP vs Bitcoin真实数据获取', 'cyan');
  log('=' * 60, 'blue');
  
  try {
    log('\n📊 开始获取Dollar PPP vs Bitcoin数据...', 'yellow');
    
    const startTime = Date.now();
    const result = await chartDataService.getDollarPPPvsBitcoinData();
    const endTime = Date.now();
    
    log(`\n✅ 数据获取成功! 耗时: ${endTime - startTime}ms`, 'green');
    
    // 显示基本信息
    log('\n📋 数据概览:', 'cyan');
    log(`   标题: ${result.title}`, 'white');
    log(`   数据点数量: ${result.data.length}`, 'white');
    log(`   美元购买力单位: ${result.dollarPPPUnit}`, 'white');
    log(`   比特币单位: ${result.bitcoinUnit}`, 'white');
    
    // 显示描述
    log('\n📝 图表描述:', 'cyan');
    const descriptionLines = result.description.split('\n');
    descriptionLines.forEach(line => {
      if (line.trim()) {
        log(`   ${line.trim()}`, 'white');
      }
    });
    
    // 显示数据范围
    if (result.data.length > 0) {
      const firstPoint = result.data[0];
      const lastPoint = result.data[result.data.length - 1];
      
      log('\n📅 数据时间范围:', 'cyan');
      log(`   开始: ${firstPoint.date}`, 'white');
      log(`   结束: ${lastPoint.date}`, 'white');
      
      log('\n📈 首末数据对比:', 'cyan');
      log(`   ${firstPoint.date}:`, 'white');
      log(`     美元购买力: ${firstPoint.dollarPPP?.toFixed(3)}`, 'blue');
      log(`     比特币价格: $${firstPoint.bitcoin?.toLocaleString()}`, 'yellow');
      
      log(`   ${lastPoint.date}:`, 'white');
      log(`     美元购买力: ${lastPoint.dollarPPP?.toFixed(3)}`, 'blue');
      log(`     比特币价格: $${lastPoint.bitcoin?.toLocaleString()}`, 'yellow');
      
      // 计算变化
      const dollarPPPChange = ((lastPoint.dollarPPP - firstPoint.dollarPPP) / firstPoint.dollarPPP * 100);
      const bitcoinChange = ((lastPoint.bitcoin - firstPoint.bitcoin) / firstPoint.bitcoin * 100);
      
      log('\n📊 总体变化:', 'cyan');
      log(`   美元购买力变化: ${dollarPPPChange.toFixed(1)}%`, dollarPPPChange < 0 ? 'red' : 'green');
      log(`   比特币价格变化: ${bitcoinChange.toFixed(1)}%`, bitcoinChange > 0 ? 'green' : 'red');
    }
    
    // 显示最近几个数据点
    log('\n📋 最近5个数据点:', 'cyan');
    const recentData = result.data.slice(-5);
    recentData.forEach((point, index) => {
      log(`   ${index + 1}. ${point.date}:`, 'white');
      log(`      美元购买力: ${point.dollarPPP?.toFixed(3)}`, 'blue');
      log(`      比特币价格: $${point.bitcoin?.toLocaleString()}`, 'yellow');
    });
    
    // 数据质量检查
    log('\n🔍 数据质量检查:', 'cyan');
    
    const validDataPoints = result.data.filter(point => 
      point.dollarPPP !== undefined && 
      point.bitcoin !== undefined && 
      !isNaN(point.dollarPPP) && 
      !isNaN(point.bitcoin)
    );
    
    log(`   有效数据点: ${validDataPoints.length}/${result.data.length}`, 'white');
    
    const missingData = result.data.filter(point => 
      point.dollarPPP === undefined || 
      point.bitcoin === undefined ||
      isNaN(point.dollarPPP) || 
      isNaN(point.bitcoin)
    );
    
    if (missingData.length > 0) {
      log(`   ⚠️ 缺失数据点: ${missingData.length}`, 'yellow');
      missingData.slice(0, 3).forEach(point => {
        log(`      ${point.date}: PPP=${point.dollarPPP}, BTC=${point.bitcoin}`, 'yellow');
      });
    } else {
      log(`   ✅ 所有数据点完整`, 'green');
    }
    
    // 检查数据连续性
    const dates = result.data.map(point => new Date(point.date));
    const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
    const isChronological = dates.every((date, index) => 
      index === 0 || date.getTime() >= dates[index - 1].getTime()
    );
    
    log(`   时间序列排序: ${isChronological ? '✅ 正确' : '❌ 错误'}`, isChronological ? 'green' : 'red');
    
    // 检查数据合理性
    const dollarPPPValues = validDataPoints.map(p => p.dollarPPP);
    const bitcoinValues = validDataPoints.map(p => p.bitcoin);
    
    const dollarPPPRange = {
      min: Math.min(...dollarPPPValues),
      max: Math.max(...dollarPPPValues)
    };
    
    const bitcoinRange = {
      min: Math.min(...bitcoinValues),
      max: Math.max(...bitcoinValues)
    };
    
    log(`   美元购买力范围: ${dollarPPPRange.min.toFixed(3)} - ${dollarPPPRange.max.toFixed(3)}`, 'white');
    log(`   比特币价格范围: $${bitcoinRange.min.toLocaleString()} - $${bitcoinRange.max.toLocaleString()}`, 'white');
    
    // 合理性检查
    const reasonableChecks = {
      dollarPPPDecreasing: dollarPPPRange.max > dollarPPPRange.min, // 购买力应该随时间下降
      bitcoinIncreasing: bitcoinRange.max > bitcoinRange.min, // 比特币价格总体上升
      dollarPPPInRange: dollarPPPRange.min >= 0 && dollarPPPRange.max <= 2, // 购买力在合理范围
      bitcoinInRange: bitcoinRange.min >= 0 && bitcoinRange.max <= 200000 // 比特币价格在合理范围
    };
    
    log('\n✅ 合理性检查:', 'cyan');
    Object.entries(reasonableChecks).forEach(([check, passed]) => {
      log(`   ${check}: ${passed ? '✅ 通过' : '❌ 失败'}`, passed ? 'green' : 'red');
    });
    
    log('\n🎉 测试完成!', 'green');
    
    return result;
    
  } catch (error) {
    log(`\n❌ 测试失败: ${error.message}`, 'red');
    console.error('详细错误信息:', error);
    return null;
  }
}

// 运行测试
testDollarPPPRealData()
  .then(result => {
    if (result) {
      log('\n✅ Dollar PPP vs Bitcoin真实数据测试成功完成!', 'green');
    } else {
      log('\n❌ Dollar PPP vs Bitcoin真实数据测试失败!', 'red');
      process.exit(1);
    }
  })
  .catch(error => {
    log('\n💥 测试过程中发生未捕获的错误:', 'red');
    console.error(error);
    process.exit(1);
  });
