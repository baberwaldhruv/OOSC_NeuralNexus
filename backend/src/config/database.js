const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

// Convert SQLite positional params (?) to PostgreSQL ($1, $2, ...)
function formatSql(sql) {
  let paramIndex = 1;
  return sql.replace(/\?/g, () => `$${paramIndex++}`);
}

async function run(sql, params = []) {
  let formattedSql = formatSql(sql);
  
  // If it's an INSERT, automatically append RETURNING id to match SQLite's this.lastID
  if (/^\s*insert\s+/i.test(formattedSql) && !/returning/i.test(formattedSql)) {
    formattedSql += " RETURNING id";
  }

  const result = await pool.query(formattedSql, params);
  return {
    id: result.rows[0]?.id || null,
    changes: result.rowCount
  };
}

async function get(sql, params = []) {
  const result = await pool.query(formatSql(sql), params);
  return result.rows[0] || null;
}

async function all(sql, params = []) {
  const result = await pool.query(formatSql(sql), params);
  return result.rows;
}

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log("PostgreSQL database connected via Supabase");
  } finally {
    client.release();
  }
}

module.exports = {
  db: pool,
  run,
  get,
  all,
  initializeDatabase
};