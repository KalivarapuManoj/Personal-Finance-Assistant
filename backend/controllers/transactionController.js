import Transaction from "../model/Transaction.js";

// Get Transactions (All / Range)
export const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = {};

    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.date = { $lte: new Date(endDate) };
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add Transaction
export const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, date } = req.body;

    if (!type || !amount || !category || !date) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const newTransaction = new Transaction({ type, amount, category, date });
    await newTransaction.save();

    res.status(201).json({
      message: "Transaction added successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
