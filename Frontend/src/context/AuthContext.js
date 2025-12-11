import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in URL first
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    
    if (urlToken) {
      // Decode JWT to get user data
      try {
        const payload = JSON.parse(atob(urlToken.split('.')[1]));
        const userData = {
          id: payload.id,
          email: payload.email,
          role: payload.role
        };
        
        setToken(urlToken);
        setUser(userData);
        localStorage.setItem('token', urlToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      } catch (error) {
        console.error('Error parsing URL token:', error);
      }
    }
    
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    // Listen for storage changes across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        const newToken = localStorage.getItem('token');
        const newUser = localStorage.getItem('user');
        
        if (newToken && newUser) {
          try {
            setToken(newToken);
            setUser(JSON.parse(newUser));
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        } else {
          setToken(null);
          setUser(null);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    setLoading(false);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    // Auth status set
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    // Don't redirect automatically - let components handle navigation
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;