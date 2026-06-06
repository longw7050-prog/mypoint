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
import { Plus } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { children, categories, loadData, addRecord } = useStore();
  const [selectedChildId, setSelectedChildId] = useState<string>('');

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalPoints = children.reduce((sum, child) => sum + child.totalPoints, 0);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 p-4 sm:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">欢迎使用鼓励储蓄罐</h1>
          <p className="text-sm sm:text-base text-gray-600">记录孩子的每一次进步，激励成长</p>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-4 sm:p-6 text-white shadow-lg">
            <div className="text-xs sm:text-sm opacity-80 mb-1">孩子总数</div>
            <div className="text-2xl sm:text-4xl font-bold">{children.length}</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
            <div className="text-xs sm:text-sm opacity-80 mb-1">总积分</div>
            <div className="text-2xl sm:text-4xl font-bold">{totalPoints}</div>
          </div>
          
          <div className="bg-gradient-to-r from-accent to-accent/80 rounded-xl p-4 sm:p-6 text-white shadow-lg xs:col-span-2 lg:col-span-1">
            <div className="text-xs sm:text-sm opacity-80 mb-1">平均积分</div>
            <div className="text-2xl sm:text-4xl font-bold">
              {children.length > 0 ? Math.round(totalPoints / children.length) : 0}
            </div>
          </div>
        </div>

        {/* 快捷操作区 */}
        {children.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">快捷加分</h2>
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">选择孩子</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>{child.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {earnCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleQuickAdd(cat)}
                  disabled={!selectedChildId}
                  className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl transition-all hover:shadow-md disabled:opacity-40 disabled:hover:shadow-none bg-gray-50 hover:bg-gray-100 active:scale-95"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center mb-2 text-lg sm:text-xl">
                    {cat.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 truncate w-full text-center">{cat.name}</span>
                  <span className="text-xs text-primary font-bold">+{cat.points}分</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">孩子列表</h2>
          <button
            onClick={() => navigate('/children')}
            className="flex items-center justify-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto touch-target"
          >
            <Plus size={20} />
            <span>添加孩子</span>
          </button>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl mb-4">👶</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">还没有添加孩子</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">点击上方按钮添加您的第一个孩子</p>
            <button
              onClick={() => navigate('/children')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium touch-target w-full sm:w-auto"
            >
              添加孩子
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

        {children.length > 0 && (
          <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">使用说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl sm:text-3xl mb-2">🌸</div>
                <h4 className="font-bold text-gray-800 mb-1">获得积分</h4>
                <p className="text-xs sm:text-sm text-gray-600">小红花奖励获得2积分，帮助做家务获得5积分，考试优秀获得10积分</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl sm:text-3xl mb-2">🎁</div>
                <h4 className="font-bold text-gray-800 mb-1">积分兑换</h4>
                <p className="text-xs sm:text-sm text-gray-600">1积分 = 1元，可在奖励商城兑换各种奖励</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 md:col-span-1">
                <div className="text-2xl sm:text-3xl mb-2">📊</div>
                <h4 className="font-bold text-gray-800 mb-1">积分记录</h4>
                <p className="text-xs sm:text-sm text-gray-600">所有积分获取和消费都有详细记录，方便家长管理</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
