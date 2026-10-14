import { Howl } from 'howler';
import { assets } from '../data/assets';
import { useSettingsStore } from '../store/settings';

export type SoundName = keyof typeof assets.audio;

const cache = new Map<SoundName, Howl>();

function getHowl(name: SoundName): Howl {
  let howl = cache.get(name);
  if (!howl) {
    howl = new Howl({ src: [assets.audio[name]], volume: name === 'tick' ? 0.9 : 0.6 });
    cache.set(name, howl);
  }
  return howl;
}

/** Plays a short UI sound unless the player muted audio. Never throws. */
export function playSound(name: SoundName): void {
  if (useSettingsStore.getState().muted) return;
  try {
    getHowl(name).play();
  } catch {
    // Audio is a nice-to-have; ignore playback failures (e.g. autoplay policy).
  }
}

/** Light haptic feedback on wrong answers, when the device supports it. */
export function vibrate(pattern: number | number[] = 80): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // ignore
    }
  }
}
