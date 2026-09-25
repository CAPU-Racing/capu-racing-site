/**
 * 报名表单的共享类型。
 * 单独放在这里而不是 actions.ts：'use server' 文件只能导出异步函数，
 * 而客户端组件需要初始状态常量，不能从那边取。
 */

export type JoinState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** 报名编号，成功时返回 */
  reference?: string;
  fieldErrors?: Record<string, string>;
  /** 出错时回填用户已填内容，避免重填 */
  values?: Record<string, string>;
};

export const initialJoinState: JoinState = { status: "idle" };
