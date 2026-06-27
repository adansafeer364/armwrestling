#!/usr/bin/env python3
"""Premier Standard — professional tournament brochure (1600x900, 2x supersampled).
Palette: ivory ground, deep navy ink, restrained gold. Editorial grid, certificate framing."""
from PIL import Image, ImageDraw, ImageFont

FONTS = "/Users/apple/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/aef94e3b-413e-4c9d-a3a1-4ccf62b93d28/deff3322-0cef-40c9-a778-f15fa1be4889/skills/canvas-design/canvas-fonts"
S = 2
W, H = 1600 * S, 900 * S

IVORY   = (245, 241, 232)
IVORY2  = (240, 235, 224)
NAVY    = (19, 32, 54)
NAVY_SOFT = (44, 58, 82)
GOLD    = (173, 138, 78)
GOLD_LT = (201, 170, 112)
GRAY    = (132, 126, 112)
LINE    = (214, 206, 189)

def F(name, size): return ImageFont.truetype(f"{FONTS}/{name}", int(size * S))
disp   = lambda s: F("BigShoulders-Bold.ttf", s)          # impact display
serifI = lambda s: F("CrimsonPro-Italic.ttf", s)          # elegant accents
serifB = lambda s: F("CrimsonPro-Bold.ttf", s)            # elegant titling
sans   = lambda s: F("BricolageGrotesque-Regular.ttf", s) # structural values
sansB  = lambda s: F("BricolageGrotesque-Bold.ttf", s)    # labels

img = Image.new("RGB", (W, H), IVORY)
d = ImageDraw.Draw(img, "RGBA")

# subtle vertical warmth in the ground
for y in range(H):
    t = y / H
    d.line([(0, y), (W, y)], fill=tuple(int(a + (b-a)*t) for a, b in zip(IVORY, IVORY2)))

def textw(s, f): return d.textlength(s, font=f)
def texth(s, f):
    b = d.textbbox((0, 0), s, font=f); return b[3]-b[1]

def tracked(xy, text, font, fill, track, center=False):
    ws = [d.textlength(c, font=font) for c in text]
    total = sum(ws) + track*S*(len(text)-1)
    x, y = xy
    if center: x = W/2 - total/2
    for c, w in zip(text, ws):
        d.text((x, y), c, font=font, fill=fill); x += w + track*S
    return total

def cline(text, font, fill, y, track=0):
    if track: tracked((0, y), text, font, fill, track, center=True)
    else: d.text((W/2 - textw(text, font)/2, y), text, font=font, fill=fill)

# ---- certificate frame (double hairline) ----
o1 = 40 * S
d.rectangle([o1, o1, W-o1, H-o1], outline=GOLD, width=max(1, S))
o2 = 50 * S
d.rectangle([o2, o2, W-o2, H-o2], outline=LINE, width=max(1, S))
# small gold diamonds centred on top & bottom frame
def diamond(cx, cy, r, fill):
    d.polygon([(cx, cy-r), (cx+r, cy), (cx, cy+r), (cx-r, cy)], fill=fill)
for cy in (o1, H-o1):
    diamond(W/2, cy, 7*S, GOLD)
    d.line([(W/2-70*S, cy), (W/2-16*S, cy)], fill=GOLD, width=max(1,S))
    d.line([(W/2+16*S, cy), (W/2+70*S, cy)], fill=GOLD, width=max(1,S))

# ---- eyebrow with flanking rules ----
y = 96 * S
eb = "OFFICIAL CHAMPIONSHIP"
ew = tracked((0, y), eb, serifI(27), GOLD, 6, center=True)
ry = y + texth(eb, serifI(27))/2
for sx, ex in [(W/2 - ew/2 - 80*S, W/2 - ew/2 - 22*S), (W/2 + ew/2 + 22*S, W/2 + ew/2 + 80*S)]:
    d.line([(sx, ry), (ex, ry)], fill=GOLD, width=max(1, S))

# ---- hero ----
y = 150 * S
cline("THE FIRST OFFICIAL", sansB(20), NAVY_SOFT, y, track=14)
y += 50 * S

