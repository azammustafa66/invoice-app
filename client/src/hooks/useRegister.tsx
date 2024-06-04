import { useState } from 'react'
import { useMutation } from 'react-query'
import { Cookies } from 'react-cookie'
import axios from 'axios'
import DOMPurify from 'dompurify'

import axiosConfig from '../utils/axiosConfig'
import { useStore } from '../utils/store'
import { RegisterFormData } from '../utils/types'
import { cookieOptions } from '../utils/data'

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
  const { setUser } = useStore()

  const mutation = useMutation(
    async (data: RegisterFormData) => {
      try {
        const response = await axiosConfig.post('/auth/register', data)
        return response.data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error?.response?.data?.message || 'Registration failed'
          const cleanMessage = DOMPurify.sanitize(message)
          throw new Error(cleanMessage)
        } else {
          throw error
        }
      }
    },
    {
      onSuccess: (response) => {
        const { csrfToken, user, accessToken, refreshToken } = response
        setUser(user)
        cookies.set('csrfToken', csrfToken, cookieOptions)
        cookies.set('accessToken', accessToken, cookieOptions)
        cookies.set('refreshToken', refreshToken, cookieOptions)
        setSuccessMessage('Logged in successfully')
        setTimeout(() => {
          window.location.href = '/invoices'
        }, 500)
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
