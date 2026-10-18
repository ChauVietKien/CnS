'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Funnel } from 'lucide-react';
import style from "./page.module.css"
import { CardImage, CardItem } from "@/components/CardComponent/Cardcomponent"
import { useRouter } from 'next/navigation';
import * as PostService from "@/services/PostService"
import { useQuery } from '@tanstack/react-query'

const Home = () => {
  const router = useRouter();

  const { data: currentPost, isPending } = useQuery<{ data: CardItem[] }>({
    queryKey: ['post'],
    queryFn: () => PostService.getAllPosts(),
  });

  const posts: CardItem[] = currentPost?.data || [];

  console.log("data", posts)
  
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
          {posts.map((item) => (
            <CardImage key={item.id} data={item}/>
          ))}
        </div>
      </div>
    </div>
  )
}
export default Home