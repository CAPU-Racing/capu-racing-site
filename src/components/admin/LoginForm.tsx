"use client";

import { useActionState } from "react";
import { initialAdminState } from "@/lib/admin";
import { loginAction } from "@/app/(admin)/admin/actions";

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialAdminState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <div>
        <label htmlFor="password" className="type-label text-fg">
          访问密码
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          disabled={!configured}
          className="mt-3 h-11 w-full border-b border-line-strong bg-transparent text-[0.9375rem] outline-none transition-colors duration-300 focus:border-cap disabled:opacity-50"
          placeholder="请输入后台密码"
        />
      </div>

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="border-l-2 border-signal bg-signal/5 px-4 py-3 text-[0.875rem] text-signal"
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !configured}
        className="inline-flex h-12 items-center justify-center gap-3 rounded-hair bg-cap px-7 text-[0.9375rem] font-medium text-white transition-colors duration-300 hover:bg-cap-700 disabled:pointer-events-none disabled:opacity-50"
      >
        {pending ? "正在验证…" : "登录后台"}
      </button>
    </form>
  );
}
