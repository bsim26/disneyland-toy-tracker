import { readFile, writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { json, error } from '@sveltejs/kit';
// @ts-ignore - gray-matter doesn't have types
import matter from 'gray-matter';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ params, request }) => {
	const data = await request.json();
	const toyPath = join(process.cwd(), 'data', 'toys', `${params.id}.md`);
	
	try {
		// Read existing file to preserve any additional content
		await readFile(toyPath, 'utf-8');
		
		// Create updated markdown content
		const frontmatter = [
			'---',
			`name: ${data.name}`,
			`quantity: ${data.quantity}`,
			`dateObtained: ${data.dateObtained}`,
			data.picture ? `picture: ${data.picture}` : '',
			data.notes ? `notes: ${data.notes}` : '',
			'---',
			''
		].filter(Boolean).join('\n');
		
		// Write the updated file
		await writeFile(toyPath, frontmatter, 'utf-8');
		
		return json({ success: true });
	} catch {
		throw error(404, 'Toy not found');
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	const toyPath = join(process.cwd(), 'data', 'toys', `${params.id}.md`);
	
	try {
		await unlink(toyPath);
		return json({ success: true });
	} catch {
		throw error(404, 'Toy not found');
	}
};
