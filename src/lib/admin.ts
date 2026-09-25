/** 后台动作的共享类型（'use server' 文件不能导出常量） */
export type AdminState = {
  status: "idle" | "ok" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const initialAdminState: AdminState = { status: "idle" };
