import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/apiServices";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Sync user state on initial app load or token change
  useEffect(() => {
  async function loadUser() {
    if (token) {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          const res = await authService.getProfile();
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (error) {
        console.error("Session load error:", error);
        logout();
      } finally {
        setLoading(false);
      }
    } else {
      setUser(null);
      setLoading(false);
    }
  }

  loadUser();
}, [token]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setToken(res.data.token);
    setUser(res.data.user);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    // After registration, log the user in with returned token/user
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
