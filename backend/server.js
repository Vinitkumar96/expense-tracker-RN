import express from "express";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import router from "./routes/transactionRoutes.js";
import { initDb } from "./config/db.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

if(process.env.NODE_ENV === "production") job.start()

app.use(rateLimiter)
app.use(express.json());

app.get("/api/health",(req,res) => {
  res.status(200).json({status:"ok"})
})

app.use("/api/transactions",router)

app.get("/health", (req, res) => {
  res.send("working");
});

initDb().then(() => {
  app.listen(port, () => {
    console.log(`server is up and running on port:${port}`);
  });
});
