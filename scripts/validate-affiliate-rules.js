/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const blogsPath = path.join(__dirname, "../data/blogs.json");
const productsPath = path.join(__dirname, "../data/products.json");

if (!fs.existsSync(blogsPath) || !fs.existsSync(productsPath)) {
  console.error("❌ Không tìm thấy blogs.json hoặc products.json");
  process.exit(1);
}

const blogs = JSON.parse(fs.readFileSync(blogsPath, "utf8"));
const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));

let hasError = false;

// 1. Quét dữ liệu Products
products.forEach((prod) => {
  const nameLower = prod.name.toLowerCase();
  const descLower = (prod.description || "").toLowerCase();
  const brandLower = prod.brand.toLowerCase();

  // Quy tắc Con Cưng: Cấm dùng từ "rẻ", "siêu rẻ"
  if (brandLower === "con cưng" || prod.shopeeUrl.includes("concung.com")) {
    if (nameLower.includes("rẻ") || nameLower.includes("siêu rẻ") || descLower.includes("rẻ") || descLower.includes("siêu rẻ")) {
      console.error(`❌ Vi phạm [Con Cưng - Từ cấm]: Sản phẩm "${prod.name}" (${prod.id}) chứa từ khóa cấm "rẻ" hoặc "siêu rẻ".`);
      hasError = true;
    }

    // Quy tắc Con Cưng: Cấm sữa dưới 24 tháng, sản phẩm dinh dưỡng dưới 6 tháng
    const ageRestrictRegex = /(dưới\s+(24\s+tháng|2\s+tuổi|6\s+tháng))/gi;
    const milkProductRegex = /(sữa|dinh dưỡng)/gi;
    
    if (milkProductRegex.test(nameLower) && ageRestrictRegex.test(nameLower)) {
      console.error(`❌ Vi phạm [Con Cưng - Sữa/Dinh dưỡng trẻ em]: Sản phẩm "${prod.name}" (${prod.id}) quảng cáo sữa dưới 24 tháng hoặc dinh dưỡng dưới 6 tháng.`);
      hasError = true;
    }
  }
});

// 2. Quét dữ liệu Blogs
blogs.forEach((blog) => {
  const contentLower = blog.contentMd.toLowerCase();
  const titleLower = blog.title.toLowerCase();

  // Kiểm tra so sánh tiêu cực giữa các sàn
  const negativePhrases = ["lừa đảo", "tệ nhất", "lừa gạt", "kém nhất"];
  negativePhrases.forEach((phrase) => {
    if (contentLower.includes(`shopee ${phrase}`) || contentLower.includes(`lazada ${phrase}`) || contentLower.includes(`tiki ${phrase}`)) {
      console.error(`❌ Vi phạm [Lazada/Tiki - So sánh tiêu cực]: Bài viết "${blog.title}" (${blog.slug}) chứa cụm từ so sánh tiêu cực "${phrase}".`);
      hasError = true;
    }
  });

  // Kiểm tra quy tắc Con Cưng trong bài viết nếu bài viết liên quan đến Con Cưng
  const isRelatedToConCung = blog.tags.some(tag => tag.toLowerCase() === "con cưng") || contentLower.includes("con cưng");
  if (isRelatedToConCung) {
    if (titleLower.includes("rẻ") || titleLower.includes("siêu rẻ") || contentLower.includes("rẻ ") || contentLower.includes("siêu rẻ")) {
      console.error(`❌ Vi phạm [Con Cưng - Bài viết từ cấm]: Bài viết "${blog.title}" (${blog.slug}) chứa từ "rẻ" hoặc "siêu rẻ" liên quan đến Con Cưng.`);
      hasError = true;
    }
  }

  // Kiểm tra quy tắc vị trí đặt nút Affiliate an toàn (chất cấm/thu hồi mỹ phẩm)
  const isDangerousOrBanned = titleLower.includes("chất cấm") || 
                              titleLower.includes("thu hồi") || 
                              titleLower.includes("kem trộn") || 
                              titleLower.includes("corticoid") ||
                              contentLower.includes("thu hồi toàn quốc");
  if (isDangerousOrBanned && blog.relatedProductIds && blog.relatedProductIds.length > 0) {
    console.error(`❌ Vi phạm [BA Spec - Đặt nút Affiliate không an toàn]: Bài viết về chất cấm/thu hồi mỹ phẩm "${blog.title}" (${blog.slug}) không được phép chứa sản phẩm tiếp thị liên kết.`);
    hasError = true;
  }
});

if (hasError) {
  console.error("❌ Quét chất lượng dữ liệu: THẤT BẠI. Vui lòng sửa lại dữ liệu trước khi build.");
  process.exit(1);
} else {
  console.log("✅ Quét chất lượng dữ liệu tiếp thị liên kết: THÀNH CÔNG. Không phát hiện vi phạm.");
}
