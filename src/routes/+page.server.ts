import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
// @ts-ignore - gray-matter doesn't have types
import matter from 'gray-matter';
import type { PageServerLoad } from './$types';

export interface Toy {
	id: string;
	name: string;
	quantity: number;
	dateObtained: string;
	picture?: string;
	notes?: string;
}

export const load: PageServerLoad = async () => {
	const toysDir = join(process.cwd(), 'data', 'toys');
	
	try {
		const files = await readdir(toysDir);
		const markdownFiles = files.filter(file => file.endsWith('.md'));
		
		const toys: Toy[] = await Promise.all(
			markdownFiles.map(async (file) => {
				const content = await readFile(join(toysDir, file), 'utf-8');
				const { data } = matter(content);
				
				return {
					id: file.replace('.md', ''),
					name: data.name || 'Unnamed Toy',
					quantity: data.quantity || 0,
					dateObtained: data.dateObtained || new Date().toISOString(),
					picture: data.picture,
					notes: data.notes
				};
			})
		);
		
		// Sort by quantity (highest first), then by date obtained (newest first)
		toys.sort((a, b) => {
			// If quantities are different, sort by quantity (descending)
			if (a.quantity !== b.quantity) {
				return b.quantity - a.quantity;
			}
			// If quantities are the same, sort by date (newest first)
			return new Date(b.dateObtained).getTime() - new Date(a.dateObtained).getTime();
		});
		
		return { toys };
	} catch (err) {
		console.error('Error loading toys:', err);
		// If directory doesn't exist, return empty array
		return { toys: [] };
	}
};
