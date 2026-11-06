import { useEffect } from 'react';
import { useSettingsStore } from '../store/settings';

/**
 * Background sound beds generated with the Web Audio API (no audio files to license):
 * `pool` = water lapping + a distant crowd murmur + splashes, `nature` = running water +
 * bird chirps. Quiet on purpose so UI sounds stay on top; follows the mute setting.
 */
export type AmbienceKind = 'pool' | 'nature';

type Running = { ctx: AudioContext; master: GainNode; timers: number[] };

function noiseBuffer(ctx: AudioContext, brown: boolean): AudioBuffer {
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i += 1) {
    const white = Math.random() * 2 - 1;
    if (brown) {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    } else {
      data[i] = white;
    }
  }
  return buf;
}

function loopNoise(
  r: Running,
  {
    brown,
    type,
    freq,
    q,
    gain,
  }: { brown: boolean; type: BiquadFilterType; freq: number; q: number; gain: number },
) {
  const { ctx } = r;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, brown);
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;
  const g = ctx.createGain();
  g.gain.value = gain;
  // Slow swell, like small waves.
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.18 + Math.random() * 0.1;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = gain * 0.45;
  lfo.connect(lfoGain).connect(g.gain);
  src.connect(filter).connect(g).connect(r.master);
  src.start();
  lfo.start();
}

function splash(r: Running) {
  const { ctx } = r;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, false);
  const f = ctx.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = 900 + Math.random() * 900;
  f.Q.value = 0.8;
  const g = ctx.createGain();
  const t = ctx.currentTime;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.16, t + 0.04);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  src.connect(f).connect(g).connect(r.master);
  src.start(t);
  src.stop(t + 0.7);
}

function chirp(r: Running) {
  const { ctx } = r;
  const t0 = ctx.currentTime;
  const notes = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < notes; i += 1) {
    const t = t0 + i * 0.13;
    const o = ctx.createOscillator();
    o.type = 'sine';
    const base = 2600 + Math.random() * 1400;
    o.frequency.setValueAtTime(base, t);
    o.frequency.exponentialRampToValueAtTime(base * 1.5, t + 0.08);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.connect(g).connect(r.master);
    o.start(t);
    o.stop(t + 0.12);
  }
}

function schedule(r: Running, fn: () => void, min: number, max: number) {
  const tick = () => {
    fn();
    r.timers.push(window.setTimeout(tick, min + Math.random() * (max - min)));
  };
  r.timers.push(window.setTimeout(tick, min + Math.random() * (max - min)));
}

function start(kind: AmbienceKind): Running | null {
  const Ctx =
    typeof window !== 'undefined'
      ? (window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
      : undefined;
  if (!Ctx) return null;
  try {
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.5);
    const r: Running = { ctx, master, timers: [] };
    if (kind === 'pool') {
      loopNoise(r, { brown: true, type: 'lowpass', freq: 520, q: 0.6, gain: 0.22 });
      loopNoise(r, { brown: false, type: 'bandpass', freq: 700, q: 0.9, gain: 0.025 });
      schedule(r, () => splash(r), 2500, 6000);
    } else {
      loopNoise(r, { brown: false, type: 'bandpass', freq: 1500, q: 0.5, gain: 0.05 });
      loopNoise(r, { brown: true, type: 'lowpass', freq: 400, q: 0.7, gain: 0.14 });
      schedule(r, () => chirp(r), 1800, 5200);
    }
    // Browsers start audio suspended until the page has been touched.
    const resume = () => void ctx.resume().catch(() => undefined);
    resume();
    window.addEventListener('pointerdown', resume, { once: true });
    return r;
  } catch {
    return null;
  }
}

function stop(r: Running) {
  r.timers.forEach((t) => window.clearTimeout(t));
  try {
    r.master.gain.linearRampToValueAtTime(0, r.ctx.currentTime + 0.3);
    window.setTimeout(() => void r.ctx.close().catch(() => undefined), 400);
  } catch {
    // ignore
  }
}

/** Plays the round's sound bed while mounted (and not muted). */
export function useAmbience(kind: AmbienceKind | undefined) {
  const muted = useSettingsStore((s) => s.muted);
  useEffect(() => {
    if (!kind || muted || import.meta.env.MODE === 'test') return;
    const r = start(kind);
    return () => {
      if (r) stop(r);
    };
  }, [kind, muted]);
}
