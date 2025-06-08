import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('rsi-tracker.db');

const init = async () => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY NOT NULL,
      symbol TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      data TEXT NOT NULL
    );
  `);
};

export default {
  db,
  init,
};