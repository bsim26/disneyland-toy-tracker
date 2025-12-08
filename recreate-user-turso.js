// Script to recreate admin user in Turso database
import { createClient } from '@libsql/client';
import crypto from 'crypto';
import 'dotenv/config';

// Database connection
const config = { url: process.env.DATABASE_URL };
if (process.env.DATABASE_AUTH_TOKEN) {
	config.authToken = process.env.DATABASE_AUTH_TOKEN;
}

const client = createClient(config);

const userId = crypto.randomUUID();
const username = 'admin';
const password = 'password';
const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

try {
	// Delete existing admin user
	await client.execute({
		sql: 'DELETE FROM user WHERE username = ?',
		args: [username]
	});
	console.log('🗑️  Deleted existing admin user');

	// Create new admin user
	await client.execute({
		sql: 'INSERT INTO user (id, username, password_hash, age) VALUES (?, ?, ?, ?)',
		args: [userId, username, passwordHash, 25]
	});
	console.log('✅ Admin user created successfully in Turso!');
	console.log(`   Username: ${username}`);
	console.log(`   Password: ${password}`);
	console.log(`   Password Hash: ${passwordHash}`);
	console.log(`   ID: ${userId}`);
} catch (error) {
	console.error('❌ Error:', error.message);
} finally {
	process.exit(0);
}
