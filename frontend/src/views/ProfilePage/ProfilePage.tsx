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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useUser } from "@/context/UserContext";
import * as StudentProfile from "@/services/StudentProfileService";
import * as TutorProfile from "@/services/TutorProfileService";
import { CreateTutorData } from "@/services/TutorProfileService";
import * as UserService from "@/services/UserService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface UserProfileData {
  id?: string;
  name: string;
  email: string;
  age: number;
  role: string;
  phone: string;
  description: string;
}

const ProfilePage = () => {
  const { user, setUser } = useUser();
  const userId = user?.id;
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => UserService.getDetailUser(userId!).then((res) => res.data),
    enabled: !!userId,
  });

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<UserProfileData>({
      values: {
        id: currentUser?.id || userId,
        name: currentUser?.name ?? user?.name ?? "",
        email: currentUser?.email ?? user?.email ?? "",
        age: currentUser?.age ?? (user?.age ? Number(user.age) : 20),
        role: currentUser?.role ?? user?.role ?? "Learner",
        phone: currentUser?.phone ?? "",
        description: currentUser?.description ?? "",
      },
    });

  const selectedRole = watch("role");

  // Quy tắc: Nếu đã là Tutor thì không thể hạ cấp về Learner
  const originalRole = (currentUser?.role || user?.role || "").toLowerCase();
  const isAlreadyTutor = originalRole === "tutor";

  const updateMutation = useMutation({
    mutationFn: async (data: UserProfileData) => {
      // 1. Cập nhật thông tin người dùng
      await UserService.updateUser(userId!, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        age: data.age,
        role: data.role.toLowerCase(),
      });

      // 2. Cập nhật hồ sơ chi tiết theo role
      if (data.role.toLowerCase() === "tutor") {
        await TutorProfile.createTutor(data as unknown as CreateTutorData);
      } else {
        await StudentProfile.createStudentProfile(data);
      }
      return data;
    },
    onSuccess: (updatedData) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Cập nhật UserContext đồng bộ cho Header
      if (user) {
        setUser({
          ...user,
          name: updatedData.name,
          email: updatedData.email,
          role: updatedData.role.toLowerCase(),
          age: String(updatedData.age),
        });
      }
      toast.add({
        type: "success",
        description: "Cập nhật thông tin thành công!",
      });
      reset(updatedData);
      setIsEditing(false);
    },
    onError: () => {
      toast.add({
        type: "error",
        description: "Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại!",
      });
    },
  });

  const onSubmit = (data: UserProfileData) => {
    if (!userId) return;
    updateMutation.mutate(data);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const isTutorRole = selectedRole?.toLowerCase() === "tutor";

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Profile Card */}
        <Card className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-[#edf3ee] to-[#dfebe1] border-b border-[#d5e2d7]" />
          <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-12">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="size-20 rounded-full border-4 border-white bg-zinc-800 text-zinc-50 flex items-center justify-center text-2xl font-bold shadow-sm">
                {(currentUser?.name || user?.name || "U")[0].toUpperCase()}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="text-xl font-bold text-zinc-800 tracking-tight">
                    {currentUser?.name || user?.name || "Người dùng"}
                  </h1>
                  <Badge
                    variant="outline"
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      isAlreadyTutor
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-blue-50 text-blue-800 border-blue-200"
                    }`}
                  >
                    {isAlreadyTutor ? "Gia sư (Tutor)" : "Học viên (Learner)"}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500">
                  {currentUser?.email || user?.email}
                </p>
              </div>
            </div>

            {!isEditing && (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-50 text-xs font-medium h-9 px-5 rounded-lg shadow-2xs"
              >
                Chỉnh sửa hồ sơ
              </Button>
            )}
          </div>
        </Card>

        {/* Form Chi tiết */}
        <Card className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs">
          <CardHeader className="pb-3 border-b border-zinc-100">
            <CardTitle className="text-base font-bold text-zinc-800">
              Thông tin chi tiết
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Xem và cập nhật thông tin cá nhân và vai trò tài khoản
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="p-6 space-y-4 text-xs">
              {/* Họ và tên */}
              <div className="space-y-1.5">
                <Label className="font-semibold text-zinc-700">Họ và tên</Label>
                {!isEditing ? (
                  <p className="flex items-center h-9 px-3 rounded-lg bg-zinc-50 border border-zinc-200/80 text-sm font-medium text-zinc-800">
                    {currentUser?.name || "Chưa cập nhật"}
                  </p>
                ) : (
                  <Input
                    {...register("name")}
                    placeholder="Nhập họ và tên"
                    className="h-9 text-sm rounded-lg"
                    required
                  />
                )}
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-1.5">
                <Label className="font-semibold text-zinc-700">Địa chỉ Email</Label>
                <p className="flex items-center h-9 px-3 rounded-lg bg-zinc-50 border border-zinc-200/80 text-sm text-zinc-600">
                  {currentUser?.email || user?.email}
                </p>
              </div>

              {/* Vai trò (Role) - Quy tắc: Đã là Tutor thì không thể về Learner */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold text-zinc-700">Vai trò tài khoản</Label>
                  {isAlreadyTutor && (
                    <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <ShieldCheck className="size-3.5" />
                      Tài khoản Gia sư cố định
                    </span>
                  )}
                </div>

                {!isEditing ? (
                  <p className="flex items-center h-9 px-3 rounded-lg bg-zinc-50 border border-zinc-200/80 text-sm font-semibold text-zinc-800">
                    {isAlreadyTutor ? "Gia sư (Tutor)" : "Học viên (Learner)"}
                  </p>
                ) : isAlreadyTutor ? (
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 space-y-1">
                    <p className="text-sm font-semibold text-zinc-800">
                      Gia sư (Tutor)
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Bạn đã là Gia sư. Tài khoản Gia sư không thể chuyển lại thành Học viên.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Select
                      value={selectedRole}
                      onValueChange={(val) => setValue("role", val!)}
                    >
                      <SelectTrigger className="w-full h-9 text-sm rounded-lg">
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-xl shadow-lg border border-zinc-200">
                        <SelectItem value="Learner">Học viên (Learner)</SelectItem>
                        <SelectItem value="Tutor">Gia sư (Tutor) - Nâng cấp tài khoản</SelectItem>
                      </SelectContent>
                    </Select>
                    {isTutorRole && (
                      <p className="text-[11px] text-emerald-700 flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        Lưu ý: Sau khi nâng cấp thành Gia sư, bạn sẽ không thể quay lại làm Học viên.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Tuổi & Số điện thoại */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-semibold text-zinc-700">Tuổi</Label>
                  {!isEditing ? (
                    <p className="flex items-center h-9 px-3 rounded-lg bg-zinc-50 border border-zinc-200/80 text-sm text-zinc-800">
                      {currentUser?.age || "Chưa cập nhật"}
                    </p>
                  ) : (
                    <Input
                      type="number"
                      {...register("age", { valueAsNumber: true })}
                      placeholder="Nhập tuổi"
                      className="h-9 text-sm rounded-lg"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="font-semibold text-zinc-700">Số điện thoại</Label>
                  {!isEditing ? (
                    <p className="flex items-center h-9 px-3 rounded-lg bg-zinc-50 border border-zinc-200/80 text-sm text-zinc-800">
                      {currentUser?.phone || "Chưa cập nhật"}
                    </p>
                  ) : (
                    <Input
                      {...register("phone")}
                      placeholder="0912 345 678"
                      className="h-9 text-sm rounded-lg"
                    />
                  )}
                </div>
              </div>

              {/* Mô tả / Bio (Dành cho Tutor) */}
              {(isTutorRole || isAlreadyTutor) && (
                <div className="space-y-1.5">
                  <Label className="font-semibold text-zinc-700">
                    Mô tả kinh nghiệm / Giới thiệu gia sư
                  </Label>
                  {!isEditing ? (
                    <p className="p-3 min-h-16 rounded-lg bg-zinc-50 border border-zinc-200/80 text-sm text-zinc-700 leading-relaxed">
                      {currentUser?.description || "Chưa cập nhật phần giới thiệu."}
                    </p>
                  ) : (
                    <Textarea
                      {...register("description")}
                      placeholder="Giới thiệu về trường lớp, kinh nghiệm gia sư và chuyên môn của bạn..."
                      className="text-sm min-h-20 rounded-lg"
                    />
                  )}
                </div>
              )}
            </CardContent>

            {isEditing && (
              <CardFooter className="p-4 px-6 border-t border-zinc-100 bg-zinc-50/40 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-9 px-4 text-xs font-medium text-zinc-700 rounded-lg"
                  disabled={updateMutation.isPending}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="h-9 px-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-50 text-xs font-medium rounded-lg shadow-2xs"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin mr-1.5" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <span>Lưu thay đổi</span>
                  )}
                </Button>
              </CardFooter>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
