/**
 * PointRecordItem.tsx - 积分记录项
 * 
 * 【作用】
 * 展示单条积分记录的样式，包含：
 * - 获得/消费图标和颜色区分
 * - 积分变化数值（绿色获得/橙色消费）
 * - 原因说明和日期
 * - 可选的关联孩子名称
 * - 可选的删除按钮
 * 
 * 【依赖】
 * - PointRecord 类型定义
 * - Child 类型定义（可选）
 * - lucide-react: TrendingUp/TrendingDown/Trash2 图标
 * 
 * 【被调用】
 * - Records.tsx: 积分记录页循环渲染
 * 
 * 【Props】
 * - record: PointRecord 对象
 * - child: 关联的 Child 对象（可选）
 * - onDelete: 删除回调（可选）
 */
import { PointRecord, Child } from '../types';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';

interface PointRecordItemProps {
  record: PointRecord;
  child?: Child;
  onDelete?: (id: string) => void;
}

export default function PointRecordItem({ record, child, onDelete }: PointRecordItemProps) {
  const isEarning = record.type === 'earn';
  const date = new Date(record.date).toLocaleDateString('zh-CN');

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
        <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${isEarning ? 'bg-gradient-to-br from-green-100 to-emerald-50' : 'bg-gradient-to-br from-orange-100 to-amber-50'}`}>
          {isEarning ? (
            <TrendingUp className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <TrendingDown className="text-orange-600 w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{record.reason}</h4>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
            <span>{date}</span>
            {child && <span className="hidden xs:inline">• {child.name}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
        <span className={`text-lg sm:text-2xl font-bold ${isEarning ? 'text-green-600' : 'text-orange-600'}`}>
          {isEarning ? '+' : '-'}{record.amount}
        </span>
        
        {onDelete && (
          <button
            onClick={() => onDelete(record.id)}
            className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        )}
      </div>
    </div>
  );
}
