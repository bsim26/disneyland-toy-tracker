import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

// Support both Turso (local/dev) and Cloudflare D1 (production)
let client;

if (env.DATABASE_URL) {
	// Turso connection (local development)
	const config: any = { url: env.DATABASE_URL };
	if (env.DATABASE_AUTH_TOKEN) {
		config.authToken = env.DATABASE_AUTH_TOKEN;
	}
	client = createClient(config);
} else {
	throw new Error('DATABASE_URL is not set');
}

export const db = drizzle(client, { schema });
