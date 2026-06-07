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
    const typeParam = searchParams.get('type');
    if (typeParam === 'earn' || typeParam === 'spend') {
      setFilterType(typeParam);
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-gray-50 pb-4">
      <div className="container mx-auto max-w-6xl px-4 pt-4">
        {/* 标题区 */}
        <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl p-5 shadow-sm mb-3 border border-orange-100/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-base font-semibold text-gray-800">积分记录</h1>
              <p className="text-xs text-gray-400 mt-0.5">查看和管理所有积分记录</p>
            </div>
          </div>
        </div>

        {/* 筛选区 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-3">
              <label className="text-xs text-gray-500 whitespace-nowrap">选择孩子</label>
              <select
                value={selectedChildId || ''}
                onChange={(e) => setSelectedChildId(e.target.value || null)}
                className="flex-1 px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm text-gray-600 focus:ring-1 focus:ring-primary"
              >
                <option value="">所有孩子</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <SegmentedControl
                options={filterOptions}
                value={filterType}
                onChange={setFilterType}
              />

              {selectedChildId && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg text-xs font-medium active:scale-95 transition-transform shadow-sm"
                >
                  <Plus size={14} />
                  <span>添加</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 当前查看的孩子信息 */}
        {selectedChild && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">当前查看</p>
                <p className="text-sm font-semibold text-gray-800">{selectedChild.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">可用积分</p>
                <p className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{selectedChild.totalPoints}</p>
              </div>
            </div>
          </div>
        )}

        {/* 记录列表 */}
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">暂无记录</h3>
            <p className="text-xs text-gray-400">
              {selectedChildId
                ? '还没有为这个孩子添加任何积分记录'
                : '还没有添加任何积分记录'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedRecords.map(({ label, records: groupRecs }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500">{label}</h3>
                  <span className="text-xs text-gray-400">
                    {groupRecs.reduce((sum, r) => sum + (r.type === 'earn' ? r.amount : -r.amount), 0) > 0 ? '+' : ''}
                    {groupRecs.reduce((sum, r) => sum + (r.type === 'earn' ? r.amount : -r.amount), 0)} 积分
                  </span>
                </div>
                <div className="space-y-2">
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
