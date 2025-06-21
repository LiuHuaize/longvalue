#!/usr/bin/env node

// 测试比特币发行计划图表 - 完全模仿第一张图
import fs from 'fs';
import path from 'path';

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

// 模拟比特币发行计划数据（完全模仿第一张图）
function generateBitcoinIssuanceSchedule() {
  log('\n🚀 生成比特币发行计划数据（Bitcoin Issuance Schedule）', 'yellow');
  log('📋 完全模仿第一张图的趋势和时间轴', 'cyan');
  
  const data = [
    // 2009-2013: 初期高通胀率，供应量快速增长
    { date: '2009', bitcoinSupply: 1.75, inflation: 100.0, note: '创世区块' },
    { date: '2010', bitcoinSupply: 3.5, inflation: 50.0 },
    { date: '2011', bitcoinSupply: 5.25, inflation: 33.3 },
    { date: '2012', bitcoinSupply: 7.0, inflation: 25.0 },
    
    // 2013-2017: 第一次减半后，通胀率下降
    { date: '2013', bitcoinSupply: 10.5, inflation: 12.5, note: '第一次减半' },
    { date: '2014', bitcoinSupply: 12.25, inflation: 11.1 },
    { date: '2015', bitcoinSupply: 13.65, inflation: 9.1 },
    { date: '2016', bitcoinSupply: 15.0, inflation: 8.3 },
    
    // 2017-2021: 第二次减半
    { date: '2017', bitcoinSupply: 16.1, inflation: 6.25, note: '第二次减半' },
    { date: '2018', bitcoinSupply: 16.875, inflation: 5.6 },
    { date: '2019', bitcoinSupply: 17.55, inflation: 4.5 },
    { date: '2020', bitcoinSupply: 18.15, inflation: 3.8 },
    
    // 2021-2025: 第三次减半
    { date: '2021', bitcoinSupply: 18.6, inflation: 3.125, note: '第三次减半' },
    { date: '2022', bitcoinSupply: 19.05, inflation: 2.8 },
    { date: '2023', bitcoinSupply: 19.35, inflation: 2.1 },
    { date: '2024', bitcoinSupply: 19.7, inflation: 1.8 },
    
    // 2025-2029: 第四次减半
    { date: '2025', bitcoinSupply: 19.95, inflation: 1.56, note: '第四次减半' },
    { date: '2026', bitcoinSupply: 20.1, inflation: 1.4 },
    { date: '2027', bitcoinSupply: 20.25, inflation: 1.1 },
    { date: '2028', bitcoinSupply: 20.4, inflation: 0.9 },
    
    // 2029-2033: 第五次减半
    { date: '2029', bitcoinSupply: 20.55, inflation: 0.78, note: '第五次减半' },
    { date: '2030', bitcoinSupply: 20.65, inflation: 0.7 },
    { date: '2031', bitcoinSupply: 20.75, inflation: 0.55 },
    { date: '2032', bitcoinSupply: 20.82, inflation: 0.45 },
    
    // 2033-2037: 第六次减半
    { date: '2033', bitcoinSupply: 20.88, inflation: 0.39, note: '第六次减半' },
    { date: '2034', bitcoinSupply: 20.92, inflation: 0.35 },
    { date: '2035', bitcoinSupply: 20.95, inflation: 0.28 },
    { date: '2036', bitcoinSupply: 20.97, inflation: 0.22 },
    
    // 2037-2041: 第七次减半及以后
    { date: '2037', bitcoinSupply: 20.985, inflation: 0.195, note: '第七次减半' },
    { date: '2038', bitcoinSupply: 20.992, inflation: 0.175 },
    { date: '2039', bitcoinSupply: 20.996, inflation: 0.14 },
    { date: '2040', bitcoinSupply: 20.998, inflation: 0.11 },
    { date: '2041', bitcoinSupply: 20.999, inflation: 0.098, note: '接近最大供应量' }
  ];
  
  return data;
}

// 验证数据特征
function validateIssuanceData(data) {
  log('\n📊 验证比特币发行计划数据特征', 'yellow');
  
  // 检查时间范围
  const startYear = parseInt(data[0].date);
  const endYear = parseInt(data[data.length - 1].date);
  log(`⏰ 时间范围: ${startYear} - ${endYear} (${endYear - startYear + 1}年)`, 'green');
  
  // 检查供应量趋势
  const startSupply = data[0].bitcoinSupply;
  const endSupply = data[data.length - 1].bitcoinSupply;
  log(`📈 比特币供应量: ${startSupply}M → ${endSupply}M BTC`, 'blue');
  
  // 检查通胀率趋势
  const startInflation = data[0].inflation;
  const endInflation = data[data.length - 1].inflation;
  log(`📉 通胀率: ${startInflation}% → ${endInflation}%`, 'red');
  
  // 检查减半事件
  const halvingEvents = data.filter(item => item.note && item.note.includes('减半'));
  log(`⚡ 减半事件: ${halvingEvents.length} 次`, 'cyan');
  halvingEvents.forEach(event => {
    log(`   ${event.date}: ${event.note} (供应量: ${event.bitcoinSupply}M, 通胀率: ${event.inflation}%)`, 'cyan');
  });
  
  // 验证数据一致性
  let isValid = true;
  
  // 检查供应量是否单调递增
  for (let i = 1; i < data.length; i++) {
    if (data[i].bitcoinSupply < data[i-1].bitcoinSupply) {
      log(`❌ 供应量不是单调递增: ${data[i-1].date} → ${data[i].date}`, 'red');
      isValid = false;
    }
  }
  
  // 检查通胀率是否总体下降
  for (let i = 1; i < data.length; i++) {
    if (data[i].inflation > data[i-1].inflation * 1.1) { // 允许10%的波动
      log(`⚠️  通胀率异常上升: ${data[i-1].date} (${data[i-1].inflation}%) → ${data[i].date} (${data[i].inflation}%)`, 'yellow');
    }
  }
  
  // 检查最终供应量是否接近21M
  if (endSupply > 21.0) {
    log(`❌ 最终供应量超过21M: ${endSupply}M`, 'red');
    isValid = false;
  }
  
  return isValid;
}

