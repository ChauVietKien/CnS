"use client";

import { BlockComponent } from "@/components/BlockComponent/BlockComponent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import * as ApplicationService from "@/services/ApplicationService";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, GraduationCap, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CoursePage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const router = useRouter();

  const { data: blockList, isPending } = useQuery({
    queryKey: ["id", userId],
    queryFn: async () => {
      const res = await ApplicationService.getApplication(userId!);
      return res.data || [];
    },
    enabled: !!userId,
  });

  const courses = Array.isArray(blockList) ? blockList : [];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <GraduationCap className="size-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Khóa học của tôi
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Quản lý và theo dõi các khóa học bạn đã đăng ký tham gia
            </p>
          </div>

          {user && (
            <Badge
              variant="secondary"
              className="px-3 py-1.5 text-xs font-semibold self-start sm:self-auto bg-slate-100 text-slate-700"
            >
              {isPending ? "Đang tải..." : `${courses.length} khóa học`}
            </Badge>
          )}
        </div>

        {/* Content Section */}
        {!user ? (
          /* Chưa đăng nhập */
          <div className="bg-white rounded-xl border border-slate-200/80 p-10 text-center space-y-4 shadow-xs">
            <div className="mx-auto size-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <LogIn className="size-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">
                Vui lòng đăng nhập
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Bạn cần đăng nhập vào tài khoản để xem các khóa học đã đăng ký.
              </p>
            </div>
            <Button
              onClick={() => router.push("/signin")}
              className="bg-slate-900 text-white hover:bg-slate-800"
            >
              Đăng nhập ngay
            </Button>
          </div>
        ) : isPending ? (
          /* Loading Skeleton */
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 animate-pulse shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="h-6 w-48 bg-slate-200 rounded" />
                  <div className="h-6 w-24 bg-slate-200 rounded" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <div className="h-4 w-36 bg-slate-100 rounded" />
                    <div className="h-4 w-44 bg-slate-100 rounded" />
                  </div>
                  <div className="h-10 w-full bg-slate-100 rounded" />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <div className="h-8 w-24 bg-slate-200 rounded" />
                  <div className="h-8 w-28 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
            <div className="mx-auto size-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <BookOpen className="size-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-800">
                Chưa có khóa học nào
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Bạn chưa đăng ký khóa học nào. Hãy khám phá và tìm gia sư phù hợp
                để bắt đầu học tập ngay hôm nay!
              </p>
            </div>
            <Link href="/" className="inline-block pt-2">
              <Button className="bg-slate-900 text-white hover:bg-slate-800 px-5">
                Khám phá khóa học
              </Button>
            </Link>
          </div>
        ) : (
          /* Danh sách khóa học */
          <div className="space-y-4">
            {courses.map((item: any) => (
              <BlockComponent key={item.id} courseInfo={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
