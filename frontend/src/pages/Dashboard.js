import React, { useEffect, useState } from 'react';
import WithAuth from '../components/WithAuth';
import TransactionContainer from '../components/TransactionContainer';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BarGraph from '../components/BarGraph';

function Dashboard() {
  const [categorySammary, setCategorySummary] = useState({});
  const [typeSammary, setTypeSummary] = useState({});

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/api/summary-by-category", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCategorySummary(response.data);
      } catch (error) {
        console.error("Error fetching category summary:", error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchTypeSummary = async () => {
      try {
        const response = await axios.get("/api/summary-by-type", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTypeSummary(response.data);
      } catch (error) {
        console.error("Error fetching type summary:", error);
      }
    };

    fetchTypeSummary();
  }, []);

  return (
    <div>
      <div className="max-w-md mx-auto mt-8">
      <h2>Dashboard</h2>
      <Link to="/transaction" className="hover:underline right">New transaction</Link>
      </div>
      <div className="max-w-md mx-auto mt-8">
      <BarGraph />
      </div>
      <TransactionContainer />
    </div>
  );
}

export default WithAuth(Dashboard);
