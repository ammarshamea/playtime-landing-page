import React from 'react';

export default function SegmentedControl({ options, value, onChange, className = '' }) {
  return (
    <div
      className={`flex p-1 rounded-xl bg-zinc-950/80 border border-white/[0.06] ${className}`}
      role="tablist"
    >
      {options.map((opt) => {
        const id = opt.id ?? opt.value;
        const selected = value === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(id)}
            className={`
              relative flex-1 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap
              transition-all duration-200 ease-spring
              ${
                selected
                  ? 'text-white bg-violet-600/90 shadow-md shadow-violet-600/25'
                  : 'text-zinc-500 hover:text-zinc-300'
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
