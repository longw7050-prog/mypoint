/**
 * ChildCard.tsx - 孩子信息卡片
 * 
 * 【作用】
 * 展示单个孩子的信息卡片，包含：
 * - 头像/姓名/年龄
 * - 当前积分余额
 * - 获得/消费次数统计
 * - 查看详情按钮
 * 
 * 【依赖】
 * - useStore: 读取 records 数据统计获得/消费次数
 * - Child 类型定义
 * - lucide-react: Star/Edit2/Trash2 图标
 * 
 * 【被调用】
 * - Home.tsx: 首页展示孩子列表
 * - Children.tsx: 孩子管理页展示孩子列表
 * 
 * 【Props】
 * - child: Child 对象
 * - onEdit: 编辑回调
 * - onDelete: 删除回调
 * - onSelect: 选择/查看详情回调
 */
import { useStore } from '../store/useStore';
import { Child } from '../types';
import { Star, Edit2, Trash2, ChevronRight } from 'lucide-react';

interface ChildCardProps {
  child: Child;
  onEdit: (child: Child) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

export default function ChildCard({ child, onEdit, onDelete, onSelect }: ChildCardProps) {
  const records = useStore(state => state.records.filter(r => r.childId === child.id));
  const earnRecords = records.filter(r => r.type === 'earn').length;
  const spendRecords = records.filter(r => r.type === 'spend').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl text-white font-bold">
            {child.avatar || child.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 truncate">{child.name}</h3>
            <p className="text-xs text-gray-400">{child.age}岁</p>
          </div>
        </div>
        
        <div className="flex space-x-0.5">
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

      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-3 mb-3">
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

      <button
        onClick={() => onSelect(child.id)}
        className="w-full py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors font-medium text-xs flex items-center justify-center space-x-1"
      >
        <span>查看详情</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
