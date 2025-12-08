import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Allow access to login and setup pages without auth
	if (url.pathname === '/login' || url.pathname === '/setup') {
		return { user: locals.user };
	}

	// Protect all other routes
	if (!locals.user) {
		redirect(302, '/login');
	}

	return {
		user: locals.user
	};
};
