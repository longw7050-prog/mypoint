/**
 * Children.tsx - 孩子管理页
 * 
 * 【作用】
 * 孩子的增删改查（Create/Read/Update/Delete）操作
 * 
 * 【依赖】
 * - useStore: children/records 的 CRUD 操作
 * - AvatarPicker: 可视化选择孩子头像
 * - ConfirmDialog: 删除操作二次确认
 * - Toast: 操作反馈提示
 * - react-router-dom: 路由参数处理（edit=X, delete=X）
 * 
 * 【被调用】
 * - App.tsx (路由 /children)
 * 
 * 【调用关系】
 * - AvatarPicker: 添加/编辑孩子时选择头像
 * - ConfirmDialog: 删除孩子时的二次确认
 * - navigate('/children'): 操作完成后刷新
 */
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Child } from '../types';
import { X, UserPlus, Star, ArrowLeft } from 'lucide-react';
import { useConfirmStore } from '../components/ConfirmDialog';
import { useToastStore } from '../components/Toast';
import AvatarPicker from '../components/AvatarPicker';

export default function Children() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { children, addChild, updateChild, deleteChild, loadData } = useStore();
  const openConfirm = useConfirmStore(state => state.openConfirm);
  const addToast = useToastStore(state => state.addToast);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState({ name: '', age: '', avatar: '' });

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const editId = searchParams.get('edit');
    const deleteId = searchParams.get('delete');

    if (editId) {
      const child = children.find(c => c.id === editId);
      if (child) {
        setEditingChild(child);
        setFormData({ name: child.name, age: child.age.toString(), avatar: child.avatar || '' });
        setIsModalOpen(true);
      }
    }

    if (deleteId) {
      openConfirm({
        title: '删除孩子',
        message: '确定要删除这个孩子的所有数据吗？此操作不可撤销。',
        confirmText: '删除',
        variant: 'danger',
        onConfirm: () => {
          deleteChild(deleteId);
          addToast('已删除孩子信息', 'success');
          navigate('/children');
        },
      });
      navigate('/children');
    }
  }, [searchParams, children, deleteChild, navigate, openConfirm, addToast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age) return;

    if (editingChild) {
      updateChild(editingChild.id, {
        name: formData.name,
        age: parseInt(formData.age),
        avatar: formData.avatar,
      });
      addToast('孩子信息已更新', 'success');
    } else {
      addChild({
        name: formData.name,
        age: parseInt(formData.age),
        avatar: formData.avatar,
      });
      addToast('孩子添加成功', 'success');
    }

    setIsModalOpen(false);
    setEditingChild(null);
    setFormData({ name: '', age: '', avatar: '' });
    navigate('/children');
  };

  const handleEdit = (child: Child) => {
    setEditingChild(child);
    setFormData({ name: child.name, age: child.age.toString(), avatar: child.avatar || '' });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    openConfirm({
      title: '删除孩子',
      message: '确定要删除这个孩子的所有数据吗？此操作不可撤销。',
      confirmText: '删除',
      variant: 'danger',
      onConfirm: () => {
        deleteChild(id);
        addToast('已删除孩子信息', 'success');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-gray-50 pb-4">
      <div className="container mx-auto max-w-6xl px-4 pt-4">
        {/* 标题区 + 返回 + 添加按钮 */}
        <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-2xl p-5 shadow-sm mb-3 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/')}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-base font-semibold text-gray-800">孩子管理</h1>
                <p className="text-xs text-gray-400 mt-0.5">管理家庭中的孩子信息</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingChild(null);
                setFormData({ name: '', age: '', avatar: '' });
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg text-xs font-medium active:scale-95 transition-transform shadow-sm"
            >
              <UserPlus size={14} />
              <span>添加</span>
            </button>
          </div>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <div className="text-4xl mb-3">👶</div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">还没有添加孩子</h3>
            <p className="text-xs text-gray-400 mb-4">点击上方按钮添加您的第一个孩子</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {children.map((child) => (
              <div key={child.id} className="bg-white rounded-2xl shadow-sm p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl text-white font-bold">
                    {child.avatar || child.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">{child.name}</h3>
                    <p className="text-xs text-gray-400">{child.age}岁</p>
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

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(child)}
                    className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors text-xs font-medium"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(child.id)}
                    className="flex-1 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors text-xs font-medium"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 添加/编辑弹窗 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideUp sm:animate-scaleIn">
              <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
                <h2 className="text-base font-semibold text-gray-800">
                  {editingChild ? '编辑孩子信息' : '添加孩子'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingChild(null);
                    navigate('/children');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">姓名</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-sm focus:ring-1 focus:ring-primary"
                    placeholder="输入孩子姓名"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">年龄</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border-0 rounded-lg text-sm focus:ring-1 focus:ring-primary"
                    placeholder="输入孩子年龄"
                    required
                    min="1"
                    max="18"
                  />
                </div>

                <div>
                  <AvatarPicker
                    value={formData.avatar}
                    onChange={(avatar) => setFormData({ ...formData, avatar })}
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingChild(null);
                      navigate('/children');
                    }}
                    className="flex-1 py-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors font-medium text-sm"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-sm transition-all font-medium text-sm"
                  >
                    {editingChild ? '保存' : '添加'}
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
