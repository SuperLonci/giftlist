import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
  // Ensure user is authenticated, redirect to unauthorized page if not
  requireAuth(event, '/unauthorized');
  
  // No need to return any data for this page
  return {};
};