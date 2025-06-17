'use client'

import { useState, useEffect } from 'react';

export const TimePicker = ({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (time: string) => void 
}) => {
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');
  const [period, setPeriod] = useState('AM');

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':');
      const hNum = parseInt(h);
      const isPM = hNum >= 12;
      setHours((hNum % 12 || 12).toString());
      setMinutes(m.padStart(2, '0'));
      setPeriod(isPM ? 'PM' : 'AM');
    }
  }, [value]);

  const handleTimeChange = (newHours: string, newMinutes: string, newPeriod: string) => {
    const h = parseInt(newHours);
    const m = parseInt(newMinutes);
    
    if (isNaN(h) || isNaN(m) || h < 1 || h > 12 || m < 0 || m > 59) {
      return; // Invalid input
    }

    const adjustedHours = newPeriod === 'AM' 
      ? (h === 12 ? 0 : h)
      : (h === 12 ? 12 : h + 12);
    
    const newTime = `${adjustedHours}:${newMinutes.padStart(2, '0')}`;
    onChange(newTime);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Hours Input */}
      <input
        type="number"
        min="1"
        max="12"
        value={hours}
        onChange={(e) => {
          const val = e.target.value;
          setHours(val);
          handleTimeChange(val, minutes, period);
        }}
        className="w-16 h-10 px-3 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <span>:</span>
      
      {/* Minutes Input */}
      <input
        type="number"
        min="0"
        max="59"
        value={minutes}
        onChange={(e) => {
          const val = e.target.value.padStart(2, '0');
          setMinutes(val);
          handleTimeChange(hours, val, period);
        }}
        className="w-16 h-10 px-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {/* AM/PM Select */}
      <select
        value={period}
        onChange={(e) => {
          const val = e.target.value as 'AM' | 'PM';
          setPeriod(val);
          handleTimeChange(hours, minutes, val);
        }}
        className="w-16 h-10 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};