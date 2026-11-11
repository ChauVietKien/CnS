"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as ApplicationService from "@/services/ApplicationService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Laptop,
  Loader2,
  MapPin,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface schedules {
  id?: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface Tutor {
  name?: string;
}

interface post {
  id?: string;
  subject?: string;
  Class?: string;
  tutor?: Tutor;
  method?: string;
  price?: string | number;
  address?: string;
  schedules?: schedules[];
}

export interface course {
  id: string;
  postId?: string;
  subject?: string;
  format?: string;
  tutor_name?: string;
  class?: string;
  schedule?: schedules[];
  post?: post;
}

export function BlockComponent({ courseInfo }: { courseInfo: course }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const infoPost = courseInfo?.post;
  const infoTutor = courseInfo?.post?.tutor;
  const tkb: schedules[] =
    infoPost?.schedules && infoPost.schedules.length > 0
      ? infoPost.schedules
      : courseInfo?.schedule || [];

  const subject = infoPost?.subject || courseInfo?.subject || "Khóa học";
  const grade = infoPost?.Class || courseInfo?.class || "Lớp học";
  const tutorName = infoTutor?.name || courseInfo?.tutor_name || "Gia sư";
  const method = infoPost?.method || courseInfo?.format || "Offline";
  const isOnline = method.toLowerCase() === "online";
  const address =
    infoPost?.address ||
    (isOnline ? "Học trực tuyến" : "Chưa cập nhật địa chỉ");
  const price = infoPost?.price || "Thỏa thuận";

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return await ApplicationService.deleteApplication(id);
    },
    onMutate: () => {
      setIsDeleting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["id"] });
    },
    onError: () => {
      alert("Hủy đăng ký thất bại, vui lòng thử lại sau.");
      setIsDeleting(false);
    },
  });

  const handleCancel = () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đăng ký khóa học này không?")) {
      cancelMutation.mutate(courseInfo.id);
    }
  };

  const handleSeeMore = () => {
    const targetPostId = infoPost?.id || courseInfo?.postId;
    if (targetPostId) {
      router.push(`/seemore/${targetPostId}`);
    } else {
      router.push("/");
    }
  };

  return (
    <Card className="overflow-hidden border border-slate-200/90 bg-white shadow-xs hover:shadow-md transition-all duration-200">
      {/* Header Card */}
      <CardHeader className="p-4 sm:p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">
              {subject}
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-2 py-0.5 font-medium"
            >
              {grade}
            </Badge>
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1 text-xs px-2 py-0.5 font-medium">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              Đã đăng ký
            </Badge>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-base sm:text-lg font-bold text-emerald-600">
              {price}
            </span>
          </div>
        </div>
      </CardHeader>

      {/* Body Card */}
      <CardContent className="px-4 sm:px-5 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-3">
          {/* Cột 1: Thông tin gia sư & Hình thức / Địa điểm */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-slate-700">
              <User className="size-4 text-slate-400 shrink-0" />
              <span>
                Gia sư:{" "}
                <span className="font-semibold text-slate-900">{tutorName}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              {isOnline ? (
                <Laptop className="size-4 text-slate-400 shrink-0" />
              ) : (
                <MapPin className="size-4 text-slate-400 shrink-0" />
              )}
              <span>
                Hình thức:{" "}
                <span className="font-medium text-slate-900">{method}</span>
              </span>
            </div>

            <div className="flex items-start gap-2 text-slate-600">
              <MapPin className="size-4 text-slate-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">
                Địa điểm:{" "}
                <span className="text-slate-800">{address}</span>
              </span>
            </div>
          </div>

          {/* Cột 2: Thời khóa biểu */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Calendar className="size-4 text-slate-400 shrink-0" />
              <span>Thời khóa biểu:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {Array.isArray(tkb) && tkb.length > 0 ? (
                tkb.map((item, index) => (
                  <span
                    key={item.id || index}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200/70"
                  >
                    <Clock className="size-3 text-slate-400" />
                    <span>
                      {item.day}: {item.startTime} - {item.endTime}
                    </span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">
                  Lịch học linh hoạt
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer Card */}
      <CardFooter className="px-4 sm:px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 mt-2">
        <span className="text-xs text-slate-600">
          Mã đăng ký: #{courseInfo?.id}
        </span>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isDeleting}
            className="h-8 text-xs font-medium text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
          >
            {isDeleting ? (
              <Loader2 className="size-3.5 animate-spin mr-1" />
            ) : (
              <Trash2 className="size-3.5 mr-1" />
            )}
            Hủy đăng ký
          </Button>

          <Button
            size="sm"
            onClick={handleSeeMore}
            className="h-8 text-xs font-medium bg-slate-900 text-white hover:bg-slate-800"
          >
            <ExternalLink className="size-3.5 mr-1" />
            Xem chi tiết
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
