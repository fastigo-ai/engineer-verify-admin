import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOtp: (mobile: string) => Promise<{ identifier: string; is_new_user: boolean; message: string }>;
  verifyOtp: (identifier: string, otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and is valid
    const token = api.getToken();
    if (token) {
      // Verify token by calling admin home
      api.getAdminHome()
        .then(() => {
          setIsAuthenticated(true);
        })
        .catch(() => {
          api.logout();
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const sendOtp = async (mobile: string) => {
    return api.sendOtp(mobile);
  };

  const verifyOtp = async (identifier: string, otp: string) => {
    await api.verifyOtp(identifier, otp);
    setIsAuthenticated(true);
  };

  const logout = () => {
    api.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, sendOtp, verifyOtp, logout }}>
      {children}
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
