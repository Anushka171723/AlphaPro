import { LogOut, Menu, ShieldCheck, UserCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="rounded-[28px] border border-white/70 bg-white/80 px-4 py-4 shadow-soft backdrop-blur xl:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white lg:hidden">
            <Menu size={18} />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Admin Dashboard</p>
            <h2 className="text-xl font-semibold text-slate-950 md:text-2xl">Inventory & Product Insights</h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <UserCircle2 size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">{user?.name}</p>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <ShieldCheck size={13} /> {user?.role}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-3 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-slate-800 hover:shadow-md"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}