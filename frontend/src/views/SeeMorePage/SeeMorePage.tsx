"use client"

import React from 'react'
import style from "./style.module.css"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const cartList = {
    id: "1",
    title: "Physical tutor",
    description: "Co 5 nam kinh nghiem, co nhieu hoc sinh dat giai cao",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKwvdTInW0afztDbIuwRacCoiyhLM37syxvhhvr9jF2bcMSNg-8KtRegeE&s=10",
    bagde: "featured"
}

const SeeMorePage = () => {

  const router = useRouter();

  const handleback = () => {
    router.push("/");
  }

  return (
    <div className={style.block}>
        <div className={style.img}>
            <img src={cartList.image} alt="logopost" className={style.image}/>
        </div>
        <div className={style.intro}>
            <div className={style.info}>
                <h1 className='text-3xl font-bold mb-5 border-b-2 border-black'>Môn học: {cartList.title}</h1>
                <h3 className='text-xl font-medium mb-2'>Gia sư: Võ Đình Nam</h3>
                <h3 className='text-xl font-medium mb-2'>Mô tả: {cartList.description}</h3>
                <h5>Exp: Dạy cấp 2, 3, university</h5>
                <p>
                    Bang cap: Huy chuong vang olympic Toan, giai nhat thi hsg cap quoc gia, va tinh. Vong nguyet que cuoc thi nam duong len dinh olympia!<br/>
                    Danh hieu: 12 nam hoc sinh gioi va hoc truong chuyen quoc hoc hue!
                </p>
                <p>
                    Thành tựu về học tập của học sinh (Kết quả rõ ràng nhất):<br/>
                    -Giúp học sinh mất gốc tiến bộ vượt bậc: Đưa một học sinh từ lực học yếu, <br/>
                    trung bình vươn lên đạt khá, giỏi hoặc nằm trong top đầu của lớp.<br/>
                    -Cải thiện điểm số nhanh chóng: Giúp học sinh tăng từ 2–4 điểm trong các <br/>
                    bài kiểm tra 15 phút, 1 tiết hoặc thi học kỳ chỉ sau vài tháng đồng hành.<br/>
                    -Luyện thi đạt điểm cao: Giúp học sinh đỗ vào các trường cấp 3 chuyên, trường đại <br/>
                    học top đầu, hoặc đạt điểm số cao trong các kỳ thi chứng chỉ quốc tế (IELTS, SAT...).<br/>
                    -Giành giải thưởng học thuật: Hướng dẫn và hỗ trợ học sinh đạt giải trong các kỳ thi học <br/>
                    sinh giỏi cấp trường, cấp quận/huyện hoặc cấp tỉnh.
                </p>
            </div>
            <div className={style.button}>
                <Button className="w-40 h-10" onClick={handleback}>Quay lai</Button>
                <Dialog>
                <form>
                    <DialogTrigger className="w-40 h-10" render={<Button>Dang ki</Button>} />
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
                            <Input id="username-1" name="username" defaultValue="" />
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
                            <Input id="username-1" name="username" defaultValue="" />
                            </Field>
                            <Field>
                            <Label htmlFor="username-1">Số điện thoại</Label>
                            <Input id="username-1" name="username" defaultValue="" />
                            </Field>
                            <Field>
                            <Label htmlFor="username-1">Phương thức</Label>
                            <Input id="username-1" name="username" defaultValue="" />
                            </Field>
                        </FieldGroup>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose render={<Button variant="outline">Hủy</Button>} />
                        <Button type="submit">Đăng kí</Button>
                    </DialogFooter>
                    </DialogContent>
                </form>
                </Dialog>
            </div>
        </div>
    </div>
  )
}

export default SeeMorePage
