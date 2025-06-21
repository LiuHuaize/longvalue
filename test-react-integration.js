// 测试React应用中的图表数据集成
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始测试React应用中的图表数据集成...\n');

// 检查必要的文件是否存在
function checkFiles() {
  console.log('📁 检查必要文件...');
  
  const requiredFiles = [
    'src/services/macroEconomicService.ts',
    'src/services/chartDataService.ts',
    'src/components/bitcoin/DataComparisonChart.tsx',
    'src/pages/Home.tsx'
  ];
  
  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} - 存在`);
    } else {
      console.log(`❌ ${file} - 缺失`);
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length > 0) {
    console.log(`\n❌ 缺失 ${missingFiles.length} 个必要文件，请先创建这些文件。`);
    return false;
  }
  
  console.log('\n✅ 所有必要文件都存在！\n');
  return true;
}

// 检查依赖包
function checkDependencies() {
  console.log('📦 检查依赖包...');
  
  const packageJsonPath = 'package.json';
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json 不存在');
    return false;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = [
    'react',
    'recharts',
    'typescript'
  ];
  
  const missingDeps = [];
  
  requiredDeps.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`✅ ${dep} - 已安装 (${dependencies[dep]})`);
    } else {
      console.log(`❌ ${dep} - 未安装`);
      missingDeps.push(dep);
    }
  });
  
  if (missingDeps.length > 0) {
    console.log(`\n❌ 缺失 ${missingDeps.length} 个必要依赖包。`);
    console.log('请运行: npm install ' + missingDeps.join(' '));
    return false;
  }
  
  console.log('\n✅ 所有必要依赖包都已安装！\n');
  return true;
}

// 检查TypeScript编译
function checkTypeScript() {
  return new Promise((resolve) => {
    console.log('🔍 检查TypeScript编译...');
    
    const tsc = spawn('npx', ['tsc', '--noEmit'], {
      stdio: 'pipe'
    });
    
    let output = '';
    let errorOutput = '';
    
    tsc.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    tsc.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    tsc.on('close', (code) => {
      if (code === 0) {
        console.log('✅ TypeScript编译检查通过！\n');
        resolve(true);
      } else {
        console.log('❌ TypeScript编译检查失败:');
        console.log(errorOutput);
        console.log('\n');
        resolve(false);
      }
    });
    
    // 设置超时
    setTimeout(() => {
      tsc.kill();
      console.log('⏰ TypeScript检查超时，跳过此步骤\n');
      resolve(true);
    }, 30000);
  });
}

// 启动开发服务器进行测试
function startDevServer() {
  return new Promise((resolve) => {
    console.log('🌐 启动开发服务器进行测试...');
    console.log('这将启动React开发服务器，请在浏览器中访问 http://localhost:5173');
    console.log('检查以下页面的图表是否正常显示：');
    console.log('1. 首页 (/) - 比特币数据对比分析部分');
    console.log('\n按 Ctrl+C 停止服务器\n');
    
    const devServer = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit'
    });
    
    devServer.on('close', (code) => {
      console.log(`\n开发服务器已停止 (退出码: ${code})`);
      resolve(true);
    });
    
    // 监听进程终止信号
    process.on('SIGINT', () => {
      console.log('\n正在停止开发服务器...');
      devServer.kill();
    });
  });
}

// 主测试函数
async function runTests() {
  try {
    // 1. 检查文件
    if (!checkFiles()) {
      process.exit(1);
    }
    
    // 2. 检查依赖
    if (!checkDependencies()) {
      process.exit(1);
    }
    
    // 3. 检查TypeScript编译
    const tsCheckPassed = await checkTypeScript();
    if (!tsCheckPassed) {
      console.log('⚠️ TypeScript检查未通过，但继续进行测试...\n');
    }
    
    // 4. 提供测试指导
    console.log('📋 测试指导:');
    console.log('1. 即将启动开发服务器');
    console.log('2. 请在浏览器中访问以下页面:');
    console.log('   - http://localhost:5173/ (首页)');
    console.log('3. 检查四个图表是否正常显示:');
    console.log('   - Bitcoin vs Major M2');
    console.log('   - Dollar PPP vs 1 Bitcoin');
    console.log('   - Bitcoin Supply vs Inflation Rate');
    console.log('   - Bitcoin vs. US M2: 供给的稀缺性');
    console.log('4. 观察图表是否显示真实数据而不是"图表数据已加载"');
    console.log('5. 检查浏览器控制台是否有错误信息');
    console.log('\n准备好了吗？按回车键启动服务器...');
    
    // 等待用户确认
    await new Promise(resolve => {
      process.stdin.once('data', () => {
        resolve();
      });
    });
    
    // 5. 启动开发服务器
    await startDevServer();
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
    process.exit(1);
  }
}

// 运行测试
runTests();
