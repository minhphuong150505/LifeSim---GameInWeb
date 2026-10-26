# CREDITS – nguồn và license của asset

Mọi asset trong `public/assets/` đều được liệt kê ở đây. Khi thêm/thay asset, cập nhật file này.

## 1. Hình ảnh – vẽ tay 2D bằng SVG (tài sản của nhóm)

Toàn bộ hình ảnh trong game dùng **một phong cách 2D chung** (nét viền nâu đậm, màu pastel, nền giấy kem, bảng gỗ) theo ảnh tham khảo trong tài liệu _Nội dung game Lifesim_. Tất cả được vẽ trực tiếp bằng SVG trong code, không dùng file ảnh bên ngoài:

| Thư mục / file                        | Nội dung                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `src/art/LivingRoom.tsx`              | Cảnh phòng khách (cửa sổ, sofa, TV, đồng hồ treo tường, xe cấp cứu)      |
| `src/art/Person.tsx`, `looks.ts`      | Nhân vật nhìn chính diện: em trai, người chơi, bố, mẹ, bà, mascot        |
| `src/art/Profile.tsx`                 | Em trai nhìn nghiêng (tư thế cúi/ngửa/nằm, bóp mũi, thở miệng…)          |
| `src/features/sim/optionArt.tsx`      | Hình minh hoạ cho từng đáp án A/B/C                                      |
| `src/art/icons.tsx`                   | Trái tim, tia sét, băng gạc, túi vật dụng, cửa hàng, túi đá, điện thoại… |
| `src/art/Mascot.tsx`, `AvatarArt.tsx` | Mascot và 12 avatar                                                      |
| `src/components/Logo.tsx`             | Logo chữ LifeSim                                                         |
| `public/favicon.svg`                  | Icon trái tim dấu cộng                                                   |
| `public/assets/ui/*.png`              | Icon PWA, render từ `favicon.svg`                                        |

## 3. Âm thanh (`public/assets/audio/`)

Nguồn: **Kenney – Interface Sounds 1.0** — https://kenney.nl/assets/interface-sounds
License: **CC0 1.0** (public domain) — http://creativecommons.org/publicdomain/zero/1.0/
Xử lý: chuyển `.ogg` → `.mp3` mono 64 kbps bằng ffmpeg (để chạy được trên iOS Safari).

| File          | File gốc trong pack      |
| ------------- | ------------------------ |
| `click.mp3`   | `click_002.ogg`          |
| `select.mp3`  | `select_002.ogg`         |
| `correct.mp3` | `confirmation_002.ogg`   |
| `wrong.mp3`   | `error_006.ogg`          |
| `found.mp3`   | `pluck_001.ogg`          |
| `tick.mp3`    | `tick_002.ogg` (đếm giờ) |
| `win.mp3`     | `confirmation_004.ogg`   |

## 4. Font

| Font           | Nguồn                                                                         | License                   |
| -------------- | ----------------------------------------------------------------------------- | ------------------------- |
| Itim           | Google Fonts, đóng gói qua `@fontsource/itim` (tự host, có subset tiếng Việt) | SIL Open Font License 1.1 |
| Be Vietnam Pro | Google Fonts, đóng gói qua `@fontsource/be-vietnam-pro`                       | SIL Open Font License 1.1 |

## 5. Bản đồ

- Tiles: © OpenStreetMap contributors — https://www.openstreetmap.org/copyright (ODbL). Không cần API key.
- Thư viện: Leaflet (BSD-2-Clause), React-Leaflet (Hippocratic License 2.1).

## 6. Biểu tượng

- Icon thanh điều hướng: SVG tự vẽ trong `src/app/BottomNav.tsx`; icon trong game: `src/art/icons.tsx`.
- Emoji: dùng emoji hệ thống của thiết bị (không đóng gói file ảnh).
