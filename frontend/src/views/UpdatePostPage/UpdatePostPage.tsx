"use client"
import React from 'react'
import style from './UpdatePostPage.module.css'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useFieldArray } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { asymmetricScheduleSchema, type AsymmetricScheduleValues } from "@/schema/schema"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DAYS_OF_WEEK = [
  { label: "T2", value: "T2" },
  { label: "T3", value: "T3" },
  { label: "T4", value: "T4" },
  { label: "T5", value: "T5" },
  { label: "T6", value: "T6" },
  { label: "T7", value: "T7" },
  { label: "CN", value: "CN" },
]

const formSchema = z.object({
title: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
})

const UpdatePostPage = () => {
    const form = useForm<AsymmetricScheduleValues>({
    resolver: zodResolver(asymmetricScheduleSchema),
    defaultValues: {
        title: "",
        schedules: [],
    },
    })

  // Dùng useFieldArray để quản lý mảng lịch động
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedules",
  })

  const toggleDay = (dayValue: string) => {
    const index = fields.findIndex((item) => item.day === dayValue)
    if (index >= 0) {
      remove(index)
    } else {
      append({ day: dayValue, startTime: "18:00", endTime: "20:00" })
    }
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (
    <div className={style.main}>
      <div className={style.title}>
        <h1 className='text-2xl font-bold border-b border-black'>Đăng Khóa Học</h1>
      </div>
      <div className={style.body}>
        <h1 className='text-xl border-b border-gray'>Nhập thông tin khóa</h1>
        <Card className="w-full overflow-y-auto">
        <CardHeader>
            <CardDescription>
            Vui lòng nhập đủ thông tin
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <div className={style.input}>
                    <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                            Tên môn dạy
                        </FieldLabel>
                        <Input
                            aria-invalid={fieldState.invalid}
                            placeholder="subject"
                        />
                        </Field>
                    )}
                    />
                    <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                            Lớp
                        </FieldLabel>
                        <Input
                            aria-invalid={fieldState.invalid}
                            placeholder="class"
                        />
                        </Field>
                    )}
                    />
                </div>
                <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                            Hình thức
                        </FieldLabel>
                        <Input
                            aria-invalid={fieldState.invalid}
                            placeholder="online"
                        />
                        </Field>
                    )}
                />
                <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                            Tên môn dạy
                        </FieldLabel>
                        <Input
                            aria-invalid={fieldState.invalid}
                            placeholder="subject"
                        />
                        </Field>
                    )}
                />
                <Controller
                    name="title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                            Thời gian
                        </FieldLabel>
                        <Form {...form}>
                            <div className="space-y-6">
                            
                            {/* 1. CHỌN CÁC THỨ TRONG TUẦN */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Chọn các thứ học trong tuần</label>
                                <div className="flex flex-wrap gap-2">
                                {DAYS_OF_WEEK.map((d) => {
                                    const isSelected = fields.some((item) => item.day === d.value)
                                    return (
                                    <Button
                                        key={d.value}
                                        type="button"
                                        variant={isSelected ? "default" : "outline"}
                                        className="w-10 h-10 rounded-full font-semibold"
                                        onClick={() => toggleDay(d.value)}
                                    >
                                        {d.label}
                                    </Button>
                                    )
                                })}
                                </div>
                                {form.formState.errors.schedules?.root && (
                                <p className="text-sm font-medium text-destructive">
                                    {form.formState.errors.schedules.root.message}
                                </p>
                                )}
                            </div>

                            {/* 2. KHUNG CHỈNH GIỜ TỰ ĐỘNG SINH THEO THỨ */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Cấu hình khung giờ từng buổi</label>

                                {fields.map((field, index) => (
                                <div key={field.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border">
                                    <span className="font-bold text-primary w-10">{field.day}</span>

                                    <div className="flex items-center gap-2">
                                    {/* Giờ bắt đầu */}
                                    <FormField
                                        control={form.control}
                                        name={`schedules.${index}.startTime`}
                                        render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-[100px] h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="08:00">08:00</SelectItem>
                                                <SelectItem value="09:00">09:00</SelectItem>
                                                <SelectItem value="18:00">18:00</SelectItem>
                                                <SelectItem value="19:00">19:00</SelectItem>
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />

                                    <span className="text-xs text-muted-foreground">-</span>

                                    {/* Giờ kết thúc */}
                                    <FormField
                                        control={form.control}
                                        name={`schedules.${index}.endTime`}
                                        render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-[100px] h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="10:00">10:00</SelectItem>
                                                <SelectItem value="11:00">11:00</SelectItem>
                                                <SelectItem value="20:00">20:00</SelectItem>
                                                <SelectItem value="21:00">21:00</SelectItem>
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    </div>
                                </div>
                                ))}
                            </div>

                            {/* 3. SUBMIT BUTTON */}
                            <Button type="submit" className="w-full">
                                Lưu thời khóa biểu
                            </Button>

                            </div>
                        </Form>
                        </Field>
                    )}
                />
                <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-description">
                        Mô tả
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupTextarea
                        {...field}
                        id="form-rhf-demo-description"
                        placeholder="Overview"
                        rows={6}
                        className="min-h-24 resize-none"
                        />
                        <InputGroupAddon align="block-end">
                        <InputGroupText className="tabular-nums">
                            {field.value?.length || 0}/100 characters
                        </InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                    <FieldDescription>
                        Cảm ơn
                    </FieldDescription>
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                    </Field>
                )}
                />
            </FieldGroup>
            </form>
        </CardContent>
        <CardFooter>
            <Field orientation="horizontal" className='justify-end gap-5'>
            <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
            </Button>
            <Button type="submit" form="form-rhf-demo">
                Submit
            </Button>
            </Field>
        </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default UpdatePostPage

