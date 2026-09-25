"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useActionState } from "react";
import { cx, DUR, EASE_OUT_EXPO } from "@/lib/motion";
import { gradeOptions, intentOptions } from "@/lib/site";
import { initialJoinState } from "@/lib/join";
import { submitApplication } from "@/app/(site)/join/actions";

/* ============================ 字段外壳 ============================ */

function Field({
  label,
  labelEn,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  labelEn: string;
  name: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={name} className="type-label text-fg">
          {label}
          <span className="text-cap" aria-hidden>
            *
          </span>
        </label>
        <span className="type-label-sm text-faint">{labelEn}</span>
      </div>

      <div className="mt-3">{children}</div>

      {hint && !error && (
        <p id={hintId} className="mt-2 text-[0.75rem] text-faint">
          {hint}
        </p>
      )}

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: DUR.fast, ease: EASE_OUT_EXPO }}
            className="overflow-hidden text-[0.75rem] text-signal"
          >
            <span className="mt-2 inline-block">{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass = (invalid: boolean) =>
  cx(
    "h-11 w-full rounded-none border-b bg-transparent text-[0.9375rem] text-fg outline-none transition-colors duration-300 placeholder:text-faint",
    invalid ? "border-signal" : "border-line-strong focus:border-cap",
  );

/* ============================ 成功状态 ============================ */

function SuccessPanel({ reference }: { reference?: string }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DUR.slow, ease: EASE_OUT_EXPO }}
      className="glass-panel rounded-card border border-line p-7 sm:p-9"
    >
      <div className="flex items-center gap-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cap">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
            <path
              d="M2.5 8.5l3.5 3.5 7.5-8"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-cap"
            />
          </svg>
        </span>
        <p className="type-label text-cap">提交成功</p>
      </div>

      <h2 className="type-h2 mt-6">报名已收到</h2>
      <p className="mt-4 max-w-[44ch] leading-relaxed text-muted">
        车队会在招新周期内通过手机或微信联系你。请留意陌生来电，微信好友申请会备注「CAPU 车队」。
      </p>

      <dl className="mt-8 border-t border-line">
        <div className="flex items-baseline justify-between gap-4 border-b border-line py-3.5">
          <dt className="type-label-sm text-faint">报名编号</dt>
          <dd className="type-label text-fg" data-numeric>
            {reference ?? "—"}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-line py-3.5">
          <dt className="type-label-sm text-faint">下一步</dt>
          <dd className="text-[0.875rem]">等待车队联系并约定见面时间</dd>
        </div>
      </dl>

      <p className="type-label-sm mt-6 leading-relaxed text-faint">
        建议截图保存报名编号。若一周内未收到联系，可通过「联系我们」页面催一下。
      </p>
    </motion.div>
  );
}

/* ============================ 表单 ============================ */

