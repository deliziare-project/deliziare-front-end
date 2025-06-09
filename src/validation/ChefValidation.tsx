import { ChefFormInputs } from '@/components/auth/ChefRegister';
import * as yup from 'yup';
import { ObjectSchema } from 'yup';


export const chefRegisterSchema: ObjectSchema<ChefFormInputs> = yup.object({
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
    .of(
      yup.object({
        value: yup.string().required('Specialization is required'),
      })
    )
    .min(1, 'At least one specialization is required')
    .required('Specializations are required'),
    certificate: yup
  .mixed<File>()
  .nullable()
  .required('Certificate is required')
  .test('fileExists', 'Certificate is required', (value) => value instanceof File),

  
});
