# 数据集成指南

本文档说明如何为长丰数智网站集成比特币相关数据。

## 概述

网站首页的比特币布道部分需要以下数据：

### 1. 比特币实时数据
- 实时价格
- 3月回报率
- 1年回报率
- 10年回报率
- 市值

### 2. 比特币数据对比图表
- Bitcoin vs Major M2
- Dollar PPP vs 1 Bitcoin
- Bitcoin Supply vs Inflation Rate
- Bitcoin vs. US M2: 供给的稀缺性

### 3. 比特币新闻跟踪
- 最新比特币相关新闻
- 来源：公众号推文、小红书、推特主流KOL推文等

## 技术实现

### 文件结构
```
src/
├── components/bitcoin/
│   ├── BitcoinPriceCard.tsx      # 价格卡片组件
│   ├── BitcoinDataGrid.tsx       # 数据网格组件
│   └── DataComparisonChart.tsx   # 对比图表组件
├── services/
│   └── bitcoinDataService.ts     # 数据服务
├── types/
│   └── bitcoin.ts                # 数据类型定义
└── pages/
    └── Home.tsx                   # 首页组件
```

### 数据接口

#### BitcoinDataService
位置：`src/services/bitcoinDataService.ts`

主要方法：
- `getCurrentPrice()` - 获取当前价格数据
- `getReturnsData()` - 获取回报率数据
- `getComparisonData()` - 获取对比数据
- `getLatestNews()` - 获取最新新闻

### 组件使用

#### BitcoinDataGrid
```tsx
import BitcoinDataGrid from '../components/bitcoin/BitcoinDataGrid';

// 使用示例
<BitcoinDataGrid 
  data={bitcoinData} 
  isLoading={false} 
/>
```

#### DataComparisonChart
```tsx
import DataComparisonChart from '../components/bitcoin/DataComparisonChart';

// 使用示例
<DataComparisonChart 
  title="Bitcoin vs Major M2" 
  data={chartData}
  isLoading={false}
/>
```

## 数据源建议

### 1. 价格和市场数据
- **CoinGecko API**: https://api.coingecko.com/api/v3
- **CoinMarketCap API**: https://coinmarketcap.com/api/
- **Binance API**: https://api.binance.com/

### 2. 宏观经济数据
- **FRED API** (Federal Reserve Economic Data): https://fred.stlouisfed.org/docs/api/
- **World Bank API**: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392

### 3. 新闻数据
- **NewsAPI**: https://newsapi.org/
- **Twitter API**: https://developer.twitter.com/en/docs
- **Reddit API**: https://www.reddit.com/dev/api/

## 实施步骤

### 第一阶段：基础数据集成
1. 集成CoinGecko API获取比特币价格数据
2. 实现实时价格更新
3. 添加回报率计算逻辑

### 第二阶段：图表数据集成
1. 集成FRED API获取M2货币供应量数据
2. 实现数据对比图表
3. 添加图表库（推荐Chart.js或Recharts）

### 第三阶段：新闻集成
1. 集成新闻API
2. 实现新闻筛选和分类
3. 添加自动更新机制

## 环境变量配置

在`.env`文件中添加以下配置（注意：Vite使用VITE_前缀）：

```env
# Bitcoin API Configuration
VITE_BITCOIN_API_URL=https://api.coingecko.com/api/v3
VITE_COINGECKO_API_KEY=your_api_key_here

# Economic Data API
VITE_FRED_API_KEY=your_fred_api_key_here
VITE_FRED_API_URL=https://api.stlouisfed.org/fred

# News API
VITE_NEWS_API_KEY=your_news_api_key_here
VITE_NEWS_API_URL=https://newsapi.org/v2

# Update intervals (in milliseconds)
VITE_PRICE_UPDATE_INTERVAL=30000
VITE_NEWS_UPDATE_INTERVAL=300000
```

## 数据更新策略

### 实时数据
- 价格数据：每30秒更新一次
- 市值数据：每分钟更新一次

### 历史数据
- 回报率数据：每小时更新一次
- 对比图表数据：每日更新一次

### 新闻数据
- 新闻列表：每5分钟更新一次
- 新闻详情：按需获取

## 错误处理

### 网络错误
- 实现重试机制
- 显示友好的错误信息
- 提供离线模式支持

### 数据错误
- 验证API响应数据
- 提供默认值
- 记录错误日志

## 性能优化

### 缓存策略
- 使用React Query或SWR进行数据缓存
- 实现本地存储缓存
- 设置合理的缓存过期时间

### 加载优化
- 实现骨架屏加载效果
- 使用懒加载减少初始加载时间
- 优化图表渲染性能

## 测试

### 单元测试
- 测试数据服务函数
- 测试组件渲染
- 测试错误处理逻辑

### 集成测试
- 测试API集成
- 测试数据流
- 测试用户交互

## 部署注意事项

### API密钥安全
- 不要在前端代码中暴露API密钥
- 考虑使用后端代理API请求
- 实现API密钥轮换机制

### 监控和日志
- 监控API调用频率
- 记录数据更新日志
- 设置异常告警

## 联系方式

如有技术问题，请联系开发团队：
- 邮箱：tech@longvaluehk.com
- 技术文档：内部Wiki链接
