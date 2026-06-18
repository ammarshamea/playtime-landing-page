import React from 'react';

const ACCENTS = {
  violet: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  indigo: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  red: 'bg-red-500/15 text-red-400 border-red-500/20',
  zinc: 'bg-zinc-800/80 text-zinc-400 border-white/[0.06]',
};

export default function SectionCard({
  icon: Icon,
  title,
  subtitle,
  children,
  accent = 'violet',
  className = '',
  noPadding = false,
}) {
  const iconStyle = ACCENTS[accent] || ACCENTS.violet;

  return (
    <section className={`surface overflow-hidden ${className}`}>
      {(title || Icon) && (
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3">
          {Icon && (
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${iconStyle}`}
            >
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>}
            {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </section>
  );
}
