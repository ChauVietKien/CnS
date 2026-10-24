"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useUser } from "@/context/UserContext";
import * as StudentProfile from "@/services/StudentProfileService";
import * as TutorProfile from "@/services/TutorProfileService";
import { CreateTutorData } from "@/services/TutorProfileService";
import * as UserService from "@/services/UserService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import style from "./style.module.css";

const items = [
  { label: "Learner", value: "Learner" },
  { label: "Tutor", value: "Tutor" },
];

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  phone: string;
  description: string;
}

const ProfilePage = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const userId = user?.id;
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => UserService.getDetailUser(userId!).then((res) => res.data),
    enabled: !!userId,
  });

  const { register, handleSubmit, reset, watch, setValue } = useForm<User>({
    values: {
      id: currentUser?.id,
      name: currentUser?.name ?? "",
      email: currentUser?.email ?? "",
      age: currentUser?.age ?? 0,
      role: currentUser?.role ?? "",
      phone: currentUser?.phone ?? "",
      description: currentUser?.description ?? "",
    },
  });
  // tutor
  // learner
  const selectedRole = watch("role");

  const updateMutation = useMutation({
    mutationFn: async (data: User) => {
      if (selectedRole === "Learner") {
        const res = await StudentProfile.createStudentProfile(data);
        return res.data;
      } else {
        // API riêng cho Tutor (hoặc UserService.updateTutor...)
        const res = await TutorProfile.createTutor(
          data as unknown as CreateTutorData,
        );
        return res.data;
      }
    },
    onSuccess: (updatedData) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.add({
        type: "success",
        description: "Chỉnh sửa thông tin thành công!",
      });
      reset(updatedData);
      setIsEditing(false);
    },
  });

  const onSubmit = (data: User) => {
    if (!user?.id) return;
    updateMutation.mutate(data);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  return (
    <div className={style.mainbl}>
      <div className={style.header}>
        <img
          src="https://bizweb.dktcdn.net/100/255/283/themes/588445/assets/cate_2_2.jpg?1786698433736"
          alt="anhdd"
          className="w-20 h-20 rounded-full"
        />
        <h3 className="font-bold text-lg">{currentUser?.name}</h3>
      </div>
      <div className={style.body}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {(selectedRole === "Tutor" || selectedRole === "Learner") && (
            <>
              <label className="text-lg">Name</label>
              {!isEditing ? (
                <p className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-lg font-bold">
                  {currentUser?.name ?? "Người dùng"}
                </p>
              ) : (
                <Input {...register("name")} className="rounded-md" />
              )}
            </>
          )}
          <label className="text-lg">Email</label>
          {!isEditing ? (
            <p className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-lg font-bold">
              {currentUser?.email ?? "Người dùng"}
            </p>
          ) : (
            <Input {...register("email")} className="rounded-md" />
          )}
          <label className="text-lg">Vai trò</label>
          {!isEditing ? (
            <p className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-lg font-bold">
              {currentUser?.role ?? "Người dùng"}
            </p>
          ) : (
            <Select
              value={selectedRole}
              onValueChange={(val) => setValue("role", val!)}
            >
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Vai trò</SelectLabel>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          {(selectedRole === "Tutor" || selectedRole === "Learner") && (
            <>
              <label className="text-lg">Tuổi</label>
              {!isEditing ? (
                <p className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-lg font-bold">
                  {currentUser?.age ?? "Người dùng"}
                </p>
              ) : (
                <Input {...register("age")} className="rounded-md" />
              )}
            </>
          )}
          {(selectedRole === "Tutor" || selectedRole === "Learner") && (
            <>
              <label className="text-lg">Số điện thoại</label>
              {!isEditing ? (
                <p className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-lg font-bold">
                  {currentUser?.phone ?? "Người dùng"}
                </p>
              ) : (
                <Input {...register("phone")} className="rounded-md" />
              )}
            </>
          )}
          {selectedRole === "Tutor" && (
            <>
              <label className="text-lg">Mô tả</label>
              {!isEditing ? (
                <p className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-lg font-bold">
                  {currentUser?.description ?? "Người dùng"}
                </p>
              ) : (
                <Input {...register("description")} className="rounded-md" />
              )}
            </>
          )}
          <div className={style.button}>
            {!isEditing ? (
              <Button
                className="w-45 h-9 bg-gray-800"
                type="button"
                onClick={handleEdit}
              >
                Chỉnh sửa
              </Button>
            ) : (
              <Button
                className="w-45 h-9 bg-red-500"
                type="button"
                onClick={handleCancel}
              >
                Hủy
              </Button>
            )}
            <Button type="submit" className="w-45 h-9">
              Lưu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
