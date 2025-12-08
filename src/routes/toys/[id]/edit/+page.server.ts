import { readFile } from 'fs/promises';
import { join } from 'path';
// @ts-ignore - gray-matter doesn't have types
import matter from 'gray-matter';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Toy } from '../../../+page.server';

export const load: PageServerLoad = async ({ params }) => {
	const toyPath = join(process.cwd(), 'data', 'toys', `${params.id}.md`);
	
	try {
		const content = await readFile(toyPath, 'utf-8');
		const { data } = matter(content);
		
		const toy: Toy = {
			id: params.id,
			name: data.name || 'Unnamed Toy',
			quantity: data.quantity || 0,
			dateObtained: data.dateObtained || new Date().toISOString(),
			picture: data.picture,
			notes: data.notes
		};
		
		return { toy };
	} catch {
		throw error(404, 'Toy not found');
	}
};
