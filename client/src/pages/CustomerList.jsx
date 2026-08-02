import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, message, Modal, Form, Tag } from 'antd';
import { PlusOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import API from '../services/api';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await API.get('/customers');
      setCustomers(response.data.map(item => ({ ...item, key: item._id })));
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu khách hàng!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSaveCustomer = async (values) => {
    try {
      await API.post('/customers', values);
      message.success('Thêm khách hàng thành công!');
      setIsModalOpen(false);
      form.resetFields();
      fetchCustomers();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  // Lọc tìm kiếm theo Tên hoặc Số điện thoại
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchText.toLowerCase()) || 
    c.phone.includes(searchText)
  );

  const columns = [
    { 
      title: 'Khách hàng', 
      dataIndex: 'name', 
      key: 'name',
      render: (text) => <span className="font-bold text-gray-700"><UserOutlined className="mr-2"/>{text}</span>
    },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', className: 'font-semibold' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { 
      title: 'Số đơn đã mua', 
      dataIndex: 'totalPurchases', 
      key: 'totalPurchases',
      render: (num) => <Tag color="blue">{num} đơn</Tag>
    },
    { 
      title: 'Tổng chi tiêu', 
      dataIndex: 'totalSpent', 
      key: 'totalSpent',
      render: (amount) => <span className="font-bold text-green-600">{amount.toLocaleString()} đ</span>
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Khách hàng</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large" 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setIsModalOpen(true)}
        >
          Thêm Khách Hàng
        </Button>
      </div>

      <div className="mb-4 w-1/3">
        <Input 
          size="large" 
          placeholder="Tìm theo tên hoặc SĐT..." 
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table 
        dataSource={filteredCustomers} 
        columns={columns} 
        loading={loading}
        pagination={{ pageSize: 8 }}
        className="shadow-sm border border-gray-100 rounded-lg overflow-hidden"
      />

      <Modal 
        title="Thêm Khách Hàng Mới" 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        footer={null} 
      >
        <Form form={form} layout="vertical" onFinish={handleSaveCustomer} className="mt-4">
          <Form.Item label="Tên khách hàng" name="name" rules={[{ required: true, message: 'Nhập tên khách đi mày!' }]}>
            <Input placeholder="VD: Anh Tèo" />
          </Form.Item>
          
          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Nhập SĐT để sau này gọi!' }]}>
            <Input placeholder="VD: 0901234567" />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address">
            <Input.TextArea placeholder="Nhập địa chỉ (nếu có)" rows={2} />
          </Form.Item>

          <Form.Item className="text-right mb-0 mt-6">
            <Button onClick={() => setIsModalOpen(false)} className="mr-2">Hủy</Button>
            <Button type="primary" htmlType="submit" className="bg-purple-600">Lưu Khách Hàng</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}