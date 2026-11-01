import type { Topic } from './topics';

export type HandbookArticle = {
  id: string;
  title: string;
  /** Key points; wording follows the explanations used in the scenarios. */
  points: string[];
  avoid?: string[];
};

export type HandbookTopic = {
  topic: Topic;
  title: string;
  articles: HandbookArticle[];
};

/** Cẩm nang sơ cứu – lessons gathered from the Core game explanations. */
export const HANDBOOK: HandbookTopic[] = [
  {
    topic: 'nosebleed',
    title: 'Chảy máu cam',
    articles: [
      {
        id: 'posture',
        title: 'Tư thế đúng',
        points: [
          'Ngồi thẳng, hơi cúi đầu về phía trước.',
          'Tư thế này giúp ngăn máu chảy xuống họng, hạn chế nguy cơ nuốt máu gây buồn nôn hoặc khó chịu.',
        ],
        avoid: [
          'Ngửa đầu ra sau – máu có thể chảy xuống họng.',
          'Nằm ngửa trong lúc mũi đang chảy máu.',
        ],
      },
      {
        id: 'pinch',
        title: 'Bóp giữ mũi',
        points: [
          'Bóp giữ phần mềm của mũi, ngay phía trên hai lỗ mũi (cả hai cánh mũi).',
          'Bóp mũi tạo áp lực lên các mạch máu đang chảy, giúp máu đông lại và hỗ trợ cầm máu.',
          'Bóp phần xương cứng ở sống mũi không mang lại hiệu quả tương tự.',
        ],
        avoid: [
          'Chỉ bịt một bên lỗ mũi.',
          'Tự nhét bông hoặc giấy sâu vào mũi – có thể gây kích ứng.',
        ],
      },
      {
        id: 'breath-time',
        title: 'Cách thở & thời gian',
        points: [
          'Trong lúc bóp giữ mũi, thở nhẹ nhàng bằng miệng.',
          'Giữ ép liên tục khoảng 10–15 phút.',
          'Không thả tay quá sớm hoặc liên tục kiểm tra – việc này có thể làm gián đoạn quá trình cầm máu.',
        ],
        avoid: ['Nín thở hoặc hít mạnh bằng mũi.', 'Xì mũi thật mạnh sau khi vừa cầm máu.'],
      },
      {
        id: 'ice',
        title: 'Túi chườm lạnh',
        points: [
          'Hiệu quả của chườm lạnh trong việc cầm máu cam chưa được chứng minh rõ ràng.',
          'Bóp giữ phần mềm mũi liên tục vẫn là biện pháp quan trọng nhất; túi chườm chỉ là hỗ trợ tuỳ chọn.',
        ],
        avoid: ['Chỉ chườm lạnh mà không bóp mũi.', 'Đặt đá lạnh trực tiếp vào trong lỗ mũi.'],
      },
      {
        id: 'emergency',
        title: 'Khi nào gọi 115?',
        points: [
          'Máu vẫn không ngừng sau 15 phút giữ ép đúng cách thì cần tìm hỗ trợ y tế.',
          'Chảy máu nhiều, kéo dài, kèm chóng mặt hoặc choáng váng là dấu hiệu cần được đánh giá y tế kịp thời – hãy gọi cấp cứu 115.',
          'Khi gọi, cung cấp: địa chỉ, tình trạng hiện tại, dấu hiệu bất thường (chóng mặt…) và thời gian đã sơ cứu.',
          'Trong lúc chờ: trấn an người bệnh, tiếp tục ngồi hơi cúi về trước, bóp giữ phần mềm mũi và làm theo hướng dẫn của nhân viên cấp cứu.',
        ],
        avoid: [
          'Để người đang chóng mặt tự đứng dậy đi lại.',
          'Cho người bệnh nằm ngửa, ngửa đầu ra sau khi chờ cấp cứu.',
        ],
      },
    ],
  },
];

/** Topics announced in the handbook but not written yet. */
export const HANDBOOK_UPCOMING: { topic: Topic; title: string }[] = [
  { topic: 'cpr', title: 'Ép tim (CPR)' },
  { topic: 'choking', title: 'Hóc dị vật' },
  { topic: 'burn', title: 'Bỏng' },
];
