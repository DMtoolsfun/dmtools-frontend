#!/usr/bin/env python3
"""
Extract shared CSS selectors from inline <style> blocks in HTML pages and move
them into /styles.css.

Usage:
  python3 extract_shared_css.py \
    --root . \
    --styles-path /styles.css \
    --selectors-file ./shared-selectors.txt
"""

from __future__ import annotations

import argparse
import pathlib
import re
from typing import List, Tuple

MARKER_START = "/* [CANONICAL_EXTRACTED_SHARED_CSS_START] */"
MARKER_END = "/* [CANONICAL_EXTRACTED_SHARED_CSS_END] */"

DEFAULT_SELECTORS = [
    ".btn",
    ".btn-primary",
    ".btn-secondary",
    ".btn-outline",
    ".footer",
    ".footer-content",
    ".footer-links",
    ".footer-bottom",
    ".nav-container",
    ".mobile-nav",
    ".tab-btn",
    ".pricing-grid",
    ".packs-grid",
    ".price-card",
    ".card",
    ".container",
    ".auth-buttons",
    ".user-section",
    ".link-group",
]


def split_selector_group(selector_group: str) -> List[str]:
    out: List[str] = []
    buf: List[str] = []
    paren = 0
    bracket = 0
    in_str = False
    quote = ""
    i = 0
    n = len(selector_group)

    while i < n:
        ch = selector_group[i]
        if in_str:
            buf.append(ch)
            if ch == "\\" and i + 1 < n:
                i += 1
                buf.append(selector_group[i])
            elif ch == quote:
                in_str = False
            i += 1
            continue

        if ch in ("'", '"'):
            in_str = True
            quote = ch
            buf.append(ch)
            i += 1
            continue

        if ch == "(":
            paren += 1
        elif ch == ")":
            paren = max(paren - 1, 0)
        elif ch == "[":
            bracket += 1
        elif ch == "]":
            bracket = max(bracket - 1, 0)
        elif ch == "," and paren == 0 and bracket == 0:
            part = "".join(buf).strip()
            if part:
                out.append(part)
            buf = []
            i += 1
            continue

        buf.append(ch)
        i += 1

    part = "".join(buf).strip()
    if part:
        out.append(part)
    return out


def selector_matches(selector: str, base: str) -> bool:
    s = selector.strip()
    b = base.strip()
    if not s or not b:
        return False
    if s == b:
        return True
    for suffix in (" ", ":", "::", ".", "#", "[", ">", "+", "~"):
        if s.startswith(b + suffix):
            return True
    return False


def should_extract(selector_group: str, whitelist: List[str]) -> bool:
    selectors = split_selector_group(selector_group)
    for sel in selectors:
        for base in whitelist:
            if selector_matches(sel, base):
                return True
    return False


def split_top_level_statements(css: str) -> List[str]:
    out: List[str] = []
    start = 0
    depth = 0
    i = 0
    n = len(css)
    in_str = False
    quote = ""

    while i < n:
        ch = css[i]
        nxt = css[i + 1] if i + 1 < n else ""

        if in_str:
            if ch == "\\" and i + 1 < n:
                i += 2
                continue
            if ch == quote:
                in_str = False
            i += 1
            continue

        if ch in ("'", '"'):
            in_str = True
            quote = ch
            i += 1
            continue

        if ch == "/" and nxt == "*":
            end = css.find("*/", i + 2)
            if end == -1:
                break
            i = end + 2
            continue

        if ch == "{":
            depth += 1
        elif ch == "}":
            depth = max(depth - 1, 0)
            if depth == 0:
                chunk = css[start : i + 1].strip()
                if chunk:
                    out.append(chunk)
                start = i + 1
        elif ch == ";" and depth == 0:
            chunk = css[start : i + 1].strip()
            if chunk:
                out.append(chunk)
            start = i + 1
        i += 1

    tail = css[start:].strip()
    if tail:
        out.append(tail)
    return out


def process_css(css: str, whitelist: List[str]) -> Tuple[str, str]:
    kept: List[str] = []
    moved: List[str] = []

    for statement in split_top_level_statements(css):
        st = statement.strip()
        if not st:
            continue

        if st.startswith("@") and "{" in st and st.endswith("}"):
            open_idx = st.find("{")
            header = st[: open_idx + 1]
            inner = st[open_idx + 1 : -1]
            kept_inner, moved_inner = process_css(inner, whitelist)

            if kept_inner.strip():
                kept.append(f"{header}\n{kept_inner.strip()}\n}}")
            if moved_inner.strip():
                moved.append(f"{header}\n{moved_inner.strip()}\n}}")
            continue

        if st.startswith("@"):
            kept.append(st)
            continue

        open_idx = st.find("{")
        if open_idx == -1:
            kept.append(st)
            continue

        selector_group = st[:open_idx].strip()
        if should_extract(selector_group, whitelist):
            moved.append(st)
        else:
            kept.append(st)

    kept_css = "\n\n".join(kept).strip()
    moved_css = "\n\n".join(moved).strip()
    return kept_css, moved_css


