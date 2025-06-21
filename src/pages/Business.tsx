import React from 'react';

const Business = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">业务介绍</h1>
            <p className="text-xl max-w-3xl mx-auto">
              长丰数智致力于打造亚洲首家比特币银行，提供专业的数字资产服务
            </p>
          </div>
        </div>
      </section>

      {/* Business Strategy Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">三大经营策略</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">储备策略</h3>
              <p className="text-gray-700">
                选择权威托管机构并定期公布经权威审计机构的托管结果。利用比特币分布式账本的特征，实时公开持币量、每股含币量。
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">风险管理</h3>
              <p className="text-gray-700">
                采用定投策略分散购买成本。相信BTC的长期价值，以长期持有作为最主要的增值手段。
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">合规框架</h3>
              <p className="text-gray-700">
                遵守香港证券及期货事务监察委员会（SFC）的监管要求，确保KYC和AML政策落实，并定时披露公司财务信息。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Business Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">三大核心业务</h2>
          <div className="space-y-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">1. 比特币储备</h3>
              <p className="text-gray-700 text-lg">
                完成上市公司收购，以此为平台建立比特币储备，除持币增值外，享受二级市场溢价、资金池杠杆效应。
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">2. BTCFi</h3>
              <p className="text-gray-700 text-lg">
                建立Bitcoin De-Fi流通网络，提供底层为智能合约、以比特币作为原生资产的借贷、衍生品交易、流动性质押服务，充足发挥现有比特币的流通属性。同时为客户提供高标准、透明的加密资产托管服务。
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">3. 资产原生与孪生化</h3>
              <p className="text-gray-700 text-lg">
                通过与合规交易所合作，发行比特币ETF，为传统投资者拓宽投资渠道。同时，致力于实现港股首个股权上链项目，提升数字资产生态的流动性。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Competitiveness Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">核心竞争力</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">融资</h3>
              <p className="text-gray-700">
                丰富的私行等从业经验，具有深厚的金融行业人脉，深度链接内地、香港的各类主流金融机构以及家办资源，为发展提供充足资金。专业的资金规划能力，合理组合使用可转债、抵押债、ATM等，保证公司获取资金成本有竞争力。
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">投资</h3>
              <p className="text-gray-700">
                资深金融团队负责BTC投资操盘由一级股权投资、二级股票投资、固收投资及加密货币投资的资深专业从业者共同组成投资委员会，集体负责BTC投资决策。
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">资深的BTC团队负责布道</h3>
              <p className="text-gray-700">
                团队对BTC的价值和前景有专业、前瞻的深度认知。具有成功的自媒体运营经验，打造比特币教育的媒体矩阵，建立与各种背景比特币投资人等的直接联系渠道。
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">成熟的公司管理能力</h3>
              <p className="text-gray-700">
                核心团队有科技行业的成功创业经验以及多家知名公司的从业经验，具有丰富的管理经验，而且团队中多个成员有着多年的深度合作关系，价值观相近、技能互补、磨合成本低、可以有效提高公司运营效率。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">了解更多业务详情</h2>
          <div>
            <a href="/contact" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300">
              联系我们
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Business;
