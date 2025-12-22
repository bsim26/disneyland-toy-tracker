import { db } from '$lib/server/db';
import { toy, userToy } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	// Require authentication
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}
	
	const data = await request.json();
	
	try {
		// Update toy name and picture in master table
		await db
			.update(toy)
			.set({
				name: data.name,
				picture: data.picture || 'nya.jpg'
			})
			.where(eq(toy.id, params.id));
		
		// Update user-specific data in userToy table
		await db
			.update(userToy)
			.set({
				quantity: data.quantity,
				dateObtained: data.dateObtained || null,
				notes: data.notes || null,
				boxNumber: data.boxNumber || null
			})
			.where(and(
				eq(userToy.toyId, params.id),
				eq(userToy.userId, locals.user.id)
			));
		
		return json({ success: true });
	} catch (err) {
		console.error('Error updating toy:', err);
		throw error(500, 'Failed to update toy');
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	// Require authentication
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}
	
	try {
		// Delete user-specific toy entry
		await db.delete(userToy).where(and(
			eq(userToy.toyId, params.id),
			eq(userToy.userId, locals.user.id)
		));
		
		// Note: We don't delete from the toy table as it's the master list
		// Other users might still have this toy in their collection
		
		return json({ success: true });
	} catch (err) {
		console.error('Error deleting toy:', err);
		throw error(500, 'Failed to delete toy');
	}
};
