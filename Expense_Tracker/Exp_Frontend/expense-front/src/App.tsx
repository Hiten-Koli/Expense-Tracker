import { Routes, Route } from "react-router-dom";
import {Login} from "./pages/Login";
import { Register } from "./pages/Register";
import Navbar from "./components/Navbar";
import Expense from "./pages/Expense";
import Income from "./pages/Income";
import Budget from "./pages/Budget";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/expenses" element={<Expense />} />
        <Route path="/incomes" element={<Income />} />
        <Route path="/budgets" element={<Budget />} />
      </Routes>
    </>
  );
};

export default App;
