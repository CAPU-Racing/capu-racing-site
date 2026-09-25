# 部署文档

成航 CAPU 大学生方程式车队官网的部署、运维与故障排查。

> 内容怎么改（Q&A / 赛事动态 / 公告 / 联系方式）看 [`CONTENT.md`](./CONTENT.md)，
> 本文只讲部署与运维。

---

## 0. 先读这一节：三个硬性前提

这三点是架构决定的，绕过它们会导致「看起来部署成功了，但功能是坏的」。

| 前提 | 原因 | 不做会怎样 |
| --- | --- | --- |
| **必须常驻一个 Node 进程** | 后台 `/admin` 用 Server Action 直接读写服务器文件；`/qa`、`/news` 是 `force-dynamic` 按请求渲染 | 当成纯静态站（`output: export`、只传 `out/` 目录）会直接失效 |
| **`content/` 与 `data/` 必须可写且持久化** | 后台改内容写入 `content/*.md`，报名表单追加写入 `data/applications.jsonl` | 容器重建/发版后报名数据丢失；后台保存报错 |
| **`NEXT_PUBLIC_SITE_URL` 必须在构建前设好** | 该变量会被 Next **在构建期内联**到产物里（已实测：运行期改它无效） | sitemap、canonical、OG 里的域名是错的，且改了不生效直到重新构建 |

---

## 1. 环境要求

| 项目 | 要求 |
| --- | --- |
| Node.js | 20 LTS 或更高。本项目在 **Node 24.11.1** 上验证通过 |
| npm | 随 Node 附带即可（**10.8.2 与 11.6.2 均验证通过**）。但改依赖后生成 `package-lock.json` 有坑，见 §9 |
| 构建期内存 | 建议预留 **1.5–2 GB** 可用内存，见下方说明 |
| 运行期内存 | 常驻约 **150–300 MB** |
| 磁盘 | 很小（产物 + `node_modules` 约 500 MB） |
| 出网 | 构建时需要访问 Google Fonts（`next/font` 在构建期下载字体） |

### 构建期内存：为什么要限制 worker 数

`next.config.ts` 里设置了：

```ts
experimental: {
  cpus: Math.max(1, Number(process.env.NEXT_BUILD_CPUS) || 4),
}
```

原因：构建的「收集页面数据 / 生成静态页面」阶段会**按 CPU 核数派生 worker 进程**，Next 默认用 `核数 - 1` 个。在 32 核机器上就是 31 个 Node 进程同时申请内存。即使物理内存还剩 2 GB，只要系统**提交量（Commit）**接近上限，构建就会以

```
FATAL ERROR: Zone Allocation failed - process out of memory
```

直接崩掉（注意：这个报错看起来像内存不足，实际瓶颈可能是 Commit 上限，不是物理内存）。

默认 4 个 worker 对本项目（十几个路由）足够。需要更保守时用环境变量覆盖：

```bash
NEXT_BUILD_CPUS=1 npm run build
```

### ⚠️ 不要用 `next dev` 验证部署

两个原因，都踩过：

1. `next dev` 的内存占用远高于 `next start`，在内存紧张的机器上首次编译就会 OOM。
2. `next dev` 会被终端回收后变成**孤儿进程继续存活**，它监视文件、一有改动就重编译，会把生产用的 `.next` 覆盖成开发产物。之后浏览器里所有 `/_next/static/chunks/*.js` 都会返回 `400`，页面报 `ChunkLoadError`。

**验证部署一律用 `npm run build` + `npm run start`。**

---

## 2. 环境变量

复制 `.env.example` 为 `.env.local`（服务器上也可以直接用 `export` 或进程管理器注入）：

```bash
cp .env.example .env.local      # Windows: copy .env.example .env.local
```

| 变量 | 必填 | 说明 | 生效时机 |
| --- | --- | --- | --- |
| `ADMIN_PASSWORD` | 是 | 后台登录密码 | 运行期 |
| `ADMIN_SESSION_SECRET` | 是 | 会话 cookie 签名密钥 | 运行期 |
| `NEXT_PUBLIC_SITE_URL` | 是 | 站点对外地址，用于 sitemap / canonical / OG | **构建期** ⚠️ |

### 三个容易踩的坑

**① 长度不足会静默禁用后台。** 代码里有最小长度校验（`src/lib/auth.ts`）：

- `ADMIN_PASSWORD` 至少 **4** 位
- `ADMIN_SESSION_SECRET` 至少 **16** 位

不满足时 `adminConfigured()` 返回 `false`，`/admin` 会显示配置引导页，而不是报错——容易被误判成「密码记错了」。

