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
import { X, UserPlus } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 p-4 sm:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">孩子管理</h1>
            <p className="text-sm sm:text-base text-gray-600">管理家庭中的孩子信息</p>
          </div>
          <button
            onClick={() => {
              setEditingChild(null);
              setFormData({ name: '', age: '', avatar: '' });
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto touch-target"
          >
            <UserPlus size={20} />
            <span>添加孩子</span>
          </button>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-12 text-center">
            <div className="text-5xl sm:text-6xl mb-4">👶</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">还没有添加孩子</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">点击上方按钮添加您的第一个孩子</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {children.map((child) => (
              <div key={child.id} className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl sm:text-3xl text-white font-bold">
                    {child.avatar || child.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{child.name}</h3>
                    <p className="text-sm text-gray-500">{child.age}岁</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-3 sm:p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base text-gray-600">当前积分</span>
                    <span className="text-xl sm:text-2xl font-bold text-primary">{child.totalPoints}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(child)}
                    className="flex-1 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base touch-target"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(child.id)}
                    className="flex-1 py-2 sm:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base touch-target"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slideUp sm:animate-scaleIn">
              <div className="sticky top-0 bg-white flex items-center justify-between p-4 sm:p-6 border-b">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
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
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                    placeholder="输入孩子姓名"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">年龄</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
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

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingChild(null);
                      navigate('/children');
                    }}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium touch-target text-base"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium touch-target text-base"
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
