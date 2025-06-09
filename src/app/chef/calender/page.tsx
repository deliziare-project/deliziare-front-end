'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getChefBids } from '@/features/bidSlice';
import { getAllPay } from '@/features/paymentSlice';

import { format } from 'date-fns';
import ChefCalendar from '@/components/chef/calender/ChefCalender';

const MyWorkCalendarPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bids } = useSelector((state: RootState) => state.chefBids);
  const { pay } = useSelector((state: RootState) => state.payment);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getChefBids());
    dispatch(getAllPay());
  }, [dispatch]);

  const paymentMap = new Map(
    (pay || []).map((payment) => [payment.bid?.bidId?._id, payment])
  );

  const pendingBids = bids.filter(
    (bid) =>
      bid.status === 'accepted' &&
      paymentMap.has(bid._id)
  );

  const calendarEventDates = pendingBids.map((bid) =>
    format(new Date(bid.postId.date), 'yyyy-MM-dd')
  );

  const ordersForSelectedDate = selectedDate
    ? pendingBids.filter(
        (bid) => format(new Date(bid.postId.date), 'yyyy-MM-dd') === selectedDate
      )
    : [];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-[#B8755D] mb-6">
        My Work Calendar
      </h1>

      <ChefCalendar
        eventDates={calendarEventDates}
        onDateSelect={(date) => setSelectedDate(date)}
      />

      {selectedDate && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-[#B8755D] mb-4">
            Orders on {selectedDate}
          </h2>

          {ordersForSelectedDate.length === 0 ? (
            <p className="text-gray-500">No orders on this date.</p>
          ) : (
            <ul className="space-y-4">
              {ordersForSelectedDate.map((bid) => (
                <li
                  key={bid._id}
                  className="bg-white border border-[#e2d4cf] rounded-xl shadow p-4"
                >
                  <h3 className="text-lg font-semibold text-[#B8755D]">{bid.postId.eventName}</h3>
                  <p className="text-sm text-gray-600">{bid.postId.time} @ {bid.postId.district}</p>
                  <p className="text-sm text-gray-700 mt-2">
                    Menu: {bid.postId.menu.join(', ')} | Quantity: {bid.postId.quantity}
                  </p>
                  <p className="text-sm text-gray-500">Description: {bid.postId.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default MyWorkCalendarPage