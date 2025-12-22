import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { redirect } from '@sveltejs/kit';
import { initializeUserToys } from '$lib/server/initializeUserToys';
import type { Actions } from './$types';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	default: async () => {
		const passwordHash = encodeHexLowerCase(
			sha256(new TextEncoder().encode('password'))
		);

		// Check if user already exists
		const existing = await db.select().from(table.user).where(eq(table.user.username, 'admin'));
		
		if (existing.length === 0) {
			const userId = crypto.randomUUID();
			
			await db.insert(table.user).values({
				id: userId,
				username: 'admin',
				passwordHash,
				age: null
			});
			
			// Initialize new user's toy collection with all toys at qty 0
			try {
				await initializeUserToys(userId);
			} catch (error) {
				console.error('Error initializing user toys:', error);
			}
		}

		redirect(302, '/login');
	}
};
