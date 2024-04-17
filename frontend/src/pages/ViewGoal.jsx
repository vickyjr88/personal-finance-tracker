import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import parseISOString from "../utils/date";
import ProgressBar from "../components/ProgressBar";

function ViewGoal() {
  const [goal, setGoal] = useState({});
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
  return (
    <div className="max-w-md mx-auto mt-8">
      <h2>View Goal {goal.goalName}</h2>
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
    </div>
  );
}

export default ViewGoal;
