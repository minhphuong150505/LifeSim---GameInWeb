import { EVENT_NAME } from './copy';

export type NewsKind = 'event' | 'notice' | 'ad';

export type NewsItem = {
  id: string;
  kind: NewsKind;
  tab: string;
  title: string;
  body: string;
  /** Background colour of the banner. */
  tone: string;
  cta?: { label: string; to: string };
};

/** Pop-up shown once after logging in: events, publisher notices and (simulated) ads. */
export const NEWS: NewsItem[] = [
  {
    id: 'event-5v5',
    kind: 'event',
    tab: 'Sự kiện 5v5',
    title: EVENT_NAME,
    body: 'Lập đội 5 người, cùng xử lý tình huống và so tài với đội bạn. Thắng trận để nhận huy hiệu Đồng đội!',
    tone: '#86c06c',
    cta: { label: 'Tham gia ngay', to: '/team' },
  },
  {
    id: 'notice-nosebleed',
    kind: 'notice',
    tab: 'Chủ đề mới',
    title: 'Ra mắt chủ đề “Chảy máu cam”',
    body: '3 màn chơi với độ khó tăng dần, vật dụng tương tác và gọi cấp cứu 115. Các chủ đề Ép tim, Hóc dị vật, Bỏng sẽ sớm mở khoá.',
    tone: '#ec6a4c',
    cta: { label: 'Chơi ngay', to: '/core' },
  },
  {
    id: 'notice-mission',
    kind: 'notice',
    tab: 'Nhiệm vụ ngày',
    title: 'Nhiệm vụ hằng ngày',
    body: 'Chơi 1 màn, giữ Streak và đọc lại Cẩm nang mỗi ngày để nhận thêm băng gạc. Bấm vào nhân vật ở màn hình chính để xem nhiệm vụ.',
    tone: '#ffd23f',
  },
  {
    id: 'ad-hub',
    kind: 'ad',
    tab: 'Quảng cáo',
    title: 'Học sơ cứu thật cùng đối tác',
    body: 'Khám phá các khoá học sơ cứu gần bạn trong Practice Hub. (Quảng cáo mô phỏng – dữ liệu demo.)',
    tone: '#7cb8e4',
    cta: { label: 'Mở Hub', to: '/hub' },
  },
];

export const NEWS_KIND_LABEL: Record<NewsKind, string> = {
  event: 'SỰ KIỆN',
  notice: 'THÔNG BÁO',
  ad: 'QUẢNG CÁO',
};
