import type { RequestEvent } from '@sveltejs/kit';
import { redirect, error } from '@sveltejs/kit';

/**
 * Middleware to ensure a user is authenticated
 * @param event The request event
 * @param redirectTo Optional path to redirect to if not authenticated (for page routes)
 * @returns The authenticated user or throws an error/redirect
 */
export function requireAuth(event: RequestEvent, redirectTo?: string) {
  const user = event.locals.user;
  
  if (!user) {
    if (redirectTo) {
      // For page routes, redirect to login
      throw redirect(302, redirectTo);
    } else {
      // For API routes, return 401 Unauthorized
      throw error(401, 'Unauthorized');
    }
  }
  
  return user;
}

/**
 * Helper function to check if a user is authenticated
 * @param event The request event
 * @returns Boolean indicating if user is authenticated
 */
export function isAuthenticated(event: RequestEvent): boolean {
  return !!event.locals.user;
}