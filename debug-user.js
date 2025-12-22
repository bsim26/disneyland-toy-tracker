// Debug: Check which user you're logging in as
import { createClient } from '@libsql/client';
import 'dotenv/config';

const config = { url: process.env.DATABASE_URL };
if (process.env.DATABASE_AUTH_TOKEN) {
	config.authToken = process.env.DATABASE_AUTH_TOKEN;
}

const client = createClient(config);

const username = process.argv[2] || 'bsim26';

try {
	console.log(`\n🔍 Checking user: ${username}\n`);
	
	// Get user info
	const userResult = await client.execute({
		sql: 'SELECT id, username FROM user WHERE username = ?',
		args: [username]
	});
	
	if (userResult.rows.length === 0) {
		console.log('❌ User not found!');
		process.exit(1);
	}
	
	const user = userResult.rows[0];
	console.log(`👤 User ID: ${user.id}`);
	console.log(`   Username: ${user.username}\n`);
	
	// Check their toys
	const toysResult = await client.execute({
		sql: 'SELECT COUNT(*) as count FROM user_toy WHERE user_id = ?',
		args: [user.id]
	});
	
	const nonZeroResult = await client.execute({
		sql: 'SELECT COUNT(*) as count FROM user_toy WHERE user_id = ? AND quantity > 0',
		args: [user.id]
	});
	
	console.log(`📦 Total toys: ${toysResult.rows[0].count}`);
	console.log(`🎁 Toys with qty > 0: ${nonZeroResult.rows[0].count}\n`);
	
	// Sample toys
	const sampleResult = await client.execute({
		sql: `
			SELECT t.name, ut.quantity 
			FROM user_toy ut
			JOIN toy t ON ut.toy_id = t.id
			WHERE ut.user_id = ?
			ORDER BY ut.quantity DESC
			LIMIT 10
		`,
		args: [user.id]
	});
	
	console.log('Top 10 toys:');
	sampleResult.rows.forEach(toy => {
		console.log(`   - ${toy.name}: ${toy.quantity}`);
	});
	
} catch (error) {
	console.error('❌ Error:', error.message);
} finally {
	client.close();
}
