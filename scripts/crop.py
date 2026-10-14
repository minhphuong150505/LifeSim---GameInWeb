import sys
from PIL import Image
pages, out = sys.argv[1], sys.argv[2]
K = 2.4
C = {
 "scene_victim": (3, 47, 182, 392, 458), "streak_card": (3, 432, 182, 770, 458), "team_banner": (3, 807, 182, 1160, 458),
 "hero": (2, 600, 40, 1010, 675), "char_confused": (1, 640, 20, 1050, 480), "char_peace": (3, 630, 185, 770, 458),
 "char_thinking": (5, 30, 255, 235, 445), "kit": (2, 1070, 505, 1200, 625), "signs": (2, 995, 270, 1190, 570),
 "bandage": (2, 508, 535, 625, 645), "city": (5, 560, 0, 1200, 240), "trophy": (4, 0, 450, 145, 645), "logo": (2, 65, 15, 270, 95),
}
for name, (pg, x0, y0, x1, y1) in C.items():
    im = Image.open(f"{pages}/h{pg:02d}.png").crop(tuple(int(v * K) for v in (x0, y0, x1, y1)))
    im.save(f"{out}/{name}.png"); print(name, im.size)
