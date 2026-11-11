"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as PostService from "@/services/PostService";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Star,
  User,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface UserInfo {
  email: string;
}

interface Tutor {
  name: string;
  phone: string;
  user?: UserInfo;
  rating?: number;
  reviewCount?: number;
}

interface PostItem {
  id?: string;
  subject: string;
  Class: string;
  method: string;
  postname: string;
  proof: string;
  address: string;
  price: number | string;
  rating?: number;
  reviewCount?: number;
  description: string;
  tutor?: Tutor;
  schedules: Schedule[];
}

const SeeMorePage = () => {
  const params = useParams();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const { data: courseInfo, isPending } = useQuery<PostItem>({
    queryKey: ["postId", postId],
    queryFn: () => PostService.getPost(postId!).then((res) => res.data),
    enabled: !!postId,
  });

  const handleBack = () => {
    router.push("/");
  };

  const handleRegister = () => {
    router.push(`/register/${postId}`);
  };

  // Trạng thái tải
  if (isPending) {
    return (
      <div className="max-w-4xl mx-auto my-8 px-4 animate-pulse">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
          <div className="md:col-span-5 bg-slate-200 min-h-[260px]" />
          <div className="md:col-span-7 p-6 space-y-4">
            <div className="h-8 w-1/2 bg-slate-200 rounded" />
            <div className="h-4 w-1/3 bg-slate-200 rounded" />
            <div className="h-16 bg-slate-100 rounded" />
            <div className="h-6 w-1/4 bg-slate-200 rounded" />
            <div className="h-10 w-full bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Không tìm thấy khóa học
  if (!courseInfo || !courseInfo?.tutor) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
        <h2 className="text-lg font-bold text-slate-800">
          Không tìm thấy thông tin khóa học
        </h2>
        <Button onClick={handleBack} className="mt-4 bg-indigo-600 text-white">
          Quay lại trang chủ
        </Button>
      </div>
    );
  }

  const infoTutor = courseInfo.tutor;
  const tkb = Array.isArray(courseInfo.schedules) ? courseInfo.schedules : [];
  const rating = Number(courseInfo.rating ?? infoTutor.rating ?? 5.0).toFixed(1);
  const reviewCount = courseInfo.reviewCount ?? infoTutor.reviewCount ?? 0;

  const proofImg =
    courseInfo.proof && courseInfo.proof.startsWith("http")
      ? courseInfo.proof
      : "https://bizweb.dktcdn.net/100/255/283/themes/588445/assets/cate_2_2.jpg?1786698433736";

  const priceFormatted =
    typeof courseInfo.price === "number"
      ? `${courseInfo.price.toLocaleString("vi-VN")} đ/buổi`
      : courseInfo.price
      ? `${courseInfo.price} đ/buổi`
      : "Thỏa thuận";

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      {/* Nút quay lại nhỏ gọn trên đầu */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="mb-4 text-slate-600 hover:text-indigo-600 gap-1.5"
      >
        <ArrowLeft className="size-4" />
        <span>Quay lại trang chủ</span>
      </Button>

      {/* Một khối thống nhất theo bố cục gốc (Ảnh bên trái, Thông tin bên phải) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Cột trái: Ảnh đại diện */}
        <div className="relative md:col-span-5 min-h-[280px] md:min-h-full bg-slate-100">
          <Image
            src={proofImg}
            alt={courseInfo.subject || "Khóa học"}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* Cột phải: Thông tin liền mạch, không chia nhỏ thẻ */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header: Nhãn lớp & Môn học */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs px-2.5 py-0.5 font-medium">
                  {courseInfo.Class || "Lớp học"}
                </Badge>
                <Badge variant="outline" className="text-xs text-slate-600">
                  {courseInfo.method || "Offline"}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {courseInfo.subject}
              </h1>

              {/* Gia sư & Đánh giá sao */}
              <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <User className="size-4 text-slate-400" />
                  <span>Gia sư: {infoTutor.name}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="size-4 fill-amber-400" />
                  <span>{rating}</span>
                  <span className="text-xs font-normal text-slate-400">
                    ({reviewCount} đánh giá)
                  </span>
                </div>
              </div>
            </div>

            {/* Học phí nổi bật */}
            <div className="text-xl font-bold text-indigo-700">
              {priceFormatted}
            </div>

            {/* Mô tả khóa học */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {courseInfo.description ||
                "Khóa học được thiết kế bài bản, sát chương trình học, giúp học viên củng cố kiến thức và nâng cao tư duy giải bài tập."}
            </p>

            {/* Thông tin chi tiết: Địa điểm & Lịch học */}
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-start gap-2">
                <MapPin className="size-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Địa chỉ:{" "}
                  <strong className="text-slate-800">
                    {courseInfo.address ||
                      (courseInfo.method === "Online"
                        ? "Học trực tuyến"
                        : "Chưa cập nhật")}
                  </strong>
                </span>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="size-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-slate-700">Lịch học:</span>{" "}
                  {tkb.length > 0 ? (
                    <span className="text-slate-800">
                      {tkb
                        .map((s) => `${s.day} (${s.startTime} - ${s.endTime})`)
                        .join(", ")}
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">Thỏa thuận</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Nhóm nút hành động ở góc dưới */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="h-10 px-5 text-xs text-slate-700 rounded-lg"
            >
              Quay lại
            </Button>
            <Button
              onClick={handleRegister}
              className="h-10 px-6 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm shadow-indigo-600/20"
            >
              Đăng ký học
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeMorePage;
