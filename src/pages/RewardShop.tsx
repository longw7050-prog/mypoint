import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Reward } from '../types';
import { Plus, Trash2, Gift, Check, X } from 'lucide-react';
import { useConfirmStore } from '../components/ConfirmDialog';
import { useToastStore } from '../components/Toast';
import PinModal from '../components/PinModal';

const DEFAULT_REWARDS = [
  { name: '买冰淇淋', points: 5, icon: '🍦' },
  { name: '买零食', points: 10, icon: '🍭' },
  { name: '看电视30分钟', points: 15, icon: '📺' },
  { name: '买玩具', points: 50, icon: '🧸' },
  { name: '去游乐园', points: 100, icon: '🎢' },
  { name: '买新书', points: 30, icon: '📚' },
];

export default function RewardShop() {
  const { children, rewards, addReward, deleteReward, addRecord, selectedChildId, setSelectedChild, parentPin } = useStore();
  const openConfirm = useConfirmStore(state => state.openConfirm);
  const addToast = useToastStore(state => state.addToast);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReward, setNewReward] = useState({ name: '', points: '', icon: '' });
  const [exchangeSuccess, setExchangeSuccess] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingExchange, setPendingExchange] = useState<(() => void) | null>(null);

  const doExchange = (reward: Reward, childId: string) => {
    addRecord({
      childId,
      type: 'spend',
      amount: reward.points,
      reason: `兑换：${reward.name}`,
      date: new Date().toISOString(),
    });
    setExchangeSuccess(reward.id);
    addToast(`兑换成功：${reward.name}`, 'success');
    setTimeout(() => setExchangeSuccess(null), 2000);
  };

  const handleExchange = (reward: Reward) => {
    if (!selectedChildId) {
      addToast('请先选择一个孩子', 'warning');
      return;
    }

    const child = children.find(c => c.id === selectedChildId);
    if (!child) return;

    if (reward.points > 1000) {
      addToast('单次消费积分不能超过1000', 'error');
      return;
    }

    if (child.totalPoints < reward.points) {
      addToast(`积分不足！当前${child.totalPoints}分，需要${reward.points}分`, 'error');
      return;
    }

    const executeExchange = () => {
      openConfirm({
        title: '确认兑换',
        message: `使用 ${reward.points} 积分兑换「${reward.name}」？等值 ${reward.points} 元。`,
        confirmText: '确认兑换',
        variant: 'warning',
        onConfirm: () => doExchange(reward, selectedChildId),
      });
    };

    if (parentPin) {
      setPendingExchange(() => executeExchange);
      setShowPinModal(true);
    } else {
      executeExchange();
    }
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

  const handleAddDefaultRewards = () => {
    DEFAULT_REWARDS.forEach(r => {
      addReward({ name: r.name, points: r.points, icon: r.icon });
    });
    addToast('已添加默认奖励', 'success');
  };

  const selectedChild = children.find(c => c.id === selectedChildId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-gray-50 pb-4">
      <div className="container mx-auto max-w-6xl px-4 pt-4">
        {/* 标题区 */}
        <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl p-5 shadow-sm mb-3 border border-orange-100/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-base font-semibold text-gray-800">奖励商城</h1>
              <p className="text-xs text-gray-400 mt-0.5">用积分兑换各种奖励</p>
            </div>
          </div>
        </div>

        {/* 选择孩子 + 可用积分 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <label className="text-xs text-gray-500 whitespace-nowrap">选择孩子</label>
              <select
                value={selectedChildId || ''}
                onChange={(e) => setSelectedChild(e.target.value || null)}
                className="flex-1 px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm text-gray-600 focus:ring-1 focus:ring-primary"
              >
                <option value="">请选择孩子</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name} ({child.totalPoints}积分)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              {selectedChild ? (
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{selectedChild.totalPoints}</span>
                  <span className="text-xs text-gray-400">可用积分</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400">请选择孩子查看积分</span>
              )}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg text-xs font-medium active:scale-95 transition-transform shadow-sm"
              >
                <Plus size={14} />
                <span>添加奖励</span>
              </button>
            </div>
          </div>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="text-4xl mb-3">👶</div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">还没有添加孩子</h3>
            <p className="text-xs text-gray-400">请先在首页添加孩子</p>
          </div>
        ) : (
          <>
            {/* 可兑换奖励 */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700 flex items-center space-x-1.5">
                <Gift size={14} className="text-primary" />
                <span>可兑换奖励</span>
              </h2>
              {rewards.length === 0 && (
                <button
                  onClick={handleAddDefaultRewards}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  添加默认奖励
                </button>
              )}
            </div>

            {rewards.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center mb-4">
                <div className="text-4xl mb-3">🎁</div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">还没有奖励</h3>
                <p className="text-xs text-gray-400 mb-4">添加一些奖励让孩子用积分兑换</p>
                <div className="flex space-x-2 justify-center">
                  <button
                    onClick={handleAddDefaultRewards}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg text-xs font-medium active:scale-95 transition-transform shadow-sm"
                  >
                    使用默认奖励
                  </button>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                  >
                    自定义添加
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                {rewards.map((reward) => {
                  const canExchange = selectedChild && selectedChild.totalPoints >= reward.points;
                  
                  return (
                    <div
                      key={reward.id}
                      className={`bg-white rounded-2xl shadow-sm overflow-hidden relative transition-all ${
                        exchangeSuccess === reward.id
                          ? 'ring-2 ring-green-500'
                          : 'hover:shadow-md'
                      }`}
                    >
                      {exchangeSuccess === reward.id && (
                        <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center z-10">
                          <div className="bg-green-500 text-white rounded-full p-2 animate-scaleIn">
                            <Check size={20} />
                          </div>
                        </div>
                      )}
                      
                      <div className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-2xl">{reward.icon}</div>
                          <button
                            onClick={() => handleDeleteReward(reward.id, reward.name)}
                            className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">{reward.name}</h3>

                        <div className="flex items-baseline mb-3">
                          <span className="text-lg font-bold text-primary">{reward.points}</span>
                          <span className="text-xs text-gray-400 ml-1">积分</span>
                        </div>

                        <button
                          onClick={() => handleExchange(reward)}
                          disabled={!selectedChildId || !canExchange}
                          className={`w-full py-2 rounded-xl font-medium transition-colors text-xs ${
                            !selectedChildId
                              ? 'bg-gray-50 text-gray-300'
                              : canExchange
                              ? 'bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-sm active:scale-[0.98]'
                              : 'bg-gray-50 text-gray-300'
                          }`}
                        >
                          {!selectedChildId ? '选孩子' : canExchange ? '兑换' : '不足'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 积分规则 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">积分规则</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-xl p-3">
                  <h4 className="text-xs font-semibold text-green-700 mb-1.5">获得积分</h4>
                  <ul className="text-xs text-green-600 space-y-0.5">
                    <li>• 小红花奖励：2积分</li>
                    <li>• 帮助做家务：5积分</li>
                    <li>• 考试成绩优秀：10积分</li>
                    <li>• 主动学习：8积分</li>
                    <li>• 照顾弟妹：6积分</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 rounded-xl p-3">
                  <h4 className="text-xs font-semibold text-orange-700 mb-1.5">积分兑换</h4>
                  <ul className="text-xs text-orange-600 space-y-0.5">
                    <li>• 1积分 = 1元</li>
                    <li>• 可兑换玩具、零食等</li>
                    <li>• 自定义奖励联系家长</li>
                    <li>• 积分不可转让</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 添加奖励弹窗 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideUp sm:animate-scaleIn">
              <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
                <h2 className="text-base font-semibold text-gray-800">添加新奖励</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddReward} className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">奖励名称</label>
                  <input
                    type="text"
                    value={newReward.name}
                    onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-sm focus:ring-1 focus:ring-primary"
                    placeholder="例如：买冰淇淋"
                    maxLength={20}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">所需积分</label>
                  <input
                    type="number"
                    value={newReward.points}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (/^\d+$/.test(val) && val.length <= 4)) {
                        setNewReward({ ...newReward, points: val });
                      }
                    }}
                    className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-sm focus:ring-1 focus:ring-primary"
                    placeholder="1-1000整数"
                    required
                    min="1"
                    max="1000"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">图标（可选）</label>
                  <input
                    type="text"
                    value={newReward.icon}
                    onChange={(e) => setNewReward({ ...newReward, icon: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-sm focus:ring-1 focus:ring-primary"
                    maxLength={4}
                    placeholder="输入一个表情符号"
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-sm transition-all font-medium text-sm"
                  >
                    添加
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* 家长密码验证 */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => { setShowPinModal(false); setPendingExchange(null); }}
        onSuccess={() => {
          setShowPinModal(false);
          pendingExchange?.();
          setPendingExchange(null);
        }}
        mode="verify"
      />
    </div>
  );
}
