#!/usr/bin/env python3
"""Chroma-key green-screen sprites and copy scene plates into public/assets."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

SRC = Path("/root/.grok/sessions/%2Froot/019fffc2-2f28-7272-b9d2-83dcde9fe6d4/images")
DST = Path("/root/grizzli-maths-cp/public/assets")
DST.mkdir(parents=True, exist_ok=True)

SPRITES = {
    "1.jpg": "lemming.png",
    "2.jpg": "grizzy.png",
    "4.jpg": "grizzy-happy.png",
    "6.jpg": "lemming-jar.png",
    "9.jpg": "grizzy-surprise.png",
    "10.jpg": "jar.png",
}

SCENES = {
    "3.jpg": "cabin-exterior.jpg",
    "5.jpg": "kitchen.jpg",
    "7.jpg": "living.jpg",
    "8.jpg": "attic.jpg",
    "11.jpg": "garden.jpg",
    "12.jpg": "clock.jpg",
    "13.jpg": "workshop.jpg",
}


def chroma_key(src: Path, dst: Path) -> None:
    im = Image.open(src).convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if g > 120 and g > r + 35 and g > b + 25:
                # soft edge
                excess = g - max(r, b)
                alpha = 0 if excess > 55 else int(255 * (1 - excess / 55))
                px[x, y] = (r, g, b, alpha)
    im.save(dst, "PNG")


def main() -> None:
    for src_name, dst_name in SPRITES.items():
        chroma_key(SRC / src_name, DST / dst_name)
        print("sprite", dst_name)
    for src_name, dst_name in SCENES.items():
        im = Image.open(SRC / src_name).convert("RGB")
        im.save(DST / dst_name, "JPEG", quality=88)
        print("scene", dst_name)


if __name__ == "__main__":
    main()
