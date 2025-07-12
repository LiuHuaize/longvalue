# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack financial data visualization application focused on Bitcoin and macroeconomic data analysis. The project consists of:

- **Frontend**: React 18 + TypeScript + Vite application with modern UI components
- **Backend**: Node.js Express server for data proxying and API aggregation
- **Purpose**: Professional financial analytics platform for Chinese-speaking users (LongValueHK - 长丰数智)

## Prerequisites

### Package Manager
This project uses **pnpm** for dependency management. Install it globally:
```bash
# Install pnpm
npm install -g pnpm
# Or using corepack (recommended)
corepack enable
corepack prepare pnpm@latest --activate
```

## Development Commands

### Frontend Development
```bash
# Install dependencies
pnpm install

# Start development server (frontend only)
pnpm run dev

# Build for production
pnpm run build

# Lint code
pnpm run lint

# Preview production build
pnpm run preview
```

### Backend Development
```bash
# Install server dependencies
pnpm run server:install

# Start server in development mode
pnpm run server:dev

# Start server in production mode
pnpm run server:start

# Test server APIs
pnpm run server:test
```

### Full Stack Development
```bash
# Setup both frontend and backend
pnpm run setup

# Run both frontend and backend concurrently
pnpm run dev:full
```

## Architecture & Key Technologies

### Frontend Stack
- **React 18.3.1** with TypeScript for type safety
- **Vite** as the build tool and development server
- **React Router DOM** for client-side routing
- **Tailwind CSS** for styling with custom design system
- **shadcn/ui** extensive component library based on Radix UI
- **Recharts** for data visualization and charts
- **Framer Motion** for animations
- **React Hook Form** with Zod for form validation

### Backend Stack
- **Express.js** server for API proxy and data aggregation
- **CORS** configuration for cross-origin requests
- **RSS Parser** for news feed processing
- **node-fetch** for external API calls
- **Environment variables** for API key management

### Data Services Architecture
The application uses a service-oriented architecture with specialized services:

- **bitcoinDataService.ts** - Core Bitcoin data fetching
- **macroEconomicService.ts** - Economic indicators and M2 data
- **fredDataService.ts** - Federal Reserve Economic Data integration
- **chartDataService.ts** - Chart data processing and formatting
- **proxyDataService.ts** - API proxy functionality
- **schedulerService.ts** - Automated data updates

### UI Component Structure
```
src/components/
├── layout/          # Navigation and footer components
├── bitcoin/         # Bitcoin-specific data visualizations
├── news/           # News section components
└── ui/             # Reusable UI components (shadcn/ui)
```

## Configuration Files

- **vite.config.ts** - Vite configuration with path aliases (`@/` → `./src/`)
- **tailwind.config.js** - Custom Tailwind configuration with design tokens
- **tsconfig.json** - TypeScript configuration with path mapping
- **eslint.config.js** - ESLint configuration using flat config format
- **components.json** - shadcn/ui component configuration

## Development Workflow

### Running Tests
The project uses React Testing Library with jest-dom:
```bash
# Install test dependencies (if needed)
pnpm install -D vitest @testing-library/react @testing-library/jest-dom

# Run tests (when configured)
pnpm test

# Note: Test runner not fully configured yet
# Current test: src/components/bitcoin/__tests__/BitcoinDataGrid.test.tsx
```

### Environment Setup
1. Copy environment configuration files:
   ```bash
   # Frontend environment
   cp .env.example .env
   
   # Backend environment (if exists)
   cp server/.env.example server/.env
   ```

2. Configure API keys in `.env`:
   - `VITE_FRED_API_KEY` (required for economic data)
   - `VITE_NEWS_API_KEY` (recommended for news feeds)
   - `VITE_REDDIT_CLIENT_ID` and `VITE_REDDIT_CLIENT_SECRET` (optional)

3. Backend server configuration (in `server/.env` if needed):
   - Port configuration (default: 3001)
   - Any backend-specific API keys

### Code Style & Conventions
- Use TypeScript for all new code
- Follow existing shadcn/ui patterns for UI components
- Implement proper error handling and loading states
- Use the existing service pattern for data fetching
- Follow the established file structure and naming conventions

