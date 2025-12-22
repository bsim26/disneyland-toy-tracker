// Migrate existing toy data to user-specific collections
import { createClient } from '@libsql/client';
import 'dotenv/config';

const config = { url: process.env.DATABASE_URL };
if (process.env.DATABASE_AUTH_TOKEN) {
	config.authToken = process.env.DATABASE_AUTH_TOKEN;
}

const client = createClient(config);

// Users who should get the current collection
const USERS_WITH_COLLECTION = ['bsim26', 'admin', 'palonzo', 'lynsey', 'Bekkee'];

// This is the snapshot of toy data BEFORE the schema change
// Captured from check-current-data.js output
const TOY_QUANTITIES = {
	'Aurora': 4,
	'Darth Vader': 4,
	'Anna': 2,
	'Black Panther': 2,
	'Dumbo': 2,
	'Green Alien': 2,
	'Groot': 2,
	'Hatbox Ghost': 2,
	'Isabela': 2,
	'Nemo': 2,
	'Ahsoka': 1,
	'Anxiety': 1,
	'Baymax': 1,
	'BB-8': 1,
	'Beast': 1,
	'Bing Bong': 1,
	'Black Widow': 1,
	'Chip & Dale': 1,
	'Crush': 1,
	'Daisy Duck': 1,
	'Donald Duck': 1,
	'Evil Queen': 1,
	'Goofy': 1,
	'Jack-Jack': 1,
	'Lightning McQueen': 1,
	'Mickey Mouse': 1,
	'Miguel': 1,
	'Mike Wazowski': 1,
	'Moana': 1,
	'Mufasa': 1,
	'Nebula': 1,
	'Nick Wilde': 1,
	'Okoye': 1,
	'Olaf': 1,
	'Pluto': 1,
	'R2-D2': 1,
	'Rapunzel': 1,
	'Rey': 1,
	'Sadness': 1,
	'Sleeping Beauty Castle': 1,
	'Thanos': 1,
	'Tiana': 1,
	'Tinker Bell': 1,
	'Tow Mater': 1,
	'Cruela': 1,
	'Dory': 1
};

async function migrate() {
	try {
		console.log('🚀 Starting migration to user-specific toy collections...\n');
		
		// Get all users
		const usersResult = await client.execute('SELECT id, username FROM user');
		console.log(`👤 Found ${usersResult.rows.length} users\n`);
		
		// Get all toys (now only has id, name, picture)
		const toysResult = await client.execute('SELECT id, name FROM toy');
		console.log(`🎁 Found ${toysResult.rows.length} toys\n`);
		
		let migratedCount = 0;
		let skippedCount = 0;
		
		for (const user of usersResult.rows) {
			console.log(`Processing user: ${user.username}`);
			
			const shouldGetCollection = USERS_WITH_COLLECTION.includes(user.username);
			
			for (const toy of toysResult.rows) {
				// Check if entry already exists
				const existing = await client.execute({
					sql: 'SELECT * FROM user_toy WHERE user_id = ? AND toy_id = ?',
					args: [user.id, toy.id]
				});
				
				if (existing.rows.length > 0) {
					console.log(`  ⏭️  Skipping ${toy.name} (already exists)`);
					skippedCount++;
					continue;
				}
				
				// If user should get collection, use saved quantities
				// Otherwise, initialize with 0
				const quantity = shouldGetCollection ? (TOY_QUANTITIES[toy.name] || 0) : 0;
				
				await client.execute({
					sql: 'INSERT INTO user_toy (user_id, toy_id, quantity, date_obtained, notes) VALUES (?, ?, ?, ?, ?)',
					args: [user.id, toy.id, quantity, null, null]
				});
				
				migratedCount++;
			}
			
			const status = shouldGetCollection ? '✅ (with collection)' : '✅ (fresh start)';
			console.log(`  ${status} Completed ${user.username}\n`);
		}
		
		console.log('📊 Migration Summary:');
		console.log(`   - Total entries created: ${migratedCount}`);
		console.log(`   - Entries skipped (already existed): ${skippedCount}`);
		console.log(`   - Users with collection: ${USERS_WITH_COLLECTION.join(', ')}`);
		console.log(`   - Users with fresh start: nstees, Lynsey (duplicate)\n`);
		
		console.log('✨ Migration completed successfully!');
		
	} catch (error) {
		console.error('❌ Migration failed:', error.message);
		throw error;
	} finally {
		client.close();
	}
}

migrate();
