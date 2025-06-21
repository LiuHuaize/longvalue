/**
 * 数据存储和缓存服务
 * 管理实时数据的本地存储和缓存
 */

interface CachedData {
  data: any[];
  timestamp: number;
  version: string;
  source: 'realtime' | 'mock';
}

interface DataUpdateStatus {
  isUpdating: boolean;
  lastUpdate: string | null;
  nextUpdate: string | null;
  error: string | null;
}

export class DataStorageService {
  private cacheKey = 'bitcoin_m2_chart_data';
  private statusKey = 'data_update_status';
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24小时缓存

  /**
   * 保存数据到本地存储
   */
  saveData(data: any[], source: 'realtime' | 'mock' = 'realtime'): void {
    try {
      const cachedData: CachedData = {
        data,
        timestamp: Date.now(),
        version: this.generateVersion(),
        source
      };
      
      localStorage.setItem(this.cacheKey, JSON.stringify(cachedData));
      console.log(`💾 数据已保存 (${data.length} 个数据点, 来源: ${source})`);
      
    } catch (error) {
      console.error('❌ 保存数据失败:', error);
    }
  }

  /**
   * 从本地存储加载数据
   */
  loadData(): CachedData | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) {
        return null;
      }
      
      const cachedData: CachedData = JSON.parse(cached);
      
      // 检查缓存是否过期
      if (Date.now() - cachedData.timestamp > this.cacheExpiry) {
        console.log('⏰ 缓存已过期');
        return null;
      }
      
      console.log(`📂 加载缓存数据 (${cachedData.data.length} 个数据点, 来源: ${cachedData.source})`);
      return cachedData;
      
    } catch (error) {
      console.error('❌ 加载数据失败:', error);
      return null;
    }
  }

  /**
   * 检查缓存是否有效
   */
  isCacheValid(): boolean {
    const cached = this.loadData();
    return cached !== null;
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    try {
      localStorage.removeItem(this.cacheKey);
      localStorage.removeItem(this.statusKey);
      console.log('🗑️ 缓存已清除');
    } catch (error) {
      console.error('❌ 清除缓存失败:', error);
    }
  }

  /**
   * 保存更新状态
   */
  saveUpdateStatus(status: DataUpdateStatus): void {
    try {
      localStorage.setItem(this.statusKey, JSON.stringify(status));
    } catch (error) {
      console.error('❌ 保存更新状态失败:', error);
    }
  }

  /**
   * 加载更新状态
   */
  loadUpdateStatus(): DataUpdateStatus {
    try {
      const cached = localStorage.getItem(this.statusKey);
      if (!cached) {
        return {
          isUpdating: false,
          lastUpdate: null,
          nextUpdate: null,
          error: null
        };
      }
      
      return JSON.parse(cached);
      
    } catch (error) {
      console.error('❌ 加载更新状态失败:', error);
      return {
        isUpdating: false,
        lastUpdate: null,
        nextUpdate: null,
        error: null
      };
    }
  }

  /**
   * 生成数据版本号
   */
  private generateVersion(): string {
    const now = new Date();
    return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
  }

  /**
   * 获取缓存信息
   */
  getCacheInfo(): {
    hasCache: boolean;
    cacheAge: number;
    dataPoints: number;
    source: string;
    version: string;
  } | null {
    const cached = this.loadData();
    
    if (!cached) {
      return null;
    }
    
    return {
      hasCache: true,
      cacheAge: Date.now() - cached.timestamp,
      dataPoints: cached.data.length,
      source: cached.source,
      version: cached.version
    };
  }

  /**
   * 数据验证
   */
  validateData(data: any[]): boolean {
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }
    
    // 检查数据结构
    const requiredFields = ['date', 'm2', 'bitcoin'];
    const isValid = data.every(item => 
      requiredFields.every(field => field in item && item[field] !== null && item[field] !== undefined)
    );
    
    if (!isValid) {
      console.error('❌ 数据验证失败: 缺少必要字段');
      return false;
    }
    
    // 检查数据范围
    const hasValidValues = data.every(item => 
      typeof item.m2 === 'number' && 
      typeof item.bitcoin === 'number' && 
      item.bitcoin > 0 &&
      item.m2 > -50 && item.m2 < 100 // M2增长率合理范围
    );
    
    if (!hasValidValues) {
      console.error('❌ 数据验证失败: 数值超出合理范围');
      return false;
    }
    
    console.log('✅ 数据验证通过');
    return true;
  }

  /**
   * 数据统计信息
   */
  getDataStats(data: any[]): {
    totalPoints: number;
    dateRange: { start: string; end: string };
    m2Range: { min: number; max: number };
    bitcoinRange: { min: number; max: number };
  } {
    if (!data || data.length === 0) {
      throw new Error('无数据可统计');
    }
    
    const dates = data.map(item => item.date).sort();
    const m2Values = data.map(item => item.m2);
    const bitcoinValues = data.map(item => item.bitcoin);
    
    return {
      totalPoints: data.length,
      dateRange: {
        start: dates[0],
        end: dates[dates.length - 1]
      },
      m2Range: {
        min: Math.min(...m2Values),
        max: Math.max(...m2Values)
      },
      bitcoinRange: {
        min: Math.min(...bitcoinValues),
        max: Math.max(...bitcoinValues)
      }
    };
  }
}

export default DataStorageService;
