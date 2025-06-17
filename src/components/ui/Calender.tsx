'use client'

import { useState } from 'react';

export const Calendar = ({ 
  selected, 
  onSelect 
}: { 
  selected: Date | undefined; 
  onSelect: (date: Date | undefined) => void 
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day && 
      selected.getMonth() === currentMonth && 
      selected.getFullYear() === currentYear
    );
  };

  const isToday = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-72">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <button 
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="font-semibold text-lg">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button 
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 p-2 text-center text-gray-500 text-sm font-medium">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 p-2">
        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-8"></div>
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const date = new Date(currentYear, currentMonth, day);
          return (
            <button
              key={day}
              onClick={() => onSelect(date)}
              className={`
                h-8 rounded-full flex items-center justify-center
                ${isSelected(day) ? 'bg-blue-500 text-white' : ''}
                ${isToday(day) && !isSelected(day) ? 'border border-blue-500' : ''}
                ${date < today ? 'text-gray-400' : 'hover:bg-gray-100'}
              `}
              disabled={date < today}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};