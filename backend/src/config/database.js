const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dataDirectory = path.join(process.cwd(), "data");

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const databasePath = path.join(dataDirectory, "civic.db");

const db = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }

  console.log("SQLite database connected");
});

db.run("PRAGMA foreign_keys = ON");

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (error) {
      if (error) {
        reject(error);
        return;
      }

      resolve({
        id: this.lastID,
        changes: this.changes
      });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS rti_cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      session_id TEXT NOT NULL UNIQUE,

      issue TEXT,
      village TEXT,
      city TEXT,
      district TEXT,
      state TEXT,
      department TEXT,
      information_requested TEXT,
      project_details TEXT,

      applicant_name TEXT,
      applicant_address TEXT,

      ready_to_draft INTEGER DEFAULT 0,

      status TEXT DEFAULT 'active',

      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS rti_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      case_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (case_id)
        REFERENCES rti_cases(id)
        ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS rti_drafts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      case_id INTEGER NOT NULL,
      draft TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (case_id)
        REFERENCES rti_cases(id)
        ON DELETE CASCADE
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS saved_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      document_type TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    )
  `);

  console.log("Database tables initialized");
}

module.exports = {
  db,
  run,
  get,
  all,
  initializeDatabase
};