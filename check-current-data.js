// Check current users and toys in database
import { createClient } from '@libsql/client';
import 'dotenv/config';

const config = { url: process.env.DATABASE_URL };
if (process.env.DATABASE_AUTH_TOKEN) {
	config.authToken = process.env.DATABASE_AUTH_TOKEN;
}

const client = createClient(config);

try {
	console.log('📊 Current Database State:\n');
	
	// Check users
	const users = await client.execute('SELECT id, username FROM user');
	console.log('👤 Users:');
	users.rows.forEach(user => {
		console.log(`   - ${user.username} (ID: ${user.id})`);
	});
	
	// Check toys with quantities > 0
	const toys = await client.execute('SELECT name, quantity FROM toy WHERE quantity > 0 ORDER BY quantity DESC');
	console.log(`\n🎁 Toys with quantities (${toys.rows.length} total):`);
	toys.rows.forEach(toy => {
		console.log(`   - ${toy.name}: ${toy.quantity}`);
	});
	
	// Total toy count
	const totalToys = await client.execute('SELECT COUNT(*) as count FROM toy');
	console.log(`\n📦 Total toys in database: ${totalToys.rows[0].count}`);
	
} catch (error) {
	console.error('❌ Error:', error.message);
} finally {
	client.close();
}