def normalize_rule(rule: str) -> str:
    return re.sub(r"\s+", " ", rule).strip()


def append_to_styles(styles_text: str, rules: List[str]) -> str:
    unique_rules: List[str] = []
    existing_norm = normalize_rule(styles_text)

    for rule in rules:
        nr = normalize_rule(rule)
        if not nr:
            continue
        if nr in existing_norm:
            continue
        if any(normalize_rule(r) == nr for r in unique_rules):
            continue
        unique_rules.append(rule.strip())

    if not unique_rules:
        return styles_text

    block = "\n\n".join(unique_rules).strip()
    if not block:
        return styles_text

    if MARKER_START in styles_text and MARKER_END in styles_text:
        before, rest = styles_text.split(MARKER_START, 1)
        middle, after = rest.split(MARKER_END, 1)
        middle = middle.rstrip()
        if middle:
            middle = f"{middle}\n\n{block}\n"
        else:
            middle = f"\n{block}\n"
        return f"{before}{MARKER_START}{middle}{MARKER_END}{after}"

    return (
        styles_text.rstrip()
        + "\n\n"
        + MARKER_START
        + "\n\n"
        + block
        + "\n\n"
        + MARKER_END
        + "\n"
    )


def load_whitelist(path: pathlib.Path | None) -> List[str]:
    if not path or not path.exists():
        return DEFAULT_SELECTORS

    selectors: List[str] = []
    for line in path.read_text(encoding="utf-8", errors="ignore").splitlines():
        raw = line.strip()
        if not raw or raw.startswith("#"):
            continue
        selectors.append(raw)
    return selectors or DEFAULT_SELECTORS


def resolve_styles_path(root: pathlib.Path, styles_path: str) -> pathlib.Path:
    if styles_path.startswith("/"):
        return root / styles_path.lstrip("/")
    return root / styles_path


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract shared inline CSS into /styles.css")
    parser.add_argument("--root", default=".", help="Repo root")
    parser.add_argument("--styles-path", default="/styles.css", help="Canonical stylesheet path")
    parser.add_argument("--selectors-file", default="", help="Path to selector whitelist file")
    parser.add_argument("--recursive", action="store_true", help="Process HTML recursively")
    parser.add_argument("--dry-run", action="store_true", help="Do not write changes")
    args = parser.parse_args()

    root = pathlib.Path(args.root).resolve()
    styles_file = resolve_styles_path(root, args.styles_path)
    selectors_file = pathlib.Path(args.selectors_file).resolve() if args.selectors_file else None
    whitelist = load_whitelist(selectors_file)

    if not styles_file.exists():
        raise FileNotFoundError(f"Stylesheet not found: {styles_file}")

    if args.recursive:
        html_files = sorted(
            p
            for p in root.rglob("*.html")
            if ".git" not in p.parts and "node_modules" not in p.parts
        )
    else:
        html_files = sorted(root.glob("*.html"))

    moved_rules: List[str] = []
    style_re = re.compile(r"(<style\b[^>]*>)(.*?)(</style>)", re.IGNORECASE | re.DOTALL)
    updated_files = 0

    for html_file in html_files:
        original = html_file.read_text(encoding="utf-8", errors="ignore")

        def repl(match: re.Match[str]) -> str:
            opening, content, closing = match.group(1), match.group(2), match.group(3)
            kept_css, moved_css = process_css(content, whitelist)
            if moved_css:
                moved_rules.append(moved_css)
            if kept_css.strip():
                return f"{opening}\n{kept_css.strip()}\n{closing}"
            return ""

        updated = style_re.sub(repl, original)
        if updated != original:
            updated_files += 1
            if not args.dry_run:
                html_file.write_text(updated, encoding="utf-8")

    styles_original = styles_file.read_text(encoding="utf-8", errors="ignore")
    styles_updated = append_to_styles(styles_original, moved_rules)
    if styles_updated != styles_original and not args.dry_run:
        styles_file.write_text(styles_updated, encoding="utf-8")

    print(
        f"Processed {len(html_files)} HTML files, updated {updated_files}, "
        f"moved CSS blocks: {len(moved_rules)}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
