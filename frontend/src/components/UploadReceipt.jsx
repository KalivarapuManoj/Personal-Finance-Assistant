import React, { useState, useContext } from "react";
import { TransactionContext } from "../context/TransactionContext";

export default function UploadReceipt() {
  const { dispatch } = useContext(TransactionContext);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      setUploading(true);
      const res = await fetch("http://localhost:5000/api/transactions/upload-receipt", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload receipt");

      const data = await res.json();
      const newTransactions = data.transactions || [];

      // Add uploaded transactions to context
      newTransactions.forEach((tx) => {
        dispatch({ type: "ADD_TRANSACTION", payload: tx });
      });

      alert(`Added ${newTransactions.length} transaction(s) from receipt!`);
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Error uploading receipt");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-receipt-container">
      <h4>Upload Receipt</h4>
      <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload & Add Transactions"}
      </button>
    </div>
  );
}
