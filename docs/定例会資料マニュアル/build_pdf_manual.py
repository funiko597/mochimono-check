# -*- coding: utf-8 -*-
"""
build_excel_manual.py の CONTENT を流用して、同じ内容の PDF を生成する。
iPhone など Excel の浮動画像を描画できない環境でも中身を確認できるようにするための補助出力。
日本語は reportlab 内蔵の CJK フォント（HeiseiKakuGo-W5）を使用。
"""
import os, importlib.util
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Image,
                                Table, TableStyle, KeepTogether)
from reportlab.lib.enums import TA_LEFT

BASE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(BASE, "img")
OUT = os.path.join(BASE, "定例会資料の作り方.pdf")

# build_excel_manual.py から CONTENT を読み込む
spec = importlib.util.spec_from_file_location("bem", os.path.join(BASE, "build_excel_manual.py"))
bem = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bem)
CONTENT = bem.CONTENT

FONT = "HeiseiKakuGo-W5"
pdfmetrics.registerFont(UnicodeCIDFont(FONT))

PAGE_W, PAGE_H = A4
MARGIN = 16 * mm
CONTENT_W = PAGE_W - 2 * MARGIN

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\n", "<br/>")

st_h1 = ParagraphStyle("h1", fontName=FONT, fontSize=14, leading=20, textColor=colors.white,
                       backColor=colors.HexColor("#1F4E79"), borderPadding=(5,5,5,5),
                       spaceBefore=10, spaceAfter=8, alignment=TA_LEFT)
st_h2 = ParagraphStyle("h2", fontName=FONT, fontSize=11.5, leading=17, textColor=colors.HexColor("#1F4E79"),
                       backColor=colors.HexColor("#D6E4F0"), borderPadding=(4,4,4,4),
                       spaceBefore=8, spaceAfter=5)
st_p = ParagraphStyle("p", fontName=FONT, fontSize=10, leading=15, spaceAfter=4)
st_note = ParagraphStyle("note", fontName=FONT, fontSize=10, leading=15,
                         backColor=colors.HexColor("#FFF2CC"), borderPadding=(5,5,5,5),
                         spaceBefore=2, spaceAfter=5)
st_code = ParagraphStyle("code", fontName=FONT, fontSize=9.5, leading=14,
                         backColor=colors.HexColor("#F2F2F2"), borderPadding=(5,5,5,5),
                         spaceBefore=2, spaceAfter=5)
st_cap = ParagraphStyle("cap", fontName=FONT, fontSize=8, leading=11,
                        textColor=colors.HexColor("#808080"), spaceAfter=10)
st_td = ParagraphStyle("td", fontName=FONT, fontSize=8.5, leading=12)
st_th = ParagraphStyle("th", fontName=FONT, fontSize=8.5, leading=12, textColor=colors.white)

from PIL import Image as PILImage, ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True

flow = []
for block in CONTENT:
    kind = block[0]
    if kind == "h1":
        flow.append(Paragraph(esc(block[1]), st_h1))
    elif kind == "h2":
        flow.append(Paragraph(esc(block[1]), st_h2))
    elif kind == "p":
        flow.append(Paragraph(esc(block[1]), st_p))
    elif kind == "note":
        flow.append(Paragraph(esc(block[1]), st_note))
    elif kind == "code":
        flow.append(Paragraph(esc(block[1]), st_code))
    elif kind == "table":
        header = block[1]; rows = block[2:]
        data = [[Paragraph(esc(h), st_th) for h in header]]
        for r in rows:
            data.append([Paragraph(esc(c), st_td) for c in r])
        ncol = len(header)
        # 列幅：1列目は狭め
        if ncol == 2:
            ws_ = [22*mm, CONTENT_W-22*mm]
        elif ncol == 3:
            ws_ = [14*mm, (CONTENT_W-14*mm)*0.5, (CONTENT_W-14*mm)*0.5]
        else:
            base = CONTENT_W/ (ncol+1)
            ws_ = [base*0.7] + [ (CONTENT_W-base*0.7)/(ncol-1) ]*(ncol-1)
        t = Table(data, colWidths=ws_, repeatRows=1)
        t.setStyle(TableStyle([
            ("BACKGROUND",(0,0),(-1,0), colors.HexColor("#4472C4")),
            ("GRID",(0,0),(-1,-1), 0.4, colors.HexColor("#BFBFBF")),
            ("VALIGN",(0,0),(-1,-1),"TOP"),
            ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white, colors.HexColor("#F7F9FC")]),
            ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
            ("LEFTPADDING",(0,0),(-1,-1),4),("RIGHTPADDING",(0,0),(-1,-1),4),
        ]))
        flow.append(t)
        flow.append(Spacer(1, 6))
    elif kind == "img":
        fname, caption = block[1], block[2]
        path = os.path.join(IMG, fname)
        with PILImage.open(path) as im:
            ow, oh = im.size
        disp_w = CONTENT_W
        disp_h = disp_w * oh / ow
        # 画像が縦に長すぎる場合はページ高に収める
        max_h = PAGE_H - 2*MARGIN - 20*mm
        if disp_h > max_h:
            disp_h = max_h
            disp_w = disp_h * ow / oh
        img = Image(path, width=disp_w, height=disp_h)
        cap = Paragraph("図："+esc(caption), st_cap)
        flow.append(KeepTogether([img, cap]))

doc = SimpleDocTemplate(OUT, pagesize=A4,
                        leftMargin=MARGIN, rightMargin=MARGIN,
                        topMargin=MARGIN, bottomMargin=MARGIN,
                        title="定例会資料の作り方")
doc.build(flow)
print("[OK]", OUT)
