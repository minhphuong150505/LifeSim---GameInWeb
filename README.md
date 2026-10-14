# LifeSim – demo game mô phỏng sơ cứu

> **Practice today, be ready tomorrow** · Learn – Practice – Be ready

Bản demo chơi được của LifeSim: game web mô phỏng sơ cứu cho người trẻ Việt Nam. 100% frontend, không backend, không API key; dữ liệu người chơi lưu trong `localStorage`.

**Tính năng:** tìm manh mối trong hiện trường → ra quyết định có đếm giờ → mini-game ép tim theo nhịp · Daily Rescue Streak · Bảng xếp hạng (mô phỏng) · Team Rescue 5v5 (đấu với bot) · Practice Hub (bản đồ khóa học demo) · PWA chơi offline.

**Stack:** Vite · React · TypeScript (strict) · Tailwind CSS · React Router · Zustand (persist) · Framer Motion · React-Leaflet + OpenStreetMap · Howler.js · vite-plugin-pwa · Vitest.

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

## Thêm tình huống mới (chỉ cần JSON)

1. Tạo file trong `src/data/scenarios/`, ví dụ `04-yard-nosebleed.json`. **Tên file quyết định thứ tự** màn chơi và thứ tự mở khóa.
2. Điền theo kiểu `Scenario` trong `src/features/scenario/types.ts`:

```jsonc
{
  "id": "yard-nosebleed",
  "title": "Chảy máu cam ở sân trường",
  "topic": "nosebleed", // cpr | choking | burn | bleeding | seizure | fainting | nosebleed
  "location": "Sân trường",
  "difficulty": 1, // 1 | 2 | 3
  "background": "yard", // key trong assets.scenes, hoặc đường dẫn ảnh trực tiếp
  "intro": "…",
  "clues": [
    // hotspot theo % của ảnh nền (x, y = góc trên-trái)
    { "id": "blood", "x": 40, "y": 30, "w": 15, "h": 15, "label": "…", "description": "…" },
  ],
  "requiredClueIds": ["blood"], // phải tìm đủ mới được sang bước quyết định
  "steps": [
    {
      "id": "s1",
      "type": "single",
      "prompt": "…",
      "timeLimitSec": 20,
      "options": [{ "id": "a", "text": "…", "correct": true, "feedback": "…", "points": 10 }],
    },
    {
      "id": "s2",
      "type": "order",
      "prompt": "…",
      "timeLimitSec": 40,
      "orderItems": [{ "id": "x", "text": "…" }],
      "correctOrder": ["x"],
      "explanation": "…",
    },
    {
      "id": "s3",
      "type": "rhythm",
      "prompt": "…",
      "timeLimitSec": 15,
      "rhythm": { "minBpm": 100, "maxBpm": 120, "durationSec": 15 },
      "explanation": "…",
    },
  ],
  "takeaways": ["…"],
}
```

3. Thêm ảnh nền vào `public/assets/scenes/` và khai báo key trong `src/data/assets.ts` (mục `scenes`).
4. Chạy `npm test` – test "bundled scenario data" tự kiểm tra tính nhất quán (clue hợp lệ, mỗi câu có đúng 1 đáp án đúng…). Cập nhật danh sách id mong đợi trong `src/features/scenario/engine.test.ts`.

Mỗi hotspot nên rộng/cao ≥ 13% để vùng chạm ≥ 44px trên màn 360px.

## Thay ảnh / âm thanh

Mọi đường dẫn asset nằm ở **một chỗ**: `src/data/assets.ts`. Thay file trong `public/assets/…` (giữ tên) hoặc sửa đường dẫn trong file này. Khi thay ảnh cảnh, nhớ chỉnh lại toạ độ `clues` trong JSON nếu bố cục thay đổi.

### Nhân vật 3D

- Mascot ở Trang chủ/Onboarding là model 3D thật (`public/assets/models/mascot.glb`, Three.js): kéo để xoay, chạm để vẫy tay. Three.js chỉ tải sau khi trang đã hiện (ảnh poster hiện trước), tự dừng khi ra khỏi màn hình, và quay về ảnh tĩnh nếu máy không hỗ trợ WebGL.
- Cảnh chơi, avatar và ảnh mascot ở các màn khác được **render từ chính các model 3D đó** (giữ vị trí manh mối cố định, nhẹ cho điện thoại).
- Render lại: chạy một static server trong `scripts/render3d/` (cần symlink `three` → `node_modules/three`, `chars` → thư mục GLB của Kenney Mini Characters, `furn` → GLTF của Furniture Kit), rồi `node shoot.mjs classroom canteen lab posterHero …`. Dùng `overlay.py` để kiểm tra ô manh mối. Nguồn và license của từng asset: xem [`CREDITS.md`](./CREDITS.md).

Các script trích asset từ proposal nằm trong `scripts/` (Python: `pymupdf`, `pillow`, `rembg`); chỉ cần chạy lại khi muốn trích lại ảnh.

## Công thức điểm

`điểm = 1000 × (độ chính xác × 50% + chất lượng quyết định × 30% + hiệu quả thời gian × 20%) × (1 − 5% × số gợi ý)`
Sao: ≥ 800 → 3 sao, ≥ 550 → 2 sao, còn lại 1 sao. Xem `src/lib/scoring.ts`.

## Cấu trúc thư mục

```
src/
  app/         router, layout, bottom nav
  pages/       Home, Onboarding, Scenarios, Play, Daily, Team, Leaderboard, Hub, Profile
  features/    scenario (engine reducer, Observe, Decide, Rhythm, Result), streak, leaderboard, team, hub
  components/  Button, Card, Timer, ProgressBar, Badge, BottomSheet, Sticker…
  store/       zustand: user, progress, streak, settings
  data/        scenarios/*.json, dailyPool.json, bots.json, hubLocations.json, assets.ts
  lib/         seededRandom, date, scoring, sound
public/assets/ proposal/, scenes/, ui/, audio/
```

## Ghi chú về bản demo

- Bảng xếp hạng, đồng đội/đối thủ 5v5 và các địa điểm ở Practice Hub đều là **dữ liệu mô phỏng**, được dán nhãn trong UI.
- Request ra ngoài duy nhất: ô bản đồ OpenStreetMap ở trang Hub (không cần key).
- Nội dung mang tính giáo dục, tham khảo hướng dẫn sơ cứu của Hội Chữ thập đỏ; không thay thế khóa đào tạo thực tế. **Khi khẩn cấp hãy gọi 115.**
