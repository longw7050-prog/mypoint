/**
 * Home.tsx - 首页仪表盘
 * 
 * 【作用】
 * 应用的主页面，展示所有孩子的积分概览、统计数据和快捷加分区
 * 
 * 【依赖】
 * - useStore: 获取 children/categories 数据，执行 addRecord
 * - ChildCard: 展示孩子信息卡片
 * - lucide-react: 图标库
 * 
 * 【被调用】
 * - App.tsx (路由 /)
 * 
 * 【调用关系】
 * - ChildCard: 展示孩子卡片列表
 * - navigate('/children'): 跳转孩子管理页
 * - navigate('/records'): 跳转积分记录页
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import ChildCard from '../components/ChildCard';
import { Plus, Users, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { children, categories, loadData, addRecord } = useStore();
  const [selectedChildId, setSelectedChildId] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalPoints = children.reduce((sum, child) => sum + child.totalPoints, 0);
  const avgPoints = children.length > 0 ? Math.round(totalPoints / children.length) : 0;

  const earnCategories = categories.filter(c => c.type === 'earn');

  const handleQuickAdd = (cat: typeof earnCategories[0]) => {
    if (!selectedChildId) return;
    addRecord({
      childId: selectedChildId,
      type: 'earn',
      amount: cat.points,
      reason: cat.name,
      date: new Date().toISOString(),
    });
  };

  // 为快捷加分按钮分配颜色
  const iconColors = [
    'from-pink-400 to-rose-400',
    'from-amber-400 to-orange-400',
    'from-yellow-400 to-amber-400',
    'from-emerald-400 to-teal-400',
    'from-violet-400 to-purple-400',
    'from-sky-400 to-blue-400',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-gray-50 pb-4">
      <div className="container mx-auto max-w-6xl px-4 pt-4">
        {/* Hero: 核心数据 */}
        <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl p-5 shadow-sm mb-3 border border-orange-100/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-base font-semibold text-gray-800">鼓励储蓄罐</h1>
              <p className="text-xs text-gray-400 mt-0.5">记录每一次进步</p>
            </div>
            <button
              onClick={() => navigate('/records')}
              className="flex items-center space-x-1 text-xs text-gray-400 hover:text-primary transition-colors"
            >
              <span>全部记录</span>
              <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{totalPoints}</span>
            <span className="text-sm font-medium text-gray-400">总积分</span>
          </div>
        </div>

        {/* 统计卡片行 */}
        <div className="flex space-x-3 mb-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex-shrink-0 flex-1 min-w-0 bg-white rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg flex items-center justify-center">
                <Users size={14} className="text-orange-500" />
              </div>
              <span className="text-xs text-gray-500">孩子</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{children.length}</span>
          </div>
          
          <div className="flex-shrink-0 flex-1 min-w-0 bg-white rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 bg-gradient-to-br from-green-100 to-emerald-50 rounded-lg flex items-center justify-center">
                <TrendingUp size={14} className="text-green-500" />
              </div>
              <span className="text-xs text-gray-500">总积分</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{totalPoints}</span>
          </div>
          
          <div className="flex-shrink-0 flex-1 min-w-0 bg-white rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-100 to-sky-50 rounded-lg flex items-center justify-center">
                <Sparkles size={14} className="text-blue-500" />
              </div>
              <span className="text-xs text-gray-500">平均</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{avgPoints}</span>
          </div>
        </div>

        {/* 快捷加分 */}
        {children.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">快捷加分</h2>
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="px-2.5 py-1.5 bg-gray-50 border-0 rounded-lg text-xs text-gray-500 focus:ring-1 focus:ring-primary"
              >
                <option value="">选择孩子</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>{child.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {earnCategories.map((cat, idx) => (
                <button
                  key={cat.id}
                  onClick={() => handleQuickAdd(cat)}
                  disabled={!selectedChildId}
                  className="flex flex-col items-center justify-center py-3 rounded-xl transition-all disabled:opacity-30 active:scale-95 bg-gray-50 hover:bg-gray-100"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconColors[idx % iconColors.length]} flex items-center justify-center mb-1.5 shadow-sm`}>
                    <span className="text-lg">{cat.icon}</span>
                  </div>
                  <span className="text-xs text-gray-500 truncate w-full text-center px-1 leading-tight">{cat.name}</span>
                  <span className="text-xs font-semibold text-primary mt-0.5">+{cat.points}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 孩子列表 */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">孩子列表</h2>
          <button
            onClick={() => navigate('/children')}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg text-xs font-medium active:scale-95 transition-transform shadow-sm"
          >
            <Plus size={14} />
            <span>添加</span>
          </button>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="text-4xl mb-3">👶</div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">还没有添加孩子</h3>
            <p className="text-xs text-gray-400 mb-4">点击上方按钮添加您的第一个孩子</p>
            <button
              onClick={() => navigate('/children')}
              className="px-5 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg text-sm font-medium active:scale-95 transition-transform shadow-sm"
            >
              添加孩子
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                onEdit={() => navigate(`/children?edit=${child.id}`)}
                onDelete={() => navigate(`/children?delete=${child.id}`)}
                onSelect={(id) => navigate(`/records?child=${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
