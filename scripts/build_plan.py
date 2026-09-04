#!/usr/bin/env python3
"""Build the signed 75-page Benchline plan and its readable Markdown source."""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from docs.plan_content import META, PAGES  # noqa: E402

PDF_PATH = ROOT / "output" / "pdf" / "Benchline_75_Page_Engineering_Plan.pdf"
MARKDOWN_PATH = ROOT / "docs" / "ENGINEERING_PLAN.md"
MANIFEST_PATH = ROOT / "docs" / "plan_manifest.json"

INK = HexColor("#171A1D")
MUTED = HexColor("#656B73")
COBALT = HexColor("#1D4ED8")
PAPER = HexColor("#F4F1EA")
WHITE = HexColor("#FFFFFF")
RULE = HexColor("#D5D0C5")
PALE = HexColor("#E8EDF9")


def register_fonts() -> tuple[str, str, str]:
    candidates = [
        Path("/System/Library/Fonts/Supplemental/Arial.ttf"),
        Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf"),
        Path("/System/Library/Fonts/Supplemental/Arial Italic.ttf"),
    ]
    if all(path.exists() for path in candidates):
        pdfmetrics.registerFont(TTFont("RF-Regular", str(candidates[0])))
        pdfmetrics.registerFont(TTFont("RF-Bold", str(candidates[1])))
        pdfmetrics.registerFont(TTFont("RF-Italic", str(candidates[2])))
        return "RF-Regular", "RF-Bold", "RF-Italic"
    return "Helvetica", "Helvetica-Bold", "Helvetica-Oblique"


REGULAR, BOLD, ITALIC = register_fonts()


def draw_paragraph(canvas: Canvas, text: str, x: float, y_top: float, width: float,
                   style: ParagraphStyle) -> float:
    paragraph = Paragraph(text, style)
    _, height = paragraph.wrap(width, 250 * mm)
    paragraph.drawOn(canvas, x, y_top - height)
    return y_top - height


def draw_label(canvas: Canvas, label: str, x: float, y: float) -> None:
    canvas.setFont(BOLD, 7.5)
    canvas.setFillColor(COBALT)
    canvas.drawString(x, y, label.upper())