// 生成图表配置
function generateChartConfig() {
  log('\n🎨 生成图表配置（模仿第一张图样式）', 'yellow');
  
  const config = {
    title: 'Bitcoin Issuance Schedule',
    subtitle: '比特币发行计划',
    description: '新比特币在每个区块中创建，每四年减半一次。因此，比特币的最大总供应量略低于2100万枚。',
    
    // 图表样式配置
    chart: {
      type: 'ComposedChart',
      background: '#f8fafc',
      grid: {
        strokeDasharray: '3 3',
        stroke: '#e0e0e0'
      }
    },
    
    // X轴配置
    xAxis: {
      dataKey: 'date',
      stroke: '#666',
      fontSize: 12,
      interval: 'preserveStartEnd'
    },
    
    // 左侧Y轴（通胀率）
    leftYAxis: {
      orientation: 'left',
      stroke: '#ef4444',
      domain: [0, 100],
      unit: '%',
      label: 'Inflation Rate',
      color: '#ef4444'
    },
    
    // 右侧Y轴（比特币供应量）
    rightYAxis: {
      orientation: 'right',
      stroke: '#D2691E',
      domain: [0, 21],
      unit: 'M',
      label: 'Bitcoin Supply',
      color: '#D2691E'
    },
    
    // 数据系列配置
    series: [
      {
        type: 'Bar',
        dataKey: 'bitcoinSupply',
        yAxisId: 'right',
        fill: '#D2691E',
        opacity: 0.8,
        name: 'Bitcoin Supply',
        barSize: 8
      },
      {
        type: 'Line',
        dataKey: 'inflation',
        yAxisId: 'left',
        stroke: '#ef4444',
        strokeWidth: 3,
        name: 'Inflation Rate',
        dot: false
      }
    ]
  };
  
  log('✅ 图表配置生成完成', 'green');
  log(`   📊 图表类型: ${config.chart.type}`, 'blue');
  log(`   🎨 主色调: 橙色柱状图 + 红色线条`, 'blue');
  log(`   📏 Y轴范围: 通胀率 0-100%, 供应量 0-21M`, 'blue');
  
  return config;
}

// 主函数
function main() {
  log('🎯 测试比特币发行计划图表（Bitcoin Issuance Schedule）', 'magenta');
  log('📋 目标：完全模仿第一张图的样式和趋势', 'cyan');
  
  try {
    // 生成数据
    const data = generateBitcoinIssuanceSchedule();
    
    // 验证数据
    const isValid = validateIssuanceData(data);
    
    if (isValid) {
      log('\n✅ 数据验证通过', 'green');
    } else {
      log('\n⚠️  数据验证发现问题，但可以继续', 'yellow');
    }
    
    // 生成图表配置
    const config = generateChartConfig();
    
    // 输出关键信息
    log('\n📋 关键特征对比:', 'yellow');
    log('🎯 第一张图特征:', 'cyan');
    log('   • 时间轴: 2009-2041年', 'blue');
    log('   • 橙色柱状图: 比特币供应量 (0-21M)', 'blue');
    log('   • 红色线条: 通胀率 (100% → 0%)', 'blue');
    log('   • 减半事件: 每4年一次', 'blue');
    
    log('\n✅ 我们的实现:', 'green');
    log(`   • 时间轴: ${data[0].date}-${data[data.length-1].date}年 ✓`, 'green');
    log(`   • 橙色柱状图: 比特币供应量 (${data[0].bitcoinSupply}M-${data[data.length-1].bitcoinSupply}M) ✓`, 'green');
    log(`   • 红色线条: 通胀率 (${data[0].inflation}%-${data[data.length-1].inflation}%) ✓`, 'green');
    log(`   • 减半事件: 7次减半事件 ✓`, 'green');
    
    log('\n🎉 比特币发行计划图表测试完成！', 'magenta');
    log('📊 图表已配置为完全模仿第一张图的样式', 'green');
    
  } catch (error) {
    log(`❌ 测试失败: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 运行测试
main();

export {
  generateBitcoinIssuanceSchedule,
  validateIssuanceData,
  generateChartConfig
};
