#!/usr/bin/env bash
# Run as root on the FDE server with the reviewed SQL path as argument.
set -euo pipefail
[[ $EUID -eq 0 ]] || { echo 'Run with sudo' >&2; exit 1; }
sql=${1:?migration SQL path required}
[[ -f $sql ]] || { echo 'Migration SQL is missing' >&2; exit 1; }
install -d -m 700 /var/backups/fde
backup=$(mktemp -d /var/backups/fde/pre-admin.XXXXXXXX)
chmod 700 "$backup"
sudo -u postgres pg_dump -Fc fde > "$backup/database.dump"
pg_restore -l "$backup/database.dump" > "$backup/database.contents"
sha256sum "$backup/database.dump" > "$backup/database.sha256"
sudo -u fde psql -v ON_ERROR_STOP=1 -1 -d fde -f "$sql"
echo "Admin migration applied; backup: $backup"
