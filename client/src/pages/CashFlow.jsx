import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import { DollarOutlined, ShoppingCartOutlined, RiseOutlined } from '@ant-design/icons';
import API from '../services/api';

export default function CashFlow() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await API.get('/orders');
        // Thêm key cho table AntD khỏi chửi
        setOrders(response.data.map(item => ({ ...item, key: item._id })));
      } catch (error) {
        console.error('Lỗi tải dữ liệu đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Tự động tính toán tổng doanh thu và tổng số đơn
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;

  // Cột cho bảng Lịch sử giao dịch
  const columns = [
    {
      title: 'Mã Đơn',
      dataIndex: 'orderCode',
      key: 'orderCode',
      className: 'font-bold text-gray-600',
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Hình thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => (
        <Tag color="green">{method === 'CASH' ? 'TIỀN MẶT' : method}</Tag>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => <span className="font-bold text-blue-600">{amount.toLocaleString()} đ</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color="cyan">HOÀN THÀNH</Tag>,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Báo cáo Dòng tiền & Doanh thu</h1>

      {/* Hàng chứa các thẻ Thống kê (Dashboard) */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card className="shadow-sm border-l-4 border-l-blue-500">
            <Statistic
              title={<span className="text-gray-500 font-semibold text-base">Tổng Doanh Thu</span>}
              value={totalRevenue}
              suffix="VNĐ"
              prefix={<DollarOutlined className="text-blue-500 mr-2" />}
              valueStyle={{ color: '#2563eb', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-sm border-l-4 border-l-green-500">
            <Statistic
              title={<span className="text-gray-500 font-semibold text-base">Số Đơn Đã Bán</span>}
              value={totalOrders}
              suffix="Đơn"
              prefix={<ShoppingCartOutlined className="text-green-500 mr-2" />}
              valueStyle={{ color: '#16a34a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-sm border-l-4 border-l-purple-500">
            <Statistic
              title={<span className="text-gray-500 font-semibold text-base">Lợi Nhuận Tạm Tính</span>}
              value={totalRevenue * 0.3} /* Demo: Giả sử lãi 30% */
              suffix="VNĐ"
              prefix={<RiseOutlined className="text-purple-500 mr-2" />}
              valueStyle={{ color: '#9333ea', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bảng liệt kê chi tiết các hóa đơn */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4">Lịch sử giao dịch gần đây</h2>
        <Table 
          dataSource={orders} 
          columns={columns} 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}