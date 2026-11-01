# LifeSim – demo game mô phỏng sơ cứu

> **Practice today, be ready tomorrow** · Learn – Practice – Be ready

Bản demo chơi được của LifeSim: game web mô phỏng sơ cứu cho người trẻ Việt Nam, chơi ở **màn hình ngang (landscape)**, phong cách casual 2D. 100% frontend, không backend, không API key; dữ liệu người chơi lưu trong `localStorage`.

## Luồng màn hình

1. **Login** (`/login`) – nền game + thanh tải, sau đó khung đăng nhập (tên + nhân vật). Mỗi lần mở link đều bắt đầu từ đây.
2. **Hướng dẫn** (`/tutorial`) – 7 trang giới thiệu cách chơi, hiện trước khi vào game lần đầu (xem lại từ nút "?" hoặc Cài đặt).
3. **Popup thông báo** – sự kiện, thông báo của NPH, quảng cáo (mô phỏng), hiện một lần sau mỗi lần đăng nhập.
4. **Màn hình chính** (`/`) – góc trái: avatar, tên, cấp độ, streak, cài đặt; giữa: nhân vật + bong bóng nhiệm vụ và 3 nút **Core game / Streak / Hub**; cột phải: băng gạc, Hướng dẫn, Nhiệm vụ, Sự kiện, BXH, Cẩm nang.
5. **Core game** (`/core`) – chọn chủ đề dạng thẻ có ảnh minh hoạ (chủ đề chưa mở hiện khoá) → bản đồ màn (`/core/:id`) → màn chơi (`/play/:id`).
6. **Màn chơi** – hội thoại hiện thành khung thoại trên cảnh; câu hỏi, giải thích, nhiệm vụ tương tác hiện thành popup bên phải; cảnh zoom vào cậu bé và thay đổi theo câu trả lời; chọn sai thì "chị" nhắc lý do + gợi ý.

Trên điện thoại cầm dọc, game hiện màn "Hãy xoay ngang điện thoại".

**Toàn màn hình:** trên Android/iPad game tự bật toàn màn hình + khoá ngang khi đăng nhập, và tự bật lại ở lần chạm kế tiếp nếu người chơi thoát ra (tắt được trong Cài đặt). Safari trên **iPhone** không cho trang web bật toàn màn hình – cách duy nhất là **Chia sẻ → Thêm vào MH chính** rồi mở game từ biểu tượng (game hiện hướng dẫn này ở màn Login và Cài đặt).

**Màn hình thấp** (trình duyệt còn hiện thanh công cụ): giao diện dùng biến thể `short:` (≤ 440px) / `tiny:` (≤ 300px) để thu gọn, và popup trong màn chơi được bọc bằng `FitContent` – tự co nhỏ cho vừa, không cuộn, không mất chữ.

Nội dung và cơ chế theo tài liệu **"Nội dung game Lifesim_Dev"**.

| Tính năng                 | Cơ chế                                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------------- |
| Core Emergency Simulation | Câu chuyện → câu hỏi A/B/C có hình minh hoạ → trái tim / tia sét → băng gạc → mở khoá round tiếp theo |
| Daily Rescue Streak       | Mỗi ngày 3 câu nhanh, **2 lượt thử**, đúng ≥ 2 câu để giữ chuỗi; quà băng gạc ở mốc 3 / 7 / 14 ngày   |
| Daily Leaderboard         | Xếp hạng theo điểm Core Simulation trong ngày (bot mô phỏng), có thêm tab tuần                        |
| Practice Hub              | Danh sách khoá học (ảnh, tên, đơn vị) → bấm xem chi tiết; bộ lọc gộp lại, bấm "Bộ lọc" mới xổ ra      |
| Nhiệm vụ ngày             | Chơi 1 màn · giữ Streak · đọc lại Cẩm nang → nhận băng gạc; nút "Đi tới" dẫn thẳng đến nơi làm        |
| Hồ sơ & cấp độ            | Cấp độ/XP tính từ tiến độ (màn, sao, streak, 5v5, nhiệm vụ), tiến độ chơi, thành tựu                  |
| Cẩm nang                  | Ôn lại kiến thức đã học (tổng hợp từ phần giải thích trong Core game)                                 |
| 5v5 Event                 | Bản thử nghiệm đấu với bot – cơ chế chính thức chưa chốt                                              |

**Stack:** Vite · React · TypeScript (strict) · Tailwind CSS · React Router · Zustand (persist) · Framer Motion · Howler.js · vite-plugin-pwa · Vitest.

## Core Emergency Simulation

**Tình huống 1 – Chảy máu cam** gồm 3 round, độ khó tăng dần: 1.1 _Chảy máu cam nhẹ_ (+20 băng gạc), 1.2 _Lời khuyên trái chiều_ (+25), 1.3 _Máu chảy không ngừng_ (+30). Các tình huống Ép tim, Hóc dị vật, Bỏng hiển thị "Sắp ra mắt" trên bản đồ.

- **Mở đầu:** bối cảnh → lời thoại từng nhân vật (chạm để tiếp) → nhiệm vụ.
- **Trả lời đúng:** +1 trái tim, hiện giải thích, bấm **"Đã hiểu"**; cảnh phòng khách đổi theo (em trai cúi về trước, bóp mũi, thở miệng, đồng hồ 15 phút…) và ô _Cận cảnh_ cho thấy tư thế nhìn nghiêng.
- **Trả lời sai:** +1 tia sét, chọn lại đến khi đúng. **3 tia sét = thua**, chơi lại tốn **10 băng gạc** hoặc xem quảng cáo.
- **Thắng:** sao theo số tia sét (0 → 3 sao), nhận băng gạc x1 hoặc **x2 khi xem quảng cáo**.
- **Vật dụng:** mua trong **Cửa hàng** bằng băng gạc → vào **Túi vật dụng** → dùng ngay trong round:
  - 1.2 câu 3: chạm đúng vị trí bóp trên hình cận cảnh mũi.
  - 1.2 câu 5: mua **túi đá chườm lạnh (40)**, kéo thả lên mũi em trai (không bắt buộc).
  - 1.3 câu 2: mua **điện thoại (30)**, bấm **115** và gọi (cuộc gọi mô phỏng).
