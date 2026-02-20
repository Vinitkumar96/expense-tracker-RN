import express from "express"
import { createTransaction,getTransactions,deleteTransaction,transactionSummary } from "../controller/transactionController.js";

const router = express.Router()

router.post("/", createTransaction);

router.get("/:userId", getTransactions);

router.delete("/:id", deleteTransaction);

// balance = [{ balance: 400 }]

router.get("/summary/:userId",transactionSummary );


export default router