/**
 * Profile.tsx - 我的页面
 *
 * 【作用】
 * 个人中心页面，包含奖励事件、抵扣事件、孩子管理三个功能入口
 * 当前为静态页面，后续实现动态权限管理和数据上云
 *
 * 【依赖】
 * - react-router-dom: 路由跳转
 * - lucide-react: 图标库
 */
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Users, ChevronRight, Shield, Cloud } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();

  const menuItems: { icon: typeof TrendingUp; label: string; desc: string; color: string; path: string; disabled?: boolean }[] = [
    {
      icon: TrendingUp,
      label: '奖励事件',
      desc: '查看积分获得记录',
      color: 'from-green-400 to-emerald-500',
      path: '/records?type=earn',
    },
    {
      icon: TrendingDown,
      label: '抵扣事件',
      desc: '查看积分消费记录',
      color: 'from-orange-400 to-amber-500',
      path: '/records?type=spend',
    },
    {
      icon: Users,
      label: '孩子管理',
      desc: '管理孩子信息与积分',
      color: 'from-blue-400 to-sky-500',
      path: '/children',
    },
  ];

  const settingItems = [
    {
      icon: Shield,
      label: '权限管理',
      desc: '即将上线',
      color: 'from-purple-400 to-violet-500',
      disabled: true,
    },
    {
      icon: Cloud,
      label: '数据上云',
      desc: '即将上线',
      color: 'from-cyan-400 to-teal-500',
      disabled: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-gray-50 pb-4">
      <div className="container mx-auto max-w-6xl px-4 pt-4">
        {/* 用户信息区 */}
        <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl p-5 shadow-sm mb-3 border border-orange-100/50">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl">
              👨‍‍👧
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-800">家长中心</h1>
              <p className="text-xs text-gray-400 mt-0.5">管理孩子的积分与奖励</p>
            </div>
          </div>
        </div>

        {/* 功能菜单 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-3">
          <div className="px-4 py-3 border-b border-gray-50">
            <h2 className="text-xs font-semibold text-gray-400">功能管理</h2>
          </div>
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => !item.disabled && navigate(item.path)}
              className="w-full flex items-center px-4 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className={`w-9 h-9 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white mr-3 shadow-sm`}>
                <item.icon size={16} />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-gray-800">{item.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* 设置菜单 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-3">
          <div className="px-4 py-3 border-b border-gray-50">
            <h2 className="text-xs font-semibold text-gray-400">系统设置</h2>
          </div>
          {settingItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center px-4 py-3.5 opacity-50"
            >
              <div className={`w-9 h-9 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white mr-3 shadow-sm`}>
                <item.icon size={16} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{item.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
              </div>
              <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">即将上线</span>
            </div>
          ))}
        </div>

        {/* 底部信息 */}
        <div className="text-center text-xs text-gray-300 py-4">
          <p>鼓励储蓄罐 v1.2</p>
        </div>
      </div>
    </div>
  );
}
