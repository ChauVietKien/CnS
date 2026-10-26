"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as PostService from "@/services/PostService";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import style from "./style.module.css";

const cartList = {
  id: "1",
  title: "Physical tutor",
  description: "Co 5 nam kinh nghiem, co nhieu hoc sinh dat giai cao",
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKwvdTInW0afztDbIuwRacCoiyhLM37syxvhhvr9jF2bcMSNg-8KtRegeE&s=10",
  bagde: "featured",
};

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface User {
  email: string;
}

interface Tutor {
  name: string;
  phone: string;
  user: User;
}

interface PostItem {
  subject: string;
  Class: string;
  method: string;
  postname: string;
  address: string;
  price: number;
  description: string;
  tutor?: Tutor;
  schedules: Schedule[];
}

const SeeMorePage = () => {
  const params = useParams();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const handleback = () => {
    router.push("/");
  };

  const { data: courseInfo, isPending } = useQuery<PostItem>({
    queryKey: ["postId", postId],
    queryFn: () => PostService.getPost(postId!).then((res) => res.data),
    enabled: !!postId,
  });

  if (isPending) return <div>Đang tải dữ liệu...</div>;
  if (!courseInfo || !courseInfo?.tutor)
    return <div>Không tìm thấy thông tin khóa học.</div>;

  const infoTutor: Tutor = courseInfo.tutor;
  const tkb: Schedule[] = courseInfo.schedules ?? [];
  console.log("post", courseInfo);

  return (
    <div className={style.block}>
      <div className={style.img}>
        <Image
          src={cartList.image}
          alt="logopost"
          width={600}
          height={400}
          className={style.image}
        />
      </div>
      <div className={style.intro}>
        <div className={style.info}>
          <h1 className="text-3xl font-bold mb-5 border-b-2 border-black">
            Môn học: {courseInfo.subject}
          </h1>
          <h3 className="text-xl font-medium mb-2">Gia sư: {infoTutor.name}</h3>
          <h3 className="text-xl font-medium mb-2">
            Mô tả: {courseInfo.description}
          </h3>
          <p>Lớp học: {courseInfo.Class}</p>
          <p>Phương thức: {courseInfo.method}</p>
          <p>Địa chỉ chi tiết: {courseInfo.address}</p>
          <p>Giá/tháng: {courseInfo.price}</p>
          <div>
            Thời gian:
            {Array.isArray(tkb) &&
              tkb.map((item, index) => (
                <p key={index}>
                  - Day: {item.day}
                  <br />- StartTime: {item.startTime}
                  <br />- EndTime: {item.endTime}
                </p>
              ))}
          </div>
          <p>Ngày bắt đầu học: 21/12/2026</p>
          <p>Thời hạn: 3 tháng</p>
        </div>
        <div className={style.button}>
          <Button className="w-40 h-10" onClick={handleback}>
            Quay lai
          </Button>
          <Dialog>
            <form>
              <DialogTrigger
                className="w-40 h-10"
                render={<Button>Dang ki</Button>}
              />
              <DialogContent className="sm:max-w-sm max-h-[80vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Đơn đăng kí</DialogTitle>
                  <DialogDescription>
                    Điền đầy đủ thông tin trong form
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[50vh] overflow-y-auto">
                  <div className="p-1">
                    <DialogTitle>Thông tin gia sư + buổi học</DialogTitle>
                    <FieldGroup className="mt-3 font-medium">
                      <Field>
                        <Label htmlFor="name-1">Họ Tên</Label>
                        <Input id="name-1" name="name" defaultValue="" />
                      </Field>
                      <Field>
                        <Label htmlFor="username-1">Môn học</Label>
                        <Input
                          id="username-1"
                          name="username"
                          defaultValue=""
                        />
                      </Field>
                    </FieldGroup>
                  </div>
                  <div className="p-1">
                    <DialogTitle>Thông tin học viên</DialogTitle>
                    <FieldGroup className="mt-3 font-medium">
                      <Field>
                        <Label htmlFor="name-1">Họ Tên</Label>
                        <Input id="name-1" name="name" defaultValue="" />
                      </Field>
                      <Field>
                        <Label htmlFor="username-1">Email</Label>
                        <Input
                          id="username-1"
                          name="username"
                          defaultValue=""
                        />
                      </Field>
                      <Field>
                        <Label htmlFor="username-1">Số điện thoại</Label>
                        <Input
                          id="username-1"
                          name="username"
                          defaultValue=""
                        />
                      </Field>
                      <Field>
                        <Label htmlFor="username-1">Phương thức</Label>
                        <Input
                          id="username-1"
                          name="username"
                          defaultValue=""
                        />
                      </Field>
                    </FieldGroup>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose
                    render={<Button variant="outline">Hủy</Button>}
                  />
                  <Button type="submit">Đăng kí</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default SeeMorePage;
