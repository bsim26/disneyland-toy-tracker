import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	// Check environment variables - Cloudflare uses platform.env
	const env = platform?.env || process.env;
	
	try {
		const users = await db.select().from(user);
		
		return {
			success: true,
			userCount: users.length,
			hasAdmin: users.some(u => u.username === 'admin'),
			envCheck: {
				hasDatabaseUrl: !!env.DATABASE_URL,
				hasAuthToken: !!env.DATABASE_AUTH_TOKEN,
				platform: platform ? 'cloudflare' : 'node'
			}
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			envCheck: {
				hasDatabaseUrl: !!env.DATABASE_URL,
				hasAuthToken: !!env.DATABASE_AUTH_TOKEN,
				platform: platform ? 'cloudflare' : 'node'
			}
		};
	}
};
