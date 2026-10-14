import sys, pymupdf
doc = pymupdf.open(sys.argv[1]); out = sys.argv[2]
for i, p in enumerate(doc):
    for im in p.get_images(full=True):
        info = doc.extract_image(im[0])
        print(i + 1, im[0], info["width"], info["height"], info["ext"], len(info["image"]) // 1024, "KB", [tuple(round(v) for v in r) for r in p.get_image_rects(im[0])])
    p.get_pixmap(dpi=144).save(f"{out}/h{i+1:02d}.png")  # 2880x1620
