
import { create } from 'zustand';
import { toast } from "sonner";

export const mockUsers = [
  {
    id: "1",
    email: "user@example.com",
    name: "Demo User",
    password: "password123",
  },
  {
    id: "2",
    email: "admin@example.com",
    name: "Admin User",
    password: "admin123",
  },
];

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(user => user.email === email && user.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        set({ user: userWithoutPassword, isAuthenticated: true });
        
        localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
        toast.success("Login successful");
        return true;
      } else {
        toast.error("Invalid credentials");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      return false;
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('auth_user');
    toast.info("Logged out successfully");
  },
}));

// Try to restore session from localStorage
export const initAuth = () => {
  const storedUser = localStorage.getItem('auth_user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      useAuthStore.setState({ user, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem('auth_user');
    }
  }
  return false;
};
