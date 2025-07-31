import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import {jwtDecode} from 'jwt-decode';  // default import, not named

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);   // <-- add role state here
  const inactivityTimerRef = useRef(null);

  const fetchUserDetails = async (access_token) => {
    try {
      const response = await fetch('http://localhost:3000/users/profile', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch user details');
      const data = await response.json();
      setUser(data);
      setRole(data.role);  // <-- update role here too
    } catch (error) {
      console.error('Fetch user error:', error);
    }
  };

  const refreshUserProfile = async () => {
    if (token) {
      await fetchUserDetails(token);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Invalid credentials');
      const { access_token } = await response.json();

      const decoded = jwtDecode(access_token);
      const userInfo = {
        id: decoded.sub,
        username: decoded.username,
        role: decoded.role,
      };
      console.log('User info after decoding token:', userInfo);

      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userInfo);
      setRole(userInfo.role);  // <-- fix here (small s)
      resetInactivityTimer();

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setRole(null);   // <-- clear role on logout
    clearTimeout(inactivityTimerRef.current);
    window.location.href = '/';
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      alert('Session expired due to inactivity.');
      logout();
    }, 60 * 1000); // 1 minute
  };

  const handleActivity = () => {
    if (token) resetInactivityTimer();
  };

  useEffect(() => {
    if (token) {
      fetchUserDetails(token);
      resetInactivityTimer();

      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleActivity);
      window.addEventListener('click', handleActivity);

      return () => {
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keydown', handleActivity);
        window.removeEventListener('click', handleActivity);
      };
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, role, setToken, setUser, setRole, login, logout, refreshUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
