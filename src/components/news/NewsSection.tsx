import React, { useState, useEffect } from 'react';
import { proxyDataService } from '../../services/proxyDataService';

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

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // 获取新闻数据
  const fetchNews = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      
      const newsData = await proxyDataService.fetchLatestNews(6);
      setNews(newsData);
      
    } catch (err) {
      console.error('获取新闻失败:', err);
      setError(err instanceof Error ? err.message : '获取新闻失败');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  // 手动刷新新闻
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      // 先刷新缓存
      await proxyDataService.refreshNewsCache();
      
      // 然后获取新数据
      await fetchNews(false);
      
    } catch (err) {
      console.error('刷新新闻失败:', err);
      setError(err instanceof Error ? err.message : '刷新新闻失败');
    } finally {
      setRefreshing(false);
    }
  };

  // 格式化发布时间
  const formatPublishTime = (publishedAt: string) => {
    try {
      const date = new Date(publishedAt);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffDays > 0) {
        return `${diffDays}天前`;
      } else if (diffHours > 0) {
        return `${diffHours}小时前`;
      } else {
        return '刚刚';
      }
    } catch {
      return '未知时间';
    }
  };

  // 获取来源颜色
  const getSourceColor = (source: string) => {
    const colors: { [key: string]: string } = {
      'CoinDesk': 'bg-blue-100 text-blue-800',
      'CoinTelegraph': 'bg-green-100 text-green-800',
      'Bitcoin Magazine': 'bg-orange-100 text-orange-800',
      'Decrypt': 'bg-purple-100 text-purple-800'
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchNews();

    // 设置定时检查，每30分钟检查一次是否需要刷新
    const interval = setInterval(() => {
      console.log('📰 定时检查新闻更新...');
      fetchNews(false); // 静默刷新，不显示loading
    }, 30 * 60 * 1000); // 30分钟

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">新闻资讯板块</h3>
          <p className="text-gray-600">正在获取最新新闻...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">新闻加载失败</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchNews()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-8">
        <div className="text-center flex-1">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">新闻资讯板块</h3>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            实时跟踪全球比特币相关新闻动态，为您提供最新的市场资讯和行业发展信息。
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`ml-4 px-4 py-2 rounded-lg transition-colors ${
            refreshing 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {refreshing ? (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新中...
            </div>
          ) : (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新新闻
            </div>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item.id} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(item.source)}`}>
                {item.source}
              </span>
              <span className="text-xs text-gray-500">
                {formatPublishTime(item.publishedAt)}
              </span>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-900 mb-3 overflow-hidden" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {item.title.trim()}
            </h4>

            <p className="text-gray-600 mb-4 text-sm overflow-hidden" style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical'
            }}>
              {item.summary}
            </p>
            
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              阅读全文
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        ))}
      </div>

      {news.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">暂无新闻数据</p>
        </div>
      )}
    </div>
  );
};

export default NewsSection;
