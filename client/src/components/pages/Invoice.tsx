import { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Container, Drawer, Stack, Typography } from '@mui/material'
import { Link, useParams } from 'react-router-dom'

import { StatusColorsAndBackground, mockData } from '../../utils/data'
import { PrimaryTypography, SecondaryTypography } from '../../utils/custom/elements'
import ConfirmationDialog from '../Dialog'
import Form from '../Form'
import { useStore } from '../../zustand/store'
import axiosConfig from '../../utils/axiosConfig'
import { useMutation } from 'react-query'
import { Invoice as InvoiceType } from '../../utils/types'
import { set } from 'date-fns'

export default function Invoice() {
  const { id: invoiceId } = useParams<{ id: string }>()

  const { isFormOpen, setFormOpen } = useStore()

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showMarkAsPaidDialog, setShowMarkAsPaidDialog] = useState(false)
  const [invoice, setInvoice] = useState<InvoiceType | null>(null)

  const mutation = useMutation(
    'invoice',
    async () => {
      const response = await axiosConfig.get(`/invoices/${invoiceId}`)
      setInvoice(response.data)
      return response.data
    },
    {
      onSuccess: (data: InvoiceType) => {
        console.log('Fetched invoice:', data)
      },
      onError: (error: Error) => {
        console.error('Error fetching invoice:', error)
      }
    }
  )

  useEffect(() => {
    mutation.mutate()
  }, [])

  if (mutation.isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (mutation.isError) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant='h5' color='error'>
          An error occurred while fetching the invoice
        </Typography>
      </Container>
    )
  }

  if (!invoice) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant='h5' color='error'>
          Invoice does not exist
        </Typography>
      </Container>
    )
  }

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '2rem'
      }}
    >
      <Box>
        <Link to={'/invoices'}>
          <SecondaryTypography
            sx={{
              letterSpacing: '-0.25px',
              color: '#7C5DFA',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            &lt; Go back
          </SecondaryTypography>
        </Link>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#1E2139',
          padding: '20px',
          borderRadius: '8px'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#6E7E91'
            }}
          >
            Status
          </Typography>
          <Button
            variant='contained'
            disableElevation
            sx={{
              backgroundColor: StatusColorsAndBackground[invoice.status],
              color: 'white',
              textTransform: 'none',
              borderRadius: '5px',
              padding: '5px 10px',
              minWidth: '75px',
              '&:hover': {
                backgroundColor: StatusColorsAndBackground[invoice.status],
                opacity: 0.8
              }
            }}
          >
            {invoice.status}
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            variant='outlined'
            sx={{
              backgroundColor: '#252945',
              color: '#fff',
              borderRadius: '24px',
              padding: '5px 10px'
            }}
            onClick={() => setFormOpen(true)}
          >
            Edit
          </Button>
          <Drawer anchor='left' open={isFormOpen} onClose={() => setFormOpen(false)}>
            <Form isNew={false} invoiceId={invoiceId!} />
          </Drawer>
          <Button
            variant='outlined'
            sx={{
              backgroundColor: '#EC5757',
              color: '#fff',
              borderRadius: '24px',
              padding: '5px 10px'
            }}
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>
          {invoice.status !== 'paid' && invoice.status !== 'draft' && (
            <Button
              variant='outlined'
              sx={{
                backgroundColor: '#7C5DFA',
                color: '#fff',
                borderRadius: '24px',
                padding: '5px 10px'
              }}
              onClick={() => {
                setShowMarkAsPaidDialog(true)
              }}
            >
              Mark as Paid
            </Button>
          )}

          {/* Confirmation Dialogs */}
          <ConfirmationDialog
            open={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={() => {
              // Delete logic here
              console.log('Deleting invoice:', invoice._id)
            }}
            title='Delete Invoice?'
            content='Are you sure you want to delete this invoice? This action cannot be undone.'
            confirmButtonText='Delete'
            confirmButtonColor='error' // Set color for delete button
          />

          <ConfirmationDialog
            open={showMarkAsPaidDialog}
            onClose={() => setShowMarkAsPaidDialog(false)}
            onConfirm={() => {
              // Mark as paid logic here
              console.log('Marking invoice as paid:', invoice._id)
            }}
            title='Mark as Paid?'
            content='Are you sure you want to mark this invoice as paid?'
            confirmButtonText='Mark as Paid'
            confirmButtonColor='success'
          />

          {invoice.status === 'draft' && (
            <Button
              variant='outlined'
              sx={{
                backgroundColor: '#7C5DFA',
                color: '#fff',
                borderRadius: '24px',
                padding: '5px 10px'
              }}
              onClick={() => {
                // Add it to DB
              }}
            >
              Save as New Invoice
            </Button>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '25px',
          padding: '20px',
          backgroundColor: '#1E2139',
          borderRadius: '8px'
        }}
      >
        {/* Invoice Id and address */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '2rem',
            padding: '1rem 3rem'
          }}
        >
          <Box>
            <SecondaryTypography
              sx={{
                fontSize: '15px',
                fontWeight: 700
              }}
            >
              <span style={{ color: '#888EB0' }}>#</span>
              {invoice._id}
            </SecondaryTypography>
            <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#888EB0' }}>{}</Typography>
          </Box>
          <Stack sx={{ maxWidth: '150px' }}>
            <SecondaryTypography color={'#DFE3FA'}>
              {invoice.senderAddress?.street}{' '}
            </SecondaryTypography>
            <SecondaryTypography color={'#DFE3FA'}>
              {invoice.senderAddress?.city},
            </SecondaryTypography>
            <SecondaryTypography color={'#DFE3FA'}>
              {invoice.senderAddress?.country},
            </SecondaryTypography>
            <SecondaryTypography color={'#DFE3FA'}>
              {invoice.senderAddress?.postCode}
            </SecondaryTypography>
          </Stack>
        </Box>

        {/* Invoice date, client address and email */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            maxWidth: '70%',
            padding: '1rem 3rem'
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#888EB0' }}>
                Invoice Date
              </Typography>
              <SecondaryTypography>{invoice.createdAt}</SecondaryTypography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#888EB0' }}>
                Payment Due
              </Typography>
              <SecondaryTypography>{invoice.paymentDue}</SecondaryTypography>
            </Box>
          </Stack>

          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#888EB0' }}>
                Bill To
              </Typography>
              <SecondaryTypography>{invoice.client?.name}</SecondaryTypography>
            </Box>
            <Box>
              <SecondaryTypography sx={{ fontSize: '13px', fontWeight: 500, color: '#888EB0' }}>
                {invoice.clientAddress?.street}
              </SecondaryTypography>
              <SecondaryTypography sx={{ fontSize: '13px', fontWeight: 500, color: '#888EB0' }}>
                {invoice.clientAddress?.city},
              </SecondaryTypography>
              <SecondaryTypography sx={{ fontSize: '13px', fontWeight: 500, color: '#888EB0' }}>
                {invoice.clientAddress?.country},
              </SecondaryTypography>
              <SecondaryTypography sx={{ fontSize: '13px', fontWeight: 500, color: '#888EB0' }}>
                {invoice.clientAddress?.postCode}
              </SecondaryTypography>
            </Box>
          </Stack>

          <Stack spacing={2}>
            <Box>
              <SecondaryTypography sx={{ fontSize: '13px', fontWeight: 500, color: '#888EB0' }}>
                Sent to
              </SecondaryTypography>
              <SecondaryTypography>{invoice.client?.email}</SecondaryTypography>
            </Box>
          </Stack>
        </Box>

        {/* Items */}
        <Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '3fr 1fr 1fr 1fr',
              gap: '1.25rem',
              padding: '1rem 3rem'
            }}
          >
            <SecondaryTypography
              sx={{ fontSize: '13px', fontWeight: 500, color: '#888EB0', lineHeight: '18px' }}
            >
              Item Name
            </SecondaryTypography>
            <SecondaryTypography
              sx={{ fontSize: '13px', fontWeight: 500, color: '#888EB0', lineHeight: '18px' }}
            >
              QTY.
            </SecondaryTypography>
            <SecondaryTypography
              sx={{ fontSize: '13px', fontWeight: 500, color: '#888EB0', lineHeight: '18px' }}
            >
              Price
            </SecondaryTypography>
            <SecondaryTypography
              sx={{ fontSize: '13px', fontWeight: 500, color: '#888EB0', lineHeight: '18px' }}
            >
              Total
            </SecondaryTypography>
          </Box>
          {invoice.invoiceItems?.map((item) => (
            <Box
              key={item.name}
              sx={{
                display: 'grid',
                gridTemplateColumns: '3fr 1fr 1fr 1fr',
                gap: '1rem',
                padding: '1rem 3rem'
              }}
            >
              <SecondaryTypography>{item.name}</SecondaryTypography>
              <SecondaryTypography>{item.quantity}</SecondaryTypography>
              <SecondaryTypography>{item.price}</SecondaryTypography>
              <SecondaryTypography>{item.total}</SecondaryTypography>
            </Box>
          ))}
        </Box>

        {/* Total */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '5fr 1fr',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 3rem',
            backgroundColor: '#0C0E16'
          }}
        >
          <PrimaryTypography>Amount Due</PrimaryTypography>
          <Typography
            sx={{ fontSize: '24px', fontWeight: 700, lineHeight: '32px', letterSpacing: '-0.5px' }}
          >
            ${invoice.totalAmount}
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}
