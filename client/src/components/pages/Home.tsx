import { Box, Typography, Container, Button, Stack } from '@mui/material'

export default function InvoiceLanding() {
  return (
    <Box
      sx={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth='md'>
        <Stack spacing={2} alignItems='center'>
          <Typography variant='h4' component='h1' align='center' gutterBottom>
            Simplify Your Invoicing
          </Typography>
          <Typography variant='body1' align='center'>
            Invoicy helps you create, track, and manage invoices effortlessly.
          </Typography>
          <Button variant='contained' href='/login'>
            Get Started
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}
