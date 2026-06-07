/**
 * AddPointModal.tsx - 添加积分记录弹窗
 * 
 * 【作用】
 * 添加积分记录的核心弹窗，支持：
 * - 切换获得/消费类型
 * - 选择预设积分类别（支持自定义添加/删除类别）
 * - 自定义输入积分数量和原因
 * 
 * 【依赖】
 * - useStore: categories/rewards 数据，addRecord/addCategory/deleteCategory
 * - AvatarPicker: 选择类别图标
 * - ConfirmDialog: 删除类别时的二次确认
 * - Toast: 操作反馈提示
 * - PointCategory 类型定义
 * 
 * 【被调用】
 * - Home.tsx: 首页快捷加分
 * - Records.tsx: 积分记录页添加记录
 * - RewardShop.tsx: 奖励商城消费积分
 * 
 * 【Props】
 * - isOpen: 弹窗是否打开
 * - onClose: 关闭弹窗回调
 * - childId: 预选的孩子ID
 */
import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { PointCategory } from '../types';
import { useToastStore } from '../components/Toast';
import { useConfirmStore } from '../components/ConfirmDialog';
import AvatarPicker from './AvatarPicker';
import PinModal from './PinModal';

interface AddPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  childId: string;
}

export default function AddPointModal({ isOpen, onClose, childId }: AddPointModalProps) {
  const [type, setType] = useState<'earn' | 'spend'>('earn');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', points: '', icon: '🌟' });
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<(() => void) | null>(null);

  const addRecord = useStore(state => state.addRecord);
  const categories = useStore(state => state.categories);
  const addCategory = useStore(state => state.addCategory);
  const deleteCategory = useStore(state => state.deleteCategory);
  const children = useStore(state => state.children);
  const selectedChildId = useStore(state => state.selectedChildId);
  const parentPin = useStore(state => state.parentPin);
  const addToast = useToastStore(state => state.addToast);
  const openConfirm = useConfirmStore(state => state.openConfirm);

  const filteredCategories = categories.filter(c => c.type === type);

  const currentChild = children.find(c => c.id === (childId || selectedChildId));
  const currentBalance = currentChild?.totalPoints ?? 0;

  const handlePresetSelect = (cat: PointCategory) => {
    setSelectedPreset(cat.id);
    setAmount(cat.points.toString());
    setReason(cat.name);
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.points) return;
    addCategory({
      name: newCategory.name,
      points: parseInt(newCategory.points),
      icon: newCategory.icon,
      type,
    });
    addToast('类别添加成功', 'success');
    setNewCategory({ name: '', points: '', icon: '🌟' });
    setShowAddCategory(false);
  };

  const handleDeleteCategory = (cat: PointCategory) => {
    openConfirm({
      title: '删除类别',
      message: `确定要删除「${cat.name}」吗？`,
      confirmText: '删除',
      variant: 'danger',
      onConfirm: () => {
        deleteCategory(cat.id);
        if (selectedPreset === cat.id) {
          setSelectedPreset('');
          setAmount('');
          setReason('');
        }
        addToast('类别已删除', 'success');
      },
    });
  };

  const doSubmit = () => {
    const numAmount = parseInt(amount);
    addRecord({
      childId,
      type,
      amount: numAmount,
      reason,
      date: new Date().toISOString(),
    });

    addToast(
      type === 'earn' ? `获得 ${numAmount} 积分：${reason}` : `消费 ${numAmount} 积分：${reason}`,
      type === 'earn' ? 'success' : 'info'
    );

    setAmount('');
    setReason('');
    setSelectedPreset('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !reason) return;

    const numAmount = parseInt(amount);
    if (!Number.isInteger(numAmount) || numAmount <= 0) {
      addToast('积分必须为正整数', 'error');
      return;
    }
    if (numAmount > 1000) {
      addToast('单次积分不能超过1000', 'error');
      return;
    }
    if (type === 'spend' && numAmount > currentBalance) {
      addToast(`积分不足！当前余额${currentBalance}分，需要${numAmount}分`, 'error');
      return;
    }

    if (parentPin) {
      setPendingSubmit(() => doSubmit);
      setShowPinModal(true);
    } else {
      doSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideUp sm:animate-scaleIn">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 sm:p-6 border-b z-10">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">添加积分记录</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* 获得/消费切换 */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => { setType('earn'); setSelectedPreset(''); setAmount(''); setReason(''); }}
              className={`flex-1 py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                type === 'earn'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              获得积分
            </button>
            <button
              type="button"
              onClick={() => { setType('spend'); setSelectedPreset(''); setAmount(''); setReason(''); }}
              className={`flex-1 py-3 rounded-xl font-medium transition-all text-sm sm:text-base ${
                type === 'spend'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              消费积分
            </button>
          </div>

          {/* 类别选择 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-500">选择类别</label>
              <button
                type="button"
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="flex items-center space-x-1 text-xs text-primary font-medium hover:underline"
              >
                <Plus size={14} />
                <span>添加类别</span>
              </button>
            </div>

            {/* 添加类别表单 */}
            {showAddCategory && (
              <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-3 animate-slideDown">
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border-0 rounded-lg focus:ring-1 focus:ring-primary text-sm"
                  placeholder="类别名称，如：按时起床"
                  maxLength={20}
                />
                <input
                  type="number"
                  value={newCategory.points}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (/^\d+$/.test(val) && val.length <= 4)) {
                      setNewCategory({ ...newCategory, points: val });
                    }
                  }}
                  className="w-full px-3 py-2 bg-white border-0 rounded-lg focus:ring-1 focus:ring-primary text-sm"
                  placeholder="积分数值"
                  min="1"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">图标:</span>
                  <div className="flex-1">
                    <AvatarPicker
                      value={newCategory.icon}
                      onChange={(icon) => setNewCategory({ ...newCategory, icon })}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(false)}
                    className="flex-1 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={!newCategory.name || !newCategory.points}
                    className="flex-1 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg text-sm font-medium disabled:opacity-40"
                  >
                    添加
                  </button>
                </div>
              </div>
            )}

            {/* 类别列表 */}
            <div className="grid grid-cols-2 gap-2">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  className={`relative p-3 rounded-xl border-2 transition-all active:scale-[0.97] cursor-pointer ${
                    selectedPreset === cat.id
                      ? 'border-primary bg-gradient-to-br from-primary/10 to-accent/10'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                  onClick={() => handlePresetSelect(cat)}
                >
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat); }}
                    className="absolute top-1 right-1 p-1 text-gray-300 hover:text-red-500 rounded transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                  <div className="text-lg sm:text-xl mb-1">{cat.icon}</div>
                  <div className="text-xs sm:text-sm font-medium truncate pr-4">{cat.name}</div>
                  <div className="text-xs text-gray-500">{type === 'earn' ? '+' : '-'}{cat.points}分</div>
                </div>
              ))}
            </div>
          </div>

          {/* 积分数量 */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">积分数量</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || (/^\d+$/.test(val) && val.length <= 4)) {
                  setAmount(val);
                  setSelectedPreset('');
                }
              }}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-1 focus:ring-primary text-base"
              placeholder="输入积分数量（1-1000整数）"
              required
              min="1"
              max="1000"
              step="1"
            />
            {type === 'spend' && currentBalance > 0 && (
              <p className="text-xs text-gray-400 mt-1">当前余额：{currentBalance}分</p>
            )}
            {type === 'spend' && currentBalance === 0 && (
              <p className="text-xs text-red-400 mt-1">当前余额不足，无法消费</p>
            )}
          </div>

          {/* 原因说明 */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">原因说明</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => { setReason(e.target.value); setSelectedPreset(''); }}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:ring-1 focus:ring-primary text-base"
              placeholder="输入原因说明"
              required
              maxLength={50}
            />
          </div>

          {/* 提交按钮 */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium touch-target text-base"
            >
              取消
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 text-white rounded-xl font-medium transition-all touch-target text-base active:scale-[0.98] shadow-sm ${
                type === 'earn'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-md'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-md'
              }`}
            >
              确认{type === 'earn' ? '获得' : '消费'}
            </button>
          </div>
        </form>
      </div>

      {/* 家长密码验证 */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => { setShowPinModal(false); setPendingSubmit(null); }}
        onSuccess={() => {
          setShowPinModal(false);
          pendingSubmit?.();
          setPendingSubmit(null);
        }}
        mode="verify"
      />
    </div>
  );
}
