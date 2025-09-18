import { useNavigate, useParams } from "react-router-dom";
import {
  getCommentsProductApi,
  getProductDetail,
  getRelatedProductApi,
  postCommentProductApi,
  postViewedApi,
} from "../util/api";
import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Badge,
  Carousel,
  Rate,
  Divider,
  Button,
  Spin,
  Alert,
  Input,
  Form,
  message,
} from "antd";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Meta } = Card;

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [count, setCount] = useState(0);

  const navigate = useNavigate();
  // Lấy chi tiết sản phẩm
  const fetchProductDetail = async () => {
    setLoading(true);
    setProductDetail(null); // reset product cũ
    try {
      const res = await getProductDetail(productId);
      setProductDetail(res);
    } catch (err) {
      setError(err?.message || "Có lỗi xảy ra, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentsProduct = async () => {
    setComments([]); // reset comment cũ
    try {
      const res = await getCommentsProductApi(productId);
      setComments(res);
      console.log(">>>", res);
    } catch (err) {
      setError(err?.message || "Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  const fetchRelatedProduct = async () => {
    setRelated([]);
    try {
      const res = await getRelatedProductApi(productId);
      setRelated(res);
    } catch (err) {
      setError(err?.message || "Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  const postViewed = async () => {
    try {
      await postViewedApi(productId);
    } catch (err) {
      setError(err?.message || "Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  useEffect(() => {
    fetchProductDetail();
    fetchCommentsProduct();
    fetchRelatedProduct();
    postViewed();
  }, [productId]);

  // Submit review
  const handleSubmitReview = async (values) => {
    setSubmitting(true);
    try {
      console.log(values);
      await postCommentProductApi(productId, values.rating, values.content);
      message.success("Gửi đánh giá thành công!");
      await fetchCommentsProduct();
      await fetchCountComments();
    } catch (err) {
      console.error("Lỗi khi gửi review:", err);
      message.error(err?.message || "Gửi đánh giá thất bại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Alert type="error" message={error} />
      </div>
    );

  if (!productDetail) return null;

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={[24, 24]}>
        {/* Ảnh sản phẩm */}
        <Col xs={24} sm={10}>
          <Carousel autoplay>
            {productDetail.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={productDetail.name}
                style={{
                  width: "100%",
                  height: 350,
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
            ))}
          </Carousel>
        </Col>

        {/* Thông tin sản phẩm */}
        <Col xs={24} sm={14}>
          <Badge.Ribbon
            text={`Còn ${productDetail.stock} sp`}
            color={productDetail.stock > 0 ? "green" : "red"}
          >
            <Card
              style={{
                borderRadius: 10,
                boxShadow: "0 2px 10px #f0f1f2",
              }}
            >
              <Meta
                title={<Title level={3}>{productDetail.name}</Title>}
                description={
                  <>
                    <Paragraph
                      style={{
                        color: "#d4380d",
                        fontWeight: "bold",
                        fontSize: 18,
                        marginBottom: 5,
                      }}
                    >
                      {productDetail.price.toLocaleString()} VNĐ
                    </Paragraph>
                    <Paragraph>{productDetail.description}</Paragraph>
                    <Paragraph type="secondary">
                      Category: {productDetail.category?.name}
                    </Paragraph>
                  </>
                }
              />
            </Card>
          </Badge.Ribbon>

          {/* Form đánh giá */}
          <Divider />
          <Title level={4}>Đánh giá sản phẩm</Title>
          <Form layout="vertical" onFinish={handleSubmitReview}>
            <Form.Item
              name="rating"
              label="Đánh giá sao"
              rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
            >
              <Rate />
            </Form.Item>

            <Form.Item
              name="content"
              label="Nội dung đánh giá"
              rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
            >
              <TextArea rows={4} placeholder="Nhập nội dung đánh giá..." />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Gửi đánh giá
              </Button>
            </Form.Item>
          </Form>

          <Divider />
          <Title level={4}>Danh sách đánh giá</Title>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Card
                key={comment._id}
                style={{ marginBottom: 10, borderRadius: 8 }}
                type="inner"
              >
                <Rate disabled defaultValue={comment.rating} />
                <Paragraph style={{ marginTop: 5 }}>
                  {comment.content}
                </Paragraph>
                <Paragraph type="secondary" style={{ fontSize: 12 }}>
                  {comment.user?.name}
                </Paragraph>
              </Card>
            ))
          ) : (
            <Paragraph>Chưa có đánh giá nào</Paragraph>
          )}
          <p>Số lượt đánh giá: {comments.length}</p>

          {/* Danh sách sản phẩm liên quan */}
          <Divider />
          <Title level={4}>Sản phẩm liên quan</Title>
          <Row gutter={[16, 16]}>
            {related.length > 0 ? (
              related.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                  <Card
                    hoverable
                    onClick={() => navigate(`/products/${product._id}`)}
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
                    style={{
                      borderRadius: 10,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    bodyStyle={{ padding: "12px 16px" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-4px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0px)")
                    }
                  >
                    <Card.Meta
                      title={product.name}
                      description={
                        <>
                          <p
                            style={{
                              color: "#d4380d",
                              fontWeight: "bold",
                              marginBottom: 4,
                            }}
                          >
                            {product.price.toLocaleString()} VNĐ
                          </p>
                          <p
                            style={{
                              fontSize: 12,
                              color: "#555",
                              height: 40,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {product.description}
                          </p>
                        </>
                      }
                    />
                  </Card>
                </Col>
              ))
            ) : (
              <Paragraph>Không có sản phẩm liên quan</Paragraph>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailPage;
