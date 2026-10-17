"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import style from './UpdatePostPage.module.css'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useFieldArray, FormProvider } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
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
import { FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import * as PostService from '@/services/PostService'
import { useMutation } from '@tanstack/react-query'
import { useUser } from '@/context/UserContext'

interface Post {
  subject: String,
  Class: String,
  description: String,
  method: String,
  userId: String,
  tutorname: String,
  field: String,
  proof: String,
  dayOfWeek: Number,
  startTime: String,
  endTime: String
}

// ─── Schema mở rộng thêm các field thực tế ───────────────────────────────────
const formSchema = asymmetricScheduleSchema.omit({ title: true }).extend({
  userId: z.string().min(1, "Vui lòng đăng nhập"),
  tutorname: z.string().min(1, "Vui lòng nhập tên người dạy"),
  field: z.string().min(1, "Vui lòng nhập lĩnh vực"),
  subject: z.string().min(1, "Vui lòng nhập môn dạy"),
  Class: z.string().min(1, "Vui lòng nhập lớp"),
  method: z.string().min(1, "Vui lòng nhập hình thức"),
  description: z.string().min(20, "Mô tả ít nhất 20 ký tự").max(100, "Mô tả tối đa 100 ký tự"),
  proof: z.string().min(1, "Vui lòng nhập minh chứng"),
})

type FormValues = z.infer<typeof formSchema>

// ─── Constants ────────────────────────────────────────────────────────────────
const DAYS_OF_WEEK = [
  { label: "T2", value: "T2" },
  { label: "T3", value: "T3" },
  { label: "T4", value: "T4" },
  { label: "T5", value: "T5" },
  { label: "T6", value: "T6" },
  { label: "T7", value: "T7" },
  { label: "CN", value: "CN" },
]

const SPRING = { type: "spring" as const, duration: 0.25, bounce: 0.1 }
const SPRING_BOUNCY = { type: "spring" as const, duration: 0.3, bounce: 0.2 }

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 text-muted-foreground"
      fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UploadIcon({ isDragOver }: { isDragOver: boolean }) {
  const shouldReduceMotion = useReducedMotion()
  return (
    <motion.div
      animate={shouldReduceMotion ? undefined : isDragOver ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : SPRING_BOUNCY}
    >
      <svg aria-hidden="true"
        className={cn("mb-3 h-10 w-10 transition-colors duration-200", isDragOver ? "text-primary" : "text-muted-foreground")}
        fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const UpdatePostPage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const shouldReduceMotion = useReducedMotion()
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)

  const [isDragOver, setIsDragOver] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  // FIX 1: isMounted được set đúng qua useEffect
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => { setIsMounted(true) }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      subject: "",
      Class: "",
      description: "",
      method: "",
      tutorname: "",
      field: "",
      proof: "",
      schedules: [],
    },
  })

  useEffect(() => {
    if (userId) {
      form.setValue("userId", userId);
    }
  }, [userId, form]);

  // FIX 2: useFieldArray dùng đúng form context, không tạo Form lồng nhau
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schedules",
  })

  // ─── File Handlers ────────────────────────────────────────────────────────
  const handleFiles = useCallback((newFiles: File[]) => {
    setFileError(null)
    if (newFiles.length === 0) return
    const updated = [...files, ...newFiles]
    setFiles(updated)
    // FIX 3: Không cần kết nối file vào RHF vì file upload là side-channel (FormData)
    // Giữ state file riêng, dùng khi build FormData lúc submit
    form.setValue("proof", updated.length > 0 ? "has_file" : "", { shouldValidate: true })
  }, [files])

  const removeFile = useCallback((index: number) => {
    setFiles(prev => {
      const updated = prev.filter((_, i) => i !== index)
      // 👉 Cập nhật lại proof trong RHF khi xóa file
      form.setValue("proof", updated.length > 0 ? "has_file" : "", { shouldValidate: true })
      return updated
    })
  }, [form])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current += 1
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current -= 1
    if (dragCounter.current === 0) setIsDragOver(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault() }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current = 0
    setIsDragOver(false)
    handleFiles(Array.from(e.dataTransfer.files))
  }, [handleFiles])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files ? Array.from(e.target.files) : [])
    if (inputRef.current) inputRef.current.value = ""
  }

  const Ppostmutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await PostService.createPost(data);
      return res;
    },
    onSuccess: () => {
      toast.success("Đăng duyệt thành công");
      form.reset();
      setFiles([]);
    },
    onError: (err) => {
      toast.error("Có lỗi xảy ra khi đăng bài!");
    }
  });

  // ─── Submit ───────────────────────────────────────────────────────────────
  function onSubmit(data: FormValues) {
    // Build FormData để gửi cả text fields lẫn file lên server
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined) return;
      
      // Nếu là File/Blob thì append trực tiếp, không stringify
      if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });
    files.forEach(file => formData.append("files", file))
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    console.log(Array.from(formData.entries()));
    Ppostmutation.mutate(formData);

    toast("Đã thu thập dữ liệu:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground text-xs">
          <code>{JSON.stringify({ ...data, files: files.map(f => f.name) }, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
    })

    // TODO: gọi API với formData
    // await apiService.createPost(formData)
  }

  const toggleDay = (dayValue: string) => {
    const index = fields.findIndex(item => item.day === dayValue)
    if (index >= 0) remove(index)
    else append({ day: dayValue, startTime: "18:00", endTime: "20:00" })
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={style.main}>
      <div className={style.title}>
        <h1 className='text-2xl font-bold border-b border-black'>Đăng Khóa Học</h1>
      </div>
      <div className={style.body}>
        <h1 className='text-xl border-b border-gray'>Nhập thông tin khóa</h1>
        <Card className="w-full overflow-y-auto">
          <CardHeader>
            <CardDescription>Vui lòng nhập đủ thông tin</CardDescription>
          </CardHeader>
          <CardContent>
            {/* FormProvider cung cấp context cho FormField bên trong */}
            <FormProvider {...form}>
              <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit, (errors) => console.log("Validation errors:", errors))}>
                <FieldGroup>

                  {/* Tên người dạy + Lĩnh vực */}
                  <div className={style.input}>
                    <Controller name="tutorname" control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Tên người dạy</FieldLabel>
                          <Input {...field} aria-invalid={fieldState.invalid} placeholder="Nguyễn Văn A" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller name="field" control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Lĩnh vực</FieldLabel>
                          <Input {...field} aria-invalid={fieldState.invalid} placeholder="Toán, Lý, Hoá..." />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>


                  {/* Tên môn dạy + Lớp */}
                  <div className={style.input}>
                    <Controller name="subject" control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Tên môn dạy</FieldLabel>
                          <Input {...field} aria-invalid={fieldState.invalid} placeholder="Toán" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                    <Controller name="Class" control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel>Lớp</FieldLabel>
                          <Input {...field} aria-invalid={fieldState.invalid} placeholder="Lớp 10" />
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </div>

                  {/* Hình thức */}
                  <Controller name="method" control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Hình thức</FieldLabel>
                        <Input {...field} aria-invalid={fieldState.invalid} placeholder="Online / Offline" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* Thời gian */}
                  <div className="flex w-full flex-col gap-2">
                    <label className="text-sm font-medium">Thời gian</label>
                    <div className="space-y-6 mt-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Chọn các thứ học trong tuần</label>
                        <div className="flex flex-wrap gap-2">
                          {DAYS_OF_WEEK.map(d => {
                            const isSelected = fields.some(item => item.day === d.value)
                            return (
                              <Button key={d.value} type="button"
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
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Cấu hình khung giờ từng buổi</label>
                        {fields.map((field, index) => (
                          <div key={field.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border">
                            <span className="font-bold text-primary w-10">{field.day}</span>
                            <div className="flex items-center gap-2">
                              <FormField control={form.control} name={`schedules.${index}.startTime`}
                                render={({ field }) => (
                                  <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="w-[100px] h-8 text-xs"><SelectValue /></SelectTrigger>
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
                              <FormField control={form.control} name={`schedules.${index}.endTime`}
                                render={({ field }) => (
                                  <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="w-[100px] h-8 text-xs"><SelectValue /></SelectTrigger>
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
                    </div>
                  </div>

                  {/* Mô tả */}
                  <Controller name="description" control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-description">Mô tả</FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea {...field} id="form-rhf-demo-description"
                            placeholder="Mô tả khóa học..." rows={6} className="min-h-24 resize-none" />
                          <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums">
                              {field.value?.length || 0}/100 ký tự
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        <FieldDescription>Cảm ơn bạn đã chia sẻ thông tin</FieldDescription>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* Upload Minh Chứng */}
                  <div className={cn("w-full space-y-3")}>
                    <Field>
                      <FieldLabel>Upload Minh Chứng</FieldLabel>
                    </Field>
                    <motion.div
                      animate={shouldReduceMotion ? undefined : isDragOver ? { scale: 1.02 } : { scale: 1 }}
                      aria-label="Kéo thả file hoặc nhấn để chọn"
                      className={cn(
                        "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "transition-colors duration-200",
                        isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/40 hover:bg-muted/30",
                      )}
                      onClick={() => inputRef.current?.click()}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onKeyDown={e => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
                      role="button"
                      tabIndex={0}
                      transition={shouldReduceMotion ? { duration: 0 } : SPRING}
                    >
                      <input accept="image/*,.pdf" className="sr-only" multiple
                        onChange={handleInputChange} ref={inputRef} type="file" />
                      <UploadIcon isDragOver={isDragOver} />
                      {/* FIX 1: isMounted hoạt động đúng, text hiển thị */}
                      <AnimatePresence initial={false} mode="wait">
                        {isMounted && (
                          <motion.p
                            key={isDragOver ? "drag" : "idle"}
                            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
                            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                            transition={shouldReduceMotion ? { duration: 0 } : SPRING}
                            className="font-medium text-foreground text-sm"
                          >
                            {isDragOver ? "Thả file vào đây" : "Kéo thả hoặc nhấn để chọn file"}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <p className="mt-1 text-muted-foreground text-xs">
                        Ảnh, PDF • Không giới hạn dung lượng
                      </p>
                    </motion.div>

                    <AnimatePresence>
                      {fileError && (
                        <motion.p animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm"
                          exit={{ opacity: 0, y: -4 }} initial={{ opacity: 0, y: 4 }}
                          role="alert" transition={SPRING}>
                          {fileError}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {files.length > 0 && (
                      <ul aria-label="File đã chọn" className="space-y-2">
                        <AnimatePresence initial={false}>
                          {files.map((file, index) => (
                            <motion.li
                              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 }}
                              className="flex items-center gap-3 rounded-md border bg-muted/50 px-3 py-2"
                              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.95, transition: { duration: 0.15 } }}
                              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -16, scale: 0.95 }}
                              key={`${file.name}-${file.size}-${file.lastModified}`}
                              layout={!shouldReduceMotion}
                              transition={shouldReduceMotion ? { duration: 0 } : SPRING}
                            >
                              <FileIcon />
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-foreground text-sm">{file.name}</p>
                                <p className="text-muted-foreground text-xs">{formatFileSize(file.size)}</p>
                              </div>
                              <motion.button
                                aria-label={`Xoá ${file.name}`}
                                className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                onClick={e => { e.stopPropagation(); removeFile(index) }}
                                type="button"
                                whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
                                whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
                              >
                                <svg aria-hidden="true" className="h-4 w-4" fill="none"
                                  stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </motion.button>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    )}
                    {form.formState.errors.schedules?.root && (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.schedules.root.message}
                      </p>
                    )}
                  </div>

                </FieldGroup>
              </form>
            </FormProvider>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal" className='justify-end gap-5'>
              <Button type="button" variant="outline" onClick={() => { form.reset(); setFiles([]) }}>
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