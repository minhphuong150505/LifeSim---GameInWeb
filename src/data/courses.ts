import type { Topic } from './topics';

/**
 * First-aid courses shown in the game.
 * - `sponsored`: partner courses promoted in the lobby pop-up (demo partners, made-up data).
 * - the others: real courses in TP.HCM (public info collected 11/2026, see "Nội dung game
 *   Lifesim_Dev-2.pdf"); "Đăng ký học" opens the provider's official page.
 */
export type Course = {
  id: string;
  /** Short label for the pop-up list. */
  tab: string;
  title: string;
  partner: string;
  tagline: string;
  description: string;
  highlights: string[];
  /** 'Trực tiếp' | 'Trực tuyến' | 'Kết hợp' – also used by the Hub filter. */
  mode: 'Trực tiếp' | 'Trực tuyến' | 'Kết hợp';
  format: string;
  duration: string;
  schedule: string;
  address?: string;
  price: string;
  /** Lowest fee in VND, for the budget filter (0 = free). */
  priceVnd: number;
  /** Old price, shown struck through when there is an offer. */
  oldPrice?: string;
  /** Extra line under the price (offers). */
  priceNote?: string;
  /** Banner colour. */
  tone: string;
  topics: Topic[];
  /** Topic drawn on the card when there is no banner image. */
  cover: Topic;
  /** Banner image (public path). */
  banner?: string;
  /** Provider's official page, opened by "Đăng ký học". */
  url?: string;
  sponsored?: boolean;
};

