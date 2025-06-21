/**
 * 调度服务
 * 管理数据的定期更新和手动更新
 */

import DataScrapingService from './dataScrapingService';
import DataStorageService from './dataStorageService';

interface UpdateResult {
  success: boolean;
  dataPoints: number;
  error?: string;
  timestamp: string;
}

export class SchedulerService {
  private scrapingService: DataScrapingService;
  private storageService: DataStorageService;
  private updateInterval: NodeJS.Timeout | null = null;
  private isUpdating = false;

  constructor() {
    this.scrapingService = new DataScrapingService();
    this.storageService = new DataStorageService();
  }

  /**
   * 启动定期更新调度
   */
  startScheduler(): void {
    // 每天检查一次是否需要更新
    const checkInterval = 24 * 60 * 60 * 1000; // 24小时
    
    this.updateInterval = setInterval(() => {
      this.checkAndUpdate();
    }, checkInterval);
    
    console.log('⏰ 定期更新调度已启动');
    
    // 立即检查一次
    this.checkAndUpdate();
  }

  /**
   * 停止定期更新调度
   */
  stopScheduler(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log('⏹️ 定期更新调度已停止');
    }
  }

  /**
   * 检查是否需要更新
   */
  private async checkAndUpdate(): Promise<void> {
    try {
      const now = new Date();
      const status = this.storageService.loadUpdateStatus();
      
      // 如果正在更新，跳过
      if (this.isUpdating || status.isUpdating) {
        console.log('⏳ 数据更新正在进行中，跳过此次检查');
        return;
      }
      
      // 检查是否需要更新（每月1号或缓存过期）
      const shouldUpdate = this.shouldUpdateData(status.lastUpdate);
      
      if (shouldUpdate) {
        console.log('🔄 检测到需要更新数据');
        await this.updateData();
      } else {
        console.log('✅ 数据是最新的，无需更新');
      }
      
    } catch (error) {
      console.error('❌ 检查更新失败:', error);
    }
  }

  /**
   * 判断是否应该更新数据
   */
  private shouldUpdateData(lastUpdate: string | null): boolean {
    if (!lastUpdate) {
      return true; // 从未更新过
    }
    
    const lastUpdateDate = new Date(lastUpdate);
    const now = new Date();
    
    // 如果缓存无效，需要更新
    if (!this.storageService.isCacheValid()) {
      return true;
    }
    
    // 如果是新的月份，需要更新
    if (now.getMonth() !== lastUpdateDate.getMonth() || 
        now.getFullYear() !== lastUpdateDate.getFullYear()) {
      return true;
    }
    
    // 如果距离上次更新超过7天，也更新一次
    const daysSinceUpdate = (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 7) {
      return true;
    }
    
    return false;
  }

  /**
   * 手动触发数据更新
   */
  async manualUpdate(): Promise<UpdateResult> {
    console.log('🔄 手动触发数据更新');
    return await this.updateData();
  }

  /**
   * 执行数据更新
   */
  private async updateData(): Promise<UpdateResult> {
    const startTime = new Date().toISOString();
    
    try {
      // 设置更新状态
      this.isUpdating = true;
      this.storageService.saveUpdateStatus({
        isUpdating: true,
        lastUpdate: null,
        nextUpdate: this.getNextUpdateTime(),
        error: null
      });
      
      console.log('🚀 开始数据更新...');
      
      // 获取实时数据
      const chartData = await this.scrapingService.generateChartData();
      
      // 验证数据
      if (!this.storageService.validateData(chartData)) {
        throw new Error('数据验证失败');
      }
      
      // 保存数据
      this.storageService.saveData(chartData, 'realtime');
      
      // 更新状态
      const endTime = new Date().toISOString();
      this.storageService.saveUpdateStatus({
        isUpdating: false,
        lastUpdate: endTime,
        nextUpdate: this.getNextUpdateTime(),
        error: null
      });
      
      console.log(`✅ 数据更新完成 (${chartData.length} 个数据点)`);
      
      return {
        success: true,
        dataPoints: chartData.length,
        timestamp: endTime
      };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      
      // 保存错误状态
      this.storageService.saveUpdateStatus({
        isUpdating: false,
        lastUpdate: null,
        nextUpdate: this.getNextUpdateTime(),
        error: errorMessage
      });
      
      console.error('❌ 数据更新失败:', errorMessage);
      
      return {
        success: false,
        dataPoints: 0,
        error: errorMessage,
        timestamp: new Date().toISOString()
      };
      
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * 计算下次更新时间
   */
  private getNextUpdateTime(): string {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toISOString();
  }

  /**
   * 获取更新状态
   */
  getUpdateStatus() {
    return this.storageService.loadUpdateStatus();
  }

  /**
   * 获取缓存信息
   */
  getCacheInfo() {
    return this.storageService.getCacheInfo();
  }

  /**
   * 清除所有数据和缓存
   */
  clearAllData(): void {
    this.storageService.clearCache();
    console.log('🗑️ 所有数据和缓存已清除');
  }

  /**
   * 获取数据统计信息
   */
  getDataStats() {
    const cached = this.storageService.loadData();
    if (!cached) {
      return null;
    }
    
    return this.storageService.getDataStats(cached.data);
  }
}

export default SchedulerService;
