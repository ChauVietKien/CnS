"use client";

import { CardImage, CardItem } from "@/components/CardComponent/Cardcomponent";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import * as algorithmscpp from "@/services/algorithmscpp";
import * as PostService from "@/services/PostService";
import { useQuery } from "@tanstack/react-query";
import { Funnel } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import style from "./page.module.css";

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
        <Button variant={"outline"} className={style.filter}>
          <Funnel />
        </Button>
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
