import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';
import { updateUserEmailAndSetEmailAsVerified } from '$lib/server/user';

export const load: PageServerLoad = async ({ locals }) => {
  // Redirect to login if not authenticated
  if (!locals.user) {
    return redirect(302, '/login');
  }

  return {
    user: locals.user
  };
};

export const actions: Actions = {
  updateProfile: async ({ request, locals }) => {
    // Ensure user is logged in
    if (!locals.user) {
      return { success: false, message: 'Not authenticated' };
    }

    const data = await request.formData();
    const username = data.get('username')?.toString();
    const email = data.get('email')?.toString();

    if (!username || !email) {
      return { success: false, message: 'Username and email are required' };
    }

    try {
      // Update user details
      await updateUserEmailAndSetEmailAsVerified(
        locals.user.id,
        email,
        username
      );

      return { 
        success: true, 
        message: 'Profile updated successfully' 
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { 
        success: false, 
        message: 'Failed to update profile' 
      };
    }
  }
};
