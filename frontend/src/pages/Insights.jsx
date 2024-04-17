import React from "react";
import BarGraph from "../components/BarGraph";
import CategoryDonutGraph from "../components/CategoryDonutGraph";

function Insights() {
  return (
    <div>
      <div className="max-w-md mx-auto mt-8">
        <h2 className="text-2xl font-semibold mb-4">Insights</h2>
        <BarGraph />
        <CategoryDonutGraph />
      </div>
    </div>
  );
}

export default Insights;
