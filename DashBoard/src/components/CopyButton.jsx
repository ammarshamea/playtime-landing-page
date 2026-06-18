import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ value, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="نسخ"
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
        transition-all duration-200 ease-spring active:scale-95
        ${
          copied
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
            : 'bg-zinc-800/80 text-zinc-400 border border-white/[0.06] hover:text-zinc-200 hover:border-white/10'
        }
        ${className}
      `}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          <span>تم</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>نسخ</span>
        </>
      )}
    </button>
  );
}
