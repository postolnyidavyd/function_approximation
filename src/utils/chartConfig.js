import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  LineController,
  Tooltip,
  Legend,
} from "chart.js";

// Реєструємо всі потрібних компонентів
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  LineController,
  Tooltip,
  Legend,
);

const axisStyle = {
  grid: { color: "#e5e5e5", lineWidth: 0.5 },
  ticks: { font: { family: "JetBrains Mono", size: 10 }, color: "#6b6b6b" },
  border: { color: "#cccccc" },
};

// базові опції всіх графіків в основному стилі
export function makeBaseOptions({ xLabel = "x", yLabel = "y" } = {}) {
  return {
    responsive: true,
    maintainAspectRatio: true,
    animation: false, //анімація власна а не вбудована
    plugins: {
      legend: {
        labels: {
          font: { family: "Fraunces", size: 11 },
          color: "#111111",
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 14,
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
        //кастомний тайтл
        callbacks: {
          title: (items) => `x = ${Number(items[0].parsed.x).toFixed(3)}`,
          label: (ctx) => ` y = ${ctx.parsed.y.toFixed(4)}`,
        },
      },
    },
    scales: {
      x: {
        type: "linear", //щоб блять тупий ChartJS розумів що в мене блять цифри заєбав
        title: {
          display: true,
          text: xLabel,
          font: { family: "Fraunces", size: 12 },
          color: "#6b6b6b",
        },
        ...axisStyle,
      },
      y: {
        title: {
          display: true,
          text: yLabel,
          font: { family: "Fraunces", size: 12 },
          color: "#6b6b6b",
        },
        ...axisStyle,
      },
    },
  };
}

// Малює початкові точки на графіках лагранжа і мнк щоб ми могли порівнювати
export function makePointsDataset(points) {
  return {
    label: "Вхідні точки (xᵢ, yᵢ)",
    data: points.map((p) => ({ x: p.x, y: p.y })),
    backgroundColor: "#111111",
    borderColor: "#ffffff",
    borderWidth: 2,
    pointRadius: 6,
    pointHoverRadius: 8,
    pointStyle: "circle",
    showLine: false,
    order: 1, // рендеримо поверх кривих
  };
}

//Крок в анімації в обох графіків
export const STEP = 6;