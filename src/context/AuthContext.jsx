import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readJSON, writeJSON } from '../utils/storage';

const AuthContext = createContext(null);

const USERS = {
  admin: {
    id: 'admin-1',
    name: 'Aarav Mehta',
    email: 'admin@alpha.com',
    role: 'admin',
    title: 'System Administrator',
  },
  user: {
    id: 'user-1',
    name: 'Sara Khan',
    email: 'user@alpha.com',
    role: 'user',
    title: 'Standard Viewer',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON('alpha-auth-user', null));

  useEffect(() => {
    if (user) {
      writeJSON('alpha-auth-user', user);
    } else {
      localStorage.removeItem('alpha-auth-user');
    }
  }, [user]);

  const loginAs = (role) => {
    setUser(USERS[role]);
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({
      user,
      loginAs,
      logout,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      isUser: user?.role === 'user',
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}