'use client'

import React, { use, useState } from 'react'
import style from "./style.module.css"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import * as UserService from "@/services/UserService"
import { useUser } from '@/context/UserContext'


const SignIpPage = () => {

  const router = useRouter();
  const [ form, setForm ] = useState({ email: "", password: ""});
  const [ error, setError ] = useState("");
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('')
    try {
        const res = await UserService.loginUser(form);
        localStorage.setItem("access_token", res.access_token);
        console.log("usersignin", res.data);
        setUser(res.data);   
        router.push("/");
    } catch (err) {
        setError("Đăng nhập thất bại!");
    }
  }

  const handleSignUp = () => {
    router.push('/signup');
  }

  return (
    <div className={style.maindiv}>
        <h1>Đăng Nhập</h1>
        <div className='flex flex-col w-full m-100px'>
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
                        <Input
                        id="fieldgroup-email"
                        type="email"
                        required
                        placeholder="name@example.com"
                        onChange={(e) => setForm({...form, email: e.target.value })}
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="fieldgroup-name">Password</FieldLabel>
                        <Input
                        id="fieldgroup-password"
                        type="password"
                        required
                        placeholder="123456"
                        onChange={(e) => setForm({...form, password: e.target.value })}
                        />
                    </Field>
                    <Field orientation="horizontal">
                        <Button type="reset" variant="outline">
                        Reset
                        </Button>
                        <Button type="submit">Submit</Button>
                    </Field>
                </FieldGroup>
            </form>
            <div className='flex justify-center mt-5'>
                <p>Ban chua co tai khoan?<a onClick={handleSignUp} className='font-bold cursor-pointer'> Dang ki ngay!</a></p>
            </div>
        </div>
    </div>
  )
}

export default SignIpPage
