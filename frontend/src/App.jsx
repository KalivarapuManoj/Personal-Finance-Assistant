import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import DateFilter from "./components/DateFilter";
import Home from "./pages/Home";
import Summary from "./pages/Summary";
import { TransactionProvider } from "./context/TransactionContext";

function App() {
  // Get today
  const today = new Date();

  // First day of current month in YYYY-MM-DD (local time)
  const defaultStartDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;


  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(""); // No default, optional
  // Apply filter
  const handleApplyFilter = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Clear filter
  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <TransactionProvider startDate={startDate} endDate={endDate}>
      <div>
        <Navbar />
        <div className="main-content">
          {/* DateFilter is common for all pages */}
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onApply={handleApplyFilter}
            onClear={handleClearFilter}
          />
          <Routes>
            <Route path="/" element={<Home startDate={startDate} endDate={endDate} />} />
            <Route
              path="/summary"
              element={<Summary startDate={startDate} endDate={endDate} />}
            />
          </Routes>
        </div>
      </div>
    </TransactionProvider>
  );
}

export default App;
