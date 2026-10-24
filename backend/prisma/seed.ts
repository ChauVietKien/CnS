import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, Status } from "@prisma/client";
import bcrypt from "bcrypt";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

// 2 hình ảnh dùng riêng cho trường 'proof' của từng bài đăng
const POST_IMAGES = [
  "https://bizweb.dktcdn.net/100/255/283/themes/588445/assets/cate_2_2.jpg?1786698433736",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvGRh9vl3E6Mkvxb-0epKdeQLYaU-wg5AyDvOcR82QgyCxCBikvh7617wZ&s=10",
];

async function main() {
  console.log("Cleaning up existing data...");
  await prisma.schedule.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.application.deleteMany();
  await prisma.tutor_post.deleteMany();
  await prisma.tutor_profile.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("123456", 10);

  console.log("Creating single user and upgrading to Tutor...");
  const tutorUser = await prisma.user.create({
    data: {
      email: "tutor.master@tutor.com",
      password: hashedPassword,
      age: 26, // Bắt buộc điền vì schema yêu cầu trường age
      role: Role.tutor,
      tutorProfile: {
        create: {
          name: "Giảng viên Frontend",
          phone: "0911222333",
          description:
            "Chuyên gia phát triển Frontend với React, TypeScript và các kiến trúc hiện đại.",
        },
      },
    },
    include: { tutorProfile: true },
  });

  if (!tutorUser.tutorProfile) {
    throw new Error("Failed to create tutor profile");
  }

  const tutorProfileId = tutorUser.tutorProfile.id;

  console.log("Creating 12 Tutor Posts assigned with the 2 post images...");
  const postsData = [
    {
      subject: "Toán học",
      Class: "Lớp 12",
      description:
        "Luyện thi THPT Quốc gia môn Toán, nắm chắc kiến thức nền tảng và vận dụng cao 8+.",
      method: "Offline",
      price: 250000,
      address: "Hải Châu, Đà Nẵng",
      field: "Khoa học tự nhiên",
      schedule: {
        day: "Monday & Wednesday",
        startTime: "18:00",
        endTime: "20:00",
      },
    },
    {
      subject: "Tiếng Anh IELTS",
      Class: "Lớp 10 - 12",
      description:
        "Luyện thi IELTS 4 kỹ năng mục tiêu 6.5 - 7.5+, sửa bài Writing và Speaking chi tiết.",
      method: "Online",
      price: 350000,
      address: "Google Meet / Zoom",
      field: "Ngoại ngữ",
      schedule: {
        day: "Tuesday & Thursday",
        startTime: "19:00",
        endTime: "21:00",
      },
    },
    {
      subject: "Lập trình Web (React & TypeScript)",
      Class: "Đại học / Người đi làm",
      description:
        "Thực chiến xây dựng ứng dụng Frontend hiện đại với React, TypeScript, TanStack Query và form management.",
      method: "Online",
      price: 400000,
      address: "Discord / Google Meet",
      field: "Công nghệ thông tin",
      schedule: {
        day: "Saturday & Sunday",
        startTime: "14:00",
        endTime: "16:30",
      },
    },
    {
      subject: "Vật lý",
      Class: "Lớp 11",
      description:
        "Bổ trợ kiến thức Vật lý 11 chuyên sâu: Điện tích, dòng điện và cảm ứng điện từ.",
      method: "Offline",
      price: 200000,
      address: "Thanh Khê, Đà Nẵng",
      field: "Khoa học tự nhiên",
      schedule: {
        day: "Monday & Friday",
        startTime: "17:30",
        endTime: "19:30",
      },
    },
    {
      subject: "Hóa học",
      Class: "Lớp 10",
      description:
        "Lấy lại gốc Hóa học hữu cơ và vô cơ, phương pháp giải nhanh trắc nghiệm.",
      method: "Hybrid",
      price: 220000,
      address: "Sơn Trà, Đà Nẵng",
      field: "Khoa học tự nhiên",
      schedule: {
        day: "Wednesday & Friday",
        startTime: "18:00",
        endTime: "20:00",
      },
    },
    {
      subject: "Ngữ văn",
      Class: "Lớp 9",
      description:
        "Ôn thi chuyển cấp vào lớp 10 chuyên Văn, rèn kỹ năng nghị luận xã hội và văn học.",
      method: "Offline",
      price: 180000,
      address: "Cẩm Lệ, Đà Nẵng",
      field: "Khoa học xã hội",
      schedule: {
        day: "Tuesday & Saturday",
        startTime: "15:00",
        endTime: "17:00",
      },
    },
    {
      subject: "Tiếng Nhật JLPT N4 - N3",
      Class: "Mọi cấp độ",
      description:
        "Luyện từ vựng, ngữ pháp, đọc hiểu và nghe hiểu chuẩn bị cho kỳ thi JLPT.",
      method: "Online",
      price: 300000,
      address: "Zoom",
      field: "Ngoại ngữ",
      schedule: {
        day: "Monday, Wednesday & Friday",
        startTime: "20:00",
        endTime: "21:30",
      },
    },
    {
      subject: "Cấu trúc dữ liệu & Giải thuật",
      Class: "Đại học",
      description:
        "Nắm vững mảng, danh sách liên kết, cây, đồ thị và quy hoạch động bằng C++/Java.",
      method: "Online",
      price: 320000,
      address: "Google Meet",
      field: "Công nghệ thông tin",
      schedule: {
        day: "Thursday & Sunday",
        startTime: "19:30",
        endTime: "21:30",
      },
    },
    {
      subject: "Sinh học",
      Class: "Lớp 12",
      description:
        "Chuyên đề quy luật di truyền, biến dị và sinh thái học ôn thi khối B00.",
      method: "Offline",
      price: 240000,
      address: "Ngũ Hành Sơn, Đà Nẵng",
      field: "Khoa học tự nhiên",
      schedule: {
        day: "Tuesday & Thursday",
        startTime: "17:30",
        endTime: "19:30",
      },
    },
    {
      subject: "Tiếng Trung Giao Tiếp",
      Class: "Người mới bắt đầu",
      description:
        "Phát âm chuẩn Bắc Kinh, phản xạ giao tiếp chủ đề đời sống và thương mại HSK 1-4.",
      method: "Online",
      price: 260000,
      address: "Zoom",
      field: "Ngoại ngữ",
      schedule: {
        day: "Saturday & Sunday",
        startTime: "09:00",
        endTime: "11:00",
      },
    },
    {
      subject: "Piano & Nhạc lý cơ bản",
      Class: "Năng khiếu",
      description:
        "Hướng dẫn đọc bản nhạc, hợp âm đệm hát và luyện ngón Piano từ cơ bản đến nâng cao.",
      method: "Offline",
      price: 350000,
      address: "Hải Châu, Đà Nẵng",
      field: "Nghệ thuật",
      schedule: {
        day: "Saturday & Sunday",
        startTime: "16:00",
        endTime: "17:30",
      },
    },
    {
      subject: "Tin học văn phòng MOS",
      Class: "Sinh viên / Người đi làm",
      description:
        "Luyện thi chứng chỉ quốc tế MOS (Word, Excel, PowerPoint) cam kết đạt 900+ điểm.",
      method: "Online",
      price: 200000,
      address: "Google Meet",
      field: "Kỹ năng mềm",
      schedule: {
        day: "Wednesday & Saturday",
        startTime: "19:00",
        endTime: "21:00",
      },
    },
  ];

  for (let i = 0; i < postsData.length; i++) {
    const postItem = postsData[i];
    const postImage = POST_IMAGES[i % POST_IMAGES.length]; // Gắn luân phiên 2 ảnh cho 'proof'

    await prisma.tutor_post.create({
      data: {
        subject: postItem.subject,
        Class: postItem.Class,
        description: postItem.description,
        method: postItem.method,
        price: postItem.price,
        address: postItem.address,
        field: postItem.field,
        proof: postImage,
        tutorId: tutorProfileId,
        status: Status.approved,
        schedules: {
          create: [
            {
              day: postItem.schedule.day,
              startTime: postItem.schedule.startTime,
              endTime: postItem.schedule.endTime,
            },
          ],
        },
        evaluations: {
          create: [
            {
              tutorId: tutorProfileId,
              rating: 5,
              comment: `Bài giảng môn ${postItem.subject} rất chất lượng!`,
            },
          ],
        },
      },
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