生成密钥：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**② `NEXT_PUBLIC_SITE_URL` 改了必须重新构建。** 实测验证：同一个构建产物，用不同的 `NEXT_PUBLIC_SITE_URL` 启动两次，`sitemap.xml` 输出的域名完全相同（都是构建时的那份）。运行期修改这个变量**不会生效**。

> 注意：本地 `.env.local` 里是开发用的 `http://localhost:…`。上线前务必改成真实域名，
> 并且**改完要重新 `npm run build`**。

**③ 端口不是靠 `NEXT_PUBLIC_SITE_URL` 改的。** 这个变量只影响生成的元数据，**不决定服务监听哪个端口**。把它的端口从 3100 改成 3123，服务依然会监听 3000。

端口只有两种改法：

```bash
npm run start -- -p 3123                 # 命令行参数（推荐）
npx next start -p 3123 -H 127.0.0.1      # 不带 npm 时

PORT=3123 npm run start                  # 进程级环境变量；systemd 用 Environment=PORT=3123
```

默认 **3000**。两种方式在 systemd / PM2 / Docker 里都对应得上：

- systemd：`Environment=PORT=3123`
- PM2：写进 `ecosystem.config.js` 的 `env: { PORT: 3123 }`
- Docker：`ENV PORT=3123`（镜像里已有 `PORT=3000`，改成你要的即可）

⚠️ **`.env.local` 里写 `PORT=3123` 是无效的**：Next 的命令行在**解析参数阶段**就读走了 `process.env.PORT`（并拿 3000 当默认值），而 `.env` 文件是在那之后才由服务进程加载的。

> 改完端口后，把 `NEXT_PUBLIC_SITE_URL` 的端口也改成一致，并**重新 `npm run build`**；
> 否则 sitemap / OG 卡片里的链接会指向打不开的地址。

---

## 3. 方式 A：直接跑 Node（推荐起步）

### 3.1 首次部署

```bash
git clone <仓库地址> /srv/capu-racing
cd /srv/capu-racing

npm ci                 # 用 ci 而不是 install，锁死 package-lock.json 的版本
cp .env.example .env.local
vi .env.local          # 填三个变量，NEXT_PUBLIC_SITE_URL 写真实域名

npm run build
npm run start          # 默认监听 0.0.0.0:3000
```

指定端口与监听地址：

```bash
npx next start -p 8080 -H 127.0.0.1
```

### 3.2 用 PM2 常驻

```bash
npm i -g pm2
```

`ecosystem.config.js`（放在项目根目录）：

```js
module.exports = {
  apps: [
    {
      name: "capu-racing",
      cwd: "/srv/capu-racing",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      env: { NODE_ENV: "production" },
      // 内存异常增长时自动重启，避免把整机拖垮
      max_memory_restart: "600M",
      // 只跑一个实例：内容写入是基于文件的，多实例会互相覆盖
      instances: 1,
      exec_mode: "fork",
    },
  ],
};
```

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup            # 按提示执行输出的那条命令，实现开机自启
```

> **不要用 `cluster` 模式起多实例。** 内容与报名数据都存在本机文件里，
> 多进程写入会互相覆盖，且各进程的读缓存可能不一致。

### 3.3 用 systemd 常驻（Linux）

`/etc/systemd/system/capu-racing.service`：

```ini
[Unit]
Description=CAPU Racing Website
After=network.target

[Service]
Type=simple
User=capu
WorkingDirectory=/srv/capu-racing
EnvironmentFile=/srv/capu-racing/.env.local
Environment=NODE_ENV=production
ExecStart=/usr/bin/node node_modules/next/dist/bin/next start -p 3000 -H 127.0.0.1
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now capu-racing
sudo journalctl -u capu-racing -f
```

`EnvironmentFile` 要求 `KEY=value` 格式且不能有 `export`，`.env.local` 的写法正好符合。

### 3.4 Windows

用 [NSSM](https://nssm.cc/) 注册为服务：

```powershell
nssm install capu-racing "C:\Program Files\nodejs\node.exe" "node_modules\next\dist\bin\next" "start" "-p" "3000"
nssm set capu-racing AppDirectory "D:\srv\capu-racing"
nssm set capu-racing AppEnvironmentExtra NODE_ENV=production
nssm start capu-racing
```

> Windows 上若用 IIS 做反向代理，需要装 URL Rewrite + ARR 并把 `proxy` 指向
> `http://127.0.0.1:3000`。更省事的做法是直接用 Nginx for Windows 或 Cloudflare Tunnel。

---

## 4. 方式 B：Docker

容器化前先在 `next.config.ts` 顶层加一行（Next 官方的精简产物模式）：

