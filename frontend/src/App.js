// frontend/src/App.js

import React, { useState } from 'react';
import './App.css';

function App() {
  const [goals, setGoals] = useState([]);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/goals');
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Personal Finance Tracker</h1>
        <button onClick={fetchGoals}>Fetch Goals</button>
        <ul>
          {goals.map(goal => (
            <li key={goal.id}>{goal.goalName}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
