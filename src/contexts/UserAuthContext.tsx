import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  phone: string;
  name: string;
  email: string;
}

interface UserAuthContextType {
  user: User | null;
  login: (phone: string, name: string, email: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (phone: string, name: string, email: string) => {
    const userData = { phone, name, email };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserAuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
}
