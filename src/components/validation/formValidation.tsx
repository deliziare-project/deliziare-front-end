import * as Yup from 'yup';

export const registerValidationSchema = Yup.object().shape({
 name: Yup.string()
  .required('Name is required.')
  .min(3, 'Name must be at least 3 characters long.')
  .matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces.'),

  email: Yup.string()
    .required('Email is required.')
    .email('Invalid email address.'),

  phone: Yup.number()
  .typeError('Phone number must be a number.')
  .required('Phone number is required.')
  .integer('Phone number must be an integer.')
  .test(
    'len',
    'Phone number must be exactly 10 digits.',
    (val) => val !== undefined && val.toString().length === 10
  ),

 password: Yup.string()
  .required('Password is required.')
  .min(8, 'Password must be at least 8 characters long.')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .matches(/[0-9]/, 'Password must contain at least one number.')
  .matches(/[@$!%*?&]/, 'Password must contain at least one special character (@, $, !, %, *, ?, &).'),

});





export const chefValidation = Yup.object().shape({
  userId: Yup.string()
    .required('User ID is required.'),

  location: Yup.object().shape({
    lat: Yup.number()
      .typeError('Latitude must be a number.')
      .required('Latitude is required.'),
    lng: Yup.number()
      .typeError('Longitude must be a number.')
      .required('Longitude is required.'),
  }).required(),

  experience: Yup.string()
    .max(100, 'Experience description is too long.')
    .notRequired(),

  specialize: Yup.array()
    .of(
      Yup.string()
        .min(2, 'Specialization must be at least 2 characters.')
        .max(30, 'Specialization must be at most 30 characters.')
    )
    .min(1, 'Please add at least one specialization.')
    .required('Specializations are required.'),

  certificate: Yup.string()
    .required('Certificate is required.'),
});

