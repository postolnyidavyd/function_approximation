import { useEffect, useRef, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { computeLagrange } from "../utils/lagrange";
import { makeBaseOptions, makePointsDataset, STEP } from "../utils/chartConfig";
import styles from "./Chart.module.css";

export default function LagrangeChart({ points }) {
  const fullData = useMemo(() => computeLagrange(points), [points]);

  const [visibleCount, setVisibleCount] = useState(0);
  const requestAnimationFrameRef = useRef(null);

  useEffect(() => {
    // скасовуємо попередню анімацію
    cancelAnimationFrame(requestAnimationFrameRef.current);

    const total = fullData.plotX.length;

    // використовуємо зміну тут а не стан бо в strictMode фігово робить
    let count = 0;
    setVisibleCount(0);

    const animate = () => {
      count = Math.min(count + STEP, total);
      setVisibleCount(count);
      if (count < total) {
        requestAnimationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    requestAnimationFrameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestAnimationFrameRef.current);
  }, [fullData]);

  // то що малювати
  const curveData = fullData.plotX
    .slice(0, visibleCount)
    .map((x, i) => ({ x, y: fullData.plotY[i] }));

  //рахуємо макc значення щоб не пригав графік
  const xMin = fullData.plotX[0];
  const xMax = fullData.plotX[fullData.plotX.length - 1];
  const yValues = fullData.plotY;
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const xPad = (xMax - xMin) * 0.05 || 0.5;
  const yPad = (yMax - yMin) * 0.05 || 0.5;

  const baseOptions = makeBaseOptions({ xLabel: "x", yLabel: "y" });

  const options = {
    ...baseOptions,
    scales: {
      x: {
        ...baseOptions.scales.x,
        min: xMin - xPad,
        max: xMax + xPad,
      },
      y: {
        ...baseOptions.scales.y,
        min: yMin - yPad,
        max: yMax + yPad,
      },
    },
  };

  const data = {
    datasets: [
      {
        label: "Поліном Лагранжа (проходить через всі)",
        data: curveData,
        borderColor: "#111111",
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0,
        showLine: true,
        order: 2,
      },
      makePointsDataset(points),
    ],
  };

  return (
    <div className={styles.chartBox}>
      <p className={styles.chartLabel}>Поліном Лагранжа</p>
      <div className={styles.chartCanvas}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
