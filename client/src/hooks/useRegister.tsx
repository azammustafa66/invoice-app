import { useState } from 'react'
import { useMutation } from 'react-query'
import axios from 'axios'
import { Cookies } from 'react-cookie'
import DOMPurify from 'dompurify'

import axiosConfig from '../utils/axiosConfig'
import { RegisterFormData } from '../utils/types'
import { CookieOptions } from '../utils/types'

/*
 * Register hook to handle user registration
 * @returns {object} - mutation, errorMessage, successMessage, onSubmit
 * mutation - react-query useMutation object
 * errorMessage - error message
 * successMessage - success message
 * onSubmit - function to handle form submission
 */

export default function useRegister() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const cookies = new Cookies()

  const mutation = useMutation(
    async (data: RegisterFormData) => {
      try {
        const response = await axiosConfig.post('/auth/register', data)
        return response.data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error?.response?.data?.detail || 'Registration failed'
          const cleanMessage = DOMPurify.sanitize(message)
          throw new Error(cleanMessage)
        } else {
          throw error
        }
      }
    },
    {
      onSuccess: (response) => {
        const { access_token, refresh_token, user } = response

        // Securely set cookies in production mode
        const cookieOptions: CookieOptions = { path: '/' }
        if ((import.meta.env.VITE_PRODUCTION_MODE as string) === 'true') {
          cookieOptions.httpOnly = true
          cookieOptions.secure = true
          cookieOptions.sameSite = 'strict'
        }

        cookies.set('access_token', access_token, cookieOptions)
        cookies.set('refresh_token', refresh_token, cookieOptions)
        cookies.set('user', JSON.stringify(user), cookieOptions)

        setSuccessMessage('Registered successfully')
        setTimeout(() => {
          window.location.href = '/invoices'
        }, 1500)
      },
      onError: (error: Error) => {
        setErrorMessage(error.message)
      }
    }
  )
  const onSubmit = (data: RegisterFormData) => {
    setErrorMessage(null)
    setSuccessMessage(null)
    const sanitizedData = {
      name: DOMPurify.sanitize(data.name),
      email: DOMPurify.sanitize(data.email),
      password: DOMPurify.sanitize(data.password),
      confirmPassword: DOMPurify.sanitize(data.confirmPassword)
    }
    mutation.mutate(sanitizedData)
  }

  return {
    mutation,
    errorMessage,
    successMessage,
    onSubmit
  }
}
