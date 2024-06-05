import { Link } from 'react-router-dom'
import { Box, Container, Typography, Button, useTheme } from '@mui/material'
import { format } from 'date-fns'

import useInvoices from '../hooks/useInvoices'
import { StatusColorsAndBackground } from '../utils/constants'
import { Invoice } from '../utils/types'

interface InvoicesProps {
  invoices: Invoice[]
}

export default function Invoices({ invoices }: InvoicesProps) {
  const theme = useTheme().palette.mode
  const { isLoading, isError, error } = useInvoices()

  return (
    <Container sx={{ marginTop: '2rem' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          backgroundColor: `${theme === 'dark' ? '#1E2139' : '#f9f9f9'}`
        }}
      >
        {isLoading ? (
          <Typography variant='body1' sx={{ textAlign: 'center', color: '#888' }}>
            Loading invoices...
          </Typography>
        ) : isError ? (
          <Typography variant='body1' sx={{ textAlign: 'center', color: 'red' }}>
            Error: {error?.message}
          </Typography>
        ) : invoices.length > 0 ? (
          invoices.map((invoice) => (
            <Link
              key={invoice._id}
              to={`/invoice/${invoice._id}`}
              style={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  padding: 2,
                  borderRadius: 2,
                  transition: 'background-color 0.3s, transform 0.3s',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  backgroundColor: theme === 'dark' ? '#141625' : '#FFFFFF', // Added background color based on theme
                  color: theme === 'dark' ? '#FFFFFF' : '#0C0E16', // Added text color based on theme
                  '&:hover': {
                    backgroundColor: `${theme === 'dark' ? '#252945' : '#F8F8FB'}`,
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography
                    variant='h6'
                    sx={{ fontWeight: 'bold', color: theme === 'dark' ? '#FFFFFF' : '#0C0E16' }}
                  >
                    {/* Added text color based on theme */}
                    {invoice._id}
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
                      width: '75px',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: StatusColorsAndBackground[invoice.status]
                      }
                    }}
                  >
                    {invoice.status}
                  </Button>
                </Box>
                <Typography
                  variant='body2'
                  sx={{ marginTop: '0.5rem', color: theme === 'dark' ? '#DFE3FA' : '#373B53' }}
                >
                  {' '}
                  {/* Added text color based on theme */}
                  Due: {format(new Date(invoice.paymentDue), 'dd MMM yyyy')}
                </Typography>
                <Typography
                  variant='body1'
                  sx={{ marginTop: '0.5rem', color: theme === 'dark' ? '#DFE3FA' : '#373B53' }}
                >
                  {/* Added text color based on theme */}
                  {invoice.client.name}
                </Typography>
                <Typography
                  variant='h6'
                  sx={{
                    fontWeight: 'bold',
                    marginTop: '0.5rem',
                    color: theme === 'dark' ? '#FFFFFF' : '#0C0E16'
                  }}
                >
                  {/* Added text color based on theme */}
                  Total: ${invoice.totalAmount.toFixed(2)}
                </Typography>
              </Box>
            </Link>
          ))
        ) : (
          <Typography
            sx={{
              fontSize: '16px',
              color: '#888EB0', // You might want to adjust this color for dark mode
              fontWeight: '500',
              lineHeight: '1.5',
              letterSpacing: '-0.1px',
              textAlign: 'center'
            }}
            variant='body1'
          >
            No invoices
          </Typography>
        )}
      </Box>
    </Container>
  )
}
