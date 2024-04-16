import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";

function CategoryDonutGraph({ url }) {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    // Fetch summary data from the server
    const fetchTypeSummary = async () => {
      try {
        const response = await axios.get("/api/summary-by-category", {
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
      if (chartInstance) {
        chartInstance.destroy(); // Destroy existing chart if it exists
      }

      const ctx = chartRef.current.getContext("2d");

      const labels = Object.keys(summaryData);
      const values = Object.values(summaryData).map((el) => el.totalAmount);

      const colors = generateColors(labels.length);

      const config = {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors.backgroundColors,
              borderColor: colors.borderColors,
              borderWidth: 1,
            },
          ],
        },
      };

      const newChartInstance = new Chart(ctx, config);
      setChartInstance(newChartInstance);
    }
  }, [summaryData]);

  const generateColors = (count) => {
    const backgroundColors = [];
    const borderColors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      backgroundColors.push(`rgba(${r}, ${g}, ${b}, 0.5)`);
      borderColors.push(`rgba(${r}, ${g}, ${b}, 1)`);
    }
    return { backgroundColors, borderColors };
  };

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}

export default CategoryDonutGraph;
