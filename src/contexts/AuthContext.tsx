"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role?: "station_manager" | "engineer" | "hr" | "finance" | "director" | "admin";
  department?:
    | "Operations"
    | "Engineering"
    | "HR"
    | "Finance"
    | "Corporate Affairs"
    | "Architecture & Planning"
    | "Project Management"
    | "Environment"
    | "Commercial"
    | "IT";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in (in a real app, this would check localStorage or cookies)
    const savedUser = localStorage.getItem("docrail-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // For demo purposes, automatically log in a demo user
        const demoUser: User = {
          id: "1",
          name: "DocRail Officer",
          email: "officer@docrail.ai",
          role: "engineer",
          department: "Engineering"
        };
      setUser(demoUser);
      localStorage.setItem("docrail-user", JSON.stringify(demoUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call - in a real app, this would be an actual authentication request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any email/password combination
    if (email && password) {
      const userData: User = {
        id: "1",
        name: email.split("@")[0],
        email: email,
        // naive demo mapping for role/department
        role: email.includes("finance") ? "finance" : email.includes("hr") ? "hr" : "engineer",
        department: email.includes("finance")
          ? "Finance"
          : email.includes("hr")
          ? "HR"
          : "Operations",
      };
      
      setUser(userData);
      localStorage.setItem("docrail-user", JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("docrail-user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
