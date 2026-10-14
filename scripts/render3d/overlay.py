import sys, json
from PIL import Image, ImageDraw
spec = json.loads(sys.argv[1])
sheet = Image.new('RGB', (1800, 600))
for i, (name, rects) in enumerate(spec.items()):
    im = Image.open(f'out/{name}.png').convert('RGB').resize((600, 600)); d = ImageDraw.Draw(im)
    for k, r in rects.items():
        x, y, w, h = r['x'] * 6, r['y'] * 6, r['w'] * 6, r['h'] * 6
        d.rectangle((x, y, x + w, y + h), outline=(255, 230, 0), width=4); d.text((x + 4, y + 2), k, fill=(255, 255, 0))
    sheet.paste(im, (i * 600, 0))
sheet.save('out/overlay.jpg', quality=80)
