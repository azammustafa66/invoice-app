import * as yup from 'yup'

export const loginValidationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required')
})

export const registerValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required')
})

export const invoiceValidationSchema = yup.object().shape({
  senderAddress: yup.object().shape({
    street: yup.string().required('Street Address is required'),
    city: yup.string().required('City is required'),
    postCode: yup.string().required('Postal Code is required'),
    country: yup.string().required('Country is required')
  }),

  clientAddress: yup.object().shape({
    street: yup.string().required('Street Address is required'),
    city: yup.string().required('City is required'),
    postCode: yup.string().required('Postal Code is required'),
    country: yup.string().required('Country is required')
  }),

  clientName: yup.string().required('Client Name is required'),
  clientEmail: yup.string().email('Invalid email').required('Client Email is required'),
  createdAt: yup.string().required('Invoice Date is required'),
  paymentDue: yup.string().required('Payment Due Date is required'),
  projectDescription: yup.string().required('Project Description is required'),

  items: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Item Name is required'),
      quantity: yup.number().positive().integer().required('Quantity is required'),
      price: yup.number().positive().required('Price is required'),
      total: yup.number().positive().required('Total is required')
    })
  )
})