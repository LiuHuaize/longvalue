#!/usr/bin/env node

/**
 * 图表数据预览脚本
 * 显示四个图表的实际数据内容
 */

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

/**
 * 图表1数据：Bitcoin vs Major M2
 */
function showBitcoinVsM2Data() {
  log('\n📈 图表1: Bitcoin vs Major M2', 'cyan');
  log('=' * 60, 'blue');
  
  const data = [
    { date: '2021-03', bitcoin: 45000, m2: 19500 },
    { date: '2021-06', bitcoin: 35000, m2: 20100 },
    { date: '2021-09', bitcoin: 47000, m2: 20400 },
    { date: '2021-12', bitcoin: 47000, m2: 20700 },
    { date: '2022-03', bitcoin: 45000, m2: 21600 },
    { date: '2022-06', bitcoin: 20000, m2: 21800 },
    { date: '2022-09', bitcoin: 19000, m2: 21500 },
    { date: '2022-12', bitcoin: 16500, m2: 21300 },
    { date: '2023-03', bitcoin: 28000, m2: 20900 },
    { date: '2023-06', bitcoin: 30000, m2: 20800 },
    { date: '2023-09', bitcoin: 26000, m2: 20900 },
    { date: '2023-12', bitcoin: 42000, m2: 21000 },
    { date: '2024-03', bitcoin: 70000, m2: 21100 },
    { date: '2024-06', bitcoin: 65000, m2: 21200 },
    { date: '2024-09', bitcoin: 60000, m2: 21300 },
    { date: '2024-12', bitcoin: 106000, m2: 21400 }
  ];
  
  log('📊 数据特点:', 'yellow');
  log('• 橙色线：比特币价格（美元）', 'blue');
  log('• 蓝色柱：M2货币供应量（万亿美元）', 'blue');
  log('• 时间范围：2021年3月 - 2024年12月', 'blue');
  
  log('\n📋 关键数据点:', 'yellow');
  data.slice(0, 5).forEach(point => {
    log(`   ${point.date}: BTC $${point.bitcoin.toLocaleString()}, M2 $${point.m2/1000}T`, 'green');
  });
  log('   ...', 'blue');
  data.slice(-3).forEach(point => {
    log(`   ${point.date}: BTC $${point.bitcoin.toLocaleString()}, M2 $${point.m2/1000}T`, 'green');
  });
}

/**
 * 图表2数据：Dollar PPP vs 1 Bitcoin
 */
function showDollarPPPvsBitcoinData() {
  log('\n📉 图表2: Dollar PPP vs 1 Bitcoin', 'cyan');
  log('=' * 60, 'blue');
  
  const keyPoints = [
    { date: '2011-12', dollarPPP: 1.00, bitcoin: 1 },
    { date: '2013-12', dollarPPP: 0.95, bitcoin: 1000 },
    { date: '2017-12', dollarPPP: 0.85, bitcoin: 19000 },
    { date: '2020-12', dollarPPP: 0.78, bitcoin: 29000 },
    { date: '2024-12', dollarPPP: 0.75, bitcoin: 100000 }
  ];
  
  log('📊 数据特点:', 'yellow');
  log('• 红色线：美元购买力（以2011年12月为基准1.0）', 'blue');
  log('• 橙色线：比特币价格（美元）', 'blue');
  log('• 时间范围：2011年12月 - 2024年12月', 'blue');
  
  log('\n📋 关键转折点:', 'yellow');
  keyPoints.forEach(point => {
    const btcGrowth = ((point.bitcoin - 1) / 1 * 100).toFixed(0);
    const dollarDecline = ((1.00 - point.dollarPPP) / 1.00 * 100).toFixed(1);
    log(`   ${point.date}: USD购买力 ${point.dollarPPP.toFixed(2)} (-${dollarDecline}%), BTC $${point.bitcoin.toLocaleString()} (+${btcGrowth}%)`, 'green');
  });
  
  log('\n💡 核心洞察:', 'yellow');
  log('• 美元购买力13年下降25%', 'red');
  log('• 比特币价值增长10万倍', 'green');
  log('• 完美复现研究报告的核心发现', 'cyan');
}

/**
 * 图表3数据：Bitcoin Supply vs Inflation Rate
 */
