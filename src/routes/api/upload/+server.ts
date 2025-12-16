import { json } from '@sveltejs/kit';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		
		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}
		
		// Get file buffer
		const buffer = Buffer.from(await file.arrayBuffer());
		
		// Generate filename
		const filename = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
		
		// Save to static/images
		const filepath = join('static', 'images', filename);
		await writeFile(filepath, buffer);
		
		return json({ filename });
	} catch (error) {
		console.error('Upload error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Upload failed' },
			{ status: 500 }
		);
	}
};
