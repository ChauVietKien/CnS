require("dotenv").config();
const express = require("express");
const routes = require("./src/routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

app.use(
  cors({
    credentials: true,
    origin: process.env.URL_FE || "http://localhost:3000",
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

async function syncDataToTrie() {
  try {
    // Lấy danh sách tên môn học (subject)
    const posts = await prisma.tutor_post.findMany({
      select: { subject: true },
    });

    for (const post of posts) {
      if (post.subject) {
        // Nạp vào C++ dưới dạng chữ thường để search không phân biệt hoa thường
        await fetch(
          `http://127.0.0.1:8081/insert?word=${encodeURIComponent(post.subject.toLowerCase())}`,
          { method: "POST" },
        );
      }
    }
    console.log(
      `[Trie] Đã nạp ${posts.length} môn học từ Tutor_post vào C++ Trie`,
    );
  } catch (err) {
    console.warn("[Trie] Lỗi đồng bộ:", err.message);
  }
}

// Gọi hàm này ngay sau khi kết nối DB / app.listen
syncDataToTrie();

app.get("/api/search", async (req, res) => {
  try {
    const keyword = (req.query.q || "").trim().toLowerCase();
    if (!keyword) {
      return res.json({ success: true, data: [] });
    }

    // 1. Hỏi C++ lấy danh sách subject khớp tiền tố
    const cppRes = await fetch(
      `http://127.0.0.1:8081/search?q=${encodeURIComponent(keyword)}`,
    );
    const matchedSubjects = await cppRes.json(); // Ví dụ: ["lập trình python"]

    if (matchedSubjects.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // 2. Tìm bài đăng trong DB có subject nằm trong danh sách C++ trả về
    const results = await prisma.tutor_post.findMany({
      where: {
        subject: {
          in: matchedSubjects,
          mode: "insensitive", // Tìm không phân biệt hoa thường
        },
      },
      include: {
        tutor: true, // Kèm thông tin gia sư nếu cần hiển thị
      },
    });

    return res.json({ success: true, data: results });
  } catch (error) {
    console.error("Lỗi Search API:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 1. Nạp dữ liệu vào BST (Đảm bảo lấy đúng khóa chính id hoặc post_id)
async function syncPostsToBST() {
  try {
    const allPosts = await prisma.tutor_post.findMany();

    for (const post of allPosts) {
      const postId = post.id ?? post.post_id; // Phòng trường hợp bảng dùng post_id
      const params = new URLSearchParams({
        id: String(postId || ""),
        subject: post.subject || "",
        classId: String(post.Class || ""),
        mode: String(post.method || ""),
        price: String(post.price || 0),
        address: post.address || "",
      });

      await fetch(`http://127.0.0.1:8081/add-post?${params.toString()}`, {
        method: "POST",
      });
    }

    console.log(
      `[BST] Đã nạp thành công ${allPosts.length} bài đăng vào cây BST C++`,
    );
  } catch (err) {
    console.error("[BST] Lỗi nạp dữ liệu ban đầu:", err.message);
  }
}

syncPostsToBST();

// 2. API Filter: C++ lọc qua BST -> Prisma lấy full data kèm tutor
app.get("/api/filter-post", async (req, res) => {
  try {
    // Extract query parameters with defaults
    const { classId = "", mode = "", maxPrice = "", province = "" } = req.query;

    // Determine if user provided any filter criteria
    const hasFilter = Boolean(classId || mode || maxPrice || province);

    // Build query parameters for C++ (include defaults; set maxPrice to high value if not provided)
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId.trim());
    if (mode) params.append('mode', mode.trim());
    if (maxPrice) {
      params.append('maxPrice', maxPrice.trim());
    } else {
      params.append('maxPrice', '10000000');
    }
    if (province) params.append('province', province.trim());
    const queryString = params.toString();

    let matchedIds = [];

    if (hasFilter) {
      try {
        const cppRes = await fetch(
          `http://127.0.0.1:8081/filter?${queryString}`,
        );
        const rawText = await cppRes.text();
        if (rawText) {
          const cppResult = JSON.parse(rawText);
          matchedIds = (cppResult.data || []).map((item) => item.id);
        }
      } catch (err) {
        console.warn("[BST] Lỗi gọi C++:", err.message);
      }
    }

    // Logic truy vấn Prisma:
    // - Nếu có lọc: lấy đúng bài có ID C++ trả về (kể cả mảng rỗng [] nếu không khớp)
    // - Nếu không chọn bộ lọc nào: lấy toàn bộ bài đăng
    // Build Prisma where clause combining C++ IDs (if any) and optional filters
    const prismaWhere = {};
    if (hasFilter && matchedIds.length) {
      prismaWhere.id = { in: matchedIds };
    }
    if (classId) prismaWhere.Class = { equals: classId, mode: 'insensitive' };
    if (mode) prismaWhere.method = { equals: mode, mode: 'insensitive' };
    if (province) prismaWhere.address = { contains: province, mode: 'insensitive' };
    if (maxPrice) prismaWhere.price = { lte: Number(maxPrice) };

    const resultsRaw = await prisma.tutor_post.findMany({
      where: prismaWhere,
      include: { tutor: true },
    });

    // Apply price filter (<= maxPrice) if maxPrice is provided
    const results = maxPrice && maxPrice.trim()
      ? resultsRaw.filter((post) => Number(post.price) <= Number(maxPrice))
      : resultsRaw;

    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Lỗi Filter API:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});
routes(app);

app.listen(5000, () => console.log("Run on port 5000!"));
