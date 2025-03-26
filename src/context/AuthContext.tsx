
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'author' | 'user';
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for initial development
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password',
    role: 'admin' as const,
    avatar: 'https://i.pravatar.cc/150?u=john'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password',
    role: 'author' as const,
    avatar: 'https://i.pravatar.cc/150?u=jane'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as const,
    avatar: 'https://i.pravatar.cc/150?u=admin'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved session in localStorage
    const savedUser = localStorage.getItem('tech_blog_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('tech_blog_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock login logic
    const matchedUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (matchedUser) {
      const { password, ...userWithoutPassword } = matchedUser;
      setUser(userWithoutPassword);
      localStorage.setItem('tech_blog_user', JSON.stringify(userWithoutPassword));
      toast.success('Logged in successfully');
    } else {
      toast.error('Invalid email or password');
      throw new Error('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if user already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      toast.error('User with this email already exists');
      setIsLoading(false);
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      name,
      email,
      role: 'user' as const,
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`
    };
    
    // In a real app, we would send this to an API
    // For now, just simulate success
    setUser(newUser);
    localStorage.setItem('tech_blog_user', JSON.stringify(newUser));
    toast.success('Account created successfully');
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tech_blog_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
      }}
    >
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
