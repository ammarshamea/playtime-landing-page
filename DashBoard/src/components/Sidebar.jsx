import React from 'react';
import { LayoutDashboard, KeyRound, Key, ScanSearch, X, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'الرئيسية', icon: LayoutDashboard },
  { id: 'generate', label: 'توليد Token', icon: KeyRound },
  { id: 'keys', label: 'المفاتيح', icon: Key },
  { id: 'decode', label: 'قراءة Token', icon: ScanSearch },
];

export default function Sidebar({ currentPage, onNavigate, open, onClose }) {
  return (
    <aside
      className={`
        fixed lg:static inset-y-0 right-0 z-50
        w-[272px] flex-shrink-0 flex flex-col
        bg-zinc-950/90 backdrop-blur-2xl border-l border-white/[0.06]
        transition-transform duration-300 ease-spring
        ${open ? 'translate-x-0 shadow-2xl shadow-black/50' : 'translate-x-full lg:translate-x-0'}
      `}
    >
      <div className="px-5 h-16 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-50 leading-tight">PlayJaramanaa</p>
            <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">License Console</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        <p className="px-3 mb-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.15em]">
          القائمة
        </p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = currentPage === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={`
                group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right
                transition-all duration-200 ease-spring
                ${
                  active
                    ? 'bg-violet-500/15 text-violet-100'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]'
                }
              `}
            >
              {active && (
                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-violet-500 animate-nav-indicator"
                  aria-hidden
                />
              )}
              <span
                className={`
                  w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200
                  ${
                    active
                      ? 'bg-violet-500/20 text-violet-300'
                      : 'bg-zinc-900/80 text-zinc-600 group-hover:text-zinc-400 group-hover:bg-zinc-800/80'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span className={`text-sm font-medium ${active ? 'text-zinc-50' : ''}`}>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-5 border-t border-white/[0.06]">
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/[0.04]">
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            التوقيع يعمل محلياً في المتصفح — لا يُرسل أي بيانات للشبكة.
          </p>
          <p className="text-[10px] text-zinc-700 font-mono mt-2">Ed25519 · PT1</p>
        </div>
      </div>
    </aside>
  );
}
