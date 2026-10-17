#!/bin/bash
set -euo pipefail
umask 077

revision=${1:-}
[[ $# == 1 && $revision =~ ^[0-9a-f]{40}$ ]] || {
  echo 'Expected one full Git commit SHA.' >&2
  exit 64
}

# The override supports isolated failure tests. sudo does not preserve it for SSH users.
base=${TSINTSKARO_DEPLOY_DIR:-/opt/tsintskaro}
image="local/tsintskaro:$revision"
compose="$base/compose.yaml"
candidate="tsintskaro-check-${revision:0:12}"
exec 9>"$base/.deploy.lock"
flock -w 600 9
cd "$base"
test -f "$compose"
test -f "$base/secrets/tsintskaro.env"
install -d -m 700 "$base/backups"
work=$(mktemp -d "$base/.deploy.XXXXXXXX")
rollback=false
candidate_started=false

compose_up() {
  docker compose --project-directory "$base" -f "$compose" \
    up -d --no-deps --pull never --wait --wait-timeout 150 tsintskaro
}

cleanup() {
  result=$?
  trap - EXIT HUP INT TERM
  if $rollback; then
    echo 'Deployment failed; restoring the previous release.' >&2
    if cp -p "$work/compose.before.yaml" "$compose" && compose_up; then
      echo 'Previous release restored.' >&2
    else
      echo "ROLLBACK FAILED. Restore $backup and inspect the service." >&2
    fi
    result=1
  fi
  if $candidate_started; then
    docker rm -f "$candidate" >/dev/null 2>&1 || true
  fi
  rm -rf "$work"
  exit "$result"
}
trap cleanup EXIT
trap 'exit 130' HUP INT TERM

echo "Loading release $revision."
# docker load accepts the gzip stream. No server credentials leave the VPS.
docker load --quiet
label=$(docker image inspect "$image" --format '{{index .Config.Labels "org.opencontainers.image.revision"}}')
[[ $label == "$revision" ]] || { echo 'Image revision mismatch.' >&2; exit 1; }
image_user=$(docker image inspect "$image" --format '{{.Config.User}}')
[[ $image_user == node ]] || { echo 'The application image must run as node.' >&2; exit 1; }

python3 - "$compose" "$work/compose.next.yaml" "$image" <<'PY'
import re
import sys
from pathlib import Path
source, destination, image = sys.argv[1:]
content, count = re.subn(r'(?m)^(    image: )local/tsintskaro:[^\s]+$',
                        lambda match: match[1] + image, Path(source).read_text())
if count != 1:
    raise SystemExit('Expected exactly one Tsintskaro image in compose.yaml')
Path(destination).write_text(content)
PY
# Validate without expanding or printing the runtime secrets.
docker compose --project-directory "$base" -f "$work/compose.next.yaml" config --quiet

echo 'Checking the new image before switching the live service.'
candidate_started=true
# Compose must parse the same quoted and multiline environment file as production.
# A one-off run does not publish service ports or claim the production network alias.
docker compose --project-directory "$base" -f "$work/compose.next.yaml" \
  run -d --no-deps --pull never --name "$candidate" -T tsintskaro >/dev/null
docker exec "$candidate" node -e '
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  (async () => {
    for (let attempt = 0; ; attempt++) {
      try {
        const r = await fetch("http://127.0.0.1:3000/", {signal: AbortSignal.timeout(4000)});
        if (!r.ok) throw new Error(`Home returned ${r.status}`);
        break;
      } catch (error) {
        if (attempt >= 29) throw error;
        await sleep(2000);
      }
    }
    for (const path of ["/", "/language", "/history", "/language/materials", "/society"]) {
      const r = await fetch(`http://127.0.0.1:3000${path}`, {signal: AbortSignal.timeout(10000)});
      if (r.status !== 200) throw new Error(`${path} returned ${r.status}`);
      if (path === "/language") {
        const html = await r.text();
        if (!html.includes("Только разобранные") || !html.includes("Слово разобрано")) {
          throw new Error("Dictionary is missing reviewed-word controls or data");
        }
      }
    }
  })().catch(error => { console.error(error.message); process.exit(1); });
'
docker rm -f "$candidate" >/dev/null
candidate_started=false

cp -p "$compose" "$work/compose.before.yaml"
backup="$base/backups/compose-before-$(date -u +%Y%m%dT%H%M%S)-$revision.yaml"
cp -p "$compose" "$backup"
rollback=true
cp "$work/compose.next.yaml" "$compose"
compose_up

echo 'Verifying HTTPS through the production proxy.'
for host in tsintskaro.tw1.ru; do
  for path in / /language /history /language/materials /society; do
    curl --fail --silent --show-error --retry 3 --retry-all-errors \
      --connect-timeout 5 --max-time 20 --resolve "$host:443:127.0.0.1" \
      "https://$host$path" --output /dev/null
  done
done
printf '%s\n' "$revision" > "$work/revision"
mv "$work/revision" "$base/DEPLOYED_REVISION"
rollback=false
echo "Successfully deployed $revision."
