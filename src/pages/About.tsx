import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">关于我们</h1>
            <p className="text-xl max-w-3xl mx-auto">
              长丰数智致力于打造亚洲首家比特币银行，推动数字资产行业的发展
            </p>
          </div>
        </div>
      </section>

      {/* About Changfeng Digital Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">关于长丰数智</h2>
              <div className="prose prose-lg">
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  依托香港的金融监管体系、专业投资管理团队和比特币聚焦战略，长丰数智致力为股东打造合规、高效的数字资产投资平台，成为亚洲版"微策略"。我们将利用上市公司平台获取二级市场溢价，同时通过资金池杠杆效应，结合股权与债券融资模式投资比特币，以成为亚洲最大的比特币储备机构。
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  此外，我们将建立BTCFi流通网络，打造亚洲首家、规模最大的比特币银行。通过积极开展投资者教育和比特币普及工作，我们将推动世界金融与信息革命的进程，助力香港发展成为全球加密金融中心。
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-gray-100">
                <img
                  src="/长丰logo.png"
                  alt="长丰数智公司LOGO"
                  className="h-72 w-72 object-contain"
                  onError={(e) => {
                    console.log('长丰logo loading failed in About page');
                    // 如果图片加载失败，显示备用的圆形LOGO
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.classList.remove('hidden');
                    }
                  }}
                />
                <div className="w-72 h-72 bg-blue-600 rounded-full flex items-center justify-center hidden">
                  <span className="text-white text-6xl font-bold">长</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cyberport Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <div className="w-full max-w-lg">
                <img
                  src="/数码港照片.png"
                  alt="数码港照片"
                  className="w-full h-auto object-cover rounded-2xl shadow-xl"
                  onError={(e) => {
                    console.log('数码港照片 loading failed');
                    // 如果图片加载失败，显示备用内容
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.classList.remove('hidden');
                    }
                  }}
                />
                <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center hidden">
                  <span className="text-blue-700 text-2xl font-bold">数码港</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">长丰数智@数码港</h2>
              <div className="prose prose-lg">
                <p className="text-gray-700 text-lg leading-relaxed">
                  长丰数智有限公司在香港数码港第三座第2金融智能空间设立了一处办公地点。通过数码港的平台，我们可以深度连接香港最前沿web3行业的讯息、探索合作机会。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">加入我们</h2>
              <div className="prose prose-lg">
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  长丰数智正在寻找优秀的人才加入我们的团队。我们欢迎对数字资产和金融科技充满热情的专业人士。如果您认同我们的使命和愿景，并希望在这个快速发展的行业中发挥才能，请将您的简历发送至：ryanli@longvaluehk.com
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  我们提供具有竞争力的薪酬待遇、专业的工作环境和广阔的发展空间。加入长丰数智，与我们一起开创数字资产的未来。
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-lg">
                <img
                  src="/新加logo.png"
                  alt="加入我们"
                  className="w-full h-auto object-contain rounded-2xl shadow-xl"
                  onError={(e) => {
                    console.log('新加logo loading failed');
                    // 如果图片加载失败，显示备用内容
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.classList.remove('hidden');
                    }
                  }}
                />
                <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center hidden">
                  <span className="text-blue-700 text-2xl font-bold">加入我们</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
