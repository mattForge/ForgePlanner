import React, { useEffect, useState, createContext, useContext } from 'react';
import { User } from './DataContext'; // Keep your User type

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<{
    requiresPasswordChange: boolean;
  }>;
  register: (data: Omit<User, 'id' | 'role' | 'teamIds'> & { teamId: string }) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ FIXED: Standalone auth - NO DataContext dependency
  useEffect(() => {
    const storedUserId = localStorage.getItem('tf_current_user_id');
    if (storedUserId) {
      // Try to load from localStorage first
      const storedUser = localStorage.getItem('tf_current_user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
        } catch (e) {
          console.log('Invalid stored user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // ✅ MULTI-COMPANY: Auto-assign company by email
    let user = null;
    
    // Global Admin - Full access
    if (email === 'mattcoombes247@gmail.com') {
      user = {
        id: 'global-admin',
        name: 'Matt Coombes',
        email: email,
        role: 'superadmin' as const,
        company_id: 'global',
        password: password, // Demo password matching
        teamIds: [],
        requiresPasswordChange: false
      };
    }
    // Forge Academy users
    else if (email.includes('@forge-academy.com')) {
      const forgeUsers = {
        'hr@forge-academy.com': { id: 'forge-hr', name: 'Forge HR Manager', role: 'hr' as const },
        'employee1@forge-academy.com': { id: 'forge-member1', name: 'Forge Employee 1', role: 'member' as const },
        'employee2@forge-academy.com': { id: 'forge-member2', name: 'Forge Employee 2', role: 'member' as const }
      };
      
      const forgeUser = forgeUsers[email as keyof typeof forgeUsers];
      if (forgeUser && password === 'password123') { // Demo password
        user = {
          id: forgeUser.id,
          name: forgeUser.name,
          email: email,
          role: forgeUser.role,
          company_id: 'forge-academy',
          password: password,
          teamIds: [],
          requiresPasswordChange: false
        };
      }
    }

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('tf_current_user_id', user.id);
      localStorage.setItem('tf_current_user', JSON.stringify(user));
      setIsLoading(false);
      return { requiresPasswordChange: !!user.requiresPasswordChange };
    } else {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
  };

  const changePassword = async (newPassword: string) => {
    if (!currentUser) throw new Error('No user logged in');
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const updatedUser = { ...currentUser, password: newPassword, requiresPasswordChange: false };
    setCurrentUser(updatedUser);
    localStorage.setItem('tf_current_user', JSON.stringify(updatedUser));
    setIsLoading(false);
  };

  const register = async (data: Omit<User, 'id' | 'role' | 'teamIds'> & { teamId: string }) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Demo register - creates Forge Academy member
    const newUser = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'member' as const,
      company_id: 'forge-academy',
      teamIds: [data.teamId],
      requiresPasswordChange: true
    };
    
    // Store in localStorage for demo
    localStorage.setItem('tf_new_user_' + newUser.id, JSON.stringify(newUser));
    setIsLoading(false);
    
    // In real app, this would sync with DatabaseContext
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tf_current_user_id');
    localStorage.removeItem('tf_current_user');
    localStorage.removeItem('tf_new_user');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        changePassword,
        logout,
        isAuthenticated: !!currentUser,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
