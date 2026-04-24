import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("benquu.db");

export const initDatabase = () => {
	db.execSync(`
    CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
};

export const kvStore = {
	setItem: async (key: string, value: string): Promise<void> => {
		try {
			db.runSync("INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)", [
				key,
				value,
			]);
		} catch (error) {
			console.error(`Error setting key "${key}":`, error);
			throw error;
		}
	},

	getItem: async (key: string): Promise<string | null> => {
		try {
			const result = db.getFirstSync<{ value: string }>(
				"SELECT value FROM kv_store WHERE key = ?",
				[key],
			);
			console.log(`Retrieved key "${key}":`, result);
			return result?.value ?? null;
		} catch (error) {
			console.error(`Error getting key "${key}":`, error);
			return null;
		}
	},

	clear: async (): Promise<void> => {
		try {
			db.runSync("DELETE FROM kv_store");
		} catch (error) {
			console.error("Error clearing kv_store:", error);
			throw error;
		}
	},
};

export { db };
