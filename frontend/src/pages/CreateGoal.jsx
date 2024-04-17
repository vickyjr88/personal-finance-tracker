import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateGoal() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const navigate = useNavigate();

  const addGoal = async (e) => {
    e.preventDefault();
    if (newGoal.trim() !== "") {
      try {
        const response = await axios.post(
          "/api/goals",
          {
            goalName: newGoal,
            targetAmount: targetAmount,
            currentAmount: currentAmount,
            deadline: deadline,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Transaction submitted successfully:", response.data);
        // Clear form fields after submission
        setNewGoal("");
        setTargetAmount("");
        setCurrentAmount("");
        setDeadline("");
        navigate("/goal-tracker");
      } catch (error) {
        console.error("Error submitting transaction:", error);
      }
    }
  };

  const removeGoal = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">New Goal</h2>
      <div className="mb-4">
        <div>
          <label htmlFor="goal-name" className="block text-gray-700">
            Goal Name
          </label>
          <input
            id="goal-name"
            type="text"
            placeholder="Enter a new goal"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="w-full mb-2 px-4 py-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="target-amount" className="block text-gray-700">
            Target Amount
          </label>
          <input
            id="target-amount"
            type="number"
            placeholder="Enter target amount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full mb-2 px-4 py-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="current-amount" className="block text-gray-700">
            Current Amount
          </label>
          <input
            id="current-amount"
            type="number"
            placeholder="Enter current amount"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            className="w-full mb-2 px-4 py-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="deadline" className="block text-gray-700">
            Deadline
          </label>
          <input
            id="deadline"
            type="date"
            placeholder="Enter deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full mb-2 px-4 py-2 border border-gray-300 rounded focus:outline-none"
          />
        </div>
        <button
          onClick={addGoal}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          Add Goal
        </button>
      </div>
      <ul className="list-disc pl-6">
        {goals.map((goal, index) => (
          <li key={index} className="mb-2 flex items-center">
            <span className="flex-grow">{goal}</span>
            <button
              onClick={() => removeGoal(index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateGoal;
