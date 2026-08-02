// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Tạm thời tao để các thẻ <div> chữ to làm nội dung mẫu cho các trang */}
          <Route index element={<h1 className="text-2xl font-bold">Trang Tổng quan (Dashboard)</h1>} />
          <Route path="orders" element={<h1 className="text-2xl font-bold text-green-600">Màn hình Quản lý Bán hàng</h1>} />
          <Route path="products" element={<h1 className="text-2xl font-bold text-orange-600">Màn hình Quản lý Kho</h1>} />
          <Route path="cash-flow" element={<h1 className="text-2xl font-bold text-blue-600">Màn hình Quản lý Dòng tiền</h1>} />
          <Route path="customers" element={<h1 className="text-2xl font-bold text-purple-600">Màn hình Quản lý Khách hàng</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}