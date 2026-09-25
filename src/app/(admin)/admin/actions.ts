"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import {
  QA_CATEGORIES,
  NEWS_CATEGORIES,
  assertSafeSlug,
  contentFileExists,
  deleteContentFile,
  writeNewsFile,
  writeQaFile,
} from "@/lib/content";
import { adminConfigured, isAuthenticated, signIn, signOut } from "@/lib/auth";

/**
 * 后台服务端动作
 * ---------------------------------------------------------------------------
 * 每个动作都先做一次鉴权：Server Action 是可以被直接调用的公开端点，
 * 不能依赖「页面上看不到入口」来当作权限控制。
 */

export type ActionResult = {
  status: "idle" | "ok" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function loginAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (!adminConfigured()) {
    return {
      status: "error",
      message:
        "后台尚未配置：请在 .env.local 中设置 ADMIN_PASSWORD 与 ADMIN_SESSION_SECRET。",
    };
  }

  const password = String(formData.get("password") ?? "");
  const ok = await signIn(password);

  if (!ok) {
    return { status: "error", message: "密码不正确" };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logoutAction() {
  await signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}

/* ============================ 内容读写 ============================ */

const NEWS_CATEGORY_IDS = NEWS_CATEGORIES.map((item) => item.id);
const QA_CATEGORY_IDS = QA_CATEGORIES.map((item) => item.id);

function revalidateContent() {
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/qa");
  revalidatePath("/admin");
}

export async function saveContentAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (!(await isAuthenticated())) {
    return { status: "error", message: "会话已过期，请重新登录。" };
  }

  const kind = String(formData.get("kind") ?? "");
  const slug = String(formData.get("slug") ?? "").trim();
  const originalSlug = String(formData.get("originalSlug") ?? "").trim();
  const markdown = String(formData.get("markdown") ?? "");
  const fieldErrors: Record<string, string> = {};

  if (kind !== "news" && kind !== "qa") {
    return { status: "error", message: "内容类型不正确。" };
  }

  try {
    assertSafeSlug(slug);
  } catch {
    fieldErrors.slug = "标识只能用小写字母、数字与连字符，不超过 80 个字符";
  }

  if (markdown.trim().length < 10) {
    fieldErrors.markdown = "正文太短了，至少写一段内容";
  }

  // 新建时不允许覆盖已有文件
  if (!originalSlug && slug && contentFileExists(kind, slug) && !fieldErrors.slug) {
    fieldErrors.slug = "这个标识已经被占用了，换一个";
  }

  if (kind === "news") {
    const title = String(formData.get("title") ?? "").trim();
    const date = String(formData.get("date") ?? "").trim();
    const category = String(formData.get("category") ?? "");
    const excerpt = String(formData.get("excerpt") ?? "").trim();
    const tags = String(formData.get("tags") ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (title.length < 2) fieldErrors.title = "请填写标题";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      fieldErrors.date = "日期格式应为 2026-01-01";
    }
    if (!NEWS_CATEGORY_IDS.includes(category as never)) {
      fieldErrors.category = "请选择分类";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { status: "error", message: "有几处还需要修改", fieldErrors };
    }

    await writeNewsFile(
      slug,
      { title, date, category, excerpt, tags },
      markdown,
    );

    if (originalSlug && originalSlug !== slug) {
      deleteContentFile("news", originalSlug);
    }

    revalidateContent();
    revalidatePath(`/news/${slug}`);
    redirect("/admin/news");
  }

  // Q&A
  const question = String(formData.get("question") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const order = Number(formData.get("order"));

  if (question.length < 4) fieldErrors.question = "请填写问题标题";
  if (!QA_CATEGORY_IDS.includes(category as never)) {
    fieldErrors.category = "请选择分类";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "有几处还需要修改", fieldErrors };
  }

  await writeQaFile(
    slug,
    {
      question,
      category,
      order: Number.isFinite(order) ? order : 999,
    },
    markdown,
  );

  if (originalSlug && originalSlug !== slug) {
    deleteContentFile("qa", originalSlug);
  }

  revalidateContent();
  redirect("/admin/qa");
}

export async function deleteContentAction(formData: FormData) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const kind = String(formData.get("kind") ?? "");
  const slug = String(formData.get("slug") ?? "");

  if (kind === "news" || kind === "qa") {
    deleteContentFile(kind, slug);
    revalidateContent();
    redirect(kind === "news" ? "/admin/news" : "/admin/qa");
  }

  redirect("/admin");
}

/** 后台预览：复用与前台完全相同的 Markdown 管线，保证所见即所得 */
export async function previewAction(markdown: string): Promise<string> {
  if (!(await isAuthenticated())) return "";

  const file = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);

  return String(file);
}
