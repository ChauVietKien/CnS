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
import { Field } from "@/components/ui/field";
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
import { Funnel } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import style from "./page.module.css";

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
  address?: string | null;
  field: string;
  proof: string;
  tutorId: string;
}

const Home = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<TutorPost[]>([]);

  const [price, setPrice] = useState([200000]);

  const { data: currentPost, isPending } = useQuery<{ data: CardItem[] }>({
    queryKey: ["post"],
    queryFn: () => PostService.getAllPosts(),
  });

  const posts: CardItem[] = currentPost?.data || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);
    if (!val.trim()) setResults([]); // Reset ngay khi người dùng xóa trắng
  };

  useEffect(() => {
    if (!keyword.trim()) return;

    const timer = setTimeout(async () => {
      const res = await algorithmscpp.getResSearch(keyword);
      setResults(res.data);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  const displayedList = keyword.trim() ? results : posts;

  return (
    <div className={style.main}>
      <div className={style.research}>
        <Field orientation="horizontal">
          <Input
            type="text"
            value={keyword}
            onChange={handleChange}
            placeholder="Search..."
            className={style.search}
          />
          <Button className={style.search}>Search</Button>
        </Field>
        <Popover>
          <PopoverTrigger
            render={
              <Button variant={"outline"} className={style.filter}>
                <Funnel />
              </Button>
            }
          />
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="leading-none font-medium">Lọc khóa học</h4>
              </div>
              <div className="grid gap-2">
                <Combobox items={frameworks}>
                  <ComboboxInput placeholder="Select a class" />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                <RadioGroup defaultValue="comfortable" className="w-fit">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="default" id="r1" />
                    <Label htmlFor="r1">Online</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="comfortable" id="r2" />
                    <Label htmlFor="r2">Offline</Label>
                  </div>
                </RadioGroup>
                <div className="pt-8 mx-auto w-full max-w-xs flex flex-row">
                  <Slider
                    value={price}
                    onValueChange={setPrice}
                    min={50000}
                    max={1000000}
                    step={50000}
                    // Tùy chọn định dạng hiển thị thành tiền (ví dụ: "200.000đ")
                    formatTooltip={(val) => `${val.toLocaleString()}đ`}
                  />
                  <p>/thang</p>
                </div>
                <Combobox items={framework}>
                  <ComboboxInput placeholder="Select a provine" />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
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
            <Button className="flex justify-self-end size-12 rounded-xl ml-auto">
              Filter
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <div className={style.bodypage}>
        <div className={style.card}>
          {displayedList.map((item) => (
            <CardImage key={item.id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Home;
