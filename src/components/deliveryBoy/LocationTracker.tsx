// components/LocationTracker.tsx

'use client';

import { useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '@/api/axiosInstance';

const LocationTracker = () => {
  useEffect(() => {
    let watchId: number;

    const sendLocation = async (lat: number, lng: number) => {
      try {
        await axiosInstance.post('/location/update-location', {
          lat,
          lng,
          
        });
        console.log('Location sent:', lat, lng);
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
  }, []);

  return null; // No UI, just background tracking
};

export default LocationTracker;
