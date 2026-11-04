import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext.js';

interface ThemeToggleProps {
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false }) => {
  const { theme, setTheme, toggleTheme } = useTheme();

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? '切换至亮色模式' : '切换至暗色模式'}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
      >
        {theme === 'dark' ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>亮色模式</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>暗色模式</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div
      className="inline-flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs"
      role="group"
      aria-label="主题外观切换"
    >
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
          theme === 'light'
            ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
        <span>亮色</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
          theme === 'dark'
            ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
        <span>暗色</span>
      </button>
    </div>
  );
};
