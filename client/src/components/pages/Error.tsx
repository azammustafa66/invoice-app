import { Box, Typography, Container, Button } from '@mui/material'

export default function Error() {
  return (
    <Container
      maxWidth='md'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}
    >
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant='h4' component='h1' gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant='body1'>The page you are looking for doesn't exist.</Typography>
        <Button variant='contained' href='/'>
          Go Back Home
        </Button>
      </Box>
    </Container>
  )
}
