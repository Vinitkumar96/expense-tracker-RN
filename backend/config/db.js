import {neon} from "@neondatabase/serverless"
import "dotenv/config"

export const sql = neon(process.env.DATABASE_URL)  //creates a sql connection using our db url

export const initDb = async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
       )`;
    console.log("Db initialized successfully");
  } catch (error) {
    console.log("Error initializing DB", error);
    process.exit(1);
  }
}


// ❌ Not opening a DB connection

// ❌ Not keeping anything running

// ❌ Not creating multiple connections

/* 
Only then:

A request is sent to Neon

Query runs

Response comes back

Everything closes automatically

About nodemon

Nodemon restarts your app → old process dies

New process starts → neon() runs again

Since nothing is kept open → no issue

👉 You are 100% safe.

One-line memory trick 🧠

neon() = fetch() for Postgres

*/