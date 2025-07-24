import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ChecklistDetail from "./pages/ChecklistDetail";
import ItemDetail from "./pages/ItemDetail";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/checklist/:id" element={<ChecklistDetail />} />
        <Route path="/checklist/:id/item/:itemId" element={<ItemDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
