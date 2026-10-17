#!/bin/bash
set -euo pipefail
[[ $EUID == 0 ]] || { echo 'Run as root.' >&2; exit 1; }
[[ $# == 1 && -f $1 ]] || { echo 'Pass the deployment public-key file.' >&2; exit 64; }
public_key=$(cat "$1")
[[ $public_key =~ ^ssh-ed25519\ [A-Za-z0-9+/=]+(\ [^$'\n']*)?$ ]] || {
  echo 'Expected one Ed25519 public key.' >&2
  exit 64
}
scripts=$(cd -- "$(dirname -- "$0")" && pwd)
command -v flock >/dev/null
command -v python3 >/dev/null
command -v docker >/dev/null
command -v sudo >/dev/null
test -f /opt/tsintskaro/compose.yaml
test -f /opt/tsintskaro/secrets/tsintskaro.env

if ! id tsintskaro-deploy >/dev/null 2>&1; then
  useradd --system --create-home --home-dir /var/lib/tsintskaro-deploy --shell /bin/bash tsintskaro-deploy
fi
install -d -o root -g root -m 755 /usr/local/libexec /var/lib/tsintskaro-deploy /var/lib/tsintskaro-deploy/.ssh
install -o root -g root -m 755 "$scripts/deploy.sh" /usr/local/sbin/tsintskaro-deploy
install -o root -g root -m 755 "$scripts/ssh-command.sh" /usr/local/libexec/tsintskaro-deploy-ssh

temporary=$(mktemp -d)
trap 'rm -rf "$temporary"' EXIT
printf 'restrict,command="/usr/local/libexec/tsintskaro-deploy-ssh" %s\n' "$public_key" > "$temporary/authorized_keys"
# Root-owned public configuration prevents the deployment user removing the restriction.
install -o root -g root -m 644 "$temporary/authorized_keys" /var/lib/tsintskaro-deploy/.ssh/authorized_keys
cat > "$temporary/sudoers" <<'SUDOERS'
Defaults:tsintskaro-deploy env_reset, !setenv
Defaults:tsintskaro-deploy secure_path=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
tsintskaro-deploy ALL=(root) NOPASSWD: /usr/local/sbin/tsintskaro-deploy *
SUDOERS
visudo -cf "$temporary/sudoers"
install -o root -g root -m 440 "$temporary/sudoers" /etc/sudoers.d/tsintskaro-deploy
echo 'Restricted Tsintskaro deployment access installed.'
