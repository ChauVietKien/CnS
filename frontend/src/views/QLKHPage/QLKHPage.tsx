"use client";

import style from './QLKHPage.module.css'
import { SquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from 'next/navigation'

const invoices = [
  {
    stt: "1",
    status: "Đã duyệt",
    method: "Online",
    subject: "Toán", 
    day: "T2-T5-T7",
    detail: "9-11.PM",
  },
  {
    stt: "2",
    status: "Đang chờ",
    method: "Online",
    subject: "Lý",
    day: "T2-T5-T7",
    detail: "9-11.PM",
  },
  {
    stt: "3",
    status: "Bị từ chối",
    method: "Online",
    subject: "Anh Văn",
    day: "T2-T5-T7",
    detail: "9-11.PM",
  },
  {
    stt: "4",
    status: "Đã duyệt",
    method: "Online",
    subject: "Ngữ Văn",
    day: "T2-T5-T7",
    detail: "9-11.PM",
  },
  {
    stt: "5",
    status: "Đã duyệt",
    method: "Online",
    subject: "Hóa Học",
    day: "T2-T5-T7",
    detail: "9-11.PM",
  },
  {
    stt: "6",
    status: "Đang chờ",
    method: "Online",
    subject: "Hóa Học",
    day: "T2-T5-T7",
    detail: "9-11.PM",
  },
  {
    stt: "7",
    status: "Bị từ chối",
    method: "Online",
    subject: "Hóa Học",
    day: "T2-T5-T7",
    detail: "9-11.PM",
  },
]

const QLKHPage = () => {

  const router = useRouter();
  
  const handleUpdatePost = () => {
      router.push('/updatepost');
  }

  return (
    <div className={style.main}>
      <div className={style.dk}>
        <h1 className='font-medium text-2xl'>Đăng khóa học</h1>
        <Button onClick={handleUpdatePost}>
            <SquarePlus />
        </Button>
      </div>
      <div className={style.kh}>
        <h1 className='font-medium text-2xl'>Khóa học hiện tại</h1>
        <div className={style.table}>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">STT</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Môn dạy</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Thời gian</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((invoice) => (
                <TableRow key={invoice.stt}>
                    <TableCell className="font-medium">{invoice.stt}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell>{invoice.subject}</TableCell>
                    <TableCell>{invoice.method}</TableCell>
                    <TableCell>{invoice.day}</TableCell>
                    <TableCell>{invoice.detail}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>7</TableCell>
                </TableRow>
            </TableFooter>
            </Table>
        </div>
      </div>
    </div>
  )
}

export default QLKHPage
