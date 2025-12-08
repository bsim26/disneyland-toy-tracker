import Database from 'better-sqlite3';
import { createHash } from 'crypto';

const db = new Database('local.db');

// Create the password hash
const password = 'password';
const passwordHash = createHash('sha256').update(password).digest('hex');

// Delete existing admin user if exists
db.prepare('DELETE FROM user WHERE username = ?').run('admin');

// Insert new admin user
const userId = crypto.randomUUID();
db.prepare(`
  INSERT INTO user (id, username, password_hash, age)
  VALUES (?, ?, ?, ?)
`).run(userId, 'admin', passwordHash, null);

console.log('✅ Admin user created successfully!');
console.log('Username: admin');
console.log('Password: password');
console.log('Password hash:', passwordHash);

db.close();
