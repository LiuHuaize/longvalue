import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center -ml-2">
              <Link to="/" className="flex items-center space-x-3">
                <img
                  src={`/logo.png?t=${Date.now()}`}
                  alt="长丰数智LOGO"
                  className="h-12 w-12 object-contain"
                  onError={(e) => {
                    console.log('Logo loading failed');
                    // 如果图片加载失败，显示备用的圆形LOGO
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hidden">
                  <span className="text-white text-base font-bold">长</span>
                </div>
                <span className="text-xl font-bold text-blue-600">长丰数智</span>
              </Link>
            </div>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
              首页
            </Link>
            <Link to="/business" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
              业务介绍
            </Link>
            <Link to="/team" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
              团队介绍
            </Link>
            <Link to="/investor" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
              投资者关系
            </Link>
            <Link to="/research" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
              长丰加密研究所
            </Link>
            <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
              关于我们
            </Link>
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">打开主菜单</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
              首页
            </Link>
            <Link to="/business" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
              业务介绍
            </Link>
            <Link to="/team" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
              团队介绍
            </Link>
            <Link to="/investor" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
              投资者关系
            </Link>
            <Link to="/research" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
              长丰加密研究所
            </Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
              关于我们
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
