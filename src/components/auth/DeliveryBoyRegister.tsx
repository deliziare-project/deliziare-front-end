'use client';

import React, { useState,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { deliveryBoySchema } from '@/validation/DeliveryBoyValidation';
import { Upload } from 'lucide-react';

import { registerDeliveryBoy, sendOtpForDeliveryBoy,resetRegisterState,setRegistrationData } from '@/features/authSlice';
import { useDispatch,useSelector } from 'react-redux';
import { AppDispatch,RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';



type DeliveryBoyFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  vehicleType: 'two' | 'three' | 'four' | '';
  IDProof: FileList;
  license: FileList;
};

const DeliveryBoyRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<DeliveryBoyFormData>({
    resolver: yupResolver(deliveryBoySchema),
  });
  
  const [uploadedFiles, setUploadedFiles] = useState({
    IDProof: '',
    license: '',
  });
  
  const router = useRouter();
  const [formPreview, setFormPreview] = useState<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector((state: RootState) => state.auth);


  const onSubmit = async (data: DeliveryBoyFormData) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('password', data.password);
      formData.append('vehicleType', data.vehicleType);
      formData.append('role', 'deliveryBoy');
  
      if (data.IDProof?.length) {
        formData.append('IDProof', data.IDProof[0]);
      }
      if (data.license?.length) {
        formData.append('license', data.license[0]);
      }
  
      
      const registrationData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        vehicleType: data.vehicleType,
        role: 'deliveryBoy',
        IDProof: data.IDProof[0],     
        license: data.license[0],     
      };
      dispatch(setRegistrationData(registrationData)); 
  
      const result = await dispatch(sendOtpForDeliveryBoy(formData));
  
      if (sendOtpForDeliveryBoy.fulfilled.match(result)) {
        router.push(`/verifyotp?email=${encodeURIComponent(data.email)}&role=deliveryBoy`);
      } else {
        console.error('Failed to send OTP:', result.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };
  


  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white shadow-md rounded-xl border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Delivery Boy Registration
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-gray-700">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            {...register('name')}
            className="w-full border border-gray-300 text-gray-800 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full border border-gray-300 text-gray-800 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            {...register('phone')}
            className="w-full border border-gray-300 text-gray-800 p-2 rounded"
            placeholder="Enter your phone number"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full border border-gray-300 text-gray-800 p-2 rounded"
            placeholder="Create a password"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>


        <div>
          <label className="block font-medium mb-1">Vehicle Type</label>
          <select
            {...register('vehicleType')}
            className="w-full border border-gray-300 text-gray-800 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Select Vehicle Type</option>
            <option value="two">Two-wheeler</option>
            <option value="three">Three-wheeler</option>
            <option value="four">Four-wheeler</option>
          </select>
          {errors.vehicleType && (
            <p className="text-red-500 text-sm mt-1">{errors.vehicleType.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">ID Proof</label>
          <div className="w-full relative border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer hover:bg-gray-50">
            <Upload className="mx-auto mb-2 text-blue-600" size={32} />
            <span className="text-sm text-gray-600">Upload ID Proof</span>
            <input
                  type="file"
                  {...register('IDProof')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      setUploadedFiles((prev) => ({
                        ...prev,
                        IDProof: e.target.files![0].name,
                      }));
                    }
                  }}
                />
                {uploadedFiles.IDProof && (
                  <p className="text-green-600 text-sm mt-2">Uploaded: {uploadedFiles.IDProof}</p>
                )}

          </div>
          {errors.IDProof && <p className="text-red-500 text-sm mt-1">{errors.IDProof.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Driving License</label>
          <div className="w-full relative border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer hover:bg-gray-50">
            <Upload className="mx-auto mb-2 text-blue-600" size={32} />
            <span className="text-sm text-gray-600">Upload License</span>
            <input
              type="file"
              {...register('license')}
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                if (e.target.files?.length) {
                  setUploadedFiles((prev) => ({
                    ...prev,
                    license: e.target.files![0].name,
                  }));
                }
              }}
            />
            {uploadedFiles.license && (
              <p className="text-green-600 text-sm mt-2">Uploaded: {uploadedFiles.license}</p>
            )}

          </div>
          {errors.license && <p className="text-red-500 text-sm mt-1">{errors.license.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          Register
        </button>
      </form>

      <div className="mt-6 text-center">
      <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[#213D72] font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>

      {formPreview && (
        <div className="mt-6 bg-gray-50 p-4 rounded border border-gray-200 text-sm text-gray-700">
          <h4 className="font-semibold mb-2">Form Preview</h4>
          <pre>{JSON.stringify(formPreview, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DeliveryBoyRegister;