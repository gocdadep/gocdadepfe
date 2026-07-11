/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "../../ai/.agents/tasks/2026-07/11/11-tiki-products-data-urls");
const targetFile = path.join(__dirname, "../data/tiki-affiliate-products.json");

const files = ["a.json", "b.json", "c.json"];
const productsMap = new Map();

files.forEach(file => {
  const filePath = path.join(sourceDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Không tìm thấy file: ${filePath}`);
    return;
  }
  
  try {
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
    
    // Đọc data top-level (nếu có)
    if (content.data && Array.isArray(content.data)) {
      content.data.forEach(item => processProduct(item));
    }
    
    // Đọc trong widgets
    if (content.widgets && Array.isArray(content.widgets)) {
      content.widgets.forEach(widget => {
        if (widget.product) {
          processProduct(widget.product);
        }
      });
    }
  } catch (err) {
    console.error(`Lỗi đọc file ${file}:`, err);
  }
});

function getCategoryByName(name) {
  const n = name.toLowerCase();
  if (n.includes("sữa rửa mặt") || n.includes("gel rửa mặt") || n.includes("rửa mặt") || n.includes("cleanser")) return "cleanser";
  if (n.includes("chống nắng") || n.includes("sunscreen") || n.includes("sunplay")) return "sunscreen";
  if (n.includes("serum") || n.includes("tinh chất") || n.includes("ampoule")) return "serum";
  if (n.includes("toner") || n.includes("nước hoa hồng") || n.includes("nước sen")) return "toner";
  if (n.includes("kem dưỡng") || n.includes("moisturizer") || n.includes("cream")) return "moisturizer";
  if (n.includes("tẩy trang")) return "cleanser";
  if (n.includes("tẩy tế bào") || n.includes("tẩy da chết")) return "cleanser";
  if (n.includes("retinol")) return "retinol";
  if (n.includes("mặt nạ") || n.includes("mask")) return "study";
  return "general";
}

function processProduct(prod) {
  if (!prod) return;
  
  const url = prod.url || (prod.url_path ? `https://tiki.vn/${prod.url_path}` : "");
  if (!url) return;
  
  // Cắt bỏ query string để lấy link thô
  const rawUrl = url.split("?")[0];
  if (!rawUrl.includes("tiki.vn")) return;

  const id = prod.id || rawUrl.match(/-p(\d+)\.html/)?.[1] || "unknown";
  const category = getCategoryByName(prod.name);
  
  productsMap.set(id, {
    id: `tiki-${id}`,
    slug: `tiki-product-${id}`,
    title: prod.name,
    brand: prod.brand_name || prod.seller?.name || "Mỹ phẩm",
    price: prod.price ? `${prod.price.toLocaleString("vi-VN")}đ` : "Liên hệ",
    description: prod.short_description || `Sản phẩm chính hãng trên Tiki.vn.`,
    imagePath: prod.thumbnail_url || "",
    shopeeUrl: rawUrl, // Dùng chung trường shopeeUrl hoặc rawTikiUrl để tương thích với component hiện tại nếu cần
    rawTikiUrl: rawUrl,
    category: category,
    ctaLabel: "Xem trên Tiki Trading",
    campaignId: "tiki",
    tags: [prod.brand_name || "Mỹ phẩm", "tiki"]
  });
}

const result = Array.from(productsMap.values());

// Đảm bảo thư mục đích tồn tại
const targetDir = path.dirname(targetFile);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(targetFile, JSON.stringify(result, null, 2), "utf8");
console.log(`Đã trích xuất thành công ${result.length} sản phẩm Tiki vào ${targetFile}`);
