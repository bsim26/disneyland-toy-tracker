import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const users = await db.select().from(user);
		
		return {
			success: true,
			userCount: users.length,
			hasAdmin: users.some(u => u.username === 'admin'),
			envCheck: {
				hasDatabaseUrl: !!process.env.DATABASE_URL,
				hasAuthToken: !!process.env.DATABASE_AUTH_TOKEN
			}
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
			envCheck: {
				hasDatabaseUrl: !!process.env.DATABASE_URL,
				hasAuthToken: !!process.env.DATABASE_AUTH_TOKEN
			}
		};
	}
};
