import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/api/auth", { withCredentials: true });
        if (response.data.user) {
          setUser(response.data.user);
        } else {
            setUser(null);
        }
      } catch (error) {
        // If 401 or network error, assume not logged in
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    try {
        // The actual login call is usually done in the component, OR we can wrap it here.
        // Based on the plan, let's allow the component to do the heavy lifting or do it here.
        // Let's do the login call here to keep state consistent.
        const response = await axios.post("/api/signin", credentials, { withCredentials: true });
        
        // After successful login, verify token/get user details if the Login API doesn't return them fully
        // Or just rely on the response if it returns the user.
        // Assuming /api/signin returns the user or we fetch it immediately after.
        
        // Let's verify auth immediately to be sure
        const authResponse = await axios.get("/api/auth", { withCredentials: true });
        if (authResponse.data.user) {
             setUser(authResponse.data.user);
             return true;
        }
        return false;
    } catch (error) {
        console.error("Login failed", error);
        return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
      // Even if API fails, clear local state
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
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
