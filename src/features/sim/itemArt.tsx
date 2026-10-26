import { IcePackIcon, PhoneIcon } from '../../art/icons';
import type { ItemId } from './items';

export function ItemIcon({ id, size = 48 }: { id: ItemId; size?: number }) {
  return id === 'phone' ? <PhoneIcon size={size} /> : <IcePackIcon size={size} />;
}
