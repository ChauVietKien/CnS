"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";
import * as ApplicationService from "@/services/ApplicationService";
import * as PostService from "@/services/PostService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Laptop,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  phone?: string;
  user?: UserInfo;
}

interface PostItem {
  id?: string;
  subject: string;
  Class: string;
  method: string;
  postname?: string;
  address?: string;
  price: number | string;
  description?: string;
  proof?: string;
  tutor?: Tutor;
  schedules?: Schedule[];
}

const ApplicationPage = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const postId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    className: "",
    note: "",
  });

  const [formError, setFormError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Tải thông tin bài đăng gia sư
  const { data: post, isPending } = useQuery<PostItem>({
    queryKey: ["postId", postId],
    queryFn: () => PostService.getPost(postId!).then((res) => res.data),
    enabled: !!postId,
  });

  // Tự động điền thông tin nếu đã đăng nhập
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  // Gợi ý lớp học từ bài đăng
  useEffect(() => {
    if (post?.Class) {
      setFormData((prev) => ({
        ...prev,
        className: prev.className || post.Class,
      }));
    }
  }, [post]);

  const registerMutation = useMutation({
    mutationFn: () => {
      return ApplicationService.createApplication({
        postId: postId!,
        name: formData.name.trim(),
        email: formData.email.trim(),
        className: formData.className.trim(),
        phone: formData.phone.trim(),
        note: formData.note.trim(),
      });
    },
    onSuccess: () => {
      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["id"] });
      // Điều hướng về trang danh sách khóa học sau 1.2s
      setTimeout(() => {
        router.push("/course");
      }, 1200);
    },
    onError: () => {
      setFormError("Đăng ký không thành công. Vui lòng kiểm tra lại thông tin!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Vui lòng nhập họ và tên của bạn.");
      return;
    }
    if (!formData.phone.trim()) {
      setFormError("Vui lòng nhập số điện thoại liên hệ.");
      return;
    }
    if (!formData.email.trim()) {
      setFormError("Vui lòng nhập địa chỉ email.");
      return;
    }

    registerMutation.mutate();
  };

  const isOnline = post?.method?.toLowerCase() === "online";
  const priceDisplay =
    typeof post?.price === "number"
      ? `${post.price.toLocaleString("vi-VN")} đ/buổi`
      : post?.price || "Thỏa thuận";

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-50 via-slate-50/80 to-indigo-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Nút quay lại & Tiêu đề */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60 gap-1.5 transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Quay lại</span>
          </Button>
          <Badge
            variant="outline"
            className="text-xs bg-indigo-50/80 text-indigo-700 border-indigo-200/80 font-medium px-3 py-1 shadow-xs"
          >
            Đăng ký học
          </Badge>
        </div>

        {isPending ? (
          /* Trạng thái Skeleton Loading */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="h-6 w-3/4 bg-slate-200 rounded" />
              <div className="h-24 bg-slate-100 rounded" />
              <div className="h-16 bg-slate-100 rounded" />
            </div>
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="h-6 w-1/2 bg-slate-200 rounded" />
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-10 bg-slate-100 rounded" />
            </div>
          </div>
        ) : !post ? (
          /* Trạng thái không tìm thấy bài đăng */
          <Card className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
            <h2 className="text-lg font-bold text-slate-800">
              Không tìm thấy thông tin khóa học
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Khóa học không tồn tại hoặc đã bị gỡ bỏ.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
            >
              Về trang chủ
            </Button>
          </Card>
        ) : (
          /* Bố cục 2 cột nhận diện sắc nét */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Cột trái: Tóm tắt khóa học mang dáng dấp Thẻ học tập */}
            <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
              <Card className="relative overflow-hidden bg-white border border-slate-200/90 rounded-2xl shadow-[0_4px_24px_-4px_rgba(79,70,229,0.07)]">
                {/* Dải gradient nhận diện thương hiệu ở đỉnh thẻ */}
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400" />

                <CardHeader className="pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-200/90 text-xs px-2.5 py-0.5 font-semibold">
                      {post.Class || "Lớp học"}
                    </Badge>
                    <span className="text-xs font-mono font-medium text-slate-400">
                      ID: #{postId}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 pt-1 tracking-tight">
                    {post.subject}
                  </CardTitle>
                  {post.postname && (
                    <CardDescription className="text-xs text-slate-500">
                      {post.postname}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="space-y-4 pt-4 text-sm">
                  {/* Gia sư */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                    <div className="size-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <User className="size-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs text-slate-500">Gia sư phụ trách</p>
                      <p className="font-semibold text-slate-900 truncate">
                        {post.tutor?.name || "Gia sư"}
                      </p>
                      {post.tutor?.phone && (
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="size-3 text-indigo-500" />
                          <span>{post.tutor.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Hình thức & Địa chỉ */}
                  <div className="space-y-2 text-slate-700">
                    <div className="flex items-center gap-2">
                      {isOnline ? (
                        <Laptop className="size-4 text-indigo-500 shrink-0" />
                      ) : (
                        <MapPin className="size-4 text-indigo-500 shrink-0" />
                      )}
                      <span>
                        Hình thức:{" "}
                        <strong className="text-slate-900">{post.method}</strong>
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="size-4 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-600">
                        Địa chỉ:{" "}
                        <span className="text-slate-900 font-medium">
                          {post.address || (isOnline ? "Học trực tuyến" : "Chưa cập nhật")}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Lịch học */}
                  {Array.isArray(post.schedules) && post.schedules.length > 0 && (
                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <Calendar className="size-3.5 text-indigo-500" />
                        <span>Lịch học dự kiến:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {post.schedules.map((item, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-slate-50 text-slate-700 border border-slate-200/70"
                          >
                            <Clock className="size-3 text-indigo-400" />
                            <span>
                              {item.day}: {item.startTime} - {item.endTime}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Học phí dạng Thẻ học phí cách điệu */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/40 border border-indigo-100 flex items-center justify-between shadow-xs">
                    <div>
                      <span className="text-xs font-medium text-slate-500 block">
                        Học phí khóa học
                      </span>
                      <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                        <Sparkles className="size-3" /> Cam kết chất lượng
                      </span>
                    </div>
                    <span className="text-base sm:text-lg font-black text-indigo-700 tracking-tight">
                      {priceDisplay}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Cam kết bảo mật */}
              <div className="flex items-center gap-2 text-xs text-slate-500 px-1">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                <span>Thông tin được bảo mật và chuyển trực tiếp tới gia sư.</span>
              </div>
            </div>

            {/* Cột phải: Form thông tin học viên */}
            <div className="lg:col-span-7">
              <Card className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_4px_24px_-4px_rgba(79,70,229,0.06)]">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">
                    Thông tin học viên đăng ký
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Vui lòng điền thông tin để gia sư liên hệ xác nhận và xếp lớp.
                  </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    {/* Thông báo lỗi nếu có */}
                    {formError && (
                      <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                        {formError}
                      </div>
                    )}

                    {/* Thông báo thành công */}
                    {isSuccess && (
                      <div className="p-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-600" />
                        <span>Đăng ký thành công! Đang chuyển hướng tới Khóa học của tôi...</span>
                      </div>
                    )}

                    {/* Họ và tên */}
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                        Họ và tên học viên <span className="text-indigo-600">*</span>
                      </Label>
                      <div className="relative group">
                        <User className="size-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors absolute left-3 top-2.5 pointer-events-none" />
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, name: e.target.value }))
                          }
                          placeholder="Ví dụ: Nguyễn Văn A"
                          className="pl-9 h-9.5 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 focus-visible:border-indigo-600 focus-visible:ring-3 focus-visible:ring-indigo-500/15 transition-all rounded-lg"
                          required
                          disabled={registerMutation.isPending || isSuccess}
                        />
                      </div>
                    </div>

                    {/* Email & Số điện thoại */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                          Email liên hệ <span className="text-indigo-600">*</span>
                        </Label>
                        <div className="relative group">
                          <Mail className="size-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors absolute left-3 top-2.5 pointer-events-none" />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, email: e.target.value }))
                            }
                            placeholder="email@example.com"
                            className="pl-9 h-9.5 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 focus-visible:border-indigo-600 focus-visible:ring-3 focus-visible:ring-indigo-500/15 transition-all rounded-lg"
                            required
                            disabled={registerMutation.isPending || isSuccess}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                          Số điện thoại <span className="text-indigo-600">*</span>
                        </Label>
                        <div className="relative group">
                          <Phone className="size-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors absolute left-3 top-2.5 pointer-events-none" />
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, phone: e.target.value }))
                            }
                            placeholder="0912 345 678"
                            className="pl-9 h-9.5 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 focus-visible:border-indigo-600 focus-visible:ring-3 focus-visible:ring-indigo-500/15 transition-all rounded-lg"
                            required
                            disabled={registerMutation.isPending || isSuccess}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Lớp học */}
                    <div className="space-y-1.5">
                      <Label htmlFor="className" className="text-xs font-semibold text-slate-700">
                        Lớp học hiện tại
                      </Label>
                      <div className="relative group">
                        <GraduationCap className="size-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors absolute left-3 top-2.5 pointer-events-none" />
                        <Input
                          id="className"
                          value={formData.className}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, className: e.target.value }))
                          }
                          placeholder="Ví dụ: Lớp 12, Đại học..."
                          className="pl-9 h-9.5 text-sm bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 focus-visible:border-indigo-600 focus-visible:ring-3 focus-visible:ring-indigo-500/15 transition-all rounded-lg"
                          disabled={registerMutation.isPending || isSuccess}
                        />
                      </div>
                    </div>

                    {/* Ghi chú / Lời nhắn cho gia sư */}
                    <div className="space-y-1.5">
                      <Label htmlFor="note" className="text-xs font-semibold text-slate-700">
                        Ghi chú hoặc mong muốn gửi gia sư
                      </Label>
                      <Textarea
                        id="note"
                        rows={3}
                        value={formData.note}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, note: e.target.value }))
                        }
                        placeholder="Nêu trình độ hiện tại, mục tiêu học tập hoặc thời gian mong muốn..."
                        className="text-sm min-h-20 bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 focus-visible:border-indigo-600 focus-visible:ring-3 focus-visible:ring-indigo-500/15 transition-all rounded-lg"
                        disabled={registerMutation.isPending || isSuccess}
                      />
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 pb-6 px-6 flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/40">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData({
                          name: user?.name || "",
                          email: user?.email || "",
                          phone: "",
                          className: post.Class || "",
                          note: "",
                        })
                      }
                      disabled={registerMutation.isPending || isSuccess}
                      className="text-xs text-slate-600 border-slate-200 hover:bg-slate-100 rounded-lg"
                    >
                      Đặt lại form
                    </Button>

                    <Button
                      type="submit"
                      disabled={registerMutation.isPending || isSuccess}
                      className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold px-6 h-9.5 min-w-36 rounded-lg shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin mr-1.5" />
                          <span>Đang gửi...</span>
                        </>
                      ) : isSuccess ? (
                        <>
                          <CheckCircle2 className="size-3.5 mr-1.5 text-white" />
                          <span>Thành công!</span>
                        </>
                      ) : (
                        <span>Xác nhận đăng ký</span>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationPage;
