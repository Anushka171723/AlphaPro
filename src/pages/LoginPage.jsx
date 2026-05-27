import { Sparkles, Shield, UserRound } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginCard({ title, description, icon, onClick, accent }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full cursor-pointer rounded-[28px] border p-8 text-center shadow-soft transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 hover:shadow-xl ${
        accent
          ? 'border-slate-950 bg-slate-950 text-white hover:border-blue-500/20 hover:shadow-[0_18px_60px_rgba(59,130,246,0.14)]'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className={`mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl ${accent ? 'bg-white text-slate-950' : 'bg-slate-950 text-white'}`}>
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold sm:text-xl">{title}</h3>
      <p className={`mt-2 text-sm leading-6 ${accent ? 'text-slate-300' : 'text-slate-500'}`}>{description}</p>
      <div
        className={`mt-6 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg ${
          accent
            ? 'bg-white text-slate-950 shadow-white/10'
            : 'bg-slate-950 text-white shadow-slate-950/10'
        }`}
      >
        Enter as {title}
      </div>
    </button>
  );
}

export default function LoginPage() {
  const { loginAs, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/products'} replace />;
  }

  const handleLogin = (role) => {
    loginAs(role);
    const destination = location.state?.from?.pathname || (role === 'admin' ? '/admin' : '/products');
    navigate(destination, { replace: true });
  };

  return (
    <div className="min-h-screen px-4 py-10 text-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="login-left mx-0 w-full shadow-[0_0_80px_rgba(59,130,246,0.08)]">
          <div className="left-accent-circle" aria-hidden="true" />

          <div className="flex min-h-[380px] flex-col items-start justify-between p-5 text-left sm:p-6 md:min-h-[460px] md:p-10">
            <div>
              <div className="top-pill">
                <span style={{width:8,height:8,display:'inline-block',borderRadius:999,background:'rgba(255,255,255,0.6)'}} />
                <span>Role-based dashboard access</span>
              </div>

              <div className="mt-6">
                <p className="alpha-label inline-flex items-center gap-2 text-sm uppercase">
                  <Sparkles size={12} />
                  <span>Alpha</span>
                </p>
                <h1 className="mt-4 max-w-[18ch] text-3xl font-extrabold tracking-tight sm:text-4xl md:max-w-xl md:text-5xl">
                  Products, analytics, and publishing controls in one place.
                </h1>
                <p className="mt-4 max-w-none desc text-sm leading-6 sm:max-w-[600px] sm:leading-7 md:text-base">
                  Login as a user to browse only published products, or login as admin to inspect analytics and toggle visibility.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {['Responsive layout', 'URL sync', 'Live toggles'].map((item) => (
                <div key={item} className="badge-pill">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid w-full gap-4">
          <LoginCard
            title="User View"
            description="Browse published products and access detailed product pages."
            icon={<UserRound size={26} />}
            onClick={() => handleLogin('user')}
          />
          <LoginCard
            title="Admin View"
            description="Access analytics, manage inventory, and control visibility."
            icon={<Shield size={26} />}
            onClick={() => handleLogin('admin')}
            accent
          />
        </section>
      </div>
    </div>
  );
}