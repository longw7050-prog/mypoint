const AVATARS = [
  '👦', '👧', '🧒', '👶', '🧒',
  '🐱', '🐶', '🐰', '🐻', '🦊',
  '🌸', '⭐', '🌈', '🦋', '🎀',
  '🍎', '🍊', '🍇', '🍓', '🍑',
  '⚽', '🏀', '🎨', '🎵', '💡',
];

interface AvatarPickerProps {
  value: string;
  onChange: (avatar: string) => void;
}

export default function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">选择头像</label>
      <div className="grid grid-cols-5 gap-2 mb-3">
        {AVATARS.map((avatar) => (
          <button
            key={avatar}
            type="button"
            onClick={() => onChange(avatar)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all active:scale-90 ${
              value === avatar
                ? 'bg-primary/20 ring-2 ring-primary scale-110'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {avatar}
          </button>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-400">或自定义:</span>
        <input
          type="text"
          value={AVATARS.includes(value) ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          placeholder="输入表情符号"
        />
      </div>
    </div>
  );
}
