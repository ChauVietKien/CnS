"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, User, MapPin, Calendar, Sparkles, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface CardItem {
  id: string;
  subject?: string;
  title?: string;
  description?: string;
  proof?: string;
  price?: number | string;
  class?: string;
  Class?: string;
  method?: string;
  mode?: string;
  address?: string | null;
  schedule?: string;
  schedules?: Array<{ day: string; startTime: string; endTime: string }>;
  rating?: number;
  reviewCount?: number;
  tutor?: {
    id?: string | number;
    name?: string;
    avatar?: string;
    rating?: number;
    reviewCount?: number;
  };
  [key: string]: any;
}

export function CardImage({
  data,
  badgeType,
}: {
  data: CardItem;
  badgeType?: "featured" | "recent";
}) {
  const router = useRouter();

  const handleSeeMore = () => {
    router.push(`/seemore/${data.id}`);
  };

  const handleRegister = () => {
    router.push(`/register/${data.id}`);
  };

  const tutorName = data.tutor?.name || data.tutorName || "Gia sư";
  const rating = Number(data.rating ?? data.tutor?.rating ?? 5.0).toFixed(1);
  const reviewCount = data.reviewCount ?? data.tutor?.reviewCount ?? 0;
  const grade = data.class || data.Class || "Lớp 12";
  const mode = data.method || data.mode || "Offline";
  const proofImg =
    data.proof && data.proof.startsWith("http")
      ? data.proof
      : "https://bizweb.dktcdn.net/100/255/283/themes/588445/assets/cate_2_2.jpg?1786698433736";

  const priceText =
    typeof data.price === "number"
      ? `${data.price.toLocaleString("vi-VN")} đ/tháng`
      : data.price
      ? `${data.price} đ/tháng`
      : "Thỏa thuận";

  const scheduleText =
    Array.isArray(data.schedules) && data.schedules.length > 0
      ? data.schedules.map((s) => `${s.day} (${s.startTime})`).join(", ")
      : data.schedule || "Lịch học linh hoạt";

  return (
    <Card className="group relative mx-auto w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200/80 bg-white p-0 shadow-2xs transition-all duration-150 hover:border-zinc-300 hover:shadow-xs">
      {/* Thumbnail */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-zinc-100">
        <Image
          src={proofImg}
          alt={data.subject || "Khóa học"}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-103"
          unoptimized
        />

        {/* Badge nổi bật / Vừa xem */}
        {badgeType === "featured" && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-md bg-[#edf3ee]/95 text-[#2f4f38] border border-[#d5e2d7] px-2 py-0.5 text-[11px] font-semibold backdrop-blur-xs shadow-2xs">
            <Sparkles className="size-3 fill-[#2f4f38]" />
            <span>Gia sư tiêu biểu</span>
          </div>
        )}
        {badgeType === "recent" && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-md bg-white/95 text-zinc-700 border border-zinc-200/90 px-2 py-0.5 text-[11px] font-medium backdrop-blur-xs shadow-2xs">
            <Clock className="size-3 text-zinc-500" />
            <span>Vừa xem</span>
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <span className="rounded-md bg-zinc-900/70 backdrop-blur-xs px-2.5 py-0.5 text-xs font-medium text-zinc-100">
            {mode}
          </span>
          <span className="rounded-md bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-xs font-semibold text-zinc-800 border border-zinc-200/80 shadow-2xs">
            {grade}
          </span>
        </div>
      </div>

      {/* Thông tin khóa học - Chữ to hơn & khoảng cách khít */}
      <CardHeader className="p-3.5 pb-2 space-y-1.5">
        {/* Môn học + Giá tiền (to rõ) */}
        <div className="flex items-baseline justify-between gap-2">
          <CardTitle className="text-lg font-bold text-zinc-800 line-clamp-1 tracking-tight">
            {data.subject || data.title || "Khóa học"}
          </CardTitle>
          <span className="shrink-0 text-base font-extrabold text-zinc-800">
            {priceText}
          </span>
        </div>

        {/* Tên Gia sư + Đánh giá sao */}
        <div className="flex items-center justify-between text-sm pt-1 border-t border-zinc-100">
          <div className="flex items-center gap-1.5 font-medium text-zinc-700 truncate">
            <User className="size-4 text-zinc-400 shrink-0" />
            <span className="truncate">Gia sư: <span className="text-zinc-800 font-semibold">{tutorName}</span></span>
          </div>

          <div className="flex items-center gap-1 font-semibold text-amber-500 shrink-0">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="text-sm">{rating}</span>
            <span className="text-xs font-normal text-zinc-400">({reviewCount})</span>
          </div>
        </div>

        {/* Mô tả 2 dòng rõ ràng */}
        <p className="line-clamp-2 text-[13px] text-zinc-600 leading-snug">
          {data.description || "Khóa học chất lượng cao cùng gia sư tận tâm."}
        </p>

        {/* Địa chỉ & Lịch học */}
        <div className="space-y-0.5 text-xs text-zinc-500 pt-0.5">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="size-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">Địa chỉ: {data.address || "Đà Nẵng"}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="size-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">Lịch học: {scheduleText}</span>
          </div>
        </div>
      </CardHeader>

      {/* Nút hành động */}
      <CardFooter className="flex items-center gap-2 p-3.5 pt-1 border-t border-zinc-100 bg-zinc-50/40">
        <Button
          variant="outline"
          size="sm"
          className="h-9 flex-1 rounded-lg text-sm font-medium text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          onClick={handleSeeMore}
        >
          Chi tiết
        </Button>
        <Button
          size="sm"
          className="h-9 flex-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-zinc-50 transition-colors"
          onClick={handleRegister}
        >
          Đăng ký
        </Button>
      </CardFooter>
    </Card>
  );
}