def draw_footer(canvas: Canvas, number: int, section: str) -> None:
    width, _ = A4
    canvas.setStrokeColor(RULE)
    canvas.line(22 * mm, 16 * mm, width - 22 * mm, 16 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont(REGULAR, 7.5)
    canvas.drawString(22 * mm, 10.5 * mm, f"BENCHLINE / {section.upper()}")
    canvas.setFont(BOLD, 8)
    canvas.drawRightString(width - 22 * mm, 10.5 * mm, f"{number:02d} / 75")


def draw_cover(canvas: Canvas, spec: dict, number: int) -> None:
    width, height = A4
    canvas.setFillColor(INK)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(COBALT)
    canvas.rect(0, height - 9 * mm, width, 9 * mm, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont(BOLD, 9)
    canvas.drawString(24 * mm, height - 27 * mm, "PRODUCT / DATA / MACHINE LEARNING / DELIVERY")
    canvas.setFont(BOLD, 44)
    canvas.drawString(24 * mm, height - 70 * mm, META["title"])
    canvas.setFont(REGULAR, 17)
    canvas.setFillColor(HexColor("#C9CDD2"))
    canvas.drawString(24 * mm, height - 82 * mm, META["subtitle"])
    canvas.setStrokeColor(HexColor("#3C424A"))
    canvas.line(24 * mm, height - 96 * mm, width - 24 * mm, height - 96 * mm)
    canvas.setFillColor(WHITE)
    canvas.setFont(BOLD, 19)
    canvas.drawString(24 * mm, height - 121 * mm, "75-page build contract")
    canvas.setFont(REGULAR, 10)
    canvas.setFillColor(HexColor("#ADB3BA"))
    canvas.drawString(24 * mm, height - 132 * mm, "From deterministic events to a measured, reversible model release")
    canvas.setFillColor(COBALT)
    canvas.roundRect(24 * mm, 46 * mm, 55 * mm, 11 * mm, 2 * mm, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont(BOLD, 8)
    canvas.drawCentredString(51.5 * mm, 50 * mm, META["edition"].upper())
    canvas.setFillColor(HexColor("#ADB3BA"))
    canvas.setFont(REGULAR, 8)
    canvas.drawString(24 * mm, 32 * mm, f"{META['owner']}  /  {META['date']}")
    canvas.drawRightString(width - 24 * mm, 32 * mm, "DECISION RECORD + DELIVERY STANDARD")


def draw_plan_page(canvas: Canvas, spec: dict, number: int) -> None:
    width, height = A4
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setFillColor(PALE)
    canvas.rect(0, height - 6 * mm, width, 6 * mm, fill=1, stroke=0)
    canvas.setFillColor(COBALT)
    canvas.rect(0, 0, 7 * mm, height, fill=1, stroke=0)

    left, right = 25 * mm, width - 23 * mm
    y = height - 25 * mm
    canvas.setFillColor(COBALT)
    canvas.setFont(BOLD, 8)
    canvas.drawString(left, y, f"{spec['section'].upper()}  /  {number:02d}")
    y -= 14 * mm
    canvas.setFillColor(INK)
    canvas.setFont(BOLD, 24)
    title_lines = spec["title"].split(" - ", 1)
    canvas.drawString(left, y, title_lines[0])
    if len(title_lines) > 1:
        y -= 9 * mm
        canvas.setFont(REGULAR, 16)
        canvas.drawString(left, y, title_lines[1])
    y -= 11 * mm
    canvas.setStrokeColor(RULE)
    canvas.line(left, y, right, y)
    y -= 9 * mm

    premise_style = ParagraphStyle("premise", fontName=REGULAR, fontSize=11.2,
                                   leading=16, textColor=INK, alignment=TA_LEFT)
    body_style = ParagraphStyle("body", fontName=REGULAR, fontSize=9.2,
                                leading=13, textColor=INK, bulletIndent=0,
                                leftIndent=4 * mm, firstLineIndent=-4 * mm)
    evidence_style = ParagraphStyle("evidence", fontName=REGULAR, fontSize=9.2,
                                    leading=13, textColor=INK)
    y = draw_paragraph(canvas, spec["premise"], left, y, right - left, premise_style)
    y -= 9 * mm

    draw_label(canvas, "Decisions", left, y)
    y -= 5 * mm
    for item in spec["decisions"]:
        y = draw_paragraph(canvas, f"<font color='#1D4ED8'>●</font>  {item}", left, y,
                           right - left, body_style)
        y -= 2.2 * mm

    y -= 4 * mm
    card_height = 44 * mm
    canvas.setFillColor(WHITE)
    canvas.setStrokeColor(RULE)
    canvas.roundRect(left, y - card_height, right - left, card_height, 2 * mm,
                     fill=1, stroke=1)
    card_left = left + 6 * mm
    card_mid = left + (right - left) / 2
    card_top = y - 7 * mm
    draw_label(canvas, "Delivery contract", card_left, card_top)
    draw_label(canvas, "Acceptance evidence", card_mid + 3 * mm, card_top)
    canvas.setStrokeColor(RULE)
    canvas.line(card_mid, y - 7 * mm, card_mid, y - card_height + 7 * mm)

    delivery_text = "<br/><br/>".join(f"<b>{i + 1}.</b> {text}" for i, text in enumerate(spec["delivery"]))
    evidence_text = "<br/><br/>".join(f"<b>{i + 1}.</b> {text}" for i, text in enumerate(spec["evidence"]))
    draw_paragraph(canvas, delivery_text, card_left, card_top - 5 * mm,
                   card_mid - card_left - 7 * mm, evidence_style)
    draw_paragraph(canvas, evidence_text, card_mid + 3 * mm, card_top - 5 * mm,
                   right - card_mid - 9 * mm, evidence_style)
    draw_footer(canvas, number, spec["section"])


def write_markdown() -> None:
    lines = [
        f"# {META['title']}: 75-page engineering plan",
        "",
        f"{META['subtitle']}. {META['edition']}, {META['date']}.",
        "",
        "> The PDF is the signed page-stable edition. This Markdown source is provided for search, review, and pull-request discussion.",
        "",
    ]
    for number, spec in enumerate(PAGES, 1):
        lines.extend([
            f"## {number:02d}. {spec['title']}", "",
            f"**Section:** {spec['section']}", "", spec["premise"], "",
            "### Decisions", "",
            *[f"- {item}" for item in spec["decisions"]], "",
            "### Delivery contract", "",
            *[f"- {item}" for item in spec["delivery"]], "",
            "### Acceptance evidence", "",
            *[f"- {item}" for item in spec["evidence"]], "",
        ])
    MARKDOWN_PATH.write_text("\n".join(lines), encoding="utf-8")


def build_pdf() -> None:
    PDF_PATH.parent.mkdir(parents=True, exist_ok=True)
    canvas = Canvas(str(PDF_PATH), pagesize=A4, pageCompression=1)
    canvas.setTitle("Benchline - 75-page engineering plan")
    canvas.setAuthor(META["owner"])
    canvas.setSubject(META["subtitle"])
    for number, spec in enumerate(PAGES, 1):
        if number == 1:
            draw_cover(canvas, spec, number)
        else:
            draw_plan_page(canvas, spec, number)
        canvas.showPage()
    canvas.save()


def validate() -> dict:
    reader = PdfReader(str(PDF_PATH))
    if len(reader.pages) != 75:
        raise RuntimeError(f"Plan must contain exactly 75 pages, found {len(reader.pages)}")
    blank = []
    for index, pdf_page in enumerate(reader.pages, 1):
        text = (pdf_page.extract_text() or "").strip()
        if len(text) < 40:
            blank.append(index)
    if blank:
        raise RuntimeError(f"Unexpected blank or sparse pages: {blank}")
    digest = hashlib.sha256(PDF_PATH.read_bytes()).hexdigest()
    manifest = {
        "title": META["title"],
        "pages": len(reader.pages),
        "sha256": digest,
        "pdf": str(PDF_PATH.relative_to(ROOT)),
        "source": str(MARKDOWN_PATH.relative_to(ROOT)),
        "section_counts": {},
    }
    for spec in PAGES:
        key = spec["section"]
        manifest["section_counts"][key] = manifest["section_counts"].get(key, 0) + 1
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return manifest


if __name__ == "__main__":
    write_markdown()
    build_pdf()
    print(json.dumps(validate(), indent=2))
