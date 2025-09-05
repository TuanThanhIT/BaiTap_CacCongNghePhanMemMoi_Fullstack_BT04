import { useEffect, useState } from "react";
import { List, Typography, Spin, Alert } from "antd";
import { getAllCateApi } from "../util/api";

const { Title } = Typography;

const CategoryList = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCateApi();
        // Đảm bảo luôn là array
        setCategories(Array.isArray(res) ? res : []);
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

    fetchCategories();
  }, []);

  if (loading) return <Spin />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div style={{ marginBottom: 20 }}>
      <Title level={3}>Danh mục</Title>
      <List
        bordered
        dataSource={[{ _id: "all", name: "Tất cả sản phẩm" }, ...categories]}
        renderItem={(cate) => (
          <List.Item
            style={{ cursor: "pointer" }}
            onClick={() =>
              onSelectCategory(cate._id === "all" ? null : cate._id)
            }
          >
            {cate.name}
          </List.Item>
        )}
      />
    </div>
  );
};

export default CategoryList;
