import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import axios from 'axios'

import axiosConfig from '../utils/axiosConfig'
import { Invoice } from '../utils/types'
import { toast } from 'react-toastify'
import { useStore } from '../zustand/store'

export default function useInvoices() {
  const queryClient = useQueryClient()
  const { setInvoices, isAuthenticated } = useStore() // Get user data from the store
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    isLoading,
    isError,
    error,
    data: invoices,
    refetch
  } = useQuery(
    ['invoices'],
    async () => {
      const response = await axiosConfig.get('/invoices/invoices')
      console.log(response.data);
      return response.data?.invoices
    },
    {
      enabled: !!isAuthenticated,
      onError: (error: Error) => {
        if (axios.isAxiosError(error)) {
          const message = error?.response?.data?.message || 'Failed to fetch invoices'
          setErrorMessage(message)
        } else {
          setErrorMessage('An unexpected error occurred.')
        }
      },
      onSuccess: (invoices: Invoice[]) => {
        setSuccessMessage('Invoices fetched successfully')
        setInvoices(invoices)
      }
    }
  )

  // Mutation for updating/adding/deleting invoices
  const mutation = useMutation(
    async ({ invoice, type }: { invoice: Invoice, type: 'add' | 'update' | 'delete' }) => {
      if (type === 'add') {
        return axiosConfig.post('/invoices/create', invoice)
      } else if (type === 'update') {
        return axiosConfig.put(`/invoices/update/${invoice._id}`, invoice)
      } else if (type === 'delete') {
        return axiosConfig.delete(`/invoices/delete/${invoice._id}`)
      } else {
        throw new Error('Invalid operation')
      }
    },
    {
      onMutate: async (newInvoice) => {
        await queryClient.cancelQueries(['invoices'])

        const previousInvoices = queryClient.getQueryData(['invoices'])
        queryClient.setQueryData(['invoices'], (old: Invoice[] | undefined) => {
          if (newInvoice.type === 'add') {
            return [...(old || []), newInvoice.invoice]
          } else if (newInvoice.type === 'update') {
            return (old || []).map((invoice: Invoice) =>
              invoice._id === newInvoice.invoice._id ? newInvoice.invoice : invoice
            )
          } else if (newInvoice.type === 'delete') {
            return (old || []).filter((invoice: Invoice) => invoice._id !== newInvoice.invoice._id)
          }
          return old || []
        })

        return { previousInvoices }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (err, newInvoice, context: any) => {
        queryClient.setQueryData(['invoices'], context.previousInvoices)
        toast.error("Something went wrong. Couldn't perform the operation.", {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        })
      },
      onSettled: () => {
        queryClient.invalidateQueries(['invoices'])
      }
    }
  )

  return {
    invoices,
    isLoading,
    isError,
    error,
    errorMessage,
    successMessage,
    refetch,
    mutate: mutation.mutate,
    addInvoice: (invoice: Invoice) => mutation.mutate({ invoice, type: 'add' }),
    updateInvoice: (invoice: Invoice) => mutation.mutate({ invoice, type: 'update' }),
    deleteInvoice: (invoice: Invoice) => mutation.mutate({ invoice, type: 'delete' })
  }
}
