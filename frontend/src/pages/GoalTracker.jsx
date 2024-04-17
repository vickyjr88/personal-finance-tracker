import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import parseISOString from "../utils/date";
import ProgressBar from "../components/ProgressBar";

function GoalTracker() {
  const [goals, setGoals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get("/api/goals", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setGoals(response.data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);

  const viewGoal = (id) => {
    navigate(`/goals/${id}`);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Financial Goals</h2>
      <div className="flex mb-4">
        <Link
          to="/new-goal"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          Add Goal
        </Link>
      </div>
      <ul className="space-y-4">
        {goals.map((goal, index) => (
          <li key={index} className="border border-gray-300 rounded-md p-4">
            <div>
              <span className="font-semibold">Goal: </span>
              {goal.goalName}
            </div>
            <div>
              <span className="font-semibold">Target: </span>
              {goal.targetAmount}
            </div>
            <div>
              <span className="font-semibold">Amount: </span>
              {goal.currentAmount}
            </div>
            <div>
              <ProgressBar
                amount={goal.currentAmount}
                total={goal.targetAmount}
                key={index}
              />
            </div>
            <div className="pt-2">
              {parseISOString(goal.deadline)}
              <button
                onClick={() => viewGoal(goal.id)}
                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-green-600 focus:outline-none inline-block float-right"
              >
                View
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GoalTracker;