maxw = W - 2*o2 - 120*S
size = 178
while textw("ARMWRESTLING", disp(size)) > maxw and size > 90:
    size -= 2
hf = disp(size)
hbb = d.textbbox((0, 0), "ARMWRESTLING", font=hf)
cline("ARMWRESTLING", hf, NAVY, y)
hw = textw("ARMWRESTLING", hf)
ry = y + hbb[3] + 24*S
d.line([(W/2 - 150*S, ry), (W/2 + 150*S, ry)], fill=GOLD, width=2*S)
diamond(W/2, ry, 6*S, GOLD)
y = ry + 30*S

cline("CHAMPIONSHIP   ·   2026", serifB(40), NAVY, y, track=10)
y += texth("CHAMPIONSHIP", serifB(40)) + 20*S
cline("Mansehra, Khyber Pakhtunkhwa — Pakistan", serifI(26), GRAY, y)
y += texth("Mansehra", serifI(26)) + 56*S
cline("Two pullers   ·   one table   ·   one champion", serifI(25), NAVY_SOFT, y)

# ---- details panel ----
py = int(H * 0.665)
d.line([(o2 + 40*S, py), (W - o2 - 40*S, py)], fill=LINE, width=max(1, S))
panel_b = H - o2 - 86*S
# two vertical dividers -> 3 columns
inner_l = o2 + 40*S
inner_r = W - o2 - 40*S
cw = (inner_r - inner_l) / 3
for k in (1, 2):
    vx = inner_l + cw*k
    d.line([(vx, py + 28*S), (vx, panel_b - 6*S)], fill=LINE, width=max(1, S))

def col(i):
    return inner_l + cw*i + 30*S

def label(cx, text):
    tracked((cx, py + 34*S), text, sansB(15), GOLD, 3)

def kv(cx, y0, items):
    yy = y0
    for lab, val in items:
        tracked((cx, yy), lab, sansB(12), GRAY, 2); yy += 23*S
        d.text((cx, yy), val, font=sans(22), fill=NAVY); yy += 44*S
    return yy

# Col 1 — when & where
label(col(0), "WHEN & WHERE")
kv(col(0), py + 72*S, [
    ("DATE", "[ to be confirmed ]"),
    ("VENUE", "[ to be confirmed ]"),
])

# Col 2 — divisions
label(col(1), "DIVISIONS")
yy = py + 72*S
for line in ["−60 kg   ·   −70 kg", "−80 kg   ·   −90 kg", "Left & Right Arm"]:
    d.text((col(1), yy), line, font=sans(23), fill=NAVY); yy += 40*S

# Col 3 — how to register
label(col(2), "HOW TO REGISTER")
yy = py + 72*S
tracked((col(2), yy), "ONLINE", sansB(12), GRAY, 2); yy += 23*S
d.text((col(2), yy), "Apply via the website form", font=sans(20), fill=NAVY); yy += 44*S
tracked((col(2), yy), "OR ON WHATSAPP", sansB(12), GRAY, 2); yy += 23*S
d.text((col(2), yy), "0327 8625085", font=sans(22), fill=NAVY); yy += 12*S

# ---- footer ----
fy = H - o2 - 54*S
d.line([(o2 + 40*S, fy - 16*S), (W - o2 - 40*S, fy - 16*S)], fill=LINE, width=max(1, S))
tracked((o2 + 40*S, fy), "ENTRY FEE — JAZZCASH / EASYPAISA · ADAN SAFEER", sansB(13), NAVY_SOFT, 2)
wt = "[ your-website-url ]"
ww = textw(wt, sansB(13)) + 2*S*(len(wt)-1)
tracked((W - o2 - 40*S - ww, fy), wt, sansB(13), GOLD, 2)

out = img.resize((1600, 900), Image.LANCZOS)
out.save("/Users/apple/Desktop/armwrestling/public/brochure.png")
out.save("/Users/apple/Desktop/armwrestling/brochure/brochure.png")
print("saved", out.size)
