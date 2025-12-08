import { db } from '$lib/server/db';
import { toy } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Toy } from '../../../+page.server';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const toys = await db
			.select()
			.from(toy)
			.where(eq(toy.id, params.id))
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
