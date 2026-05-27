import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-0 lg:gap-6 p-3 lg:p-6">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Topbar pathname={location.pathname} />
          <main className="min-w-0 flex-1 rounded-[28px] border border-white/70 bg-white/75 p-4 shadow-soft backdrop-blur xl:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}