import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Date.now().toString();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 2500);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  },
}));

const typeStyles: Record<Toast['type'], string> = {
  success: 'bg-gradient-to-r from-green-500 to-emerald-500',
  error: 'bg-gradient-to-r from-red-500 to-rose-500',
  warning: 'bg-gradient-to-r from-orange-500 to-amber-500',
  info: 'bg-gradient-to-r from-blue-500 to-sky-500',
};

const typeIcons: Record<Toast['type'], string> = {
  success: '✓',
  error: '✕',
  warning: '',
  info: 'ℹ',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center space-y-2 w-[90%] max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${typeStyles[toast.type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center space-x-3 w-full animate-toastIn pointer-events-auto`}
          onClick={() => removeToast(toast.id)}
        >
          <span className="text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full bg-white/20 flex-shrink-0">
            {typeIcons[toast.type]}
          </span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
