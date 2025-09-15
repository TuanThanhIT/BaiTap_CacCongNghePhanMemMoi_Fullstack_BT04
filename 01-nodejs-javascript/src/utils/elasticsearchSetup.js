const { Client } = require("@elastic/elasticsearch");
const Product = require("../models/product");
const client = new Client({ node: "http://localhost:9200" });

async function setupElasticsearch() {
  try {
    // 1️⃣ Kiểm tra index
    const exists = await client.indices.exists({ index: "products" });

    if (!exists.body) {
      console.log("Index 'products' chưa tồn tại, đang tạo...");
      try {
        await client.indices.create({
          index: "products",
          body: {
            mappings: {
              properties: {
                name: { type: "text" },
                description: { type: "text" },
                price: { type: "float" },
                category: { type: "keyword" }, // lưu ObjectId dạng string
                stock: { type: "integer" },
                images: { type: "keyword" },
                createdAt: { type: "date" },
                updatedAt: { type: "date" },
              },
            },
          },
        });
        console.log("Index 'products' đã được tạo!");
      } catch (err) {
        if (
          err.meta?.body?.error?.type === "resource_already_exists_exception"
        ) {
          console.log("Index 'products' đã tồn tại, bỏ qua tạo lại.");
        } else {
          throw err;
        }
      }
    } else {
      console.log("Index 'products' đã tồn tại, bỏ qua tạo lại.");
    }

    // Đồng bộ dữ liệu MongoDB sang Elasticsearch (batch 100 documents/lần)
    const products = await Product.find();
    if (products.length === 0) {
      console.log("Không có dữ liệu MongoDB để đồng bộ.");
      return;
    }

    const bulkOps = [];
    for (const product of products) {
      bulkOps.push({
        index: { _index: "products", _id: product._id.toString() },
      });
      bulkOps.push({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category?.toString() || "",
        stock: product.stock,
        images: product.images,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
    }

    if (bulkOps.length > 0) {
      const { errors, items } = await client.bulk({
        refresh: true,
        body: bulkOps,
      });

      if (errors) {
        console.warn("Có một số lỗi khi đồng bộ dữ liệu sang Elasticsearch:");
        items.forEach((item, idx) => {
          if (item.index && item.index.error) {
            console.warn(`- Lỗi item ${idx}:`, item.index.error);
          }
        });
      } else {
        console.log(
          `Đồng bộ ${products.length} sản phẩm MongoDB sang Elasticsearch xong!`
        );
      }
    }
  } catch (err) {
    console.error("Lỗi khi setup Elasticsearch:", err);
  }
}

module.exports = setupElasticsearch;
