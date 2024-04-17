// App.js

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import SignupForm from "./pages/SignupForm";
import LoginForm from "./pages/LoginForm";
import Logout from "./components/Logout";
import CreateTransaction from "./pages/CreateTransaction";
import Insights from "./pages/Insights";
import CreateGoal from "./pages/CreateGoal";
import GoalTracker from "./pages/GoalTracker";
import ViewGoal from "./pages/ViewGoal";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Update isLoggedIn based on whether token is present
  }, []);
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <header className="bg-blue-500 p-4">
          <h1 className="text-white text-2xl">Personal Finance Tracker</h1>
          <nav className="mt-4">
            <ul className="flex space-x-4">
              <li>
                <Link to="/signup">Sign up</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/">Dashboard</Link>
              </li>
              <li>
                <Logout />
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/transaction" element={<CreateTransaction />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/goal-tracker" element={<GoalTracker />} />
            <Route path="/new-goal" element={<CreateGoal />} />
            <Route path="/goals/:id" element={<ViewGoal />} />
          </Routes>
        </main>
        <footer className="bg-blue-500 p-4 text-white text-center">
          &copy; 2024 Personal Finance Tracker
        </footer>
      </div>
    </Router>
  );
}

export default App;
