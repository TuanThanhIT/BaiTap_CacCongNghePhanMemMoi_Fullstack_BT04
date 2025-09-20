// src/pages/favorites.jsx
import { useEffect, useState } from "react";
import { HeartFilled } from "@ant-design/icons";
import {
  Row,
  Col,
  Card,
  Spin,
  Alert,
  Typography,
  Badge,
  Empty,
  Button,
  notification,
  message,
} from "antd";
import {
  getFavoritesApi,
  deleteFavoriteApi,
  postProductCartApi,
} from "../util/api";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Meta } = Card;

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Lấy danh sách yêu thích
  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await getFavoritesApi();
      setFavorites(res.favorites || []);
    } catch (err) {
      // Vì interceptor đã trả về err.response.data nên err chính là object { statusCode, message }
      setError(err?.message || "Có lỗi xảy ra, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Xóa khỏi yêu thích
  const handleRemoveFavorite = async (productId) => {
    try {
      const res = await deleteFavoriteApi(productId);
      setFavorites((prev) => prev.filter((p) => p._id !== productId));
      notification.error({
        message: "Thông báo",
        description: res.message,
      });
    } catch (err) {
      // Log lỗi cho dev
      console.error("Lỗi khi xóa khỏi favorites:", err);
      // Hiện thông báo cho user
      setError(
        err?.message || "Xóa khỏi yêu thích thất bại, vui lòng thử lại!"
      );
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await postProductCartApi(productId);
      message.success("Thêm sản phẩm vào giỏ hàng thành công");
    } catch (error) {
      setError(error?.message || "Xử lý yêu thích thất bại, vui lòng thử lại!");
    }
  };

  if (loading)
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Alert type="error" message={error} />
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <Title level={3} style={{ textAlign: "left", marginBottom: 20 }}>
        ❤️ Sản phẩm yêu thích
      </Title>

      {favorites.length === 0 ? (
        <Empty description="Chưa có sản phẩm yêu thích nào" />
      ) : (
        <Row gutter={[16, 16]}>
          {favorites.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
              <Badge.Ribbon
                text={`Còn ${product.stock} sp`}
                color={product.stock > 0 ? "green" : "red"}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: 10,
                    boxShadow: "0 2px 8px #f0f1f2",
                  }}
                  cover={
                    <img
                      alt={product.name}
                      src={product.images?.[0]}
                      style={{
                        height: 200,
                        objectFit: "cover",
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                    />
                  }
                >
                  <Meta
                    title={product.name}
                    description={
                      <>
                        <p
                          style={{
                            margin: 0,
                            fontWeight: "bold",
                            color: "#d4380d",
                          }}
                        >
                          {product.price.toLocaleString()} VNĐ
                        </p>
                        <p style={{ margin: "5px 0", color: "#555" }}>
                          {product.description?.slice(0, 50)}...
                        </p>
                      </>
                    }
                  />

                  {/* Hàng nút 1: Thêm giỏ + Yêu thích */}
                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    <Button
                      type="primary"
                      size="middle"
                      style={{ flex: 1, borderRadius: 6 }}
                      onClick={() => handleAddToCart(product.id)}
                    >
                      🛒 Thêm giỏ
                    </Button>

                    <Button
                      type="text"
                      size="middle"
                      style={{ marginTop: 6 }}
                      onClick={() => handleRemoveFavorite(product._id)}
                      icon={
                        <HeartFilled style={{ color: "red", fontSize: 18 }} />
                      }
                    >
                      Bỏ yêu thích
                    </Button>
                  </div>

                  {/* Hàng nút 2: Xem chi tiết */}
                  <Button
                    type="default"
                    size="middle"
                    style={{
                      marginTop: 8,
                      width: "100%",
                      borderRadius: 6,
                    }}
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    🔎 Xem chi tiết
                  </Button>
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default FavoritesPage;
