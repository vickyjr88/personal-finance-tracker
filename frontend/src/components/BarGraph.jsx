import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

function BarGraph() {
  const chartRef = useRef(null);
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    // Fetch summary data from the server
    const fetchTypeSummary = async () => {
      try {
        const response = await axios.get("/api/summary-by-type", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSummaryData(response.data);
      } catch (error) {
        console.error("Error fetching type summary:", error);
      }
    };

    fetchTypeSummary();
  }, []);

  useEffect(() => {
    if (chartRef.current && summaryData) {
      const ctx = chartRef.current.getContext("2d");

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(summaryData),
          datasets: [
            {
              label: "Amount",
              data: Object.values(summaryData).map((el) => el.totalAmount),
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "Count",
              data: Object.values(summaryData).map((el) => el.count),
              backgroundColor: "rgba(255, 99, 132, 1)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [summaryData]);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default BarGraph;
