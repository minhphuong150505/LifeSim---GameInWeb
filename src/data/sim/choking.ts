import { BASE_STAGE } from '../../features/sim/stageDefaults';
import type { SimScenario, StageState } from '../../features/sim/types';

const DINING: StageState = { ...BASE_STAGE, scene: 'dining-room' };

/** Tình huống 4 – Hóc dị vật đường thở (nội dung theo tài liệu "hocdivat.pdf"). */
export const choking: SimScenario = {
  id: 'choking',
  number: 4,
  title: 'Hóc dị vật đường thở',
  topic: 'choking',
  location: 'Phòng ăn',
  shopItems: ['phone'],
  rounds: [
    {
      id: '4-1',
      code: '4.1',
      title: 'Hóc thức ăn nhẹ',
      summary: 'Em trai bị hóc thức ăn nhẹ, vẫn có thể ho và nói chuyện.',
      difficulty: 1,
      reward: 20,
      setting: 'Phòng ăn trong nhà',
      cast: ['brother', 'player'],
      stage: DINING,
      intro: [
        {
          kind: 'narration',
          text: 'Bạn và em trai đang ngồi ăn nho cùng nhau tại bàn trong phòng ăn.',
        },
        {
          kind: 'narration',
          text: 'Trong lúc ăn nho, em trai bất ngờ bị mắc thức ăn trong cổ họng. Em vẫn có thể ho, nói chuyện nhưng cảm thấy khó chịu.',
          effect: { choke: 'cough' },
        },
        { kind: 'line', speaker: 'brother', text: 'Khụ… khụ… Chị ơi, em bị mắc nho trong cổ!' },
        {
          kind: 'mission',
          text: 'Em trai có dấu hiệu bị hóc thức ăn. Hãy xác định tình trạng và lựa chọn cách xử lý phù hợp!',
        },
      ],
      questions: [
        {
          id: 'q1',
          prompt: 'Khi thấy em trai bất ngờ ho sặc sụa trong lúc ăn, bạn nên làm gì đầu tiên?',
          options: [
            {
              id: 'a',
              text: 'Bình tĩnh hỏi em có đang bị hóc không và quan sát khả năng thở, nói chuyện, ho.',
              art: 'choke-ask',
            },
            {
              id: 'b',
              text: 'Lập tức vỗ mạnh vào lưng em dù em vẫn đang ho hiệu quả.',
              art: 'choke-slap-hard',
            },
            {
              id: 'c',
              text: 'Cho em uống thật nhiều nước để đẩy thức ăn xuống.',
              art: 'choke-drink-lots',
            },
          ],
          hint: 'Trước khi làm gì, hãy xem em còn thở, nói và ho được đến mức nào.',
          correctId: 'a',
          explanation:
            'Cần đánh giá khả năng hô hấp của người bị hóc. Nếu em vẫn có thể ho mạnh, nói chuyện và hít thở, đây có thể là tình trạng tắc nghẽn đường thở nhẹ. Không nên can thiệp bằng các động tác sơ cấp cứu khi em vẫn ho hiệu quả.',
          effect: { rescuer: 'beside' },
          caption: 'Bạn cúi xuống hỏi thăm em trai, em trai vẫn có thể ho và trả lời.',
        },
        {
          id: 'q2',
          prompt: 'Em trai vẫn có thể ho mạnh và nói chuyện được. Bạn nên hướng dẫn em làm gì?',
          options: [
            {
              id: 'a',
              text: 'Cố gắng nuốt thức ăn xuống bằng cách uống nước.',
              art: 'choke-swallow-water',
            },
            {
              id: 'b',
              text: 'Tiếp tục ho để đẩy dị vật ra ngoài và được theo dõi sát.',
              art: 'choke-keep-cough',
            },
            { id: 'c', text: 'Nín thở để dị vật tự trôi xuống.', art: 'choke-hold-breath' },
          ],
          hint: 'Cơ thể em đang tự tìm cách đẩy dị vật ra – điều đó nên được tiếp tục hay dừng lại?',
          correctId: 'b',
          explanation:
            'Khi người bị hóc vẫn có thể ho mạnh, việc ho có thể tạo áp lực giúp đẩy dị vật ra khỏi đường thở. Hãy khuyến khích em tiếp tục ho và theo dõi liên tục xem tình trạng có chuyển biến xấu hay không.',
          caption: 'Em trai tự ho, bạn đứng bên cạnh theo dõi.',
        },
        {
          id: 'q3',
          prompt: 'Hành động nào KHÔNG nên thực hiện khi em trai đang bị hóc thức ăn?',
          options: [
            { id: 'a', text: 'Khuyến khích em tiếp tục ho.', art: 'choke-cheer-cough' },
            { id: 'b', text: 'Quan sát khả năng hô hấp của em.', art: 'choke-watch-breath' },
            {
              id: 'c',
              text: 'Dùng tay móc sâu vào cổ họng để lấy thức ăn ra.',
              art: 'choke-finger-sweep',
            },
          ],
          hint: 'Câu hỏi tìm việc KHÔNG nên làm – việc nào có thể đẩy dị vật vào sâu hơn?',
          correctId: 'c',
          explanation:
            'Không nên dùng tay móc họng một cách mù quáng vì có thể vô tình đẩy dị vật vào sâu hơn, khiến tình trạng tắc nghẽn nghiêm trọng hơn. Chỉ lấy dị vật khi nhìn thấy rõ và có thể lấy ra dễ dàng.',
          caption: 'Không móc họng mù quáng – chỉ quan sát và hỗ trợ đúng cách.',
        },
        {
          id: 'q4',
          prompt:
            'Sau một lúc ho, em trai vẫn chưa đẩy được thức ăn ra ngoài. Bạn nhận thấy em bắt đầu ho yếu hơn. Bạn nên làm gì?',
          options: [
            {
              id: 'a',
              text: 'Tiếp tục chờ vì dị vật có thể tự trôi xuống.',
              art: 'choke-wait',
            },
            { id: 'b', text: 'Cho em nằm xuống nghỉ ngơi.', art: 'choke-lie-rest' },
            {
              id: 'c',
              text: 'Đánh giá lại tình trạng vì đây có thể là dấu hiệu tắc nghẽn đường thở nghiêm trọng và chuẩn bị sơ cấp cứu ngay.',
              art: 'choke-reassess',
            },
          ],
          hint: 'Ho yếu đi là dấu hiệu tốt lên hay xấu đi?',
          correctId: 'c',
          explanation:
            'Ho yếu hoặc ho không hiệu quả có thể là dấu hiệu đường thở đang bị tắc nghẽn nghiêm trọng. Cần gọi người lớn hỗ trợ ngay và chuyển sang các bước sơ cấp cứu phù hợp.',
          effect: { choke: 'weak' },
          caption: 'Em trai ho yếu, vẻ mặt lo lắng – bạn nhận thấy tình trạng bất thường.',
        },
        {
          id: 'q5',
          prompt: 'Dấu hiệu nào cho thấy em trai đang bị tắc nghẽn đường thở nghiêm trọng?',
          options: [
            {
              id: 'a',
              text: 'Ho mạnh, nói chuyện bình thường và hít thở được.',
              art: 'choke-strong-cough',
            },
            {
              id: 'b',
              text: 'Không thể nói, không thể ho hiệu quả hoặc khó thở rõ rệt.',
              art: 'choke-cannot-speak',
            },
            {
              id: 'c',
              text: 'Ho nhẹ nhưng vẫn có thể nói chuyện bình thường.',
              art: 'choke-mild-cough',
            },
          ],
          hint: 'Còn nói và còn ho được nghĩa là không khí vẫn đi qua. Khi nào thì không?',
          correctId: 'b',
          explanation:
            'Khi đường thở bị tắc nghẽn nghiêm trọng, người bệnh có thể không nói được, không ho hiệu quả hoặc không thể hít thở bình thường. Đây là tình trạng khẩn cấp cần được hỗ trợ ngay lập tức.',
          caption: 'Không nói được, không ho được, khó thở rõ rệt = cần sơ cấp cứu ngay.',
        },
      ],
    },
    {
      id: '4-2',
      code: '4.2',
      title: 'Lời khuyên trái chiều',
      summary: 'Bố, mẹ và bà xuất hiện, mỗi người đưa ra một lời khuyên khác nhau.',
      difficulty: 2,
      reward: 25,
      setting: 'Phòng ăn trong nhà',
      cast: ['brother', 'player', 'mom', 'dad', 'grandma'],
      stage: { ...DINING, choke: 'severe', rescuer: 'beside' },
      intro: [
        {
          kind: 'narration',
          text: 'Em trai tiếp tục bị hóc. Lần này, em không thể ho hiệu quả và bắt đầu có dấu hiệu khó thở. Bố, mẹ và bà vội chạy đến.',
        },
        { kind: 'line', speaker: 'brother', text: 'Ư… ư… (em trai ú ớ không nói rõ lời)' },
        {
          kind: 'line',
          speaker: 'mom',
          text: 'Cho em uống chút nước đi con, chắc thức ăn sẽ trôi xuống!',
        },
        { kind: 'line', speaker: 'grandma', text: 'Hay dùng tay móc thức ăn trong cổ họng em ra?' },
        { kind: 'line', speaker: 'dad', text: 'Không được! Để bố vỗ lưng và tìm cách sơ cứu!' },
        {
          kind: 'mission',
          text: 'Mỗi người đưa ra một lời khuyên khác nhau. Hãy giúp em trai lựa chọn cách sơ cấp cứu đúng để giải phóng đường thở!',
        },
      ],
      questions: [
        {
          id: 'q1',
          prompt: 'Mẹ khuyên cho em trai uống nước để thức ăn trôi xuống. Bạn nghĩ sao?',
          options: [
            {
              id: 'a',
              text: 'Đúng, vì nước sẽ giúp đẩy dị vật xuống dạ dày.',
              art: 'water-down-stomach',
            },
            {
              id: 'b',
              text: 'Sai, vì khi đường thở bị tắc nghẽn nghiêm trọng, việc cho uống nước có thể làm chậm quá trình sơ cấp cứu và không giải quyết được dị vật.',
              art: 'stop-mom-water',
            },
            { id: 'c', text: 'Đúng, miễn là cho uống từng ngụm nhỏ.', art: 'small-sips' },
          ],
          hint: 'Dị vật đang chặn đường thở, không phải đường ăn – nước có giúp được không?',
          correctId: 'b',
          explanation:
            'Khi người bệnh không thể ho hiệu quả, nói chuyện hoặc hít thở bình thường, cần ưu tiên sơ cấp cứu giải phóng đường thở. Không nên cho ăn hoặc uống trong tình trạng này.',
          caption: 'Bạn ngăn mẹ đưa ly nước cho em trai.',
        },
        {
          id: 'q2',
          prompt: 'Bà khuyên dùng tay móc sâu vào cổ họng để lấy thức ăn. Bạn nên làm gì?',
          options: [
            {
              id: 'a',
              text: 'Đồng ý vì có thể lấy thức ăn ra nhanh hơn.',
              art: 'grandma-finger',
            },
            { id: 'b', text: 'Dùng đũa hoặc thìa để lấy dị vật.', art: 'chopsticks-spoon' },
            {
              id: 'c',
              text: 'Không móc họng mù quáng, chỉ lấy dị vật khi nhìn thấy rõ và có thể lấy ra dễ dàng.',
              art: 'stop-grandma',
            },
          ],
          hint: 'Đưa tay hay vật dụng vào sâu khi không nhìn thấy dị vật có thể khiến nó đi đâu?',
          correctId: 'c',
          explanation:
            'Việc đưa tay hoặc vật dụng vào sâu trong cổ họng khi không nhìn thấy dị vật có thể đẩy dị vật vào sâu hơn và làm tình trạng nghiêm trọng hơn.',
          caption: 'Bạn ngăn bà đưa tay vào miệng em trai.',
        },
        {
          id: 'q3',
          prompt:
            'Em trai không thể ho hiệu quả, nói chuyện hoặc hít thở bình thường. Bạn cần thực hiện thao tác sơ cấp cứu nào đầu tiên?',
          options: [
            {
              id: 'a',
              text: 'Cho em nằm ngửa và chờ dị vật tự trôi ra.',
              art: 'lie-back-wait',
            },
            {
              id: 'b',
              text: 'Thực hiện tối đa 5 lần vỗ lưng đúng cách để hỗ trợ đẩy dị vật ra ngoài.',
              art: 'back-blows-5',
            },
            { id: 'c', text: 'Yêu cầu em cố gắng nuốt thức ăn xuống.', art: 'try-swallow' },
          ],
          hint: 'Em đang không thở được – cần một thao tác chủ động giúp đẩy dị vật ra ngay.',
          correctId: 'b',
          explanation:
            'Với trẻ trên 1 tuổi bị tắc nghẽn đường thở nghiêm trọng nhưng vẫn còn tỉnh táo, cần thực hiện tối đa 5 lần vỗ lưng. Động tác được thực hiện bằng gót bàn tay, giữa hai xương bả vai, khi người bệnh được hỗ trợ nghiêng người về phía trước.',
          caption: 'Hãy thực hành vỗ lưng cho em trai!',
          task: 'back-blows',
        },
        {
          id: 'q4',
          prompt: 'Sau 5 lần vỗ lưng, dị vật vẫn chưa được đẩy ra ngoài. Bạn cần làm gì tiếp theo?',
          options: [
            {
              id: 'a',
              text: 'Tiếp tục vỗ lưng liên tục mà không thay đổi phương pháp.',
              art: 'blows-nonstop',
            },
            { id: 'b', text: 'Cho em uống nước để hỗ trợ đẩy dị vật.', art: 'water-down-stomach' },
            {
              id: 'c',
              text: 'Thực hiện tối đa 5 lần ép bụng (abdominal thrusts) đúng cách.',
              art: 'abdominal-thrusts-5',
            },
          ],
          hint: 'Vỗ lưng chưa hiệu quả thì cần chuyển sang thao tác khác mạnh hơn.',
          correctId: 'c',
          explanation:
            'Nếu 5 lần vỗ lưng không hiệu quả, cần chuyển sang tối đa 5 lần ép bụng. Người sơ cứu đứng hoặc quỳ phía sau trẻ, vòng tay quanh vùng bụng trên, đặt nắm tay ở vị trí giữa rốn và xương sườn, sau đó kéo nhanh vào trong và hướng lên trên.',
          caption: 'Hãy thực hành ép bụng cho em trai!',
          task: 'abdominal-thrusts',
        },
        {
          id: 'q5',
          prompt:
            'Sau khi thực hiện 5 lần vỗ lưng và 5 lần ép bụng, dị vật vẫn chưa ra ngoài. Bạn nên làm gì?',
          options: [
            {
              id: 'a',
              text: 'Tiếp tục luân phiên 5 lần vỗ lưng và 5 lần ép bụng, đồng thời yêu cầu người khác gọi cấp cứu 115 ngay.',
              art: 'alternate-call-115',
            },
            { id: 'b', text: 'Dừng sơ cấp cứu và chờ em tự ho.', art: 'stop-wait-cough' },
            { id: 'c', text: 'Cho em nằm nghỉ và theo dõi thêm 15 phút.', art: 'rest-15min' },
          ],
          hint: 'Dị vật vẫn còn – có nên dừng lại không? Và ai sẽ gọi hỗ trợ y tế?',
          correctId: 'a',
          explanation:
            'Nếu dị vật chưa được đẩy ra ngoài, cần tiếp tục luân phiên các chu kỳ 5 lần vỗ lưng và 5 lần ép bụng. Đồng thời, phải gọi cấp cứu 115 ngay khi tình trạng tắc nghẽn nghiêm trọng không được giải quyết. Không nên để người bệnh một mình.',
          effect: { rescuer: 'back', posture: 'forward' },
          caption: 'Bạn tiếp tục luân phiên vỗ lưng và ép bụng cho em trai.',
          task: 'call-115',
          taskTitle: 'Hãy nhờ người thân gọi cấp cứu 115!',
        },
      ],
    },
    {
      id: '4-3',
      code: '4.3',
      title: 'Em trai bất tỉnh do tắc nghẽn đường thở',
      summary: 'Dị vật vẫn chưa ra ngoài, em trai đột ngột mất phản ứng và ngã xuống sàn.',
      difficulty: 3,
      reward: 30,
      setting: 'Phòng ăn trong nhà',
      cast: ['brother', 'player', 'mom', 'dad'],
      stage: { ...DINING, choke: 'severe', rescuer: 'back', posture: 'forward' },
      intro: [
        {
          kind: 'narration',
          text: 'Em trai bạn vẫn đang bị hóc thức ăn. Sau nhiều lần sơ cấp cứu, tình trạng không cải thiện.',
        },
        {
          kind: 'narration',
          text: 'Em bắt đầu mất phản ứng và ngã xuống sàn.',
          effect: { choke: 'down', rescuer: 'beside', posture: 'upright' },
        },
        { kind: 'line', speaker: 'mom', text: 'Con ơi! Em con không trả lời nữa rồi!' },
        { kind: 'line', speaker: 'dad', text: 'Em con bất tỉnh rồi! Bây giờ phải làm sao?' },
        {
          kind: 'line',
          speaker: 'player',
          text: 'Mình phải gọi cấp cứu ngay và hỗ trợ em!',
        },
        {
          kind: 'mission',
          text: 'Tình trạng của em trai đang trở nên nguy hiểm. Hãy nhanh chóng đưa ra quyết định đúng để bảo vệ tính mạng của em!',
        },
      ],
      questions: [
        {
          id: 'q1',
          prompt:
            'Khi em trai đột ngột mất phản ứng và không còn tỉnh táo, bạn nên làm gì đầu tiên?',
          options: [
            {
              id: 'a',
              text: 'Để em nằm nghỉ và chờ em tự tỉnh lại.',
              art: 'down-stand-watch',
            },
            {
              id: 'b',
              text: 'Đặt em ở nơi bằng phẳng, an toàn, gọi người hỗ trợ và kiểm tra phản ứng, nhịp thở.',
              art: 'down-kneel-check',
            },
            { id: 'c', text: 'Cho em uống nước để lấy lại sức.', art: 'down-hold-water' },
          ],
          hint: 'Em không còn tỉnh – cần biết ngay em có phản ứng và còn thở hay không.',
          correctId: 'b',
          explanation:
            'Khi người bị hóc mất phản ứng, cần đặt người bệnh trên bề mặt phẳng, an toàn và nhanh chóng đánh giá tình trạng hô hấp. Đồng thời, cần gọi người hỗ trợ và liên hệ cấp cứu 115 ngay.',
          effect: { rescuer: 'kneel' },
          caption: 'Bạn quỳ bên cạnh em trai và kiểm tra phản ứng, nhịp thở.',
        },
        {
          id: 'q2',
          prompt: 'Sau khi em trai bất tỉnh, bạn cần làm gì tiếp theo?',
          options: [
            {
              id: 'a',
              text: 'Tiếp tục thực hiện các lần ép bụng như khi em còn tỉnh.',
              art: 'down-thrusts',
            },
            {
              id: 'b',
              text: 'Đưa em ngồi dậy và tiếp tục vỗ lưng.',
              art: 'down-sit-up-blows',
            },
            {
              id: 'c',
              text: 'Gọi cấp cứu 115, bật loa ngoài và bắt đầu hồi sức tim phổi (CPR) theo hướng dẫn của tổng đài hoặc theo kiến thức đã được đào tạo.',
              art: 'down-call-cpr',
            },
          ],
          hint: 'Em đã bất tỉnh – các thao tác cho người còn tỉnh không còn phù hợp nữa.',
          correctId: 'c',
          explanation:
            'Khi người bị hóc trở nên bất tỉnh, cần gọi cấp cứu ngay và bắt đầu hồi sức tim phổi (CPR), bắt đầu bằng ép ngực. Không tiếp tục ép bụng hoặc vỗ lưng như khi người bệnh còn tỉnh. Nếu có người khác ở đó, hãy nhờ họ gọi cấp cứu trong khi mình hỗ trợ người bệnh.',
          caption: 'Gọi 115 và bật loa ngoài để được tổng đài hướng dẫn.',
          task: 'call-115-speaker',
        },
        {
          id: 'q3',
          prompt: 'Khi em trai bất tỉnh và không thở bình thường, bạn nên thực hiện biện pháp nào?',
          options: [
            { id: 'a', text: 'Chỉ vỗ lưng thêm 5 lần.', art: 'down-blows-only' },
            {
              id: 'b',
              text: 'Bắt đầu hồi sức tim phổi (CPR) theo hướng dẫn của nhân viên cấp cứu hoặc kiến thức đã được đào tạo.',
              art: 'down-start-cpr',
            },
            {
              id: 'c',
              text: 'Chờ nhân viên y tế đến rồi mới thực hiện bất kỳ thao tác nào.',
              art: 'down-wait-medic',
            },
          ],
          hint: 'Mỗi giây chờ đợi đều quan trọng khi em không thở bình thường.',
          correctId: 'b',
          explanation:
            'Khi người bệnh bất tỉnh và không thở bình thường, cần bắt đầu CPR ngay, không chờ nhân viên y tế đến. Người sơ cứu cần làm theo hướng dẫn của tổng đài cấp cứu và thực hiện những kỹ thuật đã được đào tạo.',
          effect: { hands: true },
          caption: 'Bạn quỳ cạnh em trai, chuẩn bị thực hiện CPR trên bề mặt phẳng.',
        },
        {
          id: 'q4',
          prompt: 'Sau khi dị vật được đẩy ra ngoài và em trai bắt đầu thở lại, bạn nên làm gì?',
          options: [
            {
              id: 'a',
              text: 'Cho em đứng dậy và tiếp tục ăn uống bình thường.',
              art: 'up-eat-again',
            },
            {
              id: 'b',
              text: 'Để em tự về phòng nghỉ mà không cần kiểm tra thêm.',
              art: 'up-go-alone',
            },
            {
              id: 'c',
              text: 'Tiếp tục theo dõi hô hấp, giữ em ở trạng thái an toàn và chờ nhân viên y tế đánh giá.',
              art: 'up-monitor',
            },
          ],
          hint: 'Dị vật đã ra, nhưng sau ép bụng hoặc CPR em vẫn có thể bị tổn thương bên trong.',
          correctId: 'c',
          explanation:
            'Ngay cả khi dị vật đã được đẩy ra ngoài, người bệnh vẫn cần được nhân viên y tế kiểm tra. Đặc biệt, sau khi thực hiện ép bụng hoặc CPR, cần đánh giá các tổn thương có thể xảy ra và đảm bảo đường thở đã thông thoáng.',
          effect: {
            choke: 'breathing',
            hands: false,
            called: false,
            phone: false,
            ambulance: true,
          },
          caption:
            'Em trai nằm nghỉ an toàn, bạn ở bên cạnh theo dõi trong khi nhân viên y tế đến hỗ trợ.',
        },
      ],
    },
  ],
};
