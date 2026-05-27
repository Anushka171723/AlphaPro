import React from 'react';

function StatCard({ label, value, subtext, accent = false }) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className={`mt-3 text-3xl font-semibold tracking-tight ${accent ? 'text-orange-500' : 'text-slate-950'}`}>
        {value}
      </div>
      {subtext ? <p className="mt-2 text-sm text-slate-500">{subtext}</p> : null}
    </div>
  );
}

export default React.memo(StatCard);