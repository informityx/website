#!/usr/bin/env python3
"""
Sync PDF articles from docs/articles into the News & Insights CMS cards section.

PDF text uses PyMuPDF layout blocks: wrapped lines in one block merge into a single <p> so the
browser reflows at full width; bullets / numbers become <ul>/<ol>; standalone title-like lines
become <h2> (ends with ":" or short title-case heading heuristics). Paragraphs that contain
inline bullet characters (• etc.) split into <p> + <ul> + optional trailing <p>.

For each PDF not yet listed in scripts/blogs/news-articles-synced.txt:
  - Extract text (PyMuPDF) and the first embedded image (optional upload).
  - GET current section JSON, append one card, PUT merged content.
  - GET the public news page and check the new slug/heading appears.
  - Append the PDF path to the state file on success.

Environment (repo-root .env then .env.local; the latter overrides):
  CMS_BASE_URL          default https://informityx.com — MUST match the site where NextAuth runs
                        (same host as NEXTAUTH_URL / AUTH_URL on Vercel). If sign-in redirects to
                        another domain (e.g. .ai while you used .com), set CMS_BASE_URL to that URL.
  NEXT_PUBLIC_APP_URL   fallback base URL if CMS_BASE_URL unset
  CMS_ADMIN_EMAIL       required for PUT /api/media and PUT /api/sections
  CMS_ADMIN_PASSWORD
  NEWS_SECTION_ID       default cmnjd7aku0003k8w1pmfkho18
  NEWS_ARTICLES_DIR     default <repo>/docs/articles
  NEWS_SYNC_STATE_FILE  default <repo>/scripts/blogs/news-articles-synced.txt
  NEWS_VERIFY_URL       default {CMS_BASE_URL}/news-and-insights

Usage:
  pip install -r scripts/blogs/requirements-news-articles-sync.txt
  python3 scripts/blogs/sync_news_articles_from_pdfs.py
  python3 scripts/blogs/sync_news_articles_from_pdfs.py --dry-run
"""

from __future__ import annotations

import argparse
import html
import os
import re
import sys
import uuid
from pathlib import Path
from typing import Any

import requests

try:
    import fitz  # PyMuPDF
except ImportError as e:
    print("Missing PyMuPDF. Run: pip install -r scripts/blogs/requirements-news-articles-sync.txt", file=sys.stderr)
    raise SystemExit(1) from e

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
DEFAULT_ARTICLES_DIR = REPO_ROOT / "docs" / "articles"
DEFAULT_STATE_FILE = Path(__file__).resolve().parent / "news-articles-synced.txt"
DEFAULT_SECTION_ID = "cmnjd7aku0003k8w1pmfkho18"


def load_dotenv_file(path: Path, *, override: bool = False) -> None:
    if not path.is_file():
        return
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        val = val.strip()
        if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
            val = val[1:-1]
        if key and (override or key not in os.environ):
            os.environ[key] = val


def base_url() -> str:
    return (
        os.environ.get("CMS_BASE_URL")
        or os.environ.get("NEXT_PUBLIC_APP_URL")
        or "https://informityx.com"
    ).rstrip("/")


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-") or "article"


def heading_from_pdf_path(path: Path) -> str:
    stem = path.stem
    stem = re.sub(r"\s*_?04_09\s*$", "", stem, flags=re.IGNORECASE).strip()
    stem = re.sub(r"\s+", " ", stem.replace("_", " ")).strip()
    return stem or path.stem


# PDF list / layout heuristics (PyMuPDF text "dict" blocks, reading order by bbox)
_ORDERED_LIST_PREFIX = re.compile(r"^\s*\d{1,3}[\.\)]\s+")
_UNORDERED_LIST_PREFIX = re.compile(
    r"^\s*(?:[\u2022\u2023\u25CF\u25CB\u25AA\u25E6\u2043\u2219•●○▪·‣⁃▸➤]|[\-–\*])\s*"
)


def _sorted_text_blocks(page: fitz.Page) -> list[dict[str, Any]]:
    data = page.get_text("dict") or {}
    blocks = [b for b in data.get("blocks", []) if b.get("type") == 0]
    blocks.sort(key=lambda b: (round(b["bbox"][1], 2), round(b["bbox"][0], 2)))
    return blocks


def _block_lines(block: dict[str, Any]) -> list[str]:
    out: list[str] = []
    for line in block.get("lines", []):
        t = "".join(s.get("text", "") for s in line.get("spans", []))
        t = t.replace("\u00a0", " ").replace("\u2009", " ").replace("\u200b", "")
        t = t.rstrip()
        if t.strip():
            out.append(t)
    return out


def _is_ordered_list_line(line: str) -> bool:
    return bool(_ORDERED_LIST_PREFIX.match(line))


def _is_unordered_list_line(line: str) -> bool:
    if _is_ordered_list_line(line):
        return False
    return bool(_UNORDERED_LIST_PREFIX.match(line))


def _strip_ordered_prefix(line: str) -> str:
    return _ORDERED_LIST_PREFIX.sub("", line, count=1).strip()


def _strip_unordered_prefix(line: str) -> str:
    return _UNORDERED_LIST_PREFIX.sub("", line, count=1).strip()


_HEADING_SMALL_WORDS = frozenset(
    "a an the and or but in on at to for of with by from as into vs per via is are if "
    "nor not no so yet nor".split()
)


def _collapse_whitespace(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


# Split "intro • item one • item two" (PDF often merges lists into one text block)
_INLINE_BULLET_SPLIT_LEAD = re.compile(
    r"(?:^|\s+)(?:[•\u2022\u2023\u25CF\u2043\u25E6·])\s+",
    re.UNICODE,
)

# After last list item, body text sometimes glued (e.g. "...experience. For businesses...")
_TRAILING_AFTER_LIST = re.compile(
    r"\.\s+((?:For|The|This|These|When|While|However,|Additionally,|Furthermore,|InforMityx|Businesses|Companies|Organizations)\s+)",
    re.IGNORECASE,
)


def _peel_trailing_after_last_li(last_item: str) -> tuple[str, str]:
    m = _TRAILING_AFTER_LIST.search(last_item)
    if not m or m.start() < 40:
        return last_item, ""
    item = last_item[: m.start() + 1].strip()
    trailing = last_item[m.start() + 1 :].lstrip()
    return item, trailing


def _plain_to_html_with_inline_bullets(text: str) -> str:
    """
    If plain text contains inline • bullets (common when PyMuPDF merges a list into one block),
    emit <p> intro, <ul><li>...</li></ul>, and optional trailing <p>.
    """
    t = _collapse_whitespace(text)
    if not t:
        return ""
    parts = [p.strip() for p in _INLINE_BULLET_SPLIT_LEAD.split(t)]
    if len(parts) < 3:
        return f"<p>{html.escape(t)}</p>"
    intro = parts[0]
    items = parts[1:]
    if len(items) < 2:
        return f"<p>{html.escape(t)}</p>"
    last_item, trailing = _peel_trailing_after_last_li(items[-1])
    items[-1] = last_item
    chunks: list[str] = []
    if intro:
        chunks.append(f"<p>{html.escape(intro)}</p>")
    lis = "".join(f"<li><p>{html.escape(it)}</p></li>" for it in items if it)
    chunks.append(f"<ul>{lis}</ul>")
    if trailing:
        chunks.append(f"<p>{html.escape(_collapse_whitespace(trailing))}</p>")
    return "".join(chunks)


def _heading_has_body_language(s: str) -> bool:
    """True if text reads like a sentence / body copy, not a section title."""
    low = s.lower().strip()
    if "," in s:
        return True
    if re.search(
        r"\b("
        r"will|shall|must|should|could|would|"
        r"explores?|explaining|explains?|discusses?|describes?|"
        r"specializ(es|ing)|integrates?|integrating|evaluates?|considers?|"
        r"understands?|understanding|highlights?|emphasizes?|"
        r"demonstrates?|indicates?|suggests?|shows?|means?|"
        r"exemplifies?|streamlines?|enables?|allows?|helps?|ensures?|"
        r"there\s+is|there\s+are|it\s+is|they\s+are|we\s+are|you\s+can|one\s+can|"
        r"make\s+ai|make\s+an|make\s+the"
        r")\b",
        low,
    ):
        return True
    if re.search(r"\b(can|may)\s+\w", low):
        return True
    bad_prefixes = (
        "this article",
        "these articles",
        "the article",
        "the expected",
        "to evaluate",
        "when ",
        "if ",
        "while ",
        "as a ",
        "as the ",
        "several key",
        "many ",
        "some ",
        "post-launch",
        "these advantages",
        "key benefits of",
    )
    if any(low.startswith(p) for p in bad_prefixes):
        return True
    if low.startswith("informityx"):
        return True
    return False


def _looks_like_heading_line(ln: str) -> bool:
    """
    Heuristic for PDF lines that are section titles (not body copy).
    Tuned for title-case one-liners like "Significance for Startup and Enterprise Success".
    """
    s = ln.strip()
    if len(s) < 15 or len(s) > 160:
        return False
    if _is_ordered_list_line(s) or _is_unordered_list_line(s):
        return False
    if ". " in s:
        return False
    # "Label: body" is split in _lines_to_segment; do not treat as one <h2>
    if ": " in s and not s.endswith(":"):
        return False
    if s.endswith(":"):
        if len(s) > 120:
            return False
        return not _heading_has_body_language(s)
    if s.endswith((",", ";")):
        return False
    if _heading_has_body_language(s):
        return False
    words = s.split()
    if len(words) > 11:
        return False
    if len(words) < 2:
        return False
    if s.endswith(".") and len(s) > 55:
        return False
    if s[0].islower():
        return False
    # Subtitle glued in PDF, e.g. "...Efficiency Artificial Intelligence (AI)"
    if "(" in s and ")" in s and len(s) > 55:
        return False

    # Two-word section titles, e.g. "Expected Outcomes"
    if len(words) == 2:
        a, b = words[0].strip("()\"'«»”“‘’"), words[1].strip("()\"'«»”“‘’")
        if not a or not b or len(a) < 3 or len(b) < 3:
            return False
        if not (a[0].isupper() and b[0].isupper()):
            return False
        if len(s) > 80 or s.endswith("."):
            return False
        if a.lower() in _HEADING_SMALL_WORDS and b.lower() in _HEADING_SMALL_WORDS:
            return False
        return True

    if len(words) < 3:
        return False

    content_words: list[str] = []
    for w in words:
        w = w.strip("()\"'«»”“‘’")
        if not w:
            continue
        low = w.lower()
        if low in _HEADING_SMALL_WORDS:
            continue
        content_words.append(w)
    if len(content_words) < 2:
        return False

    def word_looks_title(w: str) -> bool:
        if not w:
            return True
        if w[0].isdigit():
            return True
        if w.isupper() and len(w) <= 5:
            return True
        return w[0].isupper()

    titled = sum(1 for w in content_words if word_looks_title(w))
    return titled >= max(2, int(len(content_words) * 0.55))


def _looks_like_embedded_heading(cand: str) -> bool:
    """Stricter than standalone: used only after '. ' inside merged paragraphs."""
    if not _looks_like_heading_line(cand):
        return False
    words = cand.split()
    if len(words) < 5:
        return False
    low = cand.lower()
    if low.startswith("the ") and len(words) <= 6:
        return False
    return True


_BODY_START_WORDS = frozenset(
    "the a an this these that those it we they by in on for one each when while "
    "after before during many some most there here what how why where who which "
    "all both any every launching building using integrating developers customers "
    "businesses companies organizations products post".split()
)


def _word_starts_body_sentence(word: str) -> bool:
    """True if the next token after a candidate heading likely starts body copy (not another heading)."""
    w = word.strip("()'\"”“‘’")
    if not w:
        return False
    if w[0].islower():
        return True
    return w.lower().rstrip(",;:") in _BODY_START_WORDS


def _merged_block_to_html(merged: str) -> tuple[str, str]:
    """
    One PDF text block as a single flowing string -> HTML with optional embedded <h2>
    after ". Title Case Heading NextWord ...".
    """
    plain_full = _collapse_whitespace(merged)
    if not plain_full:
        return "", ""
    s = plain_full
    parts_html: list[str] = []
    seg_start = 0
    search_from = 0
    n = len(s)

    while True:
        j = s.find(". ", search_from)
        if j == -1:
            tail = s[seg_start:].strip()
            if tail:
                parts_html.append(_plain_to_html_with_inline_bullets(tail))
            return plain_full, "".join(parts_html)
        k = j + 2
        while k < n and s[k].isspace():
            k += 1
        if k >= n:
            tail = s[seg_start:].strip()
            if tail:
                parts_html.append(_plain_to_html_with_inline_bullets(tail))
            return plain_full, "".join(parts_html)
        words = s[k:].split()
        found = 0
        # Shortest valid heading first — avoids swallowing body text into <h2>
        for t in range(3, min(15, len(words))):
            cand = " ".join(words[:t])
            if _looks_like_embedded_heading(cand) and _word_starts_body_sentence(words[t]):
                found = t
                break
        if found:
            para = s[seg_start : j + 1].strip()
            parts_html.append(_plain_to_html_with_inline_bullets(para))
            h2t = " ".join(words[:found])
            parts_html.append(f"<h2>{html.escape(h2t)}</h2>")
            s = " ".join(words[found:])
            n = len(s)
            seg_start = 0
            search_from = 0
        else:
            search_from = j + 2


def _lines_to_segment(lines: list[str]) -> tuple[str, str] | None:
    """
    One visual block -> (plain_text_for_overview, html_fragment).
    Lists become ul/ol; headings -> h2; body lines in one block merge into one <p> (browser wraps).
    """
    non_empty = [ln for ln in lines if ln.strip()]
    if not non_empty:
        return None

    if len(non_empty) == 1:
        ln = non_empty[0].strip()
        if (
            ": " in ln
            and not _is_ordered_list_line(ln)
            and not _is_unordered_list_line(ln)
        ):
            label, rest = ln.split(": ", 1)
            label, rest = label.strip(), rest.strip()
            if (
                4 <= len(label) <= 80
                and len(rest) >= 12
                and len(label.split()) <= 10
                and not _heading_has_body_language(label + ":")
            ):
                plain_rest, html_rest = _merged_block_to_html(rest)
                plain_full = f"{label}: {plain_rest}".strip()
                return plain_full, f"<h2>{html.escape(label)}</h2>{html_rest}"
        if _looks_like_heading_line(ln):
            return ln, f"<h2>{html.escape(ln)}</h2>"

    all_u = all(_is_unordered_list_line(ln) for ln in non_empty)
    all_o = all(_is_ordered_list_line(ln) for ln in non_empty)

    if all_u and len(non_empty) >= 1:
        items = [_collapse_whitespace(_strip_unordered_prefix(ln)) for ln in non_empty]
        plain = "\n".join(items)
        lis = "".join(f"<li><p>{html.escape(it)}</p></li>" for it in items)
        return plain, f"<ul>{lis}</ul>"

    if all_o and len(non_empty) >= 1:
        items = [_collapse_whitespace(_strip_ordered_prefix(ln)) for ln in non_empty]
        plain = "\n".join(items)
        lis = "".join(f"<li><p>{html.escape(it)}</p></li>" for it in items)
        return plain, f"<ol>{lis}</ol>"

    # One block -> flowing <p> (no <br>); headings after ". " become <h2>
    merged = _collapse_whitespace(" ".join(ln.strip() for ln in non_empty))
    return _merged_block_to_html(merged)


def pdf_text_segments(doc: fitz.Document) -> list[tuple[str, str]]:
    """Extract (plain, html) segments in reading order across all pages."""
    segments: list[tuple[str, str]] = []
    for page_idx in range(doc.page_count):
        page = doc.load_page(page_idx)
        for block in _sorted_text_blocks(page):
            seg = _lines_to_segment(_block_lines(block))
            if seg:
                segments.append(seg)
    return segments


def build_overview_and_detail(segments: list[tuple[str, str]]) -> tuple[str, str, str]:
    """Returns overview, description (same as overview), detail_html."""
    if not segments:
        return "No extractable text from PDF.", "No extractable text from PDF.", "<p></p>"

    overview_parts: list[str] = []
    i = 0
    while i < len(segments) and sum(len(p) for p in overview_parts) < 380:
        overview_parts.append(segments[i][0])
        i += 1
    overview = "\n\n".join(overview_parts).strip()
    if len(overview) > 900:
        overview = overview[:897].rsplit(" ", 1)[0] + "…"

    body_segments = segments[i:] if i else segments
    if not body_segments:
        body_segments = segments

    detail_html = "".join(html for _, html in body_segments)
    return overview, overview, detail_html


def first_pdf_image_bytes(doc: fitz.Document) -> tuple[bytes, str] | None:
    for page_idx in range(doc.page_count):
        for img in doc.get_page_images(page_idx, full=True):
            xref = img[0]
            try:
                info = doc.extract_image(xref)
            except (ValueError, RuntimeError):
                continue
            data = info.get("image")
            ext = (info.get("ext") or "png").lower()
            if data and ext in ("png", "jpeg", "jpg", "webp"):
                mime = "image/jpeg" if ext in ("jpeg", "jpg") else f"image/{ext}"
                return data, mime
    return None


def read_state(path: Path) -> set[str]:
    if not path.is_file():
        return set()
    out: set[str] = set()
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            out.add(line)
    return out


def append_state(path: Path, rel_path: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(rel_path + "\n")


def rel_posix_from_repo(path: Path) -> str:
    try:
        return path.resolve().relative_to(REPO_ROOT.resolve()).as_posix()
    except ValueError:
        return path.resolve().as_posix()


def sign_in(session: requests.Session, origin: str, email: str, password: str) -> None:
    r = session.get(f"{origin}/api/auth/csrf", timeout=60)
    r.raise_for_status()
    csrf = r.json().get("csrfToken")
    if not csrf:
        raise RuntimeError("No csrfToken from /api/auth/csrf")

    body = {
        "csrfToken": csrf,
        "email": email,
        "password": password,
        "redirect": "false",
        "json": "true",
    }
    r2 = session.post(
        f"{origin}/api/auth/callback/credentials",
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=60,
        allow_redirects=False,
    )
    loc = r2.headers.get("location") or ""
    if r2.status_code not in (200, 302) or "error=" in loc:
        hint = ""
        if "error=Configuration" in loc:
            hint = (
                " NextAuth `Configuration` usually means the server is missing AUTH_SECRET / NEXTAUTH_SECRET, "
                "or the request host does not match NEXTAUTH_URL / AUTH_URL. "
                "If the error URL is on a different host than your Base URL, set CMS_BASE_URL to that host "
                f"(e.g. export CMS_BASE_URL=https://<same-host-as-NEXTAUTH_URL>)."
            )
        elif loc and "://" in loc:
            try:
                err_host = loc.split("://", 1)[1].split("/", 1)[0]
                origin_host = origin.split("://", 1)[1].split("/", 1)[0]
                if err_host != origin_host:
                    hint = (
                        f" Redirect host {err_host!r} differs from API host {origin_host!r}; "
                        "set CMS_BASE_URL to the canonical site URL (same as NEXTAUTH_URL on Vercel)."
                    )
            except IndexError:
                pass
        raise RuntimeError(f"Sign-in failed (HTTP {r2.status_code}, location={loc!r}).{hint}")


def fetch_section(origin: str, section_id: str) -> dict[str, Any]:
    r = requests.get(f"{origin}/api/sections", timeout=120)
    r.raise_for_status()
    sections = r.json()
    if not isinstance(sections, list):
        raise RuntimeError("Unexpected /api/sections response shape")
    for s in sections:
        if isinstance(s, dict) and s.get("id") == section_id:
            return s
    raise RuntimeError(f"Section id {section_id!r} not found in GET /api/sections")


def upload_media(session: requests.Session, origin: str, data: bytes, filename: str, content_type: str) -> str:
    files = {"file": (filename, data, content_type)}
    form = {"prefix": "media"}
    r = session.post(f"{origin}/api/media", files=files, data=form, timeout=120)
    if not r.ok:
        raise RuntimeError(f"Media upload failed: HTTP {r.status_code} {r.text[:500]}")
    payload = r.json()
    url = payload.get("url")
    if not url:
        raise RuntimeError(f"Media upload missing url: {payload!r}")
    return str(url)


def put_section_content(session: requests.Session, origin: str, section_id: str, content: dict[str, Any]) -> None:
    r = session.put(
        f"{origin}/api/sections/{section_id}",
        json={"content": content},
        timeout=120,
    )
    if not r.ok:
        raise RuntimeError(f"PUT section failed: HTTP {r.status_code} {r.text[:800]}")


def verify_public_page(verify_url: str, heading: str, card_slug: str) -> bool:
    r = requests.get(verify_url, timeout=120, headers={"User-Agent": "informityx-news-sync/1.0"})
    if not r.ok:
        print(f"  Warning: verify GET {verify_url} -> HTTP {r.status_code}")
        return False
    text = r.text
    slug_ok = card_slug and card_slug in text
    # Heading may be HTML-escaped on page; check a short distinctive substring
    hkey = heading[:48].strip()
    head_ok = bool(hkey) and hkey in text
    return slug_ok or head_ok


def verify_section_has_slug(origin: str, section_id: str, card_slug: str) -> bool:
    try:
        section = fetch_section(origin, section_id)
    except Exception:
        return False
    content = section.get("content")
    if not isinstance(content, dict):
        return False
    cards = content.get("cards")
    if not isinstance(cards, list):
        return False
    for c in cards:
        if isinstance(c, dict) and str(c.get("cardSlug", "")).lower() == card_slug.lower():
            return True
    return False


def card_from_pdf(
    pdf_path: Path,
    session: requests.Session | None,
    origin: str,
    dry_run: bool,
) -> dict[str, Any]:
    heading = heading_from_pdf_path(pdf_path)
    card_slug = slugify(heading)

    doc = fitz.open(pdf_path)
    try:
        segments = pdf_text_segments(doc)
        overview, description, detail_html = build_overview_and_detail(segments)
        image_url = ""
        img = first_pdf_image_bytes(doc)
        if img and session and not dry_run:
            raw, ctype = img
            ext = "jpg" if "jpeg" in ctype else ctype.split("/")[-1]
            fname = f"{card_slug}-cover.{ext}"
            image_url = upload_media(session, origin, raw, fname, ctype)
            detail_html = (
                f'<img class="rounded-lg max-w-full h-auto my-4" src="{html.escape(image_url)}" alt="">\n'
                + detail_html
            )
    finally:
        doc.close()

    return {
        "id": str(uuid.uuid4()),
        "heading": heading,
        "cardSlug": card_slug,
        "overview": overview,
        "description": description,
        "detailHtml": detail_html,
        "image": image_url,
        "openInModal": False,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync docs/articles PDFs to News & Insights cards section.")
    parser.add_argument("--dry-run", action="store_true", help="Parse PDFs only; no sign-in, upload, or PUT.")
    args = parser.parse_args()

    load_dotenv_file(REPO_ROOT / ".env")
    load_dotenv_file(REPO_ROOT / ".env.local", override=True)

    origin = base_url()
    section_id = os.environ.get("NEWS_SECTION_ID", DEFAULT_SECTION_ID)
    articles_dir = Path(os.environ.get("NEWS_ARTICLES_DIR", str(DEFAULT_ARTICLES_DIR))).expanduser()
    state_file = Path(os.environ.get("NEWS_SYNC_STATE_FILE", str(DEFAULT_STATE_FILE))).expanduser()
    verify_url = os.environ.get("NEWS_VERIFY_URL", f"{origin}/news-and-insights")

    email = os.environ.get("CMS_ADMIN_EMAIL", "")
    password = os.environ.get("CMS_ADMIN_PASSWORD", "")

    if not articles_dir.is_dir():
        print(f"Articles directory missing: {articles_dir}", file=sys.stderr)
        return 1

    synced = read_state(state_file)
    pdfs = sorted(articles_dir.glob("*.pdf"))
    pending = [p for p in pdfs if rel_posix_from_repo(p) not in synced]

    if not pending:
        print("No new PDFs to process (all listed in", state_file, ")")
        return 0

    print(f"Base URL: {origin}")
    print(f"Section:  {section_id}")
    print(f"Pending:  {len(pending)} file(s)")

    session: requests.Session | None = None
    if not args.dry_run:
        if not email or not password:
            print("CMS_ADMIN_EMAIL and CMS_ADMIN_PASSWORD are required (unless --dry-run).", file=sys.stderr)
            return 1
        session = requests.Session()
        sign_in(session, origin, email, password)

    for pdf_path in pending:
        rel = rel_posix_from_repo(pdf_path)
        print(f"\n→ {rel}")

        try:
            if args.dry_run:
                card = card_from_pdf(pdf_path, None, origin, dry_run=True)
                print(f"  [dry-run] heading={card['heading']!r} slug={card['cardSlug']!r}")
                continue

            assert session is not None
            section = fetch_section(origin, section_id)
            content = section.get("content")
            if not isinstance(content, dict):
                raise RuntimeError("Section content is not an object")
            cards = content.get("cards")
            if not isinstance(cards, list):
                cards = []

            card = card_from_pdf(pdf_path, session, origin, dry_run=False)
            existing_slugs = {
                str(c.get("cardSlug", "") or "").lower()
                for c in cards
                if isinstance(c, dict)
            }
            if card["cardSlug"].lower() in existing_slugs:
                print(f"  Skip: cardSlug {card['cardSlug']!r} already exists; marking synced without PUT.")
                append_state(state_file, rel)
                continue

            merged = {**content, "cards": [*cards, card]}
            put_section_content(session, origin, section_id, merged)

            pub_ok = verify_public_page(verify_url, card["heading"], card["cardSlug"])
            api_ok = verify_section_has_slug(origin, section_id, card["cardSlug"])
            if not pub_ok and not api_ok:
                raise RuntimeError(
                    f"Verification failed: slug not on {verify_url} and not in refreshed section"
                )
            if not pub_ok and api_ok:
                print(
                    f"  Note: slug visible via API but not found on public page yet ({verify_url})."
                )

            append_state(state_file, rel)
            print(f"  OK: published and verified ({card['cardSlug']})")

        except Exception as ex:
            print(f"  FAILED: {ex}", file=sys.stderr)
            return 1

    print("\nDone.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
