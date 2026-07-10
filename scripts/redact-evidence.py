#!/usr/bin/env python3
"""Generate blurred + watermarked evidence copies for roadshow desensitization."""
from pathlib import Path
from PIL import Image, ImageFilter, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'assets' / 'evidence'
OUT = ROOT / 'assets' / 'evidence-anon'

# Full redact: heavy blur — likely contains real names / DMs / event fields
HEAVY = {
    '【大秘书】原声私信:投诉.webp',
    '【大秘书】原始私信内容.webp',
    '【主播标签库】.webp',
    '聚合事件卡（旧版）.webp',
    '聚合事件卡（新版）.webp',
    '聚合事件卡（7.6新）.webp',
    '【豆瓣】大盘视图（姜添）.webp',
    '【豆瓣】大盘视图（萨满）.webp',
    '【豆瓣】实时讨论监测+沉淀（1月底姜添）.webp',
    '【豆瓣】实时讨论监测+沉淀（1月底萨满）.webp',
}

# Light redact: UI chrome may expose internal labels
LIGHT = {
    '【月报】2026年6月舆情大盘图.webp',
    '【舆情态势复盘】.webp',
    '【大秘书】AI解析后的字段结果1.webp',
    '【大秘书】舆情结构性研判.webp',
}


def redact(src_path: Path, dst_path: Path, blur_radius: int):
    img = Image.open(src_path).convert('RGB')
    w, h = img.size
    if blur_radius > 0:
        img = img.filter(ImageFilter.GaussianBlur(radius=blur_radius))
    draw = ImageDraw.Draw(img)
    banner_h = max(48, h // 18)
    draw.rectangle([0, 0, w, banner_h], fill=(180, 30, 30, 255))
    label = 'DESENSITIZED DEMO'
    font = ImageFont.load_default()
    draw.text((12, 8), label, fill='white', font=font)
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst_path, 'WEBP', quality=82)
    print('  ok', dst_path.name, f'blur={blur_radius}')


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name in HEAVY:
        src = SRC / name
        if src.exists():
            redact(src, OUT / name, blur_radius=14)
    for name in LIGHT:
        src = SRC / name
        if src.exists():
            redact(src, OUT / name, blur_radius=6)
    print('Done ->', OUT)


if __name__ == '__main__':
    main()
