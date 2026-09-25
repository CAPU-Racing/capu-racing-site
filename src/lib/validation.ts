import { z } from "zod";
import { gradeOptions, intentOptions } from "@/lib/site";

/**
 * 表单校验
 * ---------------------------------------------------------------------------
 * 同一份 schema 在服务端（Server Action）复用，
 * 前端只负责把 fieldErrors 映射到对应字段上，避免两套校验规则漂移。
 */

const grades = gradeOptions as unknown as [string, ...string[]];
const intents = intentOptions.map((item) => item.value) as unknown as [
  string,
  ...string[],
];

/** 不校验长度上限的说明性文本 */
const trimmed = (max: number) => z.string().trim().max(max);

export const applicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "请填写姓名（至少 2 个字）")
    .max(20, "姓名过长"),
  studentId: z
    .string()
    .trim()
    .regex(/^[0-9A-Za-z-]{4,20}$/, "请填写学号（4–20 位字母或数字）"),
  college: z
    .string()
    .trim()
    .min(2, "请填写学院与专业")
    .max(40, "内容过长"),
  grade: z.enum(grades, { message: "请选择年级" }),
  phone: z
    .string()
    .trim()
    .regex(/^1[3-9]\d{9}$/, "请填写 11 位手机号，便于联系"),
  wechat: z.string().trim().min(2, "请填写微信号").max(30, "内容过长"),
  intent: z.enum(intents, { message: "请选择意向组别" }),
  intro: trimmed(500).optional().default(""),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;

/** 把 zod 的错误摊平成「字段 → 首条错误」的映射 */
export function toFieldErrors(
  issues: { path: (string | number | symbol)[]; message: string }[],
): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
