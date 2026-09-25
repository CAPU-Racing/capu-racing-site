"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { initialAdminState } from "@/lib/admin";
import { previewAction, saveContentAction } from "@/app/(admin)/admin/actions";
import { NEWS_CATEGORIES, QA_CATEGORIES } from "@/lib/content-meta";
import { cx } from "@/lib/motion";

/**
 * 内容编辑器
 * ---------------------------------------------------------------------------
 * 预览走服务端的同一套 Markdown 管线，因此「预览」与「前台渲染」必然一致；
 * 不在客户端再实现一个 Markdown 渲染器，避免两边规则漂移。
 */

type EditorKind = "news" | "qa";

export type EditorInitial = {
  slug: string;
  markdown: string;
  fields: Record<string, string>;
};

function Input({
  label,
  name,
  defaultValue,
  error,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="type-label-sm text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={cx(
          "mt-2 h-10 w-full border-b bg-transparent text-[0.9375rem] outline-none transition-colors duration-300",
          error ? "border-signal" : "border-line-strong focus:border-cap",
        )}
      />
      {error && <p className="mt-2 text-[0.75rem] text-signal">{error}</p>}
    </div>
  );
}

function Select({
  label,
  name,
  options,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="type-label-sm text-muted">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        className={cx(
          "mt-2 h-10 w-full appearance-none border-b bg-transparent text-[0.9375rem] outline-none transition-colors duration-300",
          error ? "border-signal" : "border-line-strong focus:border-cap",
        )}
      >
        <option value="" disabled>
          请选择
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-[0.75rem] text-signal">{error}</p>}
    </div>
  );
}

export function ContentEditor({
  kind,
  initial,
}: {
  kind: EditorKind;
  initial?: EditorInitial;
}) {
  const [state, formAction, pending] = useActionState(
    saveContentAction,
    initialAdminState,
  );
  const [markdown, setMarkdown] = useState(initial?.markdown ?? "");
  const [preview, setPreview] = useState<string | null>(null);
  const [previewing, startPreview] = useTransition();

  const errors = state.fieldErrors ?? {};
  const isNew = !initial;
  const basePath = kind === "news" ? "/admin/news" : "/admin/qa";

  const handlePreview = () => {
    if (preview !== null) {
      setPreview(null);
      return;
    }
    startPreview(async () => {
      const html = await previewAction(markdown);
      setPreview(html);
    });
  };

  return (
    <form action={formAction} className="space-y-10">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="originalSlug" value={initial?.slug ?? ""} />

      {/* 元数据 */}
      <section>
        <div className="flex items-center gap-4">
          <span className="type-label text-faint">元数据</span>
          <span aria-hidden className="h-px flex-1 bg-line" />
        </div>

        <div className="mt-6 grid gap-7 sm:grid-cols-2">
          <Input
            label={kind === "news" ? "标题" : "问题标题"}
            name={kind === "news" ? "title" : "question"}
            defaultValue={
              initial?.fields.title ?? initial?.fields.question ?? ""
            }
            error={kind === "news" ? errors.title : errors.question}
            placeholder={
              kind === "news"
                ? "例如：新赛季整车设计冻结"
                : "例如：零基础可以加入车队吗？"
            }
          />

          <Input
            label="标识（URL / 文件名）"
            name="slug"
            defaultValue={initial?.slug ?? ""}
            error={errors.slug}
            placeholder={kind === "news" ? "2026-season-start" : "join-02"}
          />

          <Select
            label="分类"
            name="category"
            defaultValue={initial?.fields.category ?? ""}
            error={errors.category}
            options={
              kind === "news"
                ? NEWS_CATEGORIES.map((item) => ({
                    value: item.id,
                    label: item.label,
                  }))
                : QA_CATEGORIES.map((item) => ({
                    value: item.id,
                    label: item.label,
                  }))
            }
          />

          {kind === "news" ? (
            <Input
              label="发布日期（YYYY-MM-DD）"
              name="date"
              defaultValue={initial?.fields.date ?? ""}
              error={errors.date}
              placeholder="2026-09-01"
            />
          ) : (
            <Input
              label="排序权重（数字越小越靠前）"
              name="order"
              type="number"
              defaultValue={initial?.fields.order ?? "10"}
              error={errors.order}
            />
          )}

          {kind === "news" && (
            <>
              <Input
                label="标签（英文逗号分隔）"
                name="tags"
                defaultValue={initial?.fields.tags ?? ""}
                placeholder="招新, 报名"
              />
              <div className="sm:col-span-2">
                <label htmlFor="excerpt" className="type-label-sm text-muted">
                  摘要
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows={2}
                  defaultValue={initial?.fields.excerpt ?? ""}
                  className="mt-2 w-full resize-y border-b border-line-strong bg-transparent py-2 text-[0.9375rem] leading-relaxed outline-none transition-colors duration-300 focus:border-cap"
                  placeholder="列表页展示的一到两句话。留空则自动截取正文。"
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* 正文 */}
      <section>
        <div className="flex items-center gap-4">
          <span className="type-label text-faint">正文（Markdown）</span>
          <span aria-hidden className="h-px flex-1 bg-line" />
          <button
            type="button"
            onClick={handlePreview}
            className="type-label-sm text-muted transition-colors duration-300 hover:text-cap"
          >
            {preview !== null ? "关闭预览" : previewing ? "渲染中…" : "预览"}
          </button>
        </div>

        <div
          className={cx(
            "mt-6 grid gap-8",
            preview !== null && "lg:grid-cols-2",
          )}
        >
          <div>
            <textarea
              name="markdown"
              value={markdown}
              onChange={(event) => setMarkdown(event.target.value)}
              rows={22}
              spellCheck={false}
              aria-invalid={Boolean(errors.markdown)}
              className={cx(
                "w-full resize-y border bg-surface p-4 text-[0.875rem] leading-[1.75] outline-none transition-colors duration-300",
                errors.markdown ? "border-signal" : "border-line focus:border-cap",
              )}
              placeholder={
                "## 小标题\n\n正文支持 **加粗**、列表与表格。\n\n- 第一点\n- 第二点"
              }
              style={{ fontFamily: "var(--font-mono)" }}
            />
            {errors.markdown && (
              <p className="mt-2 text-[0.75rem] text-signal">
                {errors.markdown}
              </p>
            )}
          </div>

          {preview !== null && (
            <div className="glass-panel rounded-card border border-line p-5">
              <p className="type-label-sm text-faint">预览</p>
              <div
                className="prose-capu mt-4"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            </div>
          )}
        </div>
      </section>

      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="border-l-2 border-signal bg-signal/5 px-4 py-3 text-[0.875rem] text-signal"
        >
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-8">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-hair bg-cap px-7 text-[0.9375rem] font-medium text-white transition-colors duration-300 hover:bg-cap-700 disabled:opacity-60"
        >
          {pending ? "保存中…" : isNew ? "创建" : "保存修改"}
        </button>
        <Link
          href={basePath}
          className="type-label-sm text-muted transition-colors duration-300 hover:text-fg"
        >
          取消
        </Link>
      </div>
    </form>
  );
}
