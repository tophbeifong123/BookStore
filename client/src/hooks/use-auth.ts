// ===========================================
// Auth Hooks
// ===========================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services";
import { queryKeys } from "./query-keys";
import type { LoginCredentials, RegisterCredentials } from "@/types";

/**
 * Hook to get current user profile
 */
export function useProfile() {
  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: () => authService.getProfile(),
    enabled: authService.isAuthenticated(),
    retry: false,
  });
}

/**
 * Hook for login
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      navigate("/");
    },
  });
}

/**
 * Hook for registration
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authService.register(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      navigate("/");
    },
  });
}

/**
 * Hook for logout
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    authService.logout();
    queryClient.clear();
    navigate("/login");
  };
}

/**
 * Hook to check if user is authenticated
 */
export function useAuth() {
  const { data: user, isLoading, error } = useProfile();

  return {
    user,
    isLoading,
    isAuthenticated: authService.isAuthenticated() && !error,
    isAdmin: user?.role === "admin",
  };
}
