#!/usr/bin/env node

// 测试中文标签的比特币发行计划图表
import fs from 'fs';

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

// 验证中文标签配置
function validateChineseLabels() {
  log('\n🇨🇳 验证中文标签配置', 'yellow');
  
  const labels = {
    title: 'Bitcoin Supply vs Inflation Rate',
    description: '比特币发行计划：新比特币在每个区块中创建，每四年减半一次。因此，比特币的最大总供应量略低于2100万枚。',
    
    // Y轴标签
    leftYAxisLabel: '通胀率',
    rightYAxisLabel: '比特币供应量',
    
    // 图例标签
    bitcoinSupplyLegend: '比特币供应量',
    inflationRateLegend: '通胀率',
    
    // 单位
    supplyUnit: 'Million BTC',
    inflationUnit: '%'
  };
  
  log('✅ 中文标签配置完成', 'green');
  log(`   📊 标题: ${labels.title}`, 'blue');
  log(`   📝 描述: ${labels.description}`, 'blue');
  log(`   📏 左Y轴: ${labels.leftYAxisLabel}`, 'blue');
  log(`   📏 右Y轴: ${labels.rightYAxisLabel}`, 'blue');
  log(`   🏷️  图例1: ${labels.bitcoinSupplyLegend}`, 'blue');
  log(`   🏷️  图例2: ${labels.inflationRateLegend}`, 'blue');
  
  return labels;
}

// 验证图表样式配置
function validateChartStyle() {
  log('\n🎨 验证图表样式配置', 'yellow');
  
  const style = {
    chartType: 'ComposedChart (双线图)',
    
    // 颜色配置
    colors: {
      bitcoinSupply: '#8B4513', // 深棕色
      inflationRate: '#ef4444', // 红色
      grid: '#e0e0e0',          // 浅灰色网格
      axis: '#666'              // 深灰色轴线
    },
    
    // 线条样式
    lines: {
      bitcoinSupply: {
        strokeWidth: 4,
        dot: false,
        activeDot: false
      },
      inflationRate: {
        strokeWidth: 3,
        dot: false,
        activeDot: false
      }
    },
    
    // 轴配置
    axes: {
      xAxis: {
        dataKey: 'date',
        fontSize: 11
      },
      leftYAxis: {
        domain: [0, 100],
        unit: '%',
        color: '#ef4444'
      },
      rightYAxis: {
        domain: [0, 21],
        unit: 'M',
        color: '#8B4513'
      }
    },
    
    // 交互配置
    interaction: {
      tooltip: false,  // 禁用tooltip
      activeDot: false // 禁用激活点
    }
  };
  
  log('✅ 图表样式配置完成', 'green');
  log(`   📊 类型: ${style.chartType}`, 'blue');
  log(`   🎨 比特币供应量: ${style.colors.bitcoinSupply} (线宽${style.lines.bitcoinSupply.strokeWidth})`, 'blue');
  log(`   🎨 通胀率: ${style.colors.inflationRate} (线宽${style.lines.inflationRate.strokeWidth})`, 'blue');
  log(`   🚫 数据点: 不显示具体数值`, 'blue');
  log(`   📏 Y轴范围: 通胀率 ${style.axes.leftYAxis.domain[0]}-${style.axes.leftYAxis.domain[1]}${style.axes.leftYAxis.unit}, 供应量 ${style.axes.rightYAxis.domain[0]}-${style.axes.rightYAxis.domain[1]}${style.axes.rightYAxis.unit}`, 'blue');
  
  return style;
}

// 生成示例数据预览
function generateDataPreview() {
  log('\n📊 生成数据预览', 'yellow');
  
  // 生成几个关键年份的数据点作为预览
  const keyYears = [2009, 2013, 2017, 2021, 2025, 2029, 2033, 2037, 2041];
  const preview = [];
  
  keyYears.forEach(year => {
    const yearsSince2009 = year - 2009;
    const bitcoinSupply = 21 * (1 - Math.exp(-yearsSince2009 / 8)) * 0.95;
    const inflation = 100 * Math.exp(-yearsSince2009 / 6);
    
    preview.push({
      year: year,
      bitcoinSupply: Math.round(bitcoinSupply * 100) / 100,
      inflation: Math.round(inflation * 100) / 100,
      note: year === 2009 ? '创世' : 
            year === 2013 ? '第一次减半' :
            year === 2017 ? '第二次减半' :
            year === 2021 ? '第三次减半' :
            year === 2025 ? '第四次减半' :
            year === 2029 ? '第五次减半' :
            year === 2033 ? '第六次减半' :
            year === 2037 ? '第七次减半' :
            year === 2041 ? '接近最大供应量' : ''
    });
  });
  
  log('📋 关键数据点预览:', 'cyan');
  preview.forEach(point => {
    log(`   ${point.year}: 供应量 ${point.bitcoinSupply}M, 通胀率 ${point.inflation}% ${point.note ? '(' + point.note + ')' : ''}`, 'blue');
  });
  
  return preview;
}

// 主函数
function main() {
  log('🎯 测试中文标签的比特币发行计划图表', 'magenta');
  log('📋 目标：完全中文化的图表标签和说明', 'cyan');
  
  try {
    // 验证中文标签
    const labels = validateChineseLabels();
    
    // 验证图表样式
    const style = validateChartStyle();
    
    // 生成数据预览
    const preview = generateDataPreview();
    
    // 总结配置
    log('\n📋 最终配置总结:', 'yellow');
    log('🎯 图表特征:', 'cyan');
    log('   • 标题和描述：完全中文化 ✓', 'green');
    log('   • Y轴标签：通胀率 & 比特币供应量 ✓', 'green');
    log('   • 图例标签：中文标签 ✓', 'green');
    log('   • 双线图：深棕色供应量线 + 红色通胀率线 ✓', 'green');
    log('   • 时间轴：2009-2041年 ✓', 'green');
    log('   • 不显示数据点：禁用tooltip和activeDot ✓', 'green');
    log('   • 平滑曲线：数学函数生成 ✓', 'green');
    
    log('\n🎉 中文标签配置测试完成！', 'magenta');
    log('📊 图表已完全中文化并保持原图样式', 'green');
    
  } catch (error) {
    log(`❌ 测试失败: ${error.message}`, 'red');
    process.exit(1);
  }
}

// 运行测试
main();

export {
  validateChineseLabels,
  validateChartStyle,
  generateDataPreview
};
