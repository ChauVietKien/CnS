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

routes(app);

app.listen(5000, () => console.log("Run on port 5000!"));
