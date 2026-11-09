import { BASE_STAGE } from '../../features/sim/stageDefaults';
import type { SimScenario, StageState } from '../../features/sim/types';

const ROOM: StageState = { ...BASE_STAGE, scene: 'stroke-room' };
/** After the 115 call: the player holds the phone on speaker. */
const ON_CALL: StageState = {
  ...ROOM,
  nam: 'rest',
  cup: 'floor',
  clock: '8:25',
  called: true,
  phone: true,
};

/**
 * Tình huống 3 – Đột quỵ (nội dung theo tài liệu "Nội dung tình huống 3: Đột quỵ"; tài liệu đánh
 * số các round 8.1–8.4, trong game là Màn 3.1–3.4). Bệnh nhân là Ông Nội; ở Màn 3.2 người chơi
 * lấy điện thoại gọi 115 (mua ở Cửa hàng → Túi đồ → bấm 115), giống Tình huống 1.
 */
export const stroke: SimScenario = {
  id: 'stroke',
  number: 3,
  title: 'Đột quỵ',
  topic: 'stroke',
  location: 'Phòng khách',
  shopItems: ['phone'],
  patient: 'Ông Nội',
  rounds: [
    {
      id: '3-1',
      code: '3.1',
      title: 'Nhận biết dấu hiệu nghi ngờ đột quỵ',
      summary:
        'Ông Nội đột ngột làm rơi cốc, một bên khóe miệng xệ, tay trái yếu và lời nói ngập ngừng.',
      difficulty: 1,
      reward: 20,
      setting: 'Phòng khách lúc 8:20–8:25 sáng',
      cast: ['nam', 'player'],
      stage: { ...ROOM, clock: '8:20' },
      intro: [
        { kind: 'narration', text: '8:20, Ông Nội ngồi uống nước trong phòng khách.' },
        {
          kind: 'line',
          speaker: 'player',
          text: 'Cháu chào Ông ạ. Ông đang xem chương trình gì thế ạ?',
        },
        {
          kind: 'narration',
          text: '8:25, cốc nước rơi xuống.',
          effect: { nam: 'stroke', cup: 'floor', clock: '8:25' },
        },
        { kind: 'line', speaker: 'nam', text: 'Ông... không... cầm được...' },
        { kind: 'line', speaker: 'player', text: 'Ông ơi, ông có nghe cháu nói không?' },
        { kind: 'narration', text: 'Một bên khóe miệng xệ, tay trái buông xuống.' },
        {
          kind: 'mission',
          text: 'Hãy phát hiện dấu hiệu nguy hiểm và gọi cấp cứu ngay khi nghi ngờ đột quỵ.',
          effect: { freeze: true },
        },
      ],
      questions: [
        {
          id: 'q1',
          prompt: 'Ông Nội đột ngột méo miệng, yếu một tay và nói khó. Bạn nghi ngờ điều gì?',
          options: [
            { id: 'a', text: 'Ông chỉ bị mệt do thiếu ngủ.', art: 'st-yawn' },
            { id: 'b', text: 'Ông có thể đang bị đột quỵ.', art: 'st-face-droop' },
            { id: 'c', text: 'Ông đang bị đau dạ dày.', art: 'st-stomach' },
          ],
          hint: 'Các dấu hiệu xuất hiện đột ngột ở mặt, tay và lời nói – chúng liên quan đến cơ quan nào?',
          correctId: 'b',
          explanation:
            'Méo miệng, yếu tay và nói khó xuất hiện đột ngột là những dấu hiệu cảnh báo đột quỵ. Đừng chờ đủ ba dấu hiệu: nghi ngờ một dấu hiệu điển hình cũng cần gọi cấp cứu ngay.',
          effect: { signs: true },
          caption: 'Các dấu hiệu được khoanh trên Ông Nội. Nghi ngờ đột quỵ → gọi 115 ngay.',
          task: 'stroke-signs',
        },
        {
          id: 'q3',
          prompt:
            'Nếu bạn chỉ quan sát thấy một bên mặt Ông Nội đột ngột xệ xuống, chưa thấy dấu hiệu khác, nên làm gì?',
          options: [
            { id: 'a', text: 'Gọi 115 vì vẫn nghi ngờ đột quỵ.', art: 'st-call-icon' },
            { id: 'b', text: 'Đợi thêm 30 phút để đủ triệu chứng.', art: 'st-wait-30' },
            { id: 'c', text: 'Cho ông tự lái xe đến phòng khám.', art: 'st-car-keys' },
          ],
          hint: 'Một dấu hiệu đột ngột đã đủ để nghi ngờ – có nên chờ thêm không?',
          correctId: 'a',
          explanation:
            'Một dấu hiệu FAST mới xuất hiện đột ngột đã đủ để nghi ngờ đột quỵ; đánh giá thêm không được làm chậm cấp cứu.',
          caption: 'ƯU TIÊN: 115 – mọi thao tác khác nhường chỗ cho cuộc gọi cấp cứu.',
        },
        {
          id: 'q4',
          prompt:
            'Ngoài mặt, tay và lời nói, dấu hiệu nào khác cũng có thể gợi ý đột quỵ nếu xảy ra đột ngột?',
          options: [
            { id: 'a', text: 'Hắt hơi khi có bụi.', art: 'st-sneeze' },
            { id: 'b', text: 'Mất thăng bằng hoặc thay đổi thị lực.', art: 'st-balance' },
            { id: 'c', text: 'Đói bụng sau khi bỏ bữa.', art: 'st-plate' },
          ],
          hint: 'Đột quỵ ảnh hưởng đến não – não điều khiển cả thăng bằng và việc nhìn.',
          correctId: 'b',
          explanation:
            'Nguyên tắc B.E.F.A.S.T. bổ sung Balance (thăng bằng) và Eyes (thị lực). Đây là gợi ý nhận biết, không phải công cụ tự chẩn đoán.',
          infoCard: 'befast',
          caption: 'Có dấu hiệu nghi ngờ → gọi 115.',
        },
        {
          id: 'q5',
          prompt: 'Ông Nội muốn đứng lên “đi thử xem còn khỏe không”. Bạn nên phản ứng ra sao?',
          options: [
            {
              id: 'a',
              text: 'Để ông đi vì như vậy sẽ kiểm tra được sức khỏe.',
              art: 'st-stand-alone',
            },
            { id: 'b', text: 'Dìu ông chạy quanh phòng cho tỉnh táo.', art: 'st-run-room' },
            {
              id: 'c',
              text: 'Khuyên ông không tự đi lại, giúp ông nghỉ an toàn và chờ hướng dẫn cấp cứu.',
              art: 'st-rest-safe',
            },
          ],
          hint: 'Ông đang yếu một bên người – nếu đứng lên đi lại, điều gì có thể xảy ra?',
          correctId: 'c',
          explanation:
            'Yếu một bên cơ thể và mất thăng bằng có thể khiến người bệnh té ngã. Cần tránh vận động không cần thiết và làm theo hướng dẫn của nhân viên cấp cứu.',
          effect: { nam: 'rest' },
          caption: 'Ông Nội không đứng dậy, ngồi nghỉ an toàn. Tiếp theo: gọi 115 ngay ở Màn 3.2.',
        },
      ],
    },
    {
      id: '3-2',
      code: '3.2',
      title: 'Gọi cấp cứu và hỗ trợ những phút đầu',
      summary:
        'Gọi 115 một lần, báo địa chỉ, dấu hiệu, thời điểm cuối cùng còn bình thường và ở lại theo dõi ông.',
      difficulty: 2,
      reward: 25,
      setting: 'Phòng khách, khoảng 8:25',
      cast: ['nam', 'player'],
      stage: { ...ROOM, nam: 'rest', cup: 'floor', clock: '8:25' },
      openingTask: 'call-115-speaker',
      intro: [
        {
          kind: 'narration',
          text: 'Vừa phát hiện dấu hiệu nghi ngờ đột quỵ, bạn lấy ngay điện thoại. Đồng hồ vẫn chỉ khoảng 8:25.',
        },
        {
          kind: 'line',
          speaker: 'player',
          text: 'Ông có dấu hiệu đột quỵ. Cháu gọi cấp cứu ngay!',
        },
        { kind: 'narration', text: 'Ông Nội vẫn ngồi trên ghế.' },
        {
          kind: 'mission',
          text: 'Hãy gọi 115 ngay, rồi giúp nhân viên cấp cứu biết ông đang ở đâu, biểu hiện thế nào và triệu chứng bắt đầu khi nào.',
        },
      ],
      questions: [
        {
          id: 'q2',
          prompt: 'Khi tổng đài bắt máy, bạn nên nói thông tin gì trước?',
          options: [
            { id: 'a', text: 'Tên chương trình TV mà ông đang xem.', art: 'st-point-tv' },
            {
              id: 'b',
              text: 'Địa điểm, nghi ngờ đột quỵ và dấu hiệu quan sát được.',
              art: 'st-address-card',
            },
            { id: 'c', text: 'Chỉ nói ông không khỏe rồi ngắt máy.', art: 'st-hangup' },
          ],
          hint: 'Xe cấp cứu cần biết phải đến đâu và chuyện gì đang xảy ra.',
          correctId: 'b',
          explanation:
            'Địa chỉ chính xác và mô tả ngắn các triệu chứng nghi ngờ đột quỵ giúp tổng đài điều phối hỗ trợ và hướng dẫn bước tiếp theo.',
          infoCard: 'checklist',
          caption: 'Checklist 3 mục: địa chỉ – dấu hiệu – tình trạng đều đã được xác nhận.',
        },
        {
          id: 'q3',
          prompt:
            'Ông Nội vẫn bình thường lúc 8:20; khoảng 8:25 bạn thấy ông xuất hiện dấu hiệu. Thông tin nào đúng nhất để báo?',
          options: [
            {
              id: 'a',
              text: '“8:20 ông còn bình thường; khoảng 8:25 tôi phát hiện triệu chứng.”',
              art: 'st-timeline',
            },
            { id: 'b', text: '“Chắc xảy ra từ rất sớm, tôi đoán vậy.”', art: 'st-blurry-times' },
            { id: 'c', text: '“Thời điểm này không quan trọng.”', art: 'st-clock-crossed' },
          ],
          hint: 'Hãy báo đúng những mốc giờ bạn thực sự biết, không đoán.',
          correctId: 'a',
          explanation:
            'Cần phân biệt thời điểm cuối cùng người bệnh được xác nhận còn bình thường và thời điểm phát hiện triệu chứng; không tự suy đoán khi không chắc.',
          infoCard: 'timeline',
          caption:
            'Thẻ “Last known well 8:20 / phát hiện khoảng 8:25” đã được thêm vào nhật ký game.',
        },
        {
          id: 'q4',
          prompt:
            'Nếu bạn chỉ vừa bước vào phòng và không biết triệu chứng bắt đầu khi nào, nên báo thế nào?',
          options: [
            {
              id: 'a',
              text: 'Tự chọn một giờ để tổng đài khỏi hỏi lại.',
              art: 'st-random-time',
            },
            { id: 'b', text: 'Che giấu việc không biết thời gian.', art: 'st-blank-hangup' },
            {
              id: 'c',
              text: 'Nói rõ mình không biết lúc khởi phát và cung cấp mốc cuối cùng được biết còn bình thường nếu có.',
              art: 'st-unknown',
            },
          ],
          hint: 'Nhân viên y tế cần thông tin có thể kiểm chứng, kể cả khi đó là “tôi không biết”.',
          correctId: 'c',
          explanation:
            'Báo cáo đúng những gì quan sát được quan trọng hơn việc đưa ra một mốc thời gian đoán. Nhân viên y tế cần thông tin có thể xác minh.',
          caption:
            'Không biết ≠ được phép đoán. Ở tình huống đang chơi, bạn vẫn biết mốc 8:20/8:25.',
        },
        {
          id: 'q5',
          prompt:
            'Sau khi đã liên hệ cấp cứu, cách hỗ trợ nào phù hợp nhất với Ông Nội đang tỉnh nhưng yếu tay?',
          options: [
            {
              id: 'a',
              text: 'Ở cạnh, trấn an, theo dõi và làm theo hướng dẫn tổng đài.',
              art: 'st-stay-speaker',
            },
            { id: 'b', text: 'Để ông tự đi xuống cầu thang chờ xe.', art: 'st-stairs' },
            { id: 'c', text: 'Rời đi mua nước và thuốc trước.', art: 'st-alone-room' },
          ],
          hint: 'Trong lúc chờ xe, ai sẽ theo dõi Ông Nội nếu tình trạng thay đổi?',
          correctId: 'a',
          explanation:
            'Ở lại với người bệnh, theo dõi những thay đổi về ý thức và hô hấp, duy trì an toàn và thực hiện hướng dẫn cấp cứu.',
          effect: { nam: 'rest' },
          caption:
            'Bạn ở lại cạnh ông, điện thoại mở loa ngoài; Ông Nội ngồi nghỉ thoải mái. Tổng đài có thể tiếp tục hướng dẫn khi cần.',
        },
      ],
    },
    {
      id: '3-3',
      code: '3.3',
      title: 'Phân biệt lời khuyên và tránh xử lý sai',
      summary: 'Cô Lan lo lắng, đề nghị cho Ông Nội uống nước, uống aspirin và xoa bóp.',
      difficulty: 2,
      reward: 30,
      setting: 'Phòng khách, đã gọi 115',
      cast: ['nam', 'player', 'lan'],
      stage: { ...ON_CALL, cup: 'table' },
      intro: [
        {
          kind: 'narration',
          text: 'Đã gọi 115. Cô Lan từ bếp bước ra, lo lắng khi thấy Ông Nội mệt.',
        },
        {
          kind: 'line',
          speaker: 'lan',
          text: 'Để cô lấy nước với aspirin cho ông uống!',
          effect: { cup: 'lan', aspirin: 'lan' },
        },
        { kind: 'line', speaker: 'player', text: 'Mình đợi hướng dẫn y tế đã cô.' },
        { kind: 'line', speaker: 'lan', text: 'Hay xoa bóp tay chân xem sao?' },
        {
          kind: 'mission',
          text: 'Hãy xác định hành động nào thực sự giúp bảo vệ Ông Nội trong lúc chờ nhân viên y tế.',
        },
      ],
      questions: [
        {
          id: 'q1',
          prompt: 'Cô Lan định đưa cốc nước cho Ông Nội đang nói khó. Bạn nên làm gì?',
          options: [
            { id: 'a', text: 'Đưa nước ngay vì ông đang khát.', art: 'st-lan-cup' },
            {
              id: 'b',
              text: 'Không tự ý cho ông uống, vì có thể khó nuốt/sặc.',
              art: 'st-cup-table',
            },
            { id: 'c', text: 'Dùng ống hút để uống nhanh hơn.', art: 'st-straw' },
          ],
          hint: 'Người đang nói khó cũng có thể đang nuốt khó.',
          correctId: 'b',
          explanation:
            'Đột quỵ có thể làm suy giảm khả năng nuốt và tăng nguy cơ sặc. Không tự cho ăn uống khi đang nghi ngờ đột quỵ, trừ khi nhân viên y tế trực tiếp hướng dẫn.',
          effect: { cup: 'table' },
          caption: 'Cốc nước được đặt lại bàn. Cô Lan: “Cô hiểu rồi.”',
        },
        {
          id: 'q2',
          prompt:
            'Cô Lan tìm được aspirin và nói rằng “thuốc giúp tan cục máu đông”. Bạn nên phản hồi thế nào?',
          options: [
            {
              id: 'a',
              text: 'Không tự ý cho aspirin khi nghi ngờ đột quỵ.',
              art: 'st-aspirin-table',
            },
            {
              id: 'b',
              text: 'Uống càng sớm càng tốt dù chưa biết loại đột quỵ.',
              art: 'st-aspirin-hand',
            },
            { id: 'c', text: 'Uống gấp đôi liều để nhanh khỏi.', art: 'st-aspirin-two' },
          ],
          hint: 'Không phải đột quỵ nào cũng do cục máu đông gây ra.',
          correctId: 'a',
          explanation:
            'Không phải mọi đột quỵ đều do tắc mạch; đột quỵ xuất huyết có thể trở nặng nếu dùng aspirin. Chỉ dùng thuốc khi có chỉ định chuyên môn.',
          effect: { aspirin: 'table' },
          caption: 'Vỉ aspirin trở thành vật dụng “không tự ý sử dụng”.',
          task: 'sort-items',
        },
        {
          id: 'q4',
          prompt: 'Cô Lan muốn dìu ông đi lại và xoa bóp mạnh bên tay yếu. Bạn nên làm gì?',
          options: [
            { id: 'a', text: 'Để ông đi cho máu lưu thông.', art: 'st-walk-lean' },
            { id: 'b', text: 'Ép ông tập đứng lên ngay.', art: 'st-pull-up' },
            {
              id: 'c',
              text: 'Không ép ông vận động hoặc xoa bóp mạnh; giúp ông ở vị trí an toàn và theo dõi.',
              art: 'st-rest-watch',
            },
          ],
          hint: 'Ông đang yếu và dễ mất thăng bằng – điều gì giữ ông an toàn nhất?',
          correctId: 'c',
          explanation:
            'Người nghi đột quỵ có thể yếu, mất thăng bằng và dễ ngã. Việc xoa bóp không thay thế cấp cứu; ưu tiên an toàn và làm theo tổng đài.',
          caption: 'Cô Lan rút lại lời khuyên. Xoa bóp không phải là cách chữa đột quỵ.',
        },
        {
          id: 'q5',
          prompt:
            'Một lúc sau ông nói rõ hơn, tay cử động khá hơn và bảo hủy xe cấp cứu. Bạn chọn gì?',
          options: [
            { id: 'a', text: 'Hủy xe cấp cứu vì ông khỏe rồi.', art: 'st-amb-cancel' },
            {
              id: 'b',
              text: 'Vẫn chờ cấp cứu, thông báo rằng triệu chứng đã xuất hiện rồi giảm đi.',
              art: 'st-amb-coming',
            },
            { id: 'c', text: 'Cho ông tự lái xe đến bệnh viện.', art: 'st-keys-better' },
          ],
          hint: 'Triệu chứng giảm đi chưa có nghĩa là đã hết nguy hiểm.',
          correctId: 'b',
          explanation:
            'Các triệu chứng có thể giảm/biến mất trong cơn thiếu máu não thoáng qua (TIA) hoặc một biến cố khác; vẫn cần đánh giá y tế khẩn cấp. Không tự kết luận đã khỏi.',
          effect: { nam: 'better' },
          caption: 'Ông Nội tạm nói rõ hơn, nhưng cấp cứu vẫn cần thiết – xe cấp cứu vẫn đang đến.',
        },
      ],
    },
    {
      id: '3-4',
      code: '3.4',
      title: 'Mất ý thức và nhận biết ngừng thở bình thường',
      summary:
        'Ông Nội đột ngột lịm đi: lúc đầu vẫn thở đều, sau đó chỉ còn những nhịp thở ngáp cá.',
      difficulty: 3,
      reward: 35,
      setting: 'Phòng khách, đang chờ xe cấp cứu',
      cast: ['nam', 'player', 'lan', 'paramedic'],
      stage: {
        ...ON_CALL,
        nam: 'better',
        cup: 'table',
        aspirin: 'table',
      },
      intro: [
        {
          kind: 'narration',
          text: 'Ông Nội đang nghỉ thì đột nhiên ngừng trả lời.',
          effect: { nam: 'unresponsive' },
        },
        { kind: 'line', speaker: 'lan', text: 'Ông ơi, ông có nghe tôi không?' },
        { kind: 'line', speaker: 'player', text: 'Ông Nội ơi!' },
        {
          kind: 'narration',
          text: 'Bạn gọi và chạm nhẹ vào vai ông. Ông không phản ứng.',
        },
        {
          kind: 'line',
          speaker: 'player',
          text: 'Cô báo ngay với tổng đài rằng ông mất ý thức!',
        },
        {
          kind: 'mission',
          text: 'Hãy kiểm tra xem ông còn thở bình thường hay không. Làm theo hướng dẫn cấp cứu nếu tình trạng xấu đi.',
        },
      ],
      questions: [
        {
          id: 'q1',
          prompt:
            'Ông Nội không phản ứng khi được gọi và chạm nhẹ vai. Hành động đầu tiên phù hợp nhất là gì?',
          options: [
            { id: 'a', text: 'Lay lắc thật mạnh để ông tỉnh.', art: 'st-shake' },
            {
              id: 'b',
              text: 'Báo ngay tình trạng cho 115 và nhanh chóng kiểm tra nhịp thở.',
              art: 'st-check-breath',
            },
            { id: 'c', text: 'Đưa nước vào miệng để ông tỉnh lại.', art: 'st-water-unconscious' },
          ],
          hint: 'Mất ý thức là tình trạng mới, nặng hơn – ai cần biết ngay, và cần kiểm tra điều gì?',
          correctId: 'b',
          explanation:
            'Mất ý thức là tình huống nguy hiểm; phải cập nhật cấp cứu và kiểm tra nhanh xem còn thở bình thường không. Không cho uống hoặc lay lắc mạnh.',
          effect: { lanPhone: true, phone: false },
          caption: 'Cô Lan cập nhật cho 115 qua loa ngoài; bạn kiểm tra nhịp thở của ông.',
        },
        {
          id: 'q2',
          prompt:
            'Ông Nội chưa tỉnh lại nhưng vẫn thở đều. Không nghi ngờ chấn thương đầu/cổ/lưng. Bạn nên làm gì?',
          options: [
            {
              id: 'a',
              text: 'Giúp ông vào tư thế nằm nghiêng an toàn nếu làm được an toàn, tiếp tục theo dõi nhịp thở và làm theo 115.',
              art: 'st-recovery',
            },
            {
              id: 'b',
              text: 'Bắt đầu ép tim ngay dù ông đang thở bình thường.',
              art: 'st-cpr-breathing',
            },
            { id: 'c', text: 'Để ông nằm ngửa rồi đổ nước vào miệng.', art: 'st-pour-water' },
          ],
          hint: 'Ông vẫn đang thở bình thường – cần giữ đường thở thông thoáng và theo dõi.',
          correctId: 'a',
          explanation:
            'Người không đáp ứng nhưng vẫn thở bình thường có thể được đặt ở tư thế nằm nghiêng an toàn khi không có dấu hiệu chấn thương liên quan; cần theo dõi liên tục và tuân theo hướng dẫn cấp cứu. CPR không được chỉ định nếu vẫn thở bình thường.',
          effect: { nam: 'recovery', breathing: 'normal' },
          caption: 'Ông Nội nằm nghiêng trên bề mặt an toàn; cô Lan cùng bạn theo dõi nhịp thở.',
          task: 'breathing-check',
        },
        {
          id: 'q4',
          prompt: 'Ông Nội không phản ứng và chỉ thở ngáp cá. Bạn nên làm gì?',
          options: [
            {
              id: 'a',
              text: 'Đợi ông tự thở lại vì còn thấy miệng chuyển động.',
              art: 'st-wait-gasp',
            },
            {
              id: 'b',
              text: 'Bắt đầu CPR trên mặt phẳng chắc chắn theo hướng dẫn 115; nhờ lấy AED nếu có.',
              art: 'st-cpr-aed',
            },
            { id: 'c', text: 'Cho ông dùng aspirin ngay.', art: 'st-aspirin-mouth' },
          ],
          hint: 'Thở ngáp cá không phải là thở bình thường.',
          correctId: 'b',
          explanation:
            'Thở ngáp cá không được xem là hô hấp bình thường. Người không đáp ứng và không thở bình thường cần CPR ngay; AED dùng khi có sẵn và theo hướng dẫn thiết bị/tổng đài.',
          effect: { nam: 'cpr', hands: true },
          caption:
            'CPR mô phỏng theo hướng dẫn của 115 qua loa ngoài (game không hướng dẫn kỹ thuật chi tiết).',
        },
        {
          id: 'q5',
          prompt: 'Khi nhân viên cấp cứu đến, bộ thông tin nào hữu ích nhất để bàn giao?',
          options: [
            { id: 'a', text: 'Chỉ kể rằng ông vừa bị ngất.', art: 'st-say-fainted' },
            {
              id: 'b',
              text: 'Kể dài về những gì ông ăn hôm qua, không nói thời gian.',
              art: 'st-long-talk',
            },
            {
              id: 'c',
              text: 'Thời điểm cuối cùng còn bình thường, lúc phát hiện dấu hiệu, diễn biến, nhịp thở và các bước đã hỗ trợ.',
              art: 'st-handover-card',
            },
          ],
          hint: 'Nhân viên y tế cần mốc thời gian, diễn biến và những gì đã làm.',
          correctId: 'c',
          explanation:
            'Nhân viên y tế cần mốc thời gian, triệu chứng và hành động đã thực hiện; thông tin phải dựa trên quan sát, không tự suy đoán.',
          effect: { ambulance: true, hands: false },
          caption: 'Nhân viên cấp cứu nhận thông tin và tiếp nhận Ông Nội.',
        },
      ],
    },
  ],
};
