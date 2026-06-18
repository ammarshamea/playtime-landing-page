import React from 'react';
import { Calendar, Clock, Store, Layers, Monitor, Hash } from 'lucide-react';

function Row({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-0">
      <div className="w-8 h-8 rounded-lg bg-zinc-900/80 border border-white/[0.04] flex items-center justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-zinc-600" />
      </div>
      <span className="text-xs text-zinc-600 w-16 flex-shrink-0">{label}</span>
      <span
        className={`text-xs font-medium flex-1 text-right break-all ${highlight || 'text-zinc-200'}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function LicensePreview({ preview, form, derivedPublicKey }) {
  if (!preview) {
    return (
      <div className="surface min-h-[280px] flex flex-col items-center justify-center border-dashed border-white/[0.08]">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900/80 border border-white/[0.06] flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-zinc-700" />
        </div>
        <p className="text-xs text-zinc-600 font-medium">معاينة مباشرة</p>
        <p className="text-[10px] text-zinc-700 mt-1">املأ الحقول لعرض التفاصيل</p>
      </div>
    );
  }

  const fmt = (d) =>
    d.toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' });

  const statusLabel = preview.isExpired
    ? 'منتهي'
    : preview.daysLeft > 0
      ? `${preview.daysLeft} يوم`
      : `${preview.hoursLeft} ساعة`;

  return (
    <div className="surface overflow-hidden sticky top-6">
      <div
        className={`px-5 py-4 border-b border-white/[0.06] flex items-center justify-between ${
          preview.isExpired ? 'bg-red-500/[0.04]' : 'bg-emerald-500/[0.04]'
        }`}
      >
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          معاينة
        </span>
        <span
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tabular-nums ${
            preview.isExpired
              ? 'bg-red-500/15 text-red-400 border border-red-500/20'
              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
          }`}
        >
          {statusLabel}
        </span>
      </div>
      <div className="p-4">
        <Row icon={Store} label="المحل" value={form.shopName || '—'} />
        <Row icon={Layers} label="الخطة" value={form.planType} />
        <Row icon={Monitor} label="محطات" value={form.stationLimit ?? '—'} />
        <Row icon={Calendar} label="البداية" value={fmt(preview.startsAtDate)} />
        <Row
          icon={Clock}
          label="الانتهاء"
          value={fmt(preview.expiresAtDate)}
          highlight={preview.isExpired ? 'text-red-400' : 'text-violet-300'}
        />
        {derivedPublicKey && (
          <Row
            icon={Hash}
            label="المفتاح"
            value={`${derivedPublicKey.slice(0, 14)}…`}
            highlight="text-violet-400 font-mono"
          />
        )}
      </div>
    </div>
  );
}
