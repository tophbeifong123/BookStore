// ===========================================
// Authentication Service
// ===========================================

import apiClient from "./api-client";
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from "@/types";

const AUTH_TOKEN_KEY = "accessToken";
const USER_KEY = "user";

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    this.setAuth(response);
    return response;
  },

  /**
   * Register a new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", credentials);
    this.setAuth(response);
    return response;
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return apiClient.get<User>("/auth/profile");
  },

  /**
   * Logout - clear stored auth data
   */
  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Store auth data
   */
  setAuth(auth: AuthResponse): void {
    localStorage.setItem(AUTH_TOKEN_KEY, auth.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  },

  /**
   * Get stored access token
   */
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Get stored user
   */
  getStoredUser(): User | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    const user = this.getStoredUser();
    return user?.role === "admin";
  },
};

export default authService;
