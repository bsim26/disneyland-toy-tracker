// Verify user-specific toy data after migration
import { createClient } from '@libsql/client';
import 'dotenv/config';

const config = { url: process.env.DATABASE_URL };
if (process.env.DATABASE_AUTH_TOKEN) {
	config.authToken = process.env.DATABASE_AUTH_TOKEN;
}

const client = createClient(config);

try {
	console.log('🔍 Verifying User-Specific Toy Collections:\n');
	
	// Get all users
	const users = await client.execute('SELECT id, username FROM user');
	
	for (const user of users.rows) {
		// Count toys for this user
		const toyCount = await client.execute({
			sql: 'SELECT COUNT(*) as count FROM user_toy WHERE user_id = ?',
			args: [user.id]
		});
		
		// Count toys with qty > 0
		const nonZeroToys = await client.execute({
			sql: 'SELECT COUNT(*) as count FROM user_toy WHERE user_id = ? AND quantity > 0',
			args: [user.id]
		});
		
		// Get top 5 toys by quantity
		const topToys = await client.execute({
			sql: `
				SELECT t.name, ut.quantity 
				FROM user_toy ut
				JOIN toy t ON ut.toy_id = t.id
				WHERE ut.user_id = ?
				ORDER BY ut.quantity DESC
				LIMIT 5
			`,
			args: [user.id]
		});
		
		console.log(`👤 ${user.username}:`);
		console.log(`   Total toys: ${toyCount.rows[0].count}`);
		console.log(`   Toys with qty > 0: ${nonZeroToys.rows[0].count}`);
		console.log(`   Top toys:`);
		topToys.rows.forEach(toy => {
			console.log(`      - ${toy.name}: ${toy.quantity}`);
		});
		console.log('');
	}
	
	console.log('✅ Verification complete!');
	
} catch (error) {
	console.error('❌ Error:', error.message);
} finally {
	client.close();
}
