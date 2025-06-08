import * as SQLite from 'expo-sqlite';

/**
 * Interface for cached asset data in the database
 */
export interface CachedAsset {
  id?: number;
  symbol: string;
  timestamp: number;
  data: string;
}

/**
 * Database service for managing local SQLite storage
 */
class DatabaseService {
  db: SQLite.SQLiteDatabase;
  initialized: boolean = false;

  constructor() {
    this.db = SQLite.openDatabaseSync('rsi-tracker.db');
  }

  /**
   * Initialize the database by creating necessary tables
   * @returns Promise that resolves when initialization is complete
   */
  async init(): Promise<void> {
    try {
      if (this.initialized) {
        return;
      }

      await this.db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS assets (
          id INTEGER PRIMARY KEY NOT NULL,
          symbol TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          data TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_assets_symbol ON assets(symbol);
      `);

      this.initialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw new Error(`Database initialization failed: ${error}`);
    }
  }

  /**
   * Get an asset from the database by symbol
   * @param symbol The asset symbol to retrieve
   * @returns The cached asset or null if not found
   */
  async getAsset(symbol: string): Promise<CachedAsset | null> {
    try {
      await this.ensureInitialized();
      
      const result = await this.db.getFirstAsync<CachedAsset>(
        'SELECT id, symbol, timestamp, data FROM assets WHERE symbol = ?',
        symbol
      );
      
      return result || null;
    } catch (error) {
      console.error(`Error getting asset ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Save or update an asset in the database
   * @param asset The asset to save
   * @returns Promise that resolves when the operation is complete
   */
  async saveAsset(asset: CachedAsset): Promise<void> {
    try {
      await this.ensureInitialized();
      
      await this.db.runAsync(
        'INSERT OR REPLACE INTO assets (symbol, timestamp, data) VALUES (?, ?, ?)',
        asset.symbol,
        asset.timestamp,
        asset.data
      );
    } catch (error) {
      console.error(`Error saving asset ${asset.symbol}:`, error);
      throw new Error(`Error saving asset: ${error}`);
    }
  }

  /**
   * Delete an asset from the database
   * @param symbol The asset symbol to delete
   * @returns Promise that resolves when the operation is complete
   */
  async deleteAsset(symbol: string): Promise<void> {
    try {
      await this.ensureInitialized();
      
      await this.db.runAsync(
        'DELETE FROM assets WHERE symbol = ?',
        symbol
      );
    } catch (error) {
      console.error(`Error deleting asset ${symbol}:`, error);
      throw new Error(`Error deleting asset: ${error}`);
    }
  }

  /**
   * Clear all assets from the database
   * @returns Promise that resolves when the operation is complete
   */
  async clearAssets(): Promise<void> {
    try {
      await this.ensureInitialized();
      
      await this.db.runAsync('DELETE FROM assets');
    } catch (error) {
      console.error('Error clearing assets:', error);
      throw new Error(`Error clearing assets: ${error}`);
    }
  }

  /**
   * Ensure the database is initialized before performing operations
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
  }
}

// Create and export a singleton instance
const db = new DatabaseService();
export default db;