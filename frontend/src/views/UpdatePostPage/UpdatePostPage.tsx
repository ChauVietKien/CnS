"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import * as PostService from "@/services/PostService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Laptop,
  Loader2,
  MapPin,
  Plus,
  ShieldAlert,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// ─── Schema ──────────────────────────────────────────────────────────────────
const formSchema = z
  .object({
    userId: z.string().min(1, "Vui lòng đăng nhập"),
    tutorname: z.string().min(2, "Vui lòng nhập tên người dạy"),
    field: z.string().min(2, "Vui lòng nhập hoặc chọn lĩnh vực"),
    subject: z.string().min(2, "Vui lòng nhập môn dạy"),
    Class: z.string().min(1, "Vui lòng chọn hoặc nhập lớp"),
    price: z.string().min(1, "Vui lòng nhập học phí"),
    method: z.enum(["Online", "Offline"]),
    address: z.string().optional(),
    description: z
      .string()
      .min(10, "Mô tả khóa học ít nhất 10 ký tự")
      .max(500, "Mô tả tối đa 500 ký tự"),
    proof: z.string().optional(),
    schedules: z
      .array(
        z.object({
          day: z.string(),
          startTime: z.string(),
          endTime: z.string(),
        })
      )
      .min(1, "Vui lòng chọn ít nhất 1 buổi học trong tuần"),
  })
  .refine(
    (data) => {
      if (
        data.method === "Offline" &&
        (!data.address || data.address.trim() === "")
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Hình thức Offline yêu cầu nhập địa chỉ cụ thể",
      path: ["address"],
    }
  )
  .refine(
    (data) => data.schedules.every((s) => s.startTime < s.endTime),
    {
      message: "Giờ bắt đầu phải sớm hơn giờ kết thúc",
      path: ["schedules"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

const DAYS_OF_WEEK = [
  { label: "T2", value: "T2" },
  { label: "T3", value: "T3" },
  { label: "T4", value: "T4" },
  { label: "T5", value: "T5" },
  { label: "T6", value: "T6" },
  { label: "T7", value: "T7" },
  { label: "CN", value: "CN" },
];

const TIME_OPTIONS = Array.from({ length: 17 }, (_, i) => {
  const h = (i + 6).toString().padStart(2, "0");
  return `${h}:00`;
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Main Component ───────────────────────────────────────────────────────────
const UpdatePostPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const editId = searchParams.get("id");
  const isEditing = !!editId;

  const { user } = useUser();
  const userId = user?.id;
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: userId || "",
      tutorname: user?.name || "",
      field: "",
      subject: "",
      Class: "Lớp 12",
      price: "250000",
      method: "Online",
      address: "Online qua Zoom / Google Meet",
      description: "",
      proof: "",
      schedules: [
        { day: "T2", startTime: "18:00", endTime: "20:00" },
        { day: "T4", startTime: "18:00", endTime: "20:00" },
      ],
    },
  });

  // Load existing post if edit mode
  const { data: existingPost } = useQuery({
    queryKey: ["post", editId],
    queryFn: async () => {
      if (!editId) return null;
      const res = await PostService.getPost(editId);
      return res?.data || res;
    },
    enabled: !!editId,
  });

  useEffect(() => {
    if (existingPost) {
      form.reset({
        userId: userId || "",
        tutorname:
          existingPost.tutorname ||
          existingPost.tutor?.name ||
          user?.name ||
          "",
        field: existingPost.field || "",
        subject: existingPost.subject || "",
        Class: existingPost.Class || "Lớp 12",
        price: String(existingPost.price || "250000"),
        method:
          existingPost.method?.toLowerCase() === "offline"
            ? "Offline"
            : "Online",
        address:
          existingPost.address ||
          (existingPost.method?.toLowerCase() === "offline"
            ? ""
            : "Online qua Zoom / Google Meet"),
        description: existingPost.description || "",
        proof: existingPost.proof || "",
        schedules:
          existingPost.schedules && existingPost.schedules.length > 0
            ? existingPost.schedules
            : [{ day: "T2", startTime: "18:00", endTime: "20:00" }],
      });
    } else if (user) {
      if (!form.getValues("userId")) form.setValue("userId", user.id);
      if (!form.getValues("tutorname"))
        form.setValue("tutorname", user.name || "");
    }
  }, [existingPost, user, form, userId]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedules",
  });

  const selectedMethod = form.watch("method");

  const handleMethodChange = (val: "Online" | "Offline") => {
    form.setValue("method", val, { shouldValidate: true });
    if (val === "Online") {
      form.setValue("address", "Online qua Zoom / Google Meet", {
        shouldValidate: true,
      });
    } else {
      if (form.getValues("address")?.includes("Online")) {
        form.setValue("address", "", { shouldValidate: true });
      }
    }
  };

  const toggleDay = (dayVal: string) => {
    const idx = fields.findIndex((item) => item.day === dayVal);
    if (idx >= 0) {
      if (fields.length <= 1) {
        toast.warning("Cần giữ lại ít nhất 1 buổi học");
        return;
      }
      remove(idx);
    } else {
      append({ day: dayVal, startTime: "18:00", endTime: "20:00" });
    }
  };

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      setFileError(null);
      if (newFiles.length === 0) return;

      const oversized = newFiles.find((f) => f.size > MAX_FILE_SIZE);
      if (oversized) {
        setFileError(`"${oversized.name}" quá 10MB.`);
        return;
      }

      setFiles((prev) => {
        const merged = [...prev, ...newFiles];
        form.setValue("proof", merged.map((f) => f.name).join(", "), {
          shouldValidate: true,
        });
        return merged;
      });
    },
    [form]
  );

  const removeFile = useCallback(
    (idx: number) => {
      setFiles((prev) => {
        const updated = prev.filter((_, i) => i !== idx);
        form.setValue(
          "proof",
          updated.length > 0 ? updated.map((f) => f.name).join(", ") : ""
        );
        return updated;
      });
    },
    [form]
  );

  const postMutation = useMutation({
    mutationFn: async (payload: FormValues) => {
      if (isEditing && editId) {
        return await PostService.updatePost(editId, JSON.stringify(payload));
      } else {
        return await PostService.createPost(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postsByUser"] });
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["post"] });
      toast.success(
        isEditing
          ? "Cập nhật khóa học thành công!"
          : "Đăng ký khóa học thành công!"
      );
      router.push("/qlkh");
    },
    onError: () => {
      toast.error("Lưu khóa học thất bại. Vui lòng thử lại!");
    },
  });

  const onSubmit = (values: FormValues) => {
    postMutation.mutate(values);
  };

  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50/50">
        <Loader2 className="size-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  // Learner Role Guard
  if (user && user.role?.toLowerCase() === "learner") {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 py-12 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full p-6 text-center space-y-4 border border-zinc-200/90 shadow-2xs bg-white rounded-2xl">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
            <ShieldAlert className="size-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-zinc-800">Chỉ dành cho Gia sư</h2>
            <p className="text-xs text-zinc-500">
              Trang đăng khóa học chỉ áp dụng cho tài khoản Gia sư.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={() => router.push("/profile")}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-50 text-xs font-medium h-9 rounded-lg"
            >
              Nâng cấp lên Gia sư tại Profile
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full text-xs h-9 rounded-lg text-zinc-600"
            >
              Về trang chủ
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 py-6 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Single Unified Card */}
        <Card className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs p-5 sm:p-7 space-y-6">
          {/* Header row */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#edf3ee] text-[#2f4f38] border border-[#d5e2d7] rounded-xl shrink-0">
                <GraduationCap className="size-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-zinc-800 tracking-tight">
                  {isEditing ? "Cập nhật khóa học" : "Đăng ký khóa học mới"}
                </h1>
                <p className="text-xs text-zinc-500">
                  Điền các thông tin để tạo lớp và tìm kiếm học viên
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-xs text-zinc-500 hover:text-zinc-800 gap-1 px-2.5 h-8 rounded-lg cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Quay lại</span>
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Row 1: Tên gia sư & Lĩnh vực */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-zinc-700">
                  Họ và tên gia sư <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="tutorname"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Nguyễn Văn A"
                      className="h-9 text-xs border-zinc-200 focus-visible:ring-zinc-700 rounded-lg"
                    />
                  )}
                />
                {form.formState.errors.tutorname && (
                  <p className="text-[11px] text-red-500">
                    {form.formState.errors.tutorname.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-zinc-700">
                  Lĩnh vực <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="field"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="vd: Tự nhiên, Ngoại ngữ..."
                      className="h-9 text-xs border-zinc-200 focus-visible:ring-zinc-700 rounded-lg"
                    />
                  )}
                />
                {form.formState.errors.field && (
                  <p className="text-[11px] text-red-500">
                    {form.formState.errors.field.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: Môn học, Khối lớp & Học phí */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-zinc-700">
                  Tên môn dạy <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="subject"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="vd: Toán 12, Tiếng Anh..."
                      className="h-9 text-xs border-zinc-200 focus-visible:ring-zinc-700 rounded-lg"
                    />
                  )}
                />
                {form.formState.errors.subject && (
                  <p className="text-[11px] text-red-500">
                    {form.formState.errors.subject.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-zinc-700">
                  Khối lớp <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="Class"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-9 text-xs border-zinc-200 focus-visible:ring-zinc-700 rounded-lg">
                        <SelectValue placeholder="Chọn lớp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lớp 10">Lớp 10</SelectItem>
                        <SelectItem value="Lớp 11">Lớp 11</SelectItem>
                        <SelectItem value="Lớp 12">Lớp 12</SelectItem>
                        <SelectItem value="Đại học">Đại học</SelectItem>
                        <SelectItem value="Mọi lứa tuổi">Mọi lứa tuổi</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.Class && (
                  <p className="text-[11px] text-red-500">
                    {form.formState.errors.Class.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-zinc-700">
                  Học phí / tháng <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Controller
                    name="price"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        step="10000"
                        placeholder="250000"
                        className="h-9 text-xs pr-14 border-zinc-200 focus-visible:ring-zinc-700 rounded-lg font-medium"
                      />
                    )}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-zinc-400">
                    đ/tháng
                  </span>
                </div>
                {form.formState.errors.price && (
                  <p className="text-[11px] text-red-500">
                    {form.formState.errors.price.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Hình thức & Địa chỉ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              <div className="space-y-1 sm:col-span-1">
                <Label className="text-xs font-semibold text-zinc-700">
                  Hình thức <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100/80 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleMethodChange("Online")}
                    className={cn(
                      "h-7 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 cursor-pointer",
                      selectedMethod === "Online"
                        ? "bg-white text-zinc-900 shadow-2xs font-semibold"
                        : "text-zinc-500 hover:text-zinc-800"
                    )}
                  >
                    <Laptop className="size-3" />
                    <span>Online</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMethodChange("Offline")}
                    className={cn(
                      "h-7 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1 cursor-pointer",
                      selectedMethod === "Offline"
                        ? "bg-white text-zinc-900 shadow-2xs font-semibold"
                        : "text-zinc-500 hover:text-zinc-800"
                    )}
                  >
                    <MapPin className="size-3" />
                    <span>Offline</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs font-semibold text-zinc-700">
                  {selectedMethod === "Online" ? "Nền tảng học trực tuyến" : "Địa chỉ dạy học"}{" "}
                  {selectedMethod === "Offline" && <span className="text-red-500">*</span>}
                </Label>
                <Controller
                  name="address"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={
                        selectedMethod === "Online"
                          ? "Online qua Zoom / Google Meet"
                          : "Số nhà, tên đường, quận/huyện..."
                      }
                      className="h-9 text-xs border-zinc-200 focus-visible:ring-zinc-700 rounded-lg"
                    />
                  )}
                />
                {form.formState.errors.address && (
                  <p className="text-[11px] text-red-500">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>
            </div>

            {/* Row 4: Lịch học trong tuần */}
            <div className="space-y-2 pt-1 border-t border-zinc-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <Label className="text-xs font-semibold text-zinc-700">
                  Lịch học ({fields.length} buổi):
                </Label>
                <div className="flex items-center gap-1">
                  {DAYS_OF_WEEK.map((d) => {
                    const isSelected = fields.some((item) => item.day === d.value);
                    return (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => toggleDay(d.value)}
                        className={cn(
                          "size-7 rounded-md text-[11px] font-medium transition-all cursor-pointer border",
                          isSelected
                            ? "bg-zinc-800 text-zinc-50 border-zinc-800 shadow-2xs"
                            : "bg-white hover:bg-zinc-50 text-zinc-600 border-zinc-200"
                        )}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time pickers list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fields.map((fieldItem, index) => (
                  <div
                    key={fieldItem.id}
                    className="flex items-center justify-between px-3 py-1.5 bg-zinc-50 border border-zinc-200/90 rounded-lg"
                  >
                    <Badge
                      variant="outline"
                      className="bg-[#edf3ee] text-[#2f4f38] border-[#d5e2d7] font-bold text-xs px-2 py-0.5 rounded"
                    >
                      {fieldItem.day}
                    </Badge>

                    <div className="flex items-center gap-1.5">
                      <Controller
                        control={form.control}
                        name={`schedules.${index}.startTime`}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-[78px] h-7 text-xs bg-white rounded border-zinc-200 px-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map((t) => (
                                <SelectItem key={t} value={t} className="text-xs">
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />

                      <span className="text-xs text-zinc-400">→</span>

                      <Controller
                        control={form.control}
                        name={`schedules.${index}.endTime`}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-[78px] h-7 text-xs bg-white rounded border-zinc-200 px-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map((t) => (
                                <SelectItem key={t} value={t} className="text-xs">
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="size-7 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {form.formState.errors.schedules?.message && (
                <p className="text-[11px] text-red-500">
                  {form.formState.errors.schedules.message}
                </p>
              )}
            </div>

            {/* Row 5: Giới thiệu khóa học */}
            <div className="space-y-1 pt-1 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-zinc-700">
                  Mô tả khóa học <span className="text-red-500">*</span>
                </Label>
                <span className="text-[11px] text-zinc-400">
                  {form.watch("description")?.length || 0}/500 ký tự
                </span>
              </div>
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Mô tả tóm tắt nội dung chương trình, phương pháp giảng dạy và mục tiêu đầu ra..."
                    rows={3}
                    maxLength={500}
                    className="text-xs leading-relaxed border-zinc-200 focus-visible:ring-zinc-700 rounded-lg resize-none"
                  />
                )}
              />
              {form.formState.errors.description && (
                <p className="text-[11px] text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Row 6: Minh chứng đính kèm (Compact strip) */}
            <div className="space-y-1.5 pt-1 border-t border-zinc-100">
              <Label className="text-xs font-semibold text-zinc-700">
                Minh chứng chuyên môn / Bằng cấp (nếu có)
              </Label>
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  handleFiles(Array.from(e.dataTransfer.files));
                }}
                className={cn(
                  "border border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors flex items-center justify-center gap-2",
                  isDragOver
                    ? "border-emerald-600 bg-emerald-50/40"
                    : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                )}
              >
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) =>
                    handleFiles(
                      e.target.files ? Array.from(e.target.files) : []
                    )
                  }
                />
                <UploadCloud className="size-4 text-zinc-500" />
                <span className="text-xs text-zinc-600 font-medium">
                  Kéo thả hoặc nhấn để chọn file ảnh/PDF
                </span>
                <span className="text-[11px] text-zinc-400">(&lt; 10MB)</span>
              </div>

              {fileError && <p className="text-[11px] text-red-500">{fileError}</p>}

              {files.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {files.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-700"
                    >
                      <FileText className="size-3 text-zinc-500" />
                      <span className="truncate max-w-[150px] font-medium text-[11px]">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        ({formatFileSize(file.size)})
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(idx);
                        }}
                        className="text-zinc-400 hover:text-red-600 p-0.5 rounded cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Row 7: Action Footer */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  form.reset();
                  setFiles([]);
                }}
                className="h-9 px-4 text-xs text-zinc-600 border-zinc-200 hover:bg-zinc-100 rounded-lg cursor-pointer"
              >
                Đặt lại
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={postMutation.isPending}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-50 text-xs font-semibold h-9 px-5 rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                {postMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    <span>{isEditing ? "Lưu thay đổi" : "Đăng khóa học"}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default UpdatePostPage;
