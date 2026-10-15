import { z } from "zod"

export const dayScheduleSchema = z.object({
  day: z.string(),
  startTime: z.string(),
  endTime: z.string(),
})

export const asymmetricScheduleSchema = z.object({
  title: z
    .string()
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự.")
    .max(32, "Tiêu đề tối đa 32 ký tự."),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  schedules: z.array(dayScheduleSchema).min(1, "Vui lòng chọn ít nhất 1 buổi học"),
})

export type AsymmetricScheduleValues = z.infer<typeof asymmetricScheduleSchema>