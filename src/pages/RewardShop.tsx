/**
 * RewardShop.tsx - 奖励商城页
 * 
 * 【作用】
 * 展示可兑换的奖励列表，支持添加/删除自定义奖励
 * 选择孩子后点击奖励发起积分兑换
 * 
 * 【依赖】
 * - useStore: 获取 children/rewards 数据，执行删除奖励
 * - ConfirmDialog: 删除奖励时的二次确认
 * - Toast: 操作反馈提示
 * 
 * 【被调用】
 * - App.tsx (路由 /rewards)
 * 
 * 【调用关系】
 * - ConfirmDialog: 删除奖励时的二次确认
 * - AddPointModal: 点击兑换时打开（消费积分）
 */
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Reward } from '../types';
import { Plus, Trash2, Gift, Check } from 'lucide-react';
import { useConfirmStore } from '../components/ConfirmDialog';
import { useToastStore } from '../components/Toast';

export default function RewardShop() {
  const { children, rewards, addReward, deleteReward, addRecord } = useStore();
  const openConfirm = useConfirmStore(state => state.openConfirm);
  const addToast = useToastStore(state => state.addToast);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReward, setNewReward] = useState({ name: '', points: '', icon: '' });
  const [exchangeSuccess, setExchangeSuccess] = useState<string | null>(null);

  const handleExchange = (reward: Reward) => {
    if (!selectedChildId) {
      addToast('请先选择一个孩子', 'warning');
      return;
    }

    const child = children.find(c => c.id === selectedChildId);
    if (!child) return;

    if (child.totalPoints < reward.points) {
      addToast(`积分不足！当前${child.totalPoints}分，需要${reward.points}分`, 'error');
      return;
    }

    openConfirm({
      title: '确认兑换',
      message: `使用 ${reward.points} 积分兑换「${reward.name}」？等值 ${reward.points} 元。`,
      confirmText: '确认兑换',
      variant: 'warning',
      onConfirm: () => {
        addRecord({
          childId: selectedChildId,
          type: 'spend',
          amount: reward.points,
          reason: `兑换：${reward.name}`,
          date: new Date().toISOString(),
        });
        setExchangeSuccess(reward.id);
        addToast(`兑换成功：${reward.name}`, 'success');
        setTimeout(() => setExchangeSuccess(null), 2000);
      },
    });
  };

  const handleDeleteReward = (id: string, name: string) => {
    openConfirm({
      title: '删除奖励',
      message: `确定要删除「${name}」吗？`,
      confirmText: '删除',
      variant: 'danger',
      onConfirm: () => {
        deleteReward(id);
        addToast('奖励已删除', 'success');
      },
    });
  };

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReward.name || !newReward.points) return;

    addReward({
      name: newReward.name,
      points: parseInt(newReward.points),
      icon: newReward.icon || '🎁',
    });

    setNewReward({ name: '', points: '', icon: '' });
    setIsModalOpen(false);
    addToast('奖励添加成功', 'success');
  };

  const selectedChild = children.find(c => c.id === selectedChildId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 p-4 sm:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">奖励商城</h1>
          <p className="text-sm sm:text-base text-gray-600">用积分兑换各种奖励</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">选择孩子:</label>
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
              >
                <option value="">请选择孩子</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name} ({child.totalPoints}积分)
                  </option>
                ))}
              </select>
            </div>

            {selectedChild && (
              <div className="bg-gradient-to-r from-primary to-accent rounded-lg px-4 py-3 text-white w-full sm:w-auto flex items-center justify-between sm:justify-start sm:space-x-2">
                <span className="text-sm opacity-80">可用积分:</span>
                <span className="text-2xl font-bold">{selectedChild.totalPoints}</span>
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto touch-target"
            >
              <Plus size={20} />
              <span className="text-sm sm:text-base">添加奖励</span>
            </button>
          </div>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl mb-4">👶</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">还没有添加孩子</h3>
            <p className="text-sm sm:text-base text-gray-600">请先在"管理"中添加孩子</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <Gift className="mr-2" />
                可兑换奖励
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {rewards.map((reward) => {
                  const canExchange = selectedChild && selectedChild.totalPoints >= reward.points;
                  
                  return (
                    <div
                      key={reward.id}
                      className={`bg-white rounded-xl shadow-lg overflow-hidden relative transition-all ${
                        exchangeSuccess === reward.id
                          ? 'ring-4 ring-green-500'
                          : 'hover:shadow-xl'
                      }`}
                    >
                      {exchangeSuccess === reward.id && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center z-10">
                          <div className="bg-green-500 text-white rounded-full p-3 sm:p-4 animate-scaleIn">
                            <Check size={32} />
                          </div>
                        </div>
                      )}
                      
                      <div className="p-4 sm:p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-3xl sm:text-4xl">{reward.icon}</div>
                          <button
                            onClick={() => handleDeleteReward(reward.id, reward.name)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 truncate">{reward.name}</h3>

                        <div className="flex items-baseline mb-4">
                          <span className="text-2xl sm:text-3xl font-bold text-primary">{reward.points}</span>
                          <span className="text-sm text-gray-500 ml-1">积分</span>
                          <span className="text-xs text-gray-400 ml-2">≈{reward.points}元</span>
                        </div>

                        <button
                          onClick={() => handleExchange(reward)}
                          disabled={!selectedChildId || !canExchange}
                          className={`w-full py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base touch-target ${
                            !selectedChildId
                              ? 'bg-gray-100 text-gray-400'
                              : canExchange
                              ? 'bg-primary text-white hover:bg-primary/90 active:scale-[0.98]'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {!selectedChildId ? '请先选择孩子' : canExchange ? '立即兑换' : '积分不足'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">积分规则</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-2">获得积分</h4>
                  <ul className="text-xs sm:text-sm text-green-700 space-y-1">
                    <li>• 小红花奖励：2积分</li>
                    <li>• 帮助做家务：5积分</li>
                    <li>• 考试成绩优秀：10积分</li>
                    <li>• 主动学习：8积分</li>
                    <li>• 照顾弟妹：6积分</li>
                  </ul>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-bold text-orange-800 mb-2">积分兑换</h4>
                  <ul className="text-xs sm:text-sm text-orange-700 space-y-1">
                    <li>• 1积分 = 1元</li>
                    <li>• 可兑换玩具、零食、游玩等</li>
                    <li>• 自定义奖励请联系家长</li>
                    <li>• 积分不可转让</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideUp sm:animate-scaleIn">
              <div className="sticky top-0 bg-white flex items-center justify-between p-4 sm:p-6 border-b">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">添加新奖励</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>

              <form onSubmit={handleAddReward} className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">奖励名称</label>
                  <input
                    type="text"
                    value={newReward.name}
                    onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    placeholder="例如：买冰淇淋"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">所需积分</label>
                  <input
                    type="number"
                    value={newReward.points}
                    onChange={(e) => setNewReward({ ...newReward, points: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    placeholder="例如：5"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">图标（可选）</label>
                  <input
                    type="text"
                    value={newReward.icon}
                    onChange={(e) => setNewReward({ ...newReward, icon: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    placeholder="输入一个表情符号"
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium touch-target text-base"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium touch-target text-base"
                  >
                    添加
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
