import { rotate, type Pt } from './ink';
import type { Look } from './looks';

export type ProfilePose = 'sit' | 'stand' | 'walk' | 'lie';
export type ProfileHand =
  'lap' | 'down' | 'pinch-soft' | 'pinch-bridge' | 'pinch-one' | 'phone' | 'ice' | 'blow' | 'chest';
export type ProfileMouth = 'closed' | 'open' | 'puffed' | 'smile' | 'frown' | 'wide';
export type ProfileEyes = 'open' | 'closed' | 'dizzy' | 'up' | 'down' | 'worried';
export type Blood = 'none' | 'drip' | 'throat' | 'stopped';

export type ProfileProps = {
  pose?: ProfilePose;
  /** Torso lean in degrees: + forward, − backward. */
  lean?: number;
  /** Extra head tilt on top of the lean: + chin down, − chin up. */
  tilt?: number;
  hand?: ProfileHand;
  mouth?: ProfileMouth;
  eyes?: ProfileEyes;
  blood?: Blood;
  /** Something stuffed in the nostril. */
  plug?: 'cotton' | 'tissue' | 'ice' | null;
  furniture?: 'sofa' | 'bed' | 'couch' | 'none';
  look?: Look;
};

export type ProfileGeometry = {
  hip: Pt;
  head: Pt;
  /** Head rotation in degrees (0 = upright, facing right). */
  angle: number;
  nose: Pt;
  nostril: Pt;
  mouth: Pt;
  eye: Pt;
  /** World point of a head-local coordinate (x forward, y down). */
  at: (x: number, y: number) => Pt;
};

export function profileGeometry({
  pose = 'sit',
  lean = 0,
  tilt = 0,
}: ProfileProps): ProfileGeometry {
  const hip = { x: 0, y: 0 };
  const bodyAngle = pose === 'lie' ? -90 : lean;
  const angle = bodyAngle + tilt;
  const r = (bodyAngle * Math.PI) / 180;
  const neck = { x: 37 * Math.sin(r), y: -37 * Math.cos(r) };
  const ra = (angle * Math.PI) / 180;
  const head = { x: neck.x + 20 * Math.sin(ra), y: neck.y - 20 * Math.cos(ra) };
  const at = (x: number, y: number) => rotate({ x: head.x + x, y: head.y + y }, head, angle);
  return {
    hip,
    head,
    angle,
    nose: at(25, -1),
    nostril: at(22, 4),
    mouth: at(15, 11),
    eye: at(10, -4),
    at,
  };
}
