import type { StageState } from './types';

/* Pure data of the scenario-4 hands-on tasks (back blows, abdominal thrusts), kept apart from
 * the UI so the tests can check them. */

export type TaskChoice = {
  id: string;
  text: string;
  /** Shown after picking it: why it is right, or why not. */
  tip: string;
};

/** One step of a task: pick an option, tap a spot on the body, or repeat the move N times. */
export type ChokeStep =
  | {
      kind: 'choice';
      prompt: string;
      choices: TaskChoice[];
      correct: string;
      /** Scene change once the right option is picked. */
      effect?: Partial<StageState>;
    }
  | {
      kind: 'spot';
      prompt: string;
      /** Which body figure to draw the spots on. */
      figure: 'back' | 'belly';
      choices: TaskChoice[];
      correct: string;
    }
  | { kind: 'press'; prompt: string; button: string; count: number; doneText: string };

export type ChokeTaskId = 'back-blows' | 'abdominal-thrusts';

/** Maximum number of back blows / abdominal thrusts in one cycle. */
export const CYCLE = 5;

export const CHOKE_TASKS: Record<ChokeTaskId, { title: string; steps: ChokeStep[] }> = {
  'back-blows': {
    title: 'Thực hiện tối đa 5 lần vỗ lưng cho em trai!',
    steps: [
      {
        kind: 'choice',
        prompt: 'Bạn nên đứng ở vị trí nào?',
        choices: [
          {
            id: 'front',
            text: 'Đứng phía trước, đối diện em.',
            tip: 'Đứng phía trước thì không vỗ được vào lưng và khó đỡ em nghiêng người.',
          },
          {
            id: 'behind-side',
            text: 'Đứng phía sau và hơi lệch sang một bên.',
            tip: 'Đúng! Đứng phía sau, hơi lệch sang một bên để vừa đỡ ngực vừa vỗ lưng cho em.',
          },
          {
            id: 'far',
            text: 'Đứng lùi ra xa để em tự xoay xở.',
            tip: 'Em đang không thở được – bạn cần ở sát bên để hỗ trợ ngay.',
          },
        ],
        correct: 'behind-side',
        effect: { rescuer: 'back', posture: 'upright' },
      },
      {
        kind: 'choice',
        prompt: 'Hướng dẫn em trai đứng ở tư thế nào?',
        choices: [
          {
            id: 'back',
            text: 'Ngả người ra phía sau.',
            tip: 'Ngả người ra sau có thể khiến dị vật rơi sâu hơn vào đường thở.',
          },
          {
            id: 'straight',
            text: 'Đứng thẳng người.',
            tip: 'Khi đứng thẳng, dị vật khó được đẩy ra ngoài.',
          },
          {
            id: 'forward',
            text: 'Nghiêng người về phía trước, một tay bạn đỡ ngực em.',
            tip: 'Đúng! Nghiêng người về phía trước giúp dị vật dễ bật ra ngoài theo đường miệng.',
          },
        ],
        correct: 'forward',
        effect: { posture: 'forward' },
      },
      {
        kind: 'spot',
        prompt: 'Chạm vào vị trí cần vỗ lưng.',
        figure: 'back',
        choices: [
          {
            id: 'A',
            text: 'Gáy',
            tip: 'Gáy không phải vị trí vỗ lưng – vỗ vào đây có thể gây tổn thương cổ.',
          },
          {
            id: 'B',
            text: 'Giữa hai xương bả vai',
            tip: 'Đúng! Vỗ bằng gót bàn tay vào giữa hai xương bả vai.',
          },
          {
            id: 'C',
            text: 'Thắt lưng',
            tip: 'Vùng thắt lưng ở quá thấp – lực vỗ không giúp đẩy dị vật ra.',
          },
        ],
        correct: 'B',
      },
      {
        kind: 'press',
        prompt: 'Vỗ mạnh bằng gót bàn tay, mỗi lần kiểm tra xem dị vật đã ra chưa.',
        button: 'Vỗ lưng',
        count: CYCLE,
        doneText:
          'Bạn đã vỗ lưng 5 lần bằng gót bàn tay, giữa hai xương bả vai, khi em nghiêng người về phía trước.',
      },
    ],
  },
  'abdominal-thrusts': {
    title: 'Thực hiện tối đa 5 lần ép bụng cho em trai!',
    steps: [
      {
        kind: 'choice',
        prompt: 'Bạn nên đứng ở vị trí nào?',
        choices: [
          {
            id: 'front',
            text: 'Đứng phía trước, đối diện em.',
            tip: 'Đứng phía trước thì không thể vòng tay kéo vào trong và hướng lên trên.',
          },
          {
            id: 'lie',
            text: 'Đặt em nằm ngửa xuống sàn rồi ép bụng.',
            tip: 'Em vẫn còn tỉnh – hãy ép bụng khi em đứng, bạn ở phía sau.',
          },
          {
            id: 'behind',
            text: 'Đứng hoặc quỳ phía sau em, vòng tay quanh vùng bụng trên.',
            tip: 'Đúng! Đứng (hoặc quỳ) phía sau, vòng hai tay quanh vùng bụng trên của em.',
          },
        ],
        correct: 'behind',
        effect: { rescuer: 'thrust', posture: 'upright' },
      },
      {
        kind: 'spot',
        prompt: 'Chạm vào vị trí đặt nắm tay.',
        figure: 'belly',
        choices: [
          {
            id: 'A',
            text: 'Trên ngực',
            tip: 'Đặt tay trên ngực sẽ không tạo được lực đẩy dị vật và có thể gây chấn thương.',
          },
          {
            id: 'B',
            text: 'Bụng trên – trên rốn, dưới xương sườn',
            tip: 'Đúng! Nắm tay đặt ở vùng bụng trên, phía trên rốn và dưới xương sườn.',
          },
          {
            id: 'C',
            text: 'Bụng dưới – dưới rốn',
            tip: 'Vị trí dưới rốn quá thấp – lực ép không đẩy được dị vật ra.',
          },
        ],
        correct: 'B',
      },
      {
        kind: 'press',
        prompt: 'Kéo nhanh vào trong và hướng lên trên.',
        button: 'Ép bụng',
        count: CYCLE,
        doneText:
          'Bạn đã ép bụng 5 lần: nắm tay ở giữa rốn và xương sườn, kéo nhanh vào trong và hướng lên trên.',
      },
    ],
  },
};

/** Stage once every step of the task is done. */
export function taskEndState(id: ChokeTaskId): Partial<StageState> {
  return CHOKE_TASKS[id].steps.reduce<Partial<StageState>>(
    (st, s) => (s.kind === 'choice' && s.effect ? { ...st, ...s.effect } : st),
    {},
  );
}
