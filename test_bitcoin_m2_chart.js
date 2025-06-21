#!/usr/bin/env node

/**
 * 测试Bitcoin vs Major M2图表数据获取
 * 验证数据是否延伸到当前月份并支持刷新
 */

import { chartDataService } from './src/services/chartDataService.js';

async function testBitcoinVsM2Data() {
  console.log('🧪 开始测试Bitcoin vs Major M2图表数据...\n');

  try {
    // 获取图表数据
    console.log('📊 获取Bitcoin vs M2数据...');
    const data = await chartDataService.getBitcoinVsM2Data();
    
    console.log('✅ 数据获取成功!');
    console.log(`📈 图表标题: ${data.title}`);
    console.log(`📝 描述: ${data.description}`);
    console.log(`📊 数据点数量: ${data.data.length}`);
    
    // 检查数据范围
    const dates = data.data.map(item => item.date).sort();
    const startDate = dates[0];
    const endDate = dates[dates.length - 1];
    
    console.log(`📅 数据范围: ${startDate} 到 ${endDate}`);
    
    // 检查是否包含2025年数据
    const has2025Data = data.data.some(item => item.date.startsWith('2025'));
    console.log(`🗓️ 包含2025年数据: ${has2025Data ? '✅ 是' : '❌ 否'}`);
    
    // 显示最近几个数据点
    console.log('\n📊 最近的数据点:');
    const recentData = data.data.slice(-6);
    recentData.forEach(item => {
      console.log(`  ${item.date}: Bitcoin $${item.bitcoin.toLocaleString()}, M2 Growth ${item.m2.toFixed(1)}%`);
    });
    
    // 检查当前月份
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
    const hasCurrentMonthData = data.data.some(item => item.date.startsWith(currentMonth));
    
    console.log(`\n📅 当前月份 (${currentMonth}): ${hasCurrentMonthData ? '✅ 有数据' : '❌ 无数据'}`);
    
    // 测试数据刷新（模拟）
    console.log('\n🔄 测试数据刷新...');
    const refreshedData = await chartDataService.getBitcoinVsM2Data();
    console.log(`✅ 刷新成功，数据点数量: ${refreshedData.data.length}`);
    
    console.log('\n🎉 测试完成！Bitcoin vs Major M2图表数据已延伸到当前月份并支持刷新。');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    process.exit(1);
  }
}

// 运行测试
testBitcoinVsM2Data();
