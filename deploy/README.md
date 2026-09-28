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

## Current preview topology

- Company website: `/srv/cloudsequ/current`, Nginx `127.0.0.1:8080`.
- FDE: `/srv/fde/current`, Node `127.0.0.1:3001`, Nginx `127.0.0.1:8081`.
- PostgreSQL: database/role `fde`, Unix socket peer authentication; no public database port.
- Form submissions: `requirements` table. No public read endpoint or admin UI is provided.
- `schema.sql` initializes the table; run as the `fde` OS user.
- `fde.service` runs as an unprivileged user, starts on boot, and restarts on failures.
- `nginx-preview.conf` limits submission size and rate.
- Preview uses an SSH tunnel mapping local port 18080 to 8080 and 18081 to 8081.
- `APP_ORIGIN=http://localhost:18081` is intentionally limited to the local preview.

## Before public launch

Complete ICP filing for the mainland deployment. Configure DNS without changing the
existing email MX/TXT/CNAME records. Obtain HTTPS certificates and configure public
Nginx listeners. Change `APP_ORIGIN` to `https://fde.cloudsequ.com` and restart FDE.
Review privacy notice/consent and retention for collected contact information;
replace or clearly identify fictional expert profiles. The company site's browser-only
password/localStorage workspace features do not provide server authentication.
Add off-server backups and verify a restore before collecting real submissions.

## Repository and deployment

GitHub stores the source; the first deployment is a manually built artifact upload.
Pushing GitHub changes does not automatically update this server yet. Do not put SSH
private keys or database credentials in either repository. Configure an approved CI
workflow separately when release and access policies are agreed.
