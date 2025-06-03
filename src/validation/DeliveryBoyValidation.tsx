import * as yup from 'yup';

export const deliveryBoySchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup
      .string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
vehicleType: yup
.string()
.oneOf(['two', 'three', 'four'], 'Select a valid vehicle type')
.required('Vehicle type is required'),
IDProof: yup
.mixed()
.required('ID Proof is required')
.test('fileExists', 'ID Proof is required', (value) => {
  if (!value) return false;
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (value instanceof File) {
    return true;
  }
  return false;
}),

license: yup
.mixed()
.required('License is required')
.test('fileExists', 'License is required', (value) => {
  if (!value) return false;
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (value instanceof File) {
    return true;
  }
  return false;
}),


});
