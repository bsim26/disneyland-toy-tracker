import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const toy = sqliteTable('toy', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	quantity: integer('quantity').notNull().default(0),
	dateObtained: text('date_obtained'),
	picture: text('picture').notNull().default('nya.jpg'),
	notes: text('notes')
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Toy = typeof toy.$inferSelect;
