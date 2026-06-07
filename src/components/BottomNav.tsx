import { Link, useLocation } from 'react-router-dom';
import { Home, Gift, User, ClipboardList } from 'lucide-react';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/records', label: '记录', icon: ClipboardList },
  { path: '/rewards', label: '礼品', icon: Gift },
  { path: '/profile', label: '我的', icon: User },
];

export default function BottomNav() {
  const location = useLocation();

  const getIsActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/records') return location.pathname === '/records';
    if (path === '/rewards') return location.pathname === '/rewards';
    if (path === '/profile') return ['/profile', '/children'].includes(location.pathname);
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = getIsActive(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={`text-xs mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
