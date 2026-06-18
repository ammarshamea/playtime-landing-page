import React from 'react';
import CopyButton from './CopyButton.jsx';

export default function ResultField({ label, value, mono = false, multiline = false, badge }) {
  return (
    <div className="space-y-2.5 animate-fade-up">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {label}
          </span>
          {badge && <span className="badge-violet">{badge}</span>}
        </div>
        <CopyButton value={value} />
      </div>

      {multiline ? (
        <pre className="code-block max-h-56 whitespace-pre overflow-auto">{value}</pre>
      ) : (
        <div className={`code-block break-all select-all ${mono ? 'font-mono text-[11px]' : 'text-sm'}`}>
          {value}
        </div>
      )}
    </div>
  );
}
