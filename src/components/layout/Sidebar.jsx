import { BarChart3, LayoutDashboard, PackageSearch } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const linkBase = 'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200';

export default function Sidebar({ mobileOpen = false, onCloseMobile }) {
  const { isAdmin } = useAuth();

  const handleMobileClose = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const mobileLinkClass = ({ isActive }) =>
    `${linkBase} ${isActive ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10'}`;

  return (
    <>
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden" onClick={handleMobileClose} aria-hidden="true" />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 shrink-0 border-r border-white/70 bg-slate-950 p-5 text-white shadow-soft transition-transform duration-200 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-xl font-black text-slate-950">
            A
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Alpha</h1>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="/products"
            className={mobileLinkClass}
            onClick={handleMobileClose}
          >
            <PackageSearch size={18} /> Products
          </NavLink>

          {isAdmin ? (
            <NavLink to="/admin" className={mobileLinkClass} onClick={handleMobileClose}>
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
    </>
  );
}