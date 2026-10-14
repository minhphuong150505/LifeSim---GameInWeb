export type Topic = 'cpr' | 'choking' | 'burn' | 'bleeding' | 'seizure' | 'fainting' | 'nosebleed';

export type Scenario = {
  id: string;
  title: string;
  topic: Topic;
  location: string;
  difficulty: 1 | 2 | 3;
  /** Key of `assets.scenes` or a direct image path. */
  background: string;
  intro: string;
  clues: Clue[];
  /** Clues that must be found before moving to the decision phase. */
  requiredClueIds: string[];
  steps: Step[];
  takeaways: string[];
};

/** Hotspot rectangle in % of the background image. */
export type Clue = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  description: string;
};

export type Step = {
  id: string;
  prompt: string;
  timeLimitSec: number;
  type: 'single' | 'order' | 'rhythm';
  options?: Option[];
  orderItems?: { id: string; text: string }[];
  correctOrder?: string[];
  rhythm?: { minBpm: number; maxBpm: number; durationSec: number };
  /** Shown after order/rhythm steps (single steps use per-option feedback). */
  explanation?: string;
};

export type Option = {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
  points: number;
};
