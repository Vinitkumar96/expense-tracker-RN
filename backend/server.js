import express from "express"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const port = process.env.PORT || 5001

app.get("/",(req,res)=>{
    res.send("working")
})


app.listen(port,()=>{
    console.log(`server is up and running on port:${port}`)
})