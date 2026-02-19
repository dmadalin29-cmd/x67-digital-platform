import { createContext, useContext, useState, useEffect } from "react";
import { API } from "../App";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem("x67_token"));

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Try token first
    const storedToken = localStorage.getItem("x67_token");
    if (storedToken) {
      try {
        const response = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setToken(storedToken);
        } else {
          localStorage.removeItem("x67_token");
          setToken(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    } else {
      // Try session cookie
      try {
        const response = await fetch(`${API}/auth/me`, {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("x67_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (email, password, full_name, phone) => {
    const response = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name, phone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    const data = await response.json();
    localStorage.setItem("x67_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("x67_token");
    setToken(null);
    setUser(null);
  };

  const setUserFromGoogle = (userData) => {
    setUser(userData);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        setUserFromGoogle,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
