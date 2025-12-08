import { db } from '$lib/server/db';
import { toy } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request }) => {
	const data = await request.json();
	
	try {
		// Update in database
		const result = await db
			.update(toy)
			.set({
				name: data.name,
				quantity: data.quantity,
				dateObtained: data.dateObtained || null,
				picture: data.picture || 'nya.jpg',
				notes: data.notes || null
			})
			.where(eq(toy.id, params.id));
		
		return json({ success: true });
	} catch (err) {
		console.error('Error updating toy:', err);
		throw error(500, 'Failed to update toy');
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		await db.delete(toy).where(eq(toy.id, params.id));
		return json({ success: true });
	} catch (err) {
		console.error('Error deleting toy:', err);
		throw error(500, 'Failed to delete toy');
	}
};
