import React from 'react';

export default function StatCard({ icon: Icon, label, value, hint, trend, color = 'indigo' }) {
  const colors = {
    indigo: 'text-[#ff2bff] bg-[#ff2bff]/10 border-[#ff2bff]/20',
    brand: 'text-[#ff2bff] bg-[#ff2bff]/10 border-[#ff2bff]/20',
    cyan: 'text-[#00d4ff] bg-[#00d4ff]/10 border-[#00d4ff]/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    violet: 'text-[#c77dff] bg-[#942cc3]/10 border-[#942cc3]/20',
  };

  return (
    <div className="glass-card p-4 hover:border-white/10 transition-colors duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend}
      </div>
      <p className="text-2xl font-bold text-gray-50 mt-3 tabular-nums">{value}</p>
      <p className="text-xs font-medium text-[#a79fc4] mt-1">{label}</p>
      {hint && <p className="text-[11px] text-[#6b6288] mt-2 leading-relaxed">{hint}</p>}
    </div>
  );
}
