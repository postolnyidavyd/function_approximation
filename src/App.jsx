
import "./App.css";
import LagrangeChart from "./components/Lagrangechart.jsx";
import {DATASETS, MNK_DEGREE} from "./data/points.js";

function App() {

  return (
    <>
      <LagrangeChart points={DATASETS["10"]} />
    </>
  );
}

export default App;
