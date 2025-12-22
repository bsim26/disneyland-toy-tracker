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
	picture: text('picture').notNull().default('nya.jpg')
});

export const userToy = sqliteTable('user_toy', {
	userId: text('user_id').notNull().references(() => user.id),
	toyId: text('toy_id').notNull().references(() => toy.id),
	quantity: integer('quantity').notNull().default(0),
	dateObtained: text('date_obtained'),
	notes: text('notes'),
	boxNumber: text('box_number')
}, (table) => ({
	pk: { columns: [table.userId, table.toyId] }
}));

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Toy = typeof toy.$inferSelect;

export type UserToy = typeof userToy.$inferSelect;
