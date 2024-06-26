import { useState } from 'react'
import axios from 'axios'
import DOMPurify from 'dompurify'
import { Cookies } from 'react-cookie'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

import axiosConfig from '../utils/axiosConfig'
import { useStore } from '../zustand/store'
import { LoginFormData } from '../utils/types'
import { cookieOptions } from '../utils/constants'

export default function useLogin() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const cookies = new Cookies()
  const navigate = useNavigate()
  const { setUser, setIsAuthenticated } = useStore()

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
        setIsAuthenticated(true)
        setUser(user)
        cookies.set('csrfToken', csrfToken, cookieOptions)
        cookies.set('accessToken', accessToken, cookieOptions)
        cookies.set('refreshToken', refreshToken, cookieOptions)
        setSuccessMessage('Logged in successfully')
        setTimeout(() => {
          navigate('/invoices')
        }, 1500)
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