export function JoinForm() {
  const [state, formAction, pending] = useActionState(
    submitApplication,
    initialJoinState,
  );

  if (state.status === "success") {
    return <SuccessPanel reference={state.reference} />;
  }

  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  return (
    <form action={formAction} noValidate className="space-y-8">
      {/* 蜜罐：对用户不可见 */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-8 sm:grid-cols-2">
        <Field
          label="姓名"
          labelEn="Name"
          name="name"
          error={errors.name}
        >
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClass(Boolean(errors.name))}
            placeholder="请输入真实姓名"
          />
        </Field>

        <Field
          label="学号"
          labelEn="Student ID"
          name="studentId"
          error={errors.studentId}
        >
          <input
            id="studentId"
            name="studentId"
            type="text"
            inputMode="numeric"
            defaultValue={values.studentId}
            aria-invalid={Boolean(errors.studentId)}
            aria-describedby={errors.studentId ? "studentId-error" : undefined}
            className={inputClass(Boolean(errors.studentId))}
            placeholder="用于核对在校身份"
          />
        </Field>

        <Field
          label="学院 / 专业"
          labelEn="College / Major"
          name="college"
          error={errors.college}
        >
          <input
            id="college"
            name="college"
            type="text"
            defaultValue={values.college}
            aria-invalid={Boolean(errors.college)}
            aria-describedby={errors.college ? "college-error" : undefined}
            className={inputClass(Boolean(errors.college))}
            placeholder="例如：航空维修产业学院 / 无人机应用技术"
          />
        </Field>

        <Field label="年级" labelEn="Year" name="grade" error={errors.grade}>
          <div className="relative">
            <select
              id="grade"
              name="grade"
              defaultValue={values.grade ?? ""}
              aria-invalid={Boolean(errors.grade)}
              className={cx(
                inputClass(Boolean(errors.grade)),
                "appearance-none pr-8",
              )}
            >
              <option value="" disabled>
                请选择
              </option>
              {gradeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
        </Field>

        <Field
          label="联系电话"
          labelEn="Phone"
          name="phone"
          error={errors.phone}
          hint="仅用于招新期间联系，不会对外公开"
        >
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            defaultValue={values.phone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
            className={inputClass(Boolean(errors.phone))}
            placeholder="11 位手机号"
          />
        </Field>

        <Field
          label="微信号"
          labelEn="WeChat"
          name="wechat"
          error={errors.wechat}
        >
          <input
            id="wechat"
            name="wechat"
            type="text"
            defaultValue={values.wechat}
            aria-invalid={Boolean(errors.wechat)}
            aria-describedby={errors.wechat ? "wechat-error" : undefined}
            className={inputClass(Boolean(errors.wechat))}
            placeholder="便于添加好友"
          />
        </Field>
      </div>

      <Field
        label="意向组别"
        labelEn="Preferred System"
        name="intent"
        error={errors.intent}
        hint="不确定选哪个就选「暂不确定」，见面交流时一起判断"
      >
        <div className="relative">
          <select
            id="intent"
            name="intent"
            defaultValue={values.intent ?? ""}
            aria-invalid={Boolean(errors.intent)}
            aria-describedby={errors.intent ? "intent-error" : "intent-hint"}
            className={cx(
              inputClass(Boolean(errors.intent)),
              "appearance-none pr-8",
            )}
          >
            <option value="" disabled>
              请选择
            </option>
            {intentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Chevron />
        </div>
      </Field>

      <Field
        label="个人简介 / 为什么想加入"
        labelEn="About You"
        name="intro"
        error={errors.intro}
        hint="可以写：对什么感兴趣、做过什么、想学到什么。没做过相关的事也可以直接写「零基础，想学」"
      >
        <textarea
          id="intro"
          name="intro"
          rows={5}
          defaultValue={values.intro}
          aria-invalid={Boolean(errors.intro)}
          aria-describedby={errors.intro ? "intro-error" : "intro-hint"}
          className={cx(
            inputClass(Boolean(errors.intro)),
            "h-auto resize-y border border-line p-3 leading-relaxed focus:border-cap",
          )}
          placeholder="不用写得很正式，说清楚你想做什么就够了。"
        />
      </Field>

      <div className="flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="type-label-sm max-w-[38ch] leading-relaxed text-faint">
          提交即表示同意车队在招新期间使用你的联系方式与你联系。
        </p>

        <button
          type="submit"
          disabled={pending}
          className="group relative inline-flex h-14 shrink-0 items-center justify-center gap-3 overflow-hidden rounded-hair bg-cap px-8 text-[0.9375rem] font-medium text-white transition-colors duration-300 hover:bg-cap-700 disabled:pointer-events-none disabled:opacity-60"
        >
          <span className="relative z-10">
            {pending ? "正在提交…" : "提交报名"}
          </span>
          <svg
            viewBox="0 0 16 8"
            className={cx(
              "relative z-10 h-2 w-4 overflow-visible transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              pending ? "animate-pulse" : "group-hover:translate-x-1",
            )}
            fill="none"
          >
            <path
              d="M0 4h13M10 1l3 3-3 3"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="square"
            />
          </svg>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {state.status === "error" && state.message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: DUR.fast, ease: EASE_OUT_EXPO }}
            className="overflow-hidden"
            role="alert"
          >
            <p className="border-l-2 border-signal bg-signal/5 px-4 py-3 text-[0.875rem] text-signal">
              {state.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 10 6"
      aria-hidden
      className="pointer-events-none absolute right-1 top-1/2 h-1.5 w-2.5 -translate-y-1/2 text-faint"
      fill="none"
    >
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
