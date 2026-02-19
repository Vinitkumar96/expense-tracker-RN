import express from "express"
import dotenv from "dotenv"
import { sql } from "./config/db.js"
dotenv.config()

const app = express()
const port = process.env.PORT || 5001

app.use(express.json())


app.post("/api/transactions",async(req,res)=>{
    try{
        const{title,amount,category,user_id} = req.body;

        if(!title || !amount || !category || !user_id){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

       const transaction =  await sql`
        INSERT INTO transactions(user_id,title,amount,category)
        VALUES (${user_id},${title},${amount},${category})
        RETURNING *
        `
        // console.log(transaction)
        // console.log(transaction[0])
        res.status(201).json(transaction[0])

    }catch(error){
        console.log("Error creating the transaction",error)
        res.status(500).json({message:"Internal server error"})
    }
})

app.get("/",(req,res)=>{
    res.send("working")
})


async function initDb() {
    try{
       await sql`CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
       )`
       console.log('Db initialized successfully')
    }catch(error){
        console.log("Error initializing DB",error)
        process.exit(1)
    }
}


initDb().then(()=>{
    app.listen(port,()=>{
        console.log(`server is up and running on port:${port}`)
    })
})