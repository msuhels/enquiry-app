import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@supabase/supabase-js";

export interface AuthState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Loading states
  isLoading: boolean;
  isLoginLoading: boolean;
  isLogoutLoading: boolean;
  
  // Error state
  error: string | null;
  
  // Success state
  success: boolean;
  
  // IP state
  ip: any;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setLoginLoading: (loading: boolean) => void;
  setLogoutLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;
  setIp: (ip: any) => void;
  clearError: () => void;
  logout: () => void;
  reset: () => void;
  fetchIp: () => Promise<void>;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isLoginLoading: false,
  isLogoutLoading: false,
  error: null,
  success: false,
  ip: null
};

export const useUserStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        }),
      
      setLoading: (isLoading) =>
        set({ isLoading }),
      
      setLoginLoading: (isLoginLoading) =>
        set({ isLoginLoading }),
      
      setLogoutLoading: (isLogoutLoading) =>
        set({ isLogoutLoading }),
      
      setError: (error) =>
        set({ error }),
      
      setSuccess: (success) =>
        set({ success }),
      
      setIp: (ip) =>
        set({ ip }),
      
      clearError: () =>
        set({ error: null }),
      
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        }),
      
      reset: () =>
        set(initialState),
      
      fetchIp: async () => {
        try {
          const response = await fetch("https://ipapi.co/json/");
          const ipData = await response.json();
          set({ ip: ipData });
        } catch (error) {
          console.error("Failed to fetch IP:", error);
        }
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
