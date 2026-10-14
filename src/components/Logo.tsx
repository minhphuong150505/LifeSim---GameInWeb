import { assets } from '../data/assets';

export function Logo({ height = 40 }: { height?: number }) {
  // Intrinsic size of logo.webp is 464×172.
  return (
    <img
      src={assets.proposal.logo}
      alt="LifeSim"
      height={height}
      width={Math.round((height * 464) / 172)}
      style={{ height, width: 'auto' }}
      decoding="async"
    />
  );
}
