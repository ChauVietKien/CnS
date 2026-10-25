import { Button } from "@/components/ui/button";
import style from "./Block.module.css";

export interface schedules {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface course {
  id: string;
  subject: string;
  format: string;
  tutor_name: string;
  class: string;
  schedule: schedules[];
  post: post;
}
interface Tutor {
  name: string;
}

interface post {
  subject: string;
  Class: string;
  tutor: Tutor;
  method: string;
  price: string;
  address: string;
  schedules: schedules[];
}

export function BlockComponent({ courseInfo }: { courseInfo: course }) {
  const infoPost: post = courseInfo?.post;
  const infoTutor: Tutor = courseInfo?.post.tutor;
  const tkb: schedules[] = infoPost?.schedules;
  console.log("infoPost", infoPost);
  console.log("tkb", tkb);

  return (
    <div className={style.maindiv}>
      <div className={style.eachdiv}>
        <div className={style.head}>
          <h1 className="font-semibold text-2xl">
            Subject: {infoPost.subject}
          </h1>
          <h4 className="bg-green-400 rounded-xl">
            <p className="text-sm">Đã đăng kí</p>
          </h4>
        </div>
        <div className={style.mid}>
          <h3>Tên gs: {infoTutor.name}</h3>
          <p>Lớp: {infoPost.Class}</p>
        </div>
        <div className={style.undermid}>
          <div className="flex flex-row justify-between">
            <p>Hình Thức: {infoPost.method}</p>
            <p>Địa chỉ chi tiết: {infoPost.address}</p>
          </div>
          <div className="flex flex-row justify-between">
            <h4>
              Thời gian:
              {Array.isArray(tkb) &&
                tkb.map((item) => (
                  <p key={item.id}>
                    - Day: {item.day}
                    <br />- StartTime: {item.startTime}
                    <br />- EndTime: {item.endTime}
                  </p>
                ))}
            </h4>
            <p>Giá/Buổi: {infoPost.price}</p>
          </div>
        </div>
        <div className={style.tail}>
          <Button className="bg-red-500 text-white hover:bg-red-700 ">
            Hủy đăng kí
          </Button>
          <Button className="bg-teal-500 text-white hover:bg-teal-700">
            Xem thêm
          </Button>
        </div>
      </div>
    </div>
  );
}
