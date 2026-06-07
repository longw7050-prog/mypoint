import { create } from 'zustand';

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: 'danger' | 'warning' | 'default';
  onConfirm: () => void;
  openConfirm: (options: Omit<ConfirmState, 'isOpen' | 'onConfirm' | 'confirmText' | 'cancelText' | 'variant' | 'openConfirm' | 'closeConfirm'> & {
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'default';
  }) => void;
  closeConfirm: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '确认',
  cancelText: '取消',
  variant: 'default',
  onConfirm: () => {},
  openConfirm: (options) => {
    set({
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmText: options.confirmText || '确认',
      cancelText: options.cancelText || '取消',
      variant: options.variant || 'default',
      onConfirm: options.onConfirm,
    });
  },
  closeConfirm: () => {
    set({ isOpen: false });
  },
}));

const variantStyles: Record<string, string> = {
  danger: 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600',
  warning: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600',
  default: 'bg-gradient-to-r from-primary to-primary/80 hover:shadow-sm',
};

export default function ConfirmDialog() {
  const { isOpen, title, message, confirmText, cancelText, variant, onConfirm, closeConfirm } = useConfirmStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="flex border-t border-gray-100">
          <button
            onClick={closeConfirm}
            className="flex-1 py-3.5 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              closeConfirm();
            }}
            className={`flex-1 py-3.5 text-white font-medium text-sm transition-all ${variantStyles[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
