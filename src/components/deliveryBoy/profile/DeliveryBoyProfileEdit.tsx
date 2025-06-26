'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { showError, showSuccess } from '@/components/shared/ToastUtilis';
import { getDeliveryBoy, updateDeliveryBoy } from '@/features/deliverySlice';
import { uploadDeliveryCertificate } from '@/features/fileUploadSlice';

const profileSchema = yup.object({
  name: yup.string().required('Name is required'),
  vehicleType: yup.string().required('Vehicle type is required'),
}).required();

type FormDataType = yup.InferType<typeof profileSchema>;

const isPDF = (fileOrUrl: File | string) => {
  const name = typeof fileOrUrl === 'string' ? fileOrUrl : fileOrUrl.name;
  return name?.toLowerCase().endsWith('.pdf');
};

const DeliveryBoyEditProfile = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { deliveryBoy } = useSelector((state: RootState) => state.delivery);

  const [IDProofUrl, setIDProofUrl] = useState('');
  const [licenseUrl, setLicenseUrl] = useState('');
  const [IDProofFile, setIDProofFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState({ IDProof: false, license: false });
  const [uploadError, setUploadError] = useState({ IDProof: '', license: '' });

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm<FormDataType>({
    resolver: yupResolver(profileSchema),
    defaultValues: { name: '', vehicleType: '' },
  });

  useEffect(() => {
    if (deliveryBoy) {
      setValue('name', deliveryBoy.userId?.name || '');
      setValue('vehicleType', deliveryBoy.vehicleType || '');
      setIDProofUrl(deliveryBoy.IDProof || '');
      setLicenseUrl(deliveryBoy.license || '');
    }
  }, [deliveryBoy, setValue]);

  const handleDeliveryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'IDProof' | 'license'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the file object for preview
    if (type === 'IDProof') {
      setIDProofFile(file);
    } else {
      setLicenseFile(file);
    }

    setUploading(prev => ({ ...prev, [type]: true }));
    setUploadError(prev => ({ ...prev, [type]: '' }));

    try {
      const res = await dispatch(uploadDeliveryCertificate({ file, type }));
      if (uploadDeliveryCertificate.fulfilled.match(res)) {
        const url = res.payload.url;
        if (type === 'IDProof') {
          setIDProofUrl(url);
          showSuccess('ID Proof uploaded successfully');
        } else {
          setLicenseUrl(url);
          showSuccess('License uploaded successfully');
        }
      } else {
        throw new Error(res.payload || 'Upload failed');
      }
    } catch (err: any) {
      setUploadError(prev => ({ ...prev, [type]: err.message }));
      showError(`Failed to upload ${type}: ${err.message}`);
      // Clear the file if upload fails
      if (type === 'IDProof') {
        setIDProofFile(null);
      } else {
        setLicenseFile(null);
      }
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const renderFilePreview = (file: File | null, url: string, type: string) => {
    // Show preview of newly selected file (not yet uploaded)
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (isPDF(file)) {
        return (
          <div className="mt-2">
            <p className="text-sm text-gray-500">New {type} (PDF):</p>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              Preview PDF
            </a>
          </div>
        );
      } else {
        return (
          <div className="mt-2">
            <p className="text-sm text-gray-500">New {type}:</p>
            <img src={previewUrl} className="w-32 rounded border" />
          </div>
        );
      }
    }
    
    // Show existing file from server
    if (url) {
      if (isPDF(url)) {
        return (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Current {type} (PDF):</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >
              View PDF
            </a>
          </div>
        );
      } else {
        return (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Current {type}:</p>
            <img src={url} className="w-32 rounded border" />
          </div>
        );
      }
    }
    
    return null;
  };

  const onSubmit = async (data: FormDataType) => {
    if (uploading.IDProof || uploading.license) {
      showError('Please wait for uploads to finish');
      return;
    }

    if (uploadError.IDProof || uploadError.license) {
      showError('Please fix upload errors before submitting');
      return;
    }

    try {
      const formData = {
        ...data,
        IDProof: IDProofUrl,
        license: licenseUrl,
      };

      const result = await dispatch(updateDeliveryBoy(formData));
      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess('Profile updated successfully');
        await dispatch(getDeliveryBoy());
        onClose();
      } else {
        throw new Error('Profile update failed');
      }
    } catch (err: any) {
      showError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 pb-20 rounded h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-center mb-6">Update Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            {...register('name')}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium">Vehicle Type</label>
          <select {...register('vehicleType')} className="w-full border rounded px-3 py-2">
            <option value="">Select Vehicle Type</option>
            <option value="Two">Two Wheeler</option>
            <option value="Three">Three Wheeler</option>
            <option value="Four">Four Wheeler</option>
          </select>
          {errors.vehicleType && (
            <p className="text-red-500 text-sm">{errors.vehicleType.message}</p>
          )}
        </div>

        {/* ID Proof Upload */}
        <div>
          <label className="block font-medium mb-1">ID Proof</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => handleDeliveryUpload(e, 'IDProof')}
            disabled={uploading.IDProof}
          />
          {uploading.IDProof && <p className="text-blue-500 text-sm">Uploading...</p>}
          {uploadError.IDProof && <p className="text-red-500 text-sm">{uploadError.IDProof}</p>}
          {renderFilePreview(IDProofFile, IDProofUrl, 'ID Proof')}
        </div>

        {/* License Upload */}
        <div>
          <label className="block font-medium mb-1">License</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => handleDeliveryUpload(e, 'license')}
            disabled={uploading.license}
          />
          {uploading.license && <p className="text-blue-500 text-sm">Uploading...</p>}
          {uploadError.license && <p className="text-red-500 text-sm">{uploadError.license}</p>}
          {renderFilePreview(licenseFile, licenseUrl, 'License')}
        </div>

        <button
          type="submit"
          className="bg-red-600 text-white py-2 px-4 rounded w-full hover:bg-red-700 disabled:opacity-50"
          disabled={uploading.IDProof || uploading.license}
        >
          {uploading.IDProof || uploading.license ? 'Processing...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default DeliveryBoyEditProfile;