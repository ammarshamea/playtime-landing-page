import React from 'react';

export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="surface border-dashed border-white/[0.08] p-12 flex flex-col items-center text-center animate-fade-in">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-zinc-900/80 border border-white/[0.06] flex items-center justify-center mb-5">
          <Icon className="w-8 h-8 text-zinc-700" />
        </div>
      )}
      <p className="text-sm font-medium text-zinc-400">{title}</p>
      {description && <p className="text-xs text-zinc-600 mt-2 max-w-xs">{description}</p>}
    </div>
  );
}
