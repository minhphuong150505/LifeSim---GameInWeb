import { BASE_STAGE } from '../../features/sim/stageDefaults';
import type { SimScenario, StageState } from '../../features/sim/types';

const KITCHEN: StageState = { ...BASE_STAGE, scene: 'kitchen' };

/** Tình huống 5 – Bỏng (nội dung theo tài liệu "Nội dung game Lifesim_Dev-3"). */
export const burns: SimScenario = {
  id: 'burns',
  number: 5,
  title: 'Bỏng',
  topic: 'burn',
  location: 'Phòng bếp',
  shopItems: ['cling-film', 'phone'],
  patient: 'em gái',
  rounds: [
    {
      id: '5-1',
      code: '5.1',
      title: 'Sơ cứu vết bỏng ban đầu',
      summary: 'Em gái đang pha mì thì vô tình làm đổ nước nóng lên tay.',
      difficulty: 1,
      reward: 20,
      setting: 'Phòng bếp',
      cast: ['sister', 'player'],
      stage: { ...KITCHEN, burn: 'red', ring: true, sleeve: 'long' },
      intro: [
        {
          kind: 'narration',
          text: 'Em gái đang pha mì thì vô tình làm đổ nước nóng lên tay.',
        },
        { kind: 'line', speaker: 'sister', text: 'Á! Nóng quá! Tay em đau rát quá!' },
        {
          kind: 'line',
          speaker: 'player',
          text: 'Để chị xem nào, tay em bị nước nóng đổ vào rồi!',
        },
        {
          kind: 'mission',
          text: 'Hãy giúp em gái thực hiện các bước sơ cứu ban đầu khi bị bỏng!',
        },
      ],
      questions: [
        {
          id: 'q1',
          prompt: 'Khi em gái vừa bị nước nóng đổ lên tay, việc đầu tiên bạn nên làm là gì?',
          options: [
            { id: 'a', text: 'Lấy khăn khô lau mạnh vùng da bị bỏng.', art: 'burn-towel-rub' },
            { id: 'b', text: 'Đưa vùng da bị bỏng dưới vòi nước mát đang chảy.', art: 'burn-tap' },
            { id: 'c', text: 'Dùng đá lạnh chườm trực tiếp lên vết bỏng.', art: 'burn-ice-direct' },
          ],
          hint: 'Vùng da đang rất nóng – cần làm mát nhẹ nhàng, không chà xát và không quá lạnh.',
          correctId: 'b',
          explanation:
            'Làm mát vùng bỏng ngay bằng nước mát đang chảy giúp giảm nhiệt tại vùng da bị tổn thương, hạn chế tổn thương tiếp diễn và giảm đau. Không sử dụng đá lạnh trực tiếp vì có thể làm tổn thương da nghiêm trọng hơn.',
          effect: { atSink: true },
          caption: 'Bạn kéo tay em gái đến vòi nước, đưa vùng bị bỏng dưới vòi nước mát.',
        },
        {
          id: 'q2',
          prompt: 'Em gái cần làm mát vết bỏng trong khoảng thời gian bao lâu?',
          options: [
            { id: 'a', text: 'Khoảng 1–2 phút.', art: 'cool-2min' },
            { id: 'b', text: 'Khoảng 5 phút.', art: 'cool-5min' },
            { id: 'c', text: 'Ít nhất 20 phút.', art: 'cool-20min' },
          ],
          hint: 'Nhiệt vẫn còn trong da khá lâu sau khi bị bỏng – thời gian làm mát cần đủ dài.',
          correctId: 'c',
          explanation:
            'Nên làm mát vết bỏng dưới vòi nước mát đang chảy ít nhất 20 phút. Thời gian làm mát đủ lâu giúp giảm nhiệt và hạn chế tổn thương tiếp tục lan sâu.',
          effect: { clock: '20 phút' },
          caption: 'Đồng hồ đếm ngược: làm mát ít nhất 20 phút.',
        },
        {
          id: 'q3',
          prompt: 'Trên tay em gái có đeo một chiếc nhẫn. Bạn nên xử lý như thế nào?',
          options: [
            { id: 'a', text: 'Để nguyên vì vết bỏng chưa quá nghiêm trọng.', art: 'ring-leave' },
            {
              id: 'b',
              text: 'Nhẹ nhàng tháo nhẫn khi có thể, trước khi vùng tay bị sưng.',
              art: 'ring-gentle',
            },
            {
              id: 'c',
              text: 'Kéo mạnh chiếc nhẫn ra ngay cả khi đã bị mắc kẹt.',
              art: 'ring-yank',
            },
          ],
          hint: 'Vùng bỏng có thể sưng lên sau ít phút – lúc đó chiếc nhẫn sẽ thế nào?',
          correctId: 'b',
          explanation:
            'Vùng bị bỏng có thể sưng lên. Vì vậy, cần tháo nhẫn hoặc trang sức gần khu vực tổn thương càng sớm càng tốt nếu có thể. Không cố kéo vật dụng đã dính hoặc mắc chặt vào vùng bỏng.',
          effect: { ring: false },
          caption: 'Bạn nhẹ nhàng tháo nhẫn khỏi ngón tay em gái.',
        },
        {
          id: 'q4',
          prompt: 'Nếu tay áo của em gái bị dính vào vùng da bỏng, bạn nên làm gì?',
          options: [
            { id: 'a', text: 'Giật mạnh tay áo ra khỏi vùng da bị bỏng.', art: 'sleeve-rip' },
            {
              id: 'b',
              text: 'Dùng kéo cắt bỏ phần quần áo xung quanh nhưng không tác động vào phần dính trên vết bỏng.',
              art: 'sleeve-cut',
            },
            {
              id: 'c',
              text: 'Dùng nước nóng để làm mềm phần vải đang dính.',
              art: 'sleeve-hot-water',
            },
          ],
          hint: 'Phần vải đã dính vào da thì đừng cố tách ra – chỉ bỏ phần không dính.',
          correctId: 'b',
          explanation:
            'Không cố gắng bóc hoặc kéo quần áo đã dính vào vùng bỏng vì có thể làm tổn thương da nghiêm trọng hơn. Chỉ tháo bỏ quần áo không dính và ở gần vùng bỏng nếu có thể thực hiện an toàn.',
          effect: { sleeve: 'cut' },
          caption:
            'Bạn dùng kéo cắt phần tay áo bên ngoài, giữ nguyên phần vải dính vào vết thương.',
        },
        {
          id: 'q5',
          prompt: 'Sau khi làm mát vết bỏng đủ thời gian, bạn nên làm gì tiếp theo?',
          options: [
            { id: 'a', text: 'Để vết bỏng tiếp xúc trực tiếp với bụi bẩn.', art: 'burn-dirt' },
            { id: 'b', text: 'Bôi kem đánh răng để làm dịu da.', art: 'burn-toothpaste' },
            {
              id: 'c',
              text: 'Che phủ nhẹ nhàng bằng màng bọc thực phẩm sạch hoặc vật liệu sạch không dính.',
              art: 'burn-cling-film',
            },
          ],
          hint: 'Vết bỏng cần được bảo vệ khỏi bụi bẩn bằng thứ gì sạch và không dính vào da.',
          correctId: 'c',
          explanation:
            'Sau khi làm mát, có thể phủ nhẹ vùng bỏng bằng màng bọc thực phẩm sạch để bảo vệ vết thương. Không quấn chặt quanh tay và không sử dụng vật liệu dễ dính vào vết bỏng.',
          effect: { wrap: true, atSink: false, clock: null },
          caption: 'Bạn lấy màng bọc thực phẩm và đặt nhẹ lên vùng da bị bỏng.',
        },
      ],
    },
    {
      id: '5-2',
      code: '5.2',
      title: 'Loại bỏ cách sơ cứu sai',
      summary: 'Mẹ và bà xuất hiện, mỗi người đưa ra một lời khuyên khác nhau.',
      difficulty: 2,
      reward: 25,
      setting: 'Phòng bếp',
      cast: ['sister', 'player', 'mom', 'grandma'],
      stage: { ...KITCHEN, burn: 'red', sleeve: 'cut' },
      intro: [
        {
          kind: 'narration',
          text: 'Mẹ và bà xuất hiện khi nghe tiếng em gái kêu đau.',
        },
        { kind: 'line', speaker: 'sister', text: 'Tay em vẫn còn rát quá!' },
        { kind: 'line', speaker: 'mom', text: 'Lấy đá lạnh chườm vào cho nhanh dịu!' },
        {
          kind: 'line',
          speaker: 'grandma',
          text: 'Bôi kem đánh răng lên đi, ngày xưa bà vẫn làm thế!',
        },
        { kind: 'line', speaker: 'mom', text: 'Hay lấy ít dầu ăn bôi lên cho đỡ đau?' },
        {
          kind: 'mission',
          text: 'Mỗi người đưa ra một lời khuyên khác nhau. Hãy giúp em gái lựa chọn cách xử lý an toàn!',
        },
      ],
      questions: [
        {
          id: 'q1',
          prompt: 'Bà khuyên bôi kem đánh răng lên vết bỏng. Bạn nghĩ sao?',
          options: [
            {
              id: 'a',
              text: 'Đúng, vì kem đánh răng có thể làm mát vết bỏng.',
              art: 'toothpaste-cool',
            },
            {
              id: 'b',
              text: 'Sai, vì kem đánh răng không phải phương pháp sơ cứu bỏng phù hợp và có thể gây kích ứng.',
              art: 'toothpaste-no-tap',
            },
            { id: 'c', text: 'Đúng, miễn là chỉ bôi một lớp mỏng.', art: 'toothpaste-thin' },
          ],
          hint: 'Cảm giác "mát" của kem đánh răng có thật sự làm mát vết bỏng không?',
          correctId: 'b',
          explanation:
            'Không nên bôi kem đánh răng lên vết bỏng. Các chất không phù hợp có thể gây kích ứng và cản trở việc chăm sóc vết thương. Ưu tiên làm mát bằng nước mát đang chảy.',
          effect: { atSink: true },
          caption: 'Thay vì kem đánh răng, em gái làm mát vết bỏng dưới vòi nước.',
        },
        {
          id: 'q2',
          prompt: 'Mẹ đề nghị dùng đá lạnh chườm trực tiếp lên vết bỏng. Bạn nên làm gì?',
          options: [
            { id: 'a', text: 'Đồng ý vì đá lạnh sẽ giúp giảm đau nhanh.', art: 'ice-pack-direct' },
            {
              id: 'b',
              text: 'Không sử dụng đá trực tiếp, thay vào đó tiếp tục làm mát bằng nước mát đang chảy.',
              art: 'burn-tap',
            },
            { id: 'c', text: 'Dùng đá lạnh chà nhẹ lên vùng da bị bỏng.', art: 'ice-rub' },
          ],
          hint: 'Quá lạnh cũng có thể làm tổn thương vùng da đang bị bỏng.',
          correctId: 'b',
          explanation:
            'Đá lạnh có thể làm tổn thương mô và khiến tình trạng bỏng nghiêm trọng hơn. Nước mát đang chảy là lựa chọn phù hợp để làm mát vết bỏng.',
          effect: { atSink: true, burn: 'blister' },
          caption: 'Em gái tiếp tục làm mát dưới vòi nước. Trên da xuất hiện vài bóng nước nhỏ.',
        },
        {
          id: 'q3',
          prompt:
            'Bạn phát hiện trên vùng da bị bỏng xuất hiện một số bóng nước nhỏ. Bạn nên làm gì?',
          options: [
            { id: 'a', text: 'Dùng kim chọc vỡ bóng nước để thoát dịch.', art: 'blister-pop' },
            { id: 'b', text: 'Dùng tay bóc lớp da bên ngoài.', art: 'blister-peel' },
            { id: 'c', text: 'Giữ nguyên bóng nước, không tự ý chọc vỡ.', art: 'blister-leave' },
          ],
          hint: 'Lớp da của bóng nước đang che chắn cho vùng da tổn thương bên dưới.',
          correctId: 'c',
          explanation:
            'Bóng nước là một phần của phản ứng bảo vệ vùng da bị tổn thương. Tự ý chọc vỡ có thể làm tăng nguy cơ nhiễm trùng.',
          caption: 'Giữ nguyên các bóng nước, không chạm vào.',
        },
        {
          id: 'q4',
          prompt: 'Sau khi sơ cứu, mẹ muốn bôi dầu ăn lên vết bỏng để giảm đau. Bạn nên làm gì?',
          options: [
            { id: 'a', text: 'Đồng ý vì dầu ăn giúp giữ ẩm cho vết thương.', art: 'oil-on-burn' },
            { id: 'b', text: 'Không bôi dầu ăn hoặc các chất béo lên vết bỏng.', art: 'oil-no' },
            { id: 'c', text: 'Bôi dầu ăn rồi dùng khăn quấn thật chặt.', art: 'oil-wrap-tight' },
          ],
          hint: 'Dầu và chất béo giữ nhiệt lại trên da – điều đó có giúp vết bỏng không?',
          correctId: 'b',
          explanation:
            'Không nên bôi dầu, bơ hoặc các chất béo lên vết bỏng vì chúng không giúp làm mát vết thương và có thể giữ nhiệt lại trên da.',
          effect: { atSink: false },
        },
        {
          id: 'q5',
          prompt:
            'Sau khi đã làm mát vết bỏng, em gái muốn tiếp tục chơi đùa và chạy nhảy. Bạn nên khuyên em như thế nào?',
          options: [
            {
              id: 'a',
              text: 'Có thể chơi bình thường vì vết bỏng đã được làm mát.',
              art: 'kid-play',
            },
            {
              id: 'b',
              text: 'Nghỉ ngơi, giữ vùng bỏng sạch và theo dõi tình trạng tổn thương.',
              art: 'kid-rest',
            },
            {
              id: 'c',
              text: 'Chà xát vùng da bị bỏng để kiểm tra mức độ đau.',
              art: 'burn-rub-check',
            },
          ],
          hint: 'Vùng da vừa bị bỏng vẫn cần được bảo vệ và theo dõi thêm.',
          correctId: 'b',
          explanation:
            'Sau sơ cứu, cần bảo vệ vùng tổn thương, tránh va chạm và theo dõi các dấu hiệu bất thường. Nếu vết bỏng có dấu hiệu nghiêm trọng, cần được nhân viên y tế đánh giá.',
          effect: { rest: true, atSink: false },
          caption: 'Em gái ngồi nghỉ, giữ vùng bỏng sạch.',
          task: 'cling-wrap',
        },
      ],
    },
    {
      id: '5-3',
      code: '5.3',
      title: 'Tình huống bỏng nguy hiểm',
      summary: 'Nồi nước nóng đổ xuống cánh tay và ngực em gái – vết bỏng rộng và sâu.',
      difficulty: 3,
      reward: 30,
      setting: 'Phòng bếp',
      cast: ['sister', 'player', 'mom'],
      stage: { ...KITCHEN, burn: 'severe', sleeve: 'long' },
      intro: [
        {
          kind: 'narration',
          text: 'Trong lúc đang nấu ăn, một nồi nước nóng lớn bất ngờ đổ xuống cánh tay và một phần ngực của em gái. Vùng da bị tổn thương khá rộng, xuất hiện những khu vực da trắng bệch và em gái bắt đầu cảm thấy rất đau.',
        },
        { kind: 'line', speaker: 'sister', text: 'Chị ơi, em đau quá! Tay em nhìn lạ lắm!' },
        { kind: 'line', speaker: 'mom', text: 'Vết bỏng lớn thế này thì phải làm sao?' },
        {
          kind: 'line',
          speaker: 'player',
          text: 'Chúng ta cần xử lý cẩn thận và tìm hỗ trợ y tế ngay!',
        },
        {
          kind: 'mission',
          text: 'Đánh giá mức độ nghiêm trọng của vết bỏng và đưa ra quyết định phù hợp.',
        },
      ],
      questions: [
        {
          id: 'q1',
          prompt: 'Dấu hiệu nào dưới đây cho thấy vết bỏng có thể nghiêm trọng?',
          options: [
            { id: 'a', text: 'Một vùng da nhỏ hơi đỏ và đau nhẹ.', art: 'burn-small' },
            {
              id: 'b',
              text: 'Vùng bỏng rộng, da trắng bệch hoặc cháy sẫm màu.',
              art: 'burn-large',
            },
            {
              id: 'c',
              text: 'Da hơi khô nhưng không đau và không có tổn thương.',
              art: 'skin-dry',
            },
          ],
          hint: 'Hãy nhìn vào kích thước và màu sắc của vùng da bị bỏng.',
          correctId: 'b',
          explanation:
            'Vết bỏng rộng, sâu, có vùng da trắng bệch hoặc cháy đen có thể là dấu hiệu tổn thương nghiêm trọng và cần được hỗ trợ y tế khẩn cấp.',
          caption: 'Vết bỏng của em gái rộng, có vùng da trắng bệch – rất nghiêm trọng.',
        },
        {
          id: 'q2',
          prompt: 'Khi phát hiện vết bỏng rộng và nghiêm trọng, bạn nên làm gì?',
          options: [
            { id: 'a', text: 'Chỉ sơ cứu tại nhà và chờ vết thương tự lành.', art: 'wait-home' },
            {
              id: 'b',
              text: 'Gọi cấp cứu 115 để được hỗ trợ y tế, đồng thời tiếp tục làm mát vùng bỏng phù hợp.',
              art: 'call-115-cool',
            },
            {
              id: 'c',
              text: 'Đưa em gái đi lại để kiểm tra khả năng vận động.',
              art: 'walk-around',
            },
          ],
          hint: 'Vết bỏng lớn và sâu không thể tự xử lý tại nhà.',
          correctId: 'b',
          explanation:
            'Vết bỏng lớn hoặc sâu cần được đánh giá và điều trị y tế khẩn cấp. Có thể nhờ người khác gọi cấp cứu trong khi tiếp tục làm mát vùng bỏng bằng nước mát, tránh làm lạnh toàn thân.',
          effect: { atSink: true },
          caption: 'Em gái tiếp tục làm mát vết bỏng, bạn gọi cấp cứu 115.',
          task: 'call-115',
        },
        {
          id: 'q3',
          prompt:
            'Trong lúc chờ cấp cứu, bạn phát hiện chiếc áo của em gái vẫn còn một phần dính vào vùng bỏng. Bạn nên làm gì?',
          options: [
            {
              id: 'a',
              text: 'Cố gắng kéo toàn bộ áo ra để kiểm tra vết thương.',
              art: 'shirt-pull-all',
            },
            {
              id: 'b',
              text: 'Cắt bỏ phần áo không dính, giữ nguyên phần đang dính vào da.',
              art: 'shirt-cut-free',
            },
            {
              id: 'c',
              text: 'Dùng khăn chà xát để làm sạch vùng áo dính.',
              art: 'shirt-towel-rub',
            },
          ],
          hint: 'Giống như ở màn 5.1 – phần vải đã dính vào vết bỏng thì sao?',
          correctId: 'b',
          explanation:
            'Không cố bóc quần áo dính vào vết bỏng vì có thể làm tổn thương sâu hơn. Chỉ loại bỏ những vật dụng không dính và có thể tháo an toàn.',
          effect: { sleeve: 'cut' },
          caption: 'Bạn cắt bỏ phần áo không dính, giữ nguyên phần đang dính vào da.',
        },
        {
          id: 'q4',
          prompt: 'Sau khi làm mát vùng bỏng, bạn nên che phủ vết thương như thế nào?',
          options: [
            { id: 'a', text: 'Dùng bông gòn trực tiếp phủ lên vùng bỏng.', art: 'cover-cotton' },
            { id: 'b', text: 'Quấn băng thật chặt quanh vùng bỏng.', art: 'cover-tight' },
            {
              id: 'c',
              text: 'Phủ nhẹ bằng màng bọc thực phẩm sạch theo chiều dọc, không quấn vòng quanh cơ thể.',
              art: 'cover-film-loose',
            },
          ],
          hint: 'Vùng bỏng có thể sưng lên, và sợi bông rất dễ dính vào vết thương.',
          correctId: 'c',
          explanation:
            'Che phủ nhẹ giúp bảo vệ vùng tổn thương. Không quấn chặt vì vùng bỏng có thể sưng lên; không sử dụng vật liệu dễ dính vào vết thương.',
          effect: { wrap: true, atSink: false },
          caption: 'Vết bỏng được phủ nhẹ bằng màng bọc thực phẩm sạch theo chiều dọc.',
        },
        {
          id: 'q5',
          prompt:
            'Trong khi chờ xe cấp cứu, em gái bắt đầu run và có biểu hiện lạnh. Bạn nên làm gì?',
          options: [
            {
              id: 'a',
              text: 'Tiếp tục làm lạnh toàn bộ cơ thể bằng vòi nước.',
              art: 'cool-whole-body',
            },
            {
              id: 'b',
              text: 'Giữ ấm những vùng cơ thể không bị bỏng, trấn an và theo dõi tình trạng của em gái.',
              art: 'warm-unburned',
            },
            {
              id: 'c',
              text: 'Đắp chăn dày trực tiếp lên vùng da bị bỏng.',
              art: 'blanket-on-burn',
            },
          ],
          hint: 'Em gái đang bị lạnh – nhưng vùng bỏng thì không nên bị đè nặng.',
          correctId: 'b',
          explanation:
            'Khi sơ cứu bỏng rộng, cần tránh làm cơ thể bị hạ thân nhiệt. Giữ ấm các vùng không bị bỏng và tiếp tục theo dõi người bệnh trong khi chờ nhân viên y tế.',
          effect: { blanket: true, ambulance: true, phone: false },
          caption: 'Xe cấp cứu đã đến để đưa em gái đến cơ sở y tế.',
        },
      ],
    },
  ],
};
