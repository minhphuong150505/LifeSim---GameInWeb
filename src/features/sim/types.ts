import type { ItemId } from './items';
import type { Topic } from '../../data/topics';
import type { ArtKey } from './optionArt';

export type CastMember =
  | 'brother'
  | 'player'
  | 'mom'
  | 'dad'
  | 'grandma'
  | 'friend'
  | 'lifeguard'
  | 'victim'
  | 'friendA'
  | 'friendB'
  | 'sister';

/**
 * Backdrop of a round: the living room (scenario 1), one of the water scenes (scenario 2),
 * the dining room (scenario 4) or the kitchen (scenario 5).
 */
export type SceneKind = 'living-room' | 'pool' | 'lake' | 'shore' | 'kitchen' | 'dining-room';

/**
 * How the choking brother is doing (scenario 4): eating, coughing hard, coughing weakly,
 * unable to cough or speak (hands at the throat), collapsed on the floor, breathing again.
 */
export type ChokeLevel = 'none' | 'cough' | 'weak' | 'severe' | 'down' | 'breathing';

/**
 * Where the player is (scenario 4): across the table, bending next to the brother, behind
 * him slightly to one side (back blows), right behind him with the arms round his belly
 * (abdominal thrusts), kneeling next to him on the floor.
 */
export type Rescuer = 'none' | 'beside' | 'back' | 'thrust' | 'kneel';

/** How the burn on the sister's arm looks (scenario 5). */
export type BurnLevel = 'none' | 'red' | 'blister' | 'severe';

/** Camera shot of the water scenes (story beats can move it, tasks can request one). */
export type CameraShot = 'wide' | 'focus' | 'bank' | 'face' | 'chest';

/**
 * What the stage shows; correct answers patch it (e.g. "now sitting leaning forward").
 * The first block is the living room (scenario 1), the second the water scenes (scenario 2).
 */
export type StageState = {
  scene: SceneKind;
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

  /** Person in danger: playing near the bank, struggling, holding a float, brought ashore. */
  victim: 'swim' | 'struggle' | 'float' | 'ashore';
  /** Lifeguard: on the high chair, alerted, standing next to the player, rescuing. */
  lifeguard: 'seat' | 'alert' | 'near' | 'rescue';
  /** Camera held by the story / a question (`focus` = the default zoom on the action). */
  shot: CameraShot;
  /** 115 has been called (player holds the phone). */
  called: boolean;
  /** Player's hands are on the centre of the chest (CPR). */
  hands: boolean;
  /** Airway opened: head tilted back, chin lifted. */
  airway: boolean;
  /** Mouth checked and cleared. */
  mouthClear: boolean;

  /* Kitchen (scenario 5 – burns) */
  burn: BurnLevel;
  /** The burned hand is under the running cold tap. */
  atSink: boolean;
  /** Ring still on the burned hand. */
  ring: boolean;
  /** Long sleeve over the burn; `cut` = cut away, the stuck piece left on the skin. */
  sleeve: 'long' | 'cut' | 'short';
  /** Burn loosely covered with cling film. */
  wrap: boolean;
  /** Unburned parts kept warm with a blanket (large burn). */
  blanket: boolean;
  /** The sister sits down to rest. */
  rest: boolean;

  /* Dining room (scenario 4 – choking) */
  choke: ChokeLevel;
  rescuer: Rescuer;
};

export type OptionId = 'a' | 'b' | 'c';

export type SimOption = { id: OptionId; text: string; art: ArtKey };

/** Hands-on activity that follows a question. */
export type SimTask =
  | 'nose-tap'
  | 'ice-pack'
  | 'call-115'
  /** Pick the right float in the shop and throw it to the person in the water. */
  | 'rescue-ring'
  /** No rescue gear around: find the 2 objects on the bank that can help. */
  | 'find-floats'
  /** Tap 30 chest compressions at 100–120 per minute. */
  | 'cpr-30'
  /** Put the rescue-breath steps in the right order. */
  | 'breath-order'
  /** Optional: buy cling film and lay it over the burn. */
  | 'cling-wrap'
  /** Stand behind, lean the child forward, find the spot between the shoulder blades, 5 blows. */
  | 'back-blows'
  /** Stand behind, place the fist above the navel and below the ribs, 5 thrusts. */
  | 'abdominal-thrusts'
  /** Call 115 and put the phone on speaker (CPR guided by the dispatcher). */
  | 'call-115-speaker';

/** Real photo shown with an explanation, with an optional marker drawn on top. */
export type ExplainImage = {
  src: string;
  alt: string;
  credit: string;
  /** Marker position in % of the image, and its label. */
  marker?: { x: number; y: number; label: string };
};

export type SimQuestion = {
  id: string;
  prompt: string;
  options: SimOption[];
  correctId: OptionId;
  explanation: string;
  /** What the guide character says after a wrong pick (nudges without giving the answer away). */
  hint?: string;
  /** Stage change revealed once the right answer is picked. */
  effect?: Partial<StageState>;
  /** Short caption describing the new illustration. */
  caption?: string;
  task?: SimTask;
  /** Replaces the default title of the item task (e.g. "Hãy nhờ người thân gọi cấp cứu 115!"). */
  taskTitle?: string;
  /** Picture shown above the options; the player can also tap its A/B/C spots. */
  figure?: 'chest-spots';
  /** Photo illustrating the explanation. */
  explainImage?: ExplainImage;
};

/** Scene change played when a story beat appears (someone swims out, the camera zooms…). */
type BeatEffect = { effect?: Partial<StageState> };

export type Beat =
  | ({ kind: 'narration'; text: string } & BeatEffect)
  | ({ kind: 'line'; speaker: CastMember; text: string } & BeatEffect)
  | ({ kind: 'mission'; text: string } & BeatEffect);

/** Background sound loop of a round. */
export type Ambience = 'pool' | 'nature';

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
  ambience?: Ambience;
};

export type SimScenario = {
  id: string;
  number: number;
  title: string;
  topic: Topic;
  location: string;
  /** Items sold in the in-game shop during this scenario. */
  shopItems: ItemId[];
  /** Who is being helped, used in task titles (defaults to "em trai"). */
  patient?: string;
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
