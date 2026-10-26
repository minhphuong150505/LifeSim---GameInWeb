import type { SimScenario, StageState } from '../../features/sim/types';

const START: StageState = {
  posture: 'upright',
  pinch: false,
  mouthOpen: false,
  bleeding: true,
  dizzy: false,
  icePack: false,
  clock: null,
  phone: false,
  comfort: false,
  ambulance: false,
};

/** Tình huống 1 – Chảy máu cam (nội dung theo tài liệu "Nội dung game Lifesim"). */
export const nosebleed: SimScenario = {
  id: 'nosebleed',
  number: 1,
  title: 'Chảy máu cam',
  topic: 'nosebleed',
  location: 'Phòng khách',
  rounds: [
    {
      id: '1-1',
      code: '1.1',
      title: 'Chảy máu cam nhẹ',
      summary: 'Em trai bất ngờ bị chảy máu cam nhẹ, vẫn tỉnh táo và nói chuyện bình thường.',
      difficulty: 1,
      reward: 20,
      setting: 'Phòng khách trong nhà',
      cast: ['brother', 'player'],
      stage: START,
      intro: [
        {
          kind: 'narration',
          text: 'Một buổi chiều tại nhà, bạn đang ngồi nghỉ ở phòng khách cùng em trai sau khi em vừa chơi ngoài sân về.',
        },
        { kind: 'line', speaker: 'brother', text: 'Chị ơi, mũi em tự nhiên chảy máu!' },
        { kind: 'line', speaker: 'player', text: 'Để chị giúp em nhé!' },
        { kind: 'mission', text: 'Em trai đang bị chảy máu cam. Bạn sẽ làm gì để giúp em?' },
      ],
      questions: [
        {
          id: 'q1',
          prompt: 'Khi em trai bị chảy máu cam, bạn nên hướng dẫn em ngồi ở tư thế nào?',
          options: [
            { id: 'a', text: 'Ngồi thẳng, hơi cúi đầu về phía trước.', art: 'pose-forward' },
            { id: 'b', text: 'Ngồi ngửa đầu ra phía sau.', art: 'pose-head-back' },
            { id: 'c', text: 'Nằm ngửa trên giường.', art: 'pose-lie' },
          ],
          correctId: 'a',
          explanation:
            'Ngồi hơi cúi đầu về trước giúp ngăn máu chảy xuống họng, hạn chế nguy cơ nuốt máu gây buồn nôn hoặc khó chịu.',
          effect: { posture: 'forward' },
          caption: 'Em trai ngồi thẳng, hơi cúi đầu về phía trước.',
        },
        {
          id: 'q2',
          prompt: 'Khi bị chảy máu cam, cần bóp giữ hai cánh mũi để làm gì?',
          options: [
            { id: 'a', text: 'Ngăn không khí đi vào mũi hoàn toàn.', art: 'air-blocked' },
            { id: 'b', text: 'Tạo áp lực lên các mạch máu, giúp cầm máu.', art: 'pressure' },
            { id: 'c', text: 'Đẩy máu còn lại ra khỏi mũi nhanh hơn.', art: 'push-blood' },
          ],
          correctId: 'b',
          explanation:
            'Bóp giữ phần mềm của mũi tạo áp lực lên các mạch máu đang chảy, giúp máu đông lại và hỗ trợ cầm máu.',
        },
        {
          id: 'q3',
          prompt: 'Bạn nên hướng dẫn em trai bóp giữ vị trí nào trên mũi?',
          options: [
            { id: 'a', text: 'Phần xương cứng ở sống mũi.', art: 'pinch-bridge' },
            { id: 'b', text: 'Chỉ bịt lỗ mũi đang chảy máu.', art: 'pinch-one' },
            { id: 'c', text: 'Phần mềm của mũi, ngay phía trên hai lỗ mũi.', art: 'pinch-soft' },
          ],
          correctId: 'c',
          explanation:
            'Phần mềm ngay phía trên hai lỗ mũi là vị trí cần ép để tạo áp lực cầm máu. Bóp phần xương cứng ở sống mũi không mang lại hiệu quả tương tự.',
          effect: { pinch: true },
          caption: 'Em trai bóp giữ hai cánh mũi (phần mềm của mũi).',
        },
        {
          id: 'q4',
          prompt: 'Trong khi bóp giữ mũi để cầm máu, em trai nên thở bằng cách nào?',
          options: [
            { id: 'a', text: 'Hít thở mạnh bằng mũi.', art: 'breathe-nose' },
            { id: 'b', text: 'Thở nhẹ nhàng bằng miệng.', art: 'breathe-mouth' },
            { id: 'c', text: 'Nín thở cho đến khi máu ngừng chảy.', art: 'hold-breath' },
          ],
          correctId: 'b',
          explanation:
            'Khi hai cánh mũi được bóp giữ, người bị chảy máu cam nên thở bình thường bằng miệng để duy trì hô hấp thoải mái.',
          effect: { mouthOpen: true },
          caption: 'Em trai há miệng, thở nhẹ nhàng bằng miệng.',
        },
        {
          id: 'q5',
          prompt: 'Em trai cần bóp giữ mũi liên tục trong khoảng bao lâu?',
          options: [
            { id: 'a', text: '1–2 phút, sau đó thả tay kiểm tra.', art: 'timer-2' },
            { id: 'b', text: '10–15 phút, không thả tay liên tục để kiểm tra.', art: 'timer-15' },
            { id: 'c', text: '30 giây, sau đó xì mũi thật mạnh.', art: 'timer-blow' },
          ],
          correctId: 'b',
          explanation:
            'Cần bóp giữ phần mềm mũi liên tục khoảng 10–15 phút để hỗ trợ cầm máu. Thả tay quá sớm hoặc kiểm tra liên tục có thể làm gián đoạn quá trình cầm máu. Nếu máu vẫn không ngừng sau 15 phút giữ ép đúng cách, cần tìm hỗ trợ y tế.',
          effect: { clock: '10–15 phút' },
          caption: 'Bấm giờ: giữ ép liên tục 10–15 phút.',
        },
      ],
    },
    {
      id: '1-2',
      code: '1.2',
      title: 'Lời khuyên trái chiều',
      summary: 'Bố, mẹ và bà xuất hiện, mỗi người đưa ra một lời khuyên khác nhau.',
      difficulty: 2,
      reward: 25,
      setting: 'Phòng khách trong nhà',
      cast: ['brother', 'player', 'mom', 'dad', 'grandma'],
      stage: START,
      intro: [
        {
          kind: 'narration',
          text: 'Vài hôm sau, cả nhà đang quây quần ở phòng khách thì em trai lại bị chảy máu cam. Lần này có thêm bố, mẹ và bà.',
        },
        { kind: 'line', speaker: 'brother', text: 'Em lại bị chảy máu cam rồi!' },
        { kind: 'line', speaker: 'mom', text: 'Trời, ngửa đầu lên đi con, kẻo máu chảy nhiều!' },
        { kind: 'line', speaker: 'grandma', text: 'Lấy ít bông nhét vào mũi cho cầm máu đi!' },
        { kind: 'line', speaker: 'dad', text: 'Để bố lấy túi chườm lạnh thử xem!' },
        {
          kind: 'mission',
          text: 'Mỗi người đưa ra một lời khuyên khác nhau. Hãy giúp em trai lựa chọn cách xử lý phù hợp!',
        },
      ],
      questions: [
        {
          id: 'q1',
          prompt: 'Mẹ khuyên em trai ngửa đầu ra sau khi bị chảy máu cam. Bạn nghĩ sao?',
          options: [
            {
              id: 'a',
              text: 'Đúng, vì ngửa đầu giúp máu ngừng chảy nhanh hơn.',
              art: 'pose-head-back',
            },
            { id: 'b', text: 'Sai, vì máu có thể chảy xuống họng.', art: 'blood-throat' },
            { id: 'c', text: 'Đúng, miễn là em trai không nuốt máu.', art: 'head-back-swallow' },
          ],
          correctId: 'b',
          explanation:
            'Ngửa đầu ra sau có thể khiến máu chảy xuống họng, gây buồn nôn hoặc khó chịu. Nên ngồi thẳng và hơi cúi đầu về trước.',
          effect: { posture: 'forward' },
          caption: 'Em trai ngồi thẳng, hơi cúi đầu về trước thay vì ngửa ra sau.',
        },
        {
          id: 'q2',
          prompt: 'Bà khuyên nhét bông sâu vào mũi để cầm máu. Bạn nên làm gì?',
          options: [
            { id: 'a', text: 'Nhét bông thật sâu để ngăn máu chảy.', art: 'cotton' },
            { id: 'b', text: 'Nhét thêm giấy nếu máu vẫn tiếp tục chảy.', art: 'tissue' },
            {
              id: 'c',
              text: 'Không tự nhét bông sâu, thay vào đó bóp giữ phần mềm của mũi.',
              art: 'pinch-soft',
            },
          ],
          correctId: 'c',
          explanation:
            'Việc tự nhét bông hoặc giấy sâu vào mũi có thể gây kích ứng. Nên ưu tiên bóp giữ phần mềm của mũi để tạo áp lực cầm máu.',
        },
        {
          id: 'q3',
          prompt: 'Bây giờ, bạn cần hướng dẫn em trai bóp giữ mũi. Vị trí nào là chính xác?',
          options: [
            { id: 'a', text: 'Phần xương cứng ở sống mũi.', art: 'pinch-bridge' },
            { id: 'b', text: 'Phần mềm của mũi, ngay phía trên hai lỗ mũi.', art: 'pinch-soft' },
            { id: 'c', text: 'Chỉ bóp một bên cánh mũi đang chảy máu.', art: 'pinch-one' },
          ],
          correctId: 'b',
          explanation:
            'Bóp giữ phần mềm hai bên mũi giúp tạo áp lực lên các mạch máu đang chảy, hỗ trợ cầm máu.',
          effect: { pinch: true },
          caption: 'Em trai bóp giữ phần mềm hai bên mũi.',
          task: 'nose-tap',
        },
        {
          id: 'q4',
          prompt: 'Trong lúc bóp giữ mũi, em trai cần thực hiện như thế nào?',
          options: [
            { id: 'a', text: 'Thở bằng mũi và giữ ép khoảng 1–2 phút.', art: 'nose-2min' },
            { id: 'b', text: 'Nín thở và liên tục thả tay kiểm tra.', art: 'hold-check' },
            {
              id: 'c',
              text: 'Thở nhẹ nhàng bằng miệng và bóp giữ liên tục khoảng 10–15 phút.',
              art: 'mouth-15min',
            },
          ],
          correctId: 'c',
          explanation:
            'Khi bóp giữ hai cánh mũi, cần thở bằng miệng và duy trì áp lực liên tục khoảng 10–15 phút, không thả tay quá sớm để kiểm tra.',
          effect: { mouthOpen: true, clock: '15 phút' },
          caption: 'Đồng hồ bấm giờ 15 phút – em trai thở bằng miệng và giữ ép liên tục.',
        },
        {
          id: 'q5',
          prompt: 'Bố đề nghị sử dụng túi chườm lạnh. Bạn nên làm gì?',
          options: [
            { id: 'a', text: 'Chỉ sử dụng túi chườm lạnh mà không cần bóp mũi.', art: 'ice-only' },
            {
              id: 'b',
              text: 'Ưu tiên bóp giữ mũi đúng cách; túi chườm lạnh chỉ là hỗ trợ tùy chọn.',
              art: 'ice-plus-pinch',
            },
            { id: 'c', text: 'Đặt đá lạnh trực tiếp vào trong lỗ mũi.', art: 'ice-in-nose' },
          ],
          correctId: 'b',
          explanation:
            'Hiệu quả của chườm lạnh trong việc cầm máu cam chưa được chứng minh rõ ràng. Bóp giữ phần mềm mũi liên tục vẫn là biện pháp quan trọng nhất.',
          task: 'ice-pack',
        },
      ],
    },
    {
      id: '1-3',
      code: '1.3',
      title: 'Máu chảy không ngừng',
      summary: 'Đã sơ cứu đúng cách nhưng máu vẫn chảy kéo dài – tình huống nguy hiểm hơn.',
      difficulty: 3,
      reward: 30,
      setting: 'Phòng khách, em trai đang xem TV',
      cast: ['brother', 'player', 'mom'],
      stage: { ...START, posture: 'forward', pinch: true, mouthOpen: true, clock: '15 phút' },
      intro: [
        {
          kind: 'narration',
          text: 'Em trai bạn bị chảy máu cam khi đang ngồi xem TV. Mặc dù đã thực hiện đúng các quy trình sơ cấp cứu, tuy nhiên máu mũi vẫn chảy và vẫn chưa có dấu hiệu dừng lại.',
        },
        {
          kind: 'line',
          speaker: 'brother',
          text: 'Chị ơi, em bóp mũi nãy giờ mà máu vẫn còn chảy…',
        },
        { kind: 'line', speaker: 'mom', text: 'Đã 15 phút rồi, giờ mình phải làm sao đây?' },
        {
          kind: 'mission',
          text: 'Máu vẫn chưa ngừng sau khi sơ cấp cứu ban đầu. Hãy đánh giá tình trạng và đưa ra các quyết định đúng!',
        },
      ],
      questions: [
        {
          id: 'q1',
          prompt:
            'Dấu hiệu nào khi bị chảy máu cam cho thấy người bệnh cần được hỗ trợ y tế khẩn cấp?',
          options: [
            {
              id: 'a',
              text: 'Chảy máu nhẹ và đã ngừng sau khi sơ cấp cứu.',
              art: 'stopped-resting',
            },
            {
              id: 'b',
              text: 'Chảy máu nhiều, kéo dài và kèm chóng mặt hoặc choáng váng.',
              art: 'dizzy-helped',
            },
            { id: 'c', text: 'Mũi hơi khô nhưng không có biểu hiện bất thường.', art: 'dry-nose' },
          ],
          correctId: 'b',
          explanation:
            'Chảy máu nhiều, không ngừng sau khi sơ cấp cứu đúng cách hoặc kèm chóng mặt, choáng váng là những dấu hiệu đáng lo ngại, cần được đánh giá y tế kịp thời.',
          effect: { dizzy: true },
          caption: 'Ôi không… em trai bắt đầu thấy chóng mặt, choáng váng.',
        },
        {
          id: 'q2',
          prompt: 'Em trai bắt đầu thấy chóng mặt trong khi máu vẫn đang chảy. Bạn nên làm gì?',
          options: [
            { id: 'a', text: 'Để em trai nghỉ một lát rồi theo dõi tiếp.', art: 'rest-wait' },
            { id: 'b', text: 'Cho em trai đứng dậy đi lại để tỉnh táo hơn.', art: 'stand-up' },
            { id: 'c', text: 'Gọi cấp cứu 115 để được hỗ trợ ngay.', art: 'call-115' },
          ],
          correctId: 'c',
          explanation:
            'Chảy máu cam kéo dài kèm chóng mặt có thể là dấu hiệu nguy hiểm. Cần liên hệ cấp cứu thay vì tiếp tục chờ đợi hoặc để người bệnh tự đi lại.',
          task: 'call-115',
        },
        {
          id: 'q3',
          prompt: 'Khi gọi cấp cứu, bạn nên cung cấp những thông tin gì?',
          options: [
            { id: 'a', text: 'Chỉ cần nói em trai đang bị chảy máu cam.', art: 'say-nosebleed' },
            {
              id: 'b',
              text: 'Địa chỉ, tình trạng hiện tại, dấu hiệu chóng mặt và thời gian đã sơ cấp cứu.',
              art: 'full-info',
            },
            { id: 'c', text: 'Chỉ cần cung cấp tên và tuổi của em trai.', art: 'name-age' },
          ],
          correctId: 'b',
          explanation:
            'Nhân viên cấp cứu cần biết địa điểm, tình trạng của người bệnh, những dấu hiệu bất thường và thời gian đã sơ cấp cứu để đánh giá tình huống và đưa ra hướng dẫn phù hợp.',
        },
        {
          id: 'q4',
          prompt:
            'Sau khi gọi cấp cứu, bạn nên khuyên em trai làm gì trong lúc chờ nhân viên y tế đến?',
          options: [
            { id: 'a', text: 'Đứng dậy đi lại để cơ thể tỉnh táo hơn.', art: 'stand-up' },
            {
              id: 'b',
              text: 'Giữ bình tĩnh, tiếp tục ngồi hơi cúi về trước, bóp giữ phần mềm mũi theo hướng dẫn và để người thân theo dõi.',
              art: 'calm-watch',
            },
            {
              id: 'c',
              text: 'Nằm ngửa, ngửa đầu ra sau và chờ nhân viên y tế.',
              art: 'lie-head-back',
            },
          ],
          correctId: 'b',
          explanation:
            'Trong lúc chờ hỗ trợ, cần trấn an người bệnh, tiếp tục chăm sóc phù hợp và làm theo hướng dẫn của nhân viên cấp cứu. Không để người đang chóng mặt tự đi lại hoặc ngửa đầu ra sau.',
          effect: { comfort: true, phone: false, ambulance: true },
          caption: 'Mẹ ngồi cạnh trấn an em trai – xe cấp cứu đang tới!',
        },
      ],
    },
  ],
};
