import { useMemo } from 'react';
import { DATASETS, MNK_DEGREE } from '../data/points';
import { computeMNK } from '../utils/mnk';
import styles from './ComparisonTable.module.css';

const fmt = (v) => v.toFixed(5);

export default function ComparisonTable({ activeSet }) {
    const { RMSE, R2 } = useMemo(() => {
        return computeMNK(DATASETS[activeSet], MNK_DEGREE[activeSet]);
    }, [activeSet]);

    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Набір</th>
                    <th>Метод</th>
                    <th>Степінь</th>
                    <th>Середня похибка</th>
                    <th>Точність апрокс.</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td className={styles.tdSet} rowSpan={2}>
                        {activeSet} точок
                    </td>
                    <td className={styles.tdMethod}>Лагранж</td>
                    <td>{activeSet - 1}</td>
                    <td>0.00000</td>
                    <td>1.00000</td>
                </tr>
                <tr>
                    <td className={styles.tdMethod}>МНК</td>
                    <td>{MNK_DEGREE[activeSet]}</td>
                    <td>{fmt(RMSE)}</td>
                    <td>{fmt(R2)}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}