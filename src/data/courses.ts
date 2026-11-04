/**
 * Partner courses promoted in the game (third-party providers, LifeSim earns a commission).
 * Demo data: the providers and prices below are made up.
 */
export type Course = {
  id: string;
  /** Short label for the list. */
  tab: string;
  title: string;
  partner: string;
  tagline: string;
  description: string;
  highlights: string[];
  format: string;
  duration: string;
  schedule: string;
  price: string;
  /** Old price, shown struck through when there is an offer. */
  oldPrice?: string;
  /** Banner colour. */
  tone: string;
  /** Third-party page opened in a new tab; without it the in-game detail page is used. */
  url?: string;
};

export const COURSES: Course[] = [
  {
    id: 'so-cuu-co-ban',
    tab: 'Sơ cứu cơ bản',
    title: 'Sơ cứu cơ bản cho gia đình',
    partner: 'Trung tâm Kỹ năng An Toàn Xanh',
    tagline: 'Thực hành trên mô hình cùng huấn luyện viên có chứng chỉ.',
    description:
      'Khoá học 1 buổi giúp bạn tự tin xử lý các tình huống thường gặp trong nhà: chảy máu cam, bỏng, hóc dị vật và vết thương hở. Học viên được thực hành trực tiếp và nhận giấy chứng nhận hoàn thành.',
    highlights: [
      'Xử lý chảy máu, bỏng, hóc dị vật',
      'Thực hành băng bó trên mô hình',
      'Giấy chứng nhận hoàn thành',
    ],
    format: 'Trực tiếp',
    duration: '1 buổi · 4 giờ',
    schedule: 'Thứ 7 hằng tuần',
    price: '350.000đ',
    oldPrice: '450.000đ',
    tone: '#86c06c',
  },
  {
    id: 'cpr-aed',
    tab: 'CPR & AED',
    title: 'Hồi sức tim phổi (CPR) & sử dụng máy AED',
    partner: 'Học viện Sơ cứu HeartStart',
    tagline: 'Ép tim đúng nhịp, dùng máy AED trong 3 phút vàng.',
    description:
      'Khoá học kết hợp video trực tuyến và 1 buổi thực hành. Bạn học cách nhận biết ngừng tim, ép tim – thổi ngạt đúng kỹ thuật cho người lớn và trẻ em, và sử dụng máy khử rung tim tự động (AED).',
    highlights: [
      'CPR cho người lớn và trẻ em',
      'Thực hành với máy AED mô phỏng',
      'Video học lại trọn đời',
    ],
    format: 'Online + thực hành',
    duration: '3 video + 1 buổi',
    schedule: 'Khai giảng mỗi tháng',
    price: '590.000đ',
    tone: '#ec6a4c',
  },
];

export function getCourse(id: string | undefined): Course | undefined {
  return COURSES.find((c) => c.id === id);
}
