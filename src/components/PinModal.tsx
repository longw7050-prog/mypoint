import { useState, useRef, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useToastStore } from './Toast';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'verify' | 'set' | 'change';
}

export default function PinModal({ isOpen, onClose, onSuccess, mode }: PinModalProps) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [oldPin, setOldPin] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'old' | 'new'>('old');
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const oldInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { parentPin, setParentPin, verifyPin } = useStore();
  const addToast = useToastStore(state => state.addToast);

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '', '', '']);
      setOldPin(['', '', '', '', '', '']);
      setStep('old');
      setError('');
      setTimeout(() => {
        if (mode === 'change' && step === 'old') {
          oldInputRefs.current[0]?.focus();
        } else {
          inputRefs.current[0]?.focus();
        }
      }, 100);
    }
  }, [isOpen, mode]);

  const handlePinChange = (
    index: number,
    value: string,
    currentPin: string[],
    setCurrentPin: (p: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...currentPin];
    newPin[index] = value.slice(-1);
    setCurrentPin(newPin);
    setError('');

    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (
    index: number,
    e: React.KeyboardEvent,
    currentPin: string[],
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (e.key === 'Backspace' && !currentPin[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const pinStr = pin.join('');

    if (mode === 'verify') {
      if (verifyPin(pinStr)) {
        onSuccess();
        onClose();
      } else {
        setError('密码错误，请重试');
        setPin(['', '', '', '', '', '']);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
      return;
    }

    if (mode === 'set') {
      if (pinStr.length !== 6) {
        setError('请输入6位数字密码');
        return;
      }
      setParentPin(pinStr);
      addToast('家长密码设置成功', 'success');
      onSuccess();
      onClose();
      return;
    }

    if (mode === 'change') {
      if (step === 'old') {
        const oldPinStr = oldPin.join('');
        if (oldPinStr.length !== 6) {
          setError('请输入6位旧密码');
          return;
        }
        if (!verifyPin(oldPinStr)) {
          setError('旧密码错误');
          setOldPin(['', '', '', '', '', '']);
          setTimeout(() => oldInputRefs.current[0]?.focus(), 100);
          return;
        }
        setStep('new');
        setError('');
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } else {
        if (pinStr.length !== 6) {
          setError('请输入6位新密码');
          return;
        }
        setParentPin(pinStr);
        addToast('密码修改成功', 'success');
        onSuccess();
        onClose();
      }
    }
  };

  const renderPinInputs = (
    currentPin: string[],
    setCurrentPin: (p: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => (
    <div className="flex justify-center space-x-3 my-6">
      {currentPin.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={digit ? '●' : ''}
          onChange={(e) => handlePinChange(i, e.target.value, currentPin, setCurrentPin, refs)}
          onKeyDown={(e) => handlePinKeyDown(i, e, currentPin, refs)}
          className={`w-11 h-13 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none ${
            digit
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-gray-200 bg-gray-50 text-gray-400'
          } focus:border-primary focus:ring-1 focus:ring-primary/30`}
        />
      ))}
    </div>
  );

  if (!isOpen) return null;

  const isVerifyMode = mode === 'verify';
  const isSetMode = mode === 'set';
  const isChangeMode = mode === 'change';
  const showOldPinStep = isChangeMode && step === 'old';

  const title = isVerifyMode
    ? '家长验证'
    : isSetMode
    ? '设置家长密码'
    : showOldPinStep
    ? '输入旧密码'
    : '设置新密码';

  const subtitle = isVerifyMode
    ? '请输入家长密码以继续操作'
    : isSetMode
    ? '设置6位数字密码，防止孩子误操作'
    : showOldPinStep
    ? '请输入当前家长密码'
    : '请输入新的6位数字密码';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-scaleIn">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <ShieldCheck size={20} className="text-primary" />
            <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <p className="text-sm text-gray-500 text-center">{subtitle}</p>

          {showOldPinStep
            ? renderPinInputs(oldPin, setOldPin, oldInputRefs)
            : renderPinInputs(pin, setPin, inputRefs)
          }

          {error && (
            <p className="text-xs text-red-500 text-center mb-3">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-medium active:scale-[0.98] transition-transform shadow-sm"
          >
            {isVerifyMode ? '验证' : '确认'}
          </button>

          {isVerifyMode && !parentPin && (
            <p className="text-xs text-gray-400 text-center mt-3">未设置密码时无需验证</p>
          )}
        </div>
      </div>
    </div>
  );
}
