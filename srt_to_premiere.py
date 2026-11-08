#!/usr/bin/env python3
"""SRT -> Premiere Pro transcript (.prtranscript / .json) dönüştürücü.

Kullanım:
  python srt_to_premiere.py dosya.srt
  python srt_to_premiere.py klasor/            (içindeki tüm .srt'ler)
  python srt_to_premiere.py dosya.srt -f json  (json | prtranscript | both)
  python srt_to_premiere.py dosya.srt -l en-us (dil kodu, varsayılan tr-tr)

Çıktı, girdinin yanında "Hazır" klasörüne yazılır:
  Hazır/prtranscript/<ad>.prtranscript
  Hazır/json/<ad>.json
"""
import argparse
import json
import re
import sys
import uuid
from pathlib import Path

TIME_RE = re.compile(
    r"(\d+):(\d{2}):(\d{2})[,.](\d{1,3})\s*-->\s*(\d+):(\d{2}):(\d{2})[,.](\d{1,3})"
)
TOKEN_RE = re.compile(r"[^\W_]+(?:['’\-][^\W_]+)*|[^\w\s]", re.UNICODE)
SENT_END = {".", "!", "?", "…"}


def _sec(h, m, s, ms):
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms.ljust(3, "0")) / 1000


def parse_srt(text):
    text = text.lstrip("﻿").replace("\r\n", "\n").replace("\r", "\n")
    cues = []
    for block in re.split(r"\n\s*\n", text.strip()):
        lines = [l for l in block.split("\n") if l.strip()]
        for i, line in enumerate(lines):
            m = TIME_RE.search(line)
            if m:
                g = m.groups()
                body = " ".join(re.sub(r"<[^>]+>|\{[^}]+\}", "", l).strip() for l in lines[i + 1:])
                if body:
                    cues.append((_sec(*g[:4]), _sec(*g[4:]), body))
                break
    return cues


def build_segments(cues, lang):
    segments = []
    for start, end, body in cues:
        dur = max(end - start, 0.001)
        tokens = TOKEN_RE.findall(body)
        weights = [len(t) if any(c.isalnum() for c in t) else 0 for t in tokens]
        total = sum(weights) or 1
        words, t = [], start
        for idx, (tok, w) in enumerate(zip(tokens, weights)):
            is_punct = not any(c.isalnum() for c in tok)
            d = dur * w / total
            words.append({
                "confidence": 1.0,
                "duration": round(d, 4),
                "eos": is_punct and tok in SENT_END or (idx == len(tokens) - 1),
                "start": round(t, 4),
                "tags": [],
                "text": tok,
                "type": "punctuation" if is_punct else "word",
            })
            t += d
        segments.append({
            "duration": round(dur, 4),
            "language": lang,
            "speaker": "spk0",
            "start": round(start, 4),
            "words": words,
        })
    return segments


def convert(srt_path, out_root, fmt, lang):
    cues = parse_srt(srt_path.read_text(encoding="utf-8-sig", errors="replace"))
    if not cues:
        print(f"! Atlandı (geçerli altyazı yok): {srt_path}")
        return
    data = {
        "language": lang,
        "segments": build_segments(cues, lang),
        "speakers": [{"id": "spk0", "name": "Konuşmacı 1"}],
    }
    for kind, ext in (("prtranscript", ".prtranscript"), ("json", ".json")):
        if fmt in (kind, "both"):
            d = out_root / "Hazır" / kind
            d.mkdir(parents=True, exist_ok=True)
            out = d / (srt_path.stem + ext)
            out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"✓ {out}")


def main():
    ap = argparse.ArgumentParser(description="SRT -> Premiere Pro transcript")
    ap.add_argument("girdi", help=".srt dosyası veya içinde .srt olan klasör")
    ap.add_argument("-f", "--format", choices=["json", "prtranscript", "both"], default="both")
    ap.add_argument("-l", "--lang", default="tr-tr", help="dil kodu (varsayılan tr-tr)")
    ap.add_argument("-o", "--cikti", help="Hazır klasörünün oluşturulacağı yer (varsayılan: girdinin yanı)")
    a = ap.parse_args()

    src = Path(a.girdi)
    if src.is_dir():
        files, root = sorted(src.glob("*.srt")), src
    elif src.is_file():
        files, root = [src], src.parent
    else:
        sys.exit(f"Bulunamadı: {src}")
    if a.cikti:
        root = Path(a.cikti)
    if not files:
        sys.exit("Klasörde .srt bulunamadı.")
    for f in files:
        convert(f, root, a.format, a.lang)


if __name__ == "__main__":
    main()