```ts
const nextConfig: NextConfig = {
  output: "standalone",
  // …其余保持不变
};
```

`Dockerfile`：

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_SITE_URL 必须在构建阶段可见，否则会被内联成默认值
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# 内容目录随镜像带一份，首次启动时作为初始内容
COPY --from=builder --chown=nextjs:nodejs /app/content ./content
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/content /app/data
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

`compose.yaml`：

```yaml
services:
  web:
    build:
      context: .
      args:
        NEXT_PUBLIC_SITE_URL: https://racing.example.com
    environment:
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      ADMIN_SESSION_SECRET: ${ADMIN_SESSION_SECRET}
    ports:
      - "127.0.0.1:3000:3000"
    volumes:
      # 用 bind mount 把内容目录挂出来：后台改的内容留在宿主机上，
      # 重建镜像不会丢，也方便直接查看/备份/交给 git 管理
      - ./content:/app/content
      - ./data:/app/data
    restart: unless-stopped
```

```bash
docker compose up -d --build
```

### 容器化的两个注意点

1. **不要用 named volume 挂 `content/`。** named volume 首次挂载时是空的，会把镜像里带的内容目录盖掉，站点直接没有任何 Q&A 和动态。要用 bind mount（如上），或先用镜像里的内容初始化卷。
2. **构建参数与运行变量的区别。** `NEXT_PUBLIC_SITE_URL` 必须通过 `build.args` 传（构建期内联）；`ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` 通过 `environment` 传（运行期读取）。

---

## 5. 反向代理与 HTTPS（Nginx）

```nginx
server {
    listen 80;
    server_name racing.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name racing.example.com;

    ssl_certificate     /etc/letsencrypt/live/racing.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/racing.example.com/privkey.pem;

    # 报名表最大体积很小，10m 足够且能挡住异常大包
    client_max_body_size 10m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
        proxy_read_timeout 60s;
    }

    # 带 hash 的静态资源可以长缓存
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

> **不要缓存 HTML 与 `/admin`。** 内容页是 `force-dynamic` 按请求渲染的，
> 由 CDN 或代理缓存 HTML 会导致「后台改完前台不更新」，这类问题很隐蔽。

---

## 6. 内容怎么更新（两条流程，别混用）

这是运维上最容易出问题的地方：`content/` **既在 git 里，又会被服务器上的后台直接改写**。

### 流程一：本地改 → 提交 → 部署（推荐）

```bash
# 本地
cd content/qa && vi basics-01.md
git add content && git commit -m "更新 Q&A：xxx"
git push

# 服务器
cd /srv/capu-racing && git pull && npm run build && pm2 restart capu-racing
```

优点：有版本历史、可回滚、可评审。**改内容也要重新构建吗？** 内容页是
`force-dynamic`，理论上不用；但 `sitemap.xml`、OG 元信息等与构建有关，
而且不重新构建也无害，因此这里统一带上 `npm run build` 最省心。

### 流程二：直接在服务器上用 `/admin` 改

适合招新期间由非技术成员临时发通知：

1. 打开 `https://<域名>/admin`，输入 `ADMIN_PASSWORD`
2. 改完点保存，内容立即写入服务器的 `content/*.md`
3. **改完请务必把文件同步回仓库**，否则下次 `git pull` 会冲突或覆盖：

```bash
cd /srv/capu-racing
git status                     # 会看到 content/ 下有改动
git diff content
git add content && git commit -m "招新期间线上更新"
git push
```

### 混用会出什么问题

服务器上改过内容但没提交，之后执行 `git pull` 时：

- 若远端也动了同一个文件 → **merge 冲突**，非技术成员很难处理；
- 若没有冲突但本地有未提交改动 → `git pull` 可能被拒绝，或被误用 `git checkout .` 覆盖掉。

**建议：招新期间只用流程二，招新结束后统一同步一次仓库，并把这段时间的内容改动合并回主分支。**

---

## 7. 备份与恢复

需要备份的只有两样：**报名数据** 和 **内容文件**。

```bash
# 每日备份（crontab -e 加一行）
0 3 * * * cd /srv/capu-racing && tar czf /var/backups/capu-$(date +\%F).tgz data content
```

| 数据 | 路径 | 敏感性 | 备份建议 |
| --- | --- | --- | --- |
| 报名信息 | `data/applications.jsonl` | **含手机号、微信号等个人信息** | 必须备份，且不要进公开仓库 |
| 内容 | `content/**/*.md` | 可公开 | 走 git 即可，额外备份更稳 |

`data/applications.jsonl` 已加入 `.gitignore`，不要为了「方便」把它提交上去。

导出成表格：

