import { db } from '$lib/server/db';
import { toy, userToy } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Require authentication
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}
	
	const data = await request.json();
	
	// Create a slug from the name
	const id = data.name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	
	// Insert into toy table (master list)
	await db.insert(toy).values({
		id,
		name: data.name,
		picture: data.picture || 'nya.jpg'
	});
	
	// Insert into userToy table (user-specific data)
	await db.insert(userToy).values({
		userId: locals.user.id,
		toyId: id,
		quantity: data.quantity || 0,
		dateObtained: data.dateObtained || null,
		notes: data.notes || null
	});
	
	return json({ id }, { status: 201 });
};
