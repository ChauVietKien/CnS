import React from 'react'
import { BlockComponent, course } from '@/components/BlockComponent/BlockComponent'
import style from "./style.module.css"

const blockList: course[] = [
  {
    id: "1",
    subject: "Toán",
    bagde: "Đã đăng kí",
    tutor_name: "Nguyễn Hồng Hạnh",
    class: "12",
    featured: "Online",
    time: "T2-T5-T7, 15g",
  },
  {
    id: "2",
    subject: "Toán",
    bagde: "Đã đăng kí",
    tutor_name: "Nguyễn Hồng Hạnh",
    class: "12",
    featured: "Online",
    time: "T2-T5-T7, 15g",
  },
  {
    id: "3",
    subject: "Toán",
    bagde: "Đã đăng kí",
    tutor_name: "Nguyễn Hồng Hạnh",
    class: "12",
    featured: "Online",
    time: "T2-T5-T7, 15g",
  },
  {
    id: "4",
    subject: "Toán",
    bagde: "Đã đăng kí",
    tutor_name: "Nguyễn Hồng Hạnh",
    class: "12",
    featured: "Online",
    time: "T2-T5-T7, 15g",
  },
  {
    id: "5",
    subject: "Toán",
    bagde: "Đã đăng kí",
    tutor_name: "Nguyễn Hồng Hạnh",
    class: "12",
    featured: "Online",
    time: "T2-T5-T7, 15g",
  },
  {
    id: "6",
    subject: "Toán",
    bagde: "Đã đăng kí",
    tutor_name: "Nguyễn Hồng Hạnh",
    class: "12",
    featured: "Online",
    time: "T2-T5-T7, 15g",
  }
]

const CoursePage = () => {
  return (
    <div className={style.maindiv}>
      <h1 className='font-bold text-3xl mb-2'>Thông tin toàn bộ khóa học</h1>
      {blockList.map((item) => (
        <BlockComponent key={item.id} courseInfo={item}/>   
      ))}
    </div>
  )
}

export default CoursePage