```bash
# 有 jq 时
jq -r '[.createdAt,.name,.studentId,.college,.grade,.phone,.wechat,.intent] | @csv' \
  data/applications.jsonl > applications.csv
```

恢复：把 `data/` 与 `content/` 解压回原位，重启进程即可，无需重新构建。

---

## 8. 升级与回滚

```bash
cd /srv/capu-racing
git tag deploy-$(date +%F)      # 打标记，方便回滚
git pull
npm ci
npm run build
pm2 restart capu-racing         # 或 sudo systemctl restart capu-racing
```

回滚：

```bash
git checkout <上一个 tag 或 commit>
npm ci && npm run build
pm2 restart capu-racing
```

**建议保留上一版产物**：把 `.next` 备份成 `.next.bak` 再构建，出问题可以直接换回来，省一次构建时间。

---

## 9. 常见故障排查

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `npm ci` 报 `EUSAGE`，提示 `Missing: @emnapi/runtime@… from lock file` | 锁文件缺少 wasm32 可选包（`@tailwindcss/oxide-wasm32-wasi`、`@img/sharp-wasm32`）**自带依赖**的条目。npm 11 生成锁文件时会漏掉这些条目，npm 10 校验时判定「不同步」 | 在项目目录跑一次 `npm install` 补齐锁文件（只新增 `@emnapi/*` 等 8 个条目，不改任何已有版本），之后 `npm ci` 即可通过 |
| 构建报 `Zone Allocation failed - process out of memory` | 构建期 worker 太多，Commit 内存被占满 | `NEXT_BUILD_CPUS=1 npm run build`；或先释放内存再构建 |
| 页面报 `ChunkLoadError`，且 `/_next/static/chunks/*.js` 全部返回 **400** | 有**孤儿 `next dev` 进程**在监视项目目录，把 `.next` 覆盖成了开发产物 | 见下方命令，杀掉所有 dev 进程 → 删 `.next` → 重新构建 |
| `/admin` 提示「配置引导」而非密码框 | `ADMIN_PASSWORD` < 4 位，或 `ADMIN_SESSION_SECRET` < 16 位 | 检查变量长度 |
| 登录提示「密码不正确」但密码没错 | 运行的是另一个进程/另一份环境变量 | 确认进程实际加载的环境变量；改 `.env.local` 后要重启进程 |
| 后台保存内容报错 | 运行用户对 `content/` 无写权限 | `chown -R <运行用户> content` |
| 报名提交失败 / 后台看不到报名 | 运行用户对 `data/` 无写权限，或容器重建导致数据丢失 | 修权限；把 `data/` 挂成持久化卷 |
| sitemap / 分享卡片的域名不对 | `NEXT_PUBLIC_SITE_URL` 是构建期内联的 | 改好后**重新构建**，不是重启 |
| 后台改完前台不更新 | 中间有代理/CDN 缓存了 HTML | 对 HTML 与 `/admin` 关闭缓存 |
| 字体加载失败或构建卡在字体下载 | 构建机无法访问 Google Fonts | 放通出网，或用 `next/font/local` 改为本地字体 |

排查孤儿进程：

```powershell
# Windows
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Where-Object { $_.CommandLine -match 'next' } |
  ForEach-Object { "$($_.ProcessId) :: $($_.CommandLine)" }
```

```bash
# Linux / macOS
ps -eo pid,command | grep -i 'next' | grep -v grep
```

判断当前 `.next` 是不是开发产物：**存在 `.next/static/development/` 目录就说明是**。

彻底恢复：

```bash
# 先杀掉所有 next dev / next start 进程，然后
rm -rf .next
npm run build
npm run start
```

---

## 10. 上线前检查清单

- [ ] `.env.local` 里 `NEXT_PUBLIC_SITE_URL` 已改为真实域名，**并且已重新构建**
- [ ] `ADMIN_PASSWORD` 已改掉默认值，长度 ≥ 4
- [ ] `ADMIN_SESSION_SECRET` 是随机生成的长字符串，长度 ≥ 16
- [ ] `data/` 已确认可写且已纳入备份，且**没有**被提交到仓库
- [ ] `content/` 已确认可写且已纳入版本管理
- [ ] HTTPS 已配置，`http` 已 301 跳转到 `https`
- [ ] 反向代理**未**缓存 HTML 与 `/admin`
- [ ] 只跑单个实例（`instances: 1` / 单副本）
- [ ] 已确认没有孤儿 `next dev` 进程
- [ ] 用一个测试报名走通表单，并在 `/admin` 里看到该条记录，然后删掉测试数据
- [ ] `src/lib/site.ts` 中的联系方式占位值已替换（见 [`CONTENT.md`](./CONTENT.md)）
