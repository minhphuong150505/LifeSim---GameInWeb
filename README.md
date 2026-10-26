# LifeSim – demo game mô phỏng sơ cứu

> **Practice today, be ready tomorrow** · Learn – Practice – Be ready

Bản demo chơi được của LifeSim: game web mô phỏng sơ cứu cho người trẻ Việt Nam. 100% frontend, không backend, không API key; dữ liệu người chơi lưu trong `localStorage`.

Nội dung và cơ chế theo tài liệu **"Nội dung game Lifesim_Dev"**.

| Tính năng                 | Cơ chế                                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------------- |
| Core Emergency Simulation | Câu chuyện → câu hỏi A/B/C có hình minh hoạ → trái tim / tia sét → băng gạc → mở khoá round tiếp theo |
| Daily Rescue Streak       | Mỗi ngày 3 câu nhanh, **2 lượt thử**, đúng ≥ 2 câu để giữ chuỗi; quà băng gạc ở mốc 3 / 7 / 14 ngày   |
| Daily Leaderboard         | Xếp hạng theo điểm Core Simulation trong ngày (bot mô phỏng), có thêm tab tuần                        |
| Practice Hub              | Lọc khóa học theo khu vực (khoảng cách), thời gian (ngày học), ngân sách và **nhu cầu** (chủ đề)      |
| 5v5 Event                 | Bản thử nghiệm đấu với bot – cơ chế chính thức chưa chốt                                              |

**Stack:** Vite · React · TypeScript (strict) · Tailwind CSS · React Router · Zustand (persist) · Framer Motion · React-Leaflet + OpenStreetMap · Howler.js · vite-plugin-pwa · Vitest.

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

Mẹo: mở DevTools → chế độ thiết bị (360×740 hoặc 390×844). Trên desktop app hiển thị trong khung giữa màn hình, tối đa 480px.

## Deploy lên Vercel

`vercel.json` đã cấu hình sẵn rewrite mọi route về `/index.html` (SPA).

- **Qua GitHub:** vào https://vercel.com/new → Import repo này → Framework preset **Vite** (Build `npm run build`, Output `dist`) → Deploy.
- **Qua CLI:**
  ```bash
  npm i -g vercel
  vercel          # deploy preview
  vercel --prod   # deploy production
  ```

Sau khi deploy, mở trên điện thoại → "Thêm vào màn hình chính" để cài như một app (PWA). Asset được cache để chơi offline; riêng ô bản đồ ở Practice Hub cần mạng.

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
  pages/       Home, Onboarding, Scenarios (bản đồ), Play, Daily, Team, Leaderboard, Hub, Profile
  features/    sim (engine round, cảnh, câu hỏi, cửa hàng, túi đồ, điện thoại…), streak, leaderboard, team, hub
  components/  Button, Card, Modal, BottomSheet, Badge, Timer…
  store/       zustand: user, progress, wallet (băng gạc + vật dụng), streak, settings
  data/        sim/*.ts (nội dung tình huống), dailyPool.json, bots.json, hubLocations.json
  lib/         seededRandom, date, sound
  dev/         trang /dev/art (chỉ có khi chạy dev)
public/assets/ audio/, ui/ (icon PWA)
```

## Ghi chú về bản demo

- Bảng xếp hạng, đồng đội/đối thủ 5v5, quảng cáo và các địa điểm ở Practice Hub đều là **mô phỏng**, được dán nhãn trong UI.
- Request ra ngoài duy nhất: ô bản đồ OpenStreetMap ở trang Hub (không cần key).
- Nội dung mang tính giáo dục, tham khảo hướng dẫn sơ cứu của Hội Chữ thập đỏ; không thay thế khóa đào tạo thực tế. **Khi khẩn cấp hãy gọi 115.**
