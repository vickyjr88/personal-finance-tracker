import React, { useEffect } from 'react';
import WithAuth from '../components/WithAuth';
import TransactionContainer from '../components/TransactionContainer';
import { Link } from 'react-router-dom';
import CategoryDonutGraph from '../components/CategoryDonutGraph';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = React.useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/users/1", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <Link to="/transaction" className="right inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded float-right">New transaction</Link>
      <div className="text-center w-full">
      <h3 className="text-1l font-semibold mb-4">Welcome back, {user.name}</h3>
      <h4 className="text-3xl font-semibold mb-4">Balance: KES {user.balance}</h4>
      </div>
      </div>
      <div className="max-w-md mx-auto mt-8">
      <CategoryDonutGraph />
      <Link to="/insights" className="hover:underline inline-block float-right p-5">Insights</Link>
      <Link to="/goal-tracker" className="hover:underline inline-block float-right p-5">Goal tracker</Link>
      </div>
      <TransactionContainer />
    </div>
  );
}

export default WithAuth(Dashboard);
