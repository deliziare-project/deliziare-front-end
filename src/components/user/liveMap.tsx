'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import {
  CheckCircle,
  Circle,
  Truck,
  AlertTriangle,
  MapPin,
  Loader,
} from 'lucide-react';
import { motion } from 'framer-motion';

// Fix Leaflet's missing marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const socket = io('http://localhost:5000', { transports: ['websocket'] });

interface Props {
  deliveryId: string;
  deliveryStatus: 'pending' | 'accepted' | 'picked up' | 'delivered';
}

const LiveDeliveryMap = ({ deliveryId, deliveryStatus }: Props) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    if (deliveryStatus !== 'delivered' && deliveryStatus !== 'pending') {
      socket.emit('join_delivery', deliveryId);

      socket.on('newLocation', ({ coords }) => {
        console.log('📍 Received newLocation:', coords);
        setLocation(coords);
      });

      return () => {
        socket.off('newLocation');
      };
    }
  }, [deliveryId, deliveryStatus]);

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'picked up':
        return 50;
      case 'delivered':
        return 100;
      default:
        return 10;
    }
  };

  const getStatusDot = (target: string): React.ReactElement => {
    const active =
      getStatusProgress(deliveryStatus) >= getStatusProgress(target);
    return active ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Circle className="h-4 w-4 text-gray-300" />
    );
  };

  function ChangeMapView({ coords }: { coords: { lat: number; lng: number } }) {
    const map = useMap();
    useEffect(() => {
      map.setView([coords.lat, coords.lng], 16);
    }, [coords, map]);
    return null;
  }

  return (
    <div>
      {/* Status Bar */}
      <div className="mb-6">
        <h4 className="text-center text-lg font-semibold text-gray-700 mb-2 flex items-center justify-center gap-2">
          <Truck className="w-5 h-5 text-[#B8755D]" />
          Delivery Progress
        </h4>

        <div className="relative mb-4 px-2">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#B8755D] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getStatusProgress(deliveryStatus)}%` }}
              transition={{ duration: 1.2 }}
            />
          </div>
          <motion.div
            className="absolute -top-3 transform -translate-x-1/2"
            initial={{ left: '0%' }}
            animate={{ left: `${getStatusProgress(deliveryStatus)}%` }}
            transition={{ duration: 1.2 }}
          >
            <div className="bg-white p-1 rounded-full shadow-md border-2 border-[#B8755D]">
              <Truck className="h-4 w-4 text-[#B8755D]" />
            </div>
          </motion.div>
        </div>

        <div className="flex justify-between px-2 text-sm">
          <div className="flex items-center space-x-1">
            {getStatusDot('accepted')}
            <span
              className={
                getStatusProgress(deliveryStatus) >= 10
                  ? 'text-gray-800 font-medium'
                  : 'text-gray-400'
              }
            >
              Pending
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {getStatusDot('picked up')}
            <span
              className={
                getStatusProgress(deliveryStatus) >= 50
                  ? 'text-gray-800 font-medium'
                  : 'text-gray-400'
              }
            >
              Picked Up
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {getStatusDot('delivered')}
            <span
              className={
                getStatusProgress(deliveryStatus) >= 100
                  ? 'text-gray-800 font-medium'
                  : 'text-gray-400'
              }
            >
              Delivered
            </span>
          </div>
        </div>
      </div>

      {/* Conditional Map / Message */}
      {deliveryStatus === 'pending' ? (
        <div className="text-center py-10 px-6 bg-red-50 border border-red-100 rounded-xl shadow-sm">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-medium text-base">
            No delivery partner has accepted this order yet.
          </p>
        </div>
      ) : deliveryStatus === 'delivered' ? (
        <div className="text-center py-10">
          <CheckCircle className="mx-auto h-10 w-10 text-green-500 mb-4" />
          <p className="text-lg text-gray-700 font-semibold">
            Order has been delivered
          </p>
        </div>
      ) : location ? (
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={16}
          scrollWheelZoom={false}
          style={{ height: '400px', width: '100%' }}
          className="rounded-xl shadow-md border border-gray-200"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <ChangeMapView coords={location} />
          <Marker position={[location.lat, location.lng]}>
            <Popup>
              <div className="text-sm">
                <MapPin className="inline-block w-4 h-4 text-[#B8755D] mr-1" />
                Delivery agent is here
                <br />
                Status:{' '}
                <strong className="capitalize">{deliveryStatus}</strong>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div className="text-center py-5 text-gray-500 text-sm animate-pulse flex items-center justify-center gap-2">
          <Loader className="animate-spin w-4 h-4 text-gray-400" />
          Tracking started... Waiting for live location
        </div>
      )}
    </div>
  );
};

export default LiveDeliveryMap;
