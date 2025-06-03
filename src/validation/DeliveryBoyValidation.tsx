import * as yup from 'yup';


type FileValue = FileList | null ;

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
    .mixed<FileList>() // Use FileList directly
    .required('ID Proof is required')
    .test('fileSize', 'File is too large', (value) => {
      if (!value || value.length === 0) return false;
      const file = value[0];
      return file.size <= 5000000;
    })
    .test('fileType', 'Unsupported file format', (value) => {
      if (!value || value.length === 0) return false;
      const file = value[0];
      return ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
    }),
  license: yup
    .mixed<FileList>()
    .required('License is required')
    .test('fileSize', 'File is too large', (value) => {
      if (!value || value.length === 0) return false;
      const file = value[0];
      return file.size <= 5000000; // 5MB limit
    })
    .test('fileType', 'Unsupported file format', (value) => {
      if (!value || value.length === 0) return false;
      const file = value[0];
      return ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
    }),
});