/**
 * ChildCard.tsx - 孩子信息卡片
 * 
 * 【作用】
 * 展示单个孩子的信息卡片，包含：
 * - 头像/姓名/年龄
 * - 当前积分余额
 * - 获得/消费次数统计
 * - 点击选中孩子（用于快捷加分）
 * - 查看详情按钮（跳转记录页）
 * 
 * 【依赖】
 * - useStore: 读取 records 数据统计获得/消费次数
 * - Child 类型定义
 * - lucide-react: Star/Edit2/Trash2/ChevronRight 图标
 */
import { useStore } from '../store/useStore';
import { Child } from '../types';
import { Star, Edit2, Trash2, ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChildCardProps {
  child: Child;
  isSelected?: boolean;
  onEdit: (child: Child) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

export default function ChildCard({ child, isSelected = false, onEdit, onDelete, onSelect }: ChildCardProps) {
  const records = useStore(state => state.records.filter(r => r.childId === child.id));
  const earnRecords = records.filter(r => r.type === 'earn').length;
  const spendRecords = records.filter(r => r.type === 'spend').length;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => onSelect(child.id)}
      className={`bg-white rounded-2xl shadow-sm p-4 transition-all cursor-pointer ${
        isSelected
          ? 'ring-2 ring-primary shadow-md bg-gradient-to-br from-orange-50/30 to-white'
          : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl text-white font-bold ${
            isSelected
              ? 'bg-gradient-to-br from-primary to-accent shadow-sm'
              : 'bg-gradient-to-br from-primary to-accent'
          }`}>
            {isSelected ? <Check size={22} /> : (child.avatar || child.name.charAt(0))}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 truncate max-w-[120px]">{child.name}</h3>
            <p className="text-xs text-gray-400">{child.age}岁</p>
          </div>
        </div>
        
        <div className="flex space-x-0.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEdit(child)}
            className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(child.id)}
            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className={`rounded-xl p-3 mb-3 ${
        isSelected
          ? 'bg-gradient-to-br from-primary/10 to-accent/10'
          : 'bg-gradient-to-br from-primary/5 to-accent/5'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Star className="text-primary w-4 h-4" />
            <span className="text-xs text-gray-500">当前积分</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{child.totalPoints}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 rounded-xl p-2.5 text-center">
          <div className="text-base font-bold text-green-600">{earnRecords}</div>
          <div className="text-xs text-green-500">获得</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50/50 rounded-xl p-2.5 text-center">
          <div className="text-base font-bold text-orange-600">{spendRecords}</div>
          <div className="text-xs text-orange-500">消费</div>
        </div>
      </div>

      <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onSelect(child.id)}
          className={`flex-1 py-2 rounded-xl font-medium text-xs flex items-center justify-center space-x-1 transition-colors ${
            isSelected
              ? 'bg-primary/10 text-primary'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>{isSelected ? '已选中' : '选择'}</span>
          {isSelected && <Check size={12} />}
        </button>
        <button
          onClick={() => navigate(`/records?child=${child.id}`)}
          className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors font-medium text-xs flex items-center justify-center space-x-1"
        >
          <span>详情</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
