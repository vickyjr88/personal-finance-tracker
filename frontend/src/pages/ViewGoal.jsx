import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import parseISOString from "../utils/date";
import ProgressBar from "../components/ProgressBar";

function ViewGoal() {
  const [goal, setGoal] = useState({});
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get(`/api/goals/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setGoal(response.data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);

  const removeGoal = async (id) => {
    try {
      await axios.delete(`/api/goals/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/goal-tracker");
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const topUpGoal = async (e) => {
    e.preventDefault();
    if (
      amount.trim() !== "" &&
      !isNaN(amount) &&
      amount > 0 &&
      Number(amount) <= Number(goal.targetAmount) - Number(goal.currentAmount)
    ) {
      try {
        const response = await axios.put(
          "/api/goals",
          {
            goalName: goal.goalName,
            amount: Number(amount) + goal.currentAmount,
            id: goal.id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Transaction submitted successfully:", response.data);
        setAmount("");
        const fetchGoals = async () => {
          try {
            const response = await axios.get(`/api/goals/${id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            setGoal(response.data);
          } catch (error) {
            console.error("Error fetching goals:", error);
          }
        };

        fetchGoals();
      } catch (error) {
        console.error("Error submitting transaction:", error);
      }
    }
  };
  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">View Goal {goal.goalName}</h2>
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
          key={goal.id}
        />
      </div>
      <div className="pt-2">
        {parseISOString(goal.deadline)}
        <button
          onClick={() => removeGoal(goal.id)}
          className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none inline-block float-right"
        >
          Remove
        </button>
      </div>
      <div className="mt-3">
        <h3>Top up goal</h3>
      </div>
      <div>
        <label htmlFor="current-amount" className="block text-gray-700">
          Current Amount
        </label>
        <input
          id="current-amount"
          type="number"
          placeholder="Enter current amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-2 px-4 py-2 border border-gray-300 rounded focus:outline-none"
        />
      </div>
      <button
        onClick={topUpGoal}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
      >
        Top up
      </button>
    </div>
  );
}

export default ViewGoal;
