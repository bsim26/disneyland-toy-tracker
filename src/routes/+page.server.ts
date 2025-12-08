import { db } from '$lib/server/db';
import { toy } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export interface Toy {
	id: string;
	name: string;
	quantity: number;
	dateObtained: string | null;
	picture: string;
	notes: string | null;
}

export const load: PageServerLoad = async () => {
	try {
		// Get all toys from database, sorted by quantity (desc), then by date (desc)
		const toys = await db
			.select()
			.from(toy)
			.orderBy(desc(toy.quantity), desc(toy.dateObtained));
		
		return { toys };
	} catch (err) {
		console.error('Error loading toys:', err);
		return { toys: [] };
	}
};
