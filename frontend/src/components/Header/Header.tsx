"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  GraduationCap,
  Users,
  School,
  Archive,
  CircleUser,
  FolderKanban,
  BadgeCheckIcon,
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  LogIn,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as UserService from "@/services/UserService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Header = () => {
  const router = useRouter();
  const { user, setUser } = useUser();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => UserService.getDetailUser(userId!).then((res) => res.data),
    enabled: !!userId,
  });

  const handleSelectProfile = () => {
    router.push("/signin");
  };

  const handleSelectCourse = () => {
    router.push("/course");
  };

  const handleBack = () => {
    router.push("/");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const handleManage = () => {
    router.push("/qlkh");
  };

  const logoutMutation = useMutation({
    mutationFn: () => UserService.logoutUser(),
    onSuccess: () => {
      queryClient.clear();
      if (user) setUser(null);
      router.push("/signin");
    },
    onError: (err) => console.log("error", err),
  });

  const displayName =
    currentUser?.name || currentUser?.email || user?.name || "Tài khoản";

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-[#edf3ee]/95 backdrop-blur-md border-b border-[#d5e2d7] shadow-2xs px-4 sm:px-8 flex items-center justify-between transition-colors">
      {/* 1. Logo bên trái */}
      <div
        className="flex items-center gap-2.5 cursor-pointer shrink-0"
        onClick={handleBack}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="logo"
            height={36}
            width={36}
            className="rounded-lg object-contain"
          />
          <span className="font-bold text-lg text-emerald-950 tracking-tight hidden sm:inline-block">
            CnS Tutor
          </span>
        </Link>
      </div>

      {/* 2. Menu trung tâm sắc thái xanh rêu thanh lịch */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="flex items-center gap-1">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-slate-700 hover:text-emerald-950 font-medium text-sm px-3.5 py-2 rounded-lg hover:bg-[#dfebe1]/80 transition-colors">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="size-4 text-emerald-700/80" />
                Home
              </span>
            </NavigationMenuTrigger>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-slate-700 hover:text-emerald-950 font-medium text-sm px-3.5 py-2 rounded-lg hover:bg-[#dfebe1]/80 transition-colors">
              <span className="flex items-center gap-1.5">
                <BookOpen className="size-4 text-emerald-700/80" />
                Subjects
              </span>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="p-2 bg-white rounded-xl shadow-md border border-slate-200/80 min-w-44">
              <ul className="space-y-1">
                <ListItem href="/#math" title="Toán học">
                  Đại số, Hình học các cấp
                </ListItem>
                <ListItem href="/#physics" title="Vật lý">
                  Cơ học, Quang học, Điện từ
                </ListItem>
                <ListItem href="/#chemistry" title="Hóa học">
                  Hóa vô cơ và hữu cơ
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-slate-700 hover:text-emerald-950 font-medium text-sm px-3.5 py-2 rounded-lg hover:bg-[#dfebe1]/80 transition-colors">
              <span className="flex items-center gap-1.5">
                <Users className="size-4 text-emerald-700/80" />
                Tutors
              </span>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="p-2 bg-white rounded-xl shadow-md border border-slate-200/80 min-w-44">
              <ul className="space-y-1">
                <ListItem href="/#tutor-primary" title="Tiểu học">
                  Gia sư rèn chữ, Toán, Tiếng Việt
                </ListItem>
                <ListItem href="/#tutor-middle" title="THCS">
                  Gia sư lớp 6 đến lớp 9
                </ListItem>
                <ListItem href="/#tutor-high" title="THPT">
                  Gia sư lớp 10, 11, 12 & Luyện thi
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-slate-700 hover:text-emerald-950 font-medium text-sm px-3.5 py-2 rounded-lg hover:bg-[#dfebe1]/80 transition-colors">
              <span className="flex items-center gap-1.5">
                <School className="size-4 text-emerald-700/80" />
                School
              </span>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="p-2 bg-white rounded-xl shadow-md border border-slate-200/80 min-w-44">
              <ul className="space-y-1">
                <ListItem href="/#primary" title="Trường Tiểu học">
                  Chương trình phổ thông
                </ListItem>
                <ListItem href="/#middle" title="Trường THCS">
                  Chương trình nâng cao
                </ListItem>
                <ListItem href="/#high" title="Trường THPT">
                  Chương trình chuyên & luyện thi
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* 3. Hành động người dùng bên phải */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Nút Khóa học */}
        <button
          onClick={handleSelectCourse}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-[#dfebe1]/80 hover:text-emerald-950 transition-colors cursor-pointer"
        >
          <Archive className="size-4 text-emerald-700/80" />
          <span>Khóa học</span>
        </button>

        {/* User Dropdown hoặc Nút Đăng nhập */}
        {!user ? (
          <button
            onClick={handleSelectProfile}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-900/90 hover:bg-emerald-950 text-white text-sm font-medium transition-colors shadow-2xs cursor-pointer"
          >
            <LogIn className="size-4" />
            <span>Đăng nhập</span>
          </button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#d0ded2] bg-white/95 hover:bg-white text-sm font-medium text-slate-800 shadow-2xs transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/30"
                >
                  <div className="size-6 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    {displayName?.[0]?.toUpperCase() || (
                      <CircleUser className="size-4" />
                    )}
                  </div>
                  <span className="max-w-[120px] truncate">{displayName}</span>
                </button>
              }
            />
            <DropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={8}
              className="w-52 p-1.5 bg-white rounded-xl shadow-lg border border-slate-200 z-50"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={handleProfile}
                  className="flex items-center gap-2 px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  <BadgeCheckIcon className="size-4 text-emerald-700" />
                  <span>Thông tin cá nhân</span>
                </DropdownMenuItem>

                {(currentUser?.role?.toLowerCase() === "tutor" ||
                  user?.role?.toLowerCase() === "tutor" ||
                  currentUser?.role?.toLowerCase() === "admin" ||
                  user?.role?.toLowerCase() === "admin") && (
                  <DropdownMenuItem
                    onClick={handleManage}
                    className="flex items-center gap-2 px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer"
                  >
                    <FolderKanban className="size-4 text-emerald-700" />
                    <span>Quản lí khóa học</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem className="flex items-center gap-2 px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <CreditCardIcon className="size-4 text-slate-400" />
                  <span>Quản lí tài chính</span>
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-2 px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <BellIcon className="size-4 text-slate-400" />
                  <span>Thông báo</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1 border-slate-100" />

              <DropdownMenuItem
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="flex items-center gap-2 px-2.5 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
              >
                <LogOutIcon className="size-4 text-rose-500" />
                <span>
                  {logoutMutation?.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <Link
            href={href}
            className="block p-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex flex-col gap-0.5 text-xs">
              <div className="font-semibold text-slate-800">{title}</div>
              <div className="line-clamp-1 text-slate-500">{children}</div>
            </div>
          </Link>
        }
      />
    </li>
  );
}

export default Header;
