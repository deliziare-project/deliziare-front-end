'use client'

import { useState } from 'react';
import axiosInstance from '@/api/axiosInstance';
// import ChefLocationPicker from '../LocationPicker';
import { Calendar } from '../ui/Calender';
import { TimePicker } from '../ui/TimePicker';
import dynamic from 'next/dynamic';

interface AcceptRequestModalProps {
  requestId: string;
  onClose: () => void;
  onSuccess: () => void;
}
const ChefLocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
})
export function AcceptRequestModal({ requestId, onClose, onSuccess }: AcceptRequestModalProps) {
  const [district, setDistrict] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>('12:00');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLocationChange = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleSubmit = async () => {
    if (!district || !date || !time || !location) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
     let data={
         district,
        location: {
          lat: location.lat,
          lng: location.lng
        },
        date: date.toISOString(),
        time
     }
     await axiosInstance.put(`/messages/add-address/${requestId}`,data)
 
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error accepting request:', err);
      setError('Failed to accept request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-lg p-4 w-full max-w-md shadow-xl border border-gray-200 z-50 mx-auto mt-2">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Accept Request</h2>
      
      <div className="space-y-4">
        {/* District Field */}
        <div className="space-y-1">
          <label htmlFor="district" className="block text-sm font-medium text-gray-700">
            District
          </label>
          <input
            id="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="Enter district"
            className="w-full h-8 px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Location Picker */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <ChefLocationPicker 
            onLocationChange={handleLocationChange} 
            initialLocation={location || undefined}
          />
        </div>

        {/* Date and Time Stacked */}
        <div className="space-y-3">
          {/* Date Picker */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <Calendar
              selected={date}
              onSelect={setDate}
            />
          </div>

          {/* Time Picker */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <TimePicker 
              value={time}
              onChange={setTime}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}