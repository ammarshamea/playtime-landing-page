import React from 'react';

export default function PageHeader({ icon: Icon, title, subtitle, actions, badge }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-2">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 shadow-glow">
            <Icon className="w-6 h-6 text-violet-400" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50 tracking-tight">{title}</h2>
            {badge}
          </div>
          {subtitle && (
            <p className="text-sm text-zinc-500 mt-1.5 max-w-lg leading-relaxed text-balance">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </header>
  );
}
