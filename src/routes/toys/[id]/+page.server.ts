import { db } from '$lib/server/db';
import { toy, userToy } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Toy } from '../../+page.server';

export const load: PageServerLoad = async ({ params, locals }) => {
	// Require authentication
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	
	try {
		const toys = await db
			.select({
				id: toy.id,
				name: toy.name,
				picture: toy.picture,
				quantity: userToy.quantity,
				dateObtained: userToy.dateObtained,
				notes: userToy.notes
			})
			.from(toy)
			.innerJoin(userToy, eq(toy.id, userToy.toyId))
			.where(and(
				eq(toy.id, params.id),
				eq(userToy.userId, locals.user.id)
			))
			.limit(1);
		
		if (toys.length === 0) {
			throw error(404, 'Toy not found');
		}
		
		return { toy: toys[0] };
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(404, 'Toy not found');
	}
};
