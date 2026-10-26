import { AvatarArt } from '../art/AvatarArt';
import { cn } from '../lib/cn';

type AvatarProps = {
  id: string;
  size?: number;
  ring?: 'red' | 'navy' | 'yellow' | 'none';
  className?: string;
};

const RINGS = {
  red: 'ring-primary',
  navy: 'ring-navy',
  yellow: 'ring-accent',
  none: 'ring-transparent',
};

export function Avatar({ id, size = 44, ring = 'none', className }: AvatarProps) {
  return (
    <span
      className={cn('inline-block shrink-0 rounded-full ring-[3px]', RINGS[ring], className)}
      style={{ width: size, height: size }}
    >
      <AvatarArt id={id} className="h-full w-full" />
    </span>
  );
}
