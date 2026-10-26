import * as Icons from '../art/icons';
import { LivingRoom } from '../art/LivingRoom';
import { Person, type PersonKind } from '../art/Person';
import { ProfileArt } from '../art/Profile';
import { ART_KEYS, OptionArt } from '../features/sim/optionArt';

const KINDS: PersonKind[] = ['brother', 'player', 'mom', 'dad', 'grandma', 'mascot'];

/** Dev-only sheet of every illustration, for checking the art at a glance (/dev/art). */
export function ArtGallery() {
  return (
    <div className="space-y-4 bg-white p-3">
      <svg viewBox="0 0 400 300" className="w-full border">
        <LivingRoom clockHighlight ambulance />
        <Person kind="grandma" pose="sit" x={150} y={170} />
        <Person
          kind="brother"
          pose="sit"
          x={205}
          y={170}
          armR="nose"
          tilt="down"
          blood
          mouth="open"
        />
        <Person kind="player" x={70} y={288} armR="phone" eyes="worried" mouth="o" />
        <Person kind="mom" x={312} y={290} armL="hip" eyes="worried" mouth="open" />
        <Person kind="dad" x={366} y={286} armR="point" />
      </svg>
      <svg viewBox="0 0 600 130" className="w-full border">
        {KINDS.map((k, i) => (
          <Person
            key={k}
            kind={k}
            x={50 + i * 100}
            y={122}
            armR={i % 2 ? 'wave' : 'down'}
            dizzy={k === 'brother'}
          />
        ))}
      </svg>
      <div className="grid grid-cols-4 gap-2">
        {(
          [
            { lean: 18, tilt: 6, blood: 'drip', furniture: 'sofa' },
            { lean: -14, tilt: -28, blood: 'throat', furniture: 'sofa', eyes: 'up' },
            { pose: 'lie', furniture: 'bed', blood: 'throat' },
            { pose: 'stand', eyes: 'dizzy' },
            { pose: 'walk', eyes: 'dizzy', mouth: 'frown' },
            { lean: 15, tilt: 6, hand: 'pinch-soft', mouth: 'open', crop: 'head' },
            { lean: 15, tilt: 6, hand: 'pinch-bridge', crop: 'head' },
            { lean: 15, tilt: 6, hand: 'pinch-one', blood: 'drip', crop: 'head' },
            { lean: 10, hand: 'ice', crop: 'head' },
            { lean: 10, hand: 'blow', crop: 'head', eyes: 'closed' },
            { lean: 10, hand: 'phone', crop: 'head' },
            { lean: 10, plug: 'cotton', crop: 'head', mouth: 'puffed', blood: 'drip' },
          ] as const
        ).map((p, i) => (
          <ProfileArt key={i} {...p} className="aspect-[4/3] w-full border bg-[#fbf6e6]" />
        ))}
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {ART_KEYS.map((k) => (
          <div key={k} className="text-center text-[9px]">
            <OptionArt
              art={k}
              className="aspect-square w-full rounded-lg border-2 border-navy bg-[#fbf6e6]"
            />
            {k}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(Icons).map(([name, Icon]) => (
          <div key={name} className="flex flex-col items-center text-[10px]">
            <Icon size={48} />
            {name.replace('Icon', '')}
          </div>
        ))}
      </div>
    </div>
  );
}
