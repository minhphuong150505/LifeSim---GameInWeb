# CREDITS – nguồn và license của asset

Mọi asset trong `public/assets/` đều được liệt kê ở đây. Khi thêm/thay asset, cập nhật file này.

## 1. Ảnh trích từ proposal của nhóm (`public/assets/proposal/`)

Nguồn: file proposal LifeSim của nhóm (PDF 5 trang, môn Quản trị Khởi nghiệp) – **tài sản của nhóm**.
Cách tạo: render từng trang bằng PyMuPDF (144 dpi) → crop → tách nền bằng `rembg` (model u2net) với các ảnh trong suốt → xuất `.webp`. Script nằm trong `scripts/`.

| File                 | Nội dung                             | Trang PDF | Xử lý           |
| -------------------- | ------------------------------------ | --------- | --------------- |
| `logo.webp`          | Logo chữ LifeSim + trái tim dấu cộng | 2         | crop + tách nền |
| `first-aid-kit.webp` | Hộp cứu thương đỏ                    | 2         | crop + tách nền |
| `wooden-signs.webp`  | Bảng gỗ LEARN / PRACTICE / BE READY  | 2         | crop + tách nền |
| `bandage.webp`       | Sticker băng cá nhân                 | 2         | crop + tách nền |
| `trophy.webp`        | Cúp vàng                             | 4         | crop + tách nền |
| `city-bg.webp`       | Nền thành phố / trường học           | 5         | crop            |
| `team-banner.webp`   | Banner hai đội "5 vs 5"              | 3         | crop            |

## 2. Nhân vật & cảnh 3D

Model 3D: **Kenney – Mini Characters** (https://kenney.nl/assets/mini-characters) và **Kenney – Furniture Kit** (https://kenney.nl/assets/furniture-kit).
License: **CC0 1.0** (public domain).

| File                                                         | Nội dung                                      | Cách tạo                                                                                                             |
| ------------------------------------------------------------ | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `public/assets/models/mascot.glb`                            | Mascot 3D chạy trực tiếp trong app (Three.js) | `character-female-e.glb` của Kenney, giữ nguyên                                                                      |
| `public/assets/models/mascot-colormap.png`                   | Bảng màu mascot (tay áo đổi sang đỏ LifeSim)  | Sửa từ `colormap.png` của Kenney                                                                                     |
| `public/assets/3d/mascot-{hero,happy,worried,thinking}.webp` | Ảnh mascot 4 trạng thái                       | Render từ model + balo cứu thương tự dựng                                                                            |
| `public/assets/3d/avatar-1…12.webp`                          | 12 avatar                                     | Render 12 nhân vật Mini Characters                                                                                   |
| `public/assets/3d/scene-{classroom,canteen,lab}.webp`        | 3 cảnh chơi                                   | Dựng bằng Three.js từ Mini Characters + Furniture Kit + hình khối tự tạo (bảng, AED, ấm nước, xiên thịt…) rồi render |

Balo cứu thương, vết bỏng, đồng hồ, bong bóng thoại, biển báo: tự tạo trong code, thuộc về nhóm.
Script dựng và render lại nằm trong `scripts/render3d/` (xem README).

> Khi render lại cảnh, toạ độ `clues` trong JSON phải khớp ảnh mới (`scripts/render3d/overlay.py` vẽ ô manh mối lên ảnh để kiểm tra).

## 2b. Asset tự vẽ khác

| File                                                 | Nội dung                                           |
| ---------------------------------------------------- | -------------------------------------------------- |
| `public/favicon.svg`                                 | Icon trái tim dấu cộng (vẽ lại theo logo)          |
| `public/assets/ui/pwa-*.png`, `apple-touch-icon.png` | Icon PWA sinh bằng Pillow theo biểu tượng của logo |

## 3. Âm thanh (`public/assets/audio/`)

Nguồn: **Kenney – Interface Sounds 1.0** — https://kenney.nl/assets/interface-sounds
License: **CC0 1.0** (public domain) — http://creativecommons.org/publicdomain/zero/1.0/
Xử lý: chuyển `.ogg` → `.mp3` mono 64 kbps bằng ffmpeg (để chạy được trên iOS Safari).

| File          | File gốc trong pack               |
| ------------- | --------------------------------- |
| `click.mp3`   | `click_002.ogg`                   |
| `select.mp3`  | `select_002.ogg`                  |
| `correct.mp3` | `confirmation_002.ogg`            |
| `wrong.mp3`   | `error_006.ogg`                   |
| `found.mp3`   | `pluck_001.ogg`                   |
| `tick.mp3`    | `tick_002.ogg` (metronome ép tim) |
| `win.mp3`     | `confirmation_004.ogg`            |

## 4. Font

| Font           | Nguồn                                                                            | License                   |
| -------------- | -------------------------------------------------------------------------------- | ------------------------- |
| Baloo 2        | Google Fonts, đóng gói qua `@fontsource/baloo-2` (tự host, có subset tiếng Việt) | SIL Open Font License 1.1 |
| Be Vietnam Pro | Google Fonts, đóng gói qua `@fontsource/be-vietnam-pro`                          | SIL Open Font License 1.1 |

## 5. Bản đồ

- Tiles: © OpenStreetMap contributors — https://www.openstreetmap.org/copyright (ODbL). Không cần API key.
- Thư viện: Leaflet (BSD-2-Clause), React-Leaflet (Hippocratic License 2.1).
- 3D: Three.js (MIT).

## 6. Biểu tượng

- Icon thanh điều hướng: SVG tự vẽ trong `src/app/BottomNav.tsx`.
- Emoji: dùng emoji hệ thống của thiết bị (không đóng gói file ảnh).
