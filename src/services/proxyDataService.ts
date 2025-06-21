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
    // 本地后端服务器地址
    this.serverBaseUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
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
      console.log('₿ 通过代理获取比特币当前价格...');
      
      const url = `${this.serverBaseUrl}/api/bitcoin/price`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`代理服务器错误: ${response.status} ${response.statusText}`);
      }
      
      const result: ProxyAPIResponse<BitcoinCurrentPrice> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '获取比特币价格失败');
      }
      
      console.log('✅ 成功获取比特币当前价格');
      return result.data;
      
    } catch (error) {
      console.error('❌ 代理获取比特币价格失败:', error);
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
      const response = await fetch(`${this.serverBaseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('❌ 代理服务器不可用:', error);
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
