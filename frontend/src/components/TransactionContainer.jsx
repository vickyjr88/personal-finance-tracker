import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionList from "./TransactionList";

function TransactionContainer() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/api/transactions", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []); // Empty dependency array to fetch transactions only once when the component mounts

  return <TransactionList transactions={transactions.reverse()} />;
}

export default TransactionContainer;
