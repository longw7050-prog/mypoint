import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import ChildCard from '../components/ChildCard';
import { Plus, Users, Sparkles, TrendingUp, ChevronRight, X, Target, Trash2 } from 'lucide-react';
import { useToastStore } from '../components/Toast';
import { useConfirmStore } from '../components/ConfirmDialog';

export default function Home() {
  const navigate = useNavigate();
  const { children, categories, records, goals, loadData, addRecord, addGoal, deleteGoal, selectedChildId, setSelectedChild } = useStore();
  const addToast = useToastStore(state => state.addToast);
  const openConfirm = useConfirmStore(state => state.openConfirm);
  const [showWelcome, setShowWelcome] = useState(false);
  const [pointsBounce, setPointsBounce] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', targetPoints: '', icon: '🎯', childId: '' });
  const pointsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 首次使用引导
  useEffect(() => {
    const hasVisited = localStorage.getItem('mypoint_visited');
    if (!hasVisited && children.length === 0) {
      setShowWelcome(true);
    }
  }, [children.length]);

  const totalPoints = children.reduce((sum, child) => sum + child.totalPoints, 0);

  // 今日获得积分
  const todayEarn = records
    .filter(r => r.type === 'earn' && new Date(r.date).toDateString() === new Date().toDateString())
    .reduce((sum, r) => sum + r.amount, 0);

  // 本周获得积分
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekEarn = records
    .filter(r => r.type === 'earn' && new Date(r.date) >= weekStart)
    .reduce((sum, r) => sum + r.amount, 0);

  const earnCategories = categories.filter(c => c.type === 'earn');

  const handleQuickAdd = (cat: typeof earnCategories[0]) => {
    if (!selectedChildId) {
      addToast('请先选择一个孩子', 'warning');
      return;
    }
    const child = children.find(c => c.id === selectedChildId);
    addRecord({
      childId: selectedChildId,
      type: 'earn',
      amount: cat.points,
      reason: cat.name,
      date: new Date().toISOString(),
    });
    addToast(`${child?.name || '孩子'} +${cat.points} ${cat.name}`, 'success');
    setPointsBounce(true);
    setTimeout(() => setPointsBounce(false), 400);
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetPoints || !newGoal.childId) return;
    addGoal({
      childId: newGoal.childId,
      name: newGoal.name,
      targetPoints: parseInt(newGoal.targetPoints),
      icon: newGoal.icon || '🎯',
    });
    addToast('目标添加成功', 'success');
    setNewGoal({ name: '', targetPoints: '', icon: '🎯', childId: '' });
    setShowGoalModal(false);
  };

  const handleDeleteGoal = (id: string, name: string) => {
    openConfirm({
      title: '删除目标',
      message: `确定要删除「${name}」吗？`,
      confirmText: '删除',
      variant: 'danger',
      onConfirm: () => {
        deleteGoal(id);
        addToast('目标已删除', 'success');
      },
    });
  };

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
        {/* 首次使用欢迎弹窗 */}
        {showWelcome && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn">
              <div className="bg-gradient-to-br from-primary to-accent p-6 text-center text-white">
                <div className="text-5xl mb-3">🎉</div>
                <h2 className="text-xl font-bold">欢迎使用鼓励储蓄罐</h2>
                <p className="text-sm opacity-90 mt-1">记录孩子的每一次进步</p>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg flex items-center justify-center text-lg">1</div>
                  <span className="text-sm text-gray-700">添加您的孩子</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-50 rounded-lg flex items-center justify-center text-lg">2</div>
                  <span className="text-sm text-gray-700">给孩子加分奖励</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-sky-50 rounded-lg flex items-center justify-center text-lg">3</div>
                  <span className="text-sm text-gray-700">用积分兑换奖励</span>
                </div>
                <button
                  onClick={() => {
                    setShowWelcome(false);
                    localStorage.setItem('mypoint_visited', 'true');
                    navigate('/children');
                  }}
                  className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-medium active:scale-95 transition-transform shadow-sm mt-2"
                >
                  开始使用
                </button>
              </div>
            </div>
          </div>
        )}

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
            <span
              ref={pointsRef}
              className={`text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent transition-transform duration-300 ${pointsBounce ? 'scale-110' : 'scale-100'}`}
            >
              {totalPoints}
            </span>
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
              <span className="text-xs text-gray-500">今日</span>
            </div>
            <span className="text-xl font-bold text-green-600">+{todayEarn}</span>
          </div>
          
          <div className="flex-shrink-0 flex-1 min-w-0 bg-white rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-100 to-sky-50 rounded-lg flex items-center justify-center">
                <Sparkles size={14} className="text-blue-500" />
              </div>
              <span className="text-xs text-gray-500">本周</span>
            </div>
            <span className="text-xl font-bold text-blue-600">+{weekEarn}</span>
          </div>
        </div>

        {/* 快捷加分 */}
        {children.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">快捷加分</h2>
              <select
                value={selectedChildId || ''}
                onChange={(e) => setSelectedChild(e.target.value || null)}
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

        {/* 储蓄目标 */}
        {children.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700 flex items-center space-x-1.5">
                <Target size={14} className="text-primary" />
                <span>储蓄目标</span>
              </h2>
              <button
                onClick={() => {
                  setNewGoal(prev => ({ ...prev, childId: selectedChildId || (children[0]?.id ?? '') }));
                  setShowGoalModal(true);
                }}
                className="flex items-center space-x-1 px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
              >
                <Plus size={12} />
                <span>添加</span>
              </button>
            </div>

            {goals.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-xs text-gray-400">还没有设定储蓄目标</p>
                <p className="text-xs text-gray-300 mt-0.5">设定目标让孩子更有动力攒积分</p>
              </div>
            ) : (
              <div className="space-y-3">
                {goals.map((goal) => {
                  const child = children.find(c => c.id === goal.childId);
                  if (!child) return null;
                  const progress = Math.min(100, Math.round((child.totalPoints / goal.targetPoints) * 100));
                  const isCompleted = child.totalPoints >= goal.targetPoints;

                  return (
                    <div key={goal.id} className={`rounded-xl p-3 ${isCompleted ? 'bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-200' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{goal.icon}</span>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-800">{goal.name}</h3>
                            <p className="text-xs text-gray-400">{child.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {isCompleted && <span className="text-xs font-semibold text-green-600">已达成!</span>}
                          <button
                            onClick={() => handleDeleteGoal(goal.id, goal.name)}
                            className="p-1 text-gray-300 hover:text-red-500 rounded transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-gradient-to-r from-primary to-accent'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{child.totalPoints}/{goal.targetPoints}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                isSelected={selectedChildId === child.id}
                onEdit={() => navigate(`/children?edit=${child.id}`)}
                onDelete={() => navigate(`/children?delete=${child.id}`)}
                onSelect={(id) => setSelectedChild(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 添加目标弹窗 */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md animate-slideUp sm:animate-scaleIn">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-base font-semibold text-gray-800">添加储蓄目标</h2>
              <button onClick={() => setShowGoalModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">选择孩子</label>
                <select
                  value={newGoal.childId}
                  onChange={(e) => setNewGoal({ ...newGoal, childId: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-sm focus:ring-1 focus:ring-primary"
                >
                  <option value="">请选择</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>{child.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">目标名称</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-sm focus:ring-1 focus:ring-primary"
                  placeholder="例如：买乐高积木"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">所需积分</label>
                <input
                  type="number"
                  value={newGoal.targetPoints}
                  onChange={(e) => setNewGoal({ ...newGoal, targetPoints: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-sm focus:ring-1 focus:ring-primary"
                  placeholder="例如：100"
                  min="1"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm"
                >
                  取消
                </button>
                <button
                  onClick={handleAddGoal}
                  disabled={!newGoal.name || !newGoal.targetPoints || !newGoal.childId}
                  className="flex-1 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-sm transition-all font-medium text-sm disabled:opacity-40"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
