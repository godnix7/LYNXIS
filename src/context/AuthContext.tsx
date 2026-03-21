import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  login: (provider: 'github' | 'gitlab') => Promise<void>;
  logout: () => void;
  completeOnboarding: (profileData?: any) => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:4003/api/auth/me', {
          credentials: 'include'
      });
      if (res.ok) {
          const userData = await res.json();
          setUser(userData);
      } else {
          setUser(null);
          localStorage.removeItem('lynx_token');
      }
    } catch (err) {
      console.error('Session verification failed:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (provider: 'github' | 'gitlab') => {
    // Redirect to backend auth
    window.location.href = `http://localhost:4003/api/auth/${provider}`;
  };

  const logout = async () => {
    try {
        await fetch('http://localhost:4003/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
        console.error('Logout failed', e);
    }
    setUser(null);
    localStorage.removeItem('lynx_token');
    window.location.href = '/';
  };

  const completeOnboarding = async (profileData?: any) => {
    try {
        const res = await fetch('http://localhost:4003/api/users/onboarding', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData || {}),
            credentials: 'include'
        });
        if (res.ok) {
            const updatedUser = await res.json();
            setUser(updatedUser);
        }
    } catch (error) {
        console.error('Failed to complete onboarding:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, completeOnboarding, fetchUser }}>
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
