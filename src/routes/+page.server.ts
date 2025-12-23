import { db } from '$lib/server/db';
import { toy, userToy } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export interface Toy {
	id: string;
	name: string;
	quantity: number;
	dateObtained: string | null;
	picture: string;
	notes: string | null;
	boxNumber: string | null;
}

export const load: PageServerLoad = async ({ locals }) => {
	// Require authentication
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	
	console.log('Loading toys for user:', locals.user.id, locals.user.username);
	
	try {
		// Get user-specific toys by joining toy and userToy tables
		const toys = await db
			.select({
				id: toy.id,
				name: toy.name,
				picture: toy.picture,
				quantity: userToy.quantity,
				dateObtained: userToy.dateObtained,
				notes: userToy.notes,
				boxNumber: userToy.boxNumber
			})
			.from(toy)
			.innerJoin(userToy, eq(toy.id, userToy.toyId))
			.where(eq(userToy.userId, locals.user.id))
			.orderBy(userToy.boxNumber, desc(userToy.quantity), desc(userToy.dateObtained));
		
		console.log('Loaded toys count:', toys.length);
		
		return { toys };
	} catch (err) {
		console.error('Error loading toys:', err);
		return { toys: [] };
	}
};
