import React from 'react';

const Team = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">团队介绍</h1>
            <p className="text-xl max-w-3xl mx-auto">
              长丰数智拥有一支专业、经验丰富的管理团队，致力于推动数字资产行业的发展
            </p>
          </div>
        </div>
      </section>

      {/* Management Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">管理团队</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-700">郭翔</h3>
                <p className="text-gray-500 mb-4">长丰数智有限公司联合创始人兼CEO</p>
                <p className="text-gray-700">
                  毕业于浙江大学，获信息与电子工程学士学位，长江商学院EMBA。曾在大型通信设备企业和民营上市公司担任高管职务，在公司运营、市场推广和技术管理等领域拥有丰富经验。
                </p>
                <p className="text-gray-700 mt-2">
                  自公司创立以来，主要负责整体运营以及战略制定和市场推广工作。
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-700">许佳</h3>
                <p className="text-gray-500 mb-4">长丰数智有限公司联合创始人</p>
                <p className="text-gray-700">
                  毕业于浙江大学，获国际贸易学士学位及金融学硕士学位，后获中欧商学院金融学硕士。许佳拥有超过15年的金融行业从业经验，在一二级市场投资领域具有独特的战略眼光和专业见解。
                </p>
                <p className="text-gray-700 mt-2">
                  她主要负责公司的资本市场融资战略，以及投资者关系的建立和维护。
                </p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-700">梅杰</h3>
                <p className="text-gray-500 mb-4">长丰数智有限公司联合创始人</p>
                <p className="text-gray-700">
                  本科毕业于浙江大学材料专业。梅杰曾创办了小麦助教和Panda英语。他对软件服务、互联网技术和信息化管理拥有深厚的专业知识，现负责公司的技术研发和软件开发工作。
                </p>
                <p className="text-gray-700 mt-2">
                  作为加密货币的早期投资者，梅杰在虚拟资产投资领域具备专业见解。
                </p>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-700">刘宏波</h3>
                <p className="text-gray-500 mb-4">长丰数智有限公司CFO</p>
                <p className="text-gray-700">
                  毕业于南京大学历史学专业，曾在招商局资本投资部担任副总裁，拥有丰富的行业研究和VC实战经验。现负责公司募资、投资战略制定及投后管理。
                </p>
              </div>
            </div>

            {/* Team Member 5 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-700">马军</h3>
                <p className="text-gray-500 mb-4">长丰数智有限公司副总裁</p>
                <p className="text-gray-700">
                  本科及硕士均毕业于西安交通大学，分别获得热能工程学士学位和工商管理硕士学位。马军是中国知名的TMT行业分析师，专注于互联网、通信和数字经济等科技领域。马军曾担任工业和信息化部电信研究院规划所研究总监，并在多家知名证券公司担任通信行业首席分析师。
                </p>
                <p className="text-gray-700 mt-2">
                  他拥有丰富的上市公司及一二级市场资源，精通各类咨询工具和研究方法，致力于帮助公司高效对接资本平台、优化投资策略。
                </p>
              </div>
            </div>

            {/* Team Member 6 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-700">许磊</h3>
                <p className="text-gray-500 mb-4">长丰数智有限公司高级顾问</p>
                <p className="text-gray-700">
                  本科毕业于上海财经大学国际金融、经济法双学士学位，后获得长江商学院EMBA、加拿大英属哥伦比亚大学获工商管理硕士学位，持有美国特许金融分析师CFA持证人。许磊先生现任观砚投资的法人代表、总经理。曾就职于国际知名的投行负责中国区私募股权投资业务，主导多起复杂交易，包括退市、借壳、分拆、MBO、拆红筹等。
                </p>
                <p className="text-gray-700 mt-2">
                  许磊主要负责公司借壳上市项目，具体包括合规尽职调查、方案设计、投资人沟通及监管机构对接等工作，是公司对接资本市场的关键桥梁。
                </p>
              </div>
            </div>

            {/* Team Member 7 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
              <div className="p-6">
                <h3 className="text-xl font-bold text-blue-700">李屹冉</h3>
                <p className="text-gray-500 mb-4">长丰数智有限公司CEO助理</p>
                <p className="text-gray-700">
                  本科就读于香港大学经济与金融学位。现负责辅助CEO完成公司行政与运营事务，例如对外联络、活动组织、报告撰写等。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Competitiveness Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">核心竞争力</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">融资能力</h3>
              <p className="text-gray-700">
                丰富的私行等从业经验，具有深厚的金融行业人脉，深度链接内地、香港的各类主流金融机构以及家办资源，为发展提供充足资金。专业的资金规划能力，合理组合使用可转债、抵押债、ATM等，保证公司获取资金成本有竞争力。
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">投资能力</h3>
              <p className="text-gray-700">
                资深金融团队负责BTC投资操盘由一级股权投资、二级股票投资、固收投资及加密货币投资的资深专业从业者共同组成投资委员会，集体负责BTC投资决策。
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">资深BTC团队</h3>
              <p className="text-gray-700">
                团队对BTC的价值和前景有专业、前瞻的深度认知。具有成功的自媒体运营经验，打造比特币教育的媒体矩阵，建立与各种背景比特币投资人等的直接联系渠道。
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">成熟的公司管理能力</h3>
              <p className="text-gray-700">
                核心团队有科技行业的成功创业经验以及多家知名公司的从业经验，具有丰富的管理经验，而且团队中多个成员有着多年的深度合作关系，价值观相近、技能互补、磨合成本低、可以有效提高公司运营效率。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
