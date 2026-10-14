import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import type { LatLng, RankedLocation } from './hubLogic';

type HubMapProps = {
  center: LatLng;
  locations: RankedLocation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

// Custom div icons: avoids Leaflet's default marker images, which break under bundlers.
function pinIcon(color: string, highlighted: boolean): L.DivIcon {
  const size = highlighted ? 44 : 36;
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 23s-8-7.2-8-13a8 8 0 0 1 16 0c0 5.800-8 13-8 13z" fill="${color}" stroke="#fff" stroke-width="1.5"/><path d="M11 6.500h2v2.500h2.500v2H13v2.500h-2V11H8.500V9H11z" fill="#fff"/></svg>`,
  });
}

const userIcon = L.divIcon({
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  html: '<span style="display:block;width:20px;height:20px;border-radius:50%;background:#1E88E5;border:3px solid #fff;box-shadow:0 0 0 4px rgba(30,136,229,.3)"></span>',
});

function Recenter({ center }: { center: LatLng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom());
  }, [map, center.lat, center.lng]);
  return null;
}

export default function HubMap({ center, locations, selectedId, onSelect }: HubMapProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={11}
      scrollWheelZoom={false}
      className="h-full w-full"
      attributionControl
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Recenter center={center} />
      <Marker
        position={[center.lat, center.lng]}
        icon={userIcon}
        alt="Vị trí của bạn"
        interactive={false}
      />
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          alt={loc.name}
          title={loc.name}
          icon={pinIcon(loc.recommended ? '#E53935' : '#1F3A5F', loc.id === selectedId)}
          eventHandlers={{ click: () => onSelect(loc.id) }}
        />
      ))}
    </MapContainer>
  );
}
