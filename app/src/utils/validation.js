import * as Yup from 'yup'

export const LoginSchema = Yup.object().shape({
  username: Yup.string().min(2, 'Too Short!').required('Required'),
  password: Yup.string().required('Required'),
})

export const RegisterSchema = Yup.object().shape({
  username: Yup.string().min(2, 'Too Short!').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Password is required'),
  passwordConfirmation: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
})
