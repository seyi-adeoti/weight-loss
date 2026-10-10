import { Navigate, Route, Routes } from "react-router-dom";
import CalorieBasicsQuiz, { CalculatorGate } from "./pages/CalorieBasicsQuiz";
import CaloriesExplained from "./pages/CaloriesExplained";
import DesignPreview from "./pages/DesignPreview";
import FoodLogger from "./pages/FoodLogger";
import FoodScaleTutorial from "./pages/FoodScaleTutorial";
import WeightTracker from "./pages/WeightTracker";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/calories-explained" />} />
      <Route path="/calories-explained" element={<CaloriesExplained />} />
      <Route path="/design-preview" element={<DesignPreview />} />
      <Route path="/calorie-quiz" element={<CalorieBasicsQuiz />} />
      <Route path="/calorie-calculator" element={<CalculatorGate />} />
      <Route path="/food-logger" element={<FoodLogger />} />
      <Route path="/food-scale-tutorial" element={<FoodScaleTutorial />} />
      <Route path="/weight-tracker" element={<WeightTracker />} />
      <Route path="*" element={<Navigate replace to="/calories-explained" />} />
    </Routes>
  );
}
