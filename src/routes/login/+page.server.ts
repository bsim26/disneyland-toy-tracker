import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import * as auth from '$lib/server/auth';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!username || !password) {
			return fail(400, { error: 'Username and password required' });
		}

		const results = await db
			.select()
			.from(table.user)
			.where(eq(table.user.username, username as string));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { error: 'Invalid username or password' });
		}

		const passwordHash = encodeHexLowerCase(
			sha256(new TextEncoder().encode(password as string))
		);

		if (passwordHash !== existingUser.passwordHash) {
			return fail(400, { error: 'Invalid username or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		redirect(302, '/');
	}
};
