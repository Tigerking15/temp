// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AyurvedaGardenList from "./AyurvedaGardenList";
import PlantView from "./PlantView";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AyurvedaGardenList />} />
        <Route path="/garden/:plant" element={<PlantView />} />
      </Routes>
    </Router>
  );
}
