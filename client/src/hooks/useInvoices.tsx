import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { Cookies } from 'react-cookie'
import DOMPurify from 'dompurify'

import axiosConfig from '../utils/axiosConfig'

export default function useInvoices() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const cookies = new Cookies()

  const mutation = useMutation(async () => {
    try {
      const response = await axiosConfig.get('/invoices')
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error?.response?.data?.message || 'Failed to fetch invoices'
        throw new Error(message)
      } else {
        throw error
      }
    }
  })
}
