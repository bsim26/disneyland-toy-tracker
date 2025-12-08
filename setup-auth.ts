import { db } from './src/lib/server/db/index.ts';
import * as table from './src/lib/server/db/schema.ts';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

const passwordHash = encodeHexLowerCase(
	sha256(new TextEncoder().encode('password'))
);

await db.insert(table.user).values({
	id: crypto.randomUUID(),
	username: 'admin',
	passwordHash,
	age: null
});

console.log('✅ Default user created: admin / password');
console.log('You can now login to the app!');
