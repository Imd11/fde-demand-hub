# Alibaba Cloud deployment

Target: Beijing Ubuntu 24.04, Node.js 24, Nginx, PostgreSQL 16.

## Build

```sh
npm ci
npm run build:server
```

The build creates `dist/standalone` with runtime dependencies and public assets.
Deploy that directory to `/srv/fde/current`, then restart `fde.service`.
The default Cloudflare scripts are retained for the original preview environment.
The PostgreSQL intake API requires the Node deployment and a configured PostgreSQL database.

## Current deployment topology

- Company website: `/srv/cloudsequ/current`, Nginx `127.0.0.1:8080`.
- FDE: `/srv/fde/current`, Node `127.0.0.1:3001`, Nginx `127.0.0.1:8081`.
- PostgreSQL: database/role `fde`, Unix socket peer authentication; no public database port.
- Form submissions: `requirements` table. No public read endpoint or admin UI is provided.
- `schema.sql` initializes the table; run as the `fde` OS user.
- `fde.service` runs as an unprivileged user, starts on boot, and restarts on failures.
- `nginx-preview.conf` limits submission size and rate.
- Preview uses an SSH tunnel mapping local port 18080 to 8080 and 18081 to 8081.
- Public hostnames: `https://cloudsequ.com` and `https://fde.cloudsequ.com`.
- `nginx-public.conf` serves HTTPS on port 443 and redirects port 80 to HTTPS.
- `APP_ORIGIN=https://fde.cloudsequ.com`; form submission is restricted to the public FDE origin.
- Let’s Encrypt certificate renewal uses certbot.timer and an Nginx deploy hook.

## Before public launch

Public DNS and HTTPS were configured on 2026-09-28 at the owner’s request; HTTP 200
and a synthetic form submission were verified. ICP filing is still outstanding, so
current reachability does not guarantee continued provider access. Email DNS records
were preserved.
Review privacy notice/consent and retention for collected contact information;
replace or clearly identify fictional expert profiles. The company site's browser-only
password/localStorage workspace features do not provide server authentication.
Add off-server backups and verify a restore before collecting real submissions.


## AI 指令发布（已配置）

对 AI 说“把这个项目最新 main 部署上线”，AI 按 AGENTS.md 执行：

```sh
python3 scripts/deploy.py
```

脚本获取 origin/main 并固定 SHA，上传该版本源码，在北京服务器构建，保留旧版本，然后切换 current 并检查 HTTPS。FDE 会先校验 TypeScript，发布前备份 PostgreSQL 并验证备份目录可读；切换后失败会恢复上一个应用版本。官网按静态资源白名单发布。备份和旧版本留在服务器，不包含在 Git 中；还需另行配置异地备份。

这属于 AI 执行的脚本化发布，不是每次 git push 触发上线。两个项目独立发布、独立回退；“发布两个项目”时依次执行两个仓库的脚本并分别报告结果。

需要 Python 3、Git、SSH/scp、curl 和已授权的 SSH 密钥。服务器需要现有 Node 24、PostgreSQL、Nginx 和 sudo 权限。脚本不创建云资源、不改变 DNS、不执行数据库迁移。首次将原 current 目录转换为版本软链接时存在极短切换窗口，FDE 重启也会短暂中断请求。

手工回退：从发布输出中的 PREVIOUS 获取旧目录，用临时软链接加 `mv -Tf` 替换 `/srv/项目/current`；FDE 再执行 `sudo systemctl restart fde`。核对 HTTPS 后结束。不要为代码回退覆盖数据库。
