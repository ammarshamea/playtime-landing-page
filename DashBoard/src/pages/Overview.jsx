import React from 'react';
import { KeyRound, Key, ScanSearch, ArrowUpLeft, History } from 'lucide-react';
import { loadTokenHistory } from '../utils/history.js';
import PageShell from '../components/ui/PageShell.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';

const ACTIONS = [
  {
    id: 'generate',
    icon: KeyRound,
    title: 'توليد Token',
    desc: 'إنشاء كود تفعيل موقّع',
    accent: 'from-violet-600/20 to-indigo-600/10',
    iconBg: 'bg-violet-500/15 text-violet-400',
  },
  {
    id: 'keys',
    icon: Key,
    title: 'المفاتيح',
    desc: 'توليد زوج Ed25519',
    accent: 'from-indigo-600/20 to-blue-600/10',
    iconBg: 'bg-indigo-500/15 text-indigo-400',
  },
  {
    id: 'decode',
    icon: ScanSearch,
    title: 'قراءة Token',
    desc: 'فك وتحليل الكود',
    accent: 'from-blue-600/20 to-cyan-600/10',
    iconBg: 'bg-blue-500/15 text-blue-400',
  },
];

export default function Overview({ onNavigate }) {
  const history = loadTokenHistory();

  return (
    <PageShell className="max-w-5xl">
      <PageHeader
        title="مرحباً"
        subtitle="لوحة تحكم بسيطة لتوليد وإدارة أكواد التفعيل — كل العمليات محلية وآمنة."
        badge={<span className="badge-violet">PT1</span>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ACTIONS.map(({ id, icon: Icon, title, desc, accent, iconBg }) => (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            className="surface-interactive group relative p-6 text-right overflow-hidden"
          >
            <div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${accent}`}
            />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-11 h-11 rounded-xl border border-white/[0.06] flex items-center justify-center ${iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpLeft className="w-4 h-4 text-zinc-700 group-hover:text-violet-400 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </div>
              <h3 className="text-base font-semibold text-zinc-100 mb-1">{title}</h3>
              <p className="text-xs text-zinc-500">{desc}</p>
            </div>
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <section className="surface overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-zinc-600" />
              <h2 className="text-sm font-semibold text-zinc-300">آخر التوليدات</h2>
            </div>
            <span className="text-xs text-zinc-600 tabular-nums px-2 py-0.5 rounded-lg bg-zinc-900/80">
              {history.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.04] text-[11px] text-zinc-600 uppercase tracking-wider">
                  <th className="text-right font-medium px-5 py-3">المحل</th>
                  <th className="text-right font-medium px-5 py-3">الخطة</th>
                  <th className="text-right font-medium px-5 py-3">المحطات</th>
                  <th className="text-left font-medium px-5 py-3">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {history.slice(0, 8).map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    onClick={() => onNavigate('generate')}
                  >
                    <td className="px-5 py-3.5 font-medium text-zinc-200 group-hover:text-violet-200 transition-colors">
                      {item.shopName}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="badge-violet text-[10px] normal-case">{item.planType}</span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500 tabular-nums">{item.stationLimit}</td>
                    <td className="px-5 py-3.5 text-left text-zinc-600 text-xs tabular-nums">
                      {new Date(item.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </PageShell>
  );
}
