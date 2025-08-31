import React, { createContext, useReducer, useEffect } from "react";

// Create Context
export const TransactionContext = createContext();

// Initial State
const initialState = {
  transactions: [],
};

// Reducer Function
const transactionReducer = (state, action) => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload.sort((a, b) => new Date(b.date) - new Date(a.date)) };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)) };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((tx) => tx._id !== action.payload).sort((a, b) => new Date(b.date) - new Date(a.date)),
      };
    default:
      return state;
  }
};

// Context Provider
export const TransactionProvider = ({ children, startDate, endDate }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Fetch transactions whenever startDate or endDate changes
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        let url = "http://localhost:5000/api/transactions";
        const params = [];
        if (startDate) params.push(`startDate=${startDate}`);
        if (endDate) params.push(`endDate=${endDate}`);
        if (params.length > 0) url += "?" + params.join("&");

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch transactions");

        const data = await res.json();
        const transactionsList = data.transactions || [];
        dispatch({ type: "SET_TRANSACTIONS", payload: transactionsList });
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchTransactions();
  }, [startDate, endDate]);

  return (
    <TransactionContext.Provider value={{ transactions: state.transactions, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
};
