"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authHandlers } from "@/lib/handlers/auth-module/user";
import { useUserStore } from "@/lib/stores/auth-module";
import type { LoginFormData } from "@/lib/schema/auth-module";
import { createClient } from "@/lib/supabase/adapters/client";

export interface UseAuthReturn {
  // State from Zustand store
  user: any;
  userDetails: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoginLoading: boolean;
  isLogoutLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginFormData) => Promise<boolean>;
  logout: () => Promise<boolean>;
  clearError: () => void;
  getCurrentUser: () => Promise<boolean>;
  fetchUserDetails: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();

  // Get state and actions from Zustand store
  const {
    user,
    userDetails,
    isAuthenticated,
    isLoading,
    isLoginLoading,
    isLogoutLoading,
    error,
    clearError,
    fetchUserDetails,
  } = useUserStore();

  const login = useCallback(
    async (credentials: LoginFormData): Promise<boolean> => {
      const loginToast = toast.loading("Signing in...");

      try {
        const result = await authHandlers.login(credentials);
        // const supabase = createClient();
        // const { data, error } = await supabase.from("users").upsert(
        //   {
        //     last_login_at: new Date(),
        //     last_login_ip: "this would be the ip of the request", //get the ip of the request
        //     email: credentials.email,
        //     id: result.user?.id,
        //   },
        //   {
        //     onConflict: "email",
        //   }
        // );
        // console.log({ data });
        // console.log({ error });
        // if (error) {
        //   // toast.error("Login failed. Please check your credentials.", {
        //   //   id: loginToast,
        //   // });
        //   console.log({ error });
        //   return false;
        // }
        if (result.success) {
          toast.dismiss(loginToast)
          toast.success("Login successful! Redirecting...", );
          
          // Fetch user details after successful login
          await fetchUserDetails();
          
          return true;
        } else {
          console.log({ result });
           toast.dismiss(loginToast)
          toast.error("Login failed. Please check your credentials.", {
            id: loginToast,
          });
          return false;
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("An unexpected error occurred during login.", {
          id: loginToast,
        });
        return false;
      }
    },
    [router]
  );

  const logout = useCallback(async (): Promise<boolean> => {
    const logoutToast = toast.loading("Signing out...");

    try {
      const result = await authHandlers.logout();

      if (result.success) {
        toast.success("Logged out successfully! Redirecting...", {
          id: logoutToast,
        });
        // Small delay to show completion before redirect
        setTimeout(() => {
          router.push("/auth/login");
        }, 500);
        return true;
      } else {
        toast.error("Logout failed. Please try again.", { id: logoutToast });
        return false;
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An unexpected error occurred during logout.", {
        id: logoutToast,
      });
      return false;
    }
  }, [router]);

  const getCurrentUser = useCallback(async (): Promise<boolean> => {
    console.log("hello i am here");

    try {
      const result = await authHandlers.getCurrentUser();
      console.log(result);
      return result.success;
    } catch (error) {
      console.error("Get current user error:", error);
      return false;
    }
  }, []);

  // Set up auth state listener
  useEffect(() => {
    const {
      data: { subscription },
    } = authHandlers.onAuthStateChange((user) => {
      // Auth state is automatically updated in the handler
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    userDetails,
    isAuthenticated,
    isLoading,
    isLoginLoading,
    isLogoutLoading,
    error,
    login,
    logout,
    clearError,
    getCurrentUser,
    fetchUserDetails,
  };
}
