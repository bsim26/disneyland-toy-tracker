// Check admin user in Turso database
import { createClient } from '@libsql/client';
import 'dotenv/config';

const config = { url: process.env.DATABASE_URL };
if (process.env.DATABASE_AUTH_TOKEN) {
	config.authToken = process.env.DATABASE_AUTH_TOKEN;
}

const client = createClient(config);

try {
	const result = await client.execute('SELECT * FROM user WHERE username = ?', ['admin']);
	
	if (result.rows.length > 0) {
		console.log('✅ Admin user found in database:');
		console.log('   Username:', result.rows[0].username);
		console.log('   Password Hash:', result.rows[0].password_hash);
		console.log('');
		console.log('Expected hash for "password": 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
	} else {
		console.log('❌ Admin user not found in database');
	}
} catch (error) {
	console.error('Error:', error.message);
} finally {
	process.exit(0);
}
