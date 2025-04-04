import "./App.css";
import AdminRegistration from "./pages/AdminRegistration";
import CustomerRegistration from "./pages/CustomerRegistration";
import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import { JSX } from "react";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const adminToken = localStorage.getItem('adminToken');
  return adminToken ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/customer-registration" element={<CustomerRegistration />} />
      <Route path="/admin-registration" element={<AdminRegistration />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Protected Admin Dashboard Route */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;