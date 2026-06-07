import { Link, useLocation } from 'react-router-dom';
import { Home, Gift, User, ClipboardList } from 'lucide-react';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/records', label: '记录', icon: ClipboardList },
  { path: '/rewards', label: '礼品', icon: Gift },
  { path: '/profile', label: '我的', icon: User },
];

export default function Header() {
  const location = useLocation();

  const getIsActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/records') return location.pathname === '/records';
    if (path === '/rewards') return location.pathname === '/rewards';
    if (path === '/profile') return ['/profile', '/children'].includes(location.pathname);
    return location.pathname === path;
  };

  return (
    <header className="hidden md:block bg-gradient-to-r from-white to-orange-50/30 shadow-md sticky top-0 z-50 border-b border-orange-100/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">鼓励储蓄罐</h1>
          
          <nav className="flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = getIsActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg font-semibold ring-2 ring-primary/30'
                      : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
