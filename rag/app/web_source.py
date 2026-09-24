"""Fetch an external training page and turn it into a Markdown knowledge file."""

import asyncio
import io
import ipaddress
import re
import socket
from dataclasses import dataclass
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

import httpx


MAX_REDIRECTS = 3
TIMEOUT_SECONDS = 20
MIN_TEXT_LENGTH = 200
USER_AGENT = "SchoolifyStudyAssistant/1.0 (+https://schoolify.ma)"

_SKIPPED_TAGS = {"script", "style", "noscript", "svg", "nav", "footer", "header", "form", "iframe", "template", "aside", "button"}
_BLOCK_TAGS = {"p", "div", "section", "article", "main", "li", "br", "tr", "table", "ul", "ol", "blockquote", "pre", "dd", "dt"}
_HEADING_TAGS = {"h1": "#", "h2": "##", "h3": "###", "h4": "####"}


class WebSourceError(ValueError):
    """Raised with a user-facing message when a link cannot be used."""


@dataclass(frozen=True)
class WebDocument:
    url: str
    title: str
    text: str


class _TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.title = ""
        self._skip_depth = 0
        self._in_title = False

    def handle_starttag(self, tag: str, attrs) -> None:  # noqa: ANN001 - HTMLParser signature
        if tag in _SKIPPED_TAGS:
            self._skip_depth += 1
        elif tag == "title":
            self._in_title = True
        elif not self._skip_depth:
            if tag in _HEADING_TAGS:
                self.parts.append(f"\n\n{_HEADING_TAGS[tag]} ")
            elif tag == "li":
                self.parts.append("\n- ")
            elif tag in _BLOCK_TAGS:
                self.parts.append("\n\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in _SKIPPED_TAGS and self._skip_depth:
            self._skip_depth -= 1
        elif tag == "title":
            self._in_title = False
        elif not self._skip_depth and (tag in _HEADING_TAGS or tag in _BLOCK_TAGS):
            self.parts.append("\n\n")

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title += data
        elif not self._skip_depth:
            self.parts.append(data)

    def text(self) -> str:
        raw = "".join(self.parts)
        lines = [re.sub(r"[ \t\r\f\v]+", " ", line).strip() for line in raw.split("\n")]
        cleaned = "\n".join(lines)
        cleaned = re.sub(r"\n(#+|-) *\n", "\n", cleaned)
        return re.sub(r"\n{3,}", "\n\n", cleaned).strip()


def _is_public_address(address: str) -> bool:
    ip = ipaddress.ip_address(address)
    return ip.is_global and not ip.is_multicast


async def _validate_url(url: str) -> str:
    parsed = urlparse(url.strip())
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise WebSourceError("Utilise un lien complet qui commence par http:// ou https://.")
    if parsed.username or parsed.password:
        raise WebSourceError("Les liens avec identifiants ne sont pas acceptés.")
    port = parsed.port or (443 if parsed.scheme == "https" else 80)
    try:
        infos = await asyncio.to_thread(socket.getaddrinfo, parsed.hostname, port, type=socket.SOCK_STREAM)
    except socket.gaierror as error:
        raise WebSourceError("Ce site est introuvable. Vérifie le lien.") from error
    addresses = {info[4][0] for info in infos}
    if not addresses or not all(_is_public_address(address) for address in addresses):
        raise WebSourceError("Ce lien pointe vers une adresse privée ou locale, il ne peut pas être utilisé.")
    return parsed.geturl()


def _decode(content: bytes, charset: str | None) -> str:
    for encoding in (charset, "utf-8", "latin-1"):
        if not encoding:
            continue
        try:
            return content.decode(encoding)
        except (LookupError, UnicodeDecodeError):
            continue
    return content.decode("utf-8", errors="replace")


def _pdf_text(content: bytes) -> str:
    from pypdf import PdfReader

    try:
        reader = PdfReader(io.BytesIO(content))
        return "\n\n".join((page.extract_text() or "").strip() for page in reader.pages).strip()
    except Exception as error:
        raise WebSourceError("Le PDF de ce lien n’a pas pu être lu.") from error


async def fetch_web_document(url: str, max_bytes: int) -> WebDocument:
    current = await _validate_url(url)
    async with httpx.AsyncClient(
        follow_redirects=False,
        timeout=TIMEOUT_SECONDS,
        headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml,text/plain,application/pdf;q=0.9,*/*;q=0.5"},
    ) as client:
        for _ in range(MAX_REDIRECTS + 1):
            try:
                async with client.stream("GET", current) as response:
                    if response.is_redirect:
                        location = response.headers.get("location")
                        if not location:
                            raise WebSourceError("Le site a renvoyé une redirection invalide.")
                        current = await _validate_url(urljoin(current, location))
                        continue
                    if response.status_code >= 400:
                        raise WebSourceError(f"Le site a répondu avec une erreur ({response.status_code}).")
                    chunks: list[bytes] = []
                    size = 0
                    async for chunk in response.aiter_bytes():
                        size += len(chunk)
                        if size > max_bytes:
                            raise WebSourceError(f"La page dépasse la taille maximale ({max_bytes // (1024 * 1024)} MB).")
                        chunks.append(chunk)
                    content = b"".join(chunks)
                    content_type = response.headers.get("content-type", "").lower()
                    charset = response.charset_encoding
                    break
            except httpx.TimeoutException as error:
                raise WebSourceError("Le site met trop de temps à répondre.") from error
            except httpx.HTTPError as error:
                raise WebSourceError("Impossible de joindre ce site.") from error
        else:
            raise WebSourceError("Trop de redirections pour ce lien.")

    fallback_title = urlparse(current).hostname or "Formation externe"
    if "application/pdf" in content_type or content.startswith(b"%PDF-"):
        title, text = fallback_title, _pdf_text(content)
    elif "html" in content_type or "xml" in content_type or content.lstrip()[:15].lower().startswith((b"<!doctype", b"<html")):
        parser = _TextExtractor()
        parser.feed(_decode(content, charset))
        title, text = " ".join(parser.title.split()) or fallback_title, parser.text()
    elif content_type.startswith("text/") or not content_type:
        title, text = fallback_title, _decode(content, charset).strip()
    else:
        raise WebSourceError("Ce type de contenu n’est pas pris en charge (HTML, texte ou PDF uniquement).")

    if len(text) < MIN_TEXT_LENGTH:
        raise WebSourceError("Pas assez de texte lisible sur cette page (elle est peut-être chargée en JavaScript ou protégée).")
    return WebDocument(url=current, title=title[:160], text=text)


def web_document_markdown(document: WebDocument) -> str:
    return f"# {document.title}\n\nSource : {document.url}\n\n{document.text}\n"


def web_document_filename(document: WebDocument) -> str:
    parsed = urlparse(document.url)
    host = (parsed.hostname or "site").removeprefix("www.")
    slug = re.sub(r"[^A-Za-z0-9]+", "-", f"{host} {parsed.path}").strip("-").lower()[:80] or "page"
    return f"web-{slug}.md"
