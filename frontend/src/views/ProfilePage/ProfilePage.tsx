'use client'

import { useState } from 'react'
import style from "./style.module.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as UserService from '@/services/UserService'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

interface User {
    id: string
    name: string
    email: string
    role: string
    age: string
}

const ProfilePage = () => {
  const router = useRouter();

  const { user } = useUser();
  const [ isEditing, setIsEditing ] = useState(false);
  const userId = user?.id;
  const queryClient = useQueryClient();
  
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => UserService.getDetailUser(userId!).then(res => res.data),
    enabled: !!userId,
  });

  const { register, handleSubmit, reset } = useForm<User>({
    values : 
      {
        id: currentUser?.id,
        name: currentUser?.name ?? '',
        email: currentUser?.email ?? '',
        role: currentUser?.role ?? '',
        age: currentUser?.age ?? '',
      }
  })

  const updateMutation = useMutation({
    mutationFn: async (data: User) => { 
      const res = await UserService.updateUser(userId!, data);  
      return res.data;
    },
    onSuccess: (updatedData) => {
      queryClient.invalidateQueries({ queryKey: ['user']}),
      toast.add({ 
        type: "success",
        description: "Chỉnh sửa thông tin thành công!"
      }),
      reset(updatedData),
      setIsEditing(false)
    },
  });

  const onSubmit = (data: User) => {
    if (!user?.id) return;
    updateMutation.mutate(data);
  }

  const handleEdit = () => {
    setIsEditing(true);
  }

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  }

  return (
    <div className={style.mainbl}>
      <div className={style.header}>
        <img src="https://bizweb.dktcdn.net/100/255/283/themes/588445/assets/cate_2_2.jpg?1786698433736" alt="anhdd" className='w-20 h-20 rounded-full'/>
        <h3 className='font-bold text-lg'>{currentUser?.name}</h3>
      </div>
      <div className={style.body}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className='text-lg'>Họ và tên</label>
          {!isEditing ? 
            (<p className='flex h-9 w-full rounded-md border border-input px-3 py-1 text-lg font-bold'>{currentUser?.name ?? "Người dùng"}</p>)
            : (<Input {...register("name")} className="rounded-md"/>)
          }       
          <label className='text-lg'>Email</label>
          {!isEditing ? 
            (<p className='flex h-9 w-full rounded-md border border-input px-3 py-1 text-lg font-bold'>{currentUser?.email ?? "Người dùng"}</p>)
            : (<Input {...register("email")} className="rounded-md"/>)
          }
          <label className='text-lg'>Vai trò</label>
          {!isEditing ? 
            (<p className='flex h-9 w-full rounded-md border border-input px-3 py-1 text-lg font-bold'>{currentUser?.role ?? "Người dùng"}</p>)
            : (<Input {...register("role")} className="rounded-md"/>)
          }
          <label className='text-lg'>Tuổi</label>
          {!isEditing ? 
            (<p className='flex h-9 w-full rounded-md border border-input px-3 py-1 text-lg font-bold'>{currentUser?.age ?? "Người dùng"}</p>)
            : (<Input {...register("age")} className="rounded-md"/>)
          }
          <div className={style.button}>
            {!isEditing ? (<Button className='w-45 h-9 bg-gray-800' type="button" onClick={handleEdit}>Chỉnh sửa</Button>)
            : (<Button className='w-45 h-9 bg-red-500' type="button" onClick={handleCancel}>Hủy</Button>)}
            <Button type='submit' className='w-45 h-9'>Lưu</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage
