# CREDITS – nguồn và license của asset

Mọi asset trong `public/assets/` đều được liệt kê ở đây. Khi thêm/thay asset, cập nhật file này.

## 1. Ảnh trích từ proposal của nhóm (`public/assets/proposal/`)

Nguồn: file proposal LifeSim của nhóm (PDF 5 trang, môn Quản trị Khởi nghiệp) – **tài sản của nhóm**.
Cách tạo: render từng trang bằng PyMuPDF (144 dpi) → crop → tách nền bằng `rembg` (model u2net) với các ảnh trong suốt → xuất `.webp`. Script nằm trong `scripts/`.

| File                              | Nội dung                                                        | Trang PDF  | Xử lý            |
| --------------------------------- | --------------------------------------------------------------- | ---------- | ---------------- |
| `logo.webp`                       | Logo chữ LifeSim + trái tim dấu cộng                            | 2          | crop + tách nền  |
| `character-hero.webp`             | Nhân vật đeo balo cứu thương, đưa tay                           | 2          | crop + tách nền  |
| `character-confused.webp`         | Nhân vật bối rối (kết quả thấp)                                 | 1          | crop + tách nền  |
| `character-peace.webp`            | Nhân vật vui, giơ tay chữ V (kết quả tốt, streak)               | 3          | crop + tách nền  |
| `character-thinking.webp`         | Nhân vật suy nghĩ (màn giới thiệu tình huống)                   | 5          | crop + tách nền  |
| `avatar-1.webp` … `avatar-4.webp` | 4 avatar (cận mặt nhân vật, 4 biểu cảm)                         | 2, 1, 3, 5 | crop vuông 256px |
| `first-aid-kit.webp`              | Hộp cứu thương đỏ                                               | 2          | crop + tách nền  |
| `wooden-signs.webp`               | Bảng gỗ LEARN / PRACTICE / BE READY                             | 2          | crop + tách nền  |
| `bandage.webp`                    | Sticker băng cá nhân                                            | 2          | crop + tách nền  |
| `trophy.webp`                     | Cúp vàng                                                        | 4          | crop + tách nền  |
| `city-bg.webp`                    | Nền thành phố / trường học                                      | 5          | crop             |
| `scene-victim.webp`               | Cảnh nạn nhân nằm trong phòng (hiện chưa dùng trong UI, để sẵn) | 3          | crop             |
| `team-banner.webp`                | Banner hai đội "5 vs 5"                                         | 3          | crop             |

## 2. Asset tự vẽ cho bản demo (PLACEHOLDER – nhóm thay sau)

Tác giả: tự tạo cho dự án này, không lấy từ nguồn ngoài. License: thuộc về nhóm LifeSim.

| File                                                                                          | Nội dung                      | Ghi chú                                                           |
| --------------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------- |
| `public/assets/scenes/classroom-placeholder.svg`                                              | Cảnh lớp học (tình huống CPR) | **Placeholder** – thay bằng art 3D chibi theo phong cách proposal |
| `public/assets/scenes/canteen-placeholder.svg`                                                | Cảnh căng tin (hóc dị vật)    | **Placeholder**                                                   |
| `public/assets/scenes/lab-placeholder.svg`                                                    | Cảnh phòng thí nghiệm (bỏng)  | **Placeholder**                                                   |
| `public/favicon.svg`                                                                          | Icon trái tim dấu cộng        | Vẽ lại theo logo                                                  |
| `public/assets/ui/pwa-192.png`, `pwa-512.png`, `pwa-maskable-512.png`, `apple-touch-icon.png` | Icon PWA                      | Sinh bằng Pillow theo biểu tượng trái tim dấu cộng của logo       |

> Khi thay ảnh cảnh, giữ nguyên bố cục hoặc cập nhật lại toạ độ `clues` (đơn vị %) trong file JSON của tình huống.

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

## 6. Biểu tượng

- Icon thanh điều hướng: SVG tự vẽ trong `src/app/BottomNav.tsx`.
- Emoji: dùng emoji hệ thống của thiết bị (không đóng gói file ảnh).
