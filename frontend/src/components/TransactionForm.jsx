import React, { useState, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";

export default function TransactionForm() {
  const { dispatch } = useContext(TransactionContext);

  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !category || !date) {
      alert("Please fill all required fields!");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Amount must be greater than zero!");
      return;
    }

    const transaction = { type, amount: Number(amount), category, date };

    try {
      setSubmitting(true);

      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });

      if (!res.ok) throw new Error("Failed to add transaction");

      const data = await res.json();
      // Backend should return the created transaction as data.transaction
      const newTransaction = data.transaction || data;

      // Add transaction to context
      dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });

      // Reset form
      setType("income");
      setAmount("");
      setCategory("");
      setDate("");
    } catch (err) {
      console.error("Error adding transaction:", err);
      alert("Error adding transaction");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <label>
        Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </label>

      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </label>

      <label>
        Category:
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </label>

      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add Transaction"}
      </button>
    </form>
  );
}
