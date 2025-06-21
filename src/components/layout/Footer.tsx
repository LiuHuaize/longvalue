const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">长丰数智</h3>
            <p className="text-gray-300">
              打造亚洲首家比特币银行
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <p className="text-gray-300">
              邮箱: info@longvaluehk.com<br />
              网址: www.longvaluehk.com
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white">首页</a></li>
              <li><a href="/business" className="text-gray-300 hover:text-white">业务介绍</a></li>
              <li><a href="/team" className="text-gray-300 hover:text-white">团队介绍</a></li>
              <li><a href="/investor" className="text-gray-300 hover:text-white">投资者关系</a></li>
              <li><a href="/research" className="text-gray-300 hover:text-white">长丰加密研究所</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white">关于我们</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-300">© {new Date().getFullYear()} 长丰数智有限公司. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
