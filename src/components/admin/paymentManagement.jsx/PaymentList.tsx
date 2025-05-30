'use client';
import { fetchAllPayments } from '@/features/paymentSlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const AdminPaymentList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { payments, loading, error } = useSelector((state: RootState) => state.payment);

  useEffect(() => {
    dispatch(fetchAllPayments());
  }, [dispatch]);

  return (
    <div className="p-6 bg-white h-screen dark:bg-gray-900 rounded-2xl shadow-lg overflow-x-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">All Payments</h2>

      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading payments...</p>
      ) : error ? (
        <p className="text-red-600 font-medium">Error: {error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 shadow-md dark:divide-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Paid User</th>
                <th className="px-6 py-3 text-left">Payment Method</th>
                <th className="px-6 py-3 text-left">Chef Amount</th>
                <th className="px-6 py-3 text-left">GST</th>
                <th className="px-6 py-3 text-left">Delivery</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
              {payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">{payment.user?.name}</td>
                  <td className="px-6 py-4 capitalize">{payment.paymentMethod}</td>
                  <td className="px-6 py-4">₹{payment.bid?.amount}</td>
                  <td className="px-6 py-4">₹{payment.gst}</td>
                  <td className="px-6 py-4">₹{payment.deliveryCharge}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">₹{payment.total}</td>
                  <td className={`px-6 py-4 font-medium ${payment.razorpayPaymentStatus === 'captured' ? 'text-green-600' : 'text-yellow-500'}`}>
                    {payment.razorpayPaymentStatus}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(payment.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentList;
