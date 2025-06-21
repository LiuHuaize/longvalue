import { chartDataService } from './src/services/chartDataService.ts';

// 简单的颜色输出函数
function log(message, color = 'white') {
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[color] || colors.white}${message}${colors.reset}`);
}

async function testDollarPPPData() {
  log('\n🧪 测试Dollar PPP vs Bitcoin数据...', 'cyan');
  
  try {
    const result = await chartDataService.getDollarPPPvsBitcoinData();
    
    log(`✅ 数据获取成功! 数据点数量: ${result.data.length}`, 'green');
    
    if (result.data.length > 0) {
      const firstPoint = result.data[0];
      const lastPoint = result.data[result.data.length - 1];
      
      log('\n📊 数据范围分析:', 'yellow');
      log(`   开始: ${firstPoint.date}`, 'white');
      log(`   结束: ${lastPoint.date}`, 'white');
      
      log('\n📈 数值范围:', 'yellow');
      log(`   美元购买力范围: ${Math.min(...result.data.map(d => d.dollarPPP)).toFixed(3)} - ${Math.max(...result.data.map(d => d.dollarPPP)).toFixed(3)}`, 'blue');
      log(`   比特币价格范围: $${Math.min(...result.data.map(d => d.bitcoin)).toFixed(0)} - $${Math.max(...result.data.map(d => d.bitcoin)).toFixed(0)}`, 'blue');
      
      // 显示几个关键数据点
      log('\n📋 关键数据点:', 'yellow');
      const keyPoints = [0, Math.floor(result.data.length * 0.25), Math.floor(result.data.length * 0.5), Math.floor(result.data.length * 0.75), result.data.length - 1];
      keyPoints.forEach(index => {
        const point = result.data[index];
        log(`   ${point.date}: USD购买力=${point.dollarPPP?.toFixed(3)}, BTC价格=$${point.bitcoin?.toFixed(0)}`, 'white');
      });
      
      // 分析数据特征
      log('\n🔍 数据特征分析:', 'yellow');
      const dollarPPPValues = result.data.map(d => d.dollarPPP);
      const bitcoinValues = result.data.map(d => d.bitcoin);
      
      const dollarPPPTrend = dollarPPPValues[dollarPPPValues.length - 1] - dollarPPPValues[0];
      const bitcoinTrend = bitcoinValues[bitcoinValues.length - 1] - bitcoinValues[0];
      
      log(`   美元购买力趋势: ${dollarPPPTrend > 0 ? '上升' : '下降'} (${dollarPPPTrend.toFixed(3)})`, dollarPPPTrend > 0 ? 'green' : 'red');
      log(`   比特币价格趋势: ${bitcoinTrend > 0 ? '上升' : '下降'} ($${bitcoinTrend.toFixed(0)})`, bitcoinTrend > 0 ? 'green' : 'red');
      
      // 检查是否有交叉点
      log('\n🔄 交叉点分析:', 'yellow');
      let crossings = 0;
      for (let i = 1; i < result.data.length; i++) {
        const prev = result.data[i - 1];
        const curr = result.data[i];
        
        // 检查是否有交叉（这里需要根据实际数据范围调整）
        const prevRatio = prev.bitcoin / (prev.dollarPPP * 100000); // 调整比例
        const currRatio = curr.bitcoin / (curr.dollarPPP * 100000);
        
        if ((prevRatio < 1 && currRatio > 1) || (prevRatio > 1 && currRatio < 1)) {
          crossings++;
          log(`   交叉点 ${crossings}: ${curr.date}`, 'cyan');
        }
      }
      
      if (crossings === 0) {
        log('   未检测到明显的交叉点', 'white');
        log('   可能需要调整坐标轴范围或数据缩放', 'yellow');
      }
    }
    
    return result;
    
  } catch (error) {
    log(`❌ 测试失败: ${error.message}`, 'red');
    console.error(error);
    return null;
  }
}

// 运行测试
testDollarPPPData()
  .then(result => {
    if (result) {
      log('\n✅ 测试完成!', 'green');
    } else {
      log('\n❌ 测试失败!', 'red');
    }
  })
  .catch(error => {
    log('\n💥 未捕获的错误:', 'red');
    console.error(error);
  });
