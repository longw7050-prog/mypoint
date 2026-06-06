import { Link, useLocation } from 'react-router-dom';
import { Home, Users, History, Gift } from 'lucide-react';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/children', label: '管理', icon: Users },
  { path: '/records', label: '记录', icon: History },
  { path: '/rewards', label: '商城', icon: Gift },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
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
