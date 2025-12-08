import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	
	// Create a slug from the name
	const id = data.name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '') + '-' + Date.now();
	
	// Ensure data directory exists
	const dataDir = join(process.cwd(), 'data', 'toys');
	await mkdir(dataDir, { recursive: true });
	
	// Create markdown content
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
	
	// Write the file
	const filePath = join(dataDir, `${id}.md`);
	await writeFile(filePath, frontmatter, 'utf-8');
	
	return json({ id }, { status: 201 });
};
