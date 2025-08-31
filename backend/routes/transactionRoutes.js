import express from "express";
import multer from "multer";

import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { uploadReceipt } from "../controllers/receiptController.js";

const router = express.Router();

// Configure multer to store files in 'uploads/' with unique filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Fetch all transactions (with optional date range query)
router.get("/", getTransactions);

// Add a new transaction
router.post("/", addTransaction);

// Delete a transaction by ID
router.delete("/:id", deleteTransaction);

// Upload a receipt (image/pdf) and extract expense
router.post("/upload-receipt", upload.single("receipt"), uploadReceipt);

export default router;
