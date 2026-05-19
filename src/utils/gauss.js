// Розв`язує систему A·x = b методом Гауса
export function gauss(A, b) {
  const n = A.length;

  const matrix = A.map((row) => [...row]);
  const vector = [...b];

  //зведення до трикутного вигляду
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const factor = matrix[j][i] / matrix[i][i];

      // оновлюємо цілий рядок бо в матрицях не можна змінити лише одне значення з рядка
      for (let k = i; k < n; k++) {
        matrix[j][k] -= factor * matrix[i][k];
      }
      vector[j] -= factor * vector[i];
    }
  }

  //отримання коефіцієнтів знизу вверх
  const x = new Array(n).fill(0);

  for (let i = n - 1; i >= 0; i--) {
    x[i] = vector[i];
    for (let j = i + 1; j < n; j++) {
      x[i] -= matrix[i][j] * x[j];
    }
    x[i] /= matrix[i][i];
  }

  return x;
}
