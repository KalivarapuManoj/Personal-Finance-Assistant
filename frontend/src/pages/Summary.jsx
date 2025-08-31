import React, { useContext, useMemo } from "react";
import { TransactionContext } from "../context/TransactionContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Summary({ startDate, endDate }) {
  const { transactions } = useContext(TransactionContext);

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) return txDate >= start && txDate <= end;
      if (start) return txDate >= start;
      if (end) return txDate <= end;
      return true;
    });
  }, [transactions, startDate, endDate]);

  // Group by category
  const incomeData = useMemo(() => {
    const data = {};
    filteredTransactions.forEach((tx) => {
      if (tx.type === "income") {
        data[tx.category] = (data[tx.category] || 0) + tx.amount;
      }
    });
    return Object.entries(data).map(([category, amount]) => ({ category, amount }));
  }, [filteredTransactions]);

  const expenseData = useMemo(() => {
    const data = {};
    filteredTransactions.forEach((tx) => {
      if (tx.type === "expense") {
        data[tx.category] = (data[tx.category] || 0) + tx.amount;
      }
    });
    return Object.entries(data).map(([category, amount]) => ({ category, amount }));
  }, [filteredTransactions]);

  return (
    <div className="summary-page">
      <h2>Summary</h2>
      <p className="muted">
        Range: {startDate || "Beginning"} → {endDate || "End"}
      </p>

      <div className="summary-charts">
        <div className="chart-container">
          <h3>Income by Category</h3>
          {incomeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#4caf50" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No income data available</p>
          )}
        </div>

        <div className="chart-container">
          <h3>Expense by Category</h3>
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No expense data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
