import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMyProfile } from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "mini_jira_token";
const USER_KEY = "mini_jira_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const rawUser = localStorage.getItem(USER_KEY);
    return rawUser ? JSON.parse(rawUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = ({ token: nextToken, user: nextUser }) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  useEffect(() => {
    const syncProfile = async () => {
      if (!token) {
        return;
      }

      setLoading(true);
      try {
        const profile = await getMyProfile(token);
        setUser(profile);
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    syncProfile();
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "admin",
      login,
      logout
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
