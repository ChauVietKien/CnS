'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Funnel } from 'lucide-react';
import style from "./page.module.css"
import { CardImage, CardItem } from "@/components/CardComponent/Cardcomponent"
import { useRouter } from 'next/navigation';

const cartList: CardItem[] = [
  {
    id: "1",
    title: "Math tutor",
    description: "Co 3 nam kinh nghiem, co nhieu hoc sinh dat giai cao",
    image: "https://giasuttv.net/wp-content/uploads/2022/07/banner-gia-su-tri-tue-viet.jpg",
    bagde: "featured"
  },
  {
    id: "2",
    title: "English tutor",
    description: "Co 9 nam kinh nghiem, co nhieu hoc sinh dat giai cao",
    image: "https://giasumacdinhchi.vn/wp-content/uploads/2023/07/anh-bia.png",
    bagde: "featured"
  },
  {
    id: "3",
    title: "Physical tutor",
    description: "Co 5 nam kinh nghiem, co nhieu hoc sinh dat giai cao",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKwvdTInW0afztDbIuwRacCoiyhLM37syxvhhvr9jF2bcMSNg-8KtRegeE&s=10",
    bagde: "featured"
  },
  {
    id: "4",
    title: "Math tutor",
    description: "Co 3 nam kinh nghiem, co nhieu hoc sinh dat giai cao",
    image: "https://giasuttv.net/wp-content/uploads/2022/07/banner-gia-su-tri-tue-viet.jpg",
    bagde: "featured"
  },
  {
    id: "5",
    title: "English tutor",
    description: "Co 9 nam kinh nghiem, co nhieu hoc sinh dat giai cao",
    image: "https://giasumacdinhchi.vn/wp-content/uploads/2023/07/anh-bia.png",
    bagde: "featured"
  },
  {
    id: "6",
    title: "Physical tutor",
    description: "Co 5 nam kinh nghiem, co nhieu hoc sinh dat giai cao",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKwvdTInW0afztDbIuwRacCoiyhLM37syxvhhvr9jF2bcMSNg-8KtRegeE&s=10",
    bagde: "featured"
  }
]

const Home = () => {
  const router = useRouter();
  
  return (
    <div className={style.main}>
      <div className={style.research}>
        <Field orientation="horizontal">
          <Input type="search" placeholder="Search..." className={style.search} />
          <Button className={style.search}>Search</Button>
        </Field>
        <Button variant={'outline'} className={style.filter}><Funnel /></Button>
      </div>
      <div className={style.bodypage}>
        <div className={style.card}>
          {cartList.map((item) => (
            <CardImage key={item.id} data={item}/>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Home