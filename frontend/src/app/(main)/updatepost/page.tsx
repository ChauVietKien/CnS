import UpdatePostPage from "@/views/UpdatePostPage/UpdatePostPage";
import { Suspense } from "react";

export const metadata = {
  title: "Đăng Khóa Học - CnS",
  description: "Tạo và cập nhật bài đăng khóa học gia sư",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-sm text-zinc-500">
          Đang tải dữ liệu khóa học...
        </div>
      }
    >
      <UpdatePostPage />
    </Suspense>
  );
}
