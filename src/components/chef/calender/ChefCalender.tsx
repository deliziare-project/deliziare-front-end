'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import './chef-calendar.css'; 

type ChefCalendarProps = {
  eventDates: string[];
  onDateSelect?: (date: string) => void;
};

const ChefCalendar = ({ eventDates, onDateSelect }: ChefCalendarProps) => {
  const markedDates = new Set(eventDates);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = format(date, 'yyyy-MM-dd');
      if (markedDates.has(dateStr)) {
        return 'react-calendar__tile--marked';
      }
    }
    return null;
  };

  const handleDateClick = (date: Date) => {
    const selected = format(date, 'yyyy-MM-dd');
    if (onDateSelect) onDateSelect(selected);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto border border-[#ecdcd7]">
      
      <Calendar
        tileClassName={tileClassName}
        onClickDay={handleDateClick}
        className="w-full border-none"
      />
    </div>
  );
};

export default ChefCalendar;
