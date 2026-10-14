import sys
from PIL import Image
from rembg import remove, new_session
src, out = sys.argv[1], sys.argv[2]
s = new_session("u2net")
for n in ["hero", "char_confused", "char_peace", "char_thinking", "kit", "signs", "bandage", "trophy", "logo"]:
    im = remove(Image.open(f"{src}/{n}.png"), session=s)
    bbox = im.getbbox()
    im = im.crop(bbox) if bbox else im
    im.save(f"{out}/{n}.png"); print(n, im.size)
