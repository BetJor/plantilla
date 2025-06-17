
import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuaris de mostra
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Maria García',
    email: 'maria.garcia@mutua.es',
    role: 'supervisor',
    centre: 'Hospital Central Barcelona',
    department: 'Cirurgia'
  },
  {
    id: '2',
    name: 'Joan Martínez',
    email: 'joan.martinez@mutua.es',
    role: 'centre_user',
    centre: 'CAP Gràcia',
    department: 'Sistemes'
  },
  {
    id: '3',
    name: 'Anna López',
    email: 'anna.lopez@mutua.es',
    role: 'quality',
    centre: 'Clínica Diagonal',
    department: 'Qualitat'
  },
  {
    id: '4',
    name: 'Admin Sistema',
    email: 'admin@mutua.es',
    role: 'admin',
    centre: 'Direcció General'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUsers[0]); // Per defecte loguejat com a Dr. Maria García

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulació de login
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'demo') {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
