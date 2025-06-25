'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';

// Fix Leaflet's missing marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
});


const socket = io('http://localhost:5000', { transports: ['websocket'] });

const LiveDeliveryMap = ({ deliveryId }: { deliveryId: string }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    socket.emit('join_delivery', deliveryId);

    socket.on('newLocation', ({ coords }) => {
      console.log("📍 Received newLocation:", coords);
      setLocation(coords);
    });

    return () => {
      socket.off('newLocation');
    };
  }, [deliveryId]);

  function ChangeMapView({ coords }: { coords: { lat: number; lng: number } }) {
    const map = useMap();
    useEffect(() => {
      map.setView([coords.lat, coords.lng], 16); // Zoom to current location
    }, [coords, map]);
    return null;
  }

  if (!location) return <p className="text-center py-5">⏳ Waiting for live location...</p>;

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={16}
      scrollWheelZoom={false}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Change map view dynamically */}
      <ChangeMapView coords={location} />

      <Marker position={[location.lat, location.lng]}>
        <Popup>🚚 Delivery Boy is here</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LiveDeliveryMap;
