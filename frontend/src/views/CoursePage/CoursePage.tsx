"use client";

import { BlockComponent } from "@/components/BlockComponent/BlockComponent";
import { useUser } from "@/context/UserContext";
import * as ApplicationService from "@/services/ApplicationService";
import { useQuery } from "@tanstack/react-query";
import style from "./style.module.css";

const CoursePage = () => {
  const { user } = useUser();
  const userId = user?.id;

  const { data: blockList, isPending } = useQuery({
    queryKey: ["id", userId],
    queryFn: async () => {
      const res = await ApplicationService.getApplication(userId!);
      return res.data || "";
    },
    enabled: !!userId,
  });

  console.log("blockList", blockList);

  return (
    <div className={style.maindiv}>
      <h1 className="font-bold text-3xl mb-2">Thông tin toàn bộ khóa học</h1>
      {Array.isArray(blockList) &&
        blockList.map((item) => (
          <BlockComponent key={item.id} courseInfo={item} />
        ))}
    </div>
  );
};

export default CoursePage;
