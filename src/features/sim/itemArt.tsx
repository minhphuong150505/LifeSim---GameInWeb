import {
  ClingFilmIcon,
  GogglesIcon,
  IcePackIcon,
  LifeRingIcon,
  PhoneIcon,
  TowelIcon,
  ToyFloatIcon,
} from '../../art/icons';
import type { DecoyId, ItemId } from './items';

const ICONS: Record<ItemId | DecoyId, (p: { size: number }) => React.ReactNode> = {
  'ice-pack': IcePackIcon,
  phone: PhoneIcon,
  'life-ring': LifeRingIcon,
  'toy-float': ToyFloatIcon,
  towel: TowelIcon,
  goggles: GogglesIcon,
  'cling-film': ClingFilmIcon,
};

export function ItemIcon({ id, size = 48 }: { id: ItemId | DecoyId; size?: number }) {
  const Icon = ICONS[id];
  return <Icon size={size} />;
}
