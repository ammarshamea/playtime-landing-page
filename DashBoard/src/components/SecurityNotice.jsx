import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function SecurityNotice({ children, className = '' }) {
  return (
    <div
      className={`flex gap-3 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] text-sm text-amber-100/90 leading-relaxed animate-fade-up ${className}`}
      role="note"
    >
      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
        <ShieldAlert className="w-4 h-4 text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
