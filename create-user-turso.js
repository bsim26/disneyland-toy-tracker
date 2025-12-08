// Script to create admin user in Turso database
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
	await client.execute({
		sql: 'INSERT INTO user (id, username, password_hash, age) VALUES (?, ?, ?, ?)',
		args: [userId, username, passwordHash, 25]
	});
	console.log('✅ Admin user created successfully in Turso!');
	console.log(`   Username: ${username}`);
	console.log(`   Password: ${password}`);
	console.log(`   ID: ${userId}`);
} catch (error) {
	console.error('❌ Error creating user:', error.message);
	if (error.message.includes('UNIQUE')) {
		console.log('ℹ️  Admin user already exists');
	}
} finally {
	process.exit(0);
}
