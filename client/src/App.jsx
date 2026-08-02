import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProductList from './pages/ProductList';
import OrderScreen from './pages/OrderScreen';
import CashFlow from './pages/CashFlow';
import CustomerList from './pages/CustomerList';
import Login from './pages/Login';
import StaffList from './pages/StaffList';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard index/>} />
          <Route path="orders" element={<OrderScreen />} />
          <Route path="products" element={<ProductList />} />
          <Route path="cash-flow" element={<CashFlow />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="staff" element={<StaffList/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}