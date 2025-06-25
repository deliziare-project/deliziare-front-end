'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchAllPayments } from '@/features/paymentSlice';
import SearchBar from '@/components/shared/SearchBar';
import Pagination from '../userManagement/Pagination';
import Loader from '@/components/shared/Loader';

const AdminPaymentList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { payments, loading, error } = useSelector((state: RootState) => state.payment);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const postsPerPage = 10;

  useEffect(() => {
    dispatch(fetchAllPayments());
  }, [dispatch]);

  const filteredPayments = payments.filter((payment) =>
    payment.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPayments.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = [...filteredPayments].reverse().slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  {/* Left Section: Heading and Subtext */}
  <div>
    <h2 className="text-2xl font-semibold text-red-800">Payment Transactions</h2>
    <p className="text-gray-600 text-sm">View the payment history of users</p>
  </div>

  {/* Right Section: Search Bar */}
  <div className="w-full md:w-64">
    <SearchBar
      value={searchTerm}
      onChange={setSearchTerm}
      placeholder="Search by user..."
    />
  </div>
</div>

           
          </div>

          {/* Content Section */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader message="Loading payment history..." />
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border-l-4 border-red-500">
              <p className="text-red-700 font-medium">Error: {error}</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[#de6d37] text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Chef Amt</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">GST</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Delivery</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Chef</th>
                      <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Delivery Boy</th>
                      <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Delivery Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentPosts.map((payment) => (
                      <tr key={payment._id} className="hover:bg-[#fdf4f0] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.user?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {payment.paymentMethod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{payment.bid?.amount || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{payment.gst || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{payment.deliveryCharge || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ₹{payment.total || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            payment.razorpayPaymentStatus === 'captured'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.razorpayPaymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.bid?.bidId?.chefId?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.bid?.bidId?.deliveryBoyId?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {payment.bid?.bidId?.postId?.deliveryStatus || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredPayments.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No payment records found
                </div>
              )}

              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentList;