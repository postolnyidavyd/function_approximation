import { gauss } from "./gauss.js";

export function computeMNK(points, k, m = 500) {
  const n = points.length;

  const X = buildMatrix(points, k);

  const Xt = transpose(X);

  const A = multiplyMatrices(Xt, X);

  const y = points.map((p) => p.y);
  const b = multiplyMatrixVector(Xt, y);

  const coeffs = gauss(A, b);

  const xMin = points[0].x;
  const xMax = points[n - 1].x;
  const h = (xMax - xMin) / (m - 1);

  const plotX = [];
  const plotY = [];

  for (let i = 0; i < m; i++) {
    const x = xMin + i * h;
    plotX.push(x);

    let val = 0;
    for (let j = 0; j <= k; j++) {
      val += coeffs[j] * Math.pow(x, j);
    }
    plotY.push(val);
  }

  // залишки
  const residuals = points.map((p) => {
    let predicted = 0;
    for (let j = 0; j <= k; j++) {
      predicted += coeffs[j] * Math.pow(p.x, j);
    }
    return p.y - predicted;
  });

  // метрики
  const MSE = residuals.reduce((sum, r) => sum + r * r, 0) / n;
  const RMSE = Math.sqrt(MSE);

  const yMean = y.reduce((sum, yi) => sum + yi, 0) / n;

  const SStot = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
  const SSres = residuals.reduce((sum, r) => sum + r * r, 0);

  const R2 = 1 - SSres / SStot;

  return { plotX, plotY, coeffs, residuals, MSE, RMSE, R2 };
}

function buildMatrix(points, k) {
  const n = points.length;
  const X = [];

  for (let i = 0; i < n; i++) {
    X[i] = [];
    for (let j = 0; j < k + 1; j++) {
      X[i][j] = Math.pow(points[i].x, j);
    }
  }

  return X;
}

function transpose(X) {
  const rows = X.length;
  const cols = X[0].length;
  const Xt = [];

  for (let j = 0; j < cols; j++) {
    Xt[j] = [];
    for (let i = 0; i < rows; i++) {
      Xt[j][i] = X[i][j];
    }
  }

  return Xt;
}

function multiplyMatrices(A, B) {
  const rows = A.length;
  const cols = B[0].length;
  const inner = B.length;
  const result = [];

  for (let i = 0; i < rows; i++) {
    result[i] = [];
    for (let j = 0; j < cols; j++) {
      let sum = 0;
      for (let k = 0; k < inner; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }

  return result;
}

function multiplyMatrixVector(A, v) {
  return A.map((row) => row.reduce((sum, val, j) => sum + val * v[j], 0));
}
