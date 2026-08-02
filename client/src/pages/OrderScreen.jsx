import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Table, message, InputNumber, Divider, Select, Empty } from 'antd';
import { SearchOutlined, ShoppingCartOutlined, DeleteOutlined, PayCircleOutlined, UserOutlined } from '@ant-design/icons';
import API from '../services/api';

export default function OrderScreen() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]); // State danh sách khách hàng
  const [selectedCustomer, setSelectedCustomer] = useState(undefined); // Khách được chọn
  const [cart, setCart] = useState([]); 
  const [searchText, setSearchText] = useState('');

  // 1. Tải danh sách sản phẩm và khách hàng cùng lúc
  const fetchData = async () => {
    try {
      const [prodRes, custRes] = await Promise.all([
        API.get('/products'),
        API.get('/customers')
      ]);
      setProducts(prodRes.data.filter(p => p.status === 'ACTIVE' && p.stockQuantity > 0));
      setCustomers(custRes.data);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu!');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Logic Thêm vào giỏ hàng
  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stockQuantity) {
        message.warning(`Trong kho chỉ còn đúng ${product.stockQuantity} cái thôi mày!`);
        return;
      }
      setCart(cart.map(item => 
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // 3. Logic Cập nhật số lượng trực tiếp trong giỏ
  const updateQuantity = (id, value) => {
    if (value <= 0) {
      removeCartItem(id); 
      return;
    }
    const product = products.find(p => p._id === id);
    if (product && value > product.stockQuantity) {
      message.warning(`Không đủ hàng, kho còn ${product.stockQuantity} cái!`);
      return;
    }
    setCart(cart.map(item => item._id === id ? { ...item, quantity: value } : item));
  };

  // Xóa 1 món khỏi giỏ
  const removeCartItem = (id) => {
    setCart(cart.filter(item => item._id !== id));
  };

  // 4. Tính tổng tiền tự động
  const totalAmount = cart.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0);

  // Lọc sản phẩm theo thanh tìm kiếm
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchText.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchText.toLowerCase())
  );

  // Cột cho bảng Giỏ Hàng (Bên phải)
  const cartColumns = [
    { 
      title: 'Tên món', 
      dataIndex: 'name', 
      key: 'name',
      render: (text, record) => (
        <div>
          <div className="font-semibold">{text}</div>
          <div className="text-gray-400 text-xs">{record.sellPrice.toLocaleString()} đ</div>
        </div>
      )
    },
    { 
      title: 'SL', 
      key: 'quantity',
      render: (_, record) => (
        <InputNumber 
          min={1} 
          max={record.stockQuantity}
          value={record.quantity} 
          onChange={(val) => updateQuantity(record._id, val)} 
          className="w-16"
        />
      )
    },
    { 
      title: 'Thành tiền', 
      key: 'total',
      render: (_, record) => (
        <span className="font-bold text-blue-600">
          {(record.sellPrice * record.quantity).toLocaleString()} đ
        </span>
      )
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeCartItem(record._id)} />
      )
    }
  ];

  // Hàm xử lý thanh toán
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const orderItems = cart.map(item => ({
      product: item._id,      
      quantity: item.quantity, 
      price: item.sellPrice    
    }));

    try {
      await API.post('/orders', {
        customer: selectedCustomer || null, // Gửi ID khách hàng được chọn lên Backend
        items: orderItems,
        totalAmount: totalAmount
      });

      message.success('Chốt đơn thành công! Tiền đã vào túi, hàng đã trừ kho!');
      
      // Dọn dẹp chiến trường
      setCart([]);      
      setSelectedCustomer(undefined); // Reset lại ô chọn khách
      fetchProducts();  
      
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi thanh toán!');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
      <div className="w-full lg:w-7/12 xl:w-2/3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Menu Sản phẩm</h2>
        <Input 
          size="large" 
          placeholder="Tìm theo mã SKU hoặc tên..." 
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-6"
        />
        
        {/* Lưới sản phẩm */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2" style={{ maxHeight: '60vh' }}>
          {filteredProducts.map(product => (
            <div 
              key={product._id} 
              className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between h-32"
              onClick={() => addToCart(product)}
            >
              <div>
                <div className="text-xs text-gray-400 mb-1">{product.sku}</div>
                <div className="font-semibold text-sm line-clamp-2 leading-tight">{product.name}</div>
              </div>
              <div className="flex justify-between items-end mt-2">
                <span className="text-blue-600 font-bold">{product.sellPrice.toLocaleString()}đ</span>
                <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Còn {product.stockQuantity}</span>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-10">
              <Empty description="Không tìm thấy món nào (hoặc đã hết hàng)" />
            </div>
          )}
        </div>
      </div>

      {/* CỘT PHẢI: GIỎ HÀNG & CHỌN KHÁCH HÀNG */}
      <div className="w-full lg:w-5/12 xl:w-1/3 bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCartOutlined /> Giỏ Hàng
          </h2>
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            {cart.length} món
          </span>
        </div>

        {/* Ô CHỌN KHÁCH HÀNG NẰM Ở ĐÂY */}
        <div className="mb-3">
          <label className="block text-xs font-bold text-gray-500 mb-1">KHÁCH MUA HÀNG:</label>
          <Select
            showSearch
            allowClear
            size="large"
            placeholder="Chọn khách (hoặc để trống nếu vãng lai)"
            optionFilterProp="children"
            className="w-full"
            value={selectedCustomer}
            onChange={(val) => setSelectedCustomer(val)}
            options={customers.map(c => ({ value: c._id, label: `${c.name} - ${c.phone}` }))}
            suffixIcon={<UserOutlined />}
          />
        </div>

        {/* Bảng chi tiết giỏ hàng */}
        <div className="flex-1 overflow-y-auto bg-white rounded-lg border border-gray-100 mb-3" style={{ maxHeight: '35vh' }}>
          <Table 
            dataSource={cart.map(item => ({ ...item, key: item._id }))} 
            columns={cartColumns} 
            pagination={false}
            size="small"
            locale={{ emptyText: 'Chưa chọn món nào' }}
          />
        </div>

        {/* Tổng kết tính tiền */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500">Khách phải trả:</span>
            <span className="text-2xl font-black text-blue-600">{totalAmount.toLocaleString()} đ</span>
          </div>
          <Divider className="my-2" />
          <Button 
            type="primary" 
            size="large" 
            className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold"
            icon={<PayCircleOutlined />}
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            THANH TOÁN NGAY
          </Button>
        </div>
      </div>
    </div>
  );
}