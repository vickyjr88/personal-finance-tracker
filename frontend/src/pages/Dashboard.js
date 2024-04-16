import React from 'react';
import WithAuth from '../components/WithAuth';

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      {/* Add dashboard content here */}
    </div>
  );
}

export default WithAuth(Dashboard);
