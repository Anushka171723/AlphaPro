import { BarChart3, LayoutDashboard, PackageSearch } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const linkBase = 'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200';

export default function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 rounded-[28px] border border-white/70 bg-slate-950 p-5 text-white shadow-soft lg:flex lg:flex-col">
      <div className="mb-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-xl font-black text-slate-950">
          A
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Alpha</h1>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10'}`
          }
        >
          <PackageSearch size={18} /> Products
        </NavLink>

        {isAdmin ? (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10'}`
            }
          >
            <BarChart3 size={18} /> Analytics
          </NavLink>
        ) : null}

        <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
          <div className="mb-2 flex items-center gap-2 text-white">
            <LayoutDashboard size={16} /> Role-based Access
          </div>
          <p>Users access published products only. Admins manage visibility and analytics.</p>
        </div>
      </nav>
    </aside>
  );
}