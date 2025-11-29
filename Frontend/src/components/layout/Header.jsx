import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-lg' : 'shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 rounded-full px-4 py-2 flex items-center gap-0">
                <span className="text-xl font-bold text-white">Lega</span>
                <svg width="4" height="24" viewBox="0 0 4 24" fill="none" className="mx-0.5">
                  <rect x="0" y="2" width="4" height="20" fill="#ffffff"/>
                  <polygon points="2,0 0,2 4,2" fill="#ffffff"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-blue-600">City</span>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/lawyers') || isActive('/find-lawyer') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}>
                Lawyer Directory
              </button>
              <div className={`absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-md border transition-all duration-200 z-50 ${
                isDropdownOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'
              }`}>
                <Link 
                  to="/find-lawyer" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Find Lawyer
                </Link>
                <Link 
                  to="/lawyers" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  All Lawyers
                </Link>
              </div>
            </div>
            <Link 
              to="/legal-forms" 
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/legal-forms') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Legal Forms
            </Link>
            <Link 
              to="/qa" 
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/qa') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Q&A
            </Link>
            <Link 
              to="/contact-us" 
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/contact-us') ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
