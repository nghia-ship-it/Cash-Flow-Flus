import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Space, message, Modal, Form, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import API from '../services/api';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Thêm state để biết là đang Thêm mới hay đang Sửa
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await API.get('/products');
      const dataWithKey = response.data.map((item) => ({ ...item, key: item._id }));
      setProducts(dataWithKey);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu từ Server!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // HÀM MỞ POPUP: Nếu có record truyền vào -> Sửa. Nếu không -> Thêm mới
  const openModal = (record = null) => {
    if (record) {
      setEditingId(record._id); // Gắn ID để lúc lưu biết đường mà gọi API PUT
      form.setFieldsValue(record); // Đổ dữ liệu cũ của sản phẩm vào các ô input
    } else {
      setEditingId(null);
      form.resetFields(); // Trống form để thêm mới
    }
    setIsModalOpen(true);
  };

  // HÀM LƯU DỮ LIỆU (Dùng chung cho cả Thêm và Sửa)
  const handleSaveProduct = async (values) => {
    try {
      if (editingId) {
        // Nếu có editingId -> Gọi API Sửa
        await API.put(`/products/${editingId}`, values);
        message.success('Cập nhật sản phẩm thành công!');
      } else {
        // Nếu không có -> Gọi API Thêm
        await API.post('/products', values);
        message.success('Thêm sản phẩm thành công!');
      }
      
      setIsModalOpen(false);
      fetchProducts(); // Tải lại bảng ngay lập tức
    } catch (error) {
      message.error('Lỗi rồi mày ơi! Có thể do trùng Mã SKU.');
    }
  };

  // HÀM XÓA SẢN PHẨM
  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      message.success('Đã xóa sản phẩm vào dĩ vãng!');
      fetchProducts();
    } catch (error) {
      message.error('Lỗi khi xóa!');
    }
  };

  const columns = [
    { title: 'Mã SKU', dataIndex: 'sku', key: 'sku', className: 'font-semibold' },
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    { 
      title: 'Giá nhập', 
      dataIndex: 'importPrice', 
      key: 'importPrice',
      render: (price) => <span className="text-gray-500">{price?.toLocaleString()} đ</span> 
    },
    { 
      title: 'Giá bán', 
      dataIndex: 'sellPrice', 
      key: 'sellPrice',
      render: (price) => <span className="text-blue-600 font-bold">{price?.toLocaleString()} đ</span> 
    },
    { 
      title: 'Tồn kho', 
      dataIndex: 'stockQuantity', 
      key: 'stockQuantity',
      render: (stock) => {
        let color = 'green';
        if (stock === 0) color = 'red';
        else if (stock < 5) color = 'orange';
        return <Tag color={color} className="text-sm px-2 py-1">{stock}</Tag>;
      }
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'cyan' : 'default'}>
          {status === 'ACTIVE' ? 'ĐANG BÁN' : 'NGỪNG BÁN'}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* Nút Sửa: Bấm vào gọi hàm openModal truyền dữ liệu của dòng đó vào */}
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="text-blue-500 hover:bg-blue-50"
            onClick={() => openModal(record)} 
          />
          
          {/* Nút Xóa: Bọc trong Popconfirm để hỏi lại cho chắc, chống lỡ tay */}
          <Popconfirm
            title="Xóa sản phẩm"
            description="Mày có chắc chắn muốn xóa vĩnh viễn sản phẩm này không?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xác nhận xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} className="hover:bg-red-50" />
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Kho & Sản phẩm</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          size="large" 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => openModal()} // Mở popup không truyền gì -> Thêm mới
        >
          Thêm sản phẩm
        </Button>
      </div>

      <div className="mb-4 w-1/3">
        <Input 
          size="large" 
          placeholder="Tìm kiếm theo Tên hoặc Mã SKU..." 
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table 
        dataSource={products} 
        columns={columns} 
        loading={loading}
        pagination={{ pageSize: 5 }}
        className="shadow-sm border border-gray-100 rounded-lg overflow-hidden"
      />

      <Modal 
        title={editingId ? "Sửa thông tin Sản phẩm" : "Thêm Sản phẩm mới"} 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        footer={null} 
      >
        <Form form={form} layout="vertical" onFinish={handleSaveProduct} className="mt-4">
          <Form.Item label="Mã SKU" name="sku" rules={[{ required: true, message: 'Vui lòng nhập mã SKU!' }]}>
            <Input placeholder="VD: SP001" disabled={!!editingId} /> 
          </Form.Item>
          
          <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
            <Input placeholder="VD: Vợt cầu lông Yonex" />
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item label="Giá nhập" name="importPrice" className="w-1/2" rules={[{ required: true, message: 'Nhập giá vốn!' }]}>
              <InputNumber 
                className="w-full" 
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                parser={value => value ? value.toString().replace(/,/g, '') : ''} 
                suffix="VND" 
              />
            </Form.Item>

            <Form.Item label="Giá bán" name="sellPrice" className="w-1/2" rules={[{ required: true, message: 'Nhập giá bán!' }]}>
              <InputNumber 
                className="w-full" 
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                parser={value => value ? value.toString().replace(/,/g, '') : ''} 
                suffix="VND" 
              />
            </Form.Item>
          </div>

          <Form.Item label="Tồn kho ban đầu" name="stockQuantity" initialValue={0}>
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item className="text-right mb-0">
            <Button onClick={() => setIsModalOpen(false)} className="mr-2">Hủy</Button>
            <Button type="primary" htmlType="submit" className="bg-blue-600">
              {editingId ? "Cập nhật Sản phẩm" : "Lưu Sản phẩm"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}