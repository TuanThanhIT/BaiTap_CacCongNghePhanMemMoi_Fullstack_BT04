import { useEffect, useState } from "react";
import { getProductsCartApi, postOrderApi } from "../util/api";
import {
  Alert,
  Spin,
  Card,
  List,
  Avatar,
  Form,
  Input,
  Radio,
  Button,
  message,
  notification,
} from "antd";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form] = Form.useForm();

  const navigate = useNavigate();

  // Gọi API lấy giỏ hàng
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

  // Submit đặt hàng
  const handlePlaceOrder = async (values) => {
    try {
      const shippingAddress = values.shippingAddress;
      const paymentMethod = values.paymentMethod;
      const res = await postOrderApi(shippingAddress, paymentMethod);
      notification.success({
        message: res.message,
        description: "Đơn hàng của bạn đã được tạo thành công.",
        placement: "topRight",
      });
      setTimeout(() => {
        navigate("/products");
      }, 2000);
    } catch (err) {
      notification.error({
        message: "Đặt hàng thất bại!",
        description: err?.message || "Có lỗi xảy ra, vui lòng thử lại sau!",
        placement: "topRight",
      });
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

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Thanh toán</h2>

      {/* Giỏ hàng */}
      <Card title="Sản phẩm trong giỏ" style={{ marginBottom: 20 }}>
        <List
          itemLayout="horizontal"
          dataSource={cart.products}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={item.product?.images?.[0]}
                    shape="square"
                    size={64}
                  />
                }
                title={item.product?.name}
                description={`Số lượng: ${
                  item.quantity
                } × ${item.product?.price.toLocaleString()} đ`}
              />
              <div>
                {(item.quantity * item.product?.price).toLocaleString()} đ
              </div>
            </List.Item>
          )}
        />
        <div style={{ textAlign: "right", fontWeight: "bold", marginTop: 10 }}>
          Tổng cộng:{" "}
          {cart.products
            .reduce((sum, item) => sum + item.quantity * item.product.price, 0)
            .toLocaleString()}{" "}
          đ
        </div>
      </Card>

      {/* Form đặt hàng */}
      <Card title="Thông tin giao hàng">
        <Form form={form} layout="vertical" onFinish={handlePlaceOrder}>
          <Form.Item
            label="Địa chỉ giao hàng"
            name="shippingAddress"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input.TextArea rows={3} placeholder="Nhập địa chỉ giao hàng" />
          </Form.Item>

          <Form.Item
            label="Phương thức thanh toán"
            name="paymentMethod"
            initialValue="cod"
            rules={[{ required: true, message: "Vui lòng chọn phương thức!" }]}
          >
            <Radio.Group>
              <Radio value="cod">Thanh toán khi nhận hàng</Radio>
              <Radio value="vnpay">VNPay</Radio>
              <Radio value="paypal">Paypal</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đặt hàng
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CheckoutPage;
