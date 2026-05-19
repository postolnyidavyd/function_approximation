import { useEffect, useRef, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { computeMNK } from "../utils/mnk";
import { makeBaseOptions, makePointsDataset, STEP } from "../utils/chartConfig";
import styles from "./Chart.module.css";

//лінії від оригінальної точки до розрахованої ༼ つ ◕_◕ ༽つ
function makeResidualPlugin(points, coeffs, degree) {
  return {
    id: "residualLines",
    afterDatasetsDraw(chart) {
      const {
        ctx,
        scales: { x: xScale, y: yScale },
      } = chart;

      ctx.save();
      ctx.strokeStyle = "#aaaaaa";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);

      points.forEach((point) => {
        let predicted = 0;
        for (let j = 0; j <= degree; j++) {
          predicted += coeffs[j] * Math.pow(point.x, j);
        }

        const px = xScale.getPixelForValue(point.x);
        const pyOrig = yScale.getPixelForValue(point.y);
        const pyPred = yScale.getPixelForValue(predicted);

        ctx.beginPath();
        ctx.moveTo(px, pyOrig);
        ctx.lineTo(px, pyPred);
        ctx.stroke();

        ctx.setLineDash([]);
        const tickHalf = 4;
        ctx.beginPath();
        ctx.moveTo(px - tickHalf, pyPred);
        ctx.lineTo(px + tickHalf, pyPred);
        ctx.stroke();
        ctx.setLineDash([4, 3]);
      });

      ctx.restore();
    },
  };
}

export default function MNKChart({ points, degree }) {
  const mnkResult = useMemo(() => computeMNK(points, degree), [points, degree]);

  const [visibleCount, setVisibleCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);

    let count = 0;
    setVisibleCount(0);
    const total = mnkResult.plotX.length;

    const animate = () => {
      count = Math.min(count + STEP, total);
      setVisibleCount(count);
      if (count < total) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mnkResult]);

  const residualPlugin = useMemo(
    () => makeResidualPlugin(points, mnkResult.coeffs, degree),
    [points, mnkResult.coeffs, degree],
  );

  const curveData = mnkResult.plotX
    .slice(0, visibleCount)
    .map((x, i) => ({ x, y: mnkResult.plotY[i] }));


  const allX = [...points.map((p) => p.x), ...mnkResult.plotX];
  const allY = [...points.map((p) => p.y), ...mnkResult.plotY];

  const xMin = Math.min(...allX);
  const xMax = Math.max(...allX);
  const yMin = Math.min(...allY);
  const yMax = Math.max(...allY);

  const xPad = (xMax - xMin) * 0.05 || 0.5;
  const yPad = (yMax - yMin) * 0.05 || 0.5;

  const baseOptions = makeBaseOptions({ xLabel: "x", yLabel: "y" });

  const options = {
    ...baseOptions,
    scales: {
      x: {
        ...baseOptions.scales?.x,
        min: xMin - xPad,
        max: xMax + xPad,
      },
      y: {
        ...baseOptions.scales?.y,
        min: yMin - yPad,
        max: yMax + yPad,
      },
    },
  };

  const data = {
    datasets: [
      {
        label: `МНК парабола (k=${degree})`,
        data: curveData,
        borderColor: "#111111",
        borderWidth: 1.5,
        borderDash: [6, 3],
        pointRadius: 0,
        tension: 0,
        showLine: true,
        order: 2,
      },
      makePointsDataset(points),
    ],
  };

  const { RMSE, R2 } = mnkResult;

  return (
    <div className={styles.chartBox}>
      <p className={styles.chartLabel}>МНК(k = {degree})</p>
      <div className={styles.chartCanvas}>
        <Line data={data} options={options} plugins={[residualPlugin]} />
      </div>
    </div>
  );
}
