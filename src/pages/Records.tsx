/**
 * Records.tsx - 积分记录页
 * 
 * 【作用】
 * 展示所有积分记录，按日期分组（今天/昨天/具体日期）
 * 支持按孩子筛选、按类型筛选（全部/获得/消费）
 * 
 * 【依赖】
 * - useStore: 获取 children/records 数据
 * - PointRecordItem: 单条积分记录的展示组件
 * - AddPointModal: 添加积分记录的弹窗
 * - SegmentedControl: 类型筛选的分段控件
 * - react-router-dom: 路由参数处理（child=X 预选孩子）
 * 
 * 【被调用】
 * - App.tsx (路由 /records)
 * 
 * 【调用关系】
 * - PointRecordItem: 循环渲染每条积分记录
 * - AddPointModal: 点击"添加记录"按钮打开
 * - SegmentedControl: 切换全部/获得/消费筛选
 */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import PointRecordItem from '../components/PointRecordItem';
import AddPointModal from '../components/AddPointModal';
import SegmentedControl from '../components/SegmentedControl';
import { Plus } from 'lucide-react';
import { useConfirmStore } from '../components/ConfirmDialog';
import { useToastStore } from '../components/Toast';

export default function Records() {
  const [searchParams] = useSearchParams();
  const { children, records, loadData, deleteRecord } = useStore();
  const openConfirm = useConfirmStore(state => state.openConfirm);
  const addToast = useToastStore(state => state.addToast);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'earn' | 'spend'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
    const childId = searchParams.get('child');
    if (childId) {
      setSelectedChildId(childId);
    }
  }, [loadData, searchParams]);

  const filteredRecords = records
    .filter(record => !selectedChildId || record.childId === selectedChildId)
    .filter(record => filterType === 'all' || record.type === filterType)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const selectedChild = children.find(c => c.id === selectedChildId);

  // 按日期分组
  const groupedRecords: { label: string; records: typeof filteredRecords }[] = [];
  const groupMap = new Map<string, typeof filteredRecords>();
  
  filteredRecords.forEach(record => {
    const date = new Date(record.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let label: string;
    if (date.toDateString() === today.toDateString()) {
      label = '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      label = '昨天';
    } else {
      label = date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
    }
    
    if (!groupMap.has(label)) {
      groupMap.set(label, []);
    }
    groupMap.get(label)!.push(record);
  });
  
  groupMap.forEach((recs, label) => {
    groupedRecords.push({ label, records: recs });
  });

  const handleDeleteRecord = (id: string) => {
    openConfirm({
      title: '删除记录',
      message: '确定要删除这条积分记录吗？积分将会回退。',
      confirmText: '删除',
      variant: 'danger',
      onConfirm: () => {
        deleteRecord(id);
        addToast('记录已删除', 'success');
      },
    });
  };

  const filterOptions = [
    { value: 'all' as const, label: '全部' },
    { value: 'earn' as const, label: '获得' },
    { value: 'spend' as const, label: '消费' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 p-4 sm:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">积分记录</h1>
          <p className="text-sm sm:text-base text-gray-600">查看和管理所有积分记录</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 gap-4">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">选择孩子:</label>
              <select
                value={selectedChildId || ''}
                onChange={(e) => setSelectedChildId(e.target.value || null)}
                className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
              >
                <option value="">所有孩子</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
            </div>

            <SegmentedControl
              options={filterOptions}
              value={filterType}
              onChange={setFilterType}
            />

            {selectedChildId && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto touch-target"
              >
                <Plus size={20} />
                <span className="text-sm sm:text-base">添加记录</span>
              </button>
            )}
          </div>
        </div>

        {selectedChild && (
          <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-4 sm:p-6 mb-6 text-white shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm sm:text-lg opacity-80">当前查看</h3>
                <p className="text-xl sm:text-2xl font-bold">{selectedChild.name}</p>
              </div>
              <div className="text-left sm:text-right">
                <h3 className="text-sm sm:text-lg opacity-80">可用积分</h3>
                <p className="text-3xl sm:text-4xl font-bold">{selectedChild.totalPoints}</p>
              </div>
            </div>
          </div>
        )}

        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl mb-4">📝</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">暂无记录</h3>
            <p className="text-sm sm:text-base text-gray-600">
              {selectedChildId
                ? '还没有为这个孩子添加任何积分记录'
                : '还没有添加任何积分记录'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedRecords.map(({ label, records: groupRecs }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-500">{label}</h3>
                  <span className="text-xs text-gray-400">
                    {groupRecs.reduce((sum, r) => sum + (r.type === 'earn' ? r.amount : -r.amount), 0) > 0 ? '+' : ''}
                    {groupRecs.reduce((sum, r) => sum + (r.type === 'earn' ? r.amount : -r.amount), 0)} 积分
                  </span>
                </div>
                <div className="space-y-3">
                  {groupRecs.map((record) => (
                    <PointRecordItem
                      key={record.id}
                      record={record}
                      child={children.find(c => c.id === record.childId)}
                      onDelete={handleDeleteRecord}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedChildId && (
          <AddPointModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            childId={selectedChildId}
          />
        )}
      </div>
    </div>
  );
}
