"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/context/UserContext";
import * as PostService from "@/services/PostService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  GraduationCap,
  Loader2,
  MapPin,
  Plus,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface PostItem {
  id: string;
  subject: string;
  Class: string;
  method: string;
  price: number | string;
  address?: string;
  schedules?: Schedule[];
  postname?: string;
}

const QLKHPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isTutor =
    user?.role?.toLowerCase() === "tutor" ||
    user?.role?.toLowerCase() === "admin";

  const { data: postsRes, isPending } = useQuery<{ data: PostItem[] }>({
    queryKey: ["tutor-posts", userId],
    queryFn: () => PostService.getPostsByUser(userId!),
    enabled: !!userId && isTutor,
  });

  const posts = postsRes?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => PostService.deletePost(id),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-posts", userId] });
      setDeletingId(null);
    },
    onError: () => {
      alert("Xóa khóa học không thành công. Vui lòng thử lại!");
      setDeletingId(null);
    },
  });

  const handleDelete = (id: string, subject: string) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa bài đăng khóa học "${subject}"?`)
    ) {
      deleteMutation.mutate(id);
    }
  };

  // Nếu là Learner -> Không có quyền truy cập trang này
  if (!isTutor) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 py-12 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center bg-white border border-zinc-200/90 rounded-2xl shadow-xs space-y-4">
          <div className="size-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-zinc-800">
              Chỉ dành cho Gia sư
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Trang Quản lý khóa học chỉ dành cho tài khoản có vai trò Gia sư. Tài khoản của bạn hiện là Học viên.
            </p>
          </div>
          <Button
            onClick={() => router.push("/profile")}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-50 text-xs font-medium h-9 rounded-lg"
          >
            Đến trang cá nhân để nâng cấp
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200/90 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
                <GraduationCap className="size-5" />
              </div>
              <h1 className="text-xl font-bold text-zinc-800 tracking-tight">
                Quản lý khóa học gia sư
              </h1>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Theo dõi và quản lý toàn bộ các bài đăng tuyển học viên của bạn
            </p>
          </div>

          <Button
            onClick={() => router.push("/updatepost")}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-50 text-xs font-medium h-9 px-4 rounded-lg flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Đăng khóa học mới</span>
          </Button>
        </div>

        {/* Content Table / Empty State */}
        <Card className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs overflow-hidden">
          <CardHeader className="p-5 pb-3 border-b border-zinc-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-zinc-800">
                Danh sách bài đăng hiện tại
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Tổng cộng {posts.length} khóa học đang được hiển thị
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isPending ? (
              /* Loading Skeleton */
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-zinc-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : posts.length === 0 ? (
              /* Empty state */
              <div className="p-12 text-center space-y-3">
                <BookOpen className="size-10 text-zinc-300 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-zinc-800">
                    Bạn chưa có bài đăng khóa học nào
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Hãy tạo bài đăng đầu tiên để học viên có thể tìm thấy và đăng ký học cùng bạn.
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/updatepost")}
                  className="mt-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-50 text-xs font-medium h-8.5 px-4 rounded-lg"
                >
                  <Plus className="size-3.5 mr-1" />
                  Đăng bài ngay
                </Button>
              </div>
            ) : (
              /* Danh sách bài đăng thực tế */
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-zinc-50/70 border-b border-zinc-100">
                    <TableRow>
                      <TableHead className="w-12 text-center text-xs font-semibold text-zinc-600">
                        STT
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-zinc-600">
                        Môn học
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-zinc-600">
                        Lớp
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-zinc-600">
                        Hình thức
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-zinc-600">
                        Học phí
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-zinc-600">
                        Lịch học
                      </TableHead>
                      <TableHead className="text-right text-xs font-semibold text-zinc-600 pr-5">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post, index) => {
                      const isOnline = post.method?.toLowerCase() === "online";
                      const priceText =
                        typeof post.price === "number"
                          ? `${post.price.toLocaleString("vi-VN")} đ`
                          : `${post.price} đ`;
                      const schedulesText =
                        Array.isArray(post.schedules) && post.schedules.length > 0
                          ? post.schedules
                              .map((s) => `${s.day} (${s.startTime})`)
                              .join(", ")
                          : "Linh hoạt";

                      return (
                        <TableRow
                          key={post.id || index}
                          className="hover:bg-zinc-50/60 transition-colors"
                        >
                          <TableCell className="text-center text-xs font-medium text-zinc-500">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="font-semibold text-zinc-800 text-sm block">
                                {post.subject}
                              </span>
                              {post.postname && (
                                <span className="text-xs text-zinc-400 truncate max-w-xs block">
                                  {post.postname}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-[11px] px-2 py-0.5 rounded-md font-medium text-zinc-700 bg-zinc-50 border-zinc-200"
                            >
                              {post.Class || "Lớp học"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs font-medium text-zinc-700">
                              {post.method || (isOnline ? "Online" : "Offline")}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs font-bold text-zinc-800">
                              {priceText}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-zinc-500 truncate max-w-[180px] block">
                              {schedulesText}
                            </span>
                          </TableCell>
                          <TableCell className="text-right pr-5">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/seemore/${post.id}`)}
                                className="h-7 px-2.5 text-xs text-zinc-700 hover:bg-zinc-100 rounded-md"
                              >
                                <ExternalLink className="size-3 mr-1" />
                                Xem
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDelete(post.id, post.subject)
                                }
                                disabled={deletingId === post.id}
                                className="h-7 px-2.5 text-xs text-rose-600 hover:bg-rose-50 border-rose-200 rounded-md"
                              >
                                {deletingId === post.id ? (
                                  <Loader2 className="size-3 animate-spin" />
                                ) : (
                                  <Trash2 className="size-3 mr-1" />
                                )}
                                Xóa
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QLKHPage;
