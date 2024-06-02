import { useEffect, useState } from 'react'
import { Cookies } from 'react-cookie'

import axiosConfig from '../utils/axiosConfig'

/* 
* CSRF token hook to handle CSRF token
* @returns {string} - CSRF token
*/

export default function useCSRFToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const cookies = new Cookies()

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axiosConfig.get('/auth/get-csrf-token')
        const newToken = response.data['csrf_token']
        setCsrfToken(newToken)
        cookies.set('csrftoken', newToken)
      } catch (error) {
        console.error('Error fetching CSRF token:', error)
      }
    }

    // Check if token already exists in a cookie
    const existingToken = cookies.get('csrftoken')
    if (!existingToken) {
      fetchCsrfToken()
    } else {
      setCsrfToken(existingToken)
    }
  }, [])

  return csrfToken
}
