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

## Repository and deployment

GitHub stores the source; the first deployment is a manually built artifact upload.
Pushing GitHub changes does not automatically update this server yet. Do not put SSH
private keys or database credentials in either repository. Configure an approved CI
workflow separately when release and access policies are agreed.
