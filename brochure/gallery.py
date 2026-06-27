#!/usr/bin/env python3
"""Clean, original, logo-free armwrestling placeholders for the gallery (1200x900)."""
from PIL import Image, ImageDraw
import math

S = 2
W, H = 1200 * S, 900 * S

# (top color, bottom color) gradients in the site's brand family
THEMES = [
    ((24, 27, 38), (10, 12, 18)),     # charcoal
    ((40, 20, 10), (12, 10, 14)),     # ember-dark
    ((14, 22, 34), (8, 10, 16)),      # navy-dark
]
ORANGE = (242, 122, 36)
WHITE = (244, 241, 235)

def render(idx, top, bot, accent):
    img = Image.new("RGB", (W, H), top)
    d = ImageDraw.Draw(img, "RGBA")
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=tuple(int(a + (b - a) * t) for a, b in zip(top, bot)))

    # soft radial glow upper-centre
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    cx, cy = W // 2, int(H * 0.42)
    for i in range(140, 0, -1):
        r = i * 6 * S
        gd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*accent, int(10 * (i / 140) ** 2)))
    img = Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB")
    d = ImageDraw.Draw(img, "RGBA")

    # --- arm-wrestle line motif: two forearms meeting at clasped hands ---
    cxm, cym = W / 2, H * 0.44
    thick = 46 * S
    # elbows at bottom corners
    lel = (W * 0.16, H * 0.9)
    rel = (W * 0.84, H * 0.9)
    d.line([lel, (cxm, cym)], fill=(*WHITE, 235), width=thick)
    d.line([rel, (cxm, cym)], fill=(*WHITE, 235), width=thick)
    # rounded elbow + hand joints
    for (px, py), rr in [(lel, thick * 0.7), (rel, thick * 0.7)]:
        d.ellipse([px - rr, py - rr, px + rr, py + rr], fill=(*WHITE, 235))
    # clasped hands (accent knot)
    hr = thick * 0.95
    d.ellipse([cxm - hr, cym - hr, cxm + hr, cym + hr], fill=accent)
    d.ellipse([cxm - hr, cym - hr, cxm + hr, cym + hr], outline=(*WHITE, 230), width=4 * S)

    # competition table line
    d.line([(W * 0.1, H * 0.9), (W * 0.9, H * 0.9)], fill=(*WHITE, 60), width=3 * S)

    out = img.resize((1200, 900), Image.LANCZOS)
    out.save(f"/Users/apple/Desktop/armwrestling/public/images/gallery-{idx}.png")
    print("saved gallery-%d.png" % idx)

for i, (top, bot) in enumerate(THEMES, start=1):
    render(i, top, bot, ORANGE)
