"use server";

import { appendApplication } from "@/lib/store";
import { applicationSchema, toFieldErrors } from "@/lib/validation";
import type { JoinState } from "@/lib/join";

/**
 * 报名提交
 * ---------------------------------------------------------------------------
 * 校验只在服务端执行一次（同一份 schema 供前后端复用），
 * 前端只负责把返回的 fieldErrors 贴到对应字段上。
 */

const FIELDS = [
  "name",
  "studentId",
  "college",
  "grade",
  "phone",
  "wechat",
  "intent",
  "intro",
] as const;

export async function submitApplication(
  _prev: JoinState,
  formData: FormData,
): Promise<JoinState> {
  // 蜜罐字段：正常用户看不到也不会填，填了就当作机器人，静默忽略
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success", reference: "—" };
  }

  const raw: Record<string, string> = {};
  for (const field of FIELDS) {
    raw[field] = String(formData.get(field) ?? "").trim();
  }

  const parsed = applicationSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "表单里有几处还需要修改",
      fieldErrors: toFieldErrors(parsed.error.issues),
      values: raw,
    };
  }

  try {
    const record = appendApplication({
      name: parsed.data.name,
      studentId: parsed.data.studentId,
      college: parsed.data.college,
      grade: parsed.data.grade,
      phone: parsed.data.phone,
      wechat: parsed.data.wechat,
      intent: parsed.data.intent,
      intro: parsed.data.intro ?? "",
    });

    return {
      status: "success",
      message: "报名已提交",
      reference: record.id,
    };
  } catch {
    return {
      status: "error",
      message: "提交时出现异常，请稍后重试，或通过「联系我们」直接联系车队。",
      values: raw,
    };
  }
}
