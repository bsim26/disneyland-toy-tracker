import { json } from '@sveltejs/kit';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { password, username } = await request.json();
	
	const generatedHash = encodeHexLowerCase(
		sha256(new TextEncoder().encode(password))
	);
	
	// Get the stored hash from database
	const results = await db
		.select()
		.from(table.user)
		.where(eq(table.user.username, username));
	
	const user = results.at(0);
	
	return json({
		generatedHash,
		storedHash: user?.passwordHash,
		match: generatedHash === user?.passwordHash,
		userExists: !!user
	});
};
