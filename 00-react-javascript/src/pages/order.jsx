import { useEffect, useState } from "react";
import { getUserOrderApi, putCancelOrderApi } from "../util/api";
import {
  Alert,
  Spin,
  Table,
  Tag,
  Space,
  Typography,
  Collapse,
  Image,
  Button,
  Popconfirm,
  notification,
} from "antd";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const statusColors = {
  pending: "orange",
  paid: "blue",
  shipped: "cyan",
  completed: "green",
  cancelled: "red",
};

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getUserOrderApi();
      setOrders(res);
    } catch (err) {
      setError(err?.message || "Có lỗi xảy ra, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      await putCancelOrderApi(orderId);
      notification.success({
        message: "Thành công",
        description: "Đơn hàng đã được hủy.",
      });
      fetchOrders(); // load lại danh sách đơn
    } catch (err) {
      notification.error({
        message: "Lỗi",
        description: err?.message || "Không thể hủy đơn hàng.",
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
    <div style={{ padding: 20 }}>
      <Title level={3}>Đơn hàng của bạn</Title>

      <Collapse accordion>
        {orders.map((order) => (
          <Panel
            header={
              <Space size="large">
                <Text strong>Đơn #{order._id.slice(-6)}</Text>
                <Tag color={statusColors[order.status]}>{order.status}</Tag>
                <Text type="secondary">
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </Text>
                <Text strong style={{ color: "green" }}>
                  {order.totalPrice.toLocaleString()} đ
                </Text>
              </Space>
            }
            key={order._id}
          >
            <div style={{ marginBottom: 12 }}>
              <Text>Địa chỉ giao hàng: {order.shippingAddress}</Text>
              <br />
              <Text>Phương thức thanh toán: {order.paymentMethod}</Text>
              <br />
              {order.status === "pending" && (
                <Popconfirm
                  title="Bạn có chắc muốn hủy đơn hàng này?"
                  okText="Có"
                  cancelText="Không"
                  onConfirm={() => handleCancelOrder(order._id)}
                >
                  <Button danger style={{ marginTop: 10 }}>
                    Hủy đơn hàng
                  </Button>
                </Popconfirm>
              )}
            </div>

            <Table
              dataSource={order.products}
              rowKey={(item) => item._id}
              pagination={false}
              columns={[
                {
                  title: "Sản phẩm",
                  dataIndex: ["product", "name"],
                  key: "name",
                  render: (text, record) => (
                    <Space>
                      <Image
                        src={record.product.images[0]}
                        alt={text}
                        width={60}
                      />
                      <span>{text}</span>
                    </Space>
                  ),
                },
                {
                  title: "Giá",
                  dataIndex: "price",
                  key: "price",
                  render: (price) => `${price.toLocaleString()} đ`,
                },
                {
                  title: "Số lượng",
                  dataIndex: "quantity",
                  key: "quantity",
                },
                {
                  title: "Thành tiền",
                  key: "total",
                  render: (_, record) =>
                    `${(record.price * record.quantity).toLocaleString()} đ`,
                },
              ]}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default OrderPage;
