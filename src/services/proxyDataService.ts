/**
 * 代理数据服务
 * 通过本地后端API获取真实数据，避免CORS问题
 */

interface ProxyAPIResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  source?: string;
  timestamp: string;
  error?: string;
}

interface M2DataPoint {
  date: string;
  value: number;
}

interface BitcoinPricePoint {
  date: string;
  price: number;
}

interface BitcoinCurrentPrice {
  usd: number;
  usd_market_cap: number;
  usd_24h_vol: number;
  usd_24h_change: number;
  last_updated_at: number;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export class ProxyDataService {
  private serverBaseUrl: string;

  constructor() {
    // 检测当前环境决定服务器地址
    const isDev = import.meta.env.DEV;
    const customUrl = import.meta.env.VITE_SERVER_URL;
    
    if (customUrl) {
      this.serverBaseUrl = customUrl;
    } else if (isDev) {
      // 开发环境直接访问3001端口
      this.serverBaseUrl = 'http://localhost:3001';
    } else {
      // 生产环境使用相对路径，通过nginx代理
      this.serverBaseUrl = '';
    }
    
    console.log('🏗️ [ProxyDataService] 初始化，服务器地址:', this.serverBaseUrl);
    console.log('🔧 [ProxyDataService] 开发模式:', isDev);
    console.log('🔧 [ProxyDataService] 环境变量 VITE_SERVER_URL:', import.meta.env.VITE_SERVER_URL);
  }

  /**
   * 获取M2货币供应量数据
   */
  async fetchM2Data(startDate?: string, endDate?: string): Promise<M2DataPoint[]> {
    try {
      console.log('🏦 通过代理获取M2数据...');
      
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const url = `${this.serverBaseUrl}/api/fred/m2${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`代理服务器错误: ${response.status} ${response.statusText}`);
      }
      
      const result: ProxyAPIResponse<M2DataPoint[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '获取M2数据失败');
      }
      
      console.log(`✅ 成功获取 ${result.data.length} 个M2数据点`);
      return result.data;
      
    } catch (error) {
      console.error('❌ 代理获取M2数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取比特币当前价格
   */
  async fetchCurrentBitcoinPrice(): Promise<BitcoinCurrentPrice> {
    try {
      console.log('₿ [ProxyDataService] 通过代理获取比特币当前价格...');
      
      const url = `${this.serverBaseUrl}/api/bitcoin/price`;
      console.log('🌐 [ProxyDataService] 请求URL:', url);
      
      // 创建AbortController用于超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ [ProxyDataService] 请求超时，取消请求');
        controller.abort();
      }, 10000); // 10秒超时
      
      console.log('📡 [ProxyDataService] 发送请求...');
      console.log('🕐 [ProxyDataService] 开始时间:', new Date().toISOString());
      
      const startTime = Date.now();
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      clearTimeout(timeoutId);
      const endTime = Date.now();
      
      console.log('📨 [ProxyDataService] 响应状态:', response.status, response.statusText);
      console.log('⏱️ [ProxyDataService] 请求耗时:', endTime - startTime, 'ms');
      console.log('🕐 [ProxyDataService] 响应时间:', new Date().toISOString());
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [ProxyDataService] 错误响应内容:', errorText);
        throw new Error(`代理服务器错误: ${response.status} ${response.statusText}`);
      }
      
      console.log('📋 [ProxyDataService] 开始解析JSON...');
      const result: ProxyAPIResponse<BitcoinCurrentPrice> = await response.json();
      console.log('📦 [ProxyDataService] 响应数据:', result);
      
      if (!result.success) {
        throw new Error(result.error || '获取比特币价格失败');
      }
      
      console.log('✅ [ProxyDataService] 成功获取比特币当前价格');
      return result.data;
      
    } catch (error) {
      console.error('❌ [ProxyDataService] 代理获取比特币价格失败:', error);
      console.error('🚨 [ProxyDataService] 错误类型:', error.constructor.name);
      console.error('🚨 [ProxyDataService] 错误消息:', error.message);
      
      if (error.name === 'AbortError') {
        console.error('⏰ [ProxyDataService] 请求被取消（超时）');
        throw new Error('请求超时，请检查网络连接');
      }
      
      if (error instanceof TypeError) {
        console.error('🌐 [ProxyDataService] 网络错误，可能是连接问题');
        console.error('🔍 [ProxyDataService] 建议检查：');
        console.error('   - 后端服务器是否运行在', this.serverBaseUrl);
        console.error('   - 网络连接是否正常');
        console.error('   - CORS配置是否正确');
      }
      
      throw error;
    }
  }

  /**
   * 获取比特币历史价格数据
   */
  async fetchBitcoinHistory(days: string = '365'): Promise<BitcoinPricePoint[]> {
    try {
      console.log('📈 通过代理获取比特币历史数据...');
      
      const url = `${this.serverBaseUrl}/api/bitcoin/history?days=${days}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`代理服务器错误: ${response.status} ${response.statusText}`);
      }
      
      const result: ProxyAPIResponse<{
        prices: BitcoinPricePoint[];
        market_caps: any[];
        total_volumes: any[];
      }> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '获取比特币历史数据失败');
      }
      
      console.log(`✅ 成功获取 ${result.data.prices.length} 个比特币历史数据点`);
      return result.data.prices;
      
    } catch (error) {
      console.error('❌ 代理获取比特币历史数据失败:', error);
      throw error;
    }
  }

  /**
   * 获取组合图表数据（Bitcoin vs M2）
   */
  async fetchBitcoinVsM2Data(startDate?: string, endDate?: string): Promise<{
    m2: M2DataPoint[];
    bitcoin: BitcoinPricePoint[];
  }> {
    try {
      console.log('📊 通过代理获取Bitcoin vs M2组合数据...');
      
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const url = `${this.serverBaseUrl}/api/chart/bitcoin-vs-m2${params.toString() ? '?' + params.toString() : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`代理服务器错误: ${response.status} ${response.statusText}`);
      }
      
      const result: ProxyAPIResponse<{
        m2: M2DataPoint[];
        bitcoin: BitcoinPricePoint[];
      }> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '获取组合数据失败');
      }
      
      console.log('✅ 成功获取Bitcoin vs M2组合数据');
      return result.data;
      
    } catch (error) {
      console.error('❌ 代理获取组合数据失败:', error);
      throw error;
    }
  }

  /**
   * 检查代理服务器状态
   */
  async checkServerHealth(): Promise<boolean> {
    try {
      const healthUrl = `${this.serverBaseUrl}/health`;
      console.log('🔍 [ProxyDataService] 检查服务器健康状态:', healthUrl);
      
      const response = await fetch(healthUrl);
      console.log('📊 [ProxyDataService] 健康检查响应:', response.status, response.statusText);
      
      if (response.ok) {
        const healthData = await response.json();
        console.log('💚 [ProxyDataService] 服务器健康状态:', healthData);
      }
      
      return response.ok;
    } catch (error) {
      console.error('❌ [ProxyDataService] 代理服务器不可用:', error);
      console.error('🚨 [ProxyDataService] 健康检查错误:', error.message);
      return false;
    }
  }

  /**
   * 获取服务器信息
   */
  async getServerInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.serverBaseUrl}/health`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('服务器不可用');
    } catch (error) {
      console.error('❌ 获取服务器信息失败:', error);
      throw error;
    }
  }

  /**
   * 获取最新新闻数据
   */
  async fetchLatestNews(limit: number = 6): Promise<NewsItem[]> {
    try {
      console.log('📰 通过代理获取最新新闻...');

      const url = `${this.serverBaseUrl}/api/news/latest?limit=${limit}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`代理服务器错误: ${response.status} ${response.statusText}`);
      }

      const result: ProxyAPIResponse<NewsItem[]> & {
        totalCount: number;
        cached: boolean;
        lastUpdated: string;
      } = await response.json();

      if (!result.success) {
        throw new Error(result.error || '获取新闻数据失败');
      }

      console.log(`✅ 成功获取 ${result.data.length} 条新闻 (缓存: ${result.cached})`);
      return result.data;

    } catch (error) {
      console.error('❌ 代理获取新闻数据失败:', error);
      throw error;
    }
  }

  /**
   * 手动刷新新闻缓存
   */
  async refreshNewsCache(): Promise<void> {
    try {
      console.log('🔄 手动刷新新闻缓存...');

      const url = `${this.serverBaseUrl}/api/news/refresh`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`代理服务器错误: ${response.status} ${response.statusText}`);
      }

      const result: ProxyAPIResponse<any> & {
        message: string;
        totalCount: number;
      } = await response.json();

      if (!result.success) {
        throw new Error(result.error || '刷新新闻缓存失败');
      }

      console.log(`✅ 新闻缓存刷新成功，获取 ${result.totalCount} 条新闻`);

    } catch (error) {
      console.error('❌ 刷新新闻缓存失败:', error);
      throw error;
    }
  }
}

// 创建单例实例
export const proxyDataService = new ProxyDataService();

export default ProxyDataService;
