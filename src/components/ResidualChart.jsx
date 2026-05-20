import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { computeMNK } from "../utils/mnk";
import { makeBaseOptions } from "../utils/chartConfig";
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
        label: "rᵢ = yᵢ - P(xᵢ)",
        data: residuals,
        backgroundColor: backgroundColors,
        borderRadius: 3,
        borderSkipped: false,
      },
    ],
  };

  const options = makeBaseOptions({ yLabel: "r" });

  options.animation = { duration: 600 };

  options.plugins.tooltip.callbacks = {
    title: (items) => items[0].label,
    label: (ctx) => ` ri = ${ctx.parsed.y.toFixed(5)}`,
  };

  options.plugins.legend.labels.pointStyle = "rect";
  options.plugins.legend.labels.generateLabels = (chart) => {
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
  };

  options.scales.x.type = "category";
  options.scales.x.grid.display = false;
  options.scales.x.title.display = false;

  options.scales.y.border = { color: "#cccccc", dash: [4, 4] };


  return (
    <div className={styles.chartBox}>
      <p className={styles.chartLabel}>Залишки МНК</p>
      <div className={styles.chartCanvas}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
