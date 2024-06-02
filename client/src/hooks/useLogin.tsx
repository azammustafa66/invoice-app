import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { Cookies } from 'react-cookie'
import DOMPurify from 'dompurify'

import axiosConfig from '../utils/axiosConfig'
import { LoginFormData, CookieOptions } from '../utils/types'

/*
 * Login hook to handle user registration
 * @returns {object} - mutation, errorMessage, successMessage, onSubmit
 * mutation - react-query useMutation object
 * errorMessage - error message
 * successMessage - success message
 * onSubmit - function to handle form submission
 */

export default function useLogin() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const cookies = new Cookies()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (data: LoginFormData) => {
      try {
        const response = await axiosConfig.post('/auth/login', data)
        return response.data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error?.response?.data || 'Login failed'
          const cleanMessage = DOMPurify.sanitize(message)
          throw new Error(cleanMessage)
        } else {
          throw error
        }
      }
    },
    {
      onSuccess: (response) => {
        const { access: access_token, refresh: refresh_token, user } = response

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

        setSuccessMessage('Logged in successfully')
        setTimeout(() => {
          window.location.href = '/invoices'
        }, 1500)
        queryClient.invalidateQueries('user')
      },
      onError: (error: Error) => {
        console.log('Error logging in: ', error)
        const message = error.message || 'An error occurred'
        setErrorMessage(message)
      }
    }
  )

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      const sanitizedData = {
        username: DOMPurify.sanitize(data.username),
        password: DOMPurify.sanitize(data.password)
      }
      await mutation.mutateAsync(sanitizedData)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('An unexpected error occurred.')
      }
    }
  }

  return {
    mutation,
    onSubmit,
    errorMessage,
    successMessage
  }
}
