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
} from "antd";
import { getFavoritesApi, deleteFavoriteApi } from "../util/api";

const { Title } = Typography;
const { Meta } = Card;

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                  cover={
                    <img
                      alt={product.name}
                      src={product.images?.[0]}
                      style={{
                        height: 180, // cao hơn bản nhỏ
                        objectFit: "cover",
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                    />
                  }
                >
                  <Meta
                    title={
                      <span style={{ fontSize: 15, fontWeight: 600 }}>
                        {product.name}
                      </span>
                    }
                    description={
                      <>
                        <p
                          style={{
                            margin: 0,
                            fontWeight: "bold",
                            color: "#d4380d",
                            fontSize: 14,
                          }}
                        >
                          {product.price.toLocaleString()} VNĐ
                        </p>
                        <p
                          style={{
                            margin: "4px 0",
                            color: "#666",
                            fontSize: 13,
                          }}
                        >
                          {product.description?.slice(0, 50)}...
                        </p>
                      </>
                    }
                  />

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
