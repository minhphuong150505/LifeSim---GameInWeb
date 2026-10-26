import { LOOKS, type PersonKind } from './looks';
import { Head } from './Person';

/** Head-only portrait of a story character. */
export function CastFace({
  kind,
  size = 36,
  className,
}: {
  kind: PersonKind;
  size?: number;
  className?: string;
}) {
  return (
    <svg viewBox="-34 -40 68 68" width={size} height={size} className={className} aria-hidden>
      <Head look={LOOKS[kind]} face={{ mouth: 'smile' }} />
    </svg>
  );
}
