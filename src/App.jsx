import "./App.css";
import LagrangeChart from "./components/Lagrangechart.jsx";
import { DATASETS, MNK_DEGREE } from "./data/points.js";
import MNKChart from "./components/MnkChart.jsx";
import ResidualsChart from "./components/ResidualChart.jsx";

function App() {
  return (
    <>
      <MNKChart points={DATASETS["10"]} degree={MNK_DEGREE["10"]} />
      <ResidualsChart points={DATASETS["10"]} degree={MNK_DEGREE["10"]} />
      <LagrangeChart points={DATASETS["10"]} />
    </>
  );
}

export default App;
