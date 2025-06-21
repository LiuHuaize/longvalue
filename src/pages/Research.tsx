import React from 'react';
import NewsSection from '../components/news/NewsSection';

const Research = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">长丰加密研究所</h1>
            <p className="text-xl max-w-3xl mx-auto">
              专业的加密货币研究与分析平台
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">关于长丰加密研究所</h2>
          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">研究所简介</h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                长丰加密研究所致力于为投资者和行业参与者提供专业、客观的加密货币研究分析。
                我们专注于深度研究和数据驱动的洞察，帮助理解数字资产市场的发展趋势。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">专业研究</h4>
                <p className="text-gray-600">深入的市场分析和技术研究</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">数据驱动</h4>
                <p className="text-gray-600">基于真实数据的客观分析</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">前瞻视野</h4>
                <p className="text-gray-600">把握行业发展趋势和机遇</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">比特币新闻跟踪</h2>
          <NewsSection />
        </div>
      </section>

      {/* Research Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">比特币行业研究</h2>
          <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">深度研究板块</h3>
              <p className="text-gray-600 max-w-3xl mx-auto mb-8">
                提供专业的比特币行业分析报告，深入研究市场机制、技术发展和投资策略。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">研究报告</h4>
                <p className="text-gray-600 mb-4">定期发布专业的行业分析报告</p>
                <div className="space-y-3">
                  <div className="h-20 bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500 text-sm">报告内容预留区域</p>
                  </div>
                  <div className="h-20 bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500 text-sm">报告内容预留区域</p>
                  </div>
                  <div className="h-20 bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500 text-sm">报告内容预留区域</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">数据分析</h4>
                <p className="text-gray-600 mb-4">基于数据的客观市场分析</p>
                <div className="space-y-3">
                  <div className="h-20 bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500 text-sm">数据分析预留区域</p>
                  </div>
                  <div className="h-20 bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500 text-sm">数据分析预留区域</p>
                  </div>
                  <div className="h-20 bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500 text-sm">数据分析预留区域</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Research;
