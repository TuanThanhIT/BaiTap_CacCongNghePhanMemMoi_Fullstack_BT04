import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Spin,
  Alert,
  Typography,
  Badge,
  Empty,
  Pagination,
} from "antd";
import CategoryList from "../components/categoryList";
import { getAllProducts, getProductsByCateApi } from "../util/api";

const { Title } = Typography;
const { Meta } = Card;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedCate, setSelectedCate] = useState(null);

  const pageSize = 2;
  const fetchProducts = async (page, cateId) => {
    setLoading(true);
    try {
      let res;
      if (cateId) {
        res = await getProductsByCateApi(cateId, page, pageSize);
      } else {
        res = await getAllProducts(page, pageSize);
      }

      // ⚠️ res.data phải theo đúng cấu trúc backend trả về
      // { products, currentPage, totalPages, totalItems }
      const data = res;
      setProducts(data.products || []);
      setTotalItems(data.totalItems || 0);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load ban đầu
  useEffect(() => {
    fetchProducts(1, null);
  }, []);

  // Chọn category
  const handleSelectCategory = (cateId) => {
    setSelectedCate(cateId);
    fetchProducts(1, cateId); // reset về trang 1 khi đổi cate
  };

  // Chuyển trang
  const handlePageChange = (page) => {
    fetchProducts(page, selectedCate);
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
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
      <Title level={2} style={{ textAlign: "left", marginBottom: 30 }}>
        🛒 Trang sản phẩm
      </Title>
      <Row gutter={16}>
        {/* Cột danh mục */}
        <Col xs={24} sm={6}>
          <CategoryList onSelectCategory={handleSelectCategory} />
        </Col>

        {/* Cột sản phẩm */}
        <Col xs={24} sm={18}>
          {products.length === 0 ? (
            <Empty description="Không có sản phẩm nào" />
          ) : (
            <>
              <Row gutter={[16, 16]}>
                {products.map((product) => (
                  <Col xs={24} sm={12} md={8} key={product._id}>
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
                      </Card>
                    </Badge.Ribbon>
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              <div style={{ textAlign: "center", marginTop: 20 }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalItems}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProductsPage;
