import React from 'react';

const Investor = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">投资者关系</h1>
            <p className="text-xl max-w-3xl mx-auto">
              长丰数智致力为股东创造长期可持续的价值，并深信有效管理与持份者关系对公司发展极为重要
            </p>
          </div>
        </div>
      </section>

      {/* Investor Relations Main Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700">
              长丰数智致力为股东创造长期可持续的价值，并深信有效管理与持份者（包括投资者）关系，对公司发展极为重要。我们确信为创造长期价值，公司的目标必须与股东目标一致，并希望股东认同我们坚持可持续的长期增长优于短期利益的理念。
            </p>
            <p className="text-gray-700 mt-4">
              长丰数智明白本身有责任促进公司与股东的交流及回应股东的提问。我们致力提高透明度，适时披露相关及重大信息。我们定期与投资者会面，汇报公司在数字资产领域的最新进展及策略。此外，当接获传媒及个别股东查询时，我们均及时回复。我们亦致力分享相关的财务及非财务信息，并通过定期报告与其他通讯清晰阐述长丰数智的商业策略。在任何情况下，本公司均采取审慎态度，确保信息披露的公平性。所有重要公告都将同步在公司网站发布。
            </p>
          </div>
        </div>
      </section>

      {/* Stock Information Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">股价信息</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 italic">暂无</p>
          </div>
        </div>
      </section>

      {/* Listing Documents Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">上市文件</h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <p className="text-gray-700 italic">暂无</p>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">公告和通函</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 italic">暂无</p>
          </div>
        </div>
      </section>

      {/* Financial Reports Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">财务报告</h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <p className="text-gray-700 italic">暂无</p>
          </div>
        </div>
      </section>

      {/* IR Rules Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">投资者关系规则</h2>
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-gray-700">
              长丰数智的投资者关系以主动与市场沟通为宗旨，致力于提升企业在国际数字资产市场中的透明度和吸引力，让资本市场能够对长丰数智的业务价值作出真实和公平的评价。
            </p>
            <p className="text-gray-700 mt-4">
              长丰数智以真诚态度对待所有股东。公司的管理层及投资者关系团队将始终坚守这个宗旨。
            </p>
          </div>

          {/* 投资者关系规则图片 */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <img
                src="/投资者关系.jpg"
                alt="投资者关系规则"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '600px' }}
              />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">资料政策</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>长丰数智致力于向市场及时提供准确、完整、透明和清晰的资料。</li>
                <li>公司的投资者关系团队以开放的态度，积极回应投资者、分析员及其他利益相关者的问题。</li>
                <li>在公布资料时，我们确保所有利益相关者都能同时获取信息。</li>
                <li>公司承诺，无论是正面或负面消息，都将保持一致的披露标准。</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">投资者关系沟通渠道</h3>
              <p className="text-gray-700">
                长丰数智通过公司网站发布信息，确保所有利益相关者可同时获取资料。网站的投资者关系专区包含最新及历史资料，如推介材料及公告等。网站提供中、英文版本，所有最新资料会同时以中英文上载。
              </p>
              <p className="text-gray-700 mt-4">
                长丰数智定期发布公告、年报及中期报告，确保利益相关者及时了解公司最新战略及经营发展情况。公告将按香港上市条例通过香港联交所网站发布。
              </p>
            </div>
          </div>

          {/* 新增的投资者关系活动部分 */}
          <div className="mt-12 space-y-8">
            {/* 投资者会议 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">投资者会议</h3>
              <p className="text-gray-700">
                长丰数智在发布业绩时会举行投资者及分析师说明会，并提供网上直播及演示文稿，方便利益相关者实时了解会议内容。
              </p>
            </div>

            {/* 投资者活动 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">投资者活动</h3>
              <p className="text-gray-700">
                长丰数智定期与投资者及分析师会面，参与投资者路演及行业会议。在这些活动中，公司严格遵守信息披露制度，不会讨论或透露内部信息。
              </p>
            </div>

            {/* 股东周年大会 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">股东周年大会</h3>
              <p className="text-gray-700">
                股东周年大会是长丰数智每年最重要的会议之一。在会上，股东可就公司发展提出建议、向管理层提问，并就会议议程进行投票。会议详情及投票结果将在公司网站公布。
              </p>
            </div>

            {/* 谣言及前瞻声明 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">谣言及前瞻声明</h3>
              <p className="text-gray-700 mb-4">
                长丰数智不对市场谣言作出评论。如果谣言对公司股价造成重大影响，公司将通知香港联交所，并在必要时发布澄清声明。
              </p>
              <p className="text-gray-700">
                长丰数智原则上不对未来发展作出推测，也不提供具体的业绩预测。如果公司无意中作出前瞻性陈述，将严格遵照上市条例处理。
              </p>
            </div>

            {/* 静默期 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">静默期</h3>
              <p className="text-gray-700">
                为确保重要信息（如财务业绩）披露的公平性，长丰数智在公布全年业绩前两个月以及中期业绩前一个月实施静默期。在静默期间，公司不会就行业前景、业务表现及财务业绩发表评论。
              </p>
            </div>
          </div>

          {/* 新增投资者关系图片 */}
          <div className="mt-12 flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <img
                src="/Investor-Relations.webp"
                alt="投资者关系展示"
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '500px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact IR Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">联络方式</h2>
            <p className="text-xl">
              如有任何关于投资者关系的问题，请随时与我们联系
            </p>
          </div>

          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-blue-700 mb-6">投资者关系联系人</h3>

              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-lg">李屹冉</p>
                  <p className="text-gray-600">长丰数智CEO助理</p>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-medium">邮箱：</span>
                    <a href="mailto:ryanli@longvaluehk.com" className="text-blue-600 hover:text-blue-800">
                      ryanli@longvaluehk.com
                    </a>
                  </div>

                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-medium">电话：</span>
                    <a href="tel:+85246771429" className="text-blue-600 hover:text-blue-800">
                      (+852) 4677 1429
                    </a>
                  </div>

                  <div className="flex items-center justify-center space-x-2">
                    <span className="font-medium">地址：</span>
                    <span className="text-gray-700">
                      香港数码港第三座 Core C, Smart Space FinTech2, 99-100
                    </span>
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

export default Investor;
