import { useState } from "react";
import LagrangeChart from "./components/LagrangeChart";
import MNKChart from "./components/MNKChart";
import ResidualChart from "./components/ResidualChart";
import ComparisonTable from "./components/ComparisonTable";
import { DATASETS, MNK_DEGREE } from "./data/points";
import styles from "./App.module.css";
const SETS = [5, 10, 20];
export default function App() {
  const [activeSet, setActiveSet] = useState(5);

  const points = DATASETS[activeSet];
  const degree = MNK_DEGREE[activeSet];

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Лабораторна робота №4, Варіант 19</h1>
      </header>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Набір точок</p>
        <div className={styles.controls}>
          {SETS.map((n) => (
            <button
              key={n}
              className={`${styles.btn} ${activeSet === n ? styles.btnActive : ""}`}
              onClick={() => setActiveSet(n)}
            >
              {n} точок
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Графіки апроксимації</p>
        <div className={styles.chartsGrid}>
          <LagrangeChart points={points} />
          <MNKChart points={points} degree={degree} />
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>Аналіз результатів</p>
        <div className={styles.bottomRow}>
          <div className={styles.bottomLeft}>
            <ResidualChart points={points} degree={degree} />
          </div>
          <div className={styles.bottomRight}>
            <ComparisonTable activeSet={activeSet} />
          </div>
        </div>
      </section>
    </main>
  );
}
