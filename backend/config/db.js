import {neon} from "@neondatabase/serverless"
import "dotenv/config"

export const sql = neon(process.env.DATABASE_URL)  //creates a sql connection using our db url


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