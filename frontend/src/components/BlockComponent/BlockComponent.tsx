import React from 'react'
import style from "./Block.module.css"
import { Button } from '@/components/ui/button'

export interface course {
    id: string,
    subject: string,
    bagde: string,
    tutor_name: string,
    class: string,
    featured: string,
    time: string,
}

export function BlockComponent ({courseInfo} : {courseInfo: course}) {
  return (
    <div className={style.maindiv}>
      <div className={style.eachdiv}>
        <div className={style.head}>
          <h1 className='font-semibold text-2xl'>Subject: {courseInfo.subject}</h1>
          <h4 className='bg-green-400 rounded-xl'>
            <p className='text-sm'>Đã đăng kí</p>
          </h4>
        </div>
        <div className={style.mid}>
          <h3>Tên gs: {courseInfo.tutor_name}</h3>
          <p>Lớp: {courseInfo.class}</p>
        </div>
        <div className={style.undermid}>
          <p>Hình Thức: {courseInfo.featured}</p>
          <h4>Thời gian: {courseInfo.time}</h4>
        </div>
        <div className={style.tail}>
          <Button className="bg-red-500 text-white hover:bg-red-700 ">Hủy đăng kí</Button>
          <Button className="bg-teal-500 text-white hover:bg-teal-700">Xem thêm</Button>
        </div>
      </div>
    </div>
  )
}