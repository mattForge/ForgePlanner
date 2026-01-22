import React, { useEffect, useState, createContext, useContext } from 'react';
import { User, useData } from './DataContext';

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
  const { users, addUser, updateUser } = useData();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ FIXED: Run ONCE on mount, NO dependency on users
  useEffect(() => {
    const storedUserId = localStorage.getItem('tf_current_user_id');
    if (storedUserId) {
      // Find user immediately from current users array
      const user = users.find((u) => u.id === storedUserId);
      if (user) {
        setCurrentUser(user);
      }
    }
    setIsLoading(false);
  }, []); // ← EMPTY DEPENDENCY ARRAY = RUNS ONCE

  // ✅ NEW: Listen for users changes to update currentUser
  useEffect(() => {
    if (currentUser) {
      const updatedUser = users.find((u) => u.id === currentUser.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    }
  }, [users, currentUser?.id]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const user = users.find(
      (u) =>
        u.email === email && (
          u.password === password || u.oneTimePassword === password
        )
    );

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('tf_current_user_id', user.id);
      setIsLoading(false);
      return {
        requiresPasswordChange: !!user.requiresPasswordChange
      };
    } else {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
  };

  const changePassword = async (newPassword: string) => {
    if (!currentUser) throw new Error('No user logged in');
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    updateUser(currentUser.id, {
      password: newPassword,
      oneTimePassword: null,
      requiresPasswordChange: false
    });
    
    setCurrentUser({
      ...currentUser,
      password: newPassword,
      oneTimePassword: null,
      requiresPasswordChange: false
    });
    setIsLoading(false);
  };

  const register = async (data: Omit<User, 'id' | 'role' | 'teamIds'> & { teamId: string }) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const existingUser = users.find((u) => u.email === data.email);
    if (existingUser) {
      setIsLoading(false);
      throw new Error('Email already in use');
    }

    const newUser = {
      id: Date.now().toString(), // Generate ID
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'member' as const,
      teamIds: [data.teamId]
    };
    
    addUser(newUser);
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tf_current_user_id');
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
