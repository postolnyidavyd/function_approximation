import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { computeMNK } from "../utils/mnk";
import "../utils/chartConfig"; // реєстрація Chart.js компонентів
import styles from "./Chart.module.css";

export default function ResidualsChart({ points, degree }) {
  const { residuals } = useMemo(
    () => computeMNK(points, degree),
    [points, degree],
  );


  const backgroundColors = residuals.map((r) =>
    r >= 0 ? "#111111" : "#888888",
  );

  const labels = points.map((p) => `x=${p.x}`);

  const data = {
    labels,
    datasets: [
      {
        label: "r",
        data: residuals,
        backgroundColor: backgroundColors,
        borderRadius: 3,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    animation: { duration: 600 },
    plugins: {
      legend: {
        labels: {
          font: { family: "Fraunces", size: 11 },
          color: "#111111",
          padding: 16,
          usePointStyle: true,
          pointStyle: "rect",
          pointStyleWidth: 14,
          generateLabels: (chart) => {
            const original = chart.data.datasets[0].label;
            return [
              {
                text: original,
                fillStyle: "#111111",
                strokeStyle: "#111111",
                lineWidth: 0,
                pointStyle: "rect",
                hidden: false,
                datasetIndex: 0,
              },
            ];
          },
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        borderColor: "#cccccc",
        borderWidth: 1,
        titleColor: "#111111",
        bodyColor: "#6b6b6b",
        titleFont: { family: "Fraunces", size: 11, weight: "500" },
        bodyFont: { family: "JetBrains Mono", size: 11 },
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (items) => items[0].label,
          label: (ctx) => ` ri = ${ctx.parsed.y.toFixed(5)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "JetBrains Mono", size: 10 },
          color: "#6b6b6b",
        },
        border: { color: "#cccccc" },
      },
      y: {
        title: {
          display: true,
          text: "r",
          font: { family: "Fraunces", size: 11 },
          color: "#6b6b6b",
        },
        grid: {
          color: "#e5e5e5",

          lineWidth: 0.5,
        },
        ticks: {
          font: { family: "JetBrains Mono", size: 10 },
          color: "#6b6b6b",
        },
        border: { color: "#cccccc", dash: [4, 4] },
      },
    },
  };

  return (
    <div className={styles.chartBox}>
      <p className={styles.chartLabel}>Залишки МНК</p>
      <div className={styles.chartCanvas}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
