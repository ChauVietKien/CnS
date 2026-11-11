"use client";

import { CardImage, CardItem } from "@/components/CardComponent/Cardcomponent";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import * as algorithmscpp from "@/services/algorithmscpp";
import * as PostService from "@/services/PostService";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Clock, Funnel, RotateCcw, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const frameworks = [9, 10, 11, 12, "snv1"] as const;

const framework = [
  "An Giang",
  "Bắc Ninh",
  "Bà Rịa - Vũng Tàu",
  "Bạc Liêu",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Cà Mau",
  "Cần Thơ",
  "Cao Bằng",
  "Đà Nẵng",
  "Đắk Lắk",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Nội",
  "Hải Phòng",
  "Hà Nam",
  "Hà Tĩnh",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Phú Thọ",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sơn La",
  "Sóc Trăng",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Thành phố Hồ Chí Minh",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
] as const;

interface TutorPost {
  id: string;
  subject: string;
  Class: string;
  description: string;
  method: string;
  price: string;
  address?: string | null;
  field: string;
  proof: string;
  tutorId: string;
}

const Home = () => {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [filterResults, setFilterResults] = useState<CardItem[] | null>(null);
  const [mode, setMode] = useState<"ONLINE" | "OFFLINE">("OFFLINE");
  const [price, setPrice] = useState<number[]>([200000]);
  const [province, setProvince] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const ratingOptions = [0, 1, 2, 3, 4, 5];
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<TutorPost[]>([]);

  const { data: currentPost, isPending } = useQuery<{ data: CardItem[] }>({
    queryKey: ["post"],
    queryFn: () => PostService.getAllPosts(),
  });

  const { data: featuredData } = useQuery<{ data: CardItem[] }>({
    queryKey: ["topRecommended"],
    queryFn: () => PostService.getTopRecommended(4),
  });

  const { data: recentData } = useQuery<{ data: CardItem[] }>({
    queryKey: ["recentlyViewed"],
    queryFn: () => PostService.getRecentlyViewed(4),
  });

  const posts: CardItem[] = currentPost?.data || [];
  const featuredPosts: CardItem[] = featuredData?.data || [];
  const recentPosts: CardItem[] = recentData?.data || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);
    setFilterResults(null);
    if (!val.trim()) setResults([]);
  };

  useEffect(() => {
    if (!keyword.trim()) return;

    const timer = setTimeout(async () => {
      const res = await algorithmscpp.getResSearch(keyword);
      setResults(res.data);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    const res = await algorithmscpp.getResSearch(keyword);
    setResults(res.data);
  };

  const handleFilter = async () => {
    setKeyword("");
    setResults([]);
    const params = new URLSearchParams();

    if (selectedClass) params.append("classId", selectedClass);
    if (mode) params.append("mode", mode);
    if (price?.[0]) params.append("maxPrice", price[0].toString());
    if (province) params.append("province", province);
    if (minRating) params.append("minRating", minRating.toString());

    const response = await algorithmscpp.getResFilter(params);
    setFilterResults(response?.data);
  };

  const handleResetFilter = () => {
    setSelectedClass(null);
    setProvince(null);
    setMinRating(0);
    setPrice([1000000]);
    setKeyword("");
    setResults([]);
    setFilterResults(null);
  };

  const handleQuickClass = (cls: string) => {
    setSelectedClass(cls);
    setKeyword("");
    const params = new URLSearchParams();
    params.append("classId", cls);
    algorithmscpp.getResFilter(params).then((res) => {
      setFilterResults(res?.data);
    });
  };

  const handleQuickMode = (m: "ONLINE" | "OFFLINE") => {
    setMode(m);
    setKeyword("");
    const params = new URLSearchParams();
    params.append("mode", m);
    algorithmscpp.getResFilter(params).then((res) => {
      setFilterResults(res?.data);
    });
  };

  const hasActiveFilter = Boolean(
    selectedClass || province || minRating > 0 || filterResults
  );

  const displayedList = keyword.trim() ? results : filterResults ?? posts;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 py-6 px-4 sm:px-6 lg:px-8">
      {/* Search & Filter Hero Section */}
      <div className="max-w-2xl mx-auto space-y-3 mb-8">
        {/* Khung tìm kiếm liền khối */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-200 transition-all">
          <Search className="size-4 text-slate-400 ml-2.5 shrink-0" />
          <Input
            type="text"
            value={keyword}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Tìm môn học, lớp, hoặc gia sư..."
            className="border-0 shadow-none focus-visible:ring-0 text-sm h-9 bg-transparent px-2 w-full"
          />

          {/* Nút mở Popover bộ lọc */}
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 shrink-0 rounded-xl border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 text-zinc-600 relative"
                >
                  <Funnel className="size-4" />
                  {hasActiveFilter && (
                    <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-zinc-800" />
                  )}
                </Button>
              }
            />
            <PopoverContent className="w-80 p-4 rounded-2xl shadow-lg border-zinc-200">
              <div className="grid gap-3.5">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <h4 className="text-sm font-bold text-zinc-800">
                    Bộ lọc nâng cao
                  </h4>
                  {hasActiveFilter && (
                    <button
                      onClick={handleResetFilter}
                      className="text-xs text-zinc-600 hover:text-zinc-900 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="size-3" />
                      <span>Đặt lại</span>
                    </button>
                  )}
                </div>

                <div className="grid gap-2.5 text-xs">
                  {/* Chọn lớp */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">
                      Lớp học
                    </Label>
                    <Combobox
                      value={selectedClass}
                      onValueChange={setSelectedClass}
                      items={frameworks}
                    >
                      <ComboboxInput placeholder="Chọn lớp..." />
                      <ComboboxContent>
                        <ComboboxEmpty>Không tìm thấy.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item} value={item}>
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>

                  {/* Hình thức */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">
                      Hình thức giảng dạy
                    </Label>
                    <RadioGroup
                      value={mode}
                      onValueChange={(val) =>
                        setMode(val as "ONLINE" | "OFFLINE")
                      }
                      className="flex items-center gap-4 pt-0.5"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="ONLINE" id="r1" />
                        <Label htmlFor="r1" className="text-xs cursor-pointer">
                          Online
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="OFFLINE" id="r2" />
                        <Label htmlFor="r2" className="text-xs cursor-pointer">
                          Offline
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Học phí */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <Label className="font-semibold text-zinc-700">
                        Học phí tối đa
                      </Label>
                      <span className="text-zinc-800 font-bold">
                        {price[0].toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                    <Slider
                      value={price}
                      onValueChange={setPrice}
                      min={50000}
                      max={1000000}
                      step={50000}
                      formatTooltip={(val) => `${val.toLocaleString()}đ`}
                      className="py-1"
                    />
                  </div>

                  {/* Đánh giá tối thiểu */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">
                      Đánh giá tối thiểu
                    </Label>
                    <Combobox
                      items={ratingOptions.map(String)}
                      value={minRating.toString()}
                      onValueChange={(val) => setMinRating(Number(val))}
                    >
                      <ComboboxInput placeholder="Chọn số sao tối thiểu" />
                      <ComboboxContent>
                        <ComboboxEmpty>Không có</ComboboxEmpty>
                        <ComboboxList>
                          {ratingOptions.map((v) => (
                            <ComboboxItem key={v} value={v.toString()}>
                              {v === 0 ? "Tất cả đánh giá" : `${v} ★ trở lên`}
                            </ComboboxItem>
                          ))}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>

                  {/* Tỉnh / Thành */}
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-zinc-700">
                      Tỉnh / Thành phố
                    </Label>
                    <Combobox
                      items={framework}
                      value={province}
                      onValueChange={setProvince}
                    >
                      <ComboboxInput placeholder="Chọn tỉnh/thành..." />
                      <ComboboxContent>
                        <ComboboxEmpty>Không tìm thấy.</ComboboxEmpty>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item} value={item}>
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                </div>

                <Button
                  onClick={handleFilter}
                  className="w-full mt-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-50 font-medium text-sm h-9 rounded-lg"
                >
                  Áp dụng bộ lọc
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Nút tìm kiếm chính */}
          <Button
            onClick={handleSearch}
            className="h-9 px-5 bg-zinc-800 hover:bg-zinc-700 text-zinc-50 font-medium text-sm rounded-xl shrink-0"
          >
            Tìm kiếm
          </Button>
        </div>

        {/* Hàng Quick Tags chọn nhanh */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs sm:text-sm">
          <button
            onClick={handleResetFilter}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
              !selectedClass && !filterResults && !keyword
                ? "bg-zinc-800 text-zinc-50 shadow-2xs"
                : "bg-white text-zinc-600 border border-zinc-200/90 hover:bg-zinc-50"
            }`}
          >
            Tất cả
          </button>
          {["10", "11", "12"].map((cls) => (
            <button
              key={cls}
              onClick={() => handleQuickClass(cls)}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                selectedClass === cls
                  ? "bg-zinc-800 text-zinc-50 shadow-2xs"
                  : "bg-white text-zinc-600 border border-zinc-200/90 hover:bg-zinc-50"
              }`}
            >
              Lớp {cls}
            </button>
          ))}
          <button
            onClick={() => handleQuickMode("ONLINE")}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
              mode === "ONLINE" && filterResults
                ? "bg-zinc-800 text-zinc-50 shadow-2xs"
                : "bg-white text-zinc-600 border border-zinc-200/90 hover:bg-zinc-50"
            }`}
          >
            Học Online
          </button>
          <button
            onClick={() => handleQuickMode("OFFLINE")}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
              mode === "OFFLINE" && filterResults
                ? "bg-zinc-800 text-zinc-50 shadow-2xs"
                : "bg-white text-zinc-600 border border-zinc-200/90 hover:bg-zinc-50"
            }`}
          >
            Học Trực tiếp
          </button>
        </div>
      </div>

      {/* Course Cards Grid */}
      {isPending ? (
        /* Trạng thái Skeleton Loading */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse shadow-xs"
            >
              <div className="h-48 bg-slate-200 rounded-xl" />
              <div className="h-6 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-1/2 bg-slate-100 rounded" />
              <div className="h-8 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : displayedList.length === 0 ? (
        /* Trạng thái rỗng không tìm thấy */
        <div className="max-w-md mx-auto my-12 p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <BookOpen className="size-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            Không tìm thấy khóa học nào
          </h3>
          <p className="text-xs text-slate-500">
            Hãy thử thay đổi từ khóa hoặc xóa bớt tiêu chí lọc để xem thêm kết quả.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilter}
            className="text-xs text-slate-700 rounded-lg mt-2 cursor-pointer"
          >
            Xóa bộ lọc
          </Button>
        </div>
      ) : (keyword.trim() || filterResults) ? (
        /* Khi đang tìm kiếm hoặc lọc: Hiển thị kết quả tìm kiếm */
        <div className="space-y-4 max-w-7xl mx-auto pb-12">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
            <h2 className="text-base font-bold text-zinc-800">
              Kết quả tìm kiếm & lọc ({displayedList.length} khóa học)
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilter}
              className="text-xs text-zinc-500 hover:text-zinc-800 cursor-pointer"
            >
              Xóa bộ lọc
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedList.map((item) => (
              <CardImage key={item.id} data={item} />
            ))}
          </div>
        </div>
      ) : (
        /* Giao diện mặc định: 3 phần tối ưu: Tiêu biểu -> Vừa xem -> Tất cả khóa học */
        <div className="max-w-7xl mx-auto space-y-9 pb-12">
          {/* Phần 1: Gia sư tiêu biểu nổi bật (Thuật toán MaxHeap Priority Queue) */}
          {featuredPosts.length > 0 && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#edf3ee] text-[#2f4f38] border border-[#d5e2d7]">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-zinc-800 tracking-tight">
                      Gia sư tiêu biểu nổi bật
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#2f4f38] bg-[#edf3ee] px-2.5 py-0.5 rounded-full border border-[#d5e2d7]">
                  Đánh giá cao & Học phí tối ưu
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {featuredPosts.map((item) => (
                  <CardImage key={`featured-${item.id}`} data={item} badgeType="featured" />
                ))}
              </div>
            </div>
          )}

          {/* Phần 2: Khóa học vừa xem gần đây (Thuật toán Deque LRU Cache) */}
          {recentPosts.length > 0 && (
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-zinc-100 text-zinc-700">
                    <Clock className="size-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-zinc-800 tracking-tight">
                      Khóa học vừa xem gần đây
                    </h2>
                  </div>
                </div>
                <span className="text-xs text-zinc-400">
                  Lưu trữ gần nhất ({recentPosts.length})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recentPosts.map((item) => (
                  <CardImage key={`recent-${item.id}`} data={item} badgeType="recent" />
                ))}
              </div>
            </div>
          )}

          {/* Phần 3: Tất cả các khóa học hiện có */}
          <div className="space-y-3.5 pt-4 border-t border-zinc-200/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-zinc-100 text-zinc-700">
                  <BookOpen className="size-4" />
                </div>
                <h2 className="text-base font-bold text-zinc-800 tracking-tight">
                  Tất cả khóa học
                </h2>
              </div>
              <span className="text-xs text-zinc-400">
                ({posts.length} khóa học)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((item) => (
                <CardImage key={item.id} data={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
