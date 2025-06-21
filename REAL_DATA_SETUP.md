# 🚀 真实数据系统设置指南

## 📋 概述

本指南将帮助您设置完整的真实数据系统，包括：
- Node.js后端API服务器（解决CORS问题）
- 前端React应用（通过代理获取数据）
- 真实的FRED和CoinGecko数据集成

## 🛠️ 快速启动

### 1. 安装依赖

```bash
# 安装前端和后端依赖
npm run setup
```

### 2. 启动完整系统

```bash
# 同时启动前端和后端
npm run dev:full
```

这将启动：
- 后端API服务器：http://localhost:3001
- 前端React应用：http://localhost:5173

### 3. 验证系统

访问 http://localhost:5173 查看网站，所有图表现在都将显示真实数据！

## 🔧 分别启动服务

如果您想分别启动服务：

### 启动后端服务器
```bash
npm run server:dev
```

### 启动前端应用
```bash
npm run dev
```

## 🧪 测试API

测试后端API是否正常工作：

```bash
npm run server:test
```

或者手动测试：

```bash
# 健康检查
curl http://localhost:3001/health

# 测试M2数据
curl "http://localhost:3001/api/fred/m2?start_date=2020-01-01&end_date=2024-12-31"

# 测试比特币价格
curl http://localhost:3001/api/bitcoin/price

# 测试比特币历史数据
curl "http://localhost:3001/api/bitcoin/history?days=30"
```

## 📊 数据源

### 后端API端点

| 端点 | 描述 | 数据源 |
|------|------|--------|
| `/health` | 健康检查 | - |
| `/api/fred/m2` | M2货币供应量 | FRED API |
| `/api/bitcoin/price` | 比特币当前价格 | CoinGecko API |
| `/api/bitcoin/history` | 比特币历史价格 | CoinGecko API |
| `/api/chart/bitcoin-vs-m2` | 组合图表数据 | FRED + CoinGecko |

### 前端数据流

1. **前端组件** → 调用 `proxyDataService`
2. **代理服务** → 请求本地后端API
3. **后端API** → 调用真实的FRED/CoinGecko API
4. **真实数据** → 返回给前端显示

## 🔍 故障排除

### 问题1：后端服务器启动失败
**症状**: `npm run server:dev` 失败
**解决**: 
```bash
cd server
npm install
npm start
```

### 问题2：CORS错误
**症状**: 浏览器控制台显示CORS错误
**解决**: 确保后端服务器在端口3001运行，前端配置正确

### 问题3：API数据获取失败
**症状**: 图表显示"获取数据失败"
**解决**: 
1. 检查FRED API密钥是否有效
2. 检查网络连接
3. 查看后端服务器日志

### 问题4：端口冲突
**症状**: 端口3001或5173已被占用
**解决**: 
```bash
# 查找占用端口的进程
lsof -i :3001
lsof -i :5173

# 杀死进程
kill -9 <PID>
```

## 📈 数据更新

- **M2数据**: 每月更新（FRED官方发布）
- **比特币价格**: 实时更新（CoinGecko API）
- **缓存**: 24小时自动过期

## 🔐 API密钥

系统使用以下API密钥：
- **FRED API**: `32c5c13c39b5985adc5af6a18fdd181c`
- **CoinGecko**: 免费版，无需密钥

## 📝 日志

查看详细日志：
- **后端日志**: 在运行 `npm run server:dev` 的终端中
- **前端日志**: 浏览器开发者工具控制台

## 🎯 下一步

系统运行后，您可以：
1. 查看实时比特币价格和M2数据
2. 分析历史趋势图表
3. 监控数据更新状态
4. 自定义数据刷新频率

## 💡 技术架构

```
前端 (React) → 代理服务 → 后端API → 外部API
    ↓              ↓           ↓         ↓
localhost:5173  proxyDataService  :3001  FRED/CoinGecko
```

这种架构解决了CORS问题，同时保持了数据的实时性和准确性。
