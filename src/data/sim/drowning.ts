import { BASE_STAGE } from '../../features/sim/stageDefaults';
import type { SimScenario } from '../../features/sim/types';

/** Tình huống 2 – Đuối nước (nội dung theo tài liệu "Nội dung game Lifesim_Dev-1"). */
export const drowning: SimScenario = {
  id: 'drowning',
  number: 2,
  title: 'Đuối nước',
  topic: 'drowning',
  location: 'Hồ bơi & hồ nước',
  shopItems: ['life-ring', 'phone'],
  rounds: [
    {
      id: '2-1',
      code: '2.1',
      title: 'Cứu từ trên bờ',
      summary:
        'Phát hiện một người đang gặp nguy hiểm dưới nước ở hồ bơi công cộng và hỗ trợ cứu họ từ trên bờ.',
      difficulty: 1,
      reward: 20,
      setting: 'Hồ bơi công cộng vào cuối tuần',
      cast: ['player', 'friend', 'victim', 'lifeguard'],
      ambience: 'pool',
      stage: { ...BASE_STAGE, scene: 'pool', shot: 'wide', victim: 'swim' },
      intro: [
        { kind: 'line', speaker: 'player', text: 'Hôm nay nóng nực quá, đi bơi thôi nào!' },
        {
          kind: 'line',
          speaker: 'victim',
          text: 'Cứu tôi vớiiiii!',
          effect: { shot: 'focus', victim: 'struggle' },
        },
        { kind: 'line', speaker: 'friend', text: 'Có người bị đuối nước mọi người ơi!' },
        {
          kind: 'mission',
          text: 'Một người đang gặp nguy hiểm dưới nước! Hãy quan sát tình huống và đưa ra những quyết định đúng để giúp họ an toàn.',
        },
      ],
      questions: [
        {
          id: 'q1',
          prompt: 'Khi phát hiện một người đang gặp nguy hiểm dưới nước, bạn nên làm gì đầu tiên?',
          options: [
            {
              id: 'a',
              text: 'Hô hoán để mọi người xung quanh biết và báo ngay cho nhân viên cứu hộ.',
              art: 'shout-guard',
            },
            {
              id: 'b',
              text: 'Nhanh chóng chạy đến chỗ nhân viên cứu hộ để trực tiếp báo tình hình, rồi quay lại khu vực hồ.',
              art: 'run-to-guard',
            },
            {
              id: 'c',
              text: 'Tiếp tục quan sát thêm một lúc để xác định người đó có thật sự cần trợ giúp hay chỉ đang mất thăng bằng tạm thời.',
              art: 'watch-wait',
            },
          ],
          hint: 'Cách nào giúp có thêm người hỗ trợ nhanh nhất mà bạn vẫn không rời mắt khỏi người gặp nạn?',
          correctId: 'a',
          explanation:
            'Khi phát hiện một người có dấu hiệu gặp nguy hiểm dưới nước, cần hô hoán để thu hút sự chú ý của những người xung quanh và báo ngay cho nhân viên cứu hộ. Việc kêu gọi hỗ trợ sớm giúp có thêm người cùng xử lý tình huống và tránh làm chậm quá trình cứu hộ.',
          effect: { lifeguard: 'alert' },
          caption: 'Nhân viên cứu hộ đã nghe thấy tiếng hô hoán!',
        },
        {
          id: 'q2',
          prompt: 'Trong lúc chờ cứu hộ đến, bạn nên làm gì?',
          options: [
            { id: 'a', text: 'Gọi người gặp nạn cố gắng tự bơi vào bờ.', art: 'tell-swim' },
            {
              id: 'b',
              text: 'Cầm phao rồi xuống nước đưa tận tay người gặp nạn.',
              art: 'ring-swim-out',
            },
            {
              id: 'c',
              text: 'Tìm phao xung quanh và hỗ trợ người gặp nạn từ trên bờ.',
              art: 'ring-from-shore',
            },
          ],
          hint: 'Người đang hoảng loạn khó tự bơi vào bờ, và bạn chưa được huấn luyện để xuống nước cứu người.',
          correctId: 'c',
          explanation:
            'Trong lúc chờ cứu hộ, nếu có phương tiện phù hợp, có thể hỗ trợ người gặp nạn từ vị trí an toàn bằng cách đưa vật nổi đến trong tầm với của họ. Không nên tự xuống nước khi chưa được huấn luyện vì người đang hoảng loạn có thể khiến cả người cứu gặp nguy hiểm.',
          task: 'rescue-ring',
        },
        {
          id: 'q3',
          prompt: 'Khi nhân viên cứu hộ đã đến, bạn nên làm gì tiếp theo?',
          options: [
            {
              id: 'a',
              text: 'Rời khỏi khu vực để nhân viên cứu hộ tự quan sát và xác định lại tình trạng từ đầu.',
              art: 'walk-away',
            },
            {
              id: 'b',
              text: 'Tiếp tục tự xử lý vì bạn đã đưa được phao cho người gặp nạn và đang kiểm soát được tình huống.',
              art: 'self-handle',
            },
            {
              id: 'c',
              text: 'Nhanh chóng thông báo tình trạng hiện tại của người gặp nạn và phối hợp theo hướng dẫn của nhân viên cứu hộ.',
              art: 'brief-guard',
            },
          ],
          hint: 'Nhân viên cứu hộ có chuyên môn – họ cần biết những gì đã xảy ra để tiếp tục.',
          correctId: 'c',
          explanation:
            'Khi nhân viên cứu hộ có mặt, nên báo nhanh những gì đã xảy ra và những hỗ trợ đã thực hiện, sau đó phối hợp theo hướng dẫn của họ. Nhân viên cứu hộ có chuyên môn và thiết bị phù hợp để tiếp tục đưa người gặp nạn đến nơi an toàn.',
          effect: { lifeguard: 'rescue', victim: 'ashore' },
          caption: 'Bạn chỉ vị trí người gặp nạn – nhân viên cứu hộ đưa họ vào bờ.',
        },
      ],
    },
    {
      id: '2-2',
      code: '2.2',
      title: 'Một mình ở hiện trường',
      summary:
        'Ở hồ nước khu dã ngoại, chưa có cứu hộ – hãy xử lý an toàn để đưa bạn mình trở lại bờ.',
      difficulty: 2,
      reward: 30,
      setting: 'Hồ nước tại khu dã ngoại',
      cast: ['player', 'friendA', 'friendB'],
      ambience: 'nature',
      stage: { ...BASE_STAGE, scene: 'lake', shot: 'wide', victim: 'swim' },
      intro: [
        { kind: 'line', speaker: 'friendA', text: 'Nước ở đây mát ghê!' },
        { kind: 'line', speaker: 'friendB', text: 'Cẩn thận nha, đoạn ngoài kia nhìn sâu á.' },
        {
          kind: 'narration',
          text: 'Bạn A bơi ra xa hơn… rồi bất ngờ chới với giữa hồ.',
          effect: { victim: 'struggle' },
        },
        { kind: 'line', speaker: 'friendA', text: 'Cứu… mình với…!' },
        {
          kind: 'line',
          speaker: 'friendB',
          text: 'Trời, có vẻ bạn ấy bị đuối nước rồi!',
          effect: { shot: 'focus' },
        },
        {
          kind: 'mission',
          text: 'Bạn của bạn đang gặp nguy hiểm dưới nước! Hãy đưa ra những quyết định phù hợp để hỗ trợ và đưa bạn ấy trở lại nơi an toàn.',
        },
      ],
      questions: [
        {
          id: 'q1',
          prompt: 'Khi thấy bạn mình đang gặp nguy hiểm dưới nước, bạn nên làm gì trước?',
          options: [
            {
              id: 'a',
              text: 'Cả hai cùng xuống nước để đưa bạn ấy vào bờ nhanh hơn.',
              art: 'both-jump',
            },
            {
              id: 'b',
              text: 'Hô hoán gọi người hỗ trợ và nhờ người bạn còn lại gọi cấp cứu.',
              art: 'shout-call',
            },
            {
              id: 'c',
              text: 'Một người xuống nước trước, người còn lại đứng quan sát tình hình.',
              art: 'one-in-one-watch',
            },
          ],
          hint: 'Xuống nước khi chưa có hỗ trợ có thể khiến thêm người gặp nạn. Việc gì cần làm sớm nhất?',
          correctId: 'b',
          explanation:
            'Cần gọi thêm sự hỗ trợ càng sớm càng tốt. Người còn lại trên bờ có thể gọi cấp cứu và theo dõi tình huống, thay vì cả hai cùng xuống nước.',
          effect: { called: true },
          caption: 'Bạn B đang gọi cấp cứu 115.',
        },
        {
          id: 'q2',
          prompt: 'Khi tiếp cận người đuối nước, điều nào quan trọng nhất?',
          options: [
            {
              id: 'a',
              text: 'Tiếp cận càng nhanh càng tốt để nạn nhân không mất thêm sức.',
              art: 'approach-fast',
            },
            {
              id: 'b',
              text: 'Có vật nổi hỗ trợ và tránh tiếp cận tay không.',
              art: 'float-reach',
            },
            {
              id: 'c',
              text: 'Chờ người gặp nạn bớt hoảng loạn rồi mới tiếp cận.',
              art: 'wait-calm',
            },
          ],
          hint: 'Người đang hoảng loạn có thể bám chặt vào người cứu – cần thứ gì để giữ khoảng cách?',
          correctId: 'b',
          explanation:
            'Người đang hoảng loạn có thể bám mạnh vào người cứu. Có vật nổi giúp tạo khoảng cách và giảm nguy cơ cho cả hai.',
          task: 'find-floats',
        },
        {
          id: 'q3',
          prompt: 'Nếu buộc phải tiếp cận người đang hoảng loạn dưới nước, điều gì cần ưu tiên?',
          options: [
            {
              id: 'a',
              text: 'Tránh để người gặp nạn bám trực tiếp vào cơ thể người cứu.',
              art: 'keep-distance',
            },
            {
              id: 'b',
              text: 'Tiến thẳng tới trước mặt để người gặp nạn dễ nhìn thấy.',
              art: 'front-face',
            },
            { id: 'c', text: 'Nắm ngay tay người gặp nạn để giữ họ lại.', art: 'grab-hand' },
          ],
          hint: 'Điều nguy hiểm nhất với người cứu là bị người hoảng loạn kéo xuống nước.',
          correctId: 'a',
          explanation:
            'Người đang hoảng loạn có thể bám rất mạnh và vô tình kéo người cứu xuống nước. Vì vậy, cứu tiếp xúc trực tiếp chỉ nên được thực hiện bởi người có kỹ năng và được huấn luyện.',
        },
        {
          id: 'q4',
          prompt:
            'Nếu buộc phải tiếp cận người đang hoảng loạn dưới nước, nên tiếp cận từ hướng nào?',
          options: [
            {
              id: 'a',
              text: 'Từ phía trước để người gặp nạn nhìn thấy người cứu.',
              art: 'approach-front',
            },
            { id: 'b', text: 'Từ bên cạnh để dễ nắm tay người gặp nạn.', art: 'approach-side' },
            {
              id: 'c',
              text: 'Từ phía sau để hạn chế nguy cơ bị người gặp nạn ôm ghì.',
              art: 'approach-behind',
            },
          ],
          hint: 'Hướng nào khiến người gặp nạn khó ôm ghì lấy người cứu nhất?',
          correctId: 'c',
          explanation:
            'Người đang hoảng loạn có thể bám chặt vào người cứu. Tiếp cận từ phía sau giúp giảm nguy cơ người cứu bị ôm ghì và kéo xuống nước.',
        },
        {
          id: 'q5',
          prompt: 'Để đưa người bị đuối nước vào bờ, ta phải làm gì?',
          options: [
            {
              id: 'a',
              text: 'Giữ cơ thể người gặp nạn hoàn toàn nằm ngang trên mặt nước.',
              art: 'tow-flat',
            },
            {
              id: 'b',
              text: 'Giữ đầu và đường thở của người gặp nạn ở trên mặt nước trong quá trình đưa vào bờ.',
              art: 'tow-head-up',
            },
            {
              id: 'c',
              text: 'Giữ thật chặt để người gặp nạn không thể cử động.',
              art: 'tow-tight',
            },
          ],
          hint: 'Điều quan trọng nhất trong lúc đưa vào bờ là người gặp nạn vẫn thở được.',
          correctId: 'b',
          explanation:
            'Mục tiêu là giúp người gặp nạn duy trì đường thở trên mặt nước trong quá trình được đưa về nơi an toàn.',
          effect: { victim: 'ashore' },
          caption: 'Bạn A đã được đưa vào bờ an toàn.',
        },
      ],
    },
    {
      id: '2-3',
      code: '2.3',
      title: 'Hồi sức tim phổi',
      summary:
        'Nạn nhân vừa được đưa lên bờ, bất tỉnh và không thở bình thường – đánh giá và bắt đầu hồi sức.',
      difficulty: 3,
      reward: 40,
      setting: 'Bờ hồ khu dã ngoại',
      cast: ['player', 'friendA'],
      ambience: 'nature',
      stage: { ...BASE_STAGE, scene: 'shore', shot: 'wide', victim: 'ashore' },
      intro: [
        { kind: 'narration', text: 'Nạn nhân vừa được đưa lên bờ và nằm bất động.' },
        {
          kind: 'line',
          speaker: 'player',
          text: 'Bạn ơi! Bạn nghe mình nói gì không?',
          effect: { shot: 'face' },
        },
        {
          kind: 'narration',
          text: 'Không thấy lồng ngực chuyển động – nạn nhân không thở bình thường.',
          effect: { shot: 'chest' },
        },
        {
          kind: 'mission',
          text: 'Nạn nhân đã bất tỉnh và không thở bình thường. Hãy đánh giá tình trạng và thực hiện các bước hồi sức phù hợp.',
          effect: { shot: 'focus' },
        },
      ],
      questions: [
        {
          id: 'q1',
          prompt:
            'Khi nạn nhân không phản ứng và không thấy ngực di động theo nhịp thở, bạn cần kiểm tra gì tiếp theo?',
          options: [
            { id: 'a', text: 'Kiểm tra nhiệt độ cơ thể.', art: 'check-temp' },
            { id: 'b', text: 'Kiểm tra mạch cảnh trong khoảng 10 giây.', art: 'check-pulse' },
            {
              id: 'c',
              text: 'Kiểm tra xem nạn nhân có bị thương ở tay chân không.',
              art: 'check-limbs',
            },
          ],
          hint: 'Cần biết ngay tim của nạn nhân còn đập hay không.',
          correctId: 'b',
          explanation:
            'Dùng tay để kiểm tra mạch cảnh của nạn nhân (vị trí mạch cảnh ngay giữa đường hõm cổ, qua phải 2 cm): dùng 2 ngón tay đặt nhẹ vào mạch cảnh và cảm nhận trong 10 giây.',
          explainImage: {
            src: '/assets/sim/carotid-pulse.jpg',
            alt: 'Ảnh thật: hai ngón tay đặt lên mạch cảnh ở cổ người nằm trên mặt đất',
            credit: 'Ảnh: Hendrik Dacquin, CC BY 2.0 (Wikimedia Commons)',
            marker: { x: 42, y: 64, label: 'Mạch cảnh' },
          },
        },
        {
          id: 'q2',
          prompt: 'Nếu không cảm nhận được mạch, bạn nên làm gì?',
          options: [
            { id: 'a', text: 'Gọi hỗ trợ cấp cứu 115 và bắt đầu CPR.', art: 'call-cpr' },
            {
              id: 'b',
              text: 'Tiếp tục kiểm tra mạch thêm khoảng 30 giây để chắc chắn.',
              art: 'check-30s',
            },
            {
              id: 'c',
              text: 'Đặt nạn nhân nằm nghiêng và chờ nhân viên y tế đến.',
              art: 'side-wait',
            },
          ],
          hint: 'Khi tim ngừng đập, mỗi giây chờ đợi đều làm giảm cơ hội sống.',
          correctId: 'a',
          explanation:
            'Khi xác định nạn nhân ngưng tim, cần gọi cấp cứu và bắt đầu hồi sức tim phổi càng sớm càng tốt.',
          effect: { called: true },
          caption: 'Đã gọi 115 – bắt đầu hồi sức tim phổi!',
        },
        {
          id: 'q3',
          prompt: 'Vị trí ép tim ở người lớn nằm ở đâu?',
          figure: 'chest-spots',
          options: [
            {
              id: 'a',
              text: 'Phía bên trái lồng ngực, ngay trên vị trí tim.',
              art: 'spot-left',
            },
            { id: 'b', text: 'Phần dưới của bụng, ngay dưới xương ức.', art: 'spot-belly' },
            {
              id: 'c',
              text: 'Ở giữa ngực, tại vùng trung tâm lồng ngực (đường nối giữa hai núm vú).',
              art: 'spot-center',
            },
          ],
          hint: 'Vị trí ép tim nằm trên xương ức, ở chính giữa lồng ngực.',
          correctId: 'c',
          explanation:
            'Đặt hai tay chồng lên nhau ở giữa ngực, tại vùng trung tâm lồng ngực (đường nối giữa hai núm vú) – đây là vị trí ép tim hiệu quả ở người lớn.',
          effect: { hands: true, called: false },
          caption: 'Hai tay bạn đã đặt vào đúng vị trí ép tim.',
          task: 'cpr-30',
        },
        {
          id: 'q4',
          prompt:
            'Nếu miệng nạn nhân có đờm dãi, bùn đất hoặc chất nôn nhìn thấy được, bạn nên làm gì?',
          options: [
            { id: 'a', text: 'Bắt đầu thổi ngạt ngay để tránh mất thời gian.', art: 'breath-now' },
            {
              id: 'b',
              text: 'Làm thông đường thở và loại bỏ những chất hoặc dị vật có thể nhìn thấy, lấy ra được.',
              art: 'clear-mouth',
            },
            { id: 'c', text: 'Ép bụng để các chất bên trong thoát ra ngoài.', art: 'press-belly' },
          ],
          hint: 'Hơi thổi vào sẽ không đi qua được nếu đường thở còn bị bít.',
          correctId: 'b',
          explanation:
            'Trước khi hỗ trợ hô hấp, cần mở thông đường thở và làm sạch các chất tiết hoặc dị vật nhìn thấy được trong miệng.',
          effect: { mouthClear: true, hands: false },
          caption: 'Miệng nạn nhân đã được làm sạch.',
        },
        {
          id: 'q5',
          prompt: 'Tư thế nào giúp mở thông đường thở trước khi thổi ngạt?',
          options: [
            { id: 'a', text: 'Ngửa đầu và nâng cằm nạn nhân.', art: 'tilt-chin' },
            { id: 'b', text: 'Nâng đầu nạn nhân thẳng lên khỏi mặt đất.', art: 'lift-head' },
            { id: 'c', text: 'Quay đầu nạn nhân hoàn toàn sang một bên.', art: 'turn-head' },
          ],
          hint: 'Tư thế nào kéo lưỡi ra khỏi cổ họng để không khí đi vào được?',
          correctId: 'a',
          explanation:
            'Ngửa đầu – nâng cằm giúp kéo lưỡi ra khỏi thành sau họng, mở thông đường thở để hơi thổi đi vào phổi.',
          effect: { airway: true },
          caption: 'Ngửa đầu – nâng cằm: đường thở đã mở.',
          task: 'breath-order',
        },
        {
          id: 'q6',
          prompt:
            'Sau 30 lần ép tim và 2 lần thổi ngạt, nạn nhân vẫn chưa có dấu hiệu hồi phục. Bạn nên làm gì?',
          options: [
            {
              id: 'a',
              text: 'Dừng CPR một lúc để kiểm tra xem nạn nhân có tự hồi phục không.',
              art: 'pause-cpr',
            },
            { id: 'b', text: 'Chuyển sang ép bụng để đưa nước ra ngoài.', art: 'press-belly' },
            {
              id: 'c',
              text: 'Tiếp tục chu kỳ 30 lần ép tim – 2 lần thổi ngạt.',
              art: 'cpr-30-2',
            },
          ],
          hint: 'Ngừng ép tim đồng nghĩa với việc máu ngừng được bơm lên não.',
          correctId: 'c',
          explanation:
            'Nếu nạn nhân vẫn chưa hồi phục, tiếp tục chu kỳ 30:2 cho đến khi tình trạng thay đổi hoặc đội cấp cứu đến.',
          effect: { hands: true },
        },
        {
          id: 'q7',
          prompt: 'Cách xử lý nào sau đây cần tránh khi sơ cứu người đuối nước?',
          options: [
            { id: 'a', text: 'Tiếp tục CPR nếu nạn nhân chưa hồi phục.', art: 'cpr-30-2' },
            {
              id: 'b',
              text: 'Dốc ngược nạn nhân hoặc ép bụng để cố đẩy nước ra ngoài.',
              art: 'upside-down',
            },
            {
              id: 'c',
              text: 'Làm sạch dị vật nhìn thấy được trước khi hỗ trợ hô hấp.',
              art: 'clear-mouth',
            },
          ],
          hint: 'Câu hỏi tìm cách làm CẦN TRÁNH – cách nào làm mất thời gian hồi sức?',
          correctId: 'b',
          explanation:
            'Dốc ngược nạn nhân làm mất thời gian hồi sức, còn ép bụng có thể gây nôn và tăng nguy cơ hít sặc. Không nên trì hoãn CPR để cố đưa nước ra ngoài.',
        },
      ],
    },
  ],
};