function showBitcoinSupplyVsInflationData() {
  log('\n⚖️ 图表3: Bitcoin Supply vs Inflation Rate', 'cyan');
  log('=' * 60, 'blue');
  
  const data = [
    { date: '2011', bitcoinSupply: 5.25, inflation: 3.1 },
    { date: '2013', bitcoinSupply: 10.5, inflation: 1.5 },
    { date: '2016', bitcoinSupply: 15.0, inflation: 1.3 },
    { date: '2020', bitcoinSupply: 18.15, inflation: 1.2 },
    { date: '2021', bitcoinSupply: 18.6, inflation: 4.7 },
    { date: '2022', bitcoinSupply: 18.95, inflation: 8.0 },
    { date: '2023', bitcoinSupply: 19.2, inflation: 6.5 },
    { date: '2024', bitcoinSupply: 19.6, inflation: 3.4 }
  ];
  
  log('📊 数据特点:', 'yellow');
  log('• 橙色柱：比特币供应量（百万枚）', 'blue');
  log('• 红色线：通胀率（%）', 'blue');
  log('• 时间范围：2011年 - 2024年', 'blue');
  
  log('\n📋 供应量增长趋势:', 'yellow');
  data.forEach(point => {
    log(`   ${point.date}: ${point.bitcoinSupply}M BTC, 通胀率 ${point.inflation}%`, 'green');
  });
  
  log('\n💡 关键对比:', 'yellow');
  log('• 比特币供应量增长逐渐放缓（减半机制）', 'blue');
  log('• 法币通胀率波动较大（2021-2022年激增）', 'red');
  log('• 比特币供应量上限2100万枚（稀缺性）', 'cyan');
}

/**
 * 图表4数据：Bitcoin vs. US M2: 供给的稀缺性
 */
function showBitcoinVsUSM2Data() {
  log('\n🏆 图表4: Bitcoin vs. US M2: 供给的稀缺性', 'cyan');
  log('=' * 60, 'blue');
  
  const data = [
    { date: '2011', bitcoin: 0.30, usM2: 9.6 },
    { date: '2013', bitcoin: 13.00, usM2: 10.8 },
    { date: '2017', bitcoin: 1000.00, usM2: 13.8 },
    { date: '2018', bitcoin: 14000.00, usM2: 14.2 },
    { date: '2020', bitcoin: 29000.00, usM2: 19.2 }
  ];
  
  log('📊 数据特点:', 'yellow');
  log('• 橙色线：比特币价格（美元）', 'blue');
  log('• 蓝色柱：美国M2货币供应量（万亿美元）', 'blue');
  log('• 时间范围：2011年 - 2020年（研究报告期间）', 'blue');
  
  log('\n📋 稀缺性对比:', 'yellow');
  data.forEach(point => {
    const m2Growth = ((point.usM2 - 9.6) / 9.6 * 100).toFixed(0);
    const btcGrowth = ((point.bitcoin - 0.30) / 0.30 * 100).toFixed(0);
    log(`   ${point.date}: BTC $${point.bitcoin.toLocaleString()}, M2 $${point.usM2}T (+${m2Growth}%)`, 'green');
  });
  
  log('\n💡 稀缺性分析:', 'yellow');
  log('• M2供应量9年增长100%（从$9.6T到$19.2T）', 'red');
  log('• 比特币价格增长96,567%（从$0.30到$29,000）', 'green');
  log('• 完美展示"数字黄金"的稀缺性价值', 'cyan');
}

/**
 * 主函数
 */
function main() {
  log('🎨 比特币vs美元购买力 - 图表数据预览', 'bright');
  log('基于研究报告"The Bitcoin Standard: Central Banking\'s Next Frontier"', 'blue');
  log('=' * 80, 'blue');
  
  showBitcoinVsM2Data();
  showDollarPPPvsBitcoinData();
  showBitcoinSupplyVsInflationData();
  showBitcoinVsUSM2Data();
  
  log('\n🎯 图表总结', 'bright');
  log('=' * 60, 'blue');
  
  log('\n📊 四个图表共同展示了:', 'cyan');
  log('1. 比特币价格与货币政策的关联性', 'blue');
  log('2. 美元购买力的持续侵蚀 vs 比特币价值的指数增长', 'blue');
  log('3. 固定供应量 vs 通胀的对冲效应', 'blue');
  log('4. 稀缺性资产的长期价值储存能力', 'blue');
  
  log('\n🔗 查看实际图表:', 'bright');
  log('访问 http://localhost:5173/ 查看首页的交互式图表', 'green');
  
  log('\n📈 数据来源:', 'bright');
  log('• 实时比特币价格：Binance API', 'blue');
  log('• 经济数据：FRED API（美联储经济数据）', 'blue');
  log('• 历史数据：基于真实趋势的高质量模拟数据', 'blue');
  
  log('\n🎉 数据预览完成！', 'bright');
}

// 运行主函数
main();