### Data Integration
The application integrates with multiple financial data sources:
- **CoinGecko API** for Bitcoin prices and market data
- **FRED API** for macroeconomic indicators
- **News API** for Bitcoin-related news
- **RSS feeds** for additional news sources

Data is cached and updated according to different frequencies (hourly for prices, daily for economic data).

## Quick Start Guide

### Development Setup
```bash
# 1. Clone the repository
git clone [repository-url]
cd longvalue

# 2. Install pnpm globally (if not already installed)
npm install -g pnpm

# 3. Install all dependencies (frontend + backend)
pnpm run setup

# 4. Configure environment variables
cp .env.example .env
# Edit .env file with your API keys

# 5. Start development servers
pnpm run dev:full  # Runs both frontend (port 5173) and backend (port 3001)
```

### 🚀 真实数据系统快速启动

系统启动后将提供：
- Node.js后端API服务器（解决CORS问题）
- 前端React应用（通过代理获取数据）
- 真实的FRED和CoinGecko数据集成

访问 http://localhost:5173 查看网站，所有图表现在都将显示真实数据！

### 🔧 分别启动服务

如果需要分别启动服务：

```bash
# 启动后端服务器
pnpm run server:dev

# 启动前端应用
pnpm run dev
```

### Production Deployment

#### Frontend Deployment
```bash
# Build the frontend
pnpm run build

# The build output will be in ./dist directory
# Deploy to your preferred hosting service (Vercel, Netlify, etc.)
```

#### Backend Deployment
```bash
# Navigate to server directory
cd server

# Install production dependencies only
pnpm install --prod

# Start the server
pnpm start

# Or use PM2 for process management
pm2 start server.js --name "longvalue-backend"
```

#### Docker Deployment (Optional)
```bash
# Build Docker images
docker build -t longvalue-frontend .
docker build -t longvalue-backend ./server

# Run containers
docker run -p 5173:5173 longvalue-frontend
docker run -p 3001:3001 longvalue-backend
```

## 🧪 测试API

测试后端API是否正常工作：

```bash
# 运行自动化测试
pnpm run server:test

# 手动测试API端点
curl http://localhost:3001/health
curl "http://localhost:3001/api/fred/m2?start_date=2020-01-01&end_date=2024-12-31"
curl http://localhost:3001/api/bitcoin/price
curl "http://localhost:3001/api/bitcoin/history?days=30"
```

## 📊 数据源和API端点

### 后端API端点

| 端点 | 描述 | 数据源 |
|------|------|--------|
| `/health` | 健康检查 | - |
| `/api/fred/m2` | M2货币供应量 | FRED API |
| `/api/bitcoin/price` | 比特币当前价格 | CoinGecko API |
| `/api/bitcoin/history` | 比特币历史价格 | CoinGecko API |
| `/api/chart/bitcoin-vs-m2` | 组合图表数据 | FRED + CoinGecko |

### 前端数据流

```
前端组件 → proxyDataService → 后端API → 外部API
    ↓              ↓           ↓         ↓
localhost:5173  代理服务      :3001  FRED/CoinGecko
```

### 数据更新频率

- **M2数据**: 每月更新（FRED官方发布）
- **比特币价格**: 实时更新（CoinGecko API）
- **缓存**: 24小时自动过期

## Server Configuration

The Express server runs on port 3001 and provides:
- CORS-enabled API endpoints
- Data proxy functionality to avoid client-side CORS issues
- Health check endpoint at `/health`
- RSS feed parsing and news aggregation
- Automatic data caching to reduce API calls
- Real-time Bitcoin price data via CoinGecko API
- Macroeconomic data via FRED API

## Important Notes

- **Package Manager**: Always use `pnpm` instead of `npm` or `yarn`
- **Chinese Language Support**: UI labels and content are in Chinese
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Data Caching**: Implement caching strategies to respect API rate limits
- **Error Handling**: Graceful fallback to mock data when APIs fail
- **Security**: API keys are environment variables, never commit secrets
- **Dependencies**: Keep frontend and backend dependencies separate
- **Node Version**: Recommended Node.js 18+ for best compatibility

## Dependency Management

### Adding New Dependencies
```bash
# Frontend dependencies
pnpm add <package-name>

# Frontend dev dependencies
pnpm add -D <package-name>

# Backend dependencies
cd server && pnpm add <package-name>
```

