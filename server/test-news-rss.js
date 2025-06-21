import Parser from 'rss-parser';

// 初始化RSS解析器
const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'LongValueHK-NewsBot/1.0'
  }
});

// RSS新闻源配置
const NEWS_SOURCES = [
  {
    name: 'CoinDesk',
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    category: '市场动态'
  },
  {
    name: 'CoinTelegraph',
    url: 'https://cointelegraph.com/rss',
    category: '行业新闻'
  },
  {
    name: 'Bitcoin Magazine',
    url: 'https://bitcoinmagazine.com/feed',
    category: '技术发展'
  },
  {
    name: 'Decrypt',
    url: 'https://decrypt.co/feed',
    category: '政策法规'
  }
];

// 获取单个RSS源的新闻
async function fetchRSSFeed(source) {
  try {
    console.log(`\n📰 正在获取 ${source.name} 新闻...`);
    console.log(`🔗 RSS URL: ${source.url}`);
    
    const feed = await parser.parseURL(source.url);
    
    console.log(`✅ 成功解析RSS feed`);
    console.log(`📊 Feed标题: ${feed.title || '未知'}`);
    console.log(`📝 Feed描述: ${feed.description || '无描述'}`);
    console.log(`📄 总文章数: ${feed.items.length}`);
    
    const articles = feed.items.slice(0, 3).map((item, index) => {
      const article = {
        id: `${source.name}-${item.guid || item.link}`,
        title: item.title || '无标题',
        summary: (item.contentSnippet || item.content || item.description || '无摘要').substring(0, 200) + '...',
        url: item.link || '#',
        publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
        source: source.name,
        category: source.category,
        sentiment: 'neutral'
      };
      
      console.log(`\n  📄 文章 ${index + 1}:`);
      console.log(`     标题: ${article.title}`);
      console.log(`     摘要: ${article.summary}`);
      console.log(`     发布时间: ${article.publishedAt}`);
      console.log(`     链接: ${article.url}`);
      
      return article;
    });
    
    console.log(`✅ ${source.name} 处理完成，获取 ${articles.length} 条新闻`);
    return articles;
    
  } catch (error) {
    console.error(`❌ 获取 ${source.name} 新闻失败:`);
    console.error(`   错误类型: ${error.name}`);
    console.error(`   错误信息: ${error.message}`);
    if (error.code) {
      console.error(`   错误代码: ${error.code}`);
    }
    return [];
  }
}

// 测试所有新闻源
async function testAllNewsSources() {
  console.log('🚀 开始测试RSS新闻爬取功能...');
  console.log(`📊 总共 ${NEWS_SOURCES.length} 个新闻源需要测试\n`);
  
  const startTime = Date.now();
  const allNews = [];
  
  for (const source of NEWS_SOURCES) {
    const articles = await fetchRSSFeed(source);
    allNews.push(...articles);
    
    // 添加延迟避免请求过于频繁
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试结果汇总:');
  console.log('='.repeat(60));
  console.log(`⏱️  总耗时: ${duration.toFixed(2)} 秒`);
  console.log(`📰 总新闻数: ${allNews.length} 条`);
  
  // 按来源统计
  const sourceStats = {};
  allNews.forEach(article => {
    sourceStats[article.source] = (sourceStats[article.source] || 0) + 1;
  });
  
  console.log('\n📊 各来源新闻数量:');
  Object.entries(sourceStats).forEach(([source, count]) => {
    console.log(`   ${source}: ${count} 条`);
  });
  
  // 按分类统计
  const categoryStats = {};
  allNews.forEach(article => {
    categoryStats[article.category] = (categoryStats[article.category] || 0) + 1;
  });
  
  console.log('\n📂 各分类新闻数量:');
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`   ${category}: ${count} 条`);
  });
  
  // 显示最新的5条新闻
  console.log('\n📰 最新5条新闻:');
  const sortedNews = allNews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  sortedNews.slice(0, 5).forEach((article, index) => {
    console.log(`\n${index + 1}. [${article.source}] ${article.title}`);
    console.log(`   分类: ${article.category}`);
    console.log(`   时间: ${new Date(article.publishedAt).toLocaleString('zh-CN')}`);
    console.log(`   摘要: ${article.summary.substring(0, 100)}...`);
  });
  
  console.log('\n✅ RSS新闻爬取测试完成！');
  
  return allNews;
}

// 运行测试
testAllNewsSources()
  .then(news => {
    console.log(`\n🎉 测试成功完成！共获取 ${news.length} 条新闻`);
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ 测试失败:', error);
    process.exit(1);
  });
