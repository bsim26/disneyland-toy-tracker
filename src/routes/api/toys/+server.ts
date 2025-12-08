import { db } from '$lib/server/db';
import { toy } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	
	// Create a slug from the name
	const id = data.name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	
	// Insert into database
	await db.insert(toy).values({
		id,
		name: data.name,
		quantity: data.quantity || 0,
		dateObtained: data.dateObtained || null,
		picture: data.picture || 'nya.jpg',
		notes: data.notes || null
	});
	
	return json({ id }, { status: 201 });
};
