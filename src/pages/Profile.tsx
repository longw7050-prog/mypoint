import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Users, ChevronRight, Shield, Cloud, Tags, X, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { PointCategory } from '../types';
import AvatarPicker from '../components/AvatarPicker';
import { useToastStore } from '../components/Toast';
import { useConfirmStore } from '../components/ConfirmDialog';

export default function Profile() {
  const navigate = useNavigate();
  const { categories, addCategory, deleteCategory } = useStore();
  const addToast = useToastStore(state => state.addToast);
  const openConfirm = useConfirmStore(state => state.openConfirm);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryType, setCategoryType] = useState<'earn' | 'spend'>('earn');
  const [newCategory, setNewCategory] = useState({ name: '', points: '', icon: '🌟' });

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

  const earnCategories = categories.filter(c => c.type === 'earn');
  const spendCategories = categories.filter(c => c.type === 'spend');

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.points) return;
    addCategory({
      name: newCategory.name,
      points: parseInt(newCategory.points),
      icon: newCategory.icon,
      type: categoryType,
    });
    addToast('类别添加成功', 'success');
    setNewCategory({ name: '', points: '', icon: '🌟' });
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (cat: PointCategory) => {
    openConfirm({
      title: '删除类别',
      message: `确定要删除「${cat.name}」吗？`,
      confirmText: '删除',
      variant: 'danger',
      onConfirm: () => {
        deleteCategory(cat.id);
        addToast('类别已删除', 'success');
      },
    });
  };

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

        {/* 类别管理 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-3">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-gray-400 flex items-center space-x-1.5">
              <Tags size={12} />
              <span>类别管理</span>
            </h2>
            <button
              onClick={() => {
                setCategoryType('earn');
                setNewCategory({ name: '', points: '', icon: '🌟' });
                setShowCategoryModal(true);
              }}
              className="text-xs text-primary font-medium hover:underline"
            >
              添加类别
            </button>
          </div>

          {/* 获得类别 */}
          <div className="px-4 py-3">
            <h3 className="text-xs font-medium text-green-600 mb-2">获得积分类别</h3>
            <div className="flex flex-wrap gap-2">
              {earnCategories.map((cat) => (
                <div key={cat.id} className="flex items-center space-x-1.5 bg-green-50 rounded-lg px-2.5 py-1.5">
                  <span className="text-sm">{cat.icon}</span>
                  <span className="text-xs text-gray-700">{cat.name}</span>
                  <span className="text-xs text-green-600 font-medium">+{cat.points}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-0.5 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 消费类别 */}
          <div className="px-4 py-3 border-t border-gray-50">
            <h3 className="text-xs font-medium text-orange-600 mb-2">消费积分类别</h3>
            <div className="flex flex-wrap gap-2">
              {spendCategories.map((cat) => (
                <div key={cat.id} className="flex items-center space-x-1.5 bg-orange-50 rounded-lg px-2.5 py-1.5">
                  <span className="text-sm">{cat.icon}</span>
                  <span className="text-xs text-gray-700">{cat.name}</span>
                  <span className="text-xs text-orange-600 font-medium">-{cat.points}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-0.5 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
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
          <p>鼓励储蓄罐 v1.3</p>
        </div>
      </div>

      {/* 添加类别弹窗 */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md animate-slideUp sm:animate-scaleIn">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-base font-semibold text-gray-800">添加类别</h2>
              <button onClick={() => setShowCategoryModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setCategoryType('earn')}
                  className={`flex-1 py-2.5 rounded-xl font-medium transition-all text-sm ${
                    categoryType === 'earn'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  获得积分
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryType('spend')}
                  className={`flex-1 py-2.5 rounded-xl font-medium transition-all text-sm ${
                    categoryType === 'spend'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  消费积分
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">类别名称</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-sm focus:ring-1 focus:ring-primary"
                  placeholder="例如：按时起床"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">积分数值</label>
                <input
                  type="number"
                  value={newCategory.points}
                  onChange={(e) => setNewCategory({ ...newCategory, points: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-sm focus:ring-1 focus:ring-primary"
                  placeholder="例如：5"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">图标</label>
                <AvatarPicker
                  value={newCategory.icon}
                  onChange={(icon) => setNewCategory({ ...newCategory, icon })}
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm"
                >
                  取消
                </button>
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategory.name || !newCategory.points}
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
