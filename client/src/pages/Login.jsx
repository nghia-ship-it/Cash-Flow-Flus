import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      // Gọi API Login xuống Backend
      const response = await API.post('/auth/login', values);
      
      // Thành công thì lưu Token và thông tin User vào bộ nhớ trình duyệt (localStorage)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      message.success(response.data.message);
      
      // Chuyển hướng chui vào Dashboard
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border-0">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-blue-600 mb-2">CASH FLOW</h1>
          <p className="text-gray-500">Đăng nhập để quản lý doanh nghiệp</p>
        </div>

        <Form layout="vertical" onFinish={handleLogin} size="large">
          <Form.Item 
            name="username" 
            rules={[{ required: true, message: 'Chưa nhập tài khoản kìa!' }]}
          >
            <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Tên đăng nhập" />
          </Form.Item>

          <Form.Item 
            name="password" 
            rules={[{ required: true, message: 'Quên nhập mật khẩu rồi!' }]}
          >
            <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item className="mt-6 mb-0">
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold"
              loading={loading}
            >
              VÀO HỆ THỐNG
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}