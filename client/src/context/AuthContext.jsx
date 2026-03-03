import { createContext, useContext, useEffect, useState } from 'react';


const AuthContext = createContext(null);

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

  // Restore session from cookie on every page load (including after OAuth redirect)
  useEffect(() => {

    const autoLogin = async () => {
      try {
        const req = await fetch(`${SERVER_URL}/api/auths/me`, {
          method: "POST",
          credentials: "include"
        });
        const res = await req.json();
        if (req.ok && res.data?.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    autoLogin();

  }, []);

  const handleDelete = async (userId) => {
    try {
      const req = await fetch(`${SERVER_URL}/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!req.ok) {
        throw new Error("Can't delete user");
      }

      // Clear local auth state and cookie
      setUser(null);
      setIsAuthenticated(false);
      await fetch(`${SERVER_URL}/api/auths/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch(err) {
      console.log(err);
    }
  }

  const updateProfile = async (userId, formData) => {
    const req = await fetch(`${SERVER_URL}/api/users/${userId}`, {
      method: 'PATCH',
      credentials: 'include',
      body: formData, // FormData — browser sets Content-Type with boundary automatically
    });
    const res = await req.json();
    if (!req.ok) throw new Error(res.message || 'Update failed');
    setUser(res.data.user);
  };

  const changePassword = async (userId, userObj) => {
    const req = await fetch(`${SERVER_URL}/api/users/change-password/${userId}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userObj)
    });

    const res = await req.json();

    if (!req.ok) {
      throw new Error(res.message || "Changing password failed");
    }

    setUser(res.data.user);
  }

  // userObj: { fullname, email, password, confirmPassword }
  const register = async (userObj) => {
    const res = await fetch(`${SERVER_URL}/api/auths/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userObj),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    setUser(data.data.newUser);
    setIsAuthenticated(true);
    return data;
  };

  // userObj: { email, password }
  const login = async (userObj) => {
    const res = await fetch(`${SERVER_URL}/api/auths/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userObj),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    setUser(data.data.user);
    setIsAuthenticated(true);
    return data;
  };

  const logout = async () => {
    // Clear local state immediately so UI responds instantly
    setUser(null);
    setIsAuthenticated(false);
    // Tell the server to clear the auth cookie (best-effort)
    try {
      await fetch(`${SERVER_URL}/api/auths/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (_) {
      // ignore network errors — local state is already cleared
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${SERVER_URL}/api/oauth/google`;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, loginWithGoogle, handleDelete, changePassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
