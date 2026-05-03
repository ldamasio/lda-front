#!/usr/bin/env bash
# Usage:
#   ./scripts/notes-publish.sh notes/my-note.en.mdx
#   ./scripts/notes-publish.sh --all-locales my-note
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  ./scripts/notes-publish.sh <path-to-note.mdx>
  ./scripts/notes-publish.sh --all-locales <slug-or-path>

Examples:
  ./scripts/notes-publish.sh notes/prompt-governance.en.mdx
  ./scripts/notes-publish.sh --all-locales prompt-governance
EOF
}

strip_locale_suffix() {
  local slug="$1"
  case "$slug" in
    *.en) echo "${slug%.en}" ;;
    *.de) echo "${slug%.de}" ;;
    *.es) echo "${slug%.es}" ;;
    *.fr) echo "${slug%.fr}" ;;
    *.it) echo "${slug%.it}" ;;
    *.pt) echo "${slug%.pt}" ;;
    *.zh) echo "${slug%.zh}" ;;
    *) echo "$slug" ;;
  esac
}

assert_utf8() {
  local file="$1"

  if command -v iconv >/dev/null 2>&1; then
    if ! iconv -f UTF-8 -t UTF-8 "$file" >/dev/null; then
      echo "Invalid UTF-8 encoding: $file" >&2
      exit 1
    fi
  fi
}

publish_file() {
  local file="$1"
  local slug public_slug

  if [[ ! -f "$file" ]]; then
    echo "File not found: $file" >&2
    exit 1
  fi

  assert_utf8 "$file"

  slug=$(basename "$file" .mdx)
  public_slug=$(strip_locale_suffix "$slug")

  echo "Publishing: $slug -> s3://$BUCKET/lda/notes/$slug.mdx"

  aws s3 cp "$file" "s3://$BUCKET/lda/notes/$slug.mdx" \
    --endpoint-url "$ENDPOINT" \
    --content-type "text/plain; charset=utf-8" \
    --acl public-read

  echo "Done. Variant live at /notes/$public_slug after the next request."
}

resolve_base_slug() {
  local input="$1"
  local name

  name=$(basename "$input")
  name="${name%.mdx}"
  strip_locale_suffix "$name"
}

PUBLISH_ALL_LOCALES=false

if [[ "${1:-}" == "--all-locales" ]]; then
  PUBLISH_ALL_LOCALES=true
  shift
fi

if [[ $# -ne 1 ]]; then
  usage >&2
  exit 1
fi

INPUT="$1"
BUCKET="${CONTABO_S3_CONTENT_BUCKET:-rbx-content}"
ENDPOINT="${CONTABO_S3_ENDPOINT:-https://eu2.contabostorage.com}"

if [[ "$PUBLISH_ALL_LOCALES" == "true" ]]; then
  BASE_SLUG=$(resolve_base_slug "$INPUT")
  FOUND=0

  for locale in en de es fr it pt zh; do
    file="notes/${BASE_SLUG}.${locale}.mdx"
    if [[ -f "$file" ]]; then
      publish_file "$file"
      FOUND=1
    fi
  done

  if [[ "$FOUND" -eq 0 ]]; then
    echo "No note files found for slug: $BASE_SLUG" >&2
    exit 1
  fi

  exit 0
fi

publish_file "$INPUT"
