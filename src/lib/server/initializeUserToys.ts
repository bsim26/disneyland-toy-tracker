// Helper function to initialize new users with all toys at qty 0
import { db } from '$lib/server/db';
import { toy, userToy } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

/**
 * Initialize a new user's toy collection with all toys set to quantity 0
 * @param userId - The ID of the user to initialize
 */
export async function initializeUserToys(userId: string): Promise<void> {
	try {
		// Get all toys from the master list
		const allToys = await db.select({ id: toy.id }).from(toy);
		
		// Check which toys the user already has
		const existingUserToys = await db
			.select({ toyId: userToy.toyId })
			.from(userToy)
			.where(eq(userToy.userId, userId));
		
		const existingToyIds = new Set(existingUserToys.map(ut => ut.toyId));
		
		// Filter out toys the user already has
		const toysToAdd = allToys.filter(t => !existingToyIds.has(t.id));
		
		if (toysToAdd.length === 0) {
			console.log(`User ${userId} already has all toys initialized`);
			return;
		}
		
		// Insert userToy entries with quantity 0 for all missing toys
		const userToyEntries = toysToAdd.map(t => ({
			userId,
			toyId: t.id,
			quantity: 0,
			dateObtained: null,
			notes: null
		}));
		
		await db.insert(userToy).values(userToyEntries);
		
		console.log(`Initialized ${userToyEntries.length} toys for user ${userId}`);
	} catch (error) {
		console.error('Error initializing user toys:', error);
		throw error;
	}
}
