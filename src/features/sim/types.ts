import type { Topic } from '../../data/topics';
import type { ArtKey } from './optionArt';

export type CastMember = 'brother' | 'player' | 'mom' | 'dad' | 'grandma';

/** What the living-room stage shows; correct answers patch it (e.g. "now sitting leaning forward"). */
export type StageState = {
  posture: 'upright' | 'forward' | 'back';
  pinch: boolean;
  mouthOpen: boolean;
  bleeding: boolean;
  dizzy: boolean;
  icePack: boolean;
  /** Label of the timer badge next to the wall clock, e.g. "10–15 phút". */
  clock: string | null;
  /** Player is on the phone. */
  phone: boolean;
  /** Mom sits next to the brother, keeping an eye on him. */
  comfort: boolean;
  ambulance: boolean;
};

export type OptionId = 'a' | 'b' | 'c';

export type SimOption = { id: OptionId; text: string; art: ArtKey };

/** Hands-on activity that follows a question. */
export type SimTask = 'nose-tap' | 'ice-pack' | 'call-115';

export type SimQuestion = {
  id: string;
  prompt: string;
  options: SimOption[];
  correctId: OptionId;
  explanation: string;
  /** Stage change revealed once the right answer is picked. */
  effect?: Partial<StageState>;
  /** Short caption describing the new illustration. */
  caption?: string;
  task?: SimTask;
};

export type Beat =
  | { kind: 'narration'; text: string }
  | { kind: 'line'; speaker: CastMember; text: string }
  | { kind: 'mission'; text: string };

export type SimRound = {
  /** URL-safe id, e.g. `1-1`. */
  id: string;
  /** Display code, e.g. `1.1`. */
  code: string;
  title: string;
  summary: string;
  difficulty: 1 | 2 | 3;
  /** Bandages earned for clearing the round (doubled by watching an ad). */
  reward: number;
  setting: string;
  cast: CastMember[];
  stage: StageState;
  intro: Beat[];
  questions: SimQuestion[];
};

export type SimScenario = {
  id: string;
  number: number;
  title: string;
  topic: Topic;
  location: string;
  rounds: SimRound[];
};

/** Scenario announced on the map but not playable yet. */
export type UpcomingScenario = {
  id: string;
  number: number;
  title: string;
  topic: Topic;
  location: string;
};
