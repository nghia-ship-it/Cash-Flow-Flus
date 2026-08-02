import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, message } from 'antd';
import { 
  DollarOutlined, 
  ShoppingCartOutlined, 
  AppstoreOutlined, 
  TeamOutlined 
} from '@ant-design/icons';
import API from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await API.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        message.error('Không tải được dữ liệu tổng quan!');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tổng quan hệ thống kinh doanh</h1>

      {/* Các thẻ thống kê lớn */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} className="shadow-sm border-l-4 border-l-blue-500 rounded-xl">
            <Statistic
              title={<span className="text-gray-500 font-semibold">Tổng Doanh Thu</span>}
              value={stats.totalRevenue}
              suffix="VNĐ"
              prefix={<DollarOutlined className="text-blue-500 mr-2" />}
              styles={{ content: { color: '#2563eb', fontWeight: 'bold' } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} className="shadow-sm border-l-4 border-l-green-500 rounded-xl">
            <Statistic
              title={<span className="text-gray-500 font-semibold">Tổng Đơn Đã Bán</span>}
              value={stats.totalOrders}
              suffix="Đơn"
              prefix={<ShoppingCartOutlined className="text-green-500 mr-2" />}
              styles={{ content: { color: '#16a34a', fontWeight: 'bold' } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} className="shadow-sm border-l-4 border-l-purple-500 rounded-xl">
            <Statistic
              title={<span className="text-gray-500 font-semibold">Sản phẩm trong kho</span>}
              value={stats.totalProducts}
              suffix="Mặt hàng"
              prefix={<AppstoreOutlined className="text-purple-500 mr-2" />}
              styles={{ content: { color: '#9333ea', fontWeight: 'bold' } }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} className="shadow-sm border-l-4 border-l-orange-500 rounded-xl">
            <Statistic
              title={<span className="text-gray-500 font-semibold">Khách Hàng</span>}
              value={stats.totalCustomers}
              suffix="Thành viên"
              prefix={<TeamOutlined className="text-orange-500 mr-2" />}
              styles={{ content: { color: '#ea580c', fontWeight: 'bold' } }}
            />
          </Card>
        </Col>
      </Row>

      {/* Khu vực cảnh báo hoặc thông tin thêm */}
      <Row gutter={16}>
        <Col span={24}>
          <Card className="shadow-sm rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-blue-900 mb-1">Chào mừng bạn quay lại hệ thống quản lý!</h2>
                <p className="text-blue-700 text-sm">
                  {stats.lowStockProducts > 0 
                    ? `⚠️ Cảnh báo: Đang có ${stats.lowStockProducts} mặt hàng sắp hết hoặc cạn kiệt trong kho!`
                    : '✅ Tình trạng kho hàng ổn định, không có mặt hàng nào bị thiếu.'}
                </p>
              </div>
              <div className="hidden sm:block text-4xl text-blue-400">
                📊
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}