export const COURSES: Course[] = [
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
    mode: 'Kết hợp',
    format: 'Online + thực hành',
    duration: '3 video + 1 buổi',
    schedule: 'Khai giảng mỗi tháng',
    price: '590.000đ',
    priceVnd: 590_000,
    tone: '#dcecf8',
    topics: ['cpr'],
    cover: 'cpr',
    banner: '/courses/cpr-aed.jpg',
    sponsored: true,
  },
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
    mode: 'Trực tiếp',
    format: 'Trực tiếp',
    duration: '1 buổi · 4 giờ',
    schedule: 'Thứ 7 hằng tuần',
    price: '350.000đ',
    priceVnd: 350_000,
    oldPrice: '450.000đ',
    tone: '#86c06c',
    topics: ['nosebleed', 'burn', 'choking', 'bleeding'],
    cover: 'bleeding',
    sponsored: true,
  },
  {
    id: 'hctd-tphcm',
    tab: 'Hội Chữ thập đỏ',
    title: 'Sơ cấp cứu cơ bản & nâng cao',
    partner: 'Hội Chữ thập đỏ TP.HCM',
    tagline: 'Học trực tiếp, có giấy chứng nhận.',
    description:
      'Lớp học trực tiếp về băng bó, hóc dị vật, ngừng tim, chảy máu, bỏng, gãy xương, đuối nước, đột quỵ và các tình huống khẩn cấp. Có giấy chứng nhận.',
    highlights: [
      'Băng bó, cầm máu, xử trí bỏng',
      'Hóc dị vật, ngừng tim, đuối nước, đột quỵ',
      'Có giấy chứng nhận',
    ],
    mode: 'Trực tiếp',
    format: 'Trực tiếp',
    duration: 'Cơ bản / Nâng cao',
    schedule: 'Cơ bản: 01/11/2026 · Nâng cao: 31/10–01/11 và 28–29/11/2026',
    address: '201 Nguyễn Thị Minh Khai, phường Cầu Ông Lãnh',
    price: '400.000đ',
    priceVnd: 400_000,
    priceNote: 'Cơ bản 400.000đ · Nâng cao 900.000đ',
    tone: '#ec6a4c',
    topics: ['bleeding', 'choking', 'cpr', 'burn', 'drowning'],
    cover: 'bleeding',
    url: 'https://beta.chuthapdotphcm.org.vn/so-cap-cuu',
  },
  {
    id: 'ssvn',
    tab: 'SSVN',
    title: 'Sơ cấp cứu 4.0 – Cấp độ 1',
    partner: 'Survival Skills Vietnam (SSVN)',
    tagline: 'E-learning kết hợp thực hành trực tiếp.',
    description:
      'Sơ cứu theo tình huống, xử trí đường thở, ngừng tim, chảy máu, bỏng và chấn thương. Có chứng nhận hoàn thành theo chương trình.',
    highlights: [
      'Sơ cứu theo tình huống thực tế',
      'Xử trí đường thở, ngừng tim, chảy máu',
      'Chứng nhận hoàn thành',
    ],
    mode: 'Kết hợp',
    format: 'E-learning + thực hành',
    duration: '1 buổi thực hành · 4 giờ',
    schedule: '08/11/2026, 13:30–17:30',
    address: 'Lớp thực hành: 224 Điện Biên Phủ, phường Xuân Hòa',
    price: '1.250.000đ',
    priceVnd: 1_250_000,
    tone: '#7cb8e4',
    topics: ['choking', 'cpr', 'bleeding', 'burn'],
    cover: 'cpr',
    url: 'https://elearning.survivalskills.vn/events/khoa-hoc-so-cap-cuu-4-0-cap-do-1-14/',
  },
  {
    id: 'cc115',
    tab: 'Cấp cứu 115',
    title: 'Lớp sơ cấp cứu cơ bản',
    partner: 'Trung tâm Cấp cứu 115 TP.HCM',
    tagline: 'Học từ đội ngũ cấp cứu 115.',
    description:
      'Sơ cứu ngừng hô hấp – tuần hoàn, dị vật đường thở, chảy máu, gãy xương, bỏng, đuối nước, điện giật, đột quỵ và vận chuyển nạn nhân an toàn.',
    highlights: [
      'Ngừng hô hấp – tuần hoàn, dị vật đường thở',
      'Chảy máu, gãy xương, bỏng, đuối nước',
      'Vận chuyển nạn nhân an toàn',
    ],
    mode: 'Trực tiếp',
    format: 'Trực tiếp',
    duration: 'Theo lớp',
    schedule: 'Đang cập nhật lịch tháng 11',
    address: '49Bis Điện Biên Phủ, phường Tân Định',
    price: '400.000đ',
    priceVnd: 400_000,
    tone: '#ffd23f',
    topics: ['cpr', 'choking', 'bleeding', 'burn', 'drowning'],
    cover: 'cpr',
    url: 'https://115.org.vn/',
  },
  {
    id: 'wb-ca-nhan',
    tab: 'Cá nhân & Gia đình',
    title: 'Sơ cấp cứu Cá nhân & Y học Gia đình',
    partner: 'Wellbeing',
    tagline: 'Lý thuyết online, thực hành cuối tuần.',
    description:
      'Nguyên tắc an toàn hiện trường, kỹ thuật hồi sinh tim phổi (CPR) y khoa, sử dụng máy khử rung tim ngoại viện (AED), nghiệm pháp Heimlich trị hóc dị vật, xử trí đột quỵ, chấn thương, gãy xương.',
    highlights: [
      'CPR y khoa và máy AED',
      'Nghiệm pháp Heimlich trị hóc dị vật',
      'Đột quỵ, chấn thương, gãy xương',
    ],
    mode: 'Kết hợp',
    format: 'Online + Offline',
    duration: 'E-learning + 1–4 buổi (4–16 tiếng)',
    schedule: 'Thực hành cuối tuần, tự chọn',
    price: '1.200.000đ – 3.000.000đ',
    priceVnd: 1_200_000,
    priceNote: 'Tuỳ gói Cơ bản, Tiêu chuẩn hoặc Toàn diện',
    tone: '#c49be0',
    topics: ['cpr', 'choking'],
    cover: 'choking',
    url: 'https://socapcuu.com.vn/products/dao-tao-so-cuu-ca-nhan-va-y-hoc-gia-dinh',
  },
  {
    id: 'wb-bls',
    tab: 'BLS miễn phí',
    title: 'Hồi sinh tim phổi cơ bản (BLS)',
    partner: 'Wellbeing',
    tagline: 'Học online miễn phí, mọi lúc mọi nơi.',
    description:
      'Nhận biết nạn nhân ngừng tim, ngừng thở; kỹ thuật ép tim ngoài lồng ngực và thổi ngạt chuẩn; quy trình gọi cứu thương khẩn cấp.',
    highlights: ['Nhận biết ngừng tim, ngừng thở', 'Ép tim và thổi ngạt chuẩn', 'Gọi cấp cứu đúng cách'],
    mode: 'Trực tuyến',
    format: '100% trực tuyến (E-learning)',
    duration: 'Tự học trong 365 ngày',
    schedule: 'Học mọi lúc mọi nơi',
    price: 'Miễn phí',
    priceVnd: 0,
    tone: '#86c06c',
    topics: ['cpr'],
    cover: 'cpr',
    url: 'https://socapcuu.vn/dao-tao-so-cap-cuu-hoi-sinh-su-song',
  },
  {
    id: 'wb-me-con',
    tab: 'Mẹ & Con',
    title: 'Mẹ thông thái – Con an toàn',
    partner: 'Wellbeing',
    tagline: 'Sơ cứu tai nạn thường gặp ở trẻ nhỏ.',
    description:
      'Các tai nạn thường gặp tại nhà ở trẻ nhỏ; xử trí sốt cao, co giật, bỏng nước sôi; sơ cứu hóc dị vật đường thở ở trẻ em; xử lý chấn thương đầu do ngã từ trên cao.',
    highlights: ['Sốt cao, co giật, bỏng nước sôi', 'Hóc dị vật ở trẻ em', 'Chấn thương đầu do ngã'],
    mode: 'Trực tuyến',
    format: '100% trực tuyến (E-learning)',
    duration: 'Tự học trong 365 ngày',
    schedule: 'Học mọi lúc mọi nơi',
    price: '590.000đ',
    priceVnd: 249_000,
    priceNote: 'Ưu đãi theo mùa còn ~249.000đ',
    tone: '#f6b8c8',
    topics: ['seizure', 'burn', 'choking'],
    cover: 'choking',
    url: 'https://socapcuu.vn/courses',
  },
  {
    id: 'wb-xa-lo',
    tab: 'Anh hùng xa lộ',
    title: 'Trở thành anh hùng xa lộ',
    partner: 'Wellbeing',
    tagline: 'Sơ cứu tai nạn giao thông trên đường.',
    description:
      'Sơ cứu tai nạn giao thông trên đường; cách băng bó vết thương hở, hạn chế nhiễm trùng; cố định xương gãy bằng vật dụng có sẵn; di chuyển nạn nhân chấn thương an toàn.',
    highlights: ['Băng bó vết thương hở', 'Cố định xương gãy', 'Di chuyển nạn nhân an toàn'],
    mode: 'Trực tuyến',
    format: '100% trực tuyến (E-learning)',
    duration: 'Tự học trong 365 ngày',
    schedule: 'Học mọi lúc mọi nơi',
    price: '590.000đ',
    priceVnd: 249_000,
    priceNote: 'Ưu đãi theo mùa còn ~249.000đ',
    tone: '#ec6a4c',
    topics: ['bleeding'],
    cover: 'bleeding',
    url: 'https://socapcuu.vn/courses',
  },
  {
    id: 'wb-the-thao',
    tab: 'Chấn thương thể thao',
    title: 'Bí kíp hạn chế chấn thương thể thao',
    partner: 'Wellbeing',
    tagline: 'Chơi thể thao an toàn hơn.',
    description:
      'Phân biệt căng cơ, bong gân, trật khớp; ứng dụng nguyên tắc R.I.C.E trong chấn thương; xử lý đứt dây chằng, tổn thương khớp khi vận động.',
    highlights: ['Căng cơ, bong gân, trật khớp', 'Nguyên tắc R.I.C.E', 'Tổn thương dây chằng, khớp'],
    mode: 'Trực tuyến',
    format: '100% trực tuyến (E-learning)',
    duration: 'Tự học trong 365 ngày',
    schedule: 'Học mọi lúc mọi nơi',
    price: '590.000đ',
    priceVnd: 249_000,
    priceNote: 'Ưu đãi theo mùa còn ~249.000đ',
    tone: '#ffd23f',
    topics: [],
    cover: 'bleeding',
    url: 'https://socapcuu.vn/courses',
  },
  {
    id: 'wb-du-lich',
    tab: 'Đi xa an toàn',
    title: 'Đi thật xa – Trở về an toàn',
    partner: 'Wellbeing',
    tagline: 'Sơ cứu khi du lịch, dã ngoại.',
    description:
      'Kỹ năng sinh tồn khi đi du lịch, dã ngoại; sơ cứu ngộ độc thức ăn, say nắng, đuối nước; xử lý vết cắn của côn trùng, rắn độc, động vật hoang dã.',
    highlights: ['Sinh tồn khi du lịch, dã ngoại', 'Ngộ độc thức ăn, say nắng, đuối nước', 'Vết cắn côn trùng, rắn độc'],
    mode: 'Trực tuyến',
    format: '100% trực tuyến (E-learning)',
    duration: 'Tự học trong 365 ngày',
    schedule: 'Học mọi lúc mọi nơi',
    price: '590.000đ',
    priceVnd: 249_000,
    priceNote: 'Ưu đãi theo mùa còn ~249.000đ',
    tone: '#7cb8e4',
    topics: ['drowning'],
    cover: 'drowning',
    url: 'https://socapcuu.vn/courses',
  },
];

/** Courses promoted in the lobby pop-up. */
export const SPONSORED_COURSES = COURSES.filter((c) => c.sponsored);

export function getCourse(id: string | undefined): Course | undefined {
  return COURSES.find((c) => c.id === id);
}
