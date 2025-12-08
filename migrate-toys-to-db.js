// Script to migrate toy data from markdown files to Turso database
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { createClient } from '@libsql/client';
import matter from 'gray-matter';
import 'dotenv/config';

// Database connection
const config = { url: process.env.DATABASE_URL };
if (process.env.DATABASE_AUTH_TOKEN) {
	config.authToken = process.env.DATABASE_AUTH_TOKEN;
}

const client = createClient(config);

async function migrateToys() {
	const toysDir = join(process.cwd(), 'data', 'toys');
	
	try {
		// Read all markdown files
		const files = await readdir(toysDir);
		const markdownFiles = files.filter(f => f.endsWith('.md'));
		
		console.log(`Found ${markdownFiles.length} toy markdown files`);
		
		let imported = 0;
		let skipped = 0;
		
		for (const file of markdownFiles) {
			const filePath = join(toysDir, file);
			const content = await readFile(filePath, 'utf-8');
			const { data } = matter(content);
			
			// Generate ID from filename (remove .md extension)
			const id = file.replace('.md', '');
			
			try {
				await client.execute({
					sql: 'INSERT INTO toy (id, name, quantity, date_obtained, picture, notes) VALUES (?, ?, ?, ?, ?, ?)',
					args: [
						id,
						data.name || id,
						data.quantity || 0,
						data.dateObtained || null,
						data.picture || 'nya.jpg',
						data.notes || null
					]
				});
				imported++;
				console.log(`✓ Imported: ${data.name || id}`);
			} catch (error) {
				if (error.message.includes('UNIQUE')) {
					skipped++;
					console.log(`⊘ Skipped (already exists): ${data.name || id}`);
				} else {
					console.error(`✗ Error importing ${file}:`, error.message);
				}
			}
		}
		
		console.log(`\n✅ Migration complete!`);
		console.log(`   Imported: ${imported} toys`);
		console.log(`   Skipped: ${skipped} toys (already in database)`);
		
	} catch (error) {
		console.error('❌ Migration failed:', error);
	} finally {
		process.exit(0);
	}
}

migrateToys();
