import { useState } from 'react'
import axios from 'axios'
import DOMPurify from 'dompurify'
import { Cookies } from 'react-cookie'
import { useMutation } from 'react-query'

import axiosConfig from '../utils/axiosConfig'
import { useStore } from '../utils/store'
import { LoginFormData } from '../utils/types'
import { cookieOptions } from '../utils/data'

export default function useLogin() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const cookies = new Cookies()
  const { setUser } = useStore()

  const mutation = useMutation(
    async (data: LoginFormData) => {
      try {
        const response = await axiosConfig.post('/auth/login', data)
        return response.data
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error?.response?.data?.message || 'An error occurred'
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

  const onSubmit = (data: LoginFormData) => {
    setErrorMessage(null)
    setSuccessMessage(null)
    const sanitizedData = {
      email: DOMPurify.sanitize(data.email),
      password: DOMPurify.sanitize(data.password)
    }
    mutation.mutate(sanitizedData)
  }

  return { mutation, errorMessage, successMessage, onSubmit }
}
