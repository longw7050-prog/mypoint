import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, History, Gift, Menu, X } from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/children', label: '孩子管理', icon: Users },
    { path: '/records', label: '积分记录', icon: History },
    { path: '/rewards', label: '奖励商城', icon: Gift },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl sm:text-2xl font-bold text-primary">鼓励储蓄罐</h1>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg font-semibold ring-2 ring-primary/30'
                      : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-slideDown">
            <nav className="flex flex-col space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === path
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
