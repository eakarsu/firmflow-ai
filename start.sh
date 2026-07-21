#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
app_dir="${RUNTIME_PROJECT_SOURCE:-$project_dir}"
runtime_port="${PORT:-${BACKEND_PORT:-}}"
[[ "$runtime_port" =~ ^[0-9]+$ ]] || { echo "PORT or BACKEND_PORT must be an assigned numeric port" >&2; exit 2; }
if lsof -tiTCP:"$runtime_port" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Assigned port $runtime_port is already in use; no process was stopped" >&2
  exit 1
fi
export PORT="$runtime_port"

for name in DATABASE_URL NEXTAUTH_URL NEXTAUTH_SECRET; do
  eval "value=\${$name:-}"
  if [ -z "$value" ]; then echo "$name is required" >&2; exit 1; fi
done
if [ "${#NEXTAUTH_SECRET}" -lt 32 ]; then echo "NEXTAUTH_SECRET must be at least 32 characters" >&2; exit 1; fi
cd "$app_dir"
if [[ "${NODE_ENV:-development}" == production ]]; then
  case "$NEXTAUTH_URL" in https://*) ;; *) echo "NEXTAUTH_URL must use HTTPS for a production start" >&2; exit 1;; esac
  exec yarn start -H 127.0.0.1 -p "$runtime_port"
fi
exec yarn dev -H 127.0.0.1 -p "$runtime_port"
