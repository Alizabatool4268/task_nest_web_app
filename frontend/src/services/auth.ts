import { useAuth } from '@better-auth/react';
import api from './api';

// Authentication service for handling authentication-related API calls
class AuthService {
  /**
   * Get current user's authentication status
   */
  static isAuthenticated(): boolean {
    // Check if user is authenticated using Better Auth
    // This would typically involve checking for the existence of a valid session/token
    if (typeof window !== 'undefined') {
      const sessionToken = localStorage.getItem('better-auth-session-token');
      return !!sessionToken;
    }
    return false;
  }

  /**
   * Get JWT token from Better Auth
   */
  static getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('better-auth-session-token');
      return token ? `Bearer ${token}` : null;
    }
    return null;
  }

  /**
   * Store JWT token in appropriate location
   */
  static setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('better-auth-session-token', token);
    }
  }

  /**
   * Remove JWT token (logout)
   */
  static removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('better-auth-session-token');
    }
  }

  /**
   * Refresh token if needed
   */
  static async refreshToken(): Promise<string | null> {
    // In a real implementation, this would call an API endpoint to refresh the token
    // For Better Auth, this might be handled automatically, but we'll provide a method
    try {
      // Attempt to get a new token using refresh logic
      // This is a placeholder - actual implementation depends on Better Auth's refresh mechanism
      return this.getAuthToken();
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }

  /**
   * Handle JWT expiration
   */
  static async handleTokenExpiration(): Promise<void> {
    console.log('Token has expired, redirecting to login...');
    this.removeAuthToken();

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }

  /**
   * Handle different types of authentication errors
   */
  static handleAuthError(error: any): void {
    console.error('Authentication error:', error);

    // Check error type and handle appropriately
    if (error?.response?.status === 401) {
      console.error('Unauthorized access - token invalid or expired');
      this.handleTokenExpiration();
    } else if (error?.response?.status === 403) {
      console.error('Forbidden access - insufficient permissions');
      // Show appropriate error message to user
    } else {
      console.error('General authentication error');
      // Handle other auth errors
    }
  }
}

export default AuthService;

// Hook for using auth in components (if needed beyond Better Auth's built-in hooks)
export const useAuthService = () => {
  const { signIn, signOut, session } = useAuth();

  return {
    login: signIn,
    logout: signOut,
    session,
    isAuthenticated: !!session,
    authService: AuthService
  };
};