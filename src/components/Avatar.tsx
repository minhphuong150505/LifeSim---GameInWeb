import { avatarSrc } from '../data/assets';
import { cn } from '../lib/cn';

type AvatarProps = {
  id: string;
  size?: number;
  ring?: 'red' | 'navy' | 'yellow' | 'none';
  className?: string;
};

const RINGS = { red: 'ring-primary', navy: 'ring-navy', yellow: 'ring-accent', none: 'ring-white' };

export function Avatar({ id, size = 44, ring = 'none', className }: AvatarProps) {
  return (
    <img
      src={avatarSrc(id)}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={cn('shrink-0 rounded-full object-cover ring-2', RINGS[ring], className)}
      style={{ width: size, height: size }}
    />
  );
}
