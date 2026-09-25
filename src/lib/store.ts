import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/**
 * 报名数据存储
 * ---------------------------------------------------------------------------
 * 采用按行追加的 JSONL 文件：写入是 O(1) 追加，不会因为并发写而互相覆盖，
 * 也便于直接导出成表格。数据量增长后可以替换为数据库，
 * 只需保持这三个导出函数的签名不变。
 */

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "applications.jsonl");

export type Application = {
  id: string;
  createdAt: string;
  name: string;
  studentId: string;
  college: string;
  grade: string;
  phone: string;
  wechat: string;
  intent: string;
  intro: string;
};

export type ApplicationInput = Omit<Application, "id" | "createdAt">;

function ensureFile() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "", "utf8");
}

/** 报名编号：日期 + 4 位随机，便于线下核对 */
function makeId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const rand = crypto.randomInt(0, 10000).toString().padStart(4, "0");
  return `CAPU-${date}-${rand}`;
}

export function appendApplication(input: ApplicationInput): Application {
  ensureFile();

  const record: Application = {
    id: makeId(),
    createdAt: new Date().toISOString(),
    ...input,
  };

  fs.appendFileSync(FILE, `${JSON.stringify(record)}\n`, "utf8");
  return record;
}

export function listApplications(): Application[] {
  if (!fs.existsSync(FILE)) return [];

  return fs
    .readFileSync(FILE, "utf8")
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      try {
        return JSON.parse(line) as Application;
      } catch {
        return null;
      }
    })
    .filter((item): item is Application => item !== null)
    .reverse();
}

export function countApplications(): number {
  return listApplications().length;
}
