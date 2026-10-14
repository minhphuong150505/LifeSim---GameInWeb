import sys
from PIL import Image, ImageDraw
pages, cut, crops, out, ui = sys.argv[1:6]
K = 2.4

def save(im, name, maxw, q=82):
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    im.save(f"{out}/{name}.webp", "WEBP", quality=q, method=6); print(name, im.size)

# Cut-out characters and props (transparent)
c = lambda n: Image.open(f"{cut}/{n}.png")
save(c("hero"), "character-hero", 440)
conf = c("char_confused"); save(conf.crop((0, 0, conf.width, int(conf.height * 0.60))), "character-confused", 480)
save(c("char_peace"), "character-peace", 360)
save(c("char_thinking"), "character-thinking", 420)
kit = c("kit"); save(kit.crop((0, 0, int(kit.width * 0.93), kit.height)), "first-aid-kit", 300)
save(c("signs"), "wooden-signs", 400)
save(c("bandage"), "bandage", 240)
tr = c("trophy"); save(tr.crop((0, 0, tr.width, int(tr.height * 0.78))), "trophy", 300)
save(c("logo"), "logo", 480, 90)

# Opaque crops
page = lambda n: Image.open(f"{pages}/h{n:02d}.png").convert("RGB")
box = lambda b: tuple(int(v * K) for v in b)
save(page(5).crop(box((560, 0, 1200, 240))), "city-bg", 1080, 72)
sv = Image.open(f"{crops}/scene_victim.png").convert("RGB"); save(sv.crop((150, 20, 828, 640)), "scene-victim", 720, 78)
tb = Image.open(f"{crops}/team_banner.png").convert("RGB"); save(tb.crop((140, 20, 848, 640)), "team-banner", 720, 78)
faces = {1: (2, 735, 90, 975, 330), 2: (1, 730, 60, 950, 280), 3: (3, 637, 212, 747, 322), 4: (5, 58, 272, 192, 406)}
for i, (pg, *b) in faces.items():
    save(page(pg).crop(box(b)).resize((256, 256), Image.LANCZOS), f"avatar-{i}", 256, 84)

# App icons: red tile, white heart, red plus
def icon(size, pad):
    s = size * 4; im = Image.new("RGB", (s, s), "#E53935"); d = ImageDraw.Draw(im)
    w = s * (1 - 2 * pad); x0 = s * pad; y0 = s * pad + w * 0.06; r = w * 0.27
    d.ellipse((x0 + w * 0.04, y0, x0 + w * 0.04 + 2 * r, y0 + 2 * r), fill="white")
    d.ellipse((x0 + w * 0.96 - 2 * r, y0, x0 + w * 0.96, y0 + 2 * r), fill="white")
    d.polygon([(x0 + w * 0.065, y0 + r * 1.42), (x0 + w * 0.935, y0 + r * 1.42), (x0 + w / 2, y0 + w * 0.88)], fill="white")
    d.rectangle((x0 + w * 0.04 + r * 0.6, y0 + r * 0.7, x0 + w * 0.96 - r * 0.6, y0 + r * 1.5), fill="white")
    cx, cy, a, t = s / 2, y0 + w * 0.40, w * 0.19, w * 0.065
    d.rounded_rectangle((cx - a, cy - t, cx + a, cy + t), radius=t * 0.4, fill="#E53935")
    d.rounded_rectangle((cx - t, cy - a, cx + t, cy + a), radius=t * 0.4, fill="#E53935")
    return im.resize((size, size), Image.LANCZOS)
icon(192, 0.2).save(f"{ui}/pwa-192.png"); icon(512, 0.2).save(f"{ui}/pwa-512.png")
icon(512, 0.27).save(f"{ui}/pwa-maskable-512.png"); icon(180, 0.2).save(f"{ui}/apple-touch-icon.png")
