import { useState, useEffect } from "react";
import {
  Table,
  Button,
  InputNumber,
  Spin,
  Alert,
  Popconfirm,
  Space,
  message,
} from "antd";
import {
  deleteAllProductCartAPi,
  deleteProductCartApi,
  getProductsCartApi,
  patchQuantityApi,
} from "../util/api";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getProductsCartApi();
      setCart(res);
    } catch (err) {
      setError(err?.message || "Có lỗi xảy ra, vui lòng thử lại sau!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ useEffect tính totalPrice khi cart thay đổi
  useEffect(() => {
    if (cart?.products) {
      const total = cart.products.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [cart]);

  const handleQuantityChange = async (productId, quantity) => {
    try {
      const res = await patchQuantityApi(productId, quantity);
      setCart(res); // set lại cart mới
      message.success("Cập nhật số lượng thành công");
    } catch (err) {
      message.error(err?.message || "Cập nhật thất bại");
    }
  };

  const handleDelete = async (productId) => {
    try {
      const res = await deleteProductCartApi(productId);
      setCart(res); // set lại cart mới
      message.success("Xóa khỏi giỏ hàng thành công");
    } catch {
      message.error(error?.message || "Cập nhật thất bại");
    }
  };

  const handleClearCart = async () => {
    try {
      await deleteAllProductCartAPi();
      setCart([]); // set lại cart mới
      message.success("Xóa toàn bộ giỏ hàng thành công");
    } catch {
      message.error(error?.message || "Cập nhật thất bại");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Alert type="error" message={error} />
      </div>
    );
  }

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: ["product", "name"],
      key: "name",
      render: (text, record) => (
        <Space>
          <img src={record.product.images[0]} alt={text} width={80} />
          {text}
        </Space>
      ),
    },
    {
      title: "Giá",
      dataIndex: ["product", "price"],
      key: "price",
      render: (price) => `${price.toLocaleString()} đ`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => handleQuantityChange(record.product._id, value)}
        />
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_, record) =>
        `${(record.product.price * record.quantity).toLocaleString()} đ`,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa sản phẩm này?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDelete(record.product._id)} // ✅ Đúng
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Giỏ hàng của bạn</h2>
      <Table
        dataSource={cart?.products || []}
        columns={columns}
        rowKey={(record) => record._id}
        pagination={false}
        footer={() => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <b>Tổng cộng: {totalPrice.toLocaleString()} đ</b>
            <Space>
              <Popconfirm
                title="Bạn có chắc muốn xóa toàn bộ giỏ hàng?"
                okText="Yes"
                cancelText="No"
                onConfirm={handleClearCart}
              >
                <Button danger>Xóa tất cả</Button>
              </Popconfirm>
              <Button onClick={() => navigate("/checkout")} type="primary">
                Mua hàng
              </Button>
            </Space>
          </div>
        )}
      />
    </div>
  );
};

export default CartPage;
