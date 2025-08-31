import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["income", "expense"], // Only these two values allowed
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