- Người chơi mới có **50 băng gạc** quà chào mừng. Quảng cáo là **mô phỏng** (đếm ngược 5 giây, không có mạng quảng cáo thật).

Điểm xếp hạng mỗi round = (100 × số câu + 50 × số tia sét còn lại) × hệ số độ khó (1 / 1,25 / 1,5). Điểm ngày = tổng điểm cao nhất của từng round trong ngày. Xem `src/features/sim/engine.ts`.

## Cài đặt & chạy

Yêu cầu Node.js ≥ 20.

```bash
npm install
npm run dev        # chạy dev tại http://localhost:5173
npm run lint       # ESLint
npm test           # unit test (Vitest)
npm run build      # typecheck + build ra dist/
npm run preview    # xem thử bản build (có service worker / PWA)
```

Mẹo: mở DevTools → chế độ thiết bị, xoay ngang (ví dụ 844×390). Trên desktop game hiển thị toàn màn hình (tối đa 1400px).

## Deploy lên Vercel

`vercel.json` đã cấu hình sẵn rewrite mọi route về `/index.html` (SPA).

- **Qua GitHub:** vào https://vercel.com/new → Import repo này → Framework preset **Vite** (Build `npm run build`, Output `dist`) → Deploy.
- **Qua CLI:**
  ```bash
  npm i -g vercel
  vercel          # deploy preview
  vercel --prod   # deploy production
  ```

Sau khi deploy, mở trên điện thoại → "Thêm vào màn hình chính" để cài như một app (PWA, hướng ngang). Asset được cache để chơi offline.

## Thêm tình huống / round mới

1. Tạo file dữ liệu trong `src/data/sim/` theo mẫu `nosebleed.ts` (kiểu `SimScenario` trong `src/features/sim/types.ts`): mỗi round có `intro` (bối cảnh / lời thoại / nhiệm vụ), `questions` (3 đáp án `a | b | c`, `correctId`, `explanation`), `effect` (thay đổi cảnh sau khi đúng) và `task` tuỳ chọn (`nose-tap`, `ice-pack`, `call-115`).
2. Thêm scenario vào mảng `simScenarios` trong `src/data/sim/index.ts` (thứ tự mảng = thứ tự mở khoá) và bỏ nó khỏi `upcomingScenarios`.
3. Mỗi đáp án trỏ tới một hình minh hoạ trong `src/features/sim/optionArt.tsx` (`art: 'pose-forward'`…); thêm hình mới vào bảng `ART` ở đó.
4. Chạy `npm test` – test dữ liệu kiểm tra mỗi câu có đúng 1 đáp án hợp lệ và hình minh hoạ tồn tại.

## Đồ hoạ

Toàn bộ hình ảnh là **SVG vẽ tay trong code** theo một phong cách 2D chung (nét viền nâu đậm, màu pastel, nền giấy kem, bảng gỗ) – không có file ảnh nhân vật/cảnh. Màu dùng chung ở `src/art/ink.ts`, token giao diện ở `src/index.css`.

- `src/art/` – phòng khách, nhân vật chính diện (`Person`), em trai nhìn nghiêng (`Profile`), mascot, avatar, icon.
- Khi chạy `npm run dev`, mở **`/dev/art`** để xem toàn bộ hình vẽ (nhân vật, tư thế, hình đáp án, icon) trên một trang.

## Thay âm thanh

Đường dẫn âm thanh nằm ở `src/data/assets.ts`; thay file trong `public/assets/audio/` (giữ tên).

## Cấu trúc thư mục

```
src/
  app/         router, layout, bottom nav
  art/         đồ hoạ SVG 2D: phòng khách, nhân vật, mascot, avatar, icon
  pages/       Login, Tutorial, Home (sảnh), CoreTopics, Scenarios (bản đồ màn), Play, Daily, Team, Leaderboard, Hub, Profile, Handbook
  features/    sim (engine, cảnh, popup câu hỏi, cửa hàng, túi đồ, điện thoại…), lobby (thông báo, nhiệm vụ, cài đặt), missions, profile (cấp độ), streak, leaderboard, team, hub
  components/  Button, Card, Modal, BottomSheet, Badge, Timer…
  store/       zustand: user, session (đăng nhập), progress, wallet (băng gạc + vật dụng), streak, missions, settings
  data/        sim/*.ts (nội dung tình huống), news.ts, handbook.ts, dailyPool.json, bots.json, hubLocations.json
  lib/         seededRandom, date, sound
  dev/         trang /dev/art (chỉ có khi chạy dev)
public/assets/ audio/, ui/ (icon PWA)
```

## Ghi chú về bản demo

- Bảng xếp hạng, đồng đội/đối thủ 5v5, quảng cáo và các địa điểm ở Practice Hub đều là **mô phỏng**, được dán nhãn trong UI.
- Không có request ra ngoài (bản đồ ở Hub đã được bỏ).
- Nội dung mang tính giáo dục, tham khảo hướng dẫn sơ cứu của Hội Chữ thập đỏ; không thay thế khóa đào tạo thực tế. **Khi khẩn cấp hãy gọi 115.**
