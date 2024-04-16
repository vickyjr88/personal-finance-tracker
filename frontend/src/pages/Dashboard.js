import React from 'react';
import WithAuth from '../components/WithAuth';
import TransactionContainer from '../components/TransactionContainer';
import { Link } from 'react-router-dom';
import CategoryDonutGraph from '../components/CategoryDonutGraph';

function Dashboard() {
  return (
    <div>
      <div className="max-w-md mx-auto mt-8">
      <h2>Dashboard</h2>
      <Link to="/transaction" className="right inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded float-right">New transaction</Link>
      </div>
      <div className="max-w-md mx-auto mt-8">
      <CategoryDonutGraph />
      <Link to="/insights" className="hover:underline inline-block float-right">Insights</Link>
      </div>
      <TransactionContainer />
    </div>
  );
}

export default WithAuth(Dashboard);
