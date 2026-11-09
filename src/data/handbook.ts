/**
 * Cẩm nang sơ cấp cứu – LifeSim.
 * Content transcribed from the client's document (camnang.pdf); keep the wording faithful.
 *
 * Every article follows the same structure: Nhận biết → Bạn nên làm gì? → Không nên làm gì?
 * → Khi nào cần gọi cấp cứu? → Video hướng dẫn thực tế → Nguồn tham khảo.
 */

export type HandbookIcon =
  | 'drop'
  | 'flame'
  | 'throat'
  | 'recovery'
  | 'heart'
  | 'wave'
  | 'bone'
  | 'swim'
  | 'sun'
  | 'brain'
  | 'heart-pulse';

/** One line of "Bạn nên làm gì?": a numbered step, a condition heading or a plain sentence. */
export type ActionItem =
  | { kind: 'step'; text: string }
  | { kind: 'condition'; text: string }
  | { kind: 'text'; text: string };

export type HandbookList = {
  /** Lead-in sentence before the bullets (e.g. "Người đó:"). */
  intro?: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type HandbookArticle = {
  id: string;
  /** Number in the document (01–07). */
  number: string;
  /** Name in the card list. */
  title: string;
  /** "Tên trên ảnh" – shown over the card image. */
  cardTitle: string;
  icon: HandbookIcon;
  /** "Ảnh đề xuất" – brief for the real photo; used as its alt text once a photo is added. */
  photoBrief: string;
  /** Photo in /public/handbook: the card and the top of the article (else an icon panel). */
  photo?: string;
  /** Second photo, shown in "Bạn nên làm gì?". */
  photo2?: string;
  recognize: HandbookList;
  actions: ActionItem[];
  /** Explanation printed after the steps. */
  actionNotes?: string[];
  /** Escalation shown as a warning right after the steps. */
  escalation?: string;
  avoidTitle?: string;
  avoid: string[];
  whenToCall?: HandbookList & { title: string };
  /** Article-specific "Lưu ý" (otherwise the generic practice note is shown). */
  note?: string;
  video: { title: string; youtubeId: string };
};

export const HANDBOOK_TITLE = 'Cẩm nang sơ cấp cứu';
export const HANDBOOK_INTRO = 'Hướng dẫn xử lý các tình huống khẩn cấp thường gặp trong cuộc sống.';

/** "Lưu ý" shown on articles without their own note. */
export const GENERIC_NOTE =
  'Nên tham gia khóa học thực hành để thành thạo kỹ năng này. Cẩm nang giúp bạn nắm kiến thức cơ bản, không thay thế cho đào tạo thực tế.';

export const HANDBOOK_SOURCES = [
  'British Red Cross – First aid',
  'American Heart Association (AHA) – 2025 Guidelines for CPR and ECC',
  'IFRC – International First Aid, Resuscitation and Education Guidelines',
];

export const EMERGENCY_NUMBERS = [
  { number: '115', label: 'Cấp cứu y tế' },
  { number: '112', label: 'Tổng đài khẩn cấp quốc gia' },
];

export const HANDBOOK: HandbookArticle[] = [
  {
    id: 'chay-mau-cam',
    photo: '/handbook/chay-mau-cam-1.jpg',
    photo2: '/handbook/chay-mau-cam-2.jpg',
    number: '01',
    title: 'Chảy máu cam',
    cardTitle: 'Chảy máu cam',
    icon: 'drop',
    photoBrief:
      'Người thật đang ngồi, hơi cúi người về phía trước và dùng tay bóp phần mềm của mũi.',
    recognize: {
      paragraphs: [
        'Máu chảy từ một hoặc hai bên mũi. Phần lớn chảy máu cam có thể xử lý bằng sơ cứu đơn giản.',
      ],
    },
    actions: [
      {
        kind: 'step',
        text: 'Cho người bị chảy máu cam ngồi thẳng và hơi cúi đầu về phía trước.',
      },
      { kind: 'step', text: 'Dùng ngón cái và ngón trỏ bóp phần mềm của mũi.' },
      {
        kind: 'step',
        text: 'Hướng dẫn họ thở bằng miệng và tiếp tục giữ mũi trong vài phút.',
      },
      { kind: 'step', text: 'Khi máu đã ngừng, hạn chế ngoáy hoặc xì mũi mạnh ngay sau đó.' },
    ],
    actionNotes: ['Hướng cúi về phía trước giúp máu chảy ra ngoài thay vì chảy xuống họng.'],
    avoid: [
      'Không ngửa đầu ra sau.',
      'Không nằm ngửa.',
      'Không ngoáy hoặc xì mũi mạnh ngay sau khi máu vừa ngừng.',
    ],
    whenToCall: {
      title: 'Khi nào cần hỗ trợ y tế?',
      paragraphs: [
        'Cần tìm hỗ trợ y tế nếu máu chảy nhiều, kéo dài không giảm, xảy ra sau chấn thương mạnh hoặc người bệnh có biểu hiện bất thường.',
      ],
    },
    video: {
      title: 'Nosebleed: First aid steps and key action – British Red Cross',
      youtubeId: '_d-Q76BoXJg',
    },
  },
  {
    id: 'chay-mau-nhieu',
    photo: '/handbook/chay-mau-nhieu-1.jpg',
    photo2: '/handbook/chay-mau-nhieu-2.jpg',
    number: '02',
    title: 'Chảy máu nhiều',
    cardTitle: 'Chảy máu nhiều',
    icon: 'drop',
    photoBrief:
      'Người thật đang dùng khăn/gạc sạch ép lên cánh tay của người bị thương. Không thể hiện vết thương hoặc máu rõ.',
    recognize: {
      paragraphs: ['Vết thương chảy nhiều máu hoặc máu tiếp tục chảy và khó kiểm soát.'],
    },
    actions: [
      { kind: 'step', text: 'Đảm bảo khu vực an toàn.' },
      {
        kind: 'step',
        text: 'Dùng gạc, khăn sạch hoặc vật liệu phù hợp ấn trực tiếp và chắc lên vị trí chảy máu.',
      },
      { kind: 'step', text: 'Nhờ người khác gọi 115/112 nếu chảy máu nghiêm trọng.' },
      { kind: 'step', text: 'Tiếp tục duy trì áp lực lên vết thương cho đến khi có hỗ trợ.' },
    ],
    actionNotes: [
      'Áp lực trực tiếp là hành động cơ bản đầu tiên để làm chậm hoặc kiểm soát chảy máu nặng.',
    ],
    avoid: [
      'Không liên tục nhấc khăn lên để kiểm tra.',
      'Không rửa một vết thương đang chảy máu nghiêm trọng.',
      'Nếu có dị vật đang cắm trong vết thương, không tự rút ra; ép xung quanh thay vì ép trực tiếp lên dị vật.',
    ],
    whenToCall: {
      title: 'Khi nào gọi cấp cứu?',
      paragraphs: [
        'Gọi 115/112 ngay nếu máu chảy nhiều, không kiểm soát được hoặc người bị thương có dấu hiệu yếu đi, chóng mặt hoặc giảm phản ứng.',
      ],
    },
    video: {
      title: 'First aid for someone who is bleeding heavily – British Red Cross',
      youtubeId: 'L6jjyikFwmA',
    },
  },
  {
    id: 'bong',
    photo: '/handbook/bong-1.jpg',
    photo2: '/handbook/bong-2.jpg',
    number: '03',
    title: 'Bỏng và bỏng nước',
    cardTitle: 'Bỏng & bỏng nước',
    icon: 'flame',
    photoBrief:
      'Người thật đang đưa bàn tay dưới vòi nước mát. Không hiển thị da bị tổn thương nặng.',
    recognize: {
      intro: 'Có thể xuất hiện:',
      bullets: [
        'Đau hoặc rát.',
        'Da đỏ.',
        'Sưng.',
        'Phồng rộp.',
        'Trường hợp nghiêm trọng hơn có thể làm da thay đổi màu sắc hoặc tổn thương sâu.',
      ],
    },
    actions: [
      {
        kind: 'step',
        text: 'Đưa người bị nạn ra khỏi nguồn gây bỏng nếu có thể làm điều đó an toàn.',
      },
      { kind: 'step', text: 'Làm mát vùng bỏng dưới nước sạch đang chảy trong khoảng 20 phút.' },
      { kind: 'step', text: 'Sau khi làm mát, che nhẹ bằng vật liệu sạch, không dính vào da.' },
      {
        kind: 'step',
        text: 'Tìm hỗ trợ y tế nếu vết bỏng nghiêm trọng hoặc bạn không chắc mức độ tổn thương.',
      },
    ],
    avoid: [
      'Không bôi kem đánh răng, bơ, dầu hoặc kem lên vết bỏng.',
      'Không chườm đá trực tiếp lên da.',
      'Không bóc quần áo hoặc vật đang dính chặt vào vùng bỏng.',
      'Không tự làm vỡ bóng nước.',
    ],
    video: {
      title: 'First aid for someone who has a burn or scald – British Red Cross',
      youtubeId: 'dQozahCH8IE',
    },
  },
  {
    id: 'hoc-di-vat',
    photo: '/handbook/hoc-di-vat-1.jpg',
    photo2: '/handbook/hoc-di-vat-2.jpg',
    number: '04',
    title: 'Hóc dị vật',
    cardTitle: 'Hóc dị vật',
    icon: 'throat',
    photoBrief:
      'Một người lớn có biểu hiện khó thở, người hỗ trợ đứng phía sau trong bối cảnh hướng dẫn sơ cứu.',
    recognize: {
      intro: 'Người bị hóc nghiêm trọng có thể:',
      bullets: ['Ôm cổ.', 'Không nói được.', 'Không thở bình thường.', 'Không ho hiệu quả.'],
    },
    actions: [
      { kind: 'condition', text: 'Nếu người đó vẫn có thể ho mạnh:' },
      { kind: 'text', text: 'Khuyến khích họ tiếp tục ho.' },
      { kind: 'condition', text: 'Nếu đường thở bị tắc nghiêm trọng:' },
      { kind: 'step', text: 'Cho người đó hơi cúi về phía trước.' },
      { kind: 'step', text: 'Thực hiện tối đa 5 vỗ lưng.' },
      { kind: 'condition', text: 'Nếu chưa hết:' },
      { kind: 'step', text: 'Thực hiện tối đa 5 lần ép bụng.' },
      {
        kind: 'step',
        text: 'Nếu dị vật vẫn chưa ra, gọi 115/112 và tiếp tục làm theo hướng dẫn cấp cứu.',
      },
    ],
    actionNotes: [
      'Guideline CPR 2025 của AHA cũng sử dụng chu kỳ xen kẽ 5 vỗ lưng và 5 ép bụng đối với tắc nghẽn đường thở nặng ở người lớn và trẻ em phù hợp lứa tuổi.',
    ],
    avoid: [
      'Không móc họng nếu không nhìn thấy rõ dị vật.',
      'Không cho ăn hoặc uống trong khi đang hóc.',
      'Không sử dụng kỹ thuật ép bụng cho trẻ dưới 1 tuổi; trẻ sơ sinh có hướng dẫn riêng.',
    ],
    // From the client's mock-up of this article.
    whenToCall: {
      title: 'Khi nào cần gọi cấp cứu?',
      bullets: [
        'Khi người đó không thể thở, ho hoặc nói.',
        'Khi đã thực hiện 5 vỗ lưng và 5 ép bụng nhưng dị vật vẫn chưa ra.',
        'Khi người đó mất ý thức.',
      ],
    },
    video: {
      title: 'Choking: First aid steps and key action – British Red Cross',
      youtubeId: 'ewmbiHraztk',
    },
  },
  {
    id: 'bat-tinh-con-tho',
    photo: '/handbook/bat-tinh-con-tho-1.jpg',
    photo2: '/handbook/bat-tinh-con-tho-2.jpg',
    number: '05',
    title: 'Bất tỉnh nhưng còn thở',
    cardTitle: 'Bất tỉnh nhưng còn thở',
    icon: 'recovery',
    photoBrief:
      'Người hỗ trợ đang kiểm tra hô hấp hoặc đặt mannequin/người diễn vào tư thế hồi phục.',
    recognize: {
      intro: 'Người đó:',
      bullets: [
        'Không trả lời khi gọi.',
        'Không phản ứng bình thường.',
        'Nhưng vẫn đang thở bình thường.',
      ],
    },
    actions: [
      { kind: 'step', text: 'Kiểm tra phản ứng.' },
      {
        kind: 'step',
        text: 'Mở đường thở và kiểm tra xem người đó có đang thở bình thường không.',
      },
      {
        kind: 'step',
        text: 'Nếu vẫn thở bình thường, đặt họ nằm nghiêng ở tư thế hồi phục để giúp duy trì đường thở.',
      },
      { kind: 'step', text: 'Gọi 115/112 và tiếp tục theo dõi hô hấp.' },
    ],
    escalation:
      'Nếu hơi thở trở nên bất thường, thở ngáp hoặc ngừng thở, chuyển sang xử trí như trường hợp ngừng tim/ngừng thở.',
    avoid: [
      'Không để người bất tỉnh nằm một mình.',
      'Không cho ăn hoặc uống.',
      'Không xem thở ngáp bất thường là hô hấp bình thường.',
    ],
    video: {
      title: 'First aid for someone who is unresponsive but breathing – British Red Cross',
      youtubeId: '5fK2oCiz8VU',
    },
  },
  {
    id: 'cpr-aed',
    photo: '/handbook/cpr-aed-1.jpg',
    photo2: '/handbook/cpr-aed-2.jpg',
    number: '06',
    title: 'Ngừng thở – CPR & AED',
    cardTitle: 'CPR & AED',
    icon: 'heart',
    photoBrief: 'Người thật đang tập CPR trên mannequin, có AED đặt bên cạnh.',
    recognize: {
      intro: 'Người đó:',
      bullets: [
        'Không phản ứng.',
        'Không thở bình thường hoặc chỉ có những hơi thở ngáp bất thường.',
      ],
    },
    actions: [
      { kind: 'step', text: 'Gọi người hỗ trợ và yêu cầu gọi 115/112.' },
      { kind: 'step', text: 'Đặt người đó nằm trên bề mặt chắc chắn.' },
      { kind: 'step', text: 'Bắt đầu ép ngực ở giữa ngực.' },
      {
        kind: 'step',
        text: 'Nếu đã được học và sẵn sàng thực hiện hô hấp hỗ trợ, có thể sử dụng chu kỳ 30 lần ép ngực : 2 hơi thổi.',
      },
      {
        kind: 'step',
        text: 'Nếu có AED, bật máy và làm theo hướng dẫn bằng giọng nói/hình ảnh của thiết bị.',
      },
    ],
    actionNotes: [
      'Tiếp tục cho đến khi người đó có dấu hiệu hồi phục hoặc nhân viên cấp cứu tiếp quản.',
    ],
    avoid: [],
    note: 'CPR là kỹ năng nên được học và thực hành trong khóa huấn luyện thực tế. Cẩm nang đóng vai trò nhắc lại kiến thức chứ không thay thế đào tạo thực hành.',
    video: {
      title: 'Unresponsive and not breathing: first aid steps and key action – British Red Cross',
      youtubeId: 'dlkgjYvHx-U',
    },
  },
  {
    id: 'co-giat',
    photo: '/handbook/co-giat-1.jpg',
    photo2: '/handbook/co-giat-2.jpg',
    number: '07',
    title: 'Co giật',
    cardTitle: 'Co giật',
    icon: 'wave',
    photoBrief:
      'Người hỗ trợ đang dọn đồ vật nguy hiểm xung quanh một người nằm dưới sàn, có vật mềm bảo vệ đầu.',
    recognize: {
      intro: 'Người bị co giật có thể:',
      bullets: [
        'Đột ngột ngã xuống.',
        'Cơ thể cứng lại.',
        'Có những cử động giật không kiểm soát.',
        'Tạm thời không phản ứng.',
      ],
    },
    actions: [
      { kind: 'step', text: 'Dọn những đồ vật có thể gây chấn thương ra khỏi khu vực.' },
      { kind: 'step', text: 'Dùng vật mềm để bảo vệ đầu nếu có thể.' },
      { kind: 'step', text: 'Không cố giữ chặt cơ thể.' },
      { kind: 'step', text: 'Theo dõi thời gian cơn co giật.' },
      {
        kind: 'step',
        text: 'Sau khi cơn co giật kết thúc, nếu người đó còn bất tỉnh nhưng thở bình thường, giúp họ nằm nghiêng và theo dõi hô hấp.',
      },
    ],
    avoidTitle: 'Tuyệt đối không',
    avoid: [
      'Không nhét thìa, tay hoặc bất cứ vật gì vào miệng.',
      'Không cố giữ lưỡi.',
      'Không ghì chặt người đang co giật.',
      'Không cho ăn/uống khi họ chưa tỉnh táo hoàn toàn.',
    ],
    whenToCall: {
      title: 'Khi nào gọi cấp cứu?',
      intro: 'Gọi 115/112 nếu:',
      bullets: [
        'Đây là cơn co giật đầu tiên.',
        'Kéo dài trên khoảng 5 phút.',
        'Có nhiều cơn liên tiếp.',
        'Người đó bị thương hoặc khó thở.',
        'Co giật xảy ra dưới nước.',
        'Người đó không hồi phục bình thường sau cơn.',
      ],
    },
    video: {
      title: 'Seizures: First aid steps and key action – British Red Cross',
      youtubeId: 'YWPhudRkTxM',
    },
  },
];

/** Cards in the client's mock-up whose content has not been delivered yet. */
export const HANDBOOK_UPCOMING: { id: string; title: string; icon: HandbookIcon }[] = [
  { id: 'gay-xuong', title: 'Nghi gãy xương', icon: 'bone' },
  { id: 'duoi-nuoc', title: 'Đuối nước', icon: 'swim' },
  { id: 'soc-nhiet', title: 'Kiệt sức & Sốc nhiệt', icon: 'sun' },
  { id: 'dot-quy', title: 'Đột quỵ (FAST)', icon: 'brain' },
  { id: 'nhoi-mau-co-tim', title: 'Nhồi máu cơ tim', icon: 'heart-pulse' },
];

export function getArticle(id: string | undefined): HandbookArticle | undefined {
  return HANDBOOK.find((a) => a.id === id);
}

/** Lower-case, accent-free text so "bong" finds "Bỏng". */
export function normalizeVi(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}

function articleText(a: HandbookArticle): string {
  const list = (l?: HandbookList) => [l?.intro, ...(l?.paragraphs ?? []), ...(l?.bullets ?? [])];
  return [
    a.title,
    a.cardTitle,
    ...list(a.recognize),
    ...a.actions.map((x) => x.text),
    ...(a.actionNotes ?? []),
    a.escalation,
    ...a.avoid,
    a.whenToCall?.title,
    ...list(a.whenToCall),
    a.note,
  ]
    .filter(Boolean)
    .join(' ');
}

/** Articles whose title or content contains every word of the query (accent-insensitive). */
export function searchHandbook(query: string): HandbookArticle[] {
  const words = normalizeVi(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return HANDBOOK;
  return HANDBOOK.filter((a) => {
    const text = normalizeVi(articleText(a));
    return words.every((w) => text.includes(w));
  });
}
