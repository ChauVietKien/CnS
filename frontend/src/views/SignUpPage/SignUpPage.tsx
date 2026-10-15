'use client'

import React, { useState } from 'react'
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

const SignUpPage = () => {

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/signin');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('')
    try {
      const res = await UserService.createUser(form);

      router.push("/signin");
    } catch (err) {
      setError("Đăng ký thất bại!");
    }
  }

  return (
    <div className={style.maindiv}>
      <h1>Đăng ký</h1>
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
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <FieldDescription>
                We will send updates to this address.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="fieldgroup-name">Password</FieldLabel>
              <Input
                id="fieldgroup-password"
                type="password"
                required
                placeholder="123456"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
          <p>Ban da co tai khoan?<a onClick={handleSignIn} className='font-bold cursor-pointer'> Dang nhap!</a></p>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
