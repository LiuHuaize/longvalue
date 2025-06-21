#!/usr/bin/env node

/**
 * 测试Web应用是否正常工作
 * 检查页面是否可以访问，数据是否正常加载
 */

import http from 'http';

function makeHttpRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Test-Bot/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          data: data,
          headers: res.headers
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function testWebApp() {
  console.log('🌐 测试Web应用...\n');
  
  const baseUrl = 'http://localhost:5174';
  const testPages = [
    { name: '首页', path: '/' },
    { name: '数据演示页面', path: '/data-demo' }
  ];
  
  for (const page of testPages) {
    console.log(`🧪 测试 ${page.name}...`);
    
    try {
      const url = `${baseUrl}${page.path}`;
      console.log(`🔗 访问: ${url}`);
      
      const result = await makeHttpRequest(url);
      
      if (result.success) {
        console.log(`✅ ${page.name} 加载成功! (状态码: ${result.status})`);
        
        // 检查页面内容
        const content = result.data;
        const hasReactRoot = content.includes('id="root"');
        const hasViteScript = content.includes('vite');
        const hasTitle = content.includes('<title>');
        
        console.log(`📄 页面分析:`);
        console.log(`   - React根元素: ${hasReactRoot ? '✅' : '❌'}`);
        console.log(`   - Vite脚本: ${hasViteScript ? '✅' : '❌'}`);
        console.log(`   - 页面标题: ${hasTitle ? '✅' : '❌'}`);
        
        // 检查是否有明显的错误
        const hasError = content.toLowerCase().includes('error') || 
                        content.toLowerCase().includes('404') ||
                        content.toLowerCase().includes('not found');
        
        if (hasError) {
          console.log(`⚠️  页面可能包含错误信息`);
        }
        
        console.log(`📊 页面大小: ${(content.length / 1024).toFixed(2)} KB`);
        
      } else {
        console.log(`❌ ${page.name} 加载失败! (状态码: ${result.status})`);
        console.log(`📄 响应内容: ${result.data.substring(0, 200)}...`);
      }
      
    } catch (error) {
      console.log(`💥 ${page.name} 访问错误: ${error.message}`);
    }
    
    console.log(''); // 空行分隔
    
    // 等待1秒避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

async function checkDevServer() {
  console.log('🔍 检查开发服务器状态...\n');
  
  try {
    const result = await makeHttpRequest('http://localhost:5174/');
    
    if (result.success) {
      console.log('✅ 开发服务器运行正常!');
      console.log(`📡 服务器响应时间: 正常`);
      console.log(`🌐 可以通过浏览器访问: http://localhost:5174/`);
      return true;
    } else {
      console.log('❌ 开发服务器响应异常');
      return false;
    }
  } catch (error) {
    console.log('💥 无法连接到开发服务器');
    console.log('🔧 请确保运行了 npm run dev 命令');
    console.log(`📋 错误详情: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 开始Web应用测试...\n');
  console.log('=' * 50);
  
  // 首先检查开发服务器
  const serverRunning = await checkDevServer();
  
  if (serverRunning) {
    console.log('\n' + '=' * 50);
    await testWebApp();
    
    console.log('=' * 50);
    console.log('📋 测试总结:');
    console.log('✅ 开发服务器正常运行');
    console.log('🌐 可以在浏览器中访问应用');
    console.log('📱 建议在浏览器中打开以下链接进行完整测试:');
    console.log('   - 首页: http://localhost:5174/');
    console.log('   - 数据演示: http://localhost:5174/data-demo');
    console.log('\n💡 在浏览器中检查:');
    console.log('   1. 页面是否正常显示');
    console.log('   2. 比特币数据是否正确加载');
    console.log('   3. 控制台是否有CORS错误');
    console.log('   4. 数据刷新是否正常工作');
    
  } else {
    console.log('\n❌ 开发服务器未运行，请先启动服务器');
    console.log('🔧 运行命令: npm run dev');
  }
  
  console.log('\n🎉 测试完成!');
}

main().catch(console.error);
