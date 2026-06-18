import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const STYLES = {
  success: {
    wrap: 'bg-zinc-900/95 border-emerald-500/30 shadow-emerald-500/10',
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
    text: 'text-emerald-50',
  },
  error: {
    wrap: 'bg-zinc-900/95 border-red-500/30 shadow-red-500/10',
    icon: AlertCircle,
    iconColor: 'text-red-400',
    text: 'text-red-50',
  },
  info: {
    wrap: 'bg-zinc-900/95 border-violet-500/30 shadow-violet-500/10',
    icon: Info,
    iconColor: 'text-violet-400',
    text: 'text-violet-50',
  },
};

export default function Toast({ message, type = 'success', onClose }) {
  const style = STYLES[type] || STYLES.info;
  const Icon = style.icon;

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-xl
        shadow-2xl min-w-[300px] max-w-sm animate-slide-in-right
        ${style.wrap}
      `}
      role="alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${style.iconColor}`} />
      <p className={`text-sm font-medium flex-1 ${style.text}`}>{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
