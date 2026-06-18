import React from 'react';

export default function ChipGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`
              px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ease-spring
              border active:scale-[0.97]
              ${
                selected
                  ? 'bg-violet-600/25 text-violet-200 border-violet-500/40 shadow-sm shadow-violet-600/10'
                  : 'bg-zinc-900/60 text-zinc-500 border-white/[0.06] hover:border-white/10 hover:text-zinc-300'
              }
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
