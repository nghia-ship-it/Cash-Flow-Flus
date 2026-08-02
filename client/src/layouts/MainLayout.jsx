import React, { useState } from 'react';
import { Layout, Menu, Avatar } from 'antd';
import { 
  DashboardOutlined, 
  ShoppingCartOutlined, 
  AppstoreOutlined, 
  DollarOutlined, 
  TeamOutlined 
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: '/orders', icon: <ShoppingCartOutlined />, label: 'Bán hàng' },
    { key: '/products', icon: <AppstoreOutlined />, label: 'Kho & Sản phẩm' },
    { key: '/cash-flow', icon: <DollarOutlined />, label: 'Thu Chi & Dòng tiền' },
    { key: '/customers', icon: <TeamOutlined />, label: 'Khách hàng' },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)} 
        theme="light"
        className="shadow-md z-10"
      >
        <div className="h-16 flex items-center justify-center font-black text-2xl text-blue-600 border-b border-gray-100">
          {collapsed ? 'CF' : 'CASH FLOW'}
        </div>
        <Menu 
          theme="light" 
          mode="inline" 
          selectedKeys={[location.pathname]} 
          items={menuItems} 
          onClick={({ key }) => navigate(key)}
          className="border-r-0 mt-2"
        />
      </Sider>

      <Layout className="bg-gray-50">
        <Header className="bg-white px-6 flex justify-between items-center shadow-sm h-16 leading-[4rem]">
          <div className="font-semibold text-lg text-gray-700">Hệ thống Quản trị Doanh nghiệp</div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 rounded-lg transition-colors">
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=Admin" className="bg-blue-100" />
            <span className="text-gray-600 font-medium hidden sm:block">Admin</span>
          </div>
        </Header>

        <Content className="m-6 p-6 bg-white rounded-xl shadow-sm min-h-[280px]">
          {/* Chỗ này (Outlet) là nơi React Router sẽ nhét nội dung của từng trang vào */}
          <Outlet /> 
        </Content>
      </Layout>
    </Layout>
  );
}