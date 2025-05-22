import * as yup from 'yup';

export const deliveryBoySchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup
      .string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  vehicleType: yup.string().oneOf(['two', 'three', 'four'], 'Select a valid vehicle type'),
  IDProof: yup
  .mixed()
  .required('ID Proof is required')
  .test('fileExists', 'ID Proof is required', (value) => {
    return value && value.length > 0;
  }),

license: yup
  .mixed()
  .required('License is required')
  .test('fileExists', 'License is required', (value) => {
    return value && value.length > 0;
  }),

});
