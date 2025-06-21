import React, { useState, useEffect } from 'react';
import BitcoinDataGrid from '../components/bitcoin/BitcoinDataGrid';
import DataComparisonChart from '../components/bitcoin/DataComparisonChart';
import SupplyComparisonChart from '../components/bitcoin/SupplyComparisonChart';
import { simpleBitcoinService, formatPrice, formatPercentage, formatMarketCap } from '../services/simpleBitcoinService';

const Home = () => {
  const [bitcoinData, setBitcoinData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchBitcoinData = async () => {
    try {
      setIsLoading(true);
      console.log('🏠 首页获取比特币数据...');

      // 获取比特币当前价格和回报率数据
      const [priceData, returnsData] = await Promise.all([
        simpleBitcoinService.getCurrentData(),
        simpleBitcoinService.getReturnsData()
      ]);

      const formattedBitcoinData = {
        price: formatPrice(priceData.price),
        threeMonthReturn: formatPercentage(returnsData.threeMonthReturn),
        oneYearReturn: formatPercentage(returnsData.oneYearReturn),
        tenYearReturn: formatPercentage(returnsData.tenYearReturn),
        marketCap: formatMarketCap(priceData.marketCap)
      };

      setBitcoinData(formattedBitcoinData);
      setLastUpdated(new Date().toLocaleTimeString('zh-CN'));
      console.log('✅ 首页比特币数据获取成功');
    } catch (error) {
      console.error('❌ 首页比特币数据获取失败:', error);
      // 设置默认数据以防止显示空白
      setBitcoinData({
        price: '$--,---',
        threeMonthReturn: '--%',
        oneYearReturn: '--%',
        tenYearReturn: '--%',
        marketCap: '$-.-T'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    console.log('🔄 手动刷新比特币数据...');
    fetchBitcoinData();
  };

  useEffect(() => {
    fetchBitcoinData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="mb-12">
              <img
                src="/calligraphy.png"
                alt="长丰数智书法字体"
                className="h-48 w-auto mx-auto drop-shadow-2xl"
              />
            </div>
            <p className="text-2xl md:text-3xl mb-12 text-white/95 font-light tracking-wide">打造亚洲首家比特币银行</p>
            <div className="mt-12">
              <a href="/business" className="bg-white text-blue-700 font-semibold py-4 px-10 rounded-full hover:bg-blue-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 inline-block">
                了解更多
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-10 rounded-2xl shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h2 className="text-3xl font-bold text-blue-700 mb-6">公司使命</h2>
              <p className="text-gray-700 text-xl font-medium">打造亚洲首家比特币银行</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-10 rounded-2xl shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h2 className="text-3xl font-bold text-blue-700 mb-6">公司愿景</h2>
              <p className="text-gray-700 text-xl font-medium">人人皆有数字资产</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Quote Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <blockquote className="text-center">
            <p className="text-3xl md:text-4xl font-medium text-gray-900 italic leading-relaxed">
              "我们是比特币共识的早期布道者、信仰者和先行者。"
            </p>
            <p className="text-xl text-blue-600 mt-6 font-semibold">
              打造亚洲第一个比特币银行
            </p>
          </blockquote>
        </div>
      </section>

      {/* Bitcoin Evangelism Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">比特币布道</h2>
            <p className="text-2xl text-blue-600 font-medium">用数字说明真理，用言语启发智慧</p>
          </div>

          {/* Bitcoin Real-time Data Section */}
          <div className="mb-20">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-bold text-gray-900">比特币实时数据</h3>
              <div className="flex items-center space-x-4">
                {lastUpdated && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    最后更新: {lastUpdated}
                  </span>
                )}
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className={`
                    flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                    ${isLoading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:transform active:scale-95'
                    }
                  `}
                >
                  <svg
                    className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>{isLoading ? '刷新中...' : '刷新数据'}</span>
                </button>
              </div>
            </div>
            <BitcoinDataGrid data={bitcoinData} isLoading={isLoading} />
          </div>

          {/* Bitcoin Data Comparison Charts */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">比特币数据对比分析</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <DataComparisonChart title="Bitcoin vs Major M2" />
              <DataComparisonChart title="Dollar PPP vs 1 Bitcoin" />
              <DataComparisonChart title="Bitcoin Supply vs Inflation Rate" />
              <SupplyComparisonChart />
            </div>
          </div>

          {/* Our Bitcoin Perspective */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-12 rounded-3xl shadow-xl border border-blue-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">我们对比特币的看法</h3>
            <div className="prose max-w-none text-gray-700">
              <p className="text-xl leading-relaxed mb-6">
                比特币不仅仅是一种数字货币，更是一场金融革命的开端。作为去中心化数字资产的先驱，比特币代表了货币体系的根本性变革。
              </p>
              <p className="text-xl leading-relaxed mb-6">
                我们坚信比特币的长期价值源于其稀缺性、去中心化特性以及作为价值存储工具的独特地位。在全球货币政策不确定性增加的背景下，比特币为投资者提供了对冲通胀和货币贬值的有效工具。
              </p>
              <p className="text-xl leading-relaxed">
                长丰数智致力于通过专业的投资策略和风险管理，为投资者提供参与这一历史性变革的机会，共同见证数字资产时代的到来。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Business Introduction */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">核心业务介绍</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-3xl font-bold">₿</span>
                </div>
                <h3 className="text-2xl font-bold text-blue-700">比特币储备</h3>
              </div>
              <p className="text-gray-700 text-center text-lg leading-relaxed">
                完成上市公司收购，以此为平台建立比特币储备，除持币增值外，享受二级市场溢价、资金池杠杆效应。
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-3xl font-bold">🏦</span>
                </div>
                <h3 className="text-2xl font-bold text-blue-700">BTCFi</h3>
              </div>
              <p className="text-gray-700 text-center text-lg leading-relaxed">
                建立Bitcoin De-Fi流通网络，提供底层为智能合约、以比特币作为原生资产的借贷、衍生品交易、流动性质押服务。
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-3xl font-bold">🔗</span>
                </div>
                <h3 className="text-2xl font-bold text-blue-700">资产原生与孪生化</h3>
              </div>
              <p className="text-gray-700 text-center text-lg leading-relaxed">
                通过与合规交易所合作，发行比特币ETF，为传统投资者拓宽投资渠道。致力于实现港股首个股权上链项目。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">关于长丰数智</h2>
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-white p-12 rounded-3xl shadow-xl border border-blue-100">
              <p className="text-xl leading-relaxed text-gray-700 mb-8">
                依托香港的金融监管体系、专业投资管理团队和比特币聚焦战略，长丰数智致力为股东打造合规、高效的数字资产投资平台，成为亚洲版"微策略"。
              </p>
              <p className="text-xl leading-relaxed text-gray-700 mb-8">
                我们将利用上市公司平台获取二级市场溢价，同时通过资金池杠杆效应，结合股权与债券融资模式投资比特币，以成为亚洲最大的比特币储备机构。
              </p>
              <p className="text-xl leading-relaxed text-gray-700">
                此外，我们将建立BTCFi流通网络，打造亚洲首家、规模最大的比特币银行。通过积极开展投资者教育和比特币普及工作，我们将推动世界金融与信息革命的进程，助力香港发展成为全球加密金融中心。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Development Plan Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">未来发展规划</h2>

          {/* Development Plan Image */}
          <div className="mb-16">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-blue-100">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-blue-700">长丰数智发展规划示意图</h3>
              </div>
              <div className="flex justify-center">
                <img
                  src="/发展路线.png"
                  alt="长丰数智发展规划示意图"
                  className="max-w-full h-auto rounded-2xl shadow-lg"
                  style={{ maxHeight: '600px' }}
                  onError={(e) => {
                    console.log('发展路线图片加载失败');
                    // 如果图片加载失败，显示备用内容
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) {
                      fallback.classList.remove('hidden');
                    }
                  }}
                />
                <div className="hidden h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center w-full">
                  <div className="text-center">
                    <span className="text-blue-700 text-2xl font-semibold">长丰数智发展规划示意图</span>
                    <p className="text-blue-500 mt-3 text-lg">图片加载中...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Three Strategic Approaches */}
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">三大经营策略</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300">
              <h4 className="text-2xl font-bold text-blue-700 mb-4">储备策略</h4>
              <p className="text-gray-700 text-lg leading-relaxed">选择权威托管机构并定期公布经权威审计机构的托管结果。利用比特币分布式账本的特征，实时公开持币量、每股含币量。</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300">
              <h4 className="text-2xl font-bold text-blue-700 mb-4">风险管理</h4>
              <p className="text-gray-700 text-lg leading-relaxed">采用定投策略分散购买成本。相信BTC的长期价值，以长期持有作为最主要的增值手段。</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300">
              <h4 className="text-2xl font-bold text-blue-700 mb-4">合规框架</h4>
              <p className="text-gray-700 text-lg leading-relaxed">遵守香港证券及期货事务监察委员会（SFC）的监管要求，确保KYC和AML政策落实，并定时披露公司财务信息。</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-8">加入长丰数智，共创数字资产未来</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="/about" className="bg-white text-blue-600 font-bold py-4 px-10 rounded-full hover:bg-blue-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 inline-block">
              联系我们
            </a>
            <a href="/research" className="bg-transparent border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 inline-block">
              了解研究成果
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
