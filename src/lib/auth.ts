import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * 后台会话
 * ---------------------------------------------------------------------------
 * 不引入额外的认证依赖：密码用环境变量配置，
 * 会话是一次性生成的 HMAC 签名令牌，放在 httpOnly cookie 里。
 * 令牌自带过期时间，签名校验使用时间安全比较，避免时序侧信道。
 */

const COOKIE_NAME = "capu_admin";
const SESSION_SECONDS = 60 * 60 * 8;

function sessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 16 ? secret : null;
}

function adminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  return password && password.length >= 4 ? password : null;
}

/** 未配置环境变量时后台不可用，前端会给出明确提示而不是静默失败 */
export function adminConfigured() {
  return sessionSecret() !== null && adminPassword() !== null;
}

function sign(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function createToken(): string | null {
  const secret = sessionSecret();
  if (!secret) return null;

  const expires = Date.now() + SESSION_SECONDS * 1000;
  const payload = `admin.${expires}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyToken(token: string | undefined): boolean {
  const secret = sessionSecret();
  if (!secret || !token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [scope, expiresRaw, signature] = parts;
  if (scope !== "admin") return false;

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  const expected = sign(`${scope}.${expiresRaw}`, secret);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}

/** 校验密码并写入会话 cookie；返回是否成功 */
export async function signIn(password: string): Promise<boolean> {
  const expected = adminPassword();
  if (!expected) return false;

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(password ?? "", "utf8");
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) return false;

  const token = createToken();
  if (!token) return false;

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });

  return true;
}

export async function signOut() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
