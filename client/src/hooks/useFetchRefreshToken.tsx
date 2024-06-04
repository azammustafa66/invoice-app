import { useEffect } from 'react'
import { Cookies } from 'react-cookie'
import { useQueryClient, useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

import axiosConfig from '../utils/axiosConfig'
import { cookieOptions } from '../utils/data'

export default function useFetchRefreshToken() {
  const cookies = new Cookies()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const refreshToken = cookies.get('refreshToken')

  const refreshAccessToken = async () => {
    if (!refreshToken) {
      navigate('/login')
      return
    }
    const response = await axiosConfig.post('/auth/refresh-token', { refreshToken })
    const { accessToken, refreshToken: newRefreshToken, csrfToken } = response.data
    cookies.set('accessToken', accessToken, cookieOptions)
    cookies.set('refreshToken', newRefreshToken, cookieOptions)
    cookies.set('csrfToken', csrfToken, cookieOptions)
  }

  const {
    mutate,
    isLoading: isTokenRefreshing,
    isError: isTokenRefreshError
  } = useMutation(refreshAccessToken, {
    onSuccess: () => {
      queryClient.invalidateQueries('protectedData')
    },
    onError: (error: Error) => {
      console.error('Error refreshing token:', error)
      navigate('/login')
    }
  })

  useEffect(() => {
    if (!refreshToken) {
      navigate('/login')
      return
    }

    mutate()

    const interval = setInterval(
      () => {
        mutate()
      },
      28 * 60 * 1000
    )

    return () => clearInterval(interval)
  }, [refreshToken, mutate, isTokenRefreshError, navigate])

  return { isTokenRefreshing, isTokenRefreshError }
}
