import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { AppDispatch } from '@/redux/store';
import axiosInstance from '@/api/axiosInstance';
import { checkCurrentUser } from '@/features/authSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface SetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PasswordFormData {
  password: string;
  confirmPassword: string;
}



const schema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});


const SetPasswordModal: React.FC<SetPasswordModalProps> = ({ isOpen, onClose }) => {
  const dispatch: AppDispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await axiosInstance.post(
        '/users/set-password',
        { newPassword: data.password },
        { withCredentials: true }
      );

      await dispatch(checkCurrentUser());
      reset();
      onClose();
    } catch (err) {
      console.error('Set password failed:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">Set Your Password</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded-md"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-md"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-black">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#d94f30] text-white px-4 py-2 rounded hover:bg-[#a05f2a]"
            >
              Set Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordModal;
