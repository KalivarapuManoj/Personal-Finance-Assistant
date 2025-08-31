import React from "react";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm"; 
import UploadReceipt from "../components/UploadReceipt";

/**
 * Home page layout:
 * Left: TransactionList
 * Right: TransactionForm
 *
 * startDate and endDate are received from App props (global filter).
 */
export default function Home({ startDate, endDate }) {
  return (
    <div className="home-grid">
      <section className="left-panel">
        <h2>Transactions</h2>
        <p className="muted">
          Showing transactions from :
          <strong> {startDate || "Beginning"} </strong> to <strong>{endDate || "End"}</strong>
        </p>

        {/* TransactionList Component */}
        <TransactionList startDate={startDate} endDate={endDate} />
      </section>

      <aside className="right-panel">
        <h3>Add Transaction</h3>
        <div className="transaction-form-container">
          {/* TransactionForm Component */}
          <TransactionForm />
          <UploadReceipt /> {/* <-- Added component */}
        </div>
      </aside>
    </div>
  );
}
