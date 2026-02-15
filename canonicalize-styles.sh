#!/usr/bin/env bash
set -euo pipefail

# canonicalize-styles.sh
# -----------------------------------------
# Standardizes HTML pages to use /styles.css,
# appends canonical shared CSS block (once),
# then extracts shared selectors from inline
# <style> blocks into /styles.css.
# -----------------------------------------

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STYLES_FILE="${ROOT_DIR}/styles.css"
SELECTORS_FILE="${ROOT_DIR}/shared-selectors.txt"
PY_HELPER="${ROOT_DIR}/extract_shared_css.py"

if [[ ! -f "${STYLES_FILE}" ]]; then
  echo "ERROR: Missing styles file: ${STYLES_FILE}"
  exit 1
fi

if [[ ! -f "${PY_HELPER}" ]]; then
  echo "ERROR: Missing helper script: ${PY_HELPER}"
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: python3 is required."
  exit 1
fi

echo "==> Collecting HTML files in repo root..."
mapfile -t HTML_FILES < <(find "${ROOT_DIR}" -maxdepth 1 -type f -name "*.html" | sort)

if [[ ${#HTML_FILES[@]} -eq 0 ]]; then
  echo "No HTML files found."
  exit 0
fi

echo "==> Creating safety backups (.bak once, .bak2 every run)..."
for f in "${HTML_FILES[@]}" "${STYLES_FILE}"; do
  [[ -f "${f}" ]] || continue
  [[ -f "${f}.bak" ]] || cp "${f}" "${f}.bak"
  cp "${f}" "${f}.bak2"
done

echo "==> Canonicalizing stylesheet links to href=\"/styles.css\"..."
python3 - "${ROOT_DIR}" <<'PY'
import pathlib
import re
import sys

root = pathlib.Path(sys.argv[1])
html_files = sorted(root.glob("*.html"))

# Match stylesheet links and rewrite href that points to any *styles.css variant.
link_re = re.compile(
    r'(<link\b(?=[^>]*\brel\s*=\s*["\']stylesheet["\'])[^>]*\bhref\s*=\s*["\'])([^"\']+)(["\'][^>]*>)',
    re.IGNORECASE,
)

changed = 0
for path in html_files:
    text = path.read_text(encoding="utf-8", errors="ignore")

    def repl(m: re.Match[str]) -> str:
        href = m.group(2).strip()
        href_core = href.split("?", 1)[0].split("#", 1)[0].lower()
        if href_core.endswith("styles.css"):
            return f'{m.group(1)}/styles.css{m.group(3)}'
        return m.group(0)

    updated = link_re.sub(repl, text)
    if updated != text:
        path.write_text(updated, encoding="utf-8")
        changed += 1

print(f"Updated stylesheet links in {changed} HTML files.")
PY

echo "==> Ensuring canonical sitewide CSS block exists in /styles.css..."
if ! grep -q "\[CANONICAL_SITEWIDE_STYLES_V1\]" "${STYLES_FILE}"; then
  cat >> "${STYLES_FILE}" <<'CSS'

/* [CANONICAL_SITEWIDE_STYLES_V1]
   Shared baseline styles for nav, buttons, grids, and footer.
   Keep page-specific overrides inside page-level <style> blocks only.
*/
.nav-container {
  width: 100%;
  max-width: var(--container-lg, 1400px);
  margin: 0 auto;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  text-decoration: none;
  border-radius: var(--radius-md, 8px);
}

.btn-primary {
  background: var(--gradient-primary-dark, linear-gradient(135deg, #8b5cf6, #7c3aed));
  color: #fff;
}

.btn-secondary {
  background: var(--bg-card, #374151);
  color: #fff;
}

.pricing-grid,
.packs-grid {
  display: grid;
  gap: 1.25rem;
}

.price-card,
.card {
  border: 1px solid var(--border-medium, #374151);
  border-radius: var(--radius-lg, 12px);
  background: rgba(30, 41, 59, 0.95);
}

.footer {
  width: 100%;
}

.footer-content {
  display: grid;
  gap: 1.25rem;
}

.footer-links {
  display: grid;
  gap: 1rem;
}
CSS
  echo "Appended canonical sitewide CSS block."
else
  echo "Canonical sitewide CSS block already present."
fi

echo "==> Ensuring shared selector whitelist exists..."
if [[ ! -f "${SELECTORS_FILE}" ]]; then
  cat > "${SELECTORS_FILE}" <<'TXT'
# Selectors listed here are treated as shared/sitewide and extracted from
# inline <style> blocks into /styles.css by extract_shared_css.py.
# Edit this list to match your project's real shared selectors.
.btn
.btn-primary
.btn-secondary
.btn-outline
.footer
.footer-content
.footer-links
.footer-bottom
.nav-container
.mobile-nav
.tab-btn
.pricing-grid
.packs-grid
.price-card
.card
.container
.auth-buttons
.user-section
.link-group
TXT
  echo "Created ${SELECTORS_FILE}"
fi

echo "==> Extracting shared selectors from inline CSS into /styles.css..."
python3 "${PY_HELPER}" \
  --root "${ROOT_DIR}" \
  --styles-path "/styles.css" \
  --selectors-file "${SELECTORS_FILE}"

echo "==> Done."
echo "Backups available as *.bak and *.bak2"
