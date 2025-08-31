import React, { useContext, useEffect, useState } from "react";
import { TransactionContext } from "../context/TransactionContext";
import { FaTrash } from "react-icons/fa";

const TransactionList = ({ startDate, endDate }) => {
    const { transactions, dispatch } = useContext(TransactionContext);
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    const capitalizeWords = (val) => {
        return val
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    };

    const formatDate = (dateString) => {
        const options = { day: "2-digit", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-GB", options);
    };

    useEffect(() => {
        let filtered = transactions;
        if (startDate) filtered = filtered.filter((tx) => new Date(tx.date) >= new Date(startDate));
        if (endDate) filtered = filtered.filter((tx) => new Date(tx.date) <= new Date(endDate));
        setFilteredTransactions(filtered);
    }, [transactions, startDate, endDate]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete transaction");

            // Remove from context
            dispatch({ type: "DELETE_TRANSACTION", payload: id });
        } catch (err) {
            console.error("Error deleting transaction:", err);
            alert("Failed to delete transaction");
        }
    };

    if (filteredTransactions.length === 0) return <p>No transactions found.</p>;

    return (
        <table className="transaction-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Action</th> {/* New column for delete */}
                </tr>
            </thead>
            <tbody>
                {filteredTransactions.map((tx) => (
                    <tr key={tx._id}>
                        <td>{formatDate(tx.date)}</td>
                        <td>{capitalizeWords(tx.type)}</td>
                        <td>{capitalizeWords(tx.category)}</td>
                        <td>₹{tx.amount}</td>
                        <td>
                            <button
                                onClick={() => handleDelete(tx._id)}
                                className="delete-btn"
                                title="Delete Transaction"
                            >
                                <FaTrash />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TransactionList;
