'use client';

import { useEffect } from 'react';
import io from 'socket.io-client';
import axiosInstance from '@/api/axiosInstance';

const socket = io('http://localhost:5000', { transports: ['websocket'] }); // Replace with your server URL

const LocationTracker = ({ deliveryId }: { deliveryId: string }) => {
  useEffect(() => {
    let watchId: number;

    const sendLocation = async (lat: number, lng: number) => {
      try {
        // Send to backend for persistence
        await axiosInstance.post('/location/update-location', {
          lat,
          lng,
          deliveryId,
        });

        // Emit via socket for live update
        socket.emit('locationUpdate', {
          deliveryId,
          coords: { lat, lng },
        });

        console.log('📡 Location sent:', lat, lng);
      } catch (err) {
        console.error('Error sending location:', err);
      }
    };

    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      sendLocation(latitude, longitude);
    };

    const errorCallback = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error.message);
    };

    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20000,
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [deliveryId]);

  return null; // background only
};

export default LocationTracker;
