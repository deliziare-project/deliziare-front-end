import * as yup from 'yup';

export const chefRegisterSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup
    .string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  experience: yup
    .number()
    .typeError('Experience must be a number')
    .required('Experience is required'),
  specializations: yup
    .array()
    .of(yup.string().required())
    .min(1, 'At least one specialization is required'),
  certificate: yup
    .mixed()
    .required('Certificate is required')
    .test('fileExists', 'Certificate is required', (value) => value instanceof File),
});
