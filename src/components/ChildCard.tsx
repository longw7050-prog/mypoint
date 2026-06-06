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
import { Star, Edit2, Trash2 } from 'lucide-react';

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
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl sm:text-3xl text-white font-bold">
            {child.avatar || child.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{child.name}</h3>
            <p className="text-sm text-gray-500">{child.age}岁</p>
          </div>
        </div>
        
        <div className="flex space-x-1 sm:space-x-2">
          <button
            onClick={() => onEdit(child)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(child.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-3 sm:p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base text-gray-600">当前积分</span>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-primary">{child.totalPoints}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600">{earnRecords}</div>
          <div className="text-xs text-green-600">获得次数</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold text-orange-600">{spendRecords}</div>
          <div className="text-xs text-orange-600">消费次数</div>
        </div>
      </div>

      <button
        onClick={() => onSelect(child.id)}
        className="w-full py-2 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm sm:text-base touch-target"
      >
        查看详情
      </button>
    </div>
  );
}
