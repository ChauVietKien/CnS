'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import style from "./Card.module.css";
import { useRouter } from "next/navigation"

export interface CardItem {
  id: string,
  title: string,
  description: string,
  image: string,
  bagde: string,
};

export function CardImage({ data }: { data: CardItem }) {
  const router= useRouter();

  const handleSeeMore = () => {
    router.push("/seemore");
  }

  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <img
        src={data.image}
        alt="postimage"
        className="relative z-20 aspect-video w-full object-cover dark:brightness-0"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">{data.bagde}</Badge>
        </CardAction>
        <CardTitle>{data.title}</CardTitle>
        <CardDescription>
          {data.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className={style.cardfooter}>
        <Dialog>
          <form>
            <DialogTrigger className='bg-zinc-800 w-35' render={<Button>Dang ki</Button>} />
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
        <Button className="w-35 bg-zinc-800" onClick={handleSeeMore}>See more</Button>
      </CardFooter>
    </Card>
  )
}