### Updating Dependencies
```bash
# Check outdated packages
pnpm outdated

# Update all dependencies
pnpm update

# Update specific package
pnpm update <package-name>
```

## 🔍 故障排除 (Troubleshooting)

### 问题1：后端服务器启动失败
**症状**: `pnpm run server:dev` 失败
**解决方案**: 
```bash
cd server
pnpm install
pnpm start
```

### 问题2：CORS错误
**症状**: 浏览器控制台显示CORS错误
**解决方案**: 
- 确保后端服务器在端口3001运行
- 检查前端代理配置
- 验证CORS配置在 server/server.js 中

### 问题3：API数据获取失败
**症状**: 图表显示"获取数据失败"
**解决方案**: 
1. 检查FRED API密钥是否有效
2. 检查网络连接
3. 查看后端服务器日志
4. 验证API端点是否正确响应

### 问题4：端口冲突
**症状**: 端口3001或5173已被占用
**解决方案**: 
```bash
# 查找占用端口的进程
lsof -i :3001
lsof -i :5173

# 杀死进程
kill -9 <PID>
```

### 问题5：pnpm安装问题
**症状**: 依赖安装失败或版本冲突
**解决方案**: 
```bash
# 清理pnpm缓存
pnpm store prune

# 清理项目依赖
rm -rf node_modules pnpm-lock.yaml
rm -rf server/node_modules server/pnpm-lock.yaml

# 重新安装依赖
pnpm install
cd server && pnpm install
```

### 问题6：数据不更新
**症状**: 图表显示过期数据
**解决方案**: 
- 检查数据缓存是否过期
- 重启后端服务器
- 清理浏览器缓存

### 问题7：API密钥问题
**症状**: 403 Forbidden 或 401 Unauthorized
**解决方案**: 
- 验证 .env 文件中的API密钥
- 检查FRED API密钥是否有效
- 确保环境变量正确加载

### 调试技巧

#### 查看日志
```bash
# 后端日志
pnpm run server:dev  # 在终端中查看实时日志

# 前端日志
# 打开浏览器开发者工具 -> Console
```

#### 验证系统状态
```bash
# 检查服务状态
curl http://localhost:3001/health

# 检查API响应
curl -v http://localhost:3001/api/bitcoin/price
```

#### 环境检查
```bash
# 验证Node.js版本
node --version  # 应该是 18.x

# 验证pnpm版本
pnpm --version

# 检查环境变量
echo $VITE_FRED_API_KEY
```

## 🔐 API密钥配置

系统使用以下API服务：
- **FRED API**: 用于获取宏观经济数据，需要免费注册获取API密钥
- **CoinGecko API**: 用于获取比特币价格数据，免费版无需密钥

### 获取FRED API密钥
1. 访问 [FRED API 注册页面](https://fred.stlouisfed.org/docs/api/api_key.html)
2. 注册并获取免费API密钥
3. 将密钥添加到 `.env` 文件中：`VITE_FRED_API_KEY=your_api_key_here`

## 🎯 下一步

系统运行后，您可以：
1. 查看实时比特币价格和M2数据
2. 分析历史趋势图表
3. 监控数据更新状态
4. 自定义数据刷新频率
5. 扩展更多数据源和图表类型

## 💡 技术架构总结

这种架构解决了CORS问题，同时保持了数据的实时性和准确性：

```
前端 (React/Vite) → 代理服务 → 后端API → 外部API
       ↓                ↓           ↓         ↓
   localhost:5173   proxyDataService   :3001   FRED/CoinGecko
```

### 主要特点：
- **实时数据**: 通过API获取最新的金融数据
- **缓存机制**: 减少API调用，提高性能
- **错误处理**: 优雅的错误处理和回退机制
- **中文支持**: 完整的中文界面和数据展示
- **响应式设计**: 适配各种设备和屏幕尺寸

## 📚 开发参考

### 重要文件
- `src/services/proxyDataService.ts` - 前端数据代理服务
- `server/server.js` - 后端API服务器
- `src/components/bitcoin/` - 比特币相关组件
- `src/components/layout/` - 布局组件

### 开发时记住
- 所有外部API调用都通过后端代理
- 使用 TypeScript 进行类型安全
- 遵循现有的代码规范和组件结构
- 测试API端点的功能性
- 保持API密钥的安全性