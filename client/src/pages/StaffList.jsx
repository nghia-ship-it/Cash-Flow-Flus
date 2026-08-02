import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, Form, Tag, message, Select } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import API from '../services/api';

export default function StaffList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get('/auth/users');
      setUsers(response.data.map(u => ({ ...u, key: u._id })));
    } catch (error) {
      message.error('Lỗi khi tải danh sách nhân viên!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (values) => {
    try {
      await API.post('/auth/users', values);
      message.success('Đã cấp tài khoản thành công!');
      setIsModalOpen(false);
      form.resetFields();
      fetchUsers(); // Tải lại bảng
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const columns = [
    { 
      title: 'Họ tên', 
      dataIndex: 'name', 
      key: 'name', 
      render: text => <span className="font-bold text-gray-700"><UserOutlined className="mr-2"/>{text}</span> 
    },
    { title: 'Tên đăng nhập', dataIndex: 'username', key: 'username' },
    { 
      title: 'Quyền hạn', 
      dataIndex: 'role', 
      key: 'role', 
      render: role => (
        <Tag color={role === 'ADMIN' ? 'red' : 'green'}>
          {role === 'ADMIN' ? 'SẾP TỔNG' : 'NHÂN VIÊN'}
        </Tag>
      ) 
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Nhân sự</h1>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setIsModalOpen(true)} className="bg-blue-600">
          Cấp tài khoản
        </Button>
      </div>

      <Table dataSource={users} columns={columns} loading={loading} className="shadow-sm border border-gray-100 rounded-lg" />

      <Modal title="Cấp tài khoản nhân viên" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleCreateUser} className="mt-4">
          <Form.Item label="Họ tên nhân viên" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="VD: Nguyễn Văn A" />
          </Form.Item>
          <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true, message: 'Cấp user cho người ta đăng nhập!' }]}>
            <Input placeholder="VD: nhanvien1" />
          </Form.Item>
          <Form.Item label="Mật khẩu tạm thời" name="password" rules={[{ required: true, message: 'Nhập mật khẩu!' }]}>
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item label="Phân quyền" name="role" initialValue="STAFF">
            <Select>
              <Select.Option value="STAFF">Nhân viên (Chỉ bán hàng)</Select.Option>
              <Select.Option value="ADMIN">Quản lý (Full quyền)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item className="text-right mb-0 mt-6">
            <Button onClick={() => setIsModalOpen(false)} className="mr-2">Hủy</Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600">Tạo tài khoản</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}