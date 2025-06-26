'use client';

import { getDeliveryBoy } from '@/features/deliverySlice';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CameraIcon, Pencil } from 'lucide-react';
import DeliveryBoyEditProfile from './DeliveryBoyProfileEdit';
import Image from 'next/image';
import { uploadProfileImage } from '@/features/profileImageSlice';

function Profileview() {
  const dispatch = useDispatch<AppDispatch>();
  const { deliveryBoy, loading } = useSelector((state: RootState) => state.delivery);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const { uploading, imageUrl, error } = useSelector((state: RootState) => state.profileImage);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(uploadProfileImage(file));
    }
  };

  const profileImageSrc = imageUrl || deliveryBoy?.userId?.profileImage || '';

  useEffect(() => {
    dispatch(getDeliveryBoy());
  }, [dispatch]);

  const isPDF = (url: string) => url?.toLowerCase().endsWith('.pdf');

  const openDocumentModal = (url: string, title: string) => {
    setModalImage(url);
    setModalTitle(title);
  };

  const closeModal = () => {
    setModalImage(null);
    setModalTitle('');
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (!deliveryBoy) return <p className="text-center mt-10 text-gray-600">No profile data found.</p>;

  const user = deliveryBoy.userId;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10 space-y-6 border-t-4 border-red-600 relative mb-32">
      <button
        className="absolute top-4 right-4 text-red-600 hover:text-red-800"
        onClick={() => setShowEditModal(true)}
      >
        <Pencil className="w-5 h-5" />
      </button>

      <h2 className="text-2xl font-semibold text-red-700 border-b pb-2">Delivery Partner Profile</h2>

      <div className="flex items-center gap-6">
        <div className="mb-6 flex flex-col items-center">
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {profileImageSrc ? (
              <Image
                width={100}
                height={100}
                src={profileImageSrc}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-300 shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center rounded-full bg-[#F9EBE5] text-[#B8755D] text-4xl font-bold border border-[#F9EBE5] shadow-md">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0">
              <p className="text-white text-sm">
                <CameraIcon />
              </p>
            </div>
          </div>
          {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-gray-600">{user?.phone}</p>
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <h4 className="text-lg font-semibold text-red-700">Personal Info</h4>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p>
            <span className="font-medium">Vehicle Type:</span> {deliveryBoy.vehicleType}
          </p>
        </div>
      </div>

      <div className="pt-4">
        <h4 className="text-lg font-semibold text-red-700 mb-2">Documents</h4>
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-gray-700 font-medium">ID Proof:</p>
            {isPDF(deliveryBoy.IDProof) ? (
              <a
                href={deliveryBoy.IDProof}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                View ID Proof (PDF)
              </a>
            ) : (
              <button
                onClick={() => openDocumentModal(deliveryBoy.IDProof, 'ID Proof')}
                className="mt-1 inline-block px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                View ID Proof
              </button>
            )}
          </div>
          <div>
            <p className="text-gray-700 font-medium">License:</p>
            {isPDF(deliveryBoy.license) ? (
              <a
                href={deliveryBoy.license}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                View License (PDF)
              </a>
            ) : (
              <button
                onClick={() => openDocumentModal(deliveryBoy.license, 'License')}
                className="mt-1 inline-block px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                View License
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {modalImage && !isPDF(modalImage) && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50"
        >
          <div
            className="bg-white p-4 rounded relative w-full max-w-md max-h-[70vh] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-red-600 text-2xl font-bold hover:text-red-800 z-10"
              onClick={closeModal}
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4 text-center">{modalTitle}</h3>
            <div className="w-full overflow-auto flex justify-center">
              <img
                src={modalImage}
                alt={modalTitle}
                className="max-w-full max-h-[60vh] object-contain rounded shadow"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center">
          <div className="bg-white rounded-lg p-6 mt-10 mb-32 max-w-2xl w-full relative shadow-lg max-h-[90vh] pb-32">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl"
              onClick={() => setShowEditModal(false)}
            >
              ×
            </button>
            <DeliveryBoyEditProfile onClose={() => setShowEditModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Profileview;